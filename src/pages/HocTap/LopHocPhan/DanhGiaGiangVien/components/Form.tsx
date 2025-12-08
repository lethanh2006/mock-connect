import FormTraLoiKhaoSat from '@/pages/TienIch/KhaoSat/components/Form';
import { getCauTraLoiMe } from '@/services/TienIch/KhaoSat/BieuMau';
import type { BieuMau } from '@/services/TienIch/KhaoSat/BieuMau/typing';
import { ELoaiDot, EVaiTroKhaoSat } from '@/services/TienIch/KhaoSat/constants';
import { getBieuMauPLOKhaoSat } from '@/services/TienIch/KhaoSat/DotKhaoSat';
import { Select, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

const FormDanhGiaGiangVien = (props: { getData?: () => void }) => {
	const { getData } = props;
	const { record: recDot } = useModel('tienich.dotkhaosat');
	const { danhGiaGiangVienModel, formSubmiting } = useModel('lophocphan.danhgiagiangvien');
	const { record: recLopHocPhan } = useModel('lophocphan.lophocphan');
	const { record: recSinhVien } = useModel('sinhvien.sinhvien');
	const [giangVienSsoId, setGiangVienSsoId] = useState<string | null>(
		recLopHocPhan?.nhanSuList?.[0]?.nhanSuSsoId ?? null,
	);
	const [cauTraLoi, setCauTraLoi] = useState<BieuMau.ICauTraLoiKhaoSat>();
	const [loadingCauTraLoi, setLoadingCauTraLoi] = useState<boolean>(false);
	const [loadingBieuMau, setLoadingBieuMau] = useState<boolean>(false);

	const [recBieuMau, setRecBieuMau] = useState<BieuMau.Record>();

	const getCauTraLoi = () => {
		if (recDot?._id) {
			setLoadingCauTraLoi(true);
			getCauTraLoiMe(recDot?.idKhaoSat ?? '', recDot?._id ?? '')
				.then((res) => {
					if (recDot?.loai === ELoaiDot.DANH_GIA_GIANG_VIEN) {
						setCauTraLoi(
							res.data?.data?.find(
								(item: BieuMau.ICauTraLoiKhaoSat) =>
									item?.giangVienSsoId === giangVienSsoId && item?.idDot === recDot?._id,
							) ?? {},
						);
					} else {
						setCauTraLoi(res.data?.data?.find((item: BieuMau.ICauTraLoiKhaoSat) => item?.idDot === recDot?._id) ?? {});
					}
				})
				.catch((err) => console.log(err))
				.finally(() => setLoadingCauTraLoi(false));
		}
	};

	const getBieuMauKhaoSat = () => {
		if (recLopHocPhan?._id && recDot?._id) {
			setLoadingBieuMau(true);
			getBieuMauPLOKhaoSat(recLopHocPhan?.ten, recDot?._id)
				.then((res) => {
					return setRecBieuMau(res?.data?.data?.khaoSat);
				})
				.finally(() => setLoadingBieuMau(false));
		}
	};

	useEffect(() => {
		getCauTraLoi();
		getBieuMauKhaoSat();
	}, [recDot?._id, giangVienSsoId]);

	const hanldeKhaoSat = async (val: BieuMau.TraLoiRecord[]) => {
		const data = {
			danhSachTraLoi: val,
			idDot: recDot?._id,
			maLop: recLopHocPhan?.ten,
			lopHocPhanId: recLopHocPhan?._id,
			vaiTroNguoiKhaoSat: EVaiTroKhaoSat.SINH_VIEN,
			trangThaiSinhVien: recSinhVien?.trangThaiHoc,
			danToc: recSinhVien?.danToc,
			gioiTinh: recSinhVien?.gioiTinh,
		};
		await danhGiaGiangVienModel(
			{
				...data,
				idKhaoSat: recBieuMau?._id ?? '',
				giangVienSsoId: giangVienSsoId ?? '',
				maGiangVien: recLopHocPhan?.nhanSuList?.find((item) => item.nhanSuSsoId === giangVienSsoId)?.maNhanSu,
				hoTenGiangVien: recLopHocPhan?.nhanSuList?.find((item) => item.nhanSuSsoId === giangVienSsoId)?.tenNhanSu,
			},
			getData,
		)
			.then()
			.catch((err) => console.log(err));
	};

	return (
		<>
			{recDot?.loai === ELoaiDot.DANH_GIA_GIANG_VIEN && (
				<Select
					value={giangVienSsoId}
					style={{ width: 250, marginBottom: 12 }}
					placeholder='Chọn giảng viên'
					options={recLopHocPhan?.nhanSuList?.map((item) => ({
						key: item.nhanSuSsoId,
						value: item.nhanSuSsoId,
						label: `GV ${item.tenNhanSu}`,
					}))}
					onChange={(val) => setGiangVienSsoId(val)}
				/>
			)}

			<Spin spinning={loadingCauTraLoi || loadingBieuMau}>
				<FormTraLoiKhaoSat
					onOk={hanldeKhaoSat}
					cauTraLoi={cauTraLoi?.danhSachTraLoi}
					formSubmiting={formSubmiting}
					hideCard
					recBieuMauProps={recBieuMau}
				/>
			</Spin>
		</>
	);
};

export default FormDanhGiaGiangVien;
