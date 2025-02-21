import LineChart from '@/components/Chart/LineChart';
import { inputFormat } from '@/utils/utils';
import { Modal, Spin } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const ModalThongKeVaoRaThuVien = (props: { visible: boolean; setVisible: (val: boolean) => void }) => {
	const { loading, thongKeVaoRaModel, thongKeVaoRa } = useModel('thuvien.vaorathuvien');
	const { visible, setVisible } = props;

	useEffect(() => {
		if (!thongKeVaoRa.length && visible) thongKeVaoRaModel();
	}, [visible]);

	return (
		<Modal
			visible={visible}
			onCancel={() => setVisible(false)}
			title='Thống kê vào ra thư viện'
			width={800}
			okButtonProps={{ hidden: true }}
			cancelText='Đóng'
		>
			<Spin spinning={loading}>
				<LineChart
					xAxis={thongKeVaoRa.map((i) => `${i.thang + 1}/${i.nam}`)}
					yAxis={[thongKeVaoRa.map((i) => i.totalCI), thongKeVaoRa.map((i) => i.totalCO)]}
					yLabel={['Lượt vào', 'Lượt ra']}
					title='Số lượt'
					height={400}
					formatY={(val) => `${inputFormat(val)} lượt`}
					colors={['#0982c9', '#18b903']}
					otherOptions={{ legend: { horizontalAlign: 'center', position: 'bottom' } }}
				/>
			</Spin>
		</Modal>
	);
};

export default ModalThongKeVaoRaThuVien;
