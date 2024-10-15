import { ELoaiCheDoSinhVien } from '@/services/CongTacSinhVien/CheDoSinhVien/constant';
import QuyetDinh from '../QuyetDinh';

const QuyetDinhHocBong = () => {
	return <QuyetDinh loaiCheDoSinhVien={ELoaiCheDoSinhVien.HOC_BONG} title='Danh sách sinh viên được cấp Học bổng' />;
};

export default QuyetDinhHocBong;
