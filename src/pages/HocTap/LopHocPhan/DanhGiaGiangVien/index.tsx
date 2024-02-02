import { EOperatorType } from '@/components/Table/constant';
import FormTraLoiKhaoSat from '@/pages/TienIch/KhaoSat/components/Form';
import type { BieuMau } from '@/services/TienIch/KhaoSat/BieuMau/typing';
import { ELoaiDot, EThoiGianDot } from '@/services/TienIch/KhaoSat/constants';
import { Alert, Empty, Select, Spin } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

const DanhGiaGiangVienPage = () => {
	const { getModel, danhSach, loading, setRecord, record } = useModel('tienich.dotkhaosat');
	const { danhSach: danhSachNhanSu } = useModel('daotao.nhansulophocphan');
	const { getByIdModel: getBieuMau } = useModel('tienich.bieumau');
	const { record: recHocKy } = useModel('daotao.hocky');
	const {
		getDanhGiaGiangVienModel,
		danhGiaGiangVienModel,
		danhSach: dannhSachDanhGia,
	} = useModel('sinhvien.danhgiagiangvien');
	const { record: recLopHocPhan } = useModel('daotao.lophocphan');
	const [giangVienSsoId, setGiangVienSsoId] = useState<string>(danhSachNhanSu[0]?.nhanSuSsoId ?? '');

	const thoiGian = EThoiGianDot.DANG_DIEN_RA;

	const cauTraLoi = dannhSachDanhGia.find((item) => item.giangVienSsoId === giangVienSsoId)?.danhSachTraLoi;

	const ngoaiThoiGian =
		!record?.thoiGianBatDau ||
		!record?.thoiGianKetThuc ||
		moment().isBefore(record?.thoiGianBatDau, 'd') ||
		moment().isAfter(record?.thoiGianKetThuc, 'd');

	const getDotHienTai = () => {
		getModel(
			{ maHocKy: recHocKy?.ma },
			[{ active: true, field: 'loai', values: [ELoaiDot.DANH_GIA_GIANG_VIEN], operator: EOperatorType.INCLUDE }],
			undefined,
			undefined,
			undefined,
			'my/page',
			{
				thoiGian,
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

	const hanldeDanhGiaGiangVien = async (val: BieuMau.TraLoiRecord[]) => {
		await danhGiaGiangVienModel({
			idKhaoSat: record?.idKhaoSat ?? '',
			danhSachTraLoi: val,
			idDot: record?._id,
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
										<b>{moment(record?.thoiGianBatDau).format('DD/MM/YYYY')}</b> đến{' '}
										<b>{moment(record?.thoiGianKetThuc).format('DD/MM/YYYY')}</b>
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
						onOk={hanldeDanhGiaGiangVien}
						isDanhGiaGiangVien
						cauTraLoi={cauTraLoi}
						giangVienSsoId={giangVienSsoId}
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
