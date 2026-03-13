import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import { getDanhSachSinhVienThi } from '@/services/KhaoThi/LichThi';
import type { LichThi } from '@/services/KhaoThi/LichThi/typing';
import { Button, Modal } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl } from 'umi';

const DanhSachSinhVienThi = (props: { recLichThi: LichThi.IRecordMe; visible: boolean; handleCancel: any }) => {
	const intl = useIntl();
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
			title: intl.formatMessage({ id: 'lichthi.modal.sbd' }),
			width: 150,
			dataIndex: 'sbd',
			align: 'center',
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'lichthi.modal.maSV' }),
			width: 150,
			dataIndex: 'ma',
			align: 'center',
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'lichthi.modal.hoTen' }),
			width: 150,
			dataIndex: 'ten',
			align: 'center',
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'lichthi.modal.lop' }),
			width: 150,
			dataIndex: 'lop',
			align: 'center',
			filterType: 'string',
		},
	];

	return (
		<Modal
			width={700}
			open={visible}
			title={intl.formatMessage({ id: 'lichthi.modal.title' })}
			onCancel={handleCancel}
			footer={
				<Button type='primary' onClick={handleCancel}>
					{intl.formatMessage({ id: 'global.button.ok' })}
				</Button>
			}
		>
			<TableStaticData hasTotal addStt columns={column} data={data} />
		</Modal>
	);
};

export default DanhSachSinhVienThi;
