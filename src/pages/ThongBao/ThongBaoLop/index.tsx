import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import type { IColumn } from '@/components/Table/typing';
import type { ThongBao } from '@/services/ThongBao/typing';
import dayjs from '@/utils/dayjs';
import { EyeOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
import { useState } from 'react';
import { useIntl, useModel } from 'umi';
import ViewThongBao from '../components/ViewThongBao';

const ThongBaoLopPage = (props: { idLop: string; loai: 'lop-hanh-chinh' | 'lop-hoc-phan' }) => {
	const intl = useIntl();
	const { page, limit, getThongBaoLopModel, setRecord, record } = useModel('thongbao.thongbaolop');
	const { readNotificationModel } = useModel('thongbao.noticeicon');
	const [visibleThongBao, setVisibleThongBao] = useState<boolean>(false);
	const { loai, idLop } = props;

	const getData = () => loai && idLop && getThongBaoLopModel(idLop, loai);

	const columns: IColumn<ThongBao.IRecord>[] = [
		{
			title: intl.formatMessage({ id: 'lophanhchinh.thongtinchung.thongbao.tieude' }),
			dataIndex: 'title',
			width: 200,
			filterType: 'string',
			render: (val, recordVal) => val && <ExpandText>{val}</ExpandText>,
		},
		{
			title: intl.formatMessage({ id: 'lophanhchinh.thongtinchung.thongbao.mota' }),
			dataIndex: 'description',
			width: 280,
			filterType: 'string',
			render: (val) => <ExpandText>{val}</ExpandText>,
		},
		{
			title: intl.formatMessage({ id: 'lophanhchinh.thongtinchung.thongbao.thoigiangui' }),
			dataIndex: 'createdAt',
			width: 120,
			align: 'center',
			filterType: 'datetime',
			sortable: true,
			render: (val) => val && dayjs(val).format('HH:mm DD/MM/YYYY'),
		},
		{
			title: intl.formatMessage({ id: 'lophanhchinh.thongtinchung.thongbao.thaotac' }),
			align: 'center',
			width: 60,
			fixed: 'right',
			render: (val, rec) => (
				<ButtonExtend
					tooltip={intl.formatMessage({ id: 'lophanhchinh.thongtinchung.thongbao.xemchitiet' })}
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
				styles={{ body: { padding: 0 } }}
				destroyOnClose
				onCancel={() => setVisibleThongBao(false)}
				open={visibleThongBao}
				okButtonProps={{ hidden: true }}
				cancelText={intl.formatMessage({ id: 'global.button.dong', defaultMessage: 'Đóng' })}
			>
				<ViewThongBao record={record} />
			</Modal>
		</>
	);
};

export default ThongBaoLopPage;
