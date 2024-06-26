import { ELoaiCheDoSinhVien } from '@/services/CheDoSinhVien/constant';
import QuyetDinh from '../QuyetDinh';

const CheDoChinhSach = () => {
	return (
		<QuyetDinh
			filterWidth={250}
			loaiCheDoSinhVien={ELoaiCheDoSinhVien.CHE_DO_CHINH_SACH}
			title='Danh sách sinh viên hưởng chế độ chính sách'
		/>
	);
};

export default CheDoChinhSach;
