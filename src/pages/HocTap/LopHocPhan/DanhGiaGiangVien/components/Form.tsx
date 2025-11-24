import FormTraLoiKhaoSat from '@/pages/TienIch/KhaoSat/components/Form';
import { getCauTraLoiMe } from '@/services/TienIch/KhaoSat/BieuMau';
import type { BieuMau } from '@/services/TienIch/KhaoSat/BieuMau/typing';
import { ELoaiDot, EVaiTroKhaoSat } from '@/services/TienIch/KhaoSat/constants';
import { getBieuMauPLOKhaoSat } from '@/services/TienIch/KhaoSat/DotKhaoSat';
import { Card, Select, Spin } from 'antd';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

const FormDanhGiaGiangVien = (props: any) => {
	const { getData } = props;
	const { record: recDot, visibleForm, setVisibleForm } = useModel('tienich.dotkhaosat');
	const { danhGiaGiangVienModel, formSubmiting } = useModel('lophocphan.danhgiagiangvien');
	const { traLoiBieuMauModel, formSubmiting: submit } = useModel('tienich.bieumau');
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
			getCauTraLoiMe(
				recDot?.idKhaoSat ?? '',
				recDot?._id ?? '',
				recDot?.loai === ELoaiDot.DANH_GIA_GIANG_VIEN
					? {
							condition: {
								giangVienSsoId: giangVienSsoId,
							},
						}
					: undefined,
			)
				.then((res) => {
					const sortedData = _.orderBy(res.data?.data, ['updatedAt'], ['desc']);
					setCauTraLoi(sortedData[0]);
				})
				.catch((err) => console.log(err))
				.finally(() => setLoadingCauTraLoi(false));
		}
	};

	const getBieuMauKhaoSat = () => {
		if (recLopHocPhan?._id && recDot?._id && recDot?.loai === ELoaiDot.KHAO_SAT_LOP_HOC_PHAN) {
			setLoadingBieuMau(true);
			getBieuMauPLOKhaoSat(recLopHocPhan?.ten, recDot?._id)
				.then((res) => {
					return setRecBieuMau(res?.data?.data?.khaoSat);
				})
				.finally(() => setLoadingBieuMau(false));
		}
	};

	useEffect(() => {
		if (visibleForm) {
			getCauTraLoi();
			getBieuMauKhaoSat();
		}
	}, [visibleForm]);

	const hanldeKhaoSat = async (val: BieuMau.TraLoiRecord[]) => {
		recDot?.loai === ELoaiDot.DANH_GIA_GIANG_VIEN
			? await danhGiaGiangVienModel(
					{
						idKhaoSat: recDot?.idKhaoSat ?? '',
						danhSachTraLoi: val,
						idDot: recDot?._id,
						maLop: recLopHocPhan?.ten,
						lopHocPhanId: recLopHocPhan?._id,
						giangVienSsoId: giangVienSsoId ?? '',
						maGiangVien: recLopHocPhan?.nhanSuList?.find((item) => item.nhanSuSsoId === giangVienSsoId)?.maNhanSu,
						hoTenGiangVien: recLopHocPhan?.nhanSuList?.find((item) => item.nhanSuSsoId === giangVienSsoId)?.tenNhanSu,
						vaiTroNguoiKhaoSat: EVaiTroKhaoSat.SINH_VIEN,
					},
					getData,
				).then(() => setVisibleForm(false))
			: await traLoiBieuMauModel(
					{
						idKhaoSat: recBieuMau?._id ?? '',
						danhSachTraLoi: val,
						idDot: recDot?._id ?? '',
						maLop: recLopHocPhan?.ten,
						lopHocPhanId: recLopHocPhan?._id,
						vaiTroNguoiKhaoSat: EVaiTroKhaoSat.SINH_VIEN,
						trangThaiSinhVien: recSinhVien?.trangThaiHoc,
						danToc: recSinhVien?.danToc,
						gioiTinh: recSinhVien?.gioiTinh,
					},
					getData,
				).then(() => setVisibleForm(false));
	};

	return (
		<Card title='Thực hiện khảo sát'>
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
					formSubmiting={formSubmiting || submit}
					hideCard
					recBieuMauProps={recDot?.loai === ELoaiDot.KHAO_SAT_LOP_HOC_PHAN ? recBieuMau : recDot?.khaoSat}
				/>
			</Spin>
		</Card>
	);
};

export default FormDanhGiaGiangVien;
