import ExpandText from '@/components/ExpandText';
import PreviewFile from '@/components/PreviewFile';
import ButtonExtend from '@/components/Table/ButtonExtend';
import ModalExpandable from '@/components/Table/ModalExpandable';
import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import { ETrangThaiDonNghiHoc, TrangThaiDonNghiHoc } from '@/services/DaoTao/constant';
import type { YeuCauNghiHoc } from '@/services/DaoTao/YeuCauNghiHoc/typing';
import { CloseOutlined } from '@ant-design/icons';
import { Popconfirm, Tag } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { useModel } from 'umi';

interface LichSuDonXinNghiProps {
	visible: boolean;
	setVisible: (visible: boolean) => void;
}

const LichSuDonXinNghi: React.FC<LichSuDonXinNghiProps> = ({ visible, setVisible }) => {
	const { record: recLopHocPhan } = useModel('lophocphan.lophocphan');
	const { getModel, danhSach, huyDonXinNghiModel } = useModel('daotao.dangkynghihoc');
	const [filesVisible, setFilesVisible] = useState(false);
	const [file, setFile] = useState<string | null>(null);

	const getData = () => getModel(recLopHocPhan?.ten ?? '');

	useEffect(() => {
		getData();
	}, [recLopHocPhan?.ten]);

	const columns: IColumn<YeuCauNghiHoc.IRecord>[] = [
		// {
		// 	title: 'Lớp',
		// 	dataIndex: 'tenLopHocPhan',
		// 	sortable: true,
		// 	width: 120,
		// 	filterType: 'string',
		// },
		{
			title: 'Ngày nghỉ',
			dataIndex: ['thoiKhoaBieu', 'ngay'],
			align: 'center',
			width: 100,
			render: (value) => value && dayjs(value).format('DD/MM/YYYY'),
			sortable: true,
		},
		{
			title: 'Ca nghỉ',
			dataIndex: ['thoiKhoaBieu', 'tietBatDau'],
			align: 'center',
			width: 100,
			render: (val, rec) => `Tiết: ${rec.thoiKhoaBieu?.tietBatDau ?? ''} - ${rec.thoiKhoaBieu?.tietKetThuc ?? ''}`,
		},
		{
			title: 'Lý do',
			dataIndex: 'lyDo',
			width: 140,
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
				<Popconfirm title='Bạn chắc chắn muốn hủy đơn?' onConfirm={() => huyDonXinNghiModel(rec?._id, getData)}>
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
		<ModalExpandable
			open={visible}
			title={`Lịch sử đơn xin nghỉ học - ${recLopHocPhan?.ten ?? ''}`}
			onCancel={() => setVisible(false)}
			okButtonProps={{ hidden: true }}
			cancelText='Đóng'
			width={1000}
		>
			<TableStaticData columns={columns} data={danhSach} addStt hasTotal onReload={getData} />

			<ModalExpandable
				title='Tập tin minh chứng'
				open={filesVisible}
				width={1000}
				okButtonProps={{ hidden: true }}
				cancelText='Đóng'
				onCancel={() => setFilesVisible(false)}
			>
				<PreviewFile file={file ?? ''} />
			</ModalExpandable>
		</ModalExpandable>
	);
};

export default LichSuDonXinNghi;
