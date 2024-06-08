import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import FilterHocKy from '@/pages/DaoTao/HocKy/FilterHocKy';
import type { LichThi } from '@/services/KhaoThi/LichThi/typing';
import {
	EDKDTCongNo,
	EDKDTKetQuaHocTap,
	ETrangThaiSinhVienThi,
	MapKeyColorTrangThaiSinhVienThi,
	colorDKDTCongNo,
	colorDKDTKetQuaHocTap,
} from '@/services/KhaoThi/constant';
import { Card, Tag, Tooltip, Button } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import DanhSachSinhVienThi from './DanhSachSinhVienThi';
import { TeamOutlined } from '@ant-design/icons';

const LichThiPage = () => {
	const { record: recHocKy } = useModel('daotao.hocky');
	const { danhSachMe, getMeByHocKyModel, loading } = useModel('khaothi.lichthi');
	const [recLichThi, setRecLichThi] = useState<LichThi.IRecordMe>();
	const [visibleDSSV, setVisibleDSSV] = useState<boolean>(false);
	useEffect(() => {
		if (recHocKy?.ma) getMeByHocKyModel({ maHocKy: recHocKy.ma });
	}, [recHocKy?.ma]);

	const onCell = (rec: LichThi.IRecordMe) => ({
		onClick: () => {
			setRecLichThi(rec);
			setVisibleDSSV(true);
		},
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<LichThi.IRecordMe>[] = [
		{
			title: 'Đợt thi',
			dataIndex: 'kyThi',
			width: 180,
			filterType: 'string',
			onCell,
		},
		{
			title: 'Ngày thi',
			dataIndex: 'ngayThi',
			align: 'center',
			width: 80,
			onCell,
		},
		{
			title: 'Giờ thi',
			dataIndex: 'gioThi',
			align: 'center',
			width: 60,
			onCell,
		},
		{
			title: 'Mã HP',
			dataIndex: 'maHocPhan',
			align: 'center',
			width: 100,
			filterType: 'string',
			sortable: true,
			onCell,
		},
		{
			title: 'Tên học phần',
			dataIndex: 'tenHocPhan',
			width: 180,
			filterType: 'string',
			onCell,
		},
		{
			title: 'Phòng thi',
			dataIndex: 'phong',
			width: 80,
			onCell,
		},
		{
			title: 'Số SV',
			dataIndex: 'soLuong',
			align: 'center',
			width: 80,
			sortable: true,
			onCell,
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
					onCell,
				},
				{
					title: 'Công nợ',
					dataIndex: 'dieuKienCongNo',
					align: 'center',
					width: 80,
					filterType: 'select',
					filterData: Object.values(EDKDTCongNo),
					render: (val: EDKDTCongNo) => val && <Tag color={colorDKDTCongNo[val]}>{val}</Tag>,
					onCell,
				},
				{
					title: 'Trạng thái thi',
					dataIndex: 'trangThai',
					align: 'center',
					width: 80,
					filterType: 'select',
					filterData: Object.values(ETrangThaiSinhVienThi),
					render: (val: ETrangThaiSinhVienThi) => val && <Tag color={MapKeyColorTrangThaiSinhVienThi[val]}>{val}</Tag>,
					onCell,
				},
			],
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 80,
			render: (rec) => (
				<Tooltip title='Xem danh sách sinh viên thi'>
					<Button
						type='link'
						onClick={() => {
							setRecLichThi(rec);
							setVisibleDSSV(true);
						}}
						icon={<TeamOutlined />}
					/>
				</Tooltip>
			),
		},
	];

	return (
		<Card title='Lịch thi học kỳ'>
			<TableStaticData columns={columns} data={danhSachMe} addStt loading={loading}>
				<FilterHocKy isSetHocKy />
			</TableStaticData>
			{recLichThi && (
				<DanhSachSinhVienThi recLichThi={recLichThi} visible={visibleDSSV} handleCancel={() => setVisibleDSSV(false)} />
			)}
		</Card>
	);
};

export default LichThiPage;
