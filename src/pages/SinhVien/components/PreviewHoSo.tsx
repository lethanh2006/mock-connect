import { IconBookOpen, IconFile, IconInfoCircle, IconRoofedHouse } from '@/components/Icons';
import AuthImage from '@/components/Image/AuthImage';
import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import { colorTrangThaiHocSv, genderMessageIds, trangThaiHocSv } from '@/services/DaoTao/constant';
import { EGiayToCanNopType } from '@/services/DaoTao/DotNhapHoc/constant';
import { placeOfBirthTypeMessageIds } from '@/services/DaoTao/SinhVien/constants';
import { formatDate } from '@/utils/formatDate';
import { getPublicAssetPath } from '@/utils/path';
import { getSafeHref } from '@/utils/security';
import { formatPhoneNumber, getNameFile } from '@/utils/utils';
import { CheckCircleFilled } from '@ant-design/icons';
import { Spin, Typography } from 'antd';
import { Fragment, useEffect, useMemo, type ReactNode } from 'react';
import { getLocale, useIntl, useModel } from 'umi';

const { Link } = Typography;

const SectionTitle = ({ icon, title }: { icon: ReactNode; title: string }) => (
	<div className='sv-profile-section-title'>
		{icon}
		<span>{title}</span>
	</div>
);

const ProfileGroupTitle = ({ children }: { children: ReactNode }) => (
	<span className='sv-profile-group-title'>{children}</span>
);

type ExtraStudentProfile = Partial<{
	passportNumber: string;
	postalCode: string;
}>;

