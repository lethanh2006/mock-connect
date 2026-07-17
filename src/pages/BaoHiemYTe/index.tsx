import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { type IColumn } from '@/components/Table/typing';
import { BaoHiemYTe } from '@/services/BaoHiemYTe/typing';
import { formatDate } from '@/utils/formatDate';
import { FormOutlined } from '@ant-design/icons';
import { useModel } from '@umijs/max';
import dayjs from 'dayjs';
import Form from './components/Form';

const SinhVienDangKyBHYT = () => {
	const { page, limit, getModel, handleView, handleEdit } = useModel('baohienyte.dotdangky');

	const onCell = (rec: BaoHiemYTe.IDotDangKy) => ({
		onClick: () => handleView(rec),
		style: { cursor: 'pointer' },
	});

	const getData = () => {
		getModel(undefined, undefined, undefined, undefined, undefined, 'me/all');
	};

	const trongThoiGianDangKy = (rec: BaoHiemYTe.IDotDangKy) => {
		const now = dayjs();
		const start = dayjs(rec.registrationStartAt);
		const end = dayjs(rec.registrationEndAt);

		if (!start.isValid() || !end.isValid()) return false;

		return !now.isBefore(start) && !now.isAfter(end);
	};

	const choPhepDangKy = (rec: BaoHiemYTe.IDotDangKy) => {
		const dotDangMo = rec.status ? rec.status === 'OPEN' : true;
		const chuaNopKhaiBao = rec.myRegistration?.declarationType
			? rec.myRegistration.declarationType === 'CHUA_DANG_KY'
			: true;

		return trongThoiGianDangKy(rec) && dotDangMo && chuaNopKhaiBao;
	};

	const columns: IColumn<BaoHiemYTe.IDotDangKy>[] = [
		{
			title: 'Period Name',
			dataIndex: 'name',
			width: 220,
			filterType: 'string',
			onCell,
		},
		{
			title: 'Start Date',
			dataIndex: 'registrationStartAt',
			width: 170,
			align: 'center',
			filterType: 'date',
			sortable: true,
			render: (val) => (val ? formatDate(val) : '--'),
			onCell,
		},
		{
			title: 'End Date',
			dataIndex: 'registrationEndAt',
			width: 170,
			align: 'center',
			filterType: 'date',
			sortable: true,
			render: (val) => (val ? formatDate(val) : '--'),
			onCell,
		},
		{
			title: 'Note',
			dataIndex: 'note',
			width: 220,
			filterType: 'string',
			render: (value) => <ExpandText>{value || '--'}</ExpandText>,
			onCell,
		},
		{
			title: 'Đăng ký',
			width: 90,
			align: 'center',
			fixed: 'right',
			render: (val, rec) => {
				const coTheDangKy = choPhepDangKy(rec);

				return (
					<>
						<ButtonExtend
							tooltip={coTheDangKy ? 'Đăng ký' : 'Không thể đăng ký'}
							// disabled={!coTheDangKy}
							onClick={() => handleEdit(rec)}
							type='link'
							icon={<FormOutlined />}
						/>
					</>
				);
			},
			onCell,
		},
	];

	return (
		<TableBase
			getData={getData}
			columns={columns}
			dependencies={[page, limit]}
			modelName='baohienyte.dotdangky'
			title='Đăng ký bảo hiểm y tế'
			Form={Form}
			formProps={{ getData }}
			buttons={{ create: false }}
			widthDrawer={900}
			showModalTitle
		/>
	);
};

export default SinhVienDangKyBHYT;
