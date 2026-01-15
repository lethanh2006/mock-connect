import { ELoaiCheDoSinhVien } from '@/services/CongTacSinhVien/CheDoSinhVien/constant';
import { useIntl, useModel } from 'umi';
import QuyetDinh from '../QuyetDinh';

const QuyetDinhGDCTTT = () => {
	const { initialState } = useModel('@@initialState');
	const intl = useIntl();

	return (
		<QuyetDinh
			ssoId={initialState?.currentUser?.ssoId}
			loaiCheDoSinhVien={ELoaiCheDoSinhVien.GDCT_TU_TUONG}
			title={intl.formatMessage({ id: 'diemrenluyen.tuansinhhoatcongdan.page.title' })}
		/>
	);
};

export default QuyetDinhGDCTTT;
