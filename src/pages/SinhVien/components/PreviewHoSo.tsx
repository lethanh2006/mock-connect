import { colorTrangThaiHocSv, genderMessageIds, trangThaiHocSv } from '@/services/DaoTao/constant';
import { placeOfBirthTypeMessageIds } from '@/services/DaoTao/SinhVien/constants';
import { formatDate } from '@/utils/formatDate';
import { formatPhoneNumber } from '@/utils/utils';
import { Card, Col, Descriptions, Divider, Flex, Image, Row, Spin, Tag, Typography } from 'antd';
// import { Card, Descriptions, Divider, Flex, Image, Spin, Splitter, Typography } from 'antd';
import type { ReactNode } from 'react';
import { useIntl, useModel } from 'umi';
// import { useMediaQuery } from 'react-responsive';

const { Text, Title } = Typography;

const SectionTitle = ({ title }: { title: string }) => (
	<Divider orientation='left' dashed className='divider-big-title'>
		{title}
	</Divider>
);

type ExtraStudentProfile = Partial<{
	hoChieu: string;
	maBuuChinh: string;
	maBuuChinhThuongTru: string;
	passportNumber: string;
	postalCode: string;
	soHoChieu: string;
}>;

// const ProfileField = (props: { label: string; value?: ReactNode; highlight?: boolean }) => {
// 	const { label, value, highlight } = props;
//
// 	return (
// 		<div className='sv-profile-field'>
// 			<Text type='secondary'>{label}</Text>
// 			<Text strong={highlight} style={highlight ? { color: 'var(--color-primary)' } : undefined}>
// 				{value || '--'}
// 			</Text>
// 		</div>
// 	);
// };

