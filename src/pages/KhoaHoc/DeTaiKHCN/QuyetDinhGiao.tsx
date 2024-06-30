import { EPhaseDeTaiKHCN, ETypeTableDeTai } from '@/services/KhoaHoc/DeTaiKHCN/constants';
import { ELoaiDeTai } from '@/services/KhoaHoc/KeHoachDeTai/constants';
import DeTaiKHCNPage from '.';

const QuyetDinhGiaoDeTai = () => {
	return (
		<DeTaiKHCNPage
			title='Quyết định giao đề tài NCKH'
			type={ETypeTableDeTai.QuyetDinhGiao}
			paramCondition={{
				phaseDeTaiKhcn: {
					$nin: [
						EPhaseDeTaiKHCN.DANG_KY,
						EPhaseDeTaiKHCN.XET_DUYET_DANG_KY,
						EPhaseDeTaiKHCN.NOP_DE_CUONG,
						EPhaseDeTaiKHCN.XET_DUYET_DE_CUONG,
					],
				},
				'dangKyKhcn.loaiDeTai': ELoaiDeTai.SINH_VIEN_HOC_VIEN,
			}}
		/>
	);
};

export default QuyetDinhGiaoDeTai;
