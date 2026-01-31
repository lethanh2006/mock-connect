import { ETrangThaiDangKyChuyenNganh } from '@/services/DaoTao/DangKyChuyenNganh/constant';
import { ELoaiPhieuDkCtdt } from '@/services/DaoTao/PhieuDkyCTDT/constant';
import type { PhieuDkCtdt } from '@/services/DaoTao/PhieuDkyCTDT/typing';
import { CloseOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Card, Col, Descriptions, Divider, Row, Space } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useLocation, useModel, useNavigate, useParams } from 'umi';
import ProgramDesignTable from '../Build/components/ProgramDesignTable';
import DecisionCommentsModal from './components/DecisionCommentsModal';
import PersonalInfo from './components/PersonalInfo';
import ProcessSidebar from './components/ProcessSidebar';

const DetailSinhVienDangKyChuyenNganh = () => {
	const intl = useIntl();
	const { id } = useParams<{ id: string }>();
	const location = useLocation();
	const searchParams = new URLSearchParams(location.search);
	const loai = searchParams.get('loai') || 'minor';
	const isMinor = loai.toLowerCase() === 'minor';

	const { fetchChiTietPhieuDangKy, record: phieuDkCtdtMe } = useModel('sinhvien.dangkychuyennganh.dangkychuyennganh')
	const navigate = useNavigate();
	const [currentStep, setCurrentStep] = useState(0);
	const [visibleViewCommentModal, setVisibleViewCommentModal] = useState(false);
	const [commentType, setCommentType] = useState<PhieuDkCtdt.TCommentType>('ghiChu');

	useEffect(() => {
		if (id) fetchChiTietPhieuDangKy(id);
	}, [id]);

	const handleEdit = () => {
		navigate(`/hoc-tap/dang-ky-chuyen-nganh/register/build?loai=${loai}`);
	};

	const handleViewComments = (type: PhieuDkCtdt.TCommentType) => {
		setCommentType(type);
		setVisibleViewCommentModal(true);
	};

	const handleCloseViewCommentModal = () => {
		setVisibleViewCommentModal(false);
	};

	const getCommentContent = () => {
		switch (commentType) {
			case 'ghiChuCVHT':
				return phieuDkCtdtMe?.ghiChuCVHT || intl.formatMessage({ id: 'minor.detail.commentDefault' });
			case 'ghiChuBoMon':
				return phieuDkCtdtMe?.ghiChuBoMon || intl.formatMessage({ id: 'minor.detail.commentDefault' });
			case 'ghiChuQldt':
				return phieuDkCtdtMe?.ghiChuQldt || intl.formatMessage({ id: 'minor.detail.commentDefault' });
			default:
				return phieuDkCtdtMe?.ghiChu || intl.formatMessage({ id: 'minor.detail.commentDefault' });
		}
	};

	return (
		<>
			<Card
				className='card-borderless card-big-title'
				title={isMinor ? intl.formatMessage({ id: 'minor.detail.title.minor' }) : intl.formatMessage({ id: 'minor.detail.title.concentration' })}
				extra={
					<Breadcrumb>
						<Breadcrumb.Item>
							{intl.formatMessage({ id: 'minor.breadcrumb.student' })}
						</Breadcrumb.Item>
						<Breadcrumb.Item href={isMinor ? '/hoc-tap/khac#dang-ky-chuyen-nganh-hep' : '/hoc-tap/khac'}>
							{isMinor ? intl.formatMessage({ id: 'minor.breadcrumb.minor' }) : intl.formatMessage({ id: 'minor.breadcrumb.concentration' })}
						</Breadcrumb.Item>
						<Breadcrumb.Item>{intl.formatMessage({ id: 'minor.breadcrumb.detail' })}</Breadcrumb.Item>
					</Breadcrumb>
				}
			>
			</Card>
			<Row gutter={16}>
				<Col span={6}>
					<ProcessSidebar
						currentStep={currentStep}
						onStepChange={setCurrentStep}
						onViewComments={handleViewComments}
						showViewCommentsStepIndex={1}
					/>
				</Col>

				<Col span={18}>
					<Card>
						<Space direction='vertical' size='large' style={{ width: '100%' }}>
							<PersonalInfo />

							<div>
								<Divider orientation='left' className='divider-big-title' style={{ marginTop: 0 }} dashed>
									{intl.formatMessage({ id: 'minor.detail.advisor' })}
								</Divider>
								<div style={{ display: 'flex', gap: 16, flexDirection: 'column' }}>
									<Descriptions
										column={2}
										layout='vertical'
										title={intl.formatMessage({ id: 'minor.detail.advisorPrimary' })}
									>
										<Descriptions.Item label={intl.formatMessage({ id: 'minor.detail.fullName' })}>
											{phieuDkCtdtMe?.hoTenCoVanHocTapChinh || '-'}
										</Descriptions.Item>
										<Descriptions.Item label={intl.formatMessage({ id: 'minor.detail.email' })}>
											{phieuDkCtdtMe?.emailCoVanHocTapChinh || '-'}
										</Descriptions.Item>
									</Descriptions>
									<Descriptions
										column={2}
										layout='vertical'
										title={intl.formatMessage({ id: 'minor.detail.advisorSecondary' })}
									>
										<Descriptions.Item label={intl.formatMessage({ id: 'minor.detail.fullName' })}>
											{phieuDkCtdtMe?.hoTenCoVanHocTapPhu || '-'}
										</Descriptions.Item>
										<Descriptions.Item label={intl.formatMessage({ id: 'minor.detail.email' })}>
											{phieuDkCtdtMe?.emailCoVanHocTapPhu || '-'}
										</Descriptions.Item>
									</Descriptions>
								</div>
							</div>
							{phieuDkCtdtMe?.loai === ELoaiPhieuDkCtdt.PERSONAL && (
								<div>
									<Divider orientation='left' className='divider-big-title' style={{ marginTop: 0 }} dashed>
										{intl.formatMessage({ id: 'minor.idm.goalsAndRationale.title' })}
									</Divider>
									{phieuDkCtdtMe?.mucTieuLyDo || '-'}
								</div>
							)}

							{phieuDkCtdtMe?.loai === ELoaiPhieuDkCtdt.PERSONAL && (
								<div>
									<Divider orientation='left' className='divider-big-title' style={{ marginTop: 0 }} dashed>
										{intl.formatMessage({ id: 'minor.idm.programDesign.title' })}
									</Divider>

									<ProgramDesignTable
										data={phieuDkCtdtMe?.khoiHpCtList || []}
										hideActions
									/>
								</div>
							)}
							{phieuDkCtdtMe?.trangThai === ETrangThaiDangKyChuyenNganh.NHAP && (
								<div className='form-footer'>
									<Button
										icon={<CloseOutlined />}
										onClick={handleEdit}
									>
										{intl.formatMessage({ id: 'minor.detail.edit' })}
									</Button>
								</div>
							)}
						</Space>
					</Card>
				</Col>
			</Row >

			<DecisionCommentsModal
				open={visibleViewCommentModal}
				onCancel={handleCloseViewCommentModal}
				title={intl.formatMessage({ id: 'minor.modal.comment' })}
				content={getCommentContent()}
			/>
		</>
	);
};

export default DetailSinhVienDangKyChuyenNganh;
