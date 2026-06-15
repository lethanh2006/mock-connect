import ButtonExtend from '@/components/Table/ButtonExtend';
import ModalExpandable from '@/components/Table/ModalExpandable';
import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';
import type { DangKyNhuCau } from '@/services/DaoTao/DangKyNhuCau/typing';
import {
	colorTrangThaiHocPhanDangKyNhuCau,
	mapTrangThaiHocPhanDangKyNhuCau,
	type ETrangThaiHocPhanDangKyNhuCau,
} from '@/services/DaoTao/constant';
import dayjs from '@/utils/dayjs';
import { formatDate } from '@/utils/formatDate';
import { DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Alert, Popconfirm, Tag } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import FormDangKyNhuCau from './Form';

const NhuCauHocPhanPage = () =>
	// props: { khoaNganhTrongDot: boolean }
	{
		const intl = useIntl();
		const { record: recDot } = useModel('daotao.dangkynhucau.dotdangky');
		const {
			getModel,
			// page,
			// limit,
			deleteModel,
			danhSach,
			loading,
			setRecord,
			setEdit,
			setIsView,
			setVisibleForm,
			visibleForm,
		} = useModel('daotao.dangkynhucau.hocphannhucau');
		// const { maKhoaNganh } = useModel('sinhvien.sinhvien');
		// const { khoaNganhTrongDot } = props;

		const getData = () =>
			// { maKhoaNganh }
			recDot?._id && getModel(undefined, undefined, undefined, undefined, 100, `me/dot/${recDot?._id}`);

		const ngoaiThoiGian =
			!recDot?.thoiGianBatDau ||
			!recDot?.thoiGianKetThuc ||
			dayjs().isBefore(dayjs(recDot?.thoiGianBatDau), 'day') ||
			dayjs().isAfter(dayjs(recDot?.thoiGianKetThuc), 'day');

		useEffect(() => {
			getData();
		}, [
			// maKhoaNganh,
			recDot?._id,
		]);

		const columns: IColumn<DangKyNhuCau.IHocPhanDangKyNhuCau & { soLuongDangKy: number }>[] = [
			{
				title: intl.formatMessage({ id: 'dangkyhoctap.table.maHP' }),
				width: 80,
				dataIndex: 'maHocPhan',
			},
			{
				title: intl.formatMessage({ id: 'dangkyhoctap.table.hocPhan' }),
				width: 150,
				dataIndex: 'maHocPhan',
				render: (val, rec) => rec.hocPhan?.ten,
			},
			{
				title: intl.formatMessage({ id: 'dangkyhoctap.table.soTinChi' }),
				width: 60,
				align: 'center',
				render: (val, rec) => rec.hocPhan?.soTinChi,
			},
			{
				title: intl.formatMessage({ id: 'dangkyhoctap.table.soSVDangKy' }),
				width: 60,
				align: 'center',
				dataIndex: 'soLuongDangKy',
				render: (val) => (
					<Tag color={val >= 30 ? 'green' : val >= 20 ? 'yellow' : 'red'}>
						{val} {intl.formatMessage({ id: 'dangkyhoctap.label.sv' })}
					</Tag>
				),
			},
			{
				title: intl.formatMessage({ id: 'dangkyhoctap.table.khoaNganh' }),
				width: 120,
				render: (val, rec) => rec.phieuDangKyHocNhuCau?.khoaNganh?.ten,
			},
			{
				title: intl.formatMessage({ id: 'dangkyhoctap.table.trangThai' }),
				dataIndex: 'trangThai',
				align: 'center',
				width: 90,
				render: (val) => (
					<Tag color={colorTrangThaiHocPhanDangKyNhuCau[val as ETrangThaiHocPhanDangKyNhuCau]}>
						{intl.formatMessage({
							id: mapTrangThaiHocPhanDangKyNhuCau[val as ETrangThaiHocPhanDangKyNhuCau],
						})}
					</Tag>
				),
			},
			{
				title: intl.formatMessage({ id: 'dangkyhoctap.table.thaoTac' }),
				align: 'center',
				width: 60,
				render: (val, rec) => (
					<Popconfirm
						onConfirm={() => deleteModel(`${rec?._id}/me`, getData)}
						title={intl.formatMessage({ id: 'dangkyhoctap.confirm.xoa' })}
						placement='topLeft'
					>
						<ButtonExtend
							tooltip={intl.formatMessage({ id: 'dangkyhoctap.table.xoa' })}
							danger
							type='link'
							icon={<DeleteOutlined />}
						/>
					</Popconfirm>
				),
			},
		];

		return (
			<>
				<div style={{ marginBottom: 12 }}>
					<Alert
						type={ngoaiThoiGian ? 'warning' : 'info'}
						message={
							ngoaiThoiGian
								? intl.formatMessage({ id: 'dangkyhoctap.alert.ngoaiThoiGian' })
								: intl.formatMessage(
										{ id: 'dangkyhoctap.alert.trongThoiGian' },
										{
											tuNgay: formatDate(recDot?.thoiGianBatDau),
											denNgay: formatDate(recDot?.thoiGianKetThuc),
											b: (chunks) => <b>{chunks}</b>,
										},
									)
						}
						showIcon
					/>
				</div>

				<TableStaticData
					columns={columns}
					data={danhSach ?? []}
					loading={loading}
					addStt
					otherProps={{ pagination: {} }}
					hasTotal
					onReload={getData}
				>
					<ButtonExtend
						type='primary'
						disabled={ngoaiThoiGian}
						onClick={() => {
							setRecord({} as DangKyNhuCau.IHocPhanDangKyNhuCau);
							setEdit(false);
							setIsView(false);
							setVisibleForm(true);
						}}
						icon={<PlusCircleOutlined />}
					>
						{intl.formatMessage({ id: 'dangkyhoctap.button.themMoi' })}
					</ButtonExtend>
				</TableStaticData>

				<ModalExpandable
					onCancel={() => setVisibleForm(false)}
					footer={false}
					styles={{ body: { padding: 0 } }}
					open={visibleForm}
					width={800}
				>
					<FormDangKyNhuCau getData={getData} title={intl.formatMessage({ id: 'dangkyhoctap.modal.nhuCauHocPhan' })} />
				</ModalExpandable>

				{/* <TableBase
					columns={columns}
					getData={getData}
					formProps={{ getData }}
					dependencies={[page, limit, maKhoaNganh, recDot?._id]}
					modelName='daotao.dangkynhucau.hocphannhucau'
					title='Nhu cầu học phần'
					hideCard
					Form={FormDangKyNhuCau}
					buttons={{
						create: !ngoaiThoiGian,
						// && khoaNganhTrongDot
					}}
					// otherButtons={
					// 	!khoaNganhTrongDot
					// 		? [
					// 				<i color='red' key='1'>
					// 					Bạn không được phép đăng ký nhu cầu mới
					// 				</i>,
					// 		  ]
					// 		: undefined
					// }
				/> */}
			</>
		);
	};

export default NhuCauHocPhanPage;
