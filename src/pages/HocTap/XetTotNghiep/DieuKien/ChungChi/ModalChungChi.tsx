import { Divider, Modal } from 'antd';
import { useIntl, useModel } from 'umi';
import TableChungChiDauRa from './TableChungChiDauRa';
import TableChungChiSinhVien from './TableChungChiSinhVien';

const ModalChungChiCTDT = () => {
	const intl = useIntl();
	const { visibleForm, setVisibleForm, recordChungChi } = useModel('sinhvien.tientrinhtotnghiep');

	return (
		<Modal
			width={800}
			open={visibleForm}
			onCancel={() => setVisibleForm(false)}
			okButtonProps={{ hidden: true }}
			cancelText='Đóng'
			title={`${intl.formatMessage({ id: 'dieukienxettotnghiep.chungchi.modal.title.loaichungchi' })} ${recordChungChi?.loaiChungChi?.ten.toLocaleLowerCase()}`}
		>
			<div style={{ marginBottom: 12 }} className='text-error'>
				{intl.formatMessage({ id: 'dieukienxettotnghiep.chungchi.modal.alert.warning' })}
			</div>

			<Divider>{intl.formatMessage({ id: 'dieukienxettotnghiep.chungchi.modal.title.chungchidadat' })}</Divider>
			<TableChungChiSinhVien />

			<Divider>{intl.formatMessage({ id: 'dieukienxettotnghiep.chungchi.modal.title.chuandaura' })}</Divider>
			<TableChungChiDauRa />
		</Modal>
	);
};

export default ModalChungChiCTDT;
