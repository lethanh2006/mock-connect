import StatisticsCard from '@/components/StatisticsCard';
import { StatisticsItem } from '@/components/StatisticsCard/typing';
import { ETrangThaiNopBaiTap } from '@/services/DaoTao/BaiTap/constants';
import { type BaiTap } from '@/services/DaoTao/BaiTap/typing';
import { CheckCircleOutlined, ClockCircleOutlined, ExclamationCircleOutlined, StopOutlined } from '@ant-design/icons';
import moment from 'moment';

interface StatisticsProps {
	danhSach: BaiTap.IDanhSachGiaoBaiTap[];
}

const Statistics: React.FC<StatisticsProps> = ({ danhSach }) => {
	// Calculate statistics
	const getStatistics = () => {
		const now = moment();

		// Đã hoàn thành: đã nộp bài (có trangThai là đã nộp)
		const completedCount = danhSach.filter(
			(item) => item.trangThai === ETrangThaiNopBaiTap.DA_NOP || item.trangThai === ETrangThaiNopBaiTap?.DA_CHAM,
		).length;

		// Đến hạn: chưa nộp bài và thời gian hiện tại nằm trong khoảng thời gian làm bài
		const pendingCount = danhSach.filter((item) => {
			const assignment = item.assignment;
			if (!assignment) return false;

			const isNotSubmitted = !item.trangThai || item.trangThai === ETrangThaiNopBaiTap.CHUA_NOP;
			const isInProgress =
				now.isSameOrAfter(assignment.thoiGianBatDau) && now.isSameOrBefore(assignment.thoiGianKetThuc);

			return isNotSubmitted && isInProgress;
		}).length;

		// Chưa hoàn thành: chưa nộp bài và chưa đến thời gian làm bài
		const notStartedCount = danhSach.filter((item) => {
			const assignment = item.assignment;
			if (!assignment) return false;

			const isNotSubmitted = !item.trangThai || item.trangThai === ETrangThaiNopBaiTap.CHUA_NOP;
			const isNotStarted = now.isBefore(assignment.thoiGianBatDau);

			return isNotSubmitted && isNotStarted;
		}).length;

		// Quá hạn nộp bài: chưa nộp bài và đã quá thời gian kết thúc
		const overdueCount = danhSach.filter((item) => {
			const assignment = item.assignment;
			if (!assignment) return false;

			const isNotSubmitted = !item.trangThai || item.trangThai === ETrangThaiNopBaiTap.CHUA_NOP;
			const isOverdue = now.isAfter(assignment.thoiGianKetThuc);

			return isNotSubmitted && isOverdue;
		}).length;

		return {
			completed: completedCount,
			pending: pendingCount,
			notStarted: notStartedCount,
			overdue: overdueCount,
		};
	};

	const statistics = getStatistics();
	const statisticsData: StatisticsItem[] = [
		{
			title: 'Đã hoàn thành',
			value: statistics.completed,
			icon: <CheckCircleOutlined style={{ color: '#17C229' }} />,
			valueColor: '#17C229',
			backgroundColor: '#EAFFDF',
		},
		{
			title: 'Đến hạn',
			value: statistics.pending,
			icon: <ClockCircleOutlined style={{ color: '#FFAF0B' }} />,
			valueColor: '#FFAF0B',
			backgroundColor: '#fffbe6',
		},
		{
			title: 'Chưa hoàn thành',
			value: statistics.notStarted,
			icon: <ExclamationCircleOutlined style={{ color: '#DA2128' }} />,
			valueColor: '#DA2128',
			backgroundColor: '#fff2e8',
		},
		{
			title: 'Quá hạn nộp bài',
			value: statistics.overdue,
			icon: <StopOutlined style={{ color: '#121212' }} />,
			valueColor: '#121212',
			backgroundColor: '#f6f6f6',
		},
	];

	return (
		<StatisticsCard
			title='Thống kê số liệu cho bài tập, bài kiểm tra'
			data={statisticsData}
			containerStyle={{
				marginBottom: '16px',
				backgroundColor: '#fff',
				padding: '20px',
				boxShadow: '0px 0px 12px 0px #0000000A',
				borderRadius: '8px',
			}}
			colSpan={{ xs: 12, sm: 6 }}
		/>
	);
};

export default Statistics;
