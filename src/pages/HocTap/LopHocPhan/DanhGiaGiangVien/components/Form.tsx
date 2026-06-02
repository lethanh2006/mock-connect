import FormTraLoiKhaoSat from '@/pages/TienIch/KhaoSat/components/Form';
import { getCauTraLoiMe } from '@/services/TienIch/KhaoSat/BieuMau';
import type { BieuMau } from '@/services/TienIch/KhaoSat/BieuMau/typing';
import { ELoaiDot, EVaiTroKhaoSat } from '@/services/TienIch/KhaoSat/constants';
import { getBieuMauPLOKhaoSat } from '@/services/TienIch/KhaoSat/DotKhaoSat';
import { Alert, Select, Spin, message } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';

const FormDanhGiaGiangVien = (props: { getData?: () => void }) => {
	const intl = useIntl();
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

	const isCungHocKy = recDot?.maHocKy === recLopHocPhan?.maHocKy;

	useEffect(() => {
		setGiangVienSsoId(recLopHocPhan?.nhanSuList?.[0]?.nhanSuSsoId ?? null);
	}, [recLopHocPhan?._id]);

	const getCauTraLoi = () => {
		if (!recDot?._id || !isCungHocKy) {
			setCauTraLoi(undefined);
			return;
		}

		setLoadingCauTraLoi(true);
		getCauTraLoiMe(recDot?.idKhaoSat ?? '', recDot?._id ?? '')
			.then((res) => {
				const danhSachCauTraLoi = res.data?.data ?? [];

				if (recDot?.loai === ELoaiDot.DANH_GIA_GIANG_VIEN) {
					setCauTraLoi(
						danhSachCauTraLoi.find(
							(item: BieuMau.ICauTraLoiKhaoSat) =>
								item?.giangVienSsoId === giangVienSsoId && item?.idDot === recDot?._id,
						) ?? {},
					);
				} else {
					setCauTraLoi(danhSachCauTraLoi.find((item: BieuMau.ICauTraLoiKhaoSat) => item?.idDot === recDot?._id) ?? {});
				}
			})
			.catch((err) => console.log(err))
			.finally(() => setLoadingCauTraLoi(false));
	};

	const getBieuMauKhaoSat = () => {
		if (!recLopHocPhan?._id || !recDot?._id || !isCungHocKy) {
			setRecBieuMau(undefined);
			return;
		}

		setLoadingBieuMau(true);
		getBieuMauPLOKhaoSat(recLopHocPhan?.ten, recDot?._id)
			.then((res) => {
				setRecBieuMau(res?.data?.data?.khaoSat);
			})
			.catch((err) => console.log(err))
			.finally(() => setLoadingBieuMau(false));
	};

	useEffect(() => {
		getCauTraLoi();
		getBieuMauKhaoSat();
	}, [recDot?._id, giangVienSsoId, isCungHocKy]);

	const hanldeKhaoSat = async (val: BieuMau.TraLoiRecord[]) => {
		if (!isCungHocKy) {
			message.warning('Học kỳ của lớp học phần không trùng với học kỳ của đợt khảo sát.');
			return;
		}

		const giangVien = recLopHocPhan?.nhanSuList?.find((item) => item.nhanSuSsoId === giangVienSsoId);

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
				maGiangVien: giangVien?.maNhanSu,
				hoTenGiangVien: giangVien?.tenNhanSu,
			},
			getData,
		).catch((err) => console.log(err));
	};

	if (!isCungHocKy)
		return (
			<Alert
				type='warning'
				showIcon
				message={intl.formatMessage({ id: 'lophocphan.id.khaosat.cungky.mess' })}
				description={intl.formatMessage({ id: 'lophocphan.id.khaosat.cungky.des' })}
				style={{ marginBottom: 12 }}
			/>
		);

	return (
		<>
			{recDot?.loai === ELoaiDot.DANH_GIA_GIANG_VIEN && (
				<Select
					value={giangVienSsoId}
					style={{ width: 250, marginBottom: 12 }}
					placeholder={intl.formatMessage({ id: 'lophocphan.id.khaosat.chongv' })}
					disabled={!isCungHocKy}
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