const PreviewHoSo = (_props: { header?: ReactNode }) => {
	const intl = useIntl();
	const { record, loading } = useModel('sinhvien.sinhvien');
	// const { danhSach: danhSachQuocTich, getAllModel } = useModel('core.quoctich');
	const extraRecord = record as ExtraStudentProfile | undefined;
	// const isMobile = useMediaQuery({ query: '(max-width: 767px)' });

	// useEffect(() => {
	// 	if (!danhSachQuocTich.length) getAllModel();
	// }, []);

	const renderValue = (value?: ReactNode, highlight = false) => {
		if (value === undefined || value === null || value === '') return '--';

		return (
			<Text strong style={highlight ? { color: 'var(--color-primary)' } : undefined}>
				{value}
			</Text>
		);
	};

	const renderDescription = (label: ReactNode, value?: ReactNode, bullet = true, highlight = false) => (
		<Descriptions.Item
			label={
				<span className={bullet ? 'sv-profile-description-label sv-profile-description-label-bullet' : undefined}>
					{label}
				</span>
			}
		>
			{renderValue(value, highlight)}
		</Descriptions.Item>
	);

	const passportNumber = extraRecord?.soHoChieu ?? extraRecord?.passportNumber ?? extraRecord?.hoChieu;
	const postalCode = extraRecord?.maBuuChinhThuongTru ?? extraRecord?.postalCode ?? extraRecord?.maBuuChinh;
	const formatEnumMessage = <T extends string>(messageIds: Partial<Record<T, string>>, value?: T) =>
		value && messageIds[value] ? intl.formatMessage({ id: messageIds[value] }) : value;

	const leftPanel = (
		<Card variant='borderless'>
			<div className='sv-profile-summary'>
				<Flex vertical align='center' gap={8}>
					<div className='avatar-container'>
						<Image src={record?.anhDaiDienUrl ?? '/metadata.png'} />
					</div>
					<Title level={4} className='sv-profile-name'>
						{record?.ten ?? '--'}
					</Title>
					<Tag
						bordered={false}
						className='sv-profile-status'
						color={record?.trangThaiHoc ? colorTrangThaiHocSv[record.trangThaiHoc] : undefined}
					>
						{formatEnumMessage(trangThaiHocSv, record?.trangThaiHoc) ?? '--'}
					</Tag>
				</Flex>
			</div>

			{/* <Descriptions column={1} colon={false} layout='vertical' className='sv-profile-descriptions sv-profile-summary'>
				<Descriptions.Item label=' '>
					<div className='sv-profile-avatar-wrap'>
						<div className='avatar-container'>
							<Image src={record?.anhDaiDienUrl ?? '/metadata.png'} preview={false} />
						</div>
					</div>
				</Descriptions.Item>
				<Descriptions.Item label={intl.formatMessage({ id: 'thongtincanhan.hoso.hoten' })}>
					<Title level={4} style={{ margin: 0 }}>
						{record?.ten ?? '--'}
					</Title>
				</Descriptions.Item>
				<Descriptions.Item label={intl.formatMessage({ id: 'thongtincanhan.hoso.trangthaihoc' })}>
					<Text style={{ color: '#52c41a', fontWeight: 600 }}>{record?.trangThaiHoc ?? '--'}</Text>
				</Descriptions.Item>
			</Descriptions> */}

			<SectionTitle title={intl.formatMessage({ id: 'thongtincanhan.hoso.generalInfo' })} />

			<Descriptions column={1} colon={false} layout='horizontal' className='sv-profile-detail-descriptions'>
				{renderDescription(`${intl.formatMessage({ id: 'thongtincanhan.hoso.masv' })}:`, record?.ma, false, false)}
				{renderDescription(
					`${intl.formatMessage({ id: 'thongtincanhan.hoso.gioitinh' })}:`,
					formatEnumMessage(genderMessageIds, record?.gioiTinh),
					false,
				)}
				{renderDescription(
					`${intl.formatMessage({ id: 'thongtincanhan.hoso.ngaysinh' })}:`,
					formatDate(record?.ngaySinh),
					false,
				)}
				{renderDescription(`${intl.formatMessage({ id: 'thongtincanhan.hoso.email' })}:`, record?.email, false)}
				{renderDescription(
					`${intl.formatMessage({ id: 'thongtincanhan.hoso.sdt' })}:`,
					record?.soDienThoai ? formatPhoneNumber(record.soDienThoai) : undefined,
					false,
				)}
				{renderDescription(`${intl.formatMessage({ id: 'thongtincanhan.hoso.quoctich' })}:`, record?.quocTich, false)}
				{renderDescription(`${intl.formatMessage({ id: 'thongtincanhan.hoso.dantoc' })}:`, record?.danToc, false)}
				{renderDescription(`${intl.formatMessage({ id: 'thongtincanhan.hoso.tongiao' })}:`, record?.tonGiao, false)}
			</Descriptions>

			{/* <Flex vertical align='center' gap={8} style={{ marginBottom: 16 }}>
				<div className='avatar-container'>
					<Image src={record?.anhDaiDienUrl ?? '/metadata.png'} preview={false} />
				</div>
				<Title level={4} style={{ margin: 0, textAlign: 'center' }}>
					{record?.ten}
				</Title>
				<Text style={{ color: '#52c41a', fontWeight: 600 }}>{record?.trangThaiHoc ?? '--'}</Text>
			</Flex>

			<Flex vertical gap={12}>
				<ProfileField
					label={intl.formatMessage({ id: 'thongtincanhan.hoso.masv' })}
					value={record?.ma}
					highlight
				/>
				<ProfileField label={intl.formatMessage({ id: 'thongtincanhan.hoso.gioitinh' })} value={record?.gioiTinh} />
				<ProfileField
					label={intl.formatMessage({ id: 'thongtincanhan.hoso.ngaysinh' })}
					value={formatDate(record?.ngaySinh)}
				/>
				<ProfileField label={intl.formatMessage({ id: 'thongtincanhan.hoso.email' })} value={record?.email} />
				<ProfileField
					label={intl.formatMessage({ id: 'thongtincanhan.hoso.sdt' })}
					value={record?.soDienThoai ? formatPhoneNumber(record.soDienThoai) : undefined}
				/>
				<ProfileField label={intl.formatMessage({ id: 'thongtincanhan.hoso.quoctich' })} value={record?.quocTich} />
				<ProfileField label={intl.formatMessage({ id: 'thongtincanhan.hoso.dantoc' })} value={record?.danToc} />
				<ProfileField label={intl.formatMessage({ id: 'thongtincanhan.hoso.tongiao' })} value={record?.tonGiao} />
			</Flex> */}
		</Card>
	);

	const rightPanel = (
		<Card variant='borderless'>
			<SectionTitle title={intl.formatMessage({ id: 'thongtincanhan.hoso.identity' })} />
			<Descriptions
				column={1}
				colon={false}
				layout='horizontal'
				className='sv-profile-detail-descriptions'
				title={intl.formatMessage({ id: 'thongtincanhan.hoso.nationalIdentification' })}
			>
				{renderDescription(`${intl.formatMessage({ id: 'thongtincanhan.hoso.idNumber' })}:`, record?.cccd)}
				{renderDescription(
					`${intl.formatMessage({ id: 'thongtincanhan.hoso.ngaycap' })}:`,
					formatDate(record?.ngayCapCccd),
				)}
				{renderDescription(`${intl.formatMessage({ id: 'thongtincanhan.hoso.noicap' })}:`, record?.noiCapCccd)}
			</Descriptions>
			<Descriptions
				column={1}
				colon={false}
				layout='horizontal'
				className='sv-profile-detail-descriptions'
				title={intl.formatMessage({ id: 'thongtincanhan.hoso.passportIdentification' })}
			>
				{renderDescription(intl.formatMessage({ id: 'thongtincanhan.hoso.passportNumber' }), passportNumber)}
			</Descriptions>

			<SectionTitle title={intl.formatMessage({ id: 'thongtincanhan.hoso.addressInfo' })} />
			<Descriptions
				column={1}
				colon={false}
				layout='horizontal'
				className='sv-profile-detail-descriptions'
				title={`${intl.formatMessage({ id: 'thongtincanhan.hoso.placeOfBirth' })}:`}
			>
				{renderDescription(
					`${intl.formatMessage({ id: 'thongtincanhan.hoso.birthplaceType' })}:`,
					formatEnumMessage(placeOfBirthTypeMessageIds, record?.loaiNoiSinh),
				)}
				{renderDescription(
					`${intl.formatMessage({ id: 'thongtincanhan.hoso.diachi.tp' })}:`,
					record?.tinhTpNoiSinh || record?.quocGiaNoiSinh,
				)}
			</Descriptions>
			<Descriptions
				column={1}
				colon={false}
				layout='horizontal'
				className='sv-profile-detail-descriptions'
				title={`${intl.formatMessage({ id: 'thongtincanhan.hoso.nativePlace' })}:`}
			>
				{renderDescription(`${intl.formatMessage({ id: 'thongtincanhan.hoso.diachi.tp' })}:`, record?.tinhTpQueQuan)}
				{renderDescription(
					`${intl.formatMessage({ id: 'thongtincanhan.hoso.diachi.quan' })}:`,
					record?.quanHuyenQueQuan,
				)}
				{renderDescription(`${intl.formatMessage({ id: 'thongtincanhan.hoso.diachi.xa' })}:`, record?.xaPhuongQueQuan)}
			</Descriptions>
			<Descriptions
				column={1}
				colon={false}
				layout='horizontal'
				className='sv-profile-detail-descriptions'
				title={`${intl.formatMessage({ id: 'thongtincanhan.hoso.permanentAddress' })}:`}
			>
				{renderDescription(`${intl.formatMessage({ id: 'thongtincanhan.hoso.postalCode' })}:`, postalCode)}
				{renderDescription(`${intl.formatMessage({ id: 'thongtincanhan.hoso.diachi.tp' })}:`, record?.tinhTpThuongTru)}
				{renderDescription(
					`${intl.formatMessage({ id: 'thongtincanhan.hoso.diachi.quan' })}:`,
					record?.quanHuyenThuongTru,
				)}
				{renderDescription(
					`${intl.formatMessage({ id: 'thongtincanhan.hoso.diachi.xa' })}:`,
					record?.xaPhuongThuongTru,
				)}
				{renderDescription(
					`${intl.formatMessage({ id: 'thongtincanhan.hoso.diachi.chitiet' })}:`,
					record?.soNhaTenDuongThuongTru,
				)}
			</Descriptions>

			{/* <Text strong style={{ display: 'block', marginBottom: 8 }}>
				{intl.formatMessage({ id: 'thongtincanhan.hoso.permanentAddress' })}:
			</Text>
			<ul className='sv-profile-list'>
				<li>
					{intl.formatMessage({ id: 'thongtincanhan.hoso.diachi.tp' })}: {record?.tinhTpThuongTru || '--'}
				</li>
				<li>
					{intl.formatMessage({ id: 'thongtincanhan.hoso.diachi.xa' })}: {record?.xaPhuongThuongTru || '--'}
				</li>
				<li>
					{intl.formatMessage({ id: 'thongtincanhan.hoso.diachi.chitiet' })}: {record?.soNhaTenDuongThuongTru || '--'}
				</li>
			</ul> */}

			<SectionTitle title={intl.formatMessage({ id: 'thongtincanhan.hoso.academicInfo' })} />
			<Descriptions column={1} colon={false} layout='horizontal' className='sv-profile-detail-descriptions'>
				{renderDescription(
					`${intl.formatMessage({ id: 'thongtincanhan.hoso.college' })}:`,
					record?.nganh?.donVi?.ten ?? record?.csdt?.ten,
					false,
				)}
				{renderDescription(
					`${intl.formatMessage({ id: 'thongtincanhan.hoso.trainingProgram' })}:`,
					record?.khoaNganh?.chuongTrinh?.ten ?? record?.nganh?.ten,
					false,
				)}
				{renderDescription(
					`${intl.formatMessage({ id: 'thongtincanhan.hoso.cohortMajor' })}:`,
					<>
						{record?.khoaNganh?.ten ?? '--'}
						{record?.nganh?.ten ? ` - ${record.nganh.ten}` : ''}
					</>,
					false,
				)}
				{renderDescription(
					`${intl.formatMessage({ id: 'thongtincanhan.hoso.concentration' })}:`,
					record?.chuyenNganh?.ten ?? record?.maChuyenNganh ?? '--',
					false,
				)}
				{record?.chuyenNganh2?.ten || record?.khoaNganh2?.ten
					? renderDescription(
							`${intl.formatMessage({ id: 'thongtincanhan.hoso.minor' })}:`,
							record?.chuyenNganh2?.ten ?? record?.khoaNganh2?.ten,
							false,
						)
					: null}
			</Descriptions>
		</Card>
	);

	return (
		<Spin spinning={loading}>
			<Row gutter={[8, 8]}>
				<Col xs={24} lg={8}>
					{leftPanel}
				</Col>
				<Col xs={24} lg={16}>
					{rightPanel}
				</Col>
			</Row>

			{/* <Splitter
				layout={isMobile ? 'vertical' : 'horizontal'}
				style={{ minHeight: 560, background: 'transparent' }}
			>
				<Splitter.Panel defaultSize='30%' min='25%' max='40%'>
					{leftPanel}
				</Splitter.Panel>
				<Splitter.Panel defaultSize='70%' min='50%'>
					{rightPanel}
				</Splitter.Panel>
			</Splitter> */}
		</Spin>
	);
};

export default PreviewHoSo;
