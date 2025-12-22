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
import dayjs from '@/utils/dayjs';
import { CheckCircleOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Popconfirm, Tag } from 'antd';
import { useIntl, useModel } from 'umi';
import Form from './components/Form';

const ChungChiTotNghiepPage = () => {
	const intl = useIntl();
	const { page, limit, deleteModel, handleEdit, getModel } = useModel('sinhvien.chungchi');

	const onCell = (rec: SinhVien.IChungChiSinhVien) => ({
		onClick: () => handleEdit(rec),
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<SinhVien.IChungChiSinhVien>[] = [
		{
			title: intl.formatMessage({ id: 'chungchitotnghiep.columntable.chungchi' }),
			dataIndex: 'maChungChi',
			width: 180,
			filterType: 'customselect',
			filterCustomSelect: <SelectChungChi multiple selectMa />,
			render: (val, rec) => `${rec.chungChi?.loaiChungChi?.ten} - ${rec.chungChi?.ten ?? val}`,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'chungchitotnghiep.columntable.donvicap' }),
			dataIndex: 'donViCap',
			width: 200,
			filterType: 'string',
			sortable: true,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'chungchitotnghiep.columntable.trinhdo' }),
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
			title: intl.formatMessage({ id: 'chungchitotnghiep.columntable.trangthai' }),
			dataIndex: 'trangThaiDuyet',
			align: 'center',
			width: 130,
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
			title: intl.formatMessage({ id: 'chungchitotnghiep.columntable.ngaycap' }),
			dataIndex: 'ngayCap',
			width: 100,
			filterType: 'date',
			align: 'center',
			sortable: true,
			render: (val) => val && dayjs(val).format('DD/MM/YYYY'),
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'chungchitotnghiep.columntable.thoihan' }),
			width: 130,
			filterType: 'date',
			align: 'center',
			render: (val, rec) => {
				if (rec.chungChi && rec.ngayCap)
					if (rec.chungChi?.chungChiCoThoiHan) {
						const endDate = dayjs(rec.ngayCap).add(rec.chungChi.thoiHanChungChi ?? 0, 'year');
						return (
							<span className={dayjs().isAfter(endDate) ? 'text-error' : undefined}>
								{endDate.format('DD/MM/YYYY')}
							</span>
						);
					} else
						return (
							<Tag color='green'>
								{intl.formatMessage({ id: 'chungchitotnghiep.columntable.thoihan.tag.khongthoihan' })}
							</Tag>
						);
				else return null;
			},
			sortable: true,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'chungchitotnghiep.columntable.ghichu' }),
			dataIndex: 'ghiChu',
			width: 180,
			render: (val) => <ExpandText>{val}</ExpandText>,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'chungchitotnghiep.columntable.thaotac' }),
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (record: SinhVien.IChungChiSinhVien) => (
				<>
					<ButtonExtend
						disabled={
							record?.trangThaiDuyet === ETrangThaiChungChiSinhVen.DA_DUYET ||
							record?.trangThaiDuyet === ETrangThaiChungChiSinhVen.KHONG_DUYET ||
							!record.chungChi?.choPhepDangKy
						}
						tooltip={intl.formatMessage({ id: 'chungchitotnghiep.columntable.thaotac.tooltip.edit' })}
						onClick={() => handleEdit(record)}
						type='link'
						icon={<EditOutlined />}
					/>
					<Popconfirm
						onConfirm={() => deleteModel(record._id, getModel)}
						title={intl.formatMessage({ id: 'chungchitotnghiep.columntable.thaotac.confirm' })}
						placement='topRight'
					>
						<ButtonExtend
							disabled={
								record?.trangThaiDuyet === ETrangThaiChungChiSinhVen.DA_DUYET ||
								record?.trangThaiDuyet === ETrangThaiChungChiSinhVen.KHONG_DUYET ||
								!record.chungChi?.choPhepDangKy
							}
							tooltip={intl.formatMessage({ id: 'chungchitotnghiep.columntable.thaotac.tooltip.delete' })}
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
			title={intl.formatMessage({ id: 'chungchitotnghiep.title' })}
			columns={columns}
			dependencies={[page, limit]}
			modelName='sinhvien.chungchi'
			Form={Form}
			widthDrawer={800}
		/>
	);
};

export default ChungChiTotNghiepPage;
