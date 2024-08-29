import { ELoaiCheDoSinhVien } from '@/services/CheDoSinhVien/constant';
import QuyetDinh from '../QuyetDinh';

const CheDoChinhSach = () => {
	return <QuyetDinh loaiCheDoSinhVien={ELoaiCheDoSinhVien.KHEN_THUONG} title='Danh sách sinh viên được khen thưởng' />;
};

export default CheDoChinhSach;
