import TableBase from '@/components/Table';
import { EOperatorType } from '@/components/Table/constant';
import type { IColumn, TFilter } from '@/components/Table/typing';
import {
	colorTrangThaiDangKyChuyenNganh,
	ETrangThaiDangKyChuyenNganh,
	trangThaiDangKyChuyenNganh,
} from '@/services/DaoTao/DangKyChuyenNganh/constant';
import { ELoaiPhieuDkCtdt } from '@/services/DaoTao/PhieuDkyCTDT/constant';
import { PhieuDkCtdt } from '@/services/DaoTao/PhieuDkyCTDT/typing';
import dayjs from '@/utils/dayjs';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Modal, Popconfirm, Tag, Tooltip } from 'antd';
import { useEffect, useState } from 'react';
import { history, useIntl, useModel } from 'umi';
import DanhSachChuyenNganhList from '../Register/components/DanhSachChuyenNganhList';
import AlertBanners from './components/AlertBanners';
import StudentInfoCard from './components/StudentInfoCard';

const DangKyChuyenNganhPage = ({ type }: { type: 'minor' | 'concentration' }) => {
	const intl = useIntl();
	const { phieuDangKyTheoDot, getModel, page, limit, fetchPhieuDangKyTheoDot, deleteModel } = useModel(
		'sinhvien.dangkychuyennganh.dangkychuyennganh',
	);
	const { record: dotDangKy, fetchDotDangKy, isRegistrationOpen } = useModel('daotao.dotdkctdt');
	const [minorListModalOpen, setMinorListModalOpen] = useState(false);

	const getData = () => {
		const filterParams: TFilter<PhieuDkCtdt.UpdatePhieuDkCtdtMeDto>[] = [
			{
				field: ['dot', 'loaiCtdt'],
				operator: EOperatorType.EQUAL,
				values: [type],
			},
		];
		return getModel(undefined, filterParams, undefined, undefined, undefined, 'me/page');
	};

	useEffect(() => {
		fetchDotDangKy(type);
		getData();
	}, [type]);

	useEffect(() => {
		if (dotDangKy?._id && dotDangKy?.loaiCtdt === type) {
			fetchPhieuDangKyTheoDot(dotDangKy._id);
		}
	}, [dotDangKy?._id, dotDangKy?.loaiCtdt, type]);

	const loaiDisplay: Partial<Record<ELoaiPhieuDkCtdt, { label: string; color: string }>> = {
		[ELoaiPhieuDkCtdt.PERSONAL]: { label: type === 'concentration' ? 'IDC' : 'IDM', color: 'var(--color-primary)' },
		[ELoaiPhieuDkCtdt.DEFAULT]: { label: 'Standard', color: '#CE7C1E' },
	};

	const canDeleteRegistration = (status?: ETrangThaiDangKyChuyenNganh) => status === ETrangThaiDangKyChuyenNganh.NHAP;

	const canEditRegistration = (status?: ETrangThaiDangKyChuyenNganh) =>
		[
			ETrangThaiDangKyChuyenNganh.NHAP,
			ETrangThaiDangKyChuyenNganh.CHO_DUYET,
			ETrangThaiDangKyChuyenNganh.YEU_CAU_CHINH_SUA,
		].includes(status as ETrangThaiDangKyChuyenNganh);

	const handleDeleteRegistration = async (rec: PhieuDkCtdt.UpdatePhieuDkCtdtMeDto) => {
		await deleteModel(rec._id as string, getData, undefined, {
			messageText: intl.formatMessage({ id: 'global.message.xoathanhcong' }),
		});
		if (phieuDangKyTheoDot?._id === rec._id && dotDangKy?._id) {
			await fetchPhieuDangKyTheoDot(dotDangKy._id);
		}
	};

	const columns: IColumn<PhieuDkCtdt.UpdatePhieuDkCtdtMeDto>[] = [
		{
			title: intl.formatMessage({ id: 'hoctapkhac.dangkychuyennganh.chuyennganh.tablecolumntitle' }),
			dataIndex: 'tenChuongTrinh',
			width: 200,
			render: (val, rec) => rec.chuyenNganh?.ten || rec.tenChuongTrinh || rec.ctdt?.ten || val,
		},
		{
			title: intl.formatMessage({ id: 'hoctapkhac.dangkychuyennganh.chuyennganh.tendotdangky' }),
			dataIndex: ['dot', 'ten'],
			width: 200,
		},
		{
			title: intl.formatMessage({ id: 'minor.history.type' }),
			dataIndex: 'loai',
			align: 'center',
			width: 80,
			render: (val: ELoaiPhieuDkCtdt) => {
				const { label, color } = loaiDisplay[val] ?? { label: '-', color: '' };
				return <span style={{ fontWeight: 'bold', color }}>{label}</span>;
			},
		},
		{
			title: intl.formatMessage({ id: 'minor.history.endDate' }),
			dataIndex: 'ngayNop',
			align: 'center',
			width: 120,
			render: (val, rec) => val && dayjs(val).format('HH:mm DD/MM/YYYY'),
		},
		{
			title: intl.formatMessage({ id: 'hoctapkhac.dangkychuyennganh.trangthai.tablecolumntitle' }),
			dataIndex: 'trangThai',
			align: 'center',
			width: 120,
			render: (val: ETrangThaiDangKyChuyenNganh) => (
				<Tag color={colorTrangThaiDangKyChuyenNganh[val]}>{trangThaiDangKyChuyenNganh[val]}</Tag>
			),
		},
		{
			title: intl.formatMessage({ id: 'hoctapkhac.dangkychuyennganh.capnhat.tablecolumntitle' }),
			width: 120,
			align: 'center',
			dataIndex: 'updatedAt',
			render: (val) => val && dayjs(val).format('HH:mm DD/MM/YYYY'),
		},
		{
			title: intl.formatMessage({ id: 'hoctapkhac.dangkychuyennganh.thaotac.tablecolumntitle' }),
			align: 'center',
			width: 120,
			fixed: 'right',
			render: (val, rec) => (
				<>
					<Tooltip title={intl.formatMessage({ id: 'minor.history.viewDetail' })}>
						<Button
							type='link'
							icon={<EyeOutlined />}
							onClick={() => {
								history.push(`/hoc-tap/dang-ky-chuyen-nganh/${rec._id}?loai=${type}`);
							}}
						/>
					</Tooltip>
					{canEditRegistration(rec.trangThai as ETrangThaiDangKyChuyenNganh) && (
						<Tooltip title={intl.formatMessage({ id: 'minor.idm.action.edit' })}>
							<Button
								type='link'
								icon={<EditOutlined />}
								onClick={() => {
									history.push(`/hoc-tap/dang-ky-chuyen-nganh/register?id=${rec._id}&loai=${type}`);
								}}
							/>
						</Tooltip>
					)}
					{canDeleteRegistration(rec.trangThai as ETrangThaiDangKyChuyenNganh) && (
						<Tooltip title={intl.formatMessage({ id: 'minor.idm.action.delete' })}>
							<Popconfirm
								title={intl.formatMessage({ id: 'minor.idm.popconfirm.deleteConfirm' })}
								okText={intl.formatMessage({ id: 'global.button.xacnhan' })}
								cancelText={intl.formatMessage({ id: 'global.button.huy' })}
								onConfirm={() => handleDeleteRegistration(rec)}
							>
								<Button type='link' danger icon={<DeleteOutlined />} />
							</Popconfirm>
						</Tooltip>
					)}
				</>
			),
		},
	];

	return (
		<>
			<div style={{ marginBottom: 8 }}>
				<AlertBanners
					buttonRegister={
						isRegistrationOpen &&
						!!dotDangKy &&
						(!phieuDangKyTheoDot || phieuDangKyTheoDot?.trangThai === ETrangThaiDangKyChuyenNganh.NHAP)
					}
					type={type}
				/>
			</div>
			{isRegistrationOpen && (
				<div style={{ marginBottom: 8 }}>
					<StudentInfoCard type={type} />
				</div>
			)}

			<TableBase
				columns={columns}
				dependencies={[page, limit]}
				getData={getData}
				modelName='sinhvien.dangkychuyennganh.dangkychuyennganh'
				formProps={{ getData }}
				hideCard
				otherButtons={[
					<Button onClick={() => setMinorListModalOpen(true)} key='dangky'>
						{' '}
						{type === 'minor'
							? intl.formatMessage({ id: 'minor.history.viewListMinor' })
							: intl.formatMessage({ id: 'minor.history.viewListConcentration' })}
					</Button>,
				]}
				buttons={{ create: false }}
			/>

			<Modal
				title={
					type === 'minor'
						? intl.formatMessage({ id: 'minor.title.minor' })
						: intl.formatMessage({ id: 'minor.title.concentration' })
				}
				open={minorListModalOpen}
				onCancel={() => setMinorListModalOpen(false)}
				footer={null}
				width={1200}
				destroyOnClose
			>
				<DanhSachChuyenNganhList isMinor={type === 'minor'} hiddenButton={true} />
			</Modal>
		</>
	);
};

export default DangKyChuyenNganhPage;
