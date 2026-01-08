import { EPhaseDeTaiKHCN, ETypeTableDeTai } from '@/services/KhoaHoc/DeTaiKHCN/constants';
import { ELoaiDeTai } from '@/services/KhoaHoc/KeHoachDeTai/constants';
import DeTaiKHCNPage from '..';

const NopHoSoSauHoiDongXetDuyetThuyetMinh = () => {
	return (
		<DeTaiKHCNPage
			title='Nộp hồ sơ sau Hội đồng xét duyệt thuyết minh đề tài NCKH'
			type={ETypeTableDeTai.NopHoSoSauHoiDongXetDuyetThuyetMinh}
			paramCondition={{
				'dangKyKhcn.loaiDeTai': ELoaiDeTai.SINH_VIEN_HOC_VIEN,
				phaseDeTaiKhcn: {
					$nin: [
						EPhaseDeTaiKHCN.DANG_KY,
						EPhaseDeTaiKHCN.XET_DUYET_DANG_KY,
						EPhaseDeTaiKHCN.NOP_DE_CUONG,
						EPhaseDeTaiKHCN.XET_DUYET_DE_CUONG,
					],
				},
			}}
		/>
	);
};

export default NopHoSoSauHoiDongXetDuyetThuyetMinh;
