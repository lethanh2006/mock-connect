import ExpandText from '@/components/ExpandText';
import PreviewFile from '@/components/PreviewFile';
import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import ModalExpandable from '@/components/Table/ModalExpandable';
import type { IColumn } from '@/components/Table/typing';
import { ETrangThaiDonNghiHoc, TrangThaiDonNghiHoc } from '@/services/DaoTao/constant';
import type { YeuCauNghiHoc } from '@/services/DaoTao/YeuCauNghiHoc/typing';
import { CloseOutlined } from '@ant-design/icons';
import { Modal, Popconfirm, Tag } from 'antd';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { useModel } from 'umi';

interface LichSuDonXinNghiProps {
	visible: boolean;
	setVisible: (visible: boolean) => void;
}

const LichSuDonXinNghi: React.FC<LichSuDonXinNghiProps> = ({ visible, setVisible }) => {
	const { record: recLopHocPhan } = useModel('lophocphan.lophocphan');
	const { getModel, page, limit, huyDonXinNghiModal } = useModel('daotao.dangkynghihoc');
	const [filesVisible, setFilesVisible] = useState(false);
	const [file, setFile] = useState<string | null>(null);

	const getData = () => {
		if (recLopHocPhan?._id && !!visible) {
			getModel(undefined, undefined, undefined, undefined, undefined, `me/${recLopHocPhan?.ten}`);
		}
	};

	const columns: IColumn<YeuCauNghiHoc.IRecord>[] = [
		{
			title: 'Lớp',
			dataIndex: 'tenLopHocPhan',
			sortable: true,
			width: 80,
			filterType: 'string',
		},
		{
			title: 'Ngày nghỉ',
			dataIndex: ['thoiKhoaBieu', 'ngay'],
			width: 100,
			render: (value) => value && dayjs(value).format('DD/MM/YYYY'),
			filterType: 'date',
			sortable: true,
		},
		{
			title: 'Ca nghỉ',
			dataIndex: ['thoiKhoaBieu', 'tietBatDau'],
			width: 100,
			render: (_: any, record: YeuCauNghiHoc.IRecord) =>
				`Tiết: ${record.thoiKhoaBieu?.tietBatDau ?? ''} - ${record.thoiKhoaBieu?.tietKetThuc ?? ''}`,
		},
		{
			title: 'Lý do',
			dataIndex: 'lyDo',
			width: 120,
			render: (val) => <ExpandText>{val}</ExpandText>,
			filterType: 'string',
		},
		{
			title: 'Minh chứng',
			dataIndex: 'urlMinhChung',
			width: 100,
			align: 'center',
			render: (val) =>
				val ? (
					<a
						onClick={(e) => {
							setFile(val);
							setFilesVisible(true);
						}}
					>
						Xem chi tiết
					</a>
				) : (
					'Không có'
				),
		},
		{
			title: 'Trạng thái',
			dataIndex: 'trangThai',
			align: 'center',
			width: 120,
			render: (val: ETrangThaiDonNghiHoc) => {
				const { text, color } = TrangThaiDonNghiHoc[val] || { text: val, color: 'default' };
				return <Tag color={color}>{text}</Tag>;
			},
			filterType: 'select',
			filterData: Object.entries(TrangThaiDonNghiHoc).map(([key, item]) => ({
				label: item.text,
				value: key,
			})),
		},
		{
			title: 'Ngày gửi',
			dataIndex: 'createdAt',
			width: 120,
			align: 'center',
			sortable: true,
			render: (val) => val && dayjs(val).format('HH:mm DD/MM/YYYY'),
		},
		{
			title: 'Thao tác',
			width: 60,
			align: 'center',
			render: (val, rec) => (
				<Popconfirm
					title='Bạn chắc chắn muốn hủy đơn?'
					onConfirm={() =>
						huyDonXinNghiModal(rec?._id, () => {
							getData();
						})
					}
				>
					<ButtonExtend
						disabled={rec?.trangThai !== ETrangThaiDonNghiHoc.CHO_DUYET}
						type='link'
						danger
						tooltip='Hủy đơn'
						icon={<CloseOutlined />}
					/>
				</Popconfirm>
			),
		},
	];

	return (
		<Modal open={visible} title='Đơn xin nghỉ học' onCancel={() => setVisible(false)} footer={null} width={1000}>
			<TableBase
				columns={columns}
				getData={getData}
				modelName='daotao.dangkynghihoc'
				dependencies={[page, limit, recLopHocPhan?._id, visible]}
				hideCard
				buttons={{ create: false }}
			/>

			<ModalExpandable
				title='Minh chứng'
				open={filesVisible}
				width={1000}
				footer={null}
				onCancel={() => setFilesVisible(false)}
			>
				<PreviewFile file={file ?? ''} />
			</ModalExpandable>
		</Modal>
	);
};

export default LichSuDonXinNghi;
