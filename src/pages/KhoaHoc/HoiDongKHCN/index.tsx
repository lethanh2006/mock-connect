import TableBase from '@/components/Table';
import type { IColumn } from '@/components/Table/typing';
import { EPhaseDeTaiKHCN } from '@/services/KhoaHoc/DeTaiKHCN/constants';
import {
	ELoaiHoiDongKHCN,
	ETrangThaiHoiDongKHCN,
	MapKeyNameLoaiHoiDongKHCN,
} from '@/services/KhoaHoc/HoiDongKHCN/constants';
import type { HoiDongKHCN } from '@/services/KhoaHoc/HoiDongKHCN/typings';
import { primaryColor } from '@/services/base/constant';
import { DeleteOutlined, ExportOutlined, FormOutlined, MenuOutlined, RetweetOutlined } from '@ant-design/icons';
import { Button, Divider, Modal, Popconfirm, Popover, Tooltip } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import TableThanhVien from '../DeTaiKHCN/components/TableThanhVien';
import ViewDeTai from '../DeTaiKHCN/components/ViewDeTai';
import SelectKeHoachDeTai from '../KeHoachDeTai/components/SelectKeHoachDeTai';
import TableDeTaiHoiDong from './components/DeTaiHoiDong';

import ViewHoiDong from './components/ViewHoiDong';

