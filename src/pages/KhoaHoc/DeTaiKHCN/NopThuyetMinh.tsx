import { EPhaseDeTaiKHCN, ETypeTableDeTai } from '@/services/KhoaHoc/DeTaiKHCN/constants';
import { ELoaiDeTai } from '@/services/KhoaHoc/KeHoachDeTai/constants';
import DeTaiKHCNPage from '.';

const NopThuyetMinh = () => {
	return (
		<DeTaiKHCNPage
			title='Xây dựng và nộp hồ sơ thuyết minh đề tài NCKH'
			type={ETypeTableDeTai.NopThuyetMinh}
			paramCondition={{
				'dangKyKhcn.loaiDeTai': ELoaiDeTai.SINH_VIEN_HOC_VIEN,
				phaseDeTaiKhcn: { $nin: [EPhaseDeTaiKHCN.DANG_KY, EPhaseDeTaiKHCN.XET_DUYET_DANG_KY] },
			}}
		/>
	);
};

export default NopThuyetMinh;
