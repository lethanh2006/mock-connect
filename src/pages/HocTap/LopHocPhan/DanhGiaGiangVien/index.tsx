import FormTraLoiKhaoSat from '@/pages/TienIch/KhaoSat/components/Form';
import type { BieuMau } from '@/services/TienIch/KhaoSat/BieuMau/typing';
import { getDotDanhGiaGiangVien } from '@/services/TienIch/KhaoSat/DotKhaoSat';
import { EVaiTroKhaoSat } from '@/services/TienIch/KhaoSat/constants';
import { Alert, Empty, Select, Spin } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

const DanhGiaGiangVienPage = () => {
	const { loading, setRecord, record: recDot, setLoading } = useModel('tienich.dotkhaosat');
	const { danhSach: danhSachNhanSu } = useModel('lophocphan.nhansulophocphan');
	const { danhGiaGiangVienModel, formSubmiting } = useModel('lophocphan.danhgiagiangvien');
	const { record: recLopHocPhan } = useModel('lophocphan.lophocphan');
	const [giangVienSsoId, setGiangVienSsoId] = useState<string>(danhSachNhanSu[0]?.nhanSuSsoId ?? '');
	const ngoaiThoiGian =
		!recDot?.thoiGianBatDau ||
		!recDot?.thoiGianKetThuc ||
		moment().isBefore(recDot?.thoiGianBatDau, 'd') ||
		moment().isAfter(recDot?.thoiGianKetThuc, 'd');

	const getDotHienTai = () => {
		setLoading(true);
		getDotDanhGiaGiangVien(recLopHocPhan?.hocKy?.ma ?? '')
			.then((res: any) => {
				setRecord(res?.data?.data);
			})
			.finally(() => setLoading(false));
	};

	useEffect(() => {
		if (recLopHocPhan?._id) {
			getDotHienTai();
		}
	}, [recLopHocPhan?._id]);

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
			vaiTroNguoiKhaoSat: EVaiTroKhaoSat.SINH_VIEN,
		})
			.then(() => {
				getDotHienTai();
			})
			.catch((er) => console.log(er));
	};

	return (
		<Spin spinning={loading}>
			{recDot?._id && danhSachNhanSu.length ? (
				<>
					<div style={{ marginBottom: 12 }}>
						<Alert
							type={ngoaiThoiGian ? 'warning' : 'info'}
							message={
								ngoaiThoiGian ? (
									'Ngoài thời gian đánh giá khảo sát giảng viên !'
								) : (
									<>
										<span>
											Thời gian khảo sát đánh giá giảng viên từ{' '}
											<b>{moment(recDot?.thoiGianBatDau).format('DD/MM/YYYY')}</b> đến{' '}
											<b>{moment(recDot?.thoiGianKetThuc).format('DD/MM/YYYY')}</b>
										</span>
										,{' '}
										{recDot?.thongTinCauTraLoi?.length ? (
											<span>
												Bạn đã thực hiện khảo sát vào lúc{' '}
												<b>{moment(recDot?.thongTinCauTraLoi?.[0]?.updatedAt).format('HH:mm, DD/MM/YYYY')}</b>{' '}
											</span>
										) : null}
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
						cauTraLoi={recDot?.thongTinCauTraLoi?.[0]?.danhSachTraLoi}
						formSubmiting={formSubmiting}
						hideCard
						recBieuMauProps={recDot?.khaoSat}
					/>
				</>
			) : !recDot?._id ? (
				<Empty style={{ marginTop: 32, marginBottom: 32 }} description='Không có đợt khảo sát đánh giá giảng viên' />
			) : (
				<Empty style={{ marginTop: 32, marginBottom: 32 }} description='Không có giảng viên trong đợt khảo sát này' />
			)}
		</Spin>
	);
};

export default DanhGiaGiangVienPage;
