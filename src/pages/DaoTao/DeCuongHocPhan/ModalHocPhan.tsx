import ModalExpandable from '@/components/Table/ModalExpandable';
import DOMPurify from 'dompurify';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import TabsDeCuongHocPhan from './components/TabsDeCuongHocPhan';

const ModalHocPhan = (props: {
	title?: string;
	visible: boolean;
	setVisible: any;
	deCuongId?: string;
	activeKey?: string;
	khoiChuongTrinh?: any;
	isChiTiet?: boolean;
}) => {
	const intl = useIntl();
	const { title, visible, setVisible, activeKey, khoiChuongTrinh, isChiTiet } = props;
	const { getChiTietHocPhanDangKyTinChiModel } = useModel('daotao.dotdangkytinchi');
	const { record: recSinhVien } = useModel('sinhvien.sinhvien');
	const { record } = useModel('lophocphan.lophocphan');
	// const { getByIdModel } = useModel('hocphan.decuonghocphan');
	const deCuongId = props.deCuongId || record?.deCuong?.deCuongId || record?.hocPhan?.deCuongHienTaiId;

	// useEffect(() => {
	// 	if (deCuongId && visible && !isChiTiet) getByIdModel(deCuongId ?? '');
	// }, [deCuongId, visible, activeKey]);

	useEffect(() => {
		if (deCuongId && recSinhVien?.maKhoaNganh && visible && isChiTiet) {
			getChiTietHocPhanDangKyTinChiModel(deCuongId, recSinhVien?.maKhoaNganh);
		}
	}, [deCuongId, recSinhVien?.maKhoaNganh, visible, activeKey]);

	if (!visible) return null;

	return (
		<ModalExpandable
			title={DOMPurify.sanitize(title ?? '', { ALLOWED_TAGS: [], ALLOWED_ATTR: [] }).trim()}
			open={visible}
			width={1000}
			onCancel={() => setVisible(false)}
			okButtonProps={{ hidden: true }}
			cancelText={intl.formatMessage({ id: 'global.button.dong' })}
		>
			<TabsDeCuongHocPhan activeKey={activeKey} khoiChuongTrinh={khoiChuongTrinh} />
		</ModalExpandable>
	);
};

export default ModalHocPhan;
