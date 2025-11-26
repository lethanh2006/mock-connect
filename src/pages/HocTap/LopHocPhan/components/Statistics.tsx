import StatisticsCard from '@/components/StatisticsCard';
import { StatisticsItem } from '@/components/StatisticsCard/typing';
import { ETrangThaiNopBaiTap } from '@/services/DaoTao/BaiTap/constants';
import dayjs from '@/utils/dayjs';
import { CheckCircleOutlined, ClockCircleOutlined, ExclamationCircleOutlined, StopOutlined } from '@ant-design/icons';
import { useEffect } from 'react';
import { useModel } from 'umi';

const BaiTapStatistics = () => {
	const { danhSach, thongKeBaiTapModel, thongKeBaiTap, getThongKeBaiTapSinhVienModel, loading } =
		useModel('daotao.baitap');
	const { record: recHocKy } = useModel('daotao.hocky');

	// Calculate statistics
	const getStatistics = () => {
		const now = dayjs();

		// Đã hoàn thành: đã nộp bài (có trangThai là đã nộp)
		const completedCount = danhSach.filter((item) => item.trangThai === ETrangThaiNopBaiTap.DA_NOP).length;

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

		console.log(thongKeBaiTap);

		return {
			total: thongKeBaiTap?.soBaiTapDuocGiao,
			completed: completedCount,
			pending: pendingCount,
			notStarted: notStartedCount,
			overdue: overdueCount,
			inprogress: thongKeBaiTap?.soBaiTapDangDienRa,
			graded: thongKeBaiTap?.soBaiTapDaChamDiem,
		};
	};

	const getData = () => {
		if (recHocKy?.ma) {
			const startDate = new Date(recHocKy?.thoiGianBatDau || Date.now());
			const endDate = dayjs(recHocKy?.thoiGianBatDau || Date.now())
				.add(recHocKy.soTuan || 1, 'week')
				.toDate();
			thongKeBaiTapModel(startDate, endDate);

			getThongKeBaiTapSinhVienModel(recHocKy.ma);
		}
	};

	useEffect(() => {
		getData();
	}, [recHocKy?.ma]);

	const statistics = getStatistics();
	const statisticsData: StatisticsItem[] = [
		{
			title: 'Tổng số',
			value: statistics.total || 0,
			icon: <CheckCircleOutlined />,
		},
		{
			title: 'Đã hoàn thành',
			value: statistics.completed,
			icon: <CheckCircleOutlined />,
			status: 'success',
		},
		// {
		// 	title: 'Đến hạn',
		// 	value: statistics.pending,
		// 	icon: <ClockCircleOutlined />,
		// 	valueColor: '#FFAF0B',
		// },
		{
			title: 'Đang diễn ra',
			value: statistics.inprogress || 0,
			icon: <ClockCircleOutlined />,
			valueColor: '#FFAF0B',
		},
		{
			title: 'Đã chấm điểm',
			value: statistics.graded || 0,
			icon: <ClockCircleOutlined />,
			status: 'info',
		},
		{
			title: 'Chưa hoàn thành',
			value: statistics.notStarted,
			icon: <ExclamationCircleOutlined />,
			status: 'error',
		},
		{
			title: 'Quá hạn nộp bài',
			value: statistics.overdue,
			icon: <StopOutlined />,
			valueColor: '#121212',
		},
	];

	return (
		<StatisticsCard title='Bài tập, bài kiểm tra' data={statisticsData} loading={loading} colSpan={{ xs: 12, md: 4 }} />
	);
};

export default BaiTapStatistics;
