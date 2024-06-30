import { EPhaseDeTaiKHCN, ETypeTableDeTai } from '@/services/KhoaHoc/DeTaiKHCN/constants';
import DeTaiKHCNPage from '.';
import { ELoaiDeTai } from '@/services/KhoaHoc/KeHoachDeTai/constants';

const HoiDongXetChonDeXuat = () => {
	return (
		<DeTaiKHCNPage
			title='Hội đồng xét chọn đề xuất đề tài NCKH'
			type={ETypeTableDeTai.HoiDongXetChonDeXuat}
			paramCondition={{
				'dangKyKhcn.loaiDeTai': ELoaiDeTai.SINH_VIEN_HOC_VIEN,
				phaseDeTaiKhcn: { $ne: EPhaseDeTaiKHCN.DANG_KY },
			}}
		/>
	);
};

export default HoiDongXetChonDeXuat;
