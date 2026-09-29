import StatisticsCard from '@/components/StatisticsCard';
import { StatisticsItem } from '@/components/StatisticsCard/typing';
import { tienVietNam } from '@/utils/utils';

import { IconXmarkCircle, IconShieldCheck, IconFileMoney, IconWarningCircle, IconShorttext } from '@/components/Icons';
import { Col, Row } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';

interface ThongKeProps {
	data?: any[];
	tenQuyTrinh?: string;
}

const ThongKeDichVu = ({ data, tenQuyTrinh }: ThongKeProps) => {
	const intl = useIntl();
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
			tongSoTienFormatted: tienVietNam(tongSoTienDaThu),
			tongTienChuaThanhToanFormatted: tienVietNam(tongSoTienConLai),
		});
	};

	const thongKeDichVuData: StatisticsItem[] = [
		{
			title: intl.formatMessage({ id: 'dichvuhanhchinh.lichsu.thongke.tongdon' }),
			value: thongKe.tongSoDon,
			icon: <IconShorttext />,
			valueColor: '#FFAF0B',
		},
		{
			title: intl.formatMessage({ id: 'dichvuhanhchinh.lichsu.thongke.dahoanthanh' }),
			value: thongKe.daHoanThanh,
			icon: <IconShieldCheck />,
			valueColor: '#17C229',
		},
		{
			title: intl.formatMessage({ id: 'dichvuhanhchinh.lichsu.thongke.chuahoanthanh' }),
			value: thongKe.chuaThanhToan,
			icon: <IconWarningCircle />,
			valueColor: '#DA2128',
		},
	];

	const thongKeChiPhiData: StatisticsItem[] = [
		{
			title: intl.formatMessage({ id: 'dichvuhanhchinh.lichsu.thongke.tongtien' }),
			value: thongKe.tongSoTienFormatted,
			icon: <IconFileMoney />,
			valueColor: '#17C229',
		},
		{
			title: intl.formatMessage({ id: 'dichvuhanhchinh.lichsu.thongke.chuathanhtoan' }),
			value: thongKe.tongTienChuaThanhToanFormatted,
			icon: <IconXmarkCircle />,
			valueColor: '#DA2128',
		},
	];

	return (
		<div style={{ marginBottom: '16px' }}>
			<Row gutter={[12, 12]} wrap>
				<Col xs={24} lg={12}>
					<StatisticsCard
						title={intl.formatMessage({ id: 'dichvuhanhchinh.lichsu.thongke.dichvu' })}
						data={thongKeDichVuData}
						loading={loading}
						colSpan={{ xs: 24, md: 8 }}
					/>
				</Col>

				<Col xs={24} lg={12}>
					<StatisticsCard
						title={intl.formatMessage({ id: 'dichvuhanhchinh.lichsu.thongke.chiphi' })}
						data={thongKeChiPhiData}
						loading={loading}
						colSpan={{ xs: 24, md: 12 }}
					/>
				</Col>
			</Row>
		</div>
	);
};

export default ThongKeDichVu;
