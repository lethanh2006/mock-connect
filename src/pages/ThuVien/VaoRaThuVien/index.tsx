import MyDateRangePicker from '@/components/MyDatePicker/RangePicker';
import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { EOperatorType } from '@/components/Table/constant';
import type { IColumn } from '@/components/Table/typing';
import type { QuanLyThuVien } from '@/services/QuanLyThuVien/typing';
import { StockOutlined, UserOutlined } from '@ant-design/icons';
import { Tag } from 'antd';
import moment from 'moment';
import { useState } from 'react';
import { useModel } from 'umi';
import ModalThongKeVaoRaThuVien from './components/ModalThongKe';
import SoLuongTopVaoRaThuVien from './components/TopVaoRaThuVien';

const VaoRaThuVienPage = () => {
	const { getModel, page, limit, setVisibleForm } = useModel('thuvien.vaorathuvien');
	const [visibleStat, setVisibleStat] = useState<boolean>(false);
	const [dateRange, setDateRange] = useState<string[]>([
		moment().startOf('M').toISOString(),
		moment().endOf('M').toISOString(),
	]);

	const getData = () => {
		getModel(
			undefined,
			[
				{
					field: 'thoiGianCheckIn',
					values: [dateRange[0], dateRange[1]],
					operator: EOperatorType.BETWEEN,
				},
			],
			undefined,
			undefined,
			undefined,
			'me',
		);
	};

	const columns: IColumn<QuanLyThuVien.IVaoRaThuVien>[] = [
		{
			title: 'Buổi',
			dataIndex: 'buoi',
			align: 'center',
			width: 120,
		},
		{
			title: 'Thời gian vào',
			dataIndex: 'thoiGianCheckIn',
			align: 'center',
			width: 130,
			render: (val, rec) => (val ? moment(val).format('HH:mm DD/MM/YYYY') : <Tag color='red'>Chưa vào</Tag>),
			filterType: 'date',
			sortable: true,
		},
		{
			title: 'Thời gian ra',
			dataIndex: 'thoiGianCheckOut',
			align: 'center',
			width: 130,
			render: (val, rec) => (val ? moment(val).format('HH:mm DD/MM/YYYY') : <Tag color='red'>Chưa ra</Tag>),
			filterType: 'date',
			sortable: true,
		},
	];

	return (
		<>
			<TableBase
				getData={getData}
				columns={columns}
				dependencies={[page, limit, dateRange]}
				modelName='thuvien.vaorathuvien'
				title='Lịch sử vào ra thư viện'
				buttons={{ create: false }}
				otherButtons={[
					<MyDateRangePicker
						key='1'
						value={[moment(dateRange[0]), moment(dateRange[1])]}
						onChange={(val: any) => setDateRange(val)}
						ranges={{
							'Hôm nay': [moment(), moment()],
							'Tuần này': [moment().startOf('week'), moment().endOf('week')],
							'Tháng này': [moment().startOf('M'), moment().endOf('M')],
						}}
						style={{ width: 250 }}
					/>,
					<ButtonExtend onClick={() => setVisibleStat(true)} key='stat' icon={<StockOutlined />}>
						Thống kê
					</ButtonExtend>,
					<ButtonExtend onClick={() => setVisibleForm(true)} key='top' icon={<UserOutlined />}>
						Top thống kê
					</ButtonExtend>,
				]}
			/>

			<ModalThongKeVaoRaThuVien visible={visibleStat} setVisible={setVisibleStat} />
			<SoLuongTopVaoRaThuVien />
		</>
	);
};

export default VaoRaThuVienPage;
