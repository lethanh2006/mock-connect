import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import type { IColumn } from '@/components/Table/typing';
import SelectChungChi from '@/pages/DaoTao/ChungChi/Select';
import {
	ETrangThaiChungChiSinhVen,
	colorTrangThaiChungChiSinhVen,
	nameTrangThaiChungChiSinhVen,
} from '@/services/DaoTao/SinhVien/constants';
import type { SinhVien } from '@/services/DaoTao/SinhVien/typings';
import { EPhuongThucTinhDiem } from '@/services/DaoTao/constant';
import { CheckCircleOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Popconfirm, Tag } from 'antd';
import moment from 'moment';
import { useEffect } from 'react';
import { useModel } from 'umi';
import Form from './components/Form';

const ChungChiTotNghiepPage = () => {
	const { record: recSinhVien, getThongTinCuaToiModel } = useModel('sinhvien.sinhvien');

	const { page, limit, deleteModel, handleEdit, getModel } = useModel('sinhvien.chungchi');

	const getData = () => recSinhVien?._id && getModel({ sinhVienSsoId: recSinhVien?.ssoId });

	useEffect(() => {
		getThongTinCuaToiModel();
	}, []);

	const onCell = (rec: SinhVien.IChungChiSinhVien) => ({
		onClick: () => handleEdit(rec),
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<SinhVien.IChungChiSinhVien>[] = [
		{
			title: 'Chứng chỉ',
			dataIndex: 'maChungChi',
			width: 200,
			filterType: 'customselect',
			filterCustomSelect: <SelectChungChi multiple selectMa />,
			render: (val, rec) => `${rec.chungChi?.loaiChungChi?.ten} - ${rec.chungChi?.ten ?? val}`,
			onCell,
		},
		{
			title: 'Ngày cấp',
			dataIndex: 'ngayCap',
			width: 100,
			filterType: 'date',
			align: 'center',
			sortable: true,
			render: (val) => val && moment(val).format('DD/MM/YYYY'),
			onCell,
		},
		{
			title: 'Đơn vị cấp',
			dataIndex: 'donViCap',
			width: 180,
			filterType: 'string',
			sortable: true,
			onCell,
		},
		{
			title: 'Trình độ',
			dataIndex: 'diem',
			width: 100,
			align: 'center',
			sortable: true,
			render: (val, rec) => {
				if (rec.chungChi?.phuongThucTinhDiem === EPhuongThucTinhDiem.DIEM) {
					return <span>{val}</span>;
				} else if (rec.chungChi?.phuongThucTinhDiem === EPhuongThucTinhDiem.BAC) {
					const findBac = rec.chungChi.bac?.find((item: any) => item.order === val);
					return <span>{findBac?.ten}</span>;
				}
				return <CheckCircleOutlined className='text-success' />;
			},
			onCell,
		},
		{
			title: 'Ghi chú',
			dataIndex: 'ghiChu',
			width: 180,
			render: (val, rec) => <ExpandText>{val}</ExpandText>,
			onCell,
		},
		{
			title: 'Thời hạn chứng chỉ',
			width: 130,
			filterType: 'date',
			align: 'center',
			render: (val, rec) => {
				if (rec.chungChi && rec.ngayCap)
					if (rec.chungChi?.chungChiCoThoiHan) {
						const endDate = moment(rec.ngayCap).add(rec.chungChi.thoiHanChungChi, 'y');
						return (
							<span className={moment().isAfter(endDate) ? 'text-error' : undefined}>
								{endDate.format('DD/MM/YYYY')}
							</span>
						);
					} else return <Tag color='green'>Không thời hạn</Tag>;
				else return null;
			},
			sortable: true,
			onCell,
		},
		{
			title: 'Trạng thái',
			dataIndex: 'trangThaiDuyet',
			align: 'center',
			fixed: 'right',
			width: 100,
			render: (val) => (
				<Tag color={colorTrangThaiChungChiSinhVen[val as ETrangThaiChungChiSinhVen]}>
					{nameTrangThaiChungChiSinhVen[val as ETrangThaiChungChiSinhVen]}
				</Tag>
			),
			filterType: 'select',
			filterData: Object.values(ETrangThaiChungChiSinhVen).map((item) => ({
				value: item,
				label: nameTrangThaiChungChiSinhVen[item],
			})),
			onCell,
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (record: SinhVien.IChungChiSinhVien) => (
				<>
					<ButtonExtend
						disabled={
							record?.trangThaiDuyet === ETrangThaiChungChiSinhVen.DA_DUYET ||
							record?.trangThaiDuyet === ETrangThaiChungChiSinhVen.KHONG_DUYET
						}
						tooltip='Chỉnh sửa'
						onClick={() => handleEdit(record)}
						type='link'
						icon={<EditOutlined />}
					/>
					<Popconfirm
						onConfirm={() => deleteModel(record._id, getData)}
						title='Bạn có chắc chắn muốn xóa chứng chỉ này?'
						placement='topRight'
					>
						<ButtonExtend
							disabled={
								record?.trangThaiDuyet === ETrangThaiChungChiSinhVen.DA_DUYET ||
								record?.trangThaiDuyet === ETrangThaiChungChiSinhVen.KHONG_DUYET
							}
							tooltip='Xóa'
							danger
							type='link'
							icon={<DeleteOutlined />}
						/>
					</Popconfirm>
				</>
			),
		},
	];

	return (
		<TableBase
			getData={getData}
			title='Chứng chỉ xét tốt nghiệp'
			columns={columns}
			dependencies={[page, limit, recSinhVien?.ssoId]}
			modelName='sinhvien.chungchi'
			Form={Form}
			formProps={{ getData }}
			widthDrawer={800}
		/>
	);
};

export default ChungChiTotNghiepPage;
