import StatisticsCard, { StatisticsItem } from '@/components/StatisticsCard';
import {
	CheckCircleOutlined,
	DollarCircleOutlined,
	ExclamationCircleOutlined,
	FileTextOutlined,
	StopOutlined,
} from '@ant-design/icons';
import { Col, Row } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

interface ThongKeProps {
	data?: any[];
	tenQuyTrinh?: string;
}

const ThongKeDichVu = ({ data, tenQuyTrinh }: ThongKeProps) => {
	const { danhSach, loading } = useModel('quytrinh.khaibaoquytrinh');
	const { getOneModel: getHoaDon } = useModel('taichinh.hoadon');
	const [thongKe, setThongKe] = useState({
		tongSoDon: 0,
		daHoanThanh: 0,
		chuaThanhToan: 0,
		tongSoTien: 0,
		tongTienChuaThanhToan: 0,
		tongSoTienFormatted: '0 VNĐ',
		tongTienChuaThanhToanFormatted: '0 VNĐ',
	});

	useEffect(() => {
		const dataToProcess = data || danhSach || [];
		calculateThongKe(dataToProcess);
	}, [data, danhSach]);

	const formatNumber = (num: number) => num.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

	const calculateThongKe = async (dataList: any[]) => {
		let tongSoDon = dataList.length;
		let daHoanThanh = 0;
		let chuaThanhToan = 0;
		let tongSoTienPhaiThu = 0;
		let tongSoTienDaThu = 0;
		let tongSoTienConLai = 0;

		for (const item of dataList) {
			const buocCuoi = item?.danhSachBuocXuLy?.[item?.danhSachBuocXuLy?.length - 1];
			if (buocCuoi?.trangThaiTiepNhan === 'DA_DUYET') {
				daHoanThanh++;
			}

			if (item.identityCode) {
				try {
					const hoaDon = await getHoaDon({ identityCode: item.identityCode });

					const soTienPhaiThu = hoaDon?.soTienPhaiThu || 0;
					const soTienDaThu = hoaDon?.soTienDaThu || 0;
					const soTienConLai = hoaDon?.soTienConLai || soTienPhaiThu - soTienDaThu;

					tongSoTienPhaiThu += soTienPhaiThu;
					tongSoTienDaThu += soTienDaThu;
					tongSoTienConLai += soTienConLai;

					if (soTienConLai > 0) {
						chuaThanhToan++;
					}
				} catch (error) {
					console.error(`Lỗi lấy hóa đơn cho identityCode ${item.identityCode}:`, error);
				}
			}
		}

		setThongKe({
			tongSoDon,
			daHoanThanh,
			chuaThanhToan,
			tongSoTien: tongSoTienDaThu,
			tongTienChuaThanhToan: tongSoTienConLai,
			tongSoTienFormatted: formatNumber(tongSoTienDaThu),
			tongTienChuaThanhToanFormatted: formatNumber(tongSoTienConLai),
		});
	};

	const thongKeDichVuData: StatisticsItem[] = [
		{
			title: 'Tổng số đơn',
			value: thongKe.tongSoDon,
			icon: <FileTextOutlined style={{ color: '#FFAF0B' }} />,
			valueColor: '#FFAF0B',
			backgroundColor: '#fffbe6',
		},
		{
			title: 'Đã hoàn thành',
			value: thongKe.daHoanThanh,
			icon: <CheckCircleOutlined style={{ color: '#17C229' }} />,
			valueColor: '#17C229',
			backgroundColor: '#EAFFDF',
		},
		{
			title: 'Chưa thanh toán',
			value: thongKe.chuaThanhToan,
			icon: <ExclamationCircleOutlined style={{ color: '#DA2128' }} />,
			valueColor: '#DA2128',
			backgroundColor: '#fff2e8',
		},
	];

	const thongKeChiPhiData: StatisticsItem[] = [
		{
			title: 'Tổng số tiền',
			value: thongKe.tongSoTienFormatted,
			icon: <DollarCircleOutlined style={{ color: '#17C229' }} />,
			valueColor: '#17C229',
			backgroundColor: '#EAFFDF',
		},
		{
			title: 'Chưa thanh toán',
			value: thongKe.tongTienChuaThanhToanFormatted,
			icon: <StopOutlined style={{ color: '#DA2128' }} />,
			valueColor: '#DA2128',
			backgroundColor: '#fff2e8',
		},
	];

	return (
		<div style={{ marginBottom: '16px' }}>
			<Row gutter={[16, 32]} wrap>
				<Col xs={24} lg={12}>
					<StatisticsCard
						title='Thống kê dịch vụ'
						data={thongKeDichVuData}
						loading={loading}
						colSpan={{ xs: 24, sm: 12, md: 8 }}
						containerStyle={{
							marginBottom: '16px',
							backgroundColor: '#fff',
							padding: '20px',
							boxShadow: '0px 0px 12px 0px #0000000A',
							borderRadius: '8px',
						}}
					/>
				</Col>

				<Col xs={24} lg={12}>
					<StatisticsCard
						containerStyle={{
							marginBottom: '16px',
							backgroundColor: '#fff',
							padding: '20px',
							boxShadow: '0px 0px 12px 0px #0000000A',
							borderRadius: '8px',
						}}
						title='Thống kê chi phí'
						data={thongKeChiPhiData}
						loading={loading}
						colSpan={{ xs: 24, sm: 12 }}
					/>
				</Col>
			</Row>
		</div>
	);
};

export default ThongKeDichVu;
