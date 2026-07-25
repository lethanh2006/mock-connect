import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import ModalExpandable from '@/components/Table/ModalExpandable';
import { type IColumn } from '@/components/Table/typing';
import {
	EBhytReviewStatus,
	EDeclarationType,
	reviewStatusColor,
	reviewStatusIntlId,
} from '@/services/BaoHiemYTe/constant';
import { BaoHiemYTe } from '@/services/BaoHiemYTe/typing';
import { formatDate } from '@/utils/formatDate';
import { chuanHoaTen } from '@/utils/utils';
import { ClockCircleOutlined, EyeOutlined, FormOutlined } from '@ant-design/icons';
import { Button, Space, Tag } from 'antd';
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

		return {
			...item.period,
			periodId: item.period._id ?? '',
			declarationType: item.declarationType,
			reviewStatus: item.reviewStatus,
			billStatus: item.student?.billStatus,
			student: item.student,
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
			render: (_val, rec) => rec.student?.ssnNumber || '--',
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
			render: (_val, rec) => rec.student?.diaChiThuongTru || '--',
			onCell,
		},
		{
			title: t('baohiemyte.dangky.column.hanSuDung'),
			dataIndex: ['student', 'hanBHYTHienTai'],
			width: 140,
			align: 'center',
			sortable: true,
			render: (_val, rec) => {
				const expiredDate = getExpiredDate(rec.student);
				return expiredDate ? formatDate(expiredDate) : '--';
			},
			onCell,
		},
		{
			title: t('baohiemyte.dangky.column.trangThai'),
			dataIndex: 'reviewStatus',
			width: 180,
			align: 'center',
			sortable: true,
			render: (_val, rec) => renderReviewStatusTag(rec.reviewStatus, rec.declarationType) ?? '--',
			filterType: 'select',
			filterData: Object.values(EBhytReviewStatus).map((item) => ({
				value: item,
				label: t(reviewStatusIntlId[item]),
			})),
			fixed: 'right',
		},
		{
			title: t('baohiemyte.dangky.thaoTac'),
			width: 80,
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
						renderReviewStatusTag(myRegistration?.reviewStatus, myRegistration?.declarationType)
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
