import ModalExpandable from '@/components/Table/ModalExpandable';
import { useEffect } from 'react';
import { useModel } from 'umi';
import TabsDeCuongHocPhan from './components/TabsDeCuongHocPhan';

const ModalHocPhan = (props: {
	title?: string;
	visible: boolean;
	setVisible: any;
	deCuongId?: string;
	activeKey?: string;
}) => {
	const { title, visible, setVisible, activeKey } = props;
	const { record } = useModel('lophocphan.lophocphan');
	const { getByIdModel } = useModel('hocphan.decuonghocphan');
	const deCuongId = props.deCuongId || record?.deCuong?.deCuongId || record?.hocPhan?.deCuongHienTaiId;

	useEffect(() => {
		if (deCuongId && visible) getByIdModel(deCuongId ?? '');
	}, [deCuongId, visible, activeKey]);

	return (
		<ModalExpandable
			title={title ?? ''}
			open={visible}
			width={1000}
			onCancel={() => setVisible(false)}
			okButtonProps={{ hidden: true }}
			cancelText='Đóng'
		>
			<TabsDeCuongHocPhan activeKey={activeKey} />
		</ModalExpandable>
	);
};

export default ModalHocPhan;