const HoiDongKHCNPage = (props: {
	loaiHoiDongKhcn: ELoaiHoiDongKHCN;
	title?: string;
	conditionDeTaiNgoaiHoiDong?: any;
	hideCard?: boolean;
}) => {
	const {
		getAllModel,
		handleEdit,
		deleteModel,
		loading,
		setRecord: setRecHoiDong,
		record: recHoiDong,
		exportQuyetDinhThanhLapHoiDongModel,
		setVisibleViewDetail,
		setVisibleFormCapNhatKetQuaHop,
	} = useModel('khoahoc.hoidongkhcn');
	const { record: recKeHoach, setRecord: setRecKeHoach, danhSach: danhSachKeHoach } = useModel('khoahoc.kehoachdetai');
	const { getDeTaiNgoaiHoiDongModel, record: recDeTai } = useModel('khoahoc.detaikhcn');

	const getData = () => {
		getAllModel(false, undefined, { loaiHoiDongKhcn: props.loaiHoiDongKhcn, dotDangKyId: recKeHoach?._id });
	};

	useEffect(() => {
		if (recKeHoach?._id)
			getDeTaiNgoaiHoiDongModel(
				{
					loaiHoiDongKhcn: props.loaiHoiDongKhcn,
					condition: {
						...props.conditionDeTaiNgoaiHoiDong,
					},
				},
				recKeHoach?._id,
			);
	}, [recKeHoach?._id, props.loaiHoiDongKhcn]);

	const [typeView, setTypeView] = useState<'ThanhVienHoiDong' | 'ThanhVienThamGia' | 'DeTai'>('ThanhVienHoiDong');
	const [visibleView, setVisibleView] = useState<boolean>(false);

	const handleClickView = (rec: HoiDongKHCN.IRecord, type: 'ThanhVienHoiDong' | 'ThanhVienThamGia' | 'DeTai') => {
		setTypeView(type);
		setVisibleView(true);
		setRecHoiDong(rec);
	};

	const handleCancelView = () => {
		setVisibleView(false);
	};

	const onCell = (recordHoiDongTemp: HoiDongKHCN.IRecord) => ({
		onClick: () => {
			setRecHoiDong(recordHoiDongTemp);
			setVisibleViewDetail(true);
		},
		style: { cursor: 'pointer' },
	});

	const column: IColumn<HoiDongKHCN.IRecord>[] = [
		{
			title: 'Tên hội đồng',
			dataIndex: 'ten',
			width: 250,
			align: 'center',
			filterType: 'string',
			onCell,
		},
		{
			title: 'Loại hội đồng',
			dataIndex: 'loaiHoiDongKhcn',
			width: 150,
			align: 'center',
			onCell,
			filterType: 'select',
			filterData: Object.values(ELoaiHoiDongKHCN).map((item) => ({
				value: item,
				label: MapKeyNameLoaiHoiDongKHCN[item],
			})),
			render: (val: ELoaiHoiDongKHCN) => MapKeyNameLoaiHoiDongKHCN[val],
		},
		{
			title: 'Thời gian',
			dataIndex: 'thoiGianBatDau',
			width: 150,
			align: 'center',
			render: (val) => <div>{val ? moment(val).format('HH:mm DD/MM/YYYY') : ''}</div>,
			onCell,
		},
		{
			title: 'Địa điểm',
			dataIndex: 'diaDiem',
			width: 150,
			align: 'center',
			onCell,
		},
		{
			title: 'DS thành viên hội đồng',
			dataIndex: 'danhSachThanhVien',
			width: 150,
			align: 'center',
			render: (val, rec) => (
				<Button
					onClick={() => {
						handleClickView(rec, 'ThanhVienHoiDong');
					}}
					type='link'
				>
					{val?.length ?? 0} thành viên
				</Button>
			),
		},
		// {
		// 	title: 'DS thành viên tham dự',
		// 	dataIndex: 'danhSachThanhVienThamGia',
		// 	width: 150,
		// 	align: 'center',
		// 	render: (val, rec) => (
		// 		<Button
		// 			onClick={() => {
		// 				handleClickView(rec, 'ThanhVienThamGia');
		// 			}}
		// 			type='link'
		// 		>
		// 			{val?.length ?? 0} thành viên
		// 		</Button>
		// 	),
		// },
		{
			title: 'DS đề tài',
			dataIndex: 'danhSachDeTai',
			width: 150,
			align: 'center',
			render: (val, rec) => (
				<Button
					onClick={() => {
						handleClickView(rec, 'DeTai');
					}}
					type='link'
				>
					{val?.length ?? 0} đề tài
				</Button>
			),
		},
		// {
		//   title: 'Người tạo',
		//   width: 100,
		//   dataIndex: ['nguoiTao', 'ten'],
		//   align: 'center',
		// },
		// {
		//   title: 'Ngày tạo',
		//   width: 120,
		//   dataIndex: 'createdAt',
		//   align: 'center',
		//   render: (val) => <div>{moment(val).format('DD/MM/YYYY')}</div>,
		// },
		// {
		// 	title: 'Trạng thái diễn ra',
		// 	width: 150,
		// 	dataIndex: 'hetHan',
		// 	align: 'center',
		// 	render: (val: ETrangThaiHoiDongKHCN) => <Tag color={MapkeyColorTrangThaiHoiDongKHCN[val]}>{val}</Tag>,
		// 	onCell,
		// },
		{
			title: 'Kết quả họp',
			fixed: 'right',
			width: 120,
			align: 'center',
			render: (recordHoiDongTemp: HoiDongKHCN.IRecord) => (
				<b
					style={{
						color: recordHoiDongTemp?.bienBanUrl?.length ? '#28a745' : primaryColor,
					}}
				>
					{recordHoiDongTemp?.bienBanUrl?.length ? 'Đã cập nhật kết quả họp' : 'Chưa cập nhật kết quả họp'}
				</b>
			),
			onCell,
		},
		{
			fixed: 'right',
			title: 'Thao tác',
			width: 80,
			align: 'center',
			render: (recordHoiDongTemp: HoiDongKHCN.IRecord) => {
				const isDaDienRa = moment(recordHoiDongTemp.thoiGianBatDau).isBefore();
				return (
					<Popover
						placement='left'
						content={
							<>
								<Tooltip title={isDaDienRa ? 'Không thể chỉnh sửa, đã tới thời gian tổ chức hội đồng' : 'Chỉnh sửa'}>
									<Button
										type='link'
										// disabled={isDaDienRa}
										onClick={() => {
											handleEdit(recordHoiDongTemp);
										}}
										shape='circle'
										icon={<FormOutlined />}
									/>
								</Tooltip>
								<Divider type='vertical' />
								<Tooltip title={isDaDienRa ? 'Không thể xóa, đã tới thời gian tổ chức hội đồng' : 'Xóa'}>
									<Popconfirm
										disabled={isDaDienRa}
										title='Bạn có chắc chắn muốn xóa?'
										onConfirm={() => {
											deleteModel(recordHoiDongTemp?._id ?? '', getData);
										}}
									>
										<Button disabled={isDaDienRa} shape='circle' icon={<DeleteOutlined />} type='link' danger />
									</Popconfirm>
								</Tooltip>
								{/* <Divider type="vertical" />
                <Tooltip title={'Gửi thông tin cho thành viên hội đồng'}>
                  <Popconfirm
                    title="Bạn có chắc chắn gửi thông tin cho thành viên hội đồng?"
                    onConfirm={() => {
                      guiMailThanhVienHoiDongModel(recordHoiDongTemp._id);
                    }}
                  >
                    <Button shape="circle" icon={<MailOutlined />} type="primary" />
                  </Popconfirm>
                </Tooltip> */}
								<Divider type='vertical' />
								<Tooltip title='Cập nhật kết quả họp'>
									<Button
										disabled={recordHoiDongTemp?.hetHan === ETrangThaiHoiDongKHCN.CHUA_DIEN_RA}
										onClick={() => {
											setRecHoiDong(recordHoiDongTemp);
											setVisibleFormCapNhatKetQuaHop(true);
										}}
										shape='circle'
										type='link'
										icon={<RetweetOutlined />}
									/>
								</Tooltip>
								{/* <Divider type="vertical" /> */}
								{/* <Tooltip title="Tải lên quyết định thành lập hội đồng">
                  <Button
                    type="primary"
                    loading={loading}
                    onClick={() => {
                      setVisibleFormImportQuyetDinhThanhLapHoiDong(true);
                      setRecord(recordHoiDongTemp);
                    }}
                    shape="circle"
                    icon={<ImportOutlined />}
                  />
                </Tooltip> */}
								<Divider type='vertical' />
								<Tooltip title='Xuất quyết định thành lập hội đồng'>
									<Button
										type='link'
										loading={loading}
										onClick={() => {
											exportQuyetDinhThanhLapHoiDongModel(
												recordHoiDongTemp._id,
												props.loaiHoiDongKhcn,
												recordHoiDongTemp.ten,
											);
										}}
										shape='circle'
										icon={<ExportOutlined />}
									/>
								</Tooltip>
							</>
						}
					>
						<Button size='small' icon={<MenuOutlined />} type='link' />
					</Popover>
				);
			},
		},
	];

	return (
		<TableBase
			hideCard={props?.hideCard}
			widthDrawer={1000}
			otherButtons={[
				<SelectKeHoachDeTai
					onChange={(val: string) => setRecKeHoach(danhSachKeHoach.find((item) => item._id === val))}
					value={recKeHoach?._id}
					isSetRecord
					style={{ width: 300 }}
					key={'kehoach'}
				/>,
			]}
			title={props?.title}
			getData={getData}
			columns={column}
			modelName={'hoidongkhcn'}
		>
			<Modal
				width={typeView === 'DeTai' ? 1200 : 900}
				title={
					typeView === 'DeTai'
						? 'Danh sách đề tài'
						: typeView === 'ThanhVienHoiDong'
						? 'Danh sách thành viên hội đồng'
						: 'Danh sách thành viên tham gia'
				}
				visible={visibleView}
				onCancel={handleCancelView}
				footer={
					<Button type='primary' onClick={handleCancelView}>
						OK
					</Button>
				}
			>
				{typeView === 'ThanhVienHoiDong' && (
					<TableThanhVien
						mode='view'
						type='HoiDong'
						fieldName='danhSachThanhVien'
						data={recHoiDong?.danhSachThanhVien ?? []}
					/>
				)}
				{typeView === 'ThanhVienThamGia' && (
					<TableThanhVien
						mode='view'
						type='HoiDong'
						fieldName='danhSachThanhVienThamGia'
						data={recHoiDong?.danhSachThanhVienThamGia ?? []}
					/>
				)}
				{typeView === 'DeTai' && (
					<TableDeTaiHoiDong type={props.loaiHoiDongKhcn} mode='view' data={recHoiDong?.danhSachDeTai ?? []} />
				)}
			</Modal>
			{recDeTai && (
				<ViewDeTai
					phaseDeTai={
						props.loaiHoiDongKhcn === ELoaiHoiDongKHCN.XET_DUYET
							? EPhaseDeTaiKHCN.XET_DUYET_DANG_KY
							: props.loaiHoiDongKhcn === ELoaiHoiDongKHCN.DE_CUONG
							? EPhaseDeTaiKHCN.NOP_DE_CUONG
							: EPhaseDeTaiKHCN.NGHIEM_THU
					}
				/>
			)}
			{recHoiDong && <ViewHoiDong rec={recHoiDong} />}
		</TableBase>
	);
};

export default HoiDongKHCNPage;
