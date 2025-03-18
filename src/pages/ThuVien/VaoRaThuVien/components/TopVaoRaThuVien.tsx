import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import type { QuanLyThuVien } from '@/services/QuanLyThuVien/typing';
import { Modal, Progress } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const SoLuongTopVaoRaThuVien = () => {
	const { loadingTop, dataThongKeCheckInTop, getSoLuotCheckInTopModel, visibleForm, setVisibleForm } =
		useModel('thuvien.vaorathuvien');

	useEffect(() => {
		if (visibleForm) getSoLuotCheckInTopModel();
	}, [visibleForm]);

	const columns: IColumn<QuanLyThuVien.IThongKeCheckInTop>[] = [
		{
			title: 'Mã SV',
			dataIndex: 'maSv',
			width: 90,
			filterType: 'string',
		},
		{
			title: 'Họ tên',
			dataIndex: 'hoTen',
			width: 120,
			filterType: 'string',
		},
		{
			title: 'Tổng lượt',
			dataIndex: 'total',
			width: 150,
			render: (val, rec, index) => {
				const firstTotal = dataThongKeCheckInTop[0]?.total || 1;
				const percent = index === 0 ? 100 : ((val / firstTotal) * 100).toFixed(2);
				return <Progress percent={Number(percent)} format={() => `${val}`} style={{ width: '100%' }} />;
			},
			filterType: 'number',
			sortable: true,
		},
	];

	return (
		<Modal
			title='Bạn đọc có số lượt vào thư viện nhiều nhất'
			visible={visibleForm}
			onCancel={() => setVisibleForm(false)}
			footer={null}
			width={700}
		>
			<TableStaticData
				loading={loadingTop}
				columns={columns}
				data={dataThongKeCheckInTop ?? []}
				otherProps={{ pagination: false }}
				hasTotal
				addStt
			/>
		</Modal>
	);
};

export default SoLuongTopVaoRaThuVien;
