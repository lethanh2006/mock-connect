import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import type { SinhVienThi } from '@/services/KhaoThi/SinhVienThi/typing';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

const DiemThiHocKy = (props: { maHocKy: string; maHocPhan: string }) => {
	const { maHocKy, maHocPhan } = props;
	const { loading, getDiemThiHocKySinhVienModel } = useModel('khaothi.sinhvienthi');
	const [diemThiHocKySinhVien, setDiemThiHocKySinhVien] = useState<SinhVienThi.IDiemThiHocKySinhVien[]>([]);

	useEffect(() => {
		if (maHocKy && maHocPhan) {
			getDiemThiHocKySinhVienModel(maHocKy, maHocPhan).then((res) => setDiemThiHocKySinhVien(res));
		}
	}, []);

	const columns: IColumn<SinhVienThi.IDiemThiHocKySinhVien>[] = [
		{
			title: 'Học kỳ',
			dataIndex: 'kyThi',
			width: 250,
			render: (val, rec) => val ?? '--',
		},
		{
			title: 'Điểm thi',
			dataIndex: 'diemThi',
			align: 'center',
			width: 90,
			render: (val, rec) => val ?? '--',
		},
		{
			title: 'Điểm phúc khảo',
			dataIndex: 'diemPhucKhao',
			align: 'center',
			width: 90,
			render: (val, rec) => val ?? '--',
		},
	];

	return (
		<TableStaticData
			addStt
			data={diemThiHocKySinhVien}
			columns={columns}
			size='small'
			loading={loading}
			otherProps={{ pagination: false, scroll: { y: 150 } }}
		/>
	);
};

export default DiemThiHocKy;
