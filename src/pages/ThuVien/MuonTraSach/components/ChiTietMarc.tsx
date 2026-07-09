import ExpandText from '@/components/ExpandText';
import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import DOMPurify from 'dompurify';
import { Button, Modal } from 'antd';

const safeMarcText = (value: unknown): string => {
	if (typeof value !== 'string') return '';
	return DOMPurify.sanitize(value);
};

const ChiTietMarc = (props: {
	visible: boolean;
	setVisible: (val: boolean) => void;
	danhSach: AnPham.IThongTinAnPham[];
}) => {
	const { visible, setVisible, danhSach } = props;

	const columns: IColumn<AnPham.IThongTinAnPham>[] = [
		{
			width: 150,
			render: (val, rec) => <ExpandText>{safeMarcText(rec?.tag?.noiDung)}</ExpandText>,
		},
		{
			dataIndex: 'tagCode',
			align: 'center',
			width: 60,
			render: (val) => safeMarcText(val),
		},
		{
			dataIndex: 'ind1',
			align: 'center',
			width: 60,
			render: (val, rec) => `${safeMarcText(val)}${safeMarcText(rec.ind2)}`,
		},
		{
			dataIndex: 'thuocTinhAnPham',
			width: 220,
			render: (val, rec) =>
				!!val?.length
					? val
							?.map(
								(i: any) =>
									`${safeMarcText(i.code)}${safeMarcText(i.value?.replace(/\u00A0/g, ' '))}`,
							)
							.join(' ')
					: safeMarcText(rec?.value),
		},
	];

	return (
		<Modal title='Thông tin dữ liệu' open={visible} onCancel={() => setVisible(false)} footer={null} width={800}>
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
