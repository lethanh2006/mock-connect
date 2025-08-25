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
			visible={visible}
			width={1000}
			onCancel={() => setVisible(false)}
			footer={null}
			bodyStyle={{ paddingTop: 0 }}
		>
			<TabsDeCuongHocPhan activeKey={activeKey} />

			{/* <div className='form-footer'>
				<Button onClick={() => setVisible(false)}>Đóng</Button>
			</div> */}
		</ModalExpandable>
	);
};

export default ModalHocPhan;
