import ExpandText from '@/components/ExpandText';
import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';

import { Button, Modal } from 'antd';

const ChiTietMarc = (props: {
	visible: boolean;
	setVisible: (val: boolean) => void;
	danhSach: AnPham.IThongTinAnPham[];
}) => {
	const { visible, setVisible, danhSach } = props;

	const columns: IColumn<AnPham.IThongTinAnPham>[] = [
		{
			width: 150,
			render: (val, rec) => <ExpandText>{rec?.tag?.noiDung}</ExpandText>,
		},
		{
			dataIndex: 'tagCode',
			align: 'center',
			width: 60,
		},
		{
			dataIndex: 'ind1',
			align: 'center',
			width: 60,
			render: (val, rec) => `${val ?? ''}${rec.ind2 ?? ''}`,
		},
		{
			dataIndex: 'thuocTinhAnPham',
			width: 220,
			render: (val, rec) =>
				!!val?.length
					? val?.map((i: any) => `${i.code ?? ''}${i.value?.replace(/\u00A0/g, ' ') ?? ''}`).join(' ')
					: rec?.value,
		},
	];

	return (
		<Modal title='Thông tin dữ liệu' visible={visible} onCancel={() => setVisible(false)} footer={null} width={800}>
			<TableStaticData
				columns={columns}
				data={danhSach ?? []}
				otherProps={{ pagination: false, scroll: { y: 400 }, showHeader: false }}
			/>

			<div className='form-footer'>
				<Button onClick={() => setVisible(false)}>Hủy</Button>
			</div>
		</Modal>
	);
};

export default ChiTietMarc;
