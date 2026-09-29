import { Button, IconEyeOpen, IconFilePen, IconShieldInfo, IconStopwatch } from '@/components/Icons';
import PageCard from '@/components/PageCard';
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
import { ETagColor } from '@/services/base/constant';
import dayjs from '@/utils/dayjs';
import { formatDate } from '@/utils/formatDate';
import { chuanHoaTen } from '@/utils/utils';
import { Popover, Space, Tag } from 'antd';
import { useEffect, useState } from 'react';
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
	const { page, limit, getModel, getByIdModel } = useModel('baohiemyte.dotdangky');
	const [currentInfo, setCurrentInfo] = useState<BaoHiemYTe.IPeriodSnapshot>();
	const [choiceModalOpen, setChoiceModalOpen] = useState(false);
	const [formModal, setFormModal] = useState<IFormModalState | null>(null);

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

	// Các field mô tả trạng thái bảo hiểm/thẻ TẠI THỜI ĐIỂM khai báo (declarationSnapshot).
	// Bảng này là lịch sử nên nếu rỗng ở thời điểm đó thì phải giữ rỗng, KHÔNG được lấy dữ liệu student mới nhất bổ khuyết
	// (vd: record cũ chưa có thẻ thì phải hiển thị chưa có thẻ, dù sau đó student đã được cấp thẻ ở record khác)
	const POINT_IN_TIME_FIELDS: (keyof BaoHiemYTe.IStudentRegistration)[] = [
		'ssnNumber',
		'cardNumber',
		'cardExpiredAt',
		'participantGroup',
		'initialClinicPlace',
		'insuranceProviderName',
		'insuranceCardNumber',
		'insuranceValidFrom',
		'insuranceValidTo',
		'passportImageFileId',
		'visaImageFileId',
		'proofFileId',
	];

	// declarationSnapshot là dữ liệu tại thời điểm nộp đơn nhưng có thể thiếu field (field hồ sơ chung),
	// student là dữ liệu sinh viên mới nhất dùng để bổ khuyết field còn thiếu đó — trừ nhóm POINT_IN_TIME_FIELDS ở trên
	const mergeStudentSnapshot = (
		declarationSnapshot?: BaoHiemYTe.IStudentRegistration,
		student?: BaoHiemYTe.IStudentRegistration,
	): BaoHiemYTe.IStudentRegistration | undefined => {
		if (!declarationSnapshot && !student) return undefined;

		const merged: BaoHiemYTe.IStudentRegistration = { ...student };
		Object.entries(declarationSnapshot ?? {}).forEach(([key, value]) => {
			const isPointInTimeField = POINT_IN_TIME_FIELDS.includes(key as keyof BaoHiemYTe.IStudentRegistration);
			if (isPointInTimeField || (value !== null && value !== undefined)) (merged as any)[key] = value;
		});

		return merged;
	};

	const getEffectiveStudent = (rec?: BaoHiemYTe.IHistoryItem) =>
		mergeStudentSnapshot(rec?.declarationSnapshot, rec?.student);

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

	// hanBHYTHienTai KHÔNG dùng ở đây: đó là hạn thẻ CŨ sinh viên tự khai trước khi mua qua trường (chỉ có ở FormDangKy),
	// không phải hạn của thẻ/gói đang được đăng ký hoặc khai báo trong record này
	const getExpiredDate = (student?: BaoHiemYTe.IStudentRegistration) =>
		student?.cardExpiredAt || student?.insuranceValidTo;

	// Cùng logic xác định quốc tịch VN với usePersonalInfo: so khớp chuỗi vì dữ liệu có thể là tên quốc gia thay vì mã enum
	const isVietnameseNationality = (nationality?: string) => {
		const normalized = (nationality ?? '').toLowerCase().trim();
		return normalized.includes('viet') || normalized.includes('việt');
	};

	// MUA_TRONG_TRUONG: sinh viên chưa có bảo hiểm nên đăng ký mua qua trường
	// DA_CO_BEN_NGOAI: sinh viên đã có bảo hiểm/thẻ, chỉ khai báo lại
	// CHUA_DANG_KY: chưa xác nhận có bảo hiểm, xếp chung nhóm "chưa có"
	const renderRegistrationType = (rec: BaoHiemYTe.IHistoryItem) => {
		const isVN = isVietnameseNationality(getEffectiveStudent(rec)?.nationality);
		const hasInsurance = rec.declarationType === EDeclarationType.DA_CO_BEN_NGOAI;

		if (isVN)
			return t(hasInsurance ? 'baohiemyte.dangky.loaiDangKy.coBHYT' : 'baohiemyte.dangky.loaiDangKy.khongCoBHYT');
		return t(
			hasInsurance ? 'baohiemyte.dangky.loaiDangKy.coTheBaoHiem' : 'baohiemyte.dangky.loaiDangKy.khongCoTheBaoHiem',
		);
	};

	// Hạn của thẻ/gói bảo hiểm thực tế (cardExpiredAt cho SV Việt Nam, insuranceValidTo cho SV quốc tế),
	// áp dụng chung cho cả 2 case: mua mới qua trường (hạn thẻ do admin cấp sau khi xử lý)
	// và đã có sẵn/khai báo miễn (hạn thẻ SV khai khi nộp). Chưa có dữ liệu thì hiển thị "--"
	const renderValidity = (rec: BaoHiemYTe.IHistoryItem) => {
		const expiredDate = getExpiredDate(getEffectiveStudent(rec));
		return expiredDate ? formatDate(expiredDate) : '--';
	};

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
			title: t('baohiemyte.dangky.maSinhVien'),
			dataIndex: ['student', 'studentCode'],
			width: 160,
			render: (_val, rec) => getEffectiveStudent(rec)?.studentCode || '--',
			onCell,
		},
		{
			title: t('baohiemyte.dangky.hinhThucDangKy'),
			dataIndex: 'declarationType',
			width: 220,
			render: (_val, rec) => renderRegistrationType(rec),
			onCell,
		},
		{
			title: t('baohiemyte.dangky.column.thoiHan'),
			dataIndex: ['student', 'cardExpiredAt'],
			width: 200,
			align: 'center',
			render: (_val, rec) => renderValidity(rec),
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
							<Button variant='ghost' size='sm' icon={<IconShieldInfo />} style={{ paddingInline: 4 }} />
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
							icon={<IconEyeOpen />}
						/>
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
							: currentInfo.message || t('baohiemyte.dangky.banner.khongCoDot')}
					</span>
				</Space>

				{hasPeriod ? (
					canRegister ? (
						<Button variant='default' onClick={onViewFull}>
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
		<PageCard title={t('baohiemyte.dangky.title')}>
			<div className='page-card-custom'>
				<TableBase<BaoHiemYTe.IHistoryItem>
					cardProps={{ stickyHeader: true }}
					getData={refreshAll}
					columns={columns}
					dependencies={[page, limit]}
					modelName='baohiemyte.dotdangky'
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
			</div>
		</PageCard>
	);
};

export default SinhVienDangKyBHYT;
