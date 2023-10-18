import { Modal } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import TabsDeCuongHocPhan from './components/TabsDeCuongHocPhan';

const ModalHocPhan = (props: { title?: string; visible: boolean; setVisible: any; deCuongId?: string }) => {
	const { title, visible, setVisible } = props;
	const { record } = useModel('daotao.lophocphan');
	const { getByIdModel } = useModel('hocphan.decuonghocphan');
	const deCuongId = props.deCuongId || record?.deCuong?.deCuongId || record?.hocPhan?.deCuongHienTaiId;

	useEffect(() => {
		if (deCuongId) getByIdModel(deCuongId ?? '');
	}, [record?._id, deCuongId]);

	return (
		<Modal
			title={title ?? ''}
			visible={visible}
			width={800}
			onCancel={() => setVisible(false)}
			okButtonProps={{ hidden: true }}
			cancelText='Đóng'
			bodyStyle={{ paddingTop: 0 }}
		>
			<TabsDeCuongHocPhan />
		</Modal>
	);
};

export default ModalHocPhan;
