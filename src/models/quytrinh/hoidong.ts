import useInitModel from '@/hooks/useInitModel';
import { hoiDongNhanXet } from '@/services/QuyTrinh/HoiDong';
import type { HoiDong } from '@/services/QuyTrinh/HoiDong/typings';
import { message } from 'antd';

export default () => {
	const objInit = useInitModel<HoiDong.IRecord>('hoi-dong-quy-trinh');
	const { getModel, setLoading, setVisibleForm } = objInit;
	const getHoiDongThamGia = () => getModel(undefined, undefined, undefined, undefined, undefined, 'user/page');

	const hoiDongNhanXetModel = async (
		idHoiDong: string,
		idDon: string,
		payload: { ghiChuHoiDong: string; danhSachFileDinhKem: string[] },
	) => {
		setLoading(true);
		await hoiDongNhanXet(idHoiDong, idDon, payload);
		message.success('Lưu thành công');
		setLoading(false);
		setVisibleForm(false);
	};

	return {
		...objInit,
		getHoiDongThamGia,
		hoiDongNhanXetModel,
	};
};
