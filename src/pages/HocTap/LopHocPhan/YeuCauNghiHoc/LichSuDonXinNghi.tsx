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
import { useIntl, useModel } from 'umi';

interface LichSuDonXinNghiProps {
	visible: boolean;
	setVisible: (visible: boolean) => void;
}

const LichSuDonXinNghi: React.FC<LichSuDonXinNghiProps> = ({ visible, setVisible }) => {
	const intl = useIntl();
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
			title: intl.formatMessage({ id: 'lophocphan.id.lichhoc.xinnghi.lichsu.ngaynghi' }),
			dataIndex: ['thoiKhoaBieu', 'ngay'],
			align: 'center',
			width: 100,
			render: (value) => value && dayjs(value).format('DD/MM/YYYY'),
			sortable: true,
		},
		{
			title: intl.formatMessage({ id: 'lophocphan.id.lichhoc.xinnghi.lichsu.canghi' }),
			dataIndex: ['thoiKhoaBieu', 'tietBatDau'],
			align: 'center',
			width: 100,
			render: (val, rec) => `Tiết: ${rec.thoiKhoaBieu?.tietBatDau ?? ''} - ${rec.thoiKhoaBieu?.tietKetThuc ?? ''}`,
		},
		{
			title: intl.formatMessage({ id: 'lophocphan.id.lichhoc.xinnghi.lichsu.lydo' }),
			dataIndex: 'lyDo',
			width: 140,
			render: (val) => <ExpandText>{val}</ExpandText>,
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'lophocphan.id.lichhoc.xinnghi.lichsu.minhchung' }),
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
						{intl.formatMessage({ id: 'lophocphan.id.lichhoc.xinnghi.lichsu.chitiet' })}
					</a>
				) : (
					intl.formatMessage({ id: 'lophocphan.id.lichhoc.xinnghi.lichsu.khongco' })
				),
		},
		{
			title: intl.formatMessage({ id: 'lophocphan.id.lichhoc.xinnghi.lichsu.trangthai' }),
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
			title: intl.formatMessage({ id: 'lophocphan.id.lichhoc.xinnghi.lichsu.ngaygui' }),
			dataIndex: 'createdAt',
			width: 120,
			align: 'center',
			sortable: true,
			render: (val) => val && dayjs(val).format('HH:mm DD/MM/YYYY'),
		},
		{
			title: intl.formatMessage({ id: 'lophocphan.id.lichhoc.xinnghi.lichsu.thaotac' }),
			width: 60,
			align: 'center',
			render: (val, rec) => (
				<Popconfirm
					title={intl.formatMessage({ id: 'lophocphan.id.lichhoc.xinnghi.lichsu.pop' })}
					onConfirm={() => huyDonXinNghiModel(rec?._id, getData)}
				>
					<ButtonExtend
						disabled={rec?.trangThai !== ETrangThaiDonNghiHoc.CHO_DUYET}
						type='link'
						danger
						tooltip={intl.formatMessage({ id: 'lophocphan.id.lichhoc.xinnghi.lichsu.huydon' })}
						icon={<CloseOutlined />}
					/>
				</Popconfirm>
			),
		},
	];

	return (
		<ModalExpandable
			open={visible}
			title={`${intl.formatMessage({ id: 'lophocphan.id.lichhoc.xinnghi.lichsu.title' })} - ${recLopHocPhan?.ten ?? ''}`}
			onCancel={() => setVisible(false)}
			okButtonProps={{ hidden: true }}
			cancelText='Đóng'
			width={1000}
		>
			<TableStaticData columns={columns} data={danhSach} addStt hasTotal onReload={getData} />

			<ModalExpandable
				title={intl.formatMessage({ id: 'lophocphan.id.lichhoc.xinnghi.lichsu.teptin' })}
				open={filesVisible}
				width={1000}
				okButtonProps={{ hidden: true }}
				cancelText={intl.formatMessage({ id: 'global.button.dong' })}
				onCancel={() => setFilesVisible(false)}
			>
				<PreviewFile file={file ?? ''} />
			</ModalExpandable>
		</ModalExpandable>
	);
};

export default LichSuDonXinNghi;
