import StatisticsCard from '@/components/StatisticsCard';
import { StatisticsItem } from '@/components/StatisticsCard/typing';
import { ETrangThaiUserDiemDanh, colorTrangThaiUserDiemDanh, trangThaiUserDiemDanh } from '@/services/DaoTao/constant';
import {
	CalendarOutlined,
	CheckCircleOutlined,
	ClockCircleOutlined,
	ExclamationCircleOutlined,
	MinusCircleOutlined,
} from '@ant-design/icons';
import { useModel } from 'umi';

const StatDiemDanhV2 = () => {
	const { danhSach } = useModel('daotao.thoikhoabieu');

	// Tạo icon mapping cho từng trạng thái
	const getIconForStatus = (status: ETrangThaiUserDiemDanh) => {
		switch (status) {
			case ETrangThaiUserDiemDanh.CO_MAT:
				return <CheckCircleOutlined style={{ color: colorTrangThaiUserDiemDanh[status] }} />;
			case ETrangThaiUserDiemDanh.VANG_CO_PHEP:
				return <ExclamationCircleOutlined style={{ color: colorTrangThaiUserDiemDanh[status] }} />;
			case ETrangThaiUserDiemDanh.VANG_KHONG_PHEP:
				return <MinusCircleOutlined style={{ color: colorTrangThaiUserDiemDanh[status] }} />;
			case ETrangThaiUserDiemDanh.CHUA_DIEM_DANH:
				return <ClockCircleOutlined style={{ color: colorTrangThaiUserDiemDanh[status] }} />;
			default:
				return <CalendarOutlined style={{ color: colorTrangThaiUserDiemDanh[status] }} />;
		}
	};

	// Tạo background color cho từng trạng thái (màu nhạt hơn)
	const getBackgroundColor = (status: ETrangThaiUserDiemDanh) => {
		const color = colorTrangThaiUserDiemDanh[status];
		// Chuyển đổi màu sang màu nền nhạt hơn
		switch (status) {
			case ETrangThaiUserDiemDanh.CO_MAT:
				return '#f6ffed';
			case ETrangThaiUserDiemDanh.VANG_CO_PHEP:
				return '#fffbe6';
			case ETrangThaiUserDiemDanh.VANG_KHONG_PHEP:
				return '#fff2e8';
			case ETrangThaiUserDiemDanh.CHUA_DIEM_DANH:
				return '#f0f0f0';
			default:
				return '#fafafa';
		}
	};

	// Tạo dữ liệu thống kê
	const statisticsData: StatisticsItem[] = [
		{
			title: 'Tổng số buổi học',
			value: danhSach.length,
			icon: <CalendarOutlined />,
			valueColor: '#1890ff',
			backgroundColor: '#e6f7ff',
		},
		...Object.values(ETrangThaiUserDiemDanh).map((status) => ({
			title: trangThaiUserDiemDanh[status],
			value: danhSach.filter((j) => j.trangThaiDiemDanhCaNhan === status).length,
			icon: getIconForStatus(status),
			valueColor: colorTrangThaiUserDiemDanh[status],
			backgroundColor: getBackgroundColor(status),
		})),
	];

	return (
		<StatisticsCard
			title='Thống kê điểm danh'
			data={statisticsData}
			colSpan={{ xs: 24, sm: 12, md: 8, lg: 6, xl: 4, xxl: 4 }}
			containerStyle={{
				marginBottom: 18,
				backgroundColor: '#fff',
				padding: '20px',
				boxShadow: '0px 0px 12px 0px #0000000A',
				borderRadius: '8px',
			}}
		/>
	);
};

export default StatDiemDanhV2;
