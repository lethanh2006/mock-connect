import { EPhaseDeTaiKHCN, ETypeTableDeTai } from '@/services/KhoaHoc/DeTaiKHCN/constants';
import { ELoaiDeTai } from '@/services/KhoaHoc/KeHoachDeTai/constants';
import DeTaiKHCNPage from '..';

const NopHoSoSauNghiemThu = () => {
	return (
		<DeTaiKHCNPage
			title='Nộp hồ sơ sau nghiệm thu đề tài NCKH'
			type={ETypeTableDeTai.NopHoSoSauNghiemThu}
			paramCondition={{
				'dangKyKhcn.loaiDeTai': ELoaiDeTai.SINH_VIEN_HOC_VIEN,
				phaseDeTaiKhcn: {
					$nin: [
						EPhaseDeTaiKHCN.DANG_KY,
						EPhaseDeTaiKHCN.XET_DUYET_DANG_KY,
						EPhaseDeTaiKHCN.NOP_DE_CUONG,
						EPhaseDeTaiKHCN.XET_DUYET_DE_CUONG,
						EPhaseDeTaiKHCN.SAU_XET_DUYET_DE_CUONG,
						EPhaseDeTaiKHCN.THUC_HIEN,
						EPhaseDeTaiKHCN.NOP_NGHIEM_THU,
						EPhaseDeTaiKHCN.NGHIEM_THU,
					],
				},
			}}
		/>
	);
};

export default NopHoSoSauNghiemThu;
