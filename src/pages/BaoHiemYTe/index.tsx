import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import ModalExpandable from '@/components/Table/ModalExpandable';
import { type IColumn } from '@/components/Table/typing';
import {
	BhytPaymentStatus,
	EBhytReviewStatus,
	EDeclarationType,
	paymentStatusColor,
	paymentStatusIntlId,
	reviewStatusColor,
	reviewStatusIntlId,
} from '@/services/BaoHiemYTe/constant';
import { BaoHiemYTe } from '@/services/BaoHiemYTe/typing';
import { getPhuongXa, getTinhThanhPho } from '@/services/Core/DonViHanhChinh';
import type { DonViHanhChinh } from '@/services/Core/DonViHanhChinh/typing';
import { ETagColor } from '@/services/base/constant';
import dayjs from '@/utils/dayjs';
import { formatDate } from '@/utils/formatDate';
import { chuanHoaTen } from '@/utils/utils';
import { ClockCircleOutlined, EyeOutlined, FormOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Button, Popover, Space, Tag } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useIntl, useModel } from 'umi';
import ChoiceModal from './components/ChoiceModal';
import FormDangKy from './components/FormDangKy';
import FormMien from './components/FormMien';

type TFormType = 'dangKy' | 'mien';

interface IFormModalState {
	type: TFormType;
	record?: BaoHiemYTe.IDotDangKy;
	isView?: boolean;
	edit?: boolean;
}

const getFormTypeFromDeclaration = (declarationType?: EDeclarationType): TFormType | undefined => {
	if (declarationType === EDeclarationType.DA_CO_BEN_NGOAI || declarationType === EDeclarationType.CHUA_DANG_KY)
		return 'mien';
	if (declarationType === EDeclarationType.MUA_TRONG_TRUONG) return 'dangKy';
	return undefined;
};

