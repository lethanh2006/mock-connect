import { ELoaiDot } from '@/services/TienIch/KhaoSat/constants';
import CardKhaoSat from '../KhaoSat/Card';

const CuocThiPage = () => {
	return <CardKhaoSat loai={ELoaiDot.BIEU_MAU} />;
};

export default CuocThiPage;
