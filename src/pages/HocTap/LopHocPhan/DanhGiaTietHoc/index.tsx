import FormTraLoiKhaoSat from '@/pages/TienIch/KhaoSat/components/Form';
import type { BieuMau } from '@/services/TienIch/KhaoSat/BieuMau/typing';
import { Empty, Spin } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const DanhGiaTietHocPage = () => {
	const { record: recLopHocPhan } = useModel('lophocphan.lophocphan');
	const { record: recTkb } = useModel('daotao.thoikhoabieu');
	const { getDotDanhGiaTietHocModel, loading, record: recDot } = useModel('tienich.dotkhaosat');
	const { getByIdModel: getBieuMau, record: recBieuMau } = useModel('tienich.bieumau');
	const {
		getDanhGiaTietHocModel,
		danhGiaTietHocModel,
		record: recDanhGia,
		formSubmiting,
	} = useModel('lophocphan.danhgiatiethoc');

	const getDotHienTai = () =>
		recLopHocPhan?.maHocKy &&
		getDotDanhGiaTietHocModel(recLopHocPhan?.maHocKy).then((res) => {
			getBieuMau(res?.idKhaoSat ?? '');
		});

	const getDanhGiaTietHoc = () => recTkb?._id && getDanhGiaTietHocModel(recTkb?._id);

	useEffect(() => {
		getDotHienTai();
	}, [recLopHocPhan?.maHocKy]);

	useEffect(() => {
		getDanhGiaTietHoc();
	}, [recTkb?._id]);

	useEffect(() => {
		if (recDot?.idKhaoSat && recBieuMau?._id && recBieuMau._id !== recDot.idKhaoSat) getBieuMau(recDot.idKhaoSat);
	}, [recDot?.idKhaoSat, recBieuMau?._id]);

	const hanldeDanhGiaTietHoc = async (danhSachTraLoi: BieuMau.TraLoiRecord[]) => {
		if (recDot?.idKhaoSat && recDot._id)
			danhGiaTietHocModel({
				idTkb: recTkb?._id,
				cauTraLoi: { danhSachTraLoi, idKhaoSat: recDot?.idKhaoSat ?? '', idDot: recDot?._id },
			})
				.then(() => {
					getDanhGiaTietHoc();
				})
				.catch((er) => console.log(er));
	};

	return (
		<Spin spinning={loading}>
			{recDot?._id ? (
				<>
					<FormTraLoiKhaoSat
						onOk={hanldeDanhGiaTietHoc}
						cauTraLoi={recDanhGia?.danhSachTraLoi}
						formSubmiting={formSubmiting}
						hideCard
					/>
				</>
			) : (
				<Empty style={{ marginTop: 32, marginBottom: 32 }} description='Không có đợt khảo sát đánh giá tiết học' />
			)}
		</Spin>
	);
};

export default DanhGiaTietHocPage;
