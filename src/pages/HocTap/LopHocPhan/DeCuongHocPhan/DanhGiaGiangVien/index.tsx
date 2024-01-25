import { EOperatorType } from '@/components/Table/constant';
import FormTraLoiKhaoSat from '@/pages/TienIch/KhaoSat/components/Form';
import { ELoaiDot, EThoiGianDot } from '@/services/TienIch/KhaoSat/constants';
import { Alert, Empty, Select, Spin } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

const DanhGiaGiangVienPage = () => {
	const { getModel, danhSach, loading } = useModel('tienich.dotkhaosat');
	const { danhSach: danhSachNhanSu } = useModel('daotao.nhansulophocphan');
	const { getByIdModel: getBieuMau } = useModel('tienich.bieumau');
	const { getDanhGiaGiangVienModel } = useModel('sinhvien.danhgiagiangvien');
	const { record: recLopHocPhan } = useModel('daotao.lophocphan');
	const [giangVienSsoId, setGiangVienSsoId] = useState<string>(danhSachNhanSu[0]?.nhanSuSsoId ?? '');

	const thoiGian = EThoiGianDot.DANG_DIEN_RA;

	const ngoaiThoiGian =
		!danhSach[0]?.thoiGianBatDau ||
		!danhSach[0]?.thoiGianKetThuc ||
		moment().isBefore(danhSach[0]?.thoiGianBatDau, 'd') ||
		moment().isAfter(danhSach[0]?.thoiGianKetThuc, 'd');

	const getData = () => {
		getModel(
			undefined,
			[{ active: true, field: 'loai', values: [ELoaiDot.DANH_GIA_GIANG_VIEN], operator: EOperatorType.EQUAL }],
			undefined,
			undefined,
			undefined,
			'my/page',
			{
				thoiGian,
			},
		);
	};

	const getDanhGiaGiangVien = () => getDanhGiaGiangVienModel(recLopHocPhan?._id ?? '');

	useEffect(() => {
		getData();
	}, []);

	useEffect(() => {
		if (recLopHocPhan?._id) getDanhGiaGiangVien();
	}, [recLopHocPhan?._id]);

	useEffect(() => {
		if (danhSach[0]?._id) getBieuMau(danhSach[0]?.idKhaoSat);
	}, [danhSach[0]?._id]);

	return (
		<Spin spinning={loading}>
			{danhSach.length && danhSachNhanSu.length ? (
				<>
					<div style={{ marginBottom: 12 }}>
						<Alert
							type={ngoaiThoiGian ? 'warning' : 'info'}
							description={
								ngoaiThoiGian ? (
									'Ngoài thời gian khảo sát giảng viên !'
								) : (
									<>
										Thời gian khảo sát đánh giá giảng viên từ{' '}
										<b>{moment(danhSach[0].thoiGianBatDau).format('DD/MM/YYYY')}</b> đến{' '}
										<b>{moment(danhSach[0].thoiGianKetThuc).format('DD/MM/YYYY')}</b>
									</>
								)
							}
							showIcon
						/>
					</div>
					<div style={{ marginBottom: 12 }}>
						<div className='ant-form-item-label' style={{ padding: 0 }}>
							<label className='ant-form-item-required'>Giảng viên</label>
						</div>
						<br />
						<>
							<Select
								value={giangVienSsoId}
								style={{ width: 300 }}
								placeholder='Chọn giảng viên'
								options={danhSachNhanSu.map((item) => ({
									key: item.nhanSuSsoId,
									value: item.nhanSuSsoId,
									label: `${item.tenNhanSu} - ${item.maNhanSu}`,
								}))}
								onChange={(val) => setGiangVienSsoId(val)}
							/>
						</>
					</div>
					<FormTraLoiKhaoSat
						isDanhGiaGiangVien
						giangVienSsoId={giangVienSsoId}
						getDanhGiaGiangVien={getDanhGiaGiangVien}
						ngoaiThoiGian={ngoaiThoiGian}
					/>
				</>
			) : !danhSach.length && danhSachNhanSu.length ? (
				<Empty style={{ marginTop: 30, marginBottom: 30 }} description='Không có đợt khảo sát đánh giá giảng viên' />
			) : danhSach.length && !danhSachNhanSu.length ? (
				<Empty style={{ marginTop: 30, marginBottom: 30 }} description='Không có giảng viên trong đợt khảo sát này' />
			) : null}
		</Spin>
	);
};

export default DanhGiaGiangVienPage;
