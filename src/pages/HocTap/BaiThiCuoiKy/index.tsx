import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { type IColumn } from '@/components/Table/typing';
import { type EDinhDangBaiThi, mapNameDinhDangBaiThi } from '@/services/KhaoThi/constant';
import type { SinhVienThi } from '@/services/KhaoThi/SinhVienThi/typing';
import { getNameFile } from '@/utils/utils';
import { SaveOutlined } from '@ant-design/icons';
import { Card, Tag } from 'antd';
import moment from 'moment';
import { useModel } from 'umi';
import Form from './components/Form';
import FilterKyThi from './KyThi/Filter';

const BaiThiCuoiKy = () => {
	const { record: recordHocKy } = useModel('daotao.hocky');
	const { record: reckyThi } = useModel('khaothi.kythi');
	const { getModel, page, limit, handleEdit } = useModel('khaothi.sinhvienthi');

	const getData = () => {
		if (recordHocKy?._id)
			getModel(
				{
					kyThiId: reckyThi?._id,
				},
				undefined,
				undefined,
				undefined,
				undefined,
				`me/hoc-phan-nop-bai/hoc-ky/${recordHocKy?.ma}`,
			);
	};

	const columns: IColumn<SinhVienThi.IRecord>[] = [
		{
			title: 'Tên học phần',
			dataIndex: 'tenHocPhan',
			width: 150,
			filterType: 'string',
		},
		{
			title: 'Mã học phần',
			align: 'center',
			dataIndex: 'maHocPhan',
			width: 90,
			filterType: 'string',
		},
		{
			title: 'Thời gian bắt đầu',
			align: 'center',
			dataIndex: 'thoiGianBatDau',
			width: 120,
			render: (val, rec) => val && moment(val).format('HH:mm DD/MM/YYYY'),
			filterType: 'date',
			sortable: true,
		},
		{
			title: 'Thời gian kết thúc',
			align: 'center',
			dataIndex: 'thoiGianKetThuc',
			width: 120,
			render: (val, rec) => val && moment(val).format('HH:mm DD/MM/YYYY'),
			filterType: 'date',
			sortable: true,
		},
		{
			title: 'Số lượng file',
			align: 'center',
			dataIndex: 'soFilePhaiNop',
			width: 100,
		},
		{
			title: 'Dung lượng tối đa',
			align: 'center',
			dataIndex: 'dungLuongToiDa',
			render: (val, rec) => `${val} MB`,
			width: 100,
		},
		{
			title: 'Định dạng cho phép',
			dataIndex: 'dinhDangFileChoPhep',
			width: 200,
			render: (val: EDinhDangBaiThi[], rec) => (
				<div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
					{val?.map((item) => (
						<Tag key={item}>{mapNameDinhDangBaiThi[item]}</Tag>
					))}
				</div>
			),
		},
		{
			title: 'Bài tập',
			dataIndex: 'daNopBai',
			width: 150,
			render: (val, rec) =>
				!val ? (
					<div style={{ textAlign: 'center' }}>
						<Tag color='red'>Chưa nộp bài</Tag>
					</div>
				) : (
					rec?.urlBaiNop?.map((item: any) => (
						<div key={item} style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
							-{' '}
							<a href={item} target='_blank' rel='noreferrer'>
								{getNameFile(item)}
							</a>
						</div>
					))
				),
		},
		{
			title: 'Ghi chú',
			dataIndex: 'ghiChuKhac',
			width: 180,
			render: (val, rec) => <ExpandText>{val}</ExpandText>,
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 60,
			fixed: 'right',
			render: (val, rec) => {
				const ngoaiThoiGian =
					!rec?.thoiGianBatDau ||
					!rec?.thoiGianKetThuc ||
					moment().isBefore(rec?.thoiGianBatDau) ||
					moment().isAfter(rec?.thoiGianKetThuc);
				return (
					<ButtonExtend
						disabled={ngoaiThoiGian || !!rec?.daNopBai}
						tooltip={!!rec?.daNopBai ? 'Đã nộp bài' : ngoaiThoiGian ? 'Ngoài thời gian nộp bài' : 'Nộp bài tập'}
						onClick={() => handleEdit(rec)}
						type='link'
						icon={<SaveOutlined />}
					/>
				);
			},
		},
	];

	return (
		<Card title='Nộp bài cuối kỳ'>
			<div style={{ marginBottom: 12 }}>
				<FilterKyThi />
			</div>

			<TableBase
				getData={getData}
				buttons={{
					create: false,
				}}
				columns={columns}
				dependencies={[page, limit, reckyThi?._id, recordHocKy?.ma]}
				modelName='khaothi.sinhvienthi'
				hideCard
				Form={Form}
				formProps={{ getData }}
			/>
		</Card>
	);
};

export default BaiThiCuoiKy;
