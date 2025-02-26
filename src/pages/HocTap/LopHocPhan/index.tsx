import ExpandText from '@/components/ExpandText';
import ButtonExtend from '@/components/Table/ButtonExtend';
import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';
import FilterHocKy from '@/pages/DaoTao/HocKy/FilterHocKy';
import { ELoaiLopHocPhan } from '@/services/HocTap/LopHocPhan/constant';
import { type LopHocPhan } from '@/services/HocTap/LopHocPhan/typings';
import { ReloadOutlined } from '@ant-design/icons';
import { Card } from 'antd';
import { useEffect } from 'react';
import { history, useModel } from 'umi';
import RenderLichHoc from '../DangKyTinChi/components/RenderLichHoc';

const LopHocPhanPage = () => {
	const { danhSach, sinhVienGetAllModel, loading } = useModel('lophocphan.lophocphan');
	const { record: recHocKy } = useModel('daotao.hocky');

	const getData = () => {
		if (recHocKy?.ma) sinhVienGetAllModel({ maHocKy: recHocKy?.ma });
	};

	useEffect(() => {
		getData();
	}, [recHocKy?.ma]);

	const onCell = (loptinchi: LopHocPhan.IRecord) => ({
		onClick: () =>
			loptinchi.loai === ELoaiLopHocPhan.CHINH ? history.push(`/hoc-tap/lop-tin-chi/${loptinchi._id}`) : undefined,
		style: { cursor: loptinchi.loai === ELoaiLopHocPhan.CHINH ? 'pointer' : undefined },
	});

	const columns: IColumn<LopHocPhan.IRecord>[] = [
		{
			title: 'Tên lớp học',
			dataIndex: 'ten',
			width: 140,
			onCell,
			filterType: 'string',
			sortable: true,
		},
		{
			title: 'Mã HP',
			dataIndex: ['hocPhan', 'ma'],
			width: 100,
			filterType: 'string',
			onCell,
		},
		{
			title: 'Tên học phần',
			dataIndex: ['hocPhan', 'ten'],
			width: 200,
			filterType: 'string',
			onCell,
		},
		{
			title: 'STC',
			dataIndex: ['hocPhan', 'soTinChi'],
			align: 'center',
			width: 60,
			filterType: 'number',
			sortable: true,
			onCell,
		},
		{
			title: 'Giảng viên',
			width: 160,
			render: (val, rec) => (
				<ExpandText>
					{rec.nhanSuList
						?.map((item) =>
							item.nhanSu?.ten ? `${item.nhanSu?.hoDem ?? ''} ${item.nhanSu?.ten ?? ''}` : item.tenNhanSu,
						)
						.join(', ')}
				</ExpandText>
			),
		},
		{
			title: 'Lịch học',
			width: 220,
			render: (val, rec) => {
				const lichThucHanh =
					danhSach?.filter((item) => item?.maHocPhan === rec?.maHocPhan && item?.maLopCha === rec?.maLop) ?? [];

				return <RenderLichHoc lopHocPhan={rec} lichThucHanh={lichThucHanh} />;
			},
		},
	];

	return (
		<Card title='Lớp tín chỉ'>
			<TableStaticData
				loading={loading}
				data={danhSach.filter((item) => item?.maLopCha === null)}
				columns={columns}
				addStt
				otherProps={{ pagination: true }}
				otherButtons={[
					<FilterHocKy isSetHocKy key='1' />,
					<ButtonExtend key='2' icon={<ReloadOutlined />} onClick={() => getData()}>
						Tải lại
					</ButtonExtend>,
				]}
				hasTotal
			/>
		</Card>
	);
};

export default LopHocPhanPage;
