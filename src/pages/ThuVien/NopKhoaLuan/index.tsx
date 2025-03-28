import ExpandText from '@/components/ExpandText';
import MyDateRangePicker from '@/components/MyDatePicker/RangePicker';
import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { EOperatorType } from '@/components/Table/constant';
import type { IColumn } from '@/components/Table/typing';
import {
	colorTrangThaiNopThuVien,
	ELoaiDotQuanLyThuvien,
	ETrangThaiNopThuVien,
} from '@/services/QuanLyThuVien/constant';
import type { QuanLyThuVien } from '@/services/QuanLyThuVien/typing';
import { CloudUploadOutlined, DeleteOutlined, EditOutlined, EyeOutlined, MenuOutlined } from '@ant-design/icons';
import { Button, Card, Popconfirm, Popover, Space, Tabs, Tag } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import ChiTietThuVien from './components/ChiTiet';
import FormThuVien from './components/Form';
import ModalNopTaiLieu from './components/ModalNopTaiLieu';

const QuanLyThuVienPage = () => {
	const { getModel, page, limit, isView, handleView, handleEdit, deleteModel, setRecord } =
		useModel('thuvien.danhsachdot');
	const { getThongTinCuaToiModel } = useModel('sinhvien.sinhvien');
	const [datePicker, setDatePicker] = useState<any>();
	const [visibleNopBai, setVisibleNopBao] = useState<boolean>(false);
	const [tabActive, setTabActive] = useState<ELoaiDotQuanLyThuvien>(ELoaiDotQuanLyThuvien.LUAN_AN);

	useEffect(() => {
		getThongTinCuaToiModel();
	}, []);

	const getData = () => {
		const filter = [
			{
				active: true,
				field: 'thoiGianNop',
				values: [moment(datePicker?.[0]).startOf('date'), moment(datePicker?.[1]).endOf('date')],
				operator: EOperatorType.BETWEEN,
			},
		];

		getModel({ loai: tabActive }, datePicker ? filter : (undefined as any), undefined, undefined, undefined, 'my/page');
	};

	const onCell = (rec: QuanLyThuVien.IQuanLyDanhSachNop) => ({
		onClick: () => handleView(rec),
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<QuanLyThuVien.IQuanLyDanhSachNop>[] = [
		{
			title: 'Đợt',
			dataIndex: 'idDot',
			render: (val, rec) => <ExpandText>{rec?.dot?.tenDot}</ExpandText>,
			width: 150,
			onCell,
			hide: tabActive === ELoaiDotQuanLyThuvien.LUAN_AN,
		},
		{
			title: 'Thời gian',
			align: 'center',
			width: 200,
			render: (val, rec) =>
				rec?.dot?.thoiGianBatDau &&
				rec?.dot?.thoiGianKetThuc && (
					<>
						{moment(rec?.dot?.thoiGianBatDau).format('HH:mm DD/MM/YYYY')} -{' '}
						{moment(rec?.dot?.thoiGianKetThuc).format('HH:mm DD/MM/YYYY')}
					</>
				),
			onCell,
			hide: tabActive === ELoaiDotQuanLyThuvien.LUAN_AN,
		},
		{
			title: 'Tên đề tài',
			dataIndex: 'tenDeTai',
			width: 200,
			render: (val, rec) => <ExpandText>{val}</ExpandText>,
			onCell,
		},
		{
			title: 'Người hướng dẫn',
			dataIndex: 'nguoiHuongDan',
			align: 'center',
			width: 150,
			filterType: 'string',
			onCell,
		},
		{
			title: 'Tài liệu toàn bộ đề tài',
			dataIndex: 'urlTaiLieu',
			align: 'center',
			width: 180,
			render: (val, rec) =>
				val && (
					<a href={val} target='_blank' rel='noreferrer'>
						Xem tài liệu
					</a>
				),
		},
		{
			title: 'Tài liệu tóm tắt đề tài',
			dataIndex: 'urlTomTat',
			align: 'center',
			width: 180,
			render: (val, rec) =>
				val && (
					<a href={val} target='_blank' rel='noreferrer'>
						Xem tài liệu
					</a>
				),
		},
		{
			title: 'Tài liệu minh chứng đề tài',
			dataIndex: 'urlTaiLieuMinhChung',
			align: 'center',
			width: 200,
			render: (val, rec) =>
				val && (
					<a href={val} target='_blank' rel='noreferrer'>
						Xem tài liệu
					</a>
				),
		},
		{
			title: 'Thời gian nộp',
			dataIndex: 'thoiGianNop',
			align: 'center',
			width: 150,
			render: (val) => val && moment(val).format('DD/MM/YYYY'),
			filterType: 'date',
			sortable: true,
			onCell,
		},
		{
			title: 'Chức danh',
			dataIndex: 'chucDanh',
			width: 150,
			filterType: 'string',
			onCell,
		},
		{
			title: 'Nơi công tác',
			dataIndex: 'noiCongTac',
			width: 150,
			filterType: 'string',
			onCell,
		},
		{
			title: 'Học vị',
			dataIndex: 'hocVi',
			width: 150,
			filterType: 'string',
			onCell,
		},
		{
			title: 'Ngành',
			dataIndex: 'maNganh',
			width: 180,
			render: (val, rec) => rec?.nganh?.ten,
			onCell,
		},
		{
			title: 'Mã ngành',
			align: 'center',
			width: 180,
			render: (val, rec) => rec?.maNganh,
			onCell,
		},
		{
			title: 'Trạng thái',
			dataIndex: 'trangThai',
			align: 'center',
			fixed: 'right',
			width: 150,
			render: (val, rec) => <Tag color={colorTrangThaiNopThuVien[val as ETrangThaiNopThuVien]}>{val}</Tag>,
			filterType: 'select',
			filterData: Object.values(ETrangThaiNopThuVien),
			onCell,
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 120,
			fixed: 'right',
			render: (val, rec) => (
				<Popover
					placement='top'
					content={
						<>
							<ButtonExtend tooltip='Xem chi tiết' onClick={() => handleView(rec)} type='link' icon={<EyeOutlined />} />

							{tabActive === ELoaiDotQuanLyThuvien.LUAN_AN ? (
								<>
									<ButtonExtend
										disabled={rec?.trangThai !== ETrangThaiNopThuVien.CHO_XY_LY}
										type='link'
										icon={<EditOutlined />}
										onClick={() => handleEdit(rec)}
									/>
									<Popconfirm title='Bạn có chắc muốn xóa?' onConfirm={() => deleteModel(rec._id)}>
										<ButtonExtend
											disabled={rec?.trangThai !== ETrangThaiNopThuVien.CHO_XY_LY}
											type='link'
											tooltip='Xóa'
											danger
											icon={<DeleteOutlined />}
										/>
									</Popconfirm>
								</>
							) : (
								<ButtonExtend
									tooltip={`${
										moment().isBefore(rec?.dot?.thoiGianBatDau) || moment().isAfter(rec?.dot?.thoiGianKetThuc)
											? 'Ngoài thời gian nộp tài liệu'
											: 'Nộp tài liệu'
									}`}
									disabled={
										rec?.trangThai === ETrangThaiNopThuVien.TU_CHOI ||
										rec?.trangThai === ETrangThaiNopThuVien.DA_DUYET ||
										moment().isBefore(rec?.dot?.thoiGianBatDau) ||
										moment().isAfter(rec?.dot?.thoiGianKetThuc)
									}
									type='link'
									icon={<CloudUploadOutlined />}
									onClick={() => {
										setRecord(rec);
										setVisibleNopBao(true);
									}}
								/>
							)}
						</>
					}
				>
					<Button type='link' icon={<MenuOutlined />} />
				</Popover>
			),
		},
	];

	return (
		<Card title='Nộp luận án, luận văn, khóa luận/đồ án'>
			<Tabs onChange={(tab) => setTabActive(tab as ELoaiDotQuanLyThuvien)} activeKey={tabActive}>
				<Tabs.TabPane tab='Luận án' key={ELoaiDotQuanLyThuvien.LUAN_AN} />
				<Tabs.TabPane tab='Luận văn' key={ELoaiDotQuanLyThuvien.LUAN_VAN} />
				<Tabs.TabPane tab='Khóa luận/đồ án' key={ELoaiDotQuanLyThuvien.KHOA_LUAN} />
			</Tabs>
			{tabActive === ELoaiDotQuanLyThuvien.LUAN_AN ? (
				<Space style={{ marginBottom: 12 }}>
					<MyDateRangePicker
						value={datePicker}
						onChange={(val) => setDatePicker(val)}
						allowClear
						style={{ width: 300 }}
					/>
				</Space>
			) : null}

			<TableBase
				getData={getData}
				columns={columns}
				dependencies={[page, limit, datePicker, tabActive]}
				modelName='thuvien.danhsachdot'
				Form={isView ? ChiTietThuVien : FormThuVien}
				formProps={{ getData, tabActive }}
				title={
					tabActive === ELoaiDotQuanLyThuvien.LUAN_AN
						? 'Danh sách luận án'
						: tabActive === ELoaiDotQuanLyThuvien.LUAN_VAN
						? 'Danh sách luận văn'
						: 'Danh sách khóa luận/đồ án'
				}
				widthDrawer={1000}
				hideCard
				buttons={{ create: tabActive === ELoaiDotQuanLyThuvien.LUAN_AN ? true : false }}
			/>

			<ModalNopTaiLieu visible={visibleNopBai} setVisible={setVisibleNopBao} getData={getData} />
		</Card>
	);
};

export default QuanLyThuVienPage;
