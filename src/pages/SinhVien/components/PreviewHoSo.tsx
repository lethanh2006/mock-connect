import { colorTrangThaiHocSv, genderMessageIds, trangThaiHocSv } from '@/services/DaoTao/constant';
import { placeOfBirthTypeMessageIds } from '@/services/DaoTao/SinhVien/constants';
import { formatDate } from '@/utils/formatDate';
import { formatPhoneNumber } from '@/utils/utils';
import { Card, Col, Divider, Flex, Image, Row, Spin, Tag, Typography } from 'antd';
// import { Card, Descriptions, Divider, Flex, Image, Spin, Splitter, Typography } from 'antd';
import { useEffect, type ReactNode } from 'react';
import { getLocale, useIntl, useModel } from 'umi';
// import { useMediaQuery } from 'react-responsive';

const { Text, Title } = Typography;

const SectionTitle = ({ title }: { title: string }) => (
	<Divider orientation='left' dashed className='divider-big-title'>
		{title}
	</Divider>
);

const ProfileGroupTitle = ({ children }: { children: ReactNode }) => (
	<Text className='sv-profile-group-title'>{children}</Text>
);

type ExtraStudentProfile = Partial<{
	passportNumber: string;
	postalCode: string;
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
	const locale = getLocale();

	const { record, loading } = useModel('sinhvien.sinhvien');
	// const { danhSach: danhSachQuocTich, getAllModel } = useModel('core.quoctich');
	const extraRecord = record as ExtraStudentProfile | undefined;
	const { getChuongTrinhHienTaiModel, chuongTrinhHienTai } = useModel('daotao.chuongtrinhdaotao');
	// const isMobile = useMediaQuery({ query: '(max-width: 767px)' });

	// useEffect(() => {
	// 	if (!danhSachQuocTich.length) getAllModel();
	// }, []);

	useEffect(() => {
		if (record?.khoaNganh?.ma) {
			getChuongTrinhHienTaiModel(record?.khoaNganh?.ma);
		}
	}, [record?.khoaNganh?.ma]);

	const renderValue = (value?: ReactNode, highlight = false) => {
		if (value === undefined || value === null || value === '') return '--';

		return (
			<Text strong style={highlight ? { color: 'var(--color-primary)' } : undefined}>
				{value}
			</Text>
		);
	};

	const renderProfileField = (label: ReactNode, value?: ReactNode, highlight = false) => (
		<div className='sv-profile-field'>
			<Text type='secondary' className='sv-profile-field-label'>
				{label}
			</Text>
			<div className='sv-profile-field-value'>{renderValue(value, highlight)}</div>
		</div>
	);

	const passportNumber = extraRecord?.passportNumber;
	const postalCode = extraRecord?.postalCode;
	const formatEnumMessage = <T extends string>(messageIds: Partial<Record<T, string>>, value?: T) =>
		value && messageIds[value] ? intl.formatMessage({ id: messageIds[value] }) : value;
	const getLocalizedName = (value: any) =>
		locale === 'vi-VN' ? (value?.ten ?? value?.tenTiengAnh) : (value?.tenTiengAnh ?? value?.ten);

	const leftPanel = (
		<Card variant='borderless'>
			<div className='sv-profile-summary'>
				<Flex vertical align='center' gap={8}>
					<div className='avatar-container'>
						<Image src={record?.anhDaiDienUrl ?? '/student/metadata.png'} />
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

			<div className='sv-profile-field-list sv-profile-field-list-left'>
				{renderProfileField(`${intl.formatMessage({ id: 'thongtincanhan.hoso.masv' })}:`, record?.ma)}
				{renderProfileField(
					`${intl.formatMessage({ id: 'thongtincanhan.hoso.gioitinh' })}:`,
					formatEnumMessage(genderMessageIds, record?.gioiTinh),
				)}
				{renderProfileField(
					`${intl.formatMessage({ id: 'thongtincanhan.hoso.ngaysinh' })}:`,
					formatDate(record?.ngaySinh),
				)}
				{renderProfileField(`${intl.formatMessage({ id: 'thongtincanhan.hoso.email' })}:`, record?.email)}
				{renderProfileField(
					`${intl.formatMessage({ id: 'thongtincanhan.hoso.sdt' })}:`,
					record?.soDienThoai ? formatPhoneNumber(record.soDienThoai) : undefined,
				)}
				{renderProfileField(`${intl.formatMessage({ id: 'thongtincanhan.hoso.quoctich' })}:`, record?.quocTich)}
				{renderProfileField(`${intl.formatMessage({ id: 'thongtincanhan.hoso.dantoc' })}:`, record?.danToc)}
				{renderProfileField(`${intl.formatMessage({ id: 'thongtincanhan.hoso.tongiao' })}:`, record?.tonGiao)}
			</div>

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
			<div className='sv-profile-field-list'>
				<ProfileGroupTitle>
					{intl.formatMessage({ id: 'thongtincanhan.hoso.nationalIdentification' })}
				</ProfileGroupTitle>
				{renderProfileField(`${intl.formatMessage({ id: 'thongtincanhan.hoso.idNumber' })}:`, record?.cccd)}
				{renderProfileField(
					`${intl.formatMessage({ id: 'thongtincanhan.hoso.ngaycap' })}:`,
					formatDate(record?.ngayCapCccd),
				)}
				{renderProfileField(`${intl.formatMessage({ id: 'thongtincanhan.hoso.noicap' })}:`, record?.noiCapCccd)}
			</div>
			<div className='sv-profile-field-list'>
				<ProfileGroupTitle>
					{intl.formatMessage({ id: 'thongtincanhan.hoso.passportIdentification' })}
				</ProfileGroupTitle>
				{renderProfileField(`${intl.formatMessage({ id: 'thongtincanhan.hoso.passportNumber' })}:`, passportNumber)}
			</div>

			<SectionTitle title={intl.formatMessage({ id: 'thongtincanhan.hoso.addressInfo' })} />
			<div className='sv-profile-field-list'>
				<ProfileGroupTitle>{`${intl.formatMessage({ id: 'thongtincanhan.hoso.placeOfBirth' })}:`}</ProfileGroupTitle>
				{renderProfileField(
					`${intl.formatMessage({ id: 'thongtincanhan.hoso.birthplaceType' })}:`,
					formatEnumMessage(placeOfBirthTypeMessageIds, record?.loaiNoiSinh),
				)}
				{renderProfileField(
					`${intl.formatMessage({ id: 'thongtincanhan.hoso.diachi.tp' })}:`,
					record?.tinhTpNoiSinh || record?.quocGiaNoiSinh,
				)}
			</div>
			<div className='sv-profile-field-list'>
				<ProfileGroupTitle>{`${intl.formatMessage({ id: 'thongtincanhan.hoso.nativePlace' })}:`}</ProfileGroupTitle>
				{renderProfileField(`${intl.formatMessage({ id: 'thongtincanhan.hoso.diachi.tp' })}:`, record?.tinhTpQueQuan)}
				{renderProfileField(
					`${intl.formatMessage({ id: 'thongtincanhan.hoso.diachi.quan' })}:`,
					record?.quanHuyenQueQuan,
				)}
				{renderProfileField(`${intl.formatMessage({ id: 'thongtincanhan.hoso.diachi.xa' })}:`, record?.xaPhuongQueQuan)}
			</div>
			<div className='sv-profile-field-list'>
				<ProfileGroupTitle>{`${intl.formatMessage({ id: 'thongtincanhan.hoso.permanentAddress' })}:`}</ProfileGroupTitle>
				{renderProfileField(`${intl.formatMessage({ id: 'thongtincanhan.hoso.postalCode' })}:`, postalCode)}
				{renderProfileField(`${intl.formatMessage({ id: 'thongtincanhan.hoso.diachi.tp' })}:`, record?.tinhTpThuongTru)}
				{renderProfileField(
					`${intl.formatMessage({ id: 'thongtincanhan.hoso.diachi.quan' })}:`,
					record?.quanHuyenThuongTru,
				)}
				{renderProfileField(
					`${intl.formatMessage({ id: 'thongtincanhan.hoso.diachi.xa' })}:`,
					record?.xaPhuongThuongTru,
				)}
				{renderProfileField(
					`${intl.formatMessage({ id: 'thongtincanhan.hoso.diachi.chitiet' })}:`,
					record?.soNhaTenDuongThuongTru,
				)}
			</div>

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
			<div className='sv-profile-field-list'>
				{renderProfileField(
					`${intl.formatMessage({ id: 'thongtincanhan.hoso.college' })}:`,
					record?.nganh?.donVi?.ten ?? record?.nganh?.tenDonViPhuTrach ?? record?.nganh?.maDonVi,
				)}
				{renderProfileField(
					`${intl.formatMessage({ id: 'thongtincanhan.hoso.trainingProgram' })}:`,
					getLocalizedName(chuongTrinhHienTai ?? '--'),
				)}
				{renderProfileField(
					`${intl.formatMessage({ id: 'thongtincanhan.hoso.major' })}:`,
					getLocalizedName(record?.nganh) ?? record?.maNganh,
				)}
				{record?.chuyenNganh?.ten || record?.maChuyenNganh
					? renderProfileField(
							`${intl.formatMessage({ id: 'thongtincanhan.hoso.concentration' })}:`,
							record?.chuyenNganh?.ten ?? record?.maChuyenNganh ?? '--',
						)
					: null}
				{record?.chuyenNganh2?.ten || record?.khoaNganh2?.ten
					? renderProfileField(
							`${intl.formatMessage({ id: 'thongtincanhan.hoso.minor' })}:`,
							record?.chuyenNganh2?.ten ?? record?.khoaNganh2?.ten,
						)
					: null}
			</div>
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
