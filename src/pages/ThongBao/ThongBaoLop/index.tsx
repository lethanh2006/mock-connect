import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import type { IColumn } from '@/components/Table/typing';
import type { ThongBao } from '@/services/ThongBao/typing';
import { EyeOutlined } from '@ant-design/icons';
import moment from 'moment';
import { useModel } from 'umi';
import { Modal } from 'antd';
import { useState } from 'react';
import ViewThongBao from '../components/ViewThongBao';

const ThongBaoLopPage = (props: { idLop: string; loai: 'lop-hanh-chinh' | 'lop-hoc-phan' }) => {
	const { page, limit, getThongBaoLopModel, setRecord, record } = useModel('thongbao.thongbaolop');
	const { readNotificationModel } = useModel('thongbao.noticeicon');
	const [visibleThongBao, setVisibleThongBao] = useState<boolean>(false);
	const { loai, idLop } = props;

	const getData = () => loai && idLop && getThongBaoLopModel(idLop, loai);

	const columns: IColumn<ThongBao.IRecord>[] = [
		{
			title: 'Tiêu đề',
			dataIndex: 'title',
			width: 200,
			filterType: 'string',
			render: (val, recordVal) => val && <ExpandText>{val}</ExpandText>,
		},
		{
			title: 'Mô tả',
			dataIndex: 'description',
			width: 280,
			filterType: 'string',
			render: (val) => <ExpandText>{val}</ExpandText>,
		},
		{
			title: 'Thời gian gửi',
			dataIndex: 'createdAt',
			width: 120,
			align: 'center',
			filterType: 'datetime',
			sortable: true,
			render: (val) => val && moment(val).format('HH:mm DD/MM/YYYY'),
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 60,
			fixed: 'right',
			render: (val, rec) => (
				<ButtonExtend
					tooltip='Xem chi tiết'
					onClick={() => {
						setRecord(rec);
						setVisibleThongBao(true);
						if (!rec.read) readNotificationModel('ONE', rec?._id);
					}}
					type='link'
					icon={<EyeOutlined />}
				/>
			),
		},
	];

	return (
		<>
			<TableBase
				columns={columns}
				getData={getData}
				dependencies={[page, limit, idLop, loai]}
				modelName='thongbao.thongbaolop'
				widthDrawer={800}
				hideCard
				formProps={{ idLop, loai, getData }}
				buttons={{ create: false }}
			/>

			<Modal
				width={800}
				bodyStyle={{ padding: 0 }}
				destroyOnClose
				onCancel={() => setVisibleThongBao(false)}
				visible={visibleThongBao}
				okButtonProps={{ hidden: true }}
				cancelText='Đóng'
			>
				<ViewThongBao record={record} />
			</Modal>
		</>
	);
};

export default ThongBaoLopPage;
