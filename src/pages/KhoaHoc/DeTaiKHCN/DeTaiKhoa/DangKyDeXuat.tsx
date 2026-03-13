import { ETypeTableDeTai } from '@/services/KhoaHoc/DeTaiKHCN/constants';
import DeTaiKHCNPage from '..';
import { ELoaiDeTai } from '@/services/KhoaHoc/KeHoachDeTai/constants';

const DangKyDeXuat = () => {
	return (
		<DeTaiKHCNPage
			title='Đăng ký đề xuất đề tài NCKH cấp khoa/viện'
			type={ETypeTableDeTai.DangKyDeXuat}
			paramCondition={{
				'dangKyKhcn.loaiDeTai': ELoaiDeTai.SINH_VIEN_KHOA,
			}}
		/>
	);
};

export default DangKyDeXuat;
