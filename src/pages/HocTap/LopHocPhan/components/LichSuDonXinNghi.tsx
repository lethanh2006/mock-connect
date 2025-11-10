import PreviewFile from '@/components/PreviewFile';
import ButtonExtend from '@/components/Table/ButtonExtend';
import ModalExpandable from '@/components/Table/ModalExpandable';
import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import type { ETrangThaiDonNghiHoc } from '@/services/DaoTao/constant';
import { TrangThaiDonNghiHoc } from '@/services/DaoTao/constant';
import { getMeByTenLop, huyDonXinNghi } from '@/services/DaoTao/YeuCauNghiHoc';
import type { YeuCauNghiHoc } from '@/services/DaoTao/YeuCauNghiHoc/typing';
import { CloseOutlined } from '@ant-design/icons';
import { Modal, Popconfirm, Space, Tag, message } from 'antd';
import moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react';
import { useModel } from 'umi';

interface LichSuDonXinNghiProps {
	tenLop?: string;
	visible: boolean;
	setVisible: (visible: boolean) => void;
}

const LichSuDonXinNghi: React.FC<LichSuDonXinNghiProps> = ({ tenLop, visible, setVisible }) => {
	const { loading, setLoading, danhSach, setDanhSach } = useModel('daotao.dangkynghihoc');
	const [filesVisible, setFilesVisible] = useState(false);
	const [file, setFile] = useState<string | null>(null);

	const getData = useCallback(
		async (ten: string) => {
			if (!ten) {
				setDanhSach([]);
				return;
			}
			setLoading(true);
			try {
				const res = await getMeByTenLop(ten);
				setDanhSach(Array.isArray(res?.data?.data?.result) ? res.data.data.result : []);
			} catch (e: any) {
				message.error(e?.response?.data?.message);
			} finally {
				setLoading(false);
			}
		},
		[setLoading],
	);

	useEffect(() => {
		if (tenLop) {
			getData(tenLop);
		}
	}, [tenLop, getData]);

	const onCancel = async (id: string) => {
		await huyDonXinNghi(id);
		message.success('Hủy đơn xin nghỉ học thành công!');
		if (tenLop) {
			getData(tenLop);
		}
	};

	const onViewFiles = (raw?: any) => {
		if (!raw) return;
		setFile(typeof raw === 'string' ? raw : (raw.url ?? ''));
		setFilesVisible(true);
	};

	const columns: IColumn<YeuCauNghiHoc.IRecord>[] = [
		{
			title: 'Lớp',
			dataIndex: 'tenLopHocPhan',
			sorter: true,
			width: 80,
		},
		{
			title: 'Ngày nghỉ',
			dataIndex: ['thoiKhoaBieu', 'ngay'],
			width: 80,
			filterType: 'date',
			render: (value: string) => (value ? moment(value).format('DD/MM/YYYY') : ''),
		},
		{
			title: 'Ca nghỉ',
			dataIndex: ['thoiKhoaBieu', 'tietBatDau'],
			width: 100,
			render: (_: any, record: YeuCauNghiHoc.IRecord) =>
				`Tiết: ${record.thoiKhoaBieu?.tietBatDau ?? ''} - ${record.thoiKhoaBieu?.tietKetThuc ?? ''}`,
		},
		{ title: 'Lý do', dataIndex: 'lyDo', width: 140, render: (v) => v || '' },
		{
			title: 'Minh chứng',
			dataIndex: 'urlMinhChung',
			width: 100,
			align: 'center',
			render: (v) => (
				<a
					onClick={(e) => {
						e.stopPropagation();
						onViewFiles(v);
					}}
				>
					Xem minh chứng
				</a>
			),
		},
		{
			title: 'Trạng thái',
			dataIndex: 'trangThai',
			align: 'center',
			width: 90,
			render: (val: ETrangThaiDonNghiHoc) => {
				const { text, color } = TrangThaiDonNghiHoc[val] || { text: val, color: 'default' };
				return <Tag color={color}>{text}</Tag>;
			},
			filterType: 'select',
			filterData: Object.values(TrangThaiDonNghiHoc).map((item) => item.text),
		},
		{
			title: 'Thao tác',
			width: 80,
			align: 'center',
			render: (_, r) => (
				<Space>
					{r.trangThai === 'cho_duyet' && (
						<Popconfirm title='Bạn chắc chắn muốn hủy đơn?' onConfirm={() => onCancel(r._id)}>
							<ButtonExtend type='link' danger tooltip='Hủy đơn' icon={<CloseOutlined />} />
						</Popconfirm>
					)}
				</Space>
			),
		},
	];

	return (
		<>
			<Modal visible={visible} title='Đơn xin nghỉ học' onCancel={() => setVisible(false)} footer={null} width={900}>
				<TableStaticData
					columns={columns}
					data={danhSach}
					otherProps={{ loading, scroll: { x: true } }}
					addStt
					hasTotal
				/>
				{filesVisible && file && (
					<ModalExpandable
						title='Minh chứng'
						visible={filesVisible}
						width={900}
						footer={null}
						onCancel={() => setFilesVisible(false)}
					>
						<PreviewFile file={file} tenFile={file} />
					</ModalExpandable>
				)}
			</Modal>
		</>
	);
};

export default LichSuDonXinNghi;
