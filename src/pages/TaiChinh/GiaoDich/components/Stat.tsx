import StatisticsCard from '@/components/StatisticsCard';
import { StatisticsItem } from '@/components/StatisticsCard/typing';
import { tienVietNam } from '@/utils/utils';
import { DollarCircleOutlined, ImportOutlined } from '@ant-design/icons';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const StatGiaoDich = () => {
	const intl = useIntl();
	const { getTongGiaoDichSinhVienModel, tongGiaoDich, loading } = useModel('taichinh.giaodich');

	useEffect(() => {
		getTongGiaoDichSinhVienModel();
	}, []);

	const thongKeSoTienData: StatisticsItem[] = [
		{
			title: intl.formatMessage({ id: 'lichsugiaodich.stat.tongtien' }),
			value: tienVietNam(tongGiaoDich?.totalIn ?? 0),
			icon: <ImportOutlined />,
			status: 'success',
		},
		{
			title: intl.formatMessage({ id: 'lichsugiaodich.stat.sodu' }),
			value: tienVietNam(tongGiaoDich?.totalRemain ?? 0),
			icon: <DollarCircleOutlined />,
		},
	];

	return (
		<div style={{ marginBottom: 18 }}>
			<StatisticsCard data={thongKeSoTienData} loading={loading} colSpan={{ xs: 24, md: 12 }} hideCard />
		</div>
	);
};

export default StatGiaoDich;
