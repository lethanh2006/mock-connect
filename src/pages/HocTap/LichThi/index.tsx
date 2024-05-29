import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import FilterHocKy from '@/pages/DaoTao/HocKy/FilterHocKy';
import type { LichThi } from '@/services/KhaoThi/LichThi/typing';
import { EDKDTCongNo, EDKDTKetQuaHocTap, colorDKDTCongNo, colorDKDTKetQuaHocTap } from '@/services/KhaoThi/constant';
import { Card, Tag } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const LichThiPage = () => {
	const { record: recHocKy } = useModel('daotao.hocky');
	const { danhSachMe, getMeByHocKyModel, loading } = useModel('khaothi.lichthi');

	useEffect(() => {
		if (recHocKy?.ma) getMeByHocKyModel({ maHocKy: recHocKy.ma });
	}, [recHocKy?.ma]);

	const columns: IColumn<LichThi.IRecordMe>[] = [
		{
			title: 'Đợt thi',
			dataIndex: 'kyThi',
			width: 180,
			filterType: 'string',
		},
		{
			title: 'Ngày thi',
			dataIndex: 'ngayThi',
			align: 'center',
			width: 80,
		},
		{
			title: 'Giờ thi',
			dataIndex: 'gioThi',
			align: 'center',
			width: 60,
		},
		{
			title: 'Mã HP',
			dataIndex: 'maHocPhan',
			align: 'center',
			width: 100,
			filterType: 'string',
			sortable: true,
		},
		{
			title: 'Tên học phần',
			dataIndex: 'tenHocPhan',
			width: 180,
			filterType: 'string',
		},
		{
			title: 'Số SV',
			dataIndex: 'soLuong',
			align: 'center',
			width: 80,
			sortable: true,
		},
		{
			title: 'Điều kiện dự thi',
			width: 160,
			children: [
				{
					title: 'KQHT',
					dataIndex: 'dieuKienKetQuaHocTap',
					align: 'center',
					width: 80,
					filterType: 'select',
					filterData: Object.values(EDKDTKetQuaHocTap),
					render: (val: EDKDTKetQuaHocTap) => val && <Tag color={colorDKDTKetQuaHocTap[val]}>{val}</Tag>,
				},
				{
					title: 'Công nợ',
					dataIndex: 'dieuKienCongNo',
					align: 'center',
					width: 80,
					filterType: 'select',
					filterData: Object.values(EDKDTCongNo),
					render: (val: EDKDTCongNo) => val && <Tag color={colorDKDTCongNo[val]}>{val}</Tag>,
				},
			],
		},
	];

	return (
		<Card title='Lịch thi học kỳ'>
			<TableStaticData columns={columns} data={danhSachMe} addStt loading={loading}>
				<FilterHocKy isSetHocKy />
			</TableStaticData>
		</Card>
	);
};

export default LichThiPage;
