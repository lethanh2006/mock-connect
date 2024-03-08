import FormTraLoiKhaoSat from '@/pages/TienIch/KhaoSat/components/Form';
import type { BieuMau } from '@/services/TienIch/KhaoSat/BieuMau/typing';
import { ELoaiDot, EThoiGianDot } from '@/services/TienIch/KhaoSat/constants';
import { Alert, Empty, Select, Spin } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

const DanhGiaGiangVienPage = () => {
	const { getModel, danhSach, loading, setRecord, record: recDot } = useModel('tienich.dotkhaosat');
	const { danhSach: danhSachNhanSu } = useModel('lophocphan.nhansulophocphan');
	const { getByIdModel: getBieuMau, record: recBieuMau } = useModel('tienich.bieumau');
	const { record: recHocKy } = useModel('daotao.hocky');
	const {
		getDanhGiaGiangVienModel,
		danhGiaGiangVienModel,
		danhSach: dannhSachDanhGia,
		formSubmiting,
	} = useModel('lophocphan.danhgiagiangvien');
	const { record: recLopHocPhan } = useModel('lophocphan.lophocphan');
	const [giangVienSsoId, setGiangVienSsoId] = useState<string>(danhSachNhanSu[0]?.nhanSuSsoId ?? '');
	const cauTraLoi = dannhSachDanhGia.find((item) => item.giangVienSsoId === giangVienSsoId)?.danhSachTraLoi;
	const ngoaiThoiGian =
		!recDot?.thoiGianBatDau ||
		!recDot?.thoiGianKetThuc ||
		moment().isBefore(recDot?.thoiGianBatDau, 'd') ||
		moment().isAfter(recDot?.thoiGianKetThuc, 'd');

	const getDotHienTai = () => {
		getModel(
			{ maHocKy: recHocKy?.ma, kichHoat: true, loai: ELoaiDot.DANH_GIA_GIANG_VIEN },
			undefined,
			undefined,
			undefined,
			undefined,
			'my/page',
			{
				thoiGian: EThoiGianDot.DANG_DIEN_RA,
			},
		).then((res) => {
			setRecord(res?.[0]);
			getBieuMau(res?.[0]?.idKhaoSat ?? '');
		});
	};

	const getDanhGiaGiangVien = () => getDanhGiaGiangVienModel(recLopHocPhan?._id ?? '');

	useEffect(() => {
		if (recLopHocPhan?._id) {
			getDotHienTai();
			getDanhGiaGiangVien();
		}
	}, [recLopHocPhan?._id]);

	useEffect(() => {
		if (recDot?.idKhaoSat && recBieuMau?._id && recBieuMau._id !== recDot.idKhaoSat) getBieuMau(recDot.idKhaoSat);
	}, [recDot?.idKhaoSat, recBieuMau?._id]);

	useEffect(() => {
		setGiangVienSsoId(danhSachNhanSu?.[0]?.nhanSuSsoId);
	}, [danhSachNhanSu.length]);

	const hanldeDanhGiaGiangVien = async (val: BieuMau.TraLoiRecord[]) => {
		await danhGiaGiangVienModel({
			idKhaoSat: recDot?.idKhaoSat ?? '',
			danhSachTraLoi: val,
			idDot: recDot?._id,
			maLop: recLopHocPhan?.ten,
			lopHocPhanId: recLopHocPhan?._id,
			giangVienSsoId: giangVienSsoId,
			maGiangVien: danhSachNhanSu.find((item) => item.nhanSuSsoId === giangVienSsoId)?.maNhanSu,
			hoTenGiangVien: danhSachNhanSu.find((item) => item.nhanSuSsoId === giangVienSsoId)?.tenNhanSu,
		})
			.then(() => {
				getDanhGiaGiangVien();
			})
			.catch((er) => console.log(er));
	};

	return (
		<Spin spinning={loading}>
			{danhSach.length && danhSachNhanSu.length ? (
				<>
					<div style={{ marginBottom: 12 }}>
						<Alert
							type={ngoaiThoiGian ? 'warning' : 'info'}
							description={
								ngoaiThoiGian ? (
									'Ngoài thời gian đánh giá khảo sát giảng viên !'
								) : (
									<>
										Thời gian khảo sát đánh giá giảng viên từ{' '}
										<b>{moment(recDot?.thoiGianBatDau).format('DD/MM/YYYY')}</b> đến{' '}
										<b>{moment(recDot?.thoiGianKetThuc).format('DD/MM/YYYY')}</b>
									</>
								)
							}
							showIcon
						/>
					</div>
					<div style={{ marginBottom: 24 }}>
						<div className='ant-form-item-label' style={{ padding: 0 }}>
							<label className='ant-form-item-required'>Giảng viên</label>
						</div>
						<br />
						<Select
							value={giangVienSsoId}
							style={{ width: 250 }}
							placeholder='Chọn giảng viên'
							options={danhSachNhanSu.map((item) => ({
								key: item.nhanSuSsoId,
								value: item.nhanSuSsoId,
								label: `${item.tenNhanSu}`,
							}))}
							onChange={(val) => setGiangVienSsoId(val)}
						/>
					</div>
					<FormTraLoiKhaoSat
						onOk={hanldeDanhGiaGiangVien}
						cauTraLoi={cauTraLoi}
						formSubmiting={formSubmiting}
						hideCard
					/>
				</>
			) : !danhSach.length ? (
				<Empty style={{ marginTop: 32, marginBottom: 32 }} description='Không có đợt khảo sát đánh giá giảng viên' />
			) : (
				<Empty style={{ marginTop: 32, marginBottom: 32 }} description='Không có giảng viên trong đợt khảo sát này' />
			)}
		</Spin>
	);
};

export default DanhGiaGiangVienPage;
