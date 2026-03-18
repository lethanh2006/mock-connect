import {
	colorTrangThaiDangKyChuyenNganh,
	ETrangThaiDangKyChuyenNganh,
	trangThaiDangKyChuyenNganh,
} from '@/services/DaoTao/DangKyChuyenNganh/constant';
import { Card, Col, Row, Tag } from 'antd';
import { useIntl, useModel } from 'umi';

const StudentInfoCard = ({ type }: { type: 'minor' | 'concentration' }) => {
	const intl = useIntl();

	const { record: recSinhVien } = useModel('sinhvien.sinhvien');
	const { phieuDangKyTheoDot: phieuDkCtdtMeByDot } = useModel('sinhvien.dangkychuyennganh.dangkychuyennganh');
	const { record: kyHienTai } = useModel('daotao.dotdkctdt');
	const gpa = recSinhVien?.kqhtTichLuyNganh1?.trungBinhThang4 || '-';
	const chuongTrinhDaoTao =
		phieuDkCtdtMeByDot?.trangThai !== ETrangThaiDangKyChuyenNganh.NHAP
			? type === 'minor'
				? phieuDkCtdtMeByDot?.tenChuongTrinh || phieuDkCtdtMeByDot?.ctdt?.ten
				: phieuDkCtdtMeByDot?.chuyenNganh?.ten
			: '-';
	return (
		<Row gutter={[16, 16]}>
			<Col span={8}>
				<Card variant='borderless' style={{ backgroundColor: 'var(--color-status-bg-100)', alignContent: 'center' }}>
					<Row justify='space-between' align='middle'>
						<Col>
							<div>{intl.formatMessage({ id: 'ketquahoctap.stat.ketqua' })}</div>
							<div>{intl.formatMessage({ id: 'ketquahoctap.stat.tbc' })}</div>
						</Col>
						<Col>
							<h2 style={{ fontWeight: 'bold', color: 'var(--color-info)' }}>{gpa}</h2>
						</Col>
					</Row>
				</Card>
			</Col>
			<Col span={8}>
				<Card
					variant='borderless'
					style={{ backgroundColor: 'var(--color-status-200)', color: 'var(--color-text-400)', alignContent: 'center' }}
				>
					<div>
						{type === 'minor'
							? intl.formatMessage({ id: 'minor.info.selectedMinor' })
							: intl.formatMessage({ id: 'minor.info.selectedConcentration' })}
					</div>
					<div style={{ fontWeight: 'bold' }}>
						{chuongTrinhDaoTao}{' '}
						{phieuDkCtdtMeByDot?.trangThai && phieuDkCtdtMeByDot?.trangThai !== ETrangThaiDangKyChuyenNganh.NHAP ? (
							<Tag
								style={{ marginLeft: 8 }}
								color={colorTrangThaiDangKyChuyenNganh[phieuDkCtdtMeByDot.trangThai as ETrangThaiDangKyChuyenNganh]}
							>
								{trangThaiDangKyChuyenNganh[phieuDkCtdtMeByDot.trangThai as ETrangThaiDangKyChuyenNganh]}
							</Tag>
						) : (
							''
						)}
					</div>
				</Card>
			</Col>
			<Col xs={24} md={8}>
				<Card variant='borderless' style={{ backgroundColor: 'var(--color-status-bg-100)', height: '100%' }}>
					<div style={{ marginBottom: 8 }}>
						{intl.formatMessage({ id: 'minor.info.requirement.gpa' }, { gpa: kyHienTai?.gpaMin ?? '-' })}
					</div>
					<div style={{ marginBottom: 8 }}>
						{intl.formatMessage(
							{ id: 'minor.info.requirement.minCredits' },
							{
								credits: kyHienTai?.minCredit
									? `${kyHienTai.minCredit} ${intl.formatMessage({ id: 'minor.course.creditsUnit' })}`
									: '-',
							},
						)}
					</div>
					<div>
						{intl.formatMessage(
							{ id: 'minor.info.requirement.completedCredits' },
							{
								credits: kyHienTai?.maxCompletedCredit
									? `${kyHienTai.maxCompletedCredit} ${intl.formatMessage({ id: 'minor.course.creditsUnit' })}`
									: '-',
							},
						)}
					</div>
				</Card>
			</Col>
		</Row>
	);
};

export default StudentInfoCard;
