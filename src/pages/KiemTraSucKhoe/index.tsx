import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import ModalExpandable from '@/components/Table/ModalExpandable';
import { type IColumn } from '@/components/Table/typing';
import {
	EDeclarationType,
	EKtscNationality,
	EKtscReviewStatus,
	KtscPaymentStatus,
	paymentStatusColor,
	paymentStatusIntlId,
	reviewStatusColor,
	reviewStatusIntlId,
} from '@/services/KiemTraSucKhoe/constant';
import { KiemTraSucKhoe } from '@/services/KiemTraSucKhoe/typing';
import { ETagColor } from '@/services/base/constant';
import dayjs from '@/utils/dayjs';
import { formatDate } from '@/utils/formatDate';
import { chuanHoaTen } from '@/utils/utils';
import { IconFilePen, IconStopwatch, IconEyeOpen, IconShieldInfo } from '@/components/Icons';
import { Button, Popover, Space, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import ChoiceModal from './components/ChoiceModal';
import FormDangKy from './components/FormDangKy';
import FormMien from './components/FormMien';

type TFormType = 'dangKy' | 'mien';

interface IFormModalState {
	type: TFormType;
	record?: KiemTraSucKhoe.IDotDangKy;
	isView?: boolean;
	edit?: boolean;
}

const getFormTypeFromDeclaration = (declarationType?: EDeclarationType): TFormType | undefined => {
	if (declarationType === EDeclarationType.DA_DANG_KY) return 'dangKy';
	if (declarationType === EDeclarationType.MIEN_KHAM || declarationType === EDeclarationType.CHUA_DANG_KY)
		return 'mien';
	return undefined;
};

const SinhVienDangKyKiemTraSucKhoe = () => {
	const intl = useIntl();
	const t = (id: string) => intl.formatMessage({ id });
	const { page, limit, getModel, getByIdModel, postSinhVienDangKyKhamModel, formSubmiting } =
		useModel('kiemtrasuckhoe.dotdangky');
	const { record: recordSinhVien } = useModel('sinhvien.sinhvien');
	const [currentInfo, setCurrentInfo] = useState<KiemTraSucKhoe.IPeriodSnapshot>();
	const [choiceModalOpen, setChoiceModalOpen] = useState(false);
	const [formModal, setFormModal] = useState<IFormModalState | null>(null);

	const getData = () => {
		getModel(undefined, undefined, undefined, undefined, undefined, 'me/history/page');
	};

	const getCurrentInfo = async () => {
		try {
			const data = await getByIdModel('me/current', false);
			setCurrentInfo(data as unknown as KiemTraSucKhoe.IPeriodSnapshot);
		} catch {
			setCurrentInfo(undefined);
		}
	};

	useEffect(() => {
		getData();
		void getCurrentInfo();
	}, []);

	const refreshAll = () => {
		getData();
		void getCurrentInfo();
	};

	// Modal đăng ký mới (mở từ nút Xem đầy đủ): chỉ điền sẵn thông tin cá nhân sinh viên,
	// các thông tin khai báo khác (minh chứng...) để trống cho sinh viên tự nhập
	const toNewRegistrationRecord = (
		snapshot?: KiemTraSucKhoe.IPeriodSnapshot,
	): KiemTraSucKhoe.IDotDangKy | undefined => {
		if (!snapshot?.period) return undefined;

		const { fullName, studentCode, ngaySinh, cccd, nationality, gioiTinh, khoa, nganh, phone, email } =
			snapshot.student ?? {};

		return {
			...snapshot.period,
			periodId: snapshot.period._id ?? '',
			student: { fullName, studentCode, ngaySinh, cccd, nationality, gioiTinh, khoa, nganh, phone, email },
		};
	};

	// declarationSnapshot là dữ liệu tại thời điểm nộp đơn nhưng có thể thiếu field,
	// student là dữ liệu sinh viên mới nhất (đầy đủ field) dùng để bổ khuyết field còn thiếu
	const mergeStudentSnapshot = (
		declarationSnapshot?: KiemTraSucKhoe.IStudentRegistration,
		student?: KiemTraSucKhoe.IStudentRegistration,
	): KiemTraSucKhoe.IStudentRegistration | undefined => {
		if (!declarationSnapshot && !student) return undefined;

		const merged: KiemTraSucKhoe.IStudentRegistration = { ...student };
		Object.entries(declarationSnapshot ?? {}).forEach(([key, value]) => {
			if (value !== null && value !== undefined) (merged as any)[key] = value;
		});

		return merged;
	};

	const getEffectiveStudent = (rec?: KiemTraSucKhoe.IHistoryItem) =>
		mergeStudentSnapshot(rec?.declarationSnapshot, rec?.student);

	const toDotDangKyRecordFromHistory = (item?: KiemTraSucKhoe.IHistoryItem): KiemTraSucKhoe.IDotDangKy | undefined => {
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

	const openForm = (
		type: TFormType,
		record?: KiemTraSucKhoe.IDotDangKy,
		opts?: { isView?: boolean; edit?: boolean },
	) => {
		if (!record) return;
		setFormModal({ type, record, isView: opts?.isView, edit: opts?.edit ?? !opts?.isView });
	};

	const closeFormModal = () => setFormModal(null);

	const onCell = (rec: KiemTraSucKhoe.IHistoryItem) => ({
		onClick: () => {
			const type = getFormTypeFromDeclaration(rec.declarationType);
			if (type) openForm(type, toDotDangKyRecordFromHistory(rec), { isView: true });
		},
		style: { cursor: 'pointer' },
	});

	const onViewFull = () => setChoiceModalOpen(true);

	// Đăng ký khám sức khỏe tại trường: không có form nhập, gửi thẳng thông tin sinh viên lên API
	const onSelectDangKy = async () => {
		const newRecord = toNewRegistrationRecord(currentInfo);
		if (!newRecord?.periodId) return;

		const normalizedNationality = ((recordSinhVien as any)?.quocTich ?? '').toLowerCase().trim();
		const isVNNationality = normalizedNationality.includes('viet') || normalizedNationality.includes('việt');
		const kskNationality = (recordSinhVien as any)?.quocTich
			? isVNNationality
				? EKtscNationality.VIETNAM
				: EKtscNationality.FOREIGN
			: undefined;

		const payload: KiemTraSucKhoe.ISinhVienDangKy = {
			ssoId: (recordSinhVien as any)?.ssoId,
			studentId: (recordSinhVien as any)?.ssoId,
			studentCode: (recordSinhVien as any)?.ma,
			periodId: newRecord.periodId,
			fullName: (recordSinhVien as any)?.ten,
			ngaySinh: (recordSinhVien as any)?.ngaySinh,
			cccd: (recordSinhVien as any)?.cccd,
			nationality: kskNationality,
			gioiTinh: (recordSinhVien as any)?.gioiTinh,
			khoa: (recordSinhVien as any)?.nganh?.tenDonViPhuTrach ?? recordSinhVien?.nganh?.tenDonViVietTat,
			nganh: (recordSinhVien as any)?.nganh?.ten,
			maKhoa: (recordSinhVien as any)?.nganh?.maDonVi,
			maNganh: (recordSinhVien as any)?.maNganh,
			phone: (recordSinhVien as any)?.soDienThoai,
			email: (recordSinhVien as any)?.email,
		};

		try {
			await postSinhVienDangKyKhamModel(payload, refreshAll);
			setChoiceModalOpen(false);
		} catch {
			// Lỗi đã được xử lý và thông báo ở tầng axios interceptor
		}
	};

	const onSelectMien = () => {
		setChoiceModalOpen(false);
		openForm('mien', toNewRegistrationRecord(currentInfo), { edit: false });
	};

	// Mỗi đợt chỉ được đăng ký 1 lần, trừ trường hợp khai báo miễn bị từ chối,
	// hoặc khai báo "chưa đăng ký" chưa được duyệt thì cho đăng ký lại
	const canRegisterAgain = (myRegistration?: KiemTraSucKhoe.IMyRegistration) => {
		if (!myRegistration?._id) return true;
		const type = getFormTypeFromDeclaration(myRegistration.declarationType);
		if (type !== 'mien') return false;
		if (myRegistration.reviewStatus === EKtscReviewStatus.TU_CHOI) return true;
		return myRegistration.declarationType === EDeclarationType.CHUA_DANG_KY && !myRegistration.reviewStatus;
	};

	const renderReviewStatusTag = (
		reviewStatus?: EKtscReviewStatus | string | null,
		declarationType?: EDeclarationType,
	) => {
		const type = getFormTypeFromDeclaration(declarationType);

		if (type === 'dangKy') return <Tag color={reviewStatusColor.DA_DUYET}>{t(reviewStatusIntlId.DA_DUYET)}</Tag>;

		if (!reviewStatus) return null;

		return (
			<Tag color={reviewStatusColor[reviewStatus as EKtscReviewStatus]}>
				{t(reviewStatusIntlId[reviewStatus as EKtscReviewStatus])}
			</Tag>
		);
	};

	// Trạng thái thanh toán chỉ áp dụng cho hình thức đăng ký khám tại trường (dangKy),
	// hình thức khai báo miễn (mien) không phát sinh thanh toán nên hiển thị "Không áp dụng"
	const renderPaymentStatusTag = (paymentStatus?: KtscPaymentStatus | null, declarationType?: EDeclarationType) => {
		const type = getFormTypeFromDeclaration(declarationType);

		if (type !== 'dangKy') {
			return <Tag color={ETagColor.DEFAULT}>{t('kiemtrasuckhoe.dangky.trangThaiThanhToan.notApplicable')}</Tag>;
		}

		const status = paymentStatus ?? KtscPaymentStatus.CHUA_THANH_TOAN;

		return <Tag color={paymentStatusColor[status]}>{t(paymentStatusIntlId[status])}</Tag>;
	};

	const labelStyle = { color: '#8c8c8c', fontSize: 13 };

	// Chỉ hiển thị lịch sử xử lý cho hình thức khai báo miễn đã thực sự được xử lý (có thông tin người xử lý),
	// hình thức đăng ký (dangKy) không có quy trình duyệt nên không show
	const canShowLichSuXuLyMien = (rec?: KiemTraSucKhoe.IHistoryItem) =>
		getFormTypeFromDeclaration(rec?.declarationType) === 'mien' &&
		!!(rec?.reviewerId || rec?.reviewerName || rec?.action);

	const renderThoiGianDangKy = (start?: string, end?: string) =>
		intl.formatMessage(
			{ id: 'kiemtrasuckhoe.dangky.banner.thoiGianDangKy' },
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

	const columns: IColumn<KiemTraSucKhoe.IHistoryItem>[] = [
		{
			title: t('kiemtrasuckhoe.dangky.maSinhVien'),
			dataIndex: ['student', 'studentCode'],
			width: 160,
			render: (_val, rec) => getEffectiveStudent(rec)?.studentCode || '--',
			onCell,
		},
		{
			title: t('kiemtrasuckhoe.dangky.column.thoiGian'),
			dataIndex: ['period', 'registrationStartAt'],
			width: 260,
			sortable: true,
			render: (_val, rec) => renderThoiGianDangKy(rec.period?.registrationStartAt, rec.period?.registrationEndAt),
			onCell,
		},
		{
			title: t('kiemtrasuckhoe.dangky.hinhThucDangKy'),
			dataIndex: 'declarationType',
			width: 220,
			render: (_val, rec) => {
				const type = getFormTypeFromDeclaration(rec.declarationType);
				if (type === 'dangKy') return t('kiemtrasuckhoe.dangky.hinhThuc.dangKy');
				if (type === 'mien') return t('kiemtrasuckhoe.dangky.hinhThuc.mien');
				return '--';
			},
			onCell,
		},
		{
			title: t('kiemtrasuckhoe.dangky.column.trangThai'),
			dataIndex: 'reviewStatus',
			width: 200,
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
										<b>{t('kiemtrasuckhoe.mien.nguoiPheDuyet')}:</b> {rec.reviewerName || rec.reviewerId || '--'}
									</div>
									<div>
										<b>{t('kiemtrasuckhoe.mien.thoiGianDuyet')}:</b>{' '}
										{rec.createdAt ? dayjs(rec.createdAt).format('DD/MM/YYYY HH:mm') : ''}
									</div>
									<div>
										<b>{t('kiemtrasuckhoe.mien.ketQua')}:</b> {rec.action || ''}
									</div>
									{rec.note && (
										<div style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>
											<b>{t('kiemtrasuckhoe.mien.ghiChu')}:</b> {rec.note}
										</div>
									)}
								</div>
							}
						>
							<Button type='text' size='small' icon={<IconShieldInfo />} style={{ paddingInline: 4 }} />
						</Popover>
					)}
				</Space>
			),
			filterType: 'select',
			filterData: Object.values(EKtscReviewStatus).map((item) => ({
				value: item,
				label: t(reviewStatusIntlId[item]),
			})),
			fixed: 'right',
		},
		{
			title: t('kiemtrasuckhoe.dangky.thaoTac'),
			width: 100,
			align: 'center',
			fixed: 'right',
			render: (_val, rec) => {
				const canEdit = rec.reviewStatus === EKtscReviewStatus.CAN_BO_SUNG;
				const type = getFormTypeFromDeclaration(rec.declarationType);

				return (
					<>
						{type === 'mien' && (
							<ButtonExtend
								onClick={() => {
									const type = getFormTypeFromDeclaration(rec.declarationType);
									if (type) openForm(type, toDotDangKyRecordFromHistory(rec), { isView: true });
								}}
								type='link'
								icon={<IconEyeOpen />}
							/>
						)}
						{canEdit && type === 'mien' && (
							<ButtonExtend
								tooltip={t('global.button.chinhsua')}
								onClick={() => openForm(type, toDotDangKyRecordFromHistory(rec), { edit: true })}
								type='link'
								icon={<IconFilePen />}
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
					<IconStopwatch style={{ color: '#0E50CF', fontSize: 16 }} />
					<span>
						{hasPeriod
							? renderThoiGianDangKy(currentInfo.period?.registrationStartAt, currentInfo.period?.registrationEndAt)
							: currentInfo.message || t('kiemtrasuckhoe.dangky.banner.khongCoDot')}
					</span>
				</Space>

				{hasPeriod ? (
					canRegister ? (
						<Button type='primary' onClick={onViewFull}>
							{t('kiemtrasuckhoe.dangky.banner.xemDayDu')}
						</Button>
					) : (
						<Space size={16}>
							{reviewTag && (
								<Space size={6}>
									<span style={labelStyle}>{t('kiemtrasuckhoe.dangky.banner.duyet')}:</span>
									{reviewTag}
								</Space>
							)}
							{paymentTag && (
								<Space size={6}>
									<span style={labelStyle}>{t('kiemtrasuckhoe.dangky.banner.thanhToan')}:</span>
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
			{ title: chuanHoaTen(t('kiemtrasuckhoe.dangky.title').toLowerCase()) },
		)
		: undefined;

	return (
		<TableBase<KiemTraSucKhoe.IHistoryItem>
			getData={refreshAll}
			columns={columns}
			dependencies={[page, limit]}
			modelName='kiemtrasuckhoe.dotdangky'
			title={t('kiemtrasuckhoe.dangky.title')}
			buttons={{ create: false }}
			addStt
		>
			{renderBanner()}

			<ChoiceModal
				open={choiceModalOpen}
				onClose={() => setChoiceModalOpen(false)}
				onSelectDangKy={onSelectDangKy}
				onSelectMien={onSelectMien}
				loadingDangKy={formSubmiting}
			/>

			<ModalExpandable
				title={formModalTitle}
				width={formModal?.edit || formModal?.isView ? 1000 : 600}
				open={!!formModal}
				onCancel={closeFormModal}
				footer={null}
				destroyOnClose
			>
				{formModal?.type === 'dangKy' ? <FormDangKy record={formModal.record} onCancel={closeFormModal} /> : null}
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

export default SinhVienDangKyKiemTraSucKhoe;
