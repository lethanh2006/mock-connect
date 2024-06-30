import { EPhaseDeTaiKHCN, ETypeTableDeTai } from '@/services/KhoaHoc/DeTaiKHCN/constants';
import DeTaiKHCNPage from '.';
import { ELoaiDeTai } from '@/services/KhoaHoc/KeHoachDeTai/constants';

const NopHoSoNghiemThu = () => {
	return (
		<DeTaiKHCNPage
			title='Nộp hồ sơ nghiệm thu đề tài NCKH'
			type={ETypeTableDeTai.NopHoSoNghiemThu}
			paramCondition={{
				'dangKyKhcn.loaiDeTai': ELoaiDeTai.SINH_VIEN_HOC_VIEN,
				phaseDeTaiKhcn: {
					$nin: [
						EPhaseDeTaiKHCN.DANG_KY,
						EPhaseDeTaiKHCN.XET_DUYET_DANG_KY,
						EPhaseDeTaiKHCN.NOP_DE_CUONG,
						EPhaseDeTaiKHCN.XET_DUYET_DE_CUONG,
						EPhaseDeTaiKHCN.THUC_HIEN,
					],
				},
			}}
		/>
	);
};

export default NopHoSoNghiemThu;