const PreviewHoSo = (_props: { header?: ReactNode }) => {
	const intl = useIntl();
	const locale = getLocale();

	const { record, loading } = useModel('sinhvien.sinhvien');
	const { getChuongTrinhHienTaiModel, chuongTrinhHienTai } = useModel('daotao.chuongtrinhdaotao');
	const extraRecord = record as ExtraStudentProfile | undefined;

	useEffect(() => {
		if (record?.khoaNganh?.ma) {
			getChuongTrinhHienTaiModel(record.khoaNganh.ma);
		}
	}, [record?.khoaNganh?.ma]);

	const t = (id: string) => intl.formatMessage({ id });

	const renderValue = (value?: ReactNode) => {
		if (value === undefined || value === null || value === '') return '-.-';
		return value;
	};

	const renderProfileField = (label: ReactNode, value?: ReactNode) => (
		<div className='sv-profile-field'>
			<span className='sv-profile-field-label'>{label}</span>
			<div className='sv-profile-field-value'>{renderValue(value)}</div>
		</div>
	);

	const passportNumber = extraRecord?.passportNumber;
	const postalCode = extraRecord?.postalCode;
	const formatEnumMessage = <T extends string>(messageIds: Partial<Record<T, string>>, value?: T) =>
		value && messageIds[value] ? intl.formatMessage({ id: messageIds[value] }) : value;
	const getLocalizedName = (value: any) =>
		locale === 'vi-VN' ? (value?.ten ?? value?.tenTiengAnh) : (value?.tenTiengAnh ?? value?.ten);
	const statusColor = record?.trangThaiHoc ? colorTrangThaiHocSv[record.trangThaiHoc] : 'blue';

	const documentRows = useMemo(() => {
		type TGiayTo = {
			id?: string;
			ten: string;
			huongDan: string;
			urlFileHuongDan: string;
			soLuong: number;
			type: EGiayToCanNopType[];
			required?: boolean;
		};

		const templates: TGiayTo[] = record?.dotNhapHoc?.danhSachGiayToNhapHoc ?? [];
		const uploadedMap = new Map(
			(record?.hoSoNhapHoc?.danhSachGiayToNhapHoc ?? []).map((item) => [item.id, item.urlFile]),
		);

		return templates.map((item) => ({
			...item,
			urlFile: item.id ? uploadedMap.get(item.id) : undefined,
		}));
	}, [record?.dotNhapHoc?.danhSachGiayToNhapHoc, record?.hoSoNhapHoc?.danhSachGiayToNhapHoc]);

	const documentColumns: IColumn<(typeof documentRows)[number]>[] = useMemo(
		() => [
			{
				title: intl.formatMessage({ id: 'global.enrollmentDeclaration.docTable.name' }),
				dataIndex: 'ten',
				width: 180,
			},
			{
				title: intl.formatMessage({ id: 'global.enrollmentDeclaration.docTable.quantity' }),
				dataIndex: 'soLuong',
				width: 90,
				align: 'center',
			},
			{
				title: intl.formatMessage({ id: 'global.enrollmentDeclaration.docTable.required' }),
				dataIndex: 'required',
				width: 90,
				align: 'center',
				render: (required?: boolean) => (required ? <CheckCircleFilled style={{ color: '#57a443' }} /> : null),
			},
			{
				title: intl.formatMessage({ id: 'global.enrollmentDeclaration.docTable.type' }),
				dataIndex: 'type',
				width: 120,
				render: (type?: EGiayToCanNopType[]) =>
					type?.map((item) => (
						<div key={item}>
							{item === EGiayToCanNopType.BAN_MEM
								? intl.formatMessage({ id: 'global.enrollmentDeclaration.docTable.typeSoft' })
								: intl.formatMessage({ id: 'global.enrollmentDeclaration.docTable.typeHard' })}
						</div>
					)),
			},
			{
				title: intl.formatMessage({ id: 'global.enrollmentDeclaration.docTable.notes' }),
				dataIndex: 'huongDan',
				width: 180,
				render: (huongDan: string | undefined, row: (typeof documentRows)[number]) => {
					const href = getSafeHref(row.urlFileHuongDan);

					return (
						<Fragment>
							{huongDan}
							{href && (
								<div>
									<a href={href} target='_blank' rel='noreferrer'>
										{intl.formatMessage({ id: 'global.enrollmentDeclaration.docTable.viewSample' })}
									</a>
								</div>
							)}
						</Fragment>
					);
				},
			},
			{
				title: intl.formatMessage({ id: 'global.enrollmentDeclaration.docTable.attachment' }),
				dataIndex: 'urlFile',
				width: 160,
				render: (_urlFile: string | undefined, row: (typeof documentRows)[number]) => {
					const href = getSafeHref(row.urlFile);
					return href ? (
						<Link href={href} target='_blank' rel='noreferrer'>
							{getNameFile(row.urlFile!)}
						</Link>
					) : (
						'--'
					);
				},
			},
		],
		[intl],
	);

	return (
		<Spin spinning={loading}>
			<div className='sv-profile-card'>
				<aside className='sv-profile-menu'>
					<div className='sv-profile-summary'>
						<div className='sv-profile-avatar'>
							<AuthImage src={record?.anhDaiDienUrl ?? undefined} fallback={getPublicAssetPath('/metadata.png')} />
							<span className='sv-profile-avatar-outline' />
						</div>
						<div className='sv-profile-headline'>
							<span className='sv-profile-role'>{t('thongtincanhan.hoso.role')}</span>
							<span className='sv-profile-name'>{renderValue(record?.ten)}</span>
							<span className='sv-profile-email'>{renderValue(record?.email)}</span>
							<span className={`sv-profile-status is-${statusColor}`}>
								{formatEnumMessage(trangThaiHocSv, record?.trangThaiHoc) ?? '-.-'}
							</span>
						</div>
					</div>

					<section className='sv-profile-block'>
						<div className='sv-profile-divider' />
						<SectionTitle icon={<IconInfoCircle size={24} />} title={t('thongtincanhan.hoso.generalInfo')} />
						<div className='sv-profile-fields'>
							{renderProfileField(t('thongtincanhan.hoso.hoten'), record?.ten)}
							{renderProfileField(t('thongtincanhan.hoso.masv'), record?.ma)}
							{renderProfileField(
								t('thongtincanhan.hoso.gioitinh'),
								formatEnumMessage(genderMessageIds, record?.gioiTinh),
							)}
							{renderProfileField(t('thongtincanhan.hoso.ngaysinh'), formatDate(record?.ngaySinh))}
							{renderProfileField(t('thongtincanhan.hoso.email'), record?.email)}
							{renderProfileField(
								t('thongtincanhan.hoso.sdt'),
								record?.soDienThoai ? formatPhoneNumber(record.soDienThoai) : undefined,
							)}
							{renderProfileField(t('thongtincanhan.hoso.quoctich'), record?.quocTich)}
							{renderProfileField(t('thongtincanhan.hoso.dantoc'), record?.danToc)}
							{renderProfileField(t('thongtincanhan.hoso.tongiao'), record?.tonGiao)}
						</div>
					</section>
				</aside>

				<div className='sv-profile-body'>
					<section className='sv-profile-block'>
						<SectionTitle icon={<IconInfoCircle size={24} />} title={t('thongtincanhan.hoso.identity')} />
						<div>
							<ProfileGroupTitle>{t('thongtincanhan.hoso.nationalIdentification')}</ProfileGroupTitle>
							<div className='sv-profile-grid'>
								{renderProfileField(t('thongtincanhan.hoso.idNumber'), record?.cccd)}
								{renderProfileField(t('thongtincanhan.hoso.ngaycap'), formatDate(record?.ngayCapCccd))}
								{renderProfileField(t('thongtincanhan.hoso.noicap'), record?.noiCapCccd)}
							</div>
						</div>
						<div>
							<ProfileGroupTitle>{t('thongtincanhan.hoso.passportIdentification')}</ProfileGroupTitle>
							<div className='sv-profile-grid'>
								{renderProfileField(t('thongtincanhan.hoso.passportNumber'), passportNumber)}
							</div>
						</div>
						<div className='sv-profile-divider' />
					</section>

					<section className='sv-profile-block'>
						<SectionTitle icon={<IconRoofedHouse size={24} />} title={t('thongtincanhan.hoso.addressInfo')} />
						<div>
							<ProfileGroupTitle>{t('thongtincanhan.hoso.placeOfBirth')}</ProfileGroupTitle>
							<div className='sv-profile-grid'>
								{renderProfileField(
									t('thongtincanhan.hoso.birthplaceType'),
									formatEnumMessage(placeOfBirthTypeMessageIds, record?.loaiNoiSinh),
								)}
								{renderProfileField(
									t('thongtincanhan.hoso.diachi.tp'),
									record?.tinhTpNoiSinh || record?.quocGiaNoiSinh,
								)}
							</div>
						</div>
						<div>
							<ProfileGroupTitle>{t('thongtincanhan.hoso.nativePlace')}</ProfileGroupTitle>
							<div className='sv-profile-grid'>
								{renderProfileField(t('thongtincanhan.hoso.diachi.tp'), record?.tinhTpQueQuan)}
								{renderProfileField(t('thongtincanhan.hoso.diachi.quan'), record?.quanHuyenQueQuan)}
								{renderProfileField(t('thongtincanhan.hoso.diachi.xa'), record?.xaPhuongQueQuan)}
							</div>
						</div>
						<div>
							<ProfileGroupTitle>{`${t('thongtincanhan.hoso.permanentAddress')}:`}</ProfileGroupTitle>
							<div className='sv-profile-grid'>
								{renderProfileField(t('thongtincanhan.hoso.postalCode'), postalCode)}
								{renderProfileField(t('thongtincanhan.hoso.diachi.tp'), record?.tinhTpThuongTru)}
								{renderProfileField(t('thongtincanhan.hoso.diachi.quan'), record?.quanHuyenThuongTru)}
								{renderProfileField(t('thongtincanhan.hoso.diachi.xa'), record?.xaPhuongThuongTru)}
								{renderProfileField(t('thongtincanhan.hoso.diachi.chitiet'), record?.soNhaTenDuongThuongTru)}
							</div>
						</div>
						<div className='sv-profile-divider' />
					</section>

					<section className='sv-profile-block'>
						<SectionTitle icon={<IconBookOpen size={24} />} title={t('thongtincanhan.hoso.academicInfo')} />
						<div className='sv-profile-grid'>
							{renderProfileField(
								t('thongtincanhan.hoso.college'),
								record?.nganh?.donVi?.ten ?? record?.nganh?.tenDonViPhuTrach ?? record?.nganh?.maDonVi,
							)}
							{renderProfileField(t('thongtincanhan.hoso.trainingProgram'), getLocalizedName(chuongTrinhHienTai))}
							{renderProfileField(t('thongtincanhan.hoso.major'), getLocalizedName(record?.nganh) ?? record?.maNganh)}
							{record?.chuyenNganh?.ten || record?.maChuyenNganh
								? renderProfileField(
										t('thongtincanhan.hoso.concentration'),
										record?.chuyenNganh?.ten ?? record?.maChuyenNganh,
									)
								: null}
							{record?.chuyenNganh2?.ten || record?.khoaNganh2?.ten
								? renderProfileField(
										t('thongtincanhan.hoso.minor'),
										record?.chuyenNganh2?.ten ?? record?.khoaNganh2?.ten,
									)
								: null}
						</div>
						<div className='sv-profile-divider' />
					</section>

					<section className='sv-profile-block'>
						<SectionTitle icon={<IconFile size={24} />} title={t('thongtincanhan.hoso.documents')} />
						<div className='sv-profile-table'>
							<TableStaticData
								columns={documentColumns}
								data={documentRows}
								size='small'
								addStt
								globalSearch={false}
								columnSetting={false}
								otherProps={{ pagination: false }}
							/>
						</div>
					</section>
				</div>
			</div>
		</Spin>
	);
};

export default PreviewHoSo;
