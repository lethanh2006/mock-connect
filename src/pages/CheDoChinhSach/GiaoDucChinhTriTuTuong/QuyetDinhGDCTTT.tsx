import { ELoaiCheDoSinhVien } from '@/services/CongTacSinhVien/CheDoSinhVien/constant';
import QuyetDinh from '../QuyetDinh';
import { useModel } from 'umi';

const QuyetDinhGDCTTT = () => {
	const { initialState } = useModel('@@initialState');

	return (
		<QuyetDinh
			ssoId={initialState?.currentUser?.ssoId}
			loaiCheDoSinhVien={ELoaiCheDoSinhVien.GDCT_TU_TUONG}
			title='Kết quả giáo dục chính trị tư tưởng'
		/>
	);
};

export default QuyetDinhGDCTTT;
