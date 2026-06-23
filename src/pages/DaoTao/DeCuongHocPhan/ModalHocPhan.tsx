import ModalExpandable from '@/components/Table/ModalExpandable';
import { useIntl } from 'umi';
import TabsDeCuongHocPhan from './components/TabsDeCuongHocPhan';

const ModalHocPhan = (props: {
	title?: string;
	visible: boolean;
	setVisible: any;
	deCuongId?: string;
	activeKey?: string;
	khoiChuongTrinh?: any;
}) => {
	const intl = useIntl();
	const { title, visible, setVisible, activeKey, khoiChuongTrinh } = props;
	// const { chiTietHocPhan, getChiTietHocPhanDangKyTinChiModel } = useModel('daotao.dotdangkytinchi');
	// const { record: recSinhVien } = useModel('sinhvien.sinhvien');
	// const { record } = useModel('lophocphan.lophocphan');
	// const { getByIdModel } = useModel('hocphan.decuonghocphan');
	// const deCuongId = props.deCuongId || record?.deCuong?.deCuongId || record?.hocPhan?.deCuongHienTaiId;

	// useEffect(() => {
	// 	if (deCuongId && visible) getByIdModel(deCuongId ?? '');
	// }, [deCuongId, visible, activeKey]);

	// useEffect(() => {
	// 	if (deCuongId && recSinhVien?.maKhoaNganh && visible) {
	// 		getChiTietHocPhanDangKyTinChiModel(deCuongId, recSinhVien?.maKhoaNganh);
	// 	}
	// }, [deCuongId, recSinhVien?.maKhoaNganh, visible, activeKey]);

	return (
		<ModalExpandable
			title={title ?? ''}
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