const SinhVienDangKyBHYT = () => {
	const intl = useIntl();
	const t = (id: string) => intl.formatMessage({ id });
	const { page, limit, getModel, getByIdModel, danhSach } = useModel('baohiemyte.dotdangky');
	const [currentInfo, setCurrentInfo] = useState<BaoHiemYTe.IPeriodSnapshot>();
	const [choiceModalOpen, setChoiceModalOpen] = useState(false);
	const [formModal, setFormModal] = useState<IFormModalState | null>(null);
	const [tenTinhByMa, setTenTinhByMa] = useState<Record<string, string>>({});
	const [tenXaByMa, setTenXaByMa] = useState<Record<string, string>>({});
	const fetchedMaTinhRef = useRef<Set<string>>(new Set());

	const getData = () => {
		getModel(undefined, undefined, undefined, undefined, undefined, 'me/history/page');
	};

	const getCurrentInfo = async () => {
		try {
			const data = await getByIdModel('me/current', false);
			setCurrentInfo(data as unknown as BaoHiemYTe.IPeriodSnapshot);
		} catch {
			setCurrentInfo(undefined);
		}
	};

	useEffect(() => {
		void getCurrentInfo();
	}, []);

	useEffect(() => {
		getTinhThanhPho().then((data) => {
			const map: Record<string, string> = {};
			(data.data.data as DonViHanhChinh.IRecord[])?.forEach((item) => {
				map[String(item.ma)] = item.tenDonVi;
			});
			setTenTinhByMa(map);
		});
	}, []);

	// declarationSnapshot là dữ liệu tại thời điểm nộp đơn nhưng có thể thiếu field,
	// student là dữ liệu sinh viên mới nhất (đầy đủ field) dùng để bổ khuyết field còn thiếu
	const mergeStudentSnapshot = (
		declarationSnapshot?: BaoHiemYTe.IStudentRegistration,
		student?: BaoHiemYTe.IStudentRegistration,
	): BaoHiemYTe.IStudentRegistration | undefined => {
		if (!declarationSnapshot && !student) return undefined;

		const merged: BaoHiemYTe.IStudentRegistration = { ...student };
		Object.entries(declarationSnapshot ?? {}).forEach(([key, value]) => {
			if (value !== null && value !== undefined) (merged as any)[key] = value;
		});

		return merged;
	};

	const getEffectiveStudent = (rec?: BaoHiemYTe.IHistoryItem) =>
		mergeStudentSnapshot(rec?.declarationSnapshot, rec?.student);

	// Xã/phường phụ thuộc tỉnh, chỉ load thêm cho những mã tỉnh xuất hiện trong dữ liệu đang hiển thị
	useEffect(() => {
		const maTinhCanLoad = Array.from(
			new Set(
				(danhSach as BaoHiemYTe.IHistoryItem[])
					?.map((item) => getEffectiveStudent(item)?.diaChiThuongTru?.maTinh)
					.filter((ma): ma is string => !!ma && !fetchedMaTinhRef.current.has(ma)) ?? [],
			),
		);
		if (!maTinhCanLoad.length) return;

		maTinhCanLoad.forEach((ma) => fetchedMaTinhRef.current.add(ma));
		Promise.all(maTinhCanLoad.map((ma) => getPhuongXa(ma))).then((results) => {
			setTenXaByMa((prev) => {
				const next = { ...prev };
				results.forEach((res) => {
					(res.data.data as DonViHanhChinh.IRecord[])?.forEach((item) => {
						next[String(item.ma)] = item.tenDonVi;
					});
				});
				return next;
			});
		});
	}, [danhSach]);

	const refreshAll = () => {
		getData();
		void getCurrentInfo();
	};

	// Modal đăng ký mới (mở từ nút Xem đầy đủ): chỉ điền sẵn thông tin cá nhân sinh viên,
	// các thông tin khai báo khác (số BHXH, thẻ, minh chứng...) để trống cho sinh viên tự nhập
	const toNewRegistrationRecord = (snapshot?: BaoHiemYTe.IPeriodSnapshot): BaoHiemYTe.IDotDangKy | undefined => {
		if (!snapshot?.period) return undefined;

		const { fullName, studentCode, ngaySinh, cccd, nationality, gioiTinh, khoa, nganh, phone, email } =
			snapshot.student ?? {};

		return {
			...snapshot.period,
			periodId: snapshot.period._id ?? '',
			student: { fullName, studentCode, ngaySinh, cccd, nationality, gioiTinh, khoa, nganh, phone, email },
		};
	};

	const toDotDangKyRecordFromHistory = (item?: BaoHiemYTe.IHistoryItem): BaoHiemYTe.IDotDangKy | undefined => {
		if (!item?.period) return undefined;

		const effectiveStudent = getEffectiveStudent(item);

		return {
			...item.period,
			periodId: item.period._id ?? '',
			periodStudentId: item.periodStudentId,
			declarationType: item.declarationType,
			reviewStatus: item.reviewStatus,
			paymentStatus: effectiveStudent?.paymentStatus,
			student: effectiveStudent,
		};
	};

	const openForm = (type: TFormType, record?: BaoHiemYTe.IDotDangKy, opts?: { isView?: boolean; edit?: boolean }) => {
		if (!record) return;
		setFormModal({ type, record, isView: opts?.isView, edit: opts?.edit ?? !opts?.isView });
	};

	const closeFormModal = () => setFormModal(null);

	const onCell = (rec: BaoHiemYTe.IHistoryItem) => ({
		onClick: () => {
			const type = getFormTypeFromDeclaration(rec.declarationType);
			if (type) openForm(type, toDotDangKyRecordFromHistory(rec), { isView: true });
		},
		style: { cursor: 'pointer' },
	});

	const onViewFull = () => setChoiceModalOpen(true);

	const onSelectDangKy = () => {
		setChoiceModalOpen(false);
		openForm('dangKy', toNewRegistrationRecord(currentInfo), { edit: false });
	};

	const onSelectMien = () => {
		setChoiceModalOpen(false);
		openForm('mien', toNewRegistrationRecord(currentInfo), { edit: false });
	};

	const getExpiredDate = (student?: BaoHiemYTe.IStudentRegistration) =>
		student?.hanBHYTHienTai || student?.cardExpiredAt || student?.insuranceValidTo;

	// Mỗi đợt chỉ được đăng ký 1 lần, trừ trường hợp khai báo miễn bị từ chối thì cho đăng ký lại
	const canRegisterAgain = (myRegistration?: BaoHiemYTe.IMyRegistration) => {
		if (!myRegistration?._id) return true;
		const type = getFormTypeFromDeclaration(myRegistration.declarationType);
		if (type !== 'mien') return false;
		if (myRegistration.reviewStatus === EBhytReviewStatus.TU_CHOI) return true;
		return myRegistration.declarationType === EDeclarationType.CHUA_DANG_KY && !myRegistration.reviewStatus;
	};

	const renderReviewStatusTag = (
		reviewStatus?: EBhytReviewStatus | string | null,
		declarationType?: EDeclarationType,
	) => {
		const type = getFormTypeFromDeclaration(declarationType);

		if (type === 'dangKy') return <Tag color={reviewStatusColor.DA_DUYET}>{t(reviewStatusIntlId.DA_DUYET)}</Tag>;

		if (!reviewStatus) return null;

		return (
			<Tag color={reviewStatusColor[reviewStatus as EBhytReviewStatus]}>
				{t(reviewStatusIntlId[reviewStatus as EBhytReviewStatus])}
			</Tag>
		);
	};

	// Trạng thái thanh toán chỉ áp dụng cho hình thức mua BHYT qua trường (dangKy),
	// hình thức khai báo miễn (mien) không phát sinh thanh toán nên hiển thị "Không áp dụng"
	const renderPaymentStatusTag = (paymentStatus?: BhytPaymentStatus | null, declarationType?: EDeclarationType) => {
		const type = getFormTypeFromDeclaration(declarationType);

		if (type !== 'dangKy') {
			return <Tag color={ETagColor.DEFAULT}>{t('baohiemyte.dangky.trangThaiThanhToan.notApplicable')}</Tag>;
		}

		const status = paymentStatus ?? BhytPaymentStatus.CHUA_THANH_TOAN;

		return <Tag color={paymentStatusColor[status]}>{t(paymentStatusIntlId[status])}</Tag>;
	};

	const labelStyle = { color: '#8c8c8c', fontSize: 13 };

	// Chỉ hiển thị lịch sử xử lý cho hình thức khai báo miễn đã thực sự được xử lý (có thông tin người xử lý),
	// hình thức đăng ký (dangKy) không có quy trình duyệt nên không show
	const canShowLichSuXuLyMien = (rec?: BaoHiemYTe.IHistoryItem) =>
		getFormTypeFromDeclaration(rec?.declarationType) === 'mien' &&
		!!(rec?.reviewerId || rec?.reviewerName || rec?.action);

	const renderThoiGianDangKy = (start?: string, end?: string) =>
		intl.formatMessage(
			{ id: 'baohiemyte.dangky.banner.thoiGianDangKy' },
			{
				tuNgay: (
					<b key='tuNgay' style={{ color: '#0E50CF' }}>
						{start ? formatDate(start) : '--'}
					</b>
				),
				denNgay: (
					<b key='denNgay' style={{ color: '#0E50CF' }}>
						{end ? formatDate(end) : '--'}
					</b>
				),
			},
		);

	const columns: IColumn<BaoHiemYTe.IHistoryItem>[] = [
		{
			title: t('baohiemyte.dangky.soBHXH'),
			dataIndex: ['student', 'ssnNumber'],
			width: 180,
			render: (_val, rec) => getEffectiveStudent(rec)?.ssnNumber || '--',
			onCell,
		},
		{
			title: t('baohiemyte.dangky.column.thoiGian'),
			dataIndex: ['period', 'registrationStartAt'],
			width: 260,
			sortable: true,
			render: (_val, rec) => renderThoiGianDangKy(rec.period?.registrationStartAt, rec.period?.registrationEndAt),
			onCell,
		},
		{
			title: t('baohiemyte.dangky.diaChiThuongTru'),
			dataIndex: ['student', 'diaChiThuongTru'],
			width: 280,
			render: (_val, rec) => {
				const diaChi = getEffectiveStudent(rec)?.diaChiThuongTru;
				const tenTinh = diaChi?.maTinh ? (tenTinhByMa[diaChi.maTinh] ?? diaChi.maTinh) : undefined;
				const tenXa = diaChi?.maXaPhuong ? (tenXaByMa[diaChi.maXaPhuong] ?? diaChi.maXaPhuong) : undefined;
				return [diaChi?.soNhaTenDuong, tenXa, tenTinh].filter(Boolean).join(', ') || '--';
			},
			onCell,
		},
		{
			title: t('baohiemyte.dangky.column.hanSuDung'),
			dataIndex: ['student', 'hanBHYTHienTai'],
			width: 190,
			align: 'center',
			sortable: true,
			render: (_val, rec) => {
				const expiredDate = getExpiredDate(getEffectiveStudent(rec));
				return expiredDate ? formatDate(expiredDate) : '--';
			},
			onCell,
		},
		{
			title: t('baohiemyte.dangky.column.trangThai'),
			dataIndex: 'reviewStatus',
			width: 190,
			align: 'center',
			sortable: true,
			render: (_val, rec) => (
				<Space size={4}>
					{renderReviewStatusTag(rec.reviewStatus, rec.declarationType) ?? '--'}

					{canShowLichSuXuLyMien(rec) && (
						<Popover
							trigger='hover'
							placement='top'
							content={
								<div style={{ minWidth: 260, maxWidth: 320 }}>
									<div>
										<b>{t('baohiemyte.mien.nguoiPheDuyet')}:</b> {rec.reviewerName || rec.reviewerId || '--'}
									</div>
									<div>
										<b>{t('baohiemyte.mien.thoiGianDuyet')}:</b>{' '}
										{rec.createdAt ? dayjs(rec.createdAt).format('DD/MM/YYYY HH:mm') : ''}
									</div>
									<div>
										<b>{t('baohiemyte.mien.ketQua')}:</b> {rec.action || ''}
									</div>
									{rec.note && (
										<div style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>
											<b>{t('baohiemyte.mien.ghiChu')}:</b> {rec.note}
										</div>
									)}
								</div>
							}
						>
							<Button type='text' size='small' icon={<InfoCircleOutlined />} style={{ paddingInline: 4 }} />
						</Popover>
					)}
				</Space>
			),
			filterType: 'select',
			filterData: Object.values(EBhytReviewStatus).map((item) => ({
				value: item,
				label: t(reviewStatusIntlId[item]),
			})),
			fixed: 'right',
		},
		{
			title: t('baohiemyte.dangky.thaoTac'),
			width: 100,
			align: 'center',
			fixed: 'right',
			render: (_val, rec) => {
				const canEdit = rec.reviewStatus === EBhytReviewStatus.CAN_BO_SUNG;
				const type = getFormTypeFromDeclaration(rec.declarationType);

				return (
					<>
						<ButtonExtend
							onClick={() => {
								const type = getFormTypeFromDeclaration(rec.declarationType);
								if (type) openForm(type, toDotDangKyRecordFromHistory(rec), { isView: true });
							}}
							type='link'
							icon={<EyeOutlined />}
						/>
						{canEdit && type === 'mien' && (
							<ButtonExtend
								tooltip={t('global.button.chinhsua')}
								onClick={() => openForm(type, toDotDangKyRecordFromHistory(rec), { edit: true })}
								type='link'
								icon={<FormOutlined />}
							/>
						)}
					</>
				);
			},
		},
	];

	const renderBanner = () => {
		if (!currentInfo) return null;

		const hasPeriod = !!currentInfo.period?._id;
		const myRegistration = currentInfo.myRegistration;
		const canRegister = canRegisterAgain(myRegistration);
		const reviewTag = renderReviewStatusTag(myRegistration?.reviewStatus, myRegistration?.declarationType);
		const paymentTag = renderPaymentStatusTag(currentInfo.student?.paymentStatus, myRegistration?.declarationType);

		return (
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					gap: 12,
					background: '#EAF3FF',
					border: '1px solid #D6E7FF',
					borderRadius: 8,
					padding: '10px 16px',
					marginBottom: 12,
					flexWrap: 'wrap',
				}}
			>
				<Space size={8}>
					<ClockCircleOutlined style={{ color: '#0E50CF', fontSize: 16 }} />
					<span>
						{hasPeriod
							? renderThoiGianDangKy(currentInfo.period?.registrationStartAt, currentInfo.period?.registrationEndAt)
							: currentInfo.message || t('baohiemyte.dangky.banner.khongCoDot')}
					</span>
				</Space>

				{hasPeriod ? (
					canRegister ? (
						<Button type='primary' onClick={onViewFull}>
							{t('baohiemyte.dangky.banner.xemDayDu')}
						</Button>
					) : (
						<Space size={16}>
							{reviewTag && (
								<Space size={6}>
									<span style={labelStyle}>{t('baohiemyte.dangky.banner.duyet')}:</span>
									{reviewTag}
								</Space>
							)}
							{paymentTag && (
								<Space size={6}>
									<span style={labelStyle}>{t('baohiemyte.dangky.banner.thanhToan')}:</span>
									{paymentTag}
								</Space>
							)}
						</Space>
					)
				) : null}
			</div>
		);
	};

	const formModalTitle = formModal
		? intl.formatMessage(
				{
					id: formModal.isView
						? 'global.table.form.title.chitiet'
						: formModal.edit
							? 'global.table.form.title.chinhsua'
							: 'global.table.form.title.themmoi',
				},
				{ title: chuanHoaTen(t('baohiemyte.dangky.title').toLowerCase()) },
			)
		: undefined;

	return (
		<TableBase<BaoHiemYTe.IHistoryItem>
			getData={refreshAll}
			columns={columns}
			dependencies={[page, limit]}
			modelName='baohiemyte.dotdangky'
			title={t('baohiemyte.dangky.title')}
			buttons={{ create: false }}
			addStt
		>
			{renderBanner()}

			<ChoiceModal
				open={choiceModalOpen}
				onClose={() => setChoiceModalOpen(false)}
				onSelectDangKy={onSelectDangKy}
				onSelectMien={onSelectMien}
			/>

			<ModalExpandable
				title={formModalTitle}
				width={1000}
				open={!!formModal}
				onCancel={closeFormModal}
				footer={null}
				destroyOnClose
			>
				{formModal?.type === 'dangKy' ? (
					<FormDangKy
						record={formModal.record}
						isView={formModal.isView}
						edit={formModal.edit}
						onCancel={closeFormModal}
						getData={refreshAll}
					/>
				) : null}
				{formModal?.type === 'mien' ? (
					<FormMien
						record={formModal.record}
						isView={formModal.isView}
						edit={formModal.edit}
						onCancel={closeFormModal}
						getData={refreshAll}
					/>
				) : null}
			</ModalExpandable>
		</TableBase>
	);
};

export default SinhVienDangKyBHYT;
