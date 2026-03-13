import { ELoaiDot } from '@/services/TienIch/KhaoSat/constants';
import CardKhaoSat from '../KhaoSat/Card';

const KhaoSatPage = () => {
	return <CardKhaoSat loai={ELoaiDot.BIEU_MAU} />;
};

export default KhaoSatPage;
