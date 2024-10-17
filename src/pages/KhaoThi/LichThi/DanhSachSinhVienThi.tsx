import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import { getDanhSachSinhVienThi } from '@/services/KhaoThi/LichThi';
import type { LichThi } from '@/services/KhaoThi/LichThi/typing';
import { Button, Modal } from 'antd';
import { useEffect, useState } from 'react';

const DanhSachSinhVienThi = (props: { recLichThi: LichThi.IRecordMe; visible: boolean; handleCancel: any }) => {
	const { recLichThi, visible, handleCancel } = props;
	const [data, setData] = useState<LichThi.SinhVienLichThi[]>([]);
	const getData = async () => {
		const res = await getDanhSachSinhVienThi(recLichThi.lichThiId);
		setData(res?.data?.data ?? []);
	};

	useEffect(() => {
		getData();
	}, [props.recLichThi.lichThiId]);

	const column: IColumn<LichThi.SinhVienLichThi>[] = [
		{
			title: 'Số báo danh',
			width: 150,
			dataIndex: 'sbd',
			align: 'center',
			filterType: 'string',
		},
		{
			title: 'Mã sinh viên',
			width: 150,
			dataIndex: 'ma',
			align: 'center',
			filterType: 'string',
		},
		{
			title: 'Họ và tên',
			width: 150,
			dataIndex: 'ten',
			align: 'center',
			filterType: 'string',
		},
		{
			title: 'Lớp',
			width: 150,
			dataIndex: 'lop',
			align: 'center',
			filterType: 'string',
		},
	];

	return (
		<Modal
			width={700}
			visible={visible}
			title='Danh sách sinh viên thi'
			onCancel={handleCancel}
			footer={
				<Button type='primary' onClick={handleCancel}>
					OK
				</Button>
			}
		>
			<TableStaticData hasTotal addStt columns={column} data={data} />
		</Modal>
	);
};

export default DanhSachSinhVienThi;
