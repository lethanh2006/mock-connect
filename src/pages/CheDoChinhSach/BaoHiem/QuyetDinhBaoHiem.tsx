import { ELoaiCheDoSinhVien } from '@/services/CheDoSinhVien/constant';
import QuyetDinh from '../QuyetDinh';

const QuyetDinhBaoHiem = () => {
	return <QuyetDinh loaiCheDoSinhVien={ELoaiCheDoSinhVien.BAO_HIEM} title='Danh sách sinh viên tham gia BHXH' />;
};

export default QuyetDinhBaoHiem;
