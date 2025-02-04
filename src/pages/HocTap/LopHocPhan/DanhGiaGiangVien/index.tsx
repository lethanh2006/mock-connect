import FormTraLoiKhaoSat from '@/pages/TienIch/KhaoSat/components/Form';
import type { LopHocPhan } from '@/services/HocTap/LopHocPhan/typings';
import type { BieuMau } from '@/services/TienIch/KhaoSat/BieuMau/typing';
import { getDotDanhGiaGiangVien } from '@/services/TienIch/KhaoSat/DotKhaoSat';
import { EVaiTroKhaoSat } from '@/services/TienIch/KhaoSat/constants';
import { primaryColor } from '@/services/base/constant';
import { Alert, Empty, Select, Spin } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

const DanhGiaGiangVienPage = (props: { danhSachNhanSu: LopHocPhan.IRecordNhanSuLopHP[] }) => {
	const { danhSachNhanSu } = props;
	const { loading, setRecord, record: recDot, setLoading, ngoaiThoiGian } = useModel('tienich.dotkhaosat');
	// const { danhSach: danhSachNhanSu } = useModel('lophocphan.nhansulophocphan');
	const { danhGiaGiangVienModel, formSubmiting } = useModel('lophocphan.danhgiagiangvien');
	const { record: recLopHocPhan } = useModel('lophocphan.lophocphan');
	const [giangVienSsoId, setGiangVienSsoId] = useState<string>(danhSachNhanSu[0]?.nhanSuSsoId ?? '');

	const giangVienKhaoSat = recDot?.thongTinCauTraLoi?.find((item) => item?.giangVienSsoId === giangVienSsoId);

	const getDotHienTai = () => {
		setLoading(true);
		getDotDanhGiaGiangVien(recLopHocPhan?.maHocKy ?? '')
			.then((res: any) => {
				setRecord(res?.data?.data);
			})
			.finally(() => setLoading(false));
	};

	useEffect(() => {
		if (recLopHocPhan?._id) {
			getDotHienTai();
		}
		setGiangVienSsoId(danhSachNhanSu?.[0]?.nhanSuSsoId);
	}, [recLopHocPhan?._id]);

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
					{recDot?.thongTinCauTraLoi?.length && giangVienKhaoSat?._id ? (
						<i style={{ color: primaryColor }}>
							Bạn đã thực hiện đánh giá giảng viên vào lúc{' '}
							<b>{moment(giangVienKhaoSat?.updatedAt).format('HH:mm, DD/MM/YYYY')}</b>{' '}
						</i>
					) : (
						<div style={{ marginBottom: 8 }}>
							<Alert
								type='warning'
								message={
									<>
										{ngoaiThoiGian
											? 'Ngoài thời gian đánh giá khảo sát giảng viên,'
											: 'Bạn chưa thực hiện đánh giá giảng viên,'}{' '}
										Thời gian đánh giá giảng viên từ <b>{moment(recDot?.thoiGianBatDau).format('DD/MM/YYYY')}</b> đến{' '}
										<b>{moment(recDot?.thoiGianKetThuc).format('DD/MM/YYYY')}</b>
									</>
								}
								showIcon
							/>
						</div>
					)}

					<div style={{ marginBottom: 12 }}>
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
						cauTraLoi={giangVienKhaoSat?.danhSachTraLoi}
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
