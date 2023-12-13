import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import {
	ColorTrangThaiMinhChungDiemRenLuyen,
	ELoaiMinhChungDiemRenLuyen,
	ELoaiMinhChungDiemRenLuyenMappingToTitle,
	EPhanLoaiNoiNgoaiTru,
	ETrangThaiMinhChungDiemRenLuyen,
	EPhanLoaiNoiNgoaiTruMappingToLabel,
} from '@/services/CongTacSinhVien/DiemRenLuyen/MinhChung/constants';
import { type MinhChungDiemRenLuyen } from '@/services/CongTacSinhVien/DiemRenLuyen/MinhChung/typing';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tag, Tooltip } from 'antd';
import moment from 'moment';
import { useModel } from 'umi';
import { FormKhaiBaoMinhChung } from './components/Form';
import ExpandText from '@/components/ExpandText';

export default () => {
	const { danhSach, page, limit, getLoaiMinhChung, handleView, handleEdit, deleteModel, getModel } =
		useModel('diemrenluyen.minhchung');

	const onCell = (rec: MinhChungDiemRenLuyen.IRecord) => ({
		onClick: () => {
			handleView(rec);
		},
		style: { cursor: 'pointer' },
	});
	const columns: IColumn<MinhChungDiemRenLuyen.IRecord>[] = [
		// Nội ngoại trú
		{
			width: 120,
			title: 'Ngày khai báo',
			align: 'center',
			filterType: 'date',
			dataIndex: 'createdAt',
			onCell,
			hide: getLoaiMinhChung() !== ELoaiMinhChungDiemRenLuyen.NOI_NGOAI_TRU,
			render: (value) => (value ? moment(value).format('DD/MM/YYYY') : null),
		},
		{
			width: 100,
			title: 'Phân loại',
			dataIndex: 'phanLoai',
			align: 'center',
			onCell,
			hide: getLoaiMinhChung() !== ELoaiMinhChungDiemRenLuyen.NOI_NGOAI_TRU,
			filterType: 'select',
			filterData: Object.values(EPhanLoaiNoiNgoaiTru).map((item) => ({
				value: item,
				label: EPhanLoaiNoiNgoaiTruMappingToLabel[item],
			})),
			render: (_, record) => EPhanLoaiNoiNgoaiTruMappingToLabel[record.phanLoai],
		},
		{
			title: 'Nơi ở hiện nay',
			dataIndex: 'thongTinNgoaiTru',
			width: 200,
			hide: getLoaiMinhChung() !== ELoaiMinhChungDiemRenLuyen.NOI_NGOAI_TRU,
			render: (val, record) => {
				if (record.phanLoai === 'noi_tru') {
					return (
						<p>
							Ký túc xá {record?.kyTucXa?.ten}, số phòng {record?.soPhong?.ten}
						</p>
					);
				} else if (record.phanLoai === 'ngoai_tru') {
					return (
						<p>
							{val?.soNha}, {val?.quan}, {val?.xa}, {val?.tinh}
						</p>
					);
				} else {
					return null;
				}
			},
			onCell,
		},
		{
			title: 'Liên hệ',
			dataIndex: 'thongTinNgoaiTru',
			width: 200,
			hide: getLoaiMinhChung() !== ELoaiMinhChungDiemRenLuyen.NOI_NGOAI_TRU,
			onCell,
			render: (val, rec) => {
				if (rec.phanLoai === EPhanLoaiNoiNgoaiTru.NGOAI_TRU)
					return val?.nhaRieng ? 'Nhà riêng' : `${val?.tenChuTro ?? ''} (chủ trọ/người thân), ${val?.sdtChuTro ?? ''}`;
				return 'Ký túc xá';
			},
		},

		// Tham gia công tác xã hội

		{
			title: 'Tham gia công tác xã hội',
			dataIndex: 'idNoiDungCongTacXaHoi',
			render: (_, rec) => rec.noiDungCongTacXaHoi?.ten,
			width: 200,
			onCell,
			hide: getLoaiMinhChung() !== ELoaiMinhChungDiemRenLuyen.THAM_GIA_CONG_TAC_XA_HOI,
		},
		{
			title: 'Cấp đạt giải',
			dataIndex: 'idCapDatGiai',
			width: 120,
			render: (_, rec) => rec.capDatGiai?.ten,
			onCell,
			hide: getLoaiMinhChung() !== ELoaiMinhChungDiemRenLuyen.THANH_TICH_DAC_BIET,
		},
		{
			title: 'Nội dung hoạt động',
			dataIndex: 'noiDungHoatDong',
			render: (val) => (
				<ExpandText style={{ marginBottom: 0 }} ellipsis={{ rows: 2, expandable: true, symbol: <span>Xem tiếp</span> }}>
					{val}
				</ExpandText>
			),
			width: 200,
			onCell,
			hide: ![
				ELoaiMinhChungDiemRenLuyen.TUYEN_TRUYEN_TRUONG_TICH_CUC,
				ELoaiMinhChungDiemRenLuyen.THANH_TICH_DAC_BIET,
			].includes(getLoaiMinhChung()),
		},
		{
			title: 'Sự kiện',
			dataIndex: 'idSuKienCTSV',
			width: 150,
			render: (_, rec) => rec.suKienCTSV?.tenSuKien,
			onCell,
			hide: getLoaiMinhChung() !== ELoaiMinhChungDiemRenLuyen.TUYEN_TRUYEN_TRUONG_TICH_CUC,
		},
		{
			title: `Thời gian ${
				getLoaiMinhChung() === ELoaiMinhChungDiemRenLuyen.TUYEN_TRUYEN_TRUONG_TICH_CUC ? 'chia sẻ' : 'tham gia'
			}`,
			dataIndex: 'ngayThamGia',
			align: 'center',
			width: 120,
			render: (val) => val && moment(val).format('DD/MM/YYYY'),
			onCell,
			hide: ![
				ELoaiMinhChungDiemRenLuyen.THAM_GIA_CONG_TAC_XA_HOI,
				ELoaiMinhChungDiemRenLuyen.THANH_TICH_DAC_BIET,
				ELoaiMinhChungDiemRenLuyen.TUYEN_TRUYEN_TRUONG_TICH_CUC,
			].includes(getLoaiMinhChung()),
		},
		{
			title: 'Đường dẫn',
			dataIndex: 'duongDan',
			align: 'center',
			width: 120,
			render: (_, record) => {
				if (record.duongDan) {
					return (
						<Button type='link' href={record.duongDan} target='_blank' rel='noreferrer'>
							Mở đường dẫn
						</Button>
					);
				}
				return null;
			},
			hide: ![
				ELoaiMinhChungDiemRenLuyen.THAM_GIA_CONG_TAC_XA_HOI,
				ELoaiMinhChungDiemRenLuyen.THANH_TICH_DAC_BIET,
				ELoaiMinhChungDiemRenLuyen.TUYEN_TRUYEN_TRUONG_TICH_CUC,
			].includes(getLoaiMinhChung()),
		},
		{
			title: 'Tập tin',
			dataIndex: 'urlFileList',
			align: 'center',
			render: (_, record) => {
				return record.urlFileList?.map((item, index) => (
					<div key={item}>
						<Button type='link' href={item} target='_blank' rel='noreferrer'>
							Xem tập tin {index + 1}
						</Button>
					</div>
				));
			},
			width: 120,
			onCell,
			hide: ![
				ELoaiMinhChungDiemRenLuyen.THAM_GIA_CONG_TAC_XA_HOI,
				ELoaiMinhChungDiemRenLuyen.THANH_TICH_DAC_BIET,
				ELoaiMinhChungDiemRenLuyen.TUYEN_TRUYEN_TRUONG_TICH_CUC,
			].includes(getLoaiMinhChung()),
		},
		{
			title: 'Điểm',
			dataIndex: 'diemQuyDoi',
			align: 'center',
			sortable: true,
			width: 100,
			onCell,
		},
		{
			title: 'Trạng thái',
			dataIndex: 'trangThai',
			align: 'center',
			width: 120,
			filterType: 'select',
			filterData: Object.values(ETrangThaiMinhChungDiemRenLuyen).map((value) => ({
				value,
				label: value,
			})),
			render: (_, record) => (
				<Tag color={ColorTrangThaiMinhChungDiemRenLuyen[record.trangThai]}>{record.trangThai}</Tag>
			),
			onCell,
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 70,
			fixed: 'right',
			hide: getLoaiMinhChung() === ELoaiMinhChungDiemRenLuyen.NOI_NGOAI_TRU,
			render: (val, rec) => {
				return (
					<>
						<Tooltip title='Chỉnh sửa'>
							<Button onClick={() => handleEdit(rec)} type='link' icon={<EditOutlined />} />
						</Tooltip>

						<Tooltip title='Xóa'>
							<Popconfirm
								placement='topRight'
								onConfirm={() => deleteModel(val._id, getModel)}
								title='Bạn có chắc chắn muốn xóa đợt chấm điểm này?'
							>
								<Button danger type='link' icon={<DeleteOutlined />} />
							</Popconfirm>
						</Tooltip>
					</>
				);
			},
		},
	];

	return (
		<TableBase
			widthDrawer={600}
			Form={FormKhaiBaoMinhChung}
			title={ELoaiMinhChungDiemRenLuyenMappingToTitle[getLoaiMinhChung()]}
			modelName='diemrenluyen.minhchung'
			columns={columns}
			dependencies={[page, limit]}
			buttons={{
				create:
					getLoaiMinhChung() !== ELoaiMinhChungDiemRenLuyen.NOI_NGOAI_TRU ||
					!danhSach.find((item) => item.trangThai === ETrangThaiMinhChungDiemRenLuyen.DA_DUYET),
			}}
		/>
	);
};
