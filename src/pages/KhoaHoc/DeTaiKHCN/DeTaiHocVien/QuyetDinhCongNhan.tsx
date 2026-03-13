import { EPhaseDeTaiKHCN, ETypeTableDeTai } from '@/services/KhoaHoc/DeTaiKHCN/constants';
import { ELoaiDeTai } from '@/services/KhoaHoc/KeHoachDeTai/constants';
import DeTaiKHCNPage from '..';

const QuyetDinhCongNhanDeTai = () => {
	return (
		<DeTaiKHCNPage
			title='Quyết định công nhận đề tài NCKH'
			type={ETypeTableDeTai.QuyetDinhCongNhan}
			paramCondition={{
				phaseDeTaiKhcn: {
					$in: [EPhaseDeTaiKHCN.NGHIEM_THU, EPhaseDeTaiKHCN.SAU_NGHIEM_THU],
				},
				'dangKyKhcn.loaiDeTai': ELoaiDeTai.SINH_VIEN_HOC_VIEN,
			}}
		/>
	);
};

export default QuyetDinhCongNhanDeTai;
