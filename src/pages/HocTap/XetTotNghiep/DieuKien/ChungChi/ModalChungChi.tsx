import { Divider, Modal } from 'antd';
import { useModel } from 'umi';
import TableChungChiDauRa from './TableChungChiDauRa';
import TableChungChiSinhVien from './TableChungChiSinhVien';

const ModalChungChiCTDT = () => {
	const { visibleForm, setVisibleForm, recordChungChi } = useModel('sinhvien.tientrinhtotnghiep');

	return (
		<Modal
			width={800}
			visible={visibleForm}
			onCancel={() => setVisibleForm(false)}
			okButtonProps={{ hidden: true }}
			cancelText='Đóng'
			title={`Loại chứng chỉ ${recordChungChi?.loaiChungChi?.ten.toLocaleLowerCase()}`}
		>
			<div style={{ marginBottom: 12 }} className='text-error'>
				Sinh viên chủ động đăng ký các chứng chỉ đã đạt được để đảm bảo đủ điều kiện xét tốt nghiệp đúng tiến độ
			</div>

			<Divider>Chứng chỉ đã đạt, đủ điều kiện xét</Divider>
			<TableChungChiSinhVien />

			<Divider>Chuẩn đầu ra</Divider>
			<TableChungChiDauRa />
		</Modal>
	);
};

export default ModalChungChiCTDT;
