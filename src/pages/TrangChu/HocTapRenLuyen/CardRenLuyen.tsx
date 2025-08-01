import type { FormDanhGiaValues } from '@/models/diemrenluyenv2/bieumau';
import type { BieuMau } from '@/services/DiemRenLuyenV2/BieuMau/typing';
import {
	BCS_DANH_GIA_PREFIX,
	CTSV_DANH_GIA_PREFIX,
	CVHT_DANH_GIA_PREFIX,
	ENguoiTraLoiDrl,
	TU_DANH_GIA_PREFIX,
} from '@/services/DiemRenLuyenV2/PhieuDiemRenLuyen/constants';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Card, Col, Row, Space, Tooltip } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { history, useModel } from 'umi';

const CardRenLuyenDashboard = () => {
	const { getAllModel, record: recDot, setRecord, loading } = useModel('diemrenluyenv2.dot');
	const [tongDiemTuDanhGia, setTongDiemTuDanhGia] = useState(0);
	const [tongDiemCVHTDanhGia, setTongDiemCVHTDanhGia] = useState(0);
	const [tongDiemCTSVDanhGia, setTongDiemCTSVDanhGia] = useState(0);
	const [tongDiemBCSDanhGia, setTongDiemBCSDanhGia] = useState(0);
	const {
		formValuesTuDanhGiaVaDonViDanhGia,
		handleGetFormValuesTuDanhGiaVaDonViDanhGia,
		handleGetDiemMinhChungDRL,
		dataDiemMinhChung,
	} = useModel('diemrenluyenv2.bieumau');
	const { initialState } = useModel('@@initialState');

	const getData = async () => {
		try {
			getAllModel().then((res) => {
				const dataDot = res;
				const currentDot = dataDot?.find(
					(item) =>
						moment().isAfter(moment(item?.thoiGianSVChamDiem.thoiGianBatDau)) &&
						moment().isBefore(moment(item?.thoiGianSVChamDiem?.thoiGianKetThuc)),
				);
				if (currentDot) setRecord(currentDot);
				else setRecord(dataDot?.[0]);
			});
		} catch (e) {
			console.log(e);
		}
	};

	const handleCheckUniq = (arrOrigin: BieuMau.TraLoiRecord[], arr: BieuMau.TraLoiRecord[]): BieuMau.TraLoiRecord[] => {
		// Tạo một bản đồ để lưu trữ các phần tử theo trường idCauHoi từ mảng arr1
		const map = new Map();
		arrOrigin.forEach((item) => map.set(item.idCauHoi, item));

		// Duyệt qua từng phần tử của mảng arr2
		arr.forEach((item) => {
			// Nếu idCauHoi không tồn tại trong bản đồ thì thêm vào
			if (!map.has(item.idCauHoi)) {
				map.set(item.idCauHoi, item);
			}
		});

		// Chuyển đổi bản đồ thành mảng kết quả
		return Array.from(map.values()) as BieuMau.TraLoiRecord[];
	};

	const handleTinhDiemVaPhanLoai = (formValues: Partial<any>) => {
		let tongDiemTuDanhGia_ = 0;
		let tongDiemCVHTDanhGia_ = 0;
		let tongDiemCTSVDanhGia_ = 0;
		let tongDiemBCSDanhGia_ = 0;
		Object.keys(formValues ?? {}).forEach((key) => {
			const keyTemp: any = key as keyof typeof formValues;
			const valueInNumber = Number(formValues[keyTemp]);
			if (key.startsWith(TU_DANH_GIA_PREFIX)) {
				tongDiemTuDanhGia_ += isNaN(valueInNumber) ? 0 : valueInNumber;
			} else if (key.startsWith(CVHT_DANH_GIA_PREFIX)) {
				tongDiemCVHTDanhGia_ += isNaN(valueInNumber) ? 0 : valueInNumber;
			} else if (key.startsWith(CTSV_DANH_GIA_PREFIX)) {
				tongDiemCTSVDanhGia_ += isNaN(valueInNumber) ? 0 : valueInNumber;
			} else if (key.startsWith(BCS_DANH_GIA_PREFIX)) {
				tongDiemBCSDanhGia_ += isNaN(valueInNumber) ? 0 : valueInNumber;
			}
		});
		setTongDiemTuDanhGia(tongDiemTuDanhGia_);
		setTongDiemCVHTDanhGia(tongDiemCVHTDanhGia_);
		setTongDiemCTSVDanhGia(tongDiemCTSVDanhGia_);
		setTongDiemBCSDanhGia(tongDiemBCSDanhGia_);
	};

	useEffect(() => {
		getData();
	}, []);

	useEffect(() => {
		if (recDot?._id) {
			handleGetFormValuesTuDanhGiaVaDonViDanhGia(recDot?._id, ENguoiTraLoiDrl.SINH_VIEN);
			handleGetDiemMinhChungDRL(recDot?._id, initialState?.currentUser?.ssoId ?? '');
		}
	}, [recDot?._id]);

	useEffect(() => {
		const tuDanhGiaFields = handleCheckUniq(
			dataDiemMinhChung,
			formValuesTuDanhGiaVaDonViDanhGia?.cauTraLoiTuDanhGia?.danhSachTraLoi ?? [],
		)?.reduce<Record<string, any>>((result, cauTraLoi) => {
			const key = `${TU_DANH_GIA_PREFIX}${cauTraLoi.idCauHoi}`;
			return {
				...result,
				[key]: cauTraLoi?.traLoiText ?? null,
			};
		}, {});
		const cvhtDanhGiaFields = handleCheckUniq(
			dataDiemMinhChung,
			formValuesTuDanhGiaVaDonViDanhGia?.cauTraLoiCVHTDanhGia?.danhSachTraLoi ?? [],
		)?.reduce<Record<string, any>>((result, cauTraLoi) => {
			const key = `${CVHT_DANH_GIA_PREFIX}${cauTraLoi.idCauHoi}`;
			return {
				...result,
				[key]: cauTraLoi?.traLoiText ?? null,
			};
		}, {});
		const ctsvDanhGiaFields = handleCheckUniq(
			dataDiemMinhChung,
			formValuesTuDanhGiaVaDonViDanhGia?.cauTraLoiCTSVDanhGia?.danhSachTraLoi ?? [],
		)?.reduce<Record<string, any>>((result, cauTraLoi) => {
			const key = `${CTSV_DANH_GIA_PREFIX}${cauTraLoi.idCauHoi}`;
			return {
				...result,
				[key]: cauTraLoi?.traLoiText ?? null,
			};
		}, {});

		const bcsDanhGiaFields = handleCheckUniq(
			dataDiemMinhChung,
			formValuesTuDanhGiaVaDonViDanhGia?.cauTraLoiBcsDanhGia?.danhSachTraLoi ?? [],
		)?.reduce<Record<string, any>>((result, cauTraLoi) => {
			const key = `${BCS_DANH_GIA_PREFIX}${cauTraLoi.idCauHoi}`;
			return {
				...result,
				[key]: cauTraLoi?.traLoiText ?? null,
			};
		}, {});

		const formValues: Partial<DeepNullable<FormDanhGiaValues>> = {
			bac: null,
			chucDanh: null,
			// donVi: formValuesTuDanhGiaVaDonViDanhGia?.thongTinNhanSu.donViChinhId ?? null,
			hangChuc: '',
			heSoLuong: null,
			// hoVaTen: recordDanhGiaTrongDonVi?.hoTen ?? null,
			// ngaySinh: formValuesTuDanhGiaVaDonViDanhGia?.thongTinNhanSu.ngaySinh ?? null,
			ketLuanLanhDao: formValuesTuDanhGiaVaDonViDanhGia?.ketLuanLanhDao ?? null,
			ketQuaKetLuan: formValuesTuDanhGiaVaDonViDanhGia?.ketQuaKetLuan ?? null,
			yKienDonVi: formValuesTuDanhGiaVaDonViDanhGia?.yKienDonVi ?? null,
			...tuDanhGiaFields,
			...cvhtDanhGiaFields,
			...ctsvDanhGiaFields,
			...bcsDanhGiaFields,
		};

		handleTinhDiemVaPhanLoai(formValues as any);
	}, [formValuesTuDanhGiaVaDonViDanhGia, dataDiemMinhChung]);

	const colors = ['#d1d1d4', '#da2128', '#f2a11a', '#3583f0', '#0cb8ac', '#489e19'];
	const text = ['Kém', 'Yếu', 'Trung bình', 'Khá', 'Tốt', 'Xuất sắc'];
	const point = [
		{ min: 0, max: 35 },
		{ min: 35, max: 50 },
		{ min: 50, max: 65 },
		{ min: 65, max: 80 },
		{ min: 80, max: 90 },
		{ min: 90, max: 101 },
	];

	const getColorBadge = () => {
		const index = point.findIndex((item) => item.min <= tongDiemCTSVDanhGia && tongDiemCTSVDanhGia < item.max);
		return colors[index];
	};

	return (
		<Card variant='borderless' className='dashboard-stat-card' loading={loading}>
			<div className='dashboard-stat-content'>
				<div className='header'>
					<div className='title'>
						Kết quả rèn luyện <span style={{ fontWeight: 400, fontSize: '12px', color: '#ababab' }}>(Hiện tại)</span>
					</div>

					<div>
						<Tooltip title='Xem chi tiết'>
							<InfoCircleOutlined
								className='more-info'
								onClick={() => history.push('/diem-ren-luyen/phieu-diem-ren-luyen')}
							/>
						</Tooltip>
					</div>
				</div>

				<div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: 8 }}>
					{_.range(0, 18).map((item) => {
						const indexTemp = Math.floor(item / 3);
						const show =
							item % 3 === 1 &&
							point[indexTemp].min <= tongDiemCTSVDanhGia &&
							tongDiemCTSVDanhGia < point[indexTemp].max;
						return (
							<>
								<Tooltip
									zIndex={10}
									color={getColorBadge()}
									key={item}
									placement='top'
									open={show}
									title={`${tongDiemCTSVDanhGia} điểm`}
									style={{ position: 'absolute', top: 0, left: 0, marginBottom: 8 }}
								>
									<div
										className='color-line'
										style={{
											flex: 1,
											padding: '5px 2px',
											backgroundColor: colors[indexTemp],
											// borderRight: item === 17 ? undefined : '0.5px solid #ccc',
											marginTop: 50,
										}}
									/>
								</Tooltip>
								{/* Thanh màu */}
								{/* <div style={{ display: 'flex', height: 8, borderRadius: 4, overflow: 'hidden' }}>
									{colors.map((color, idx) => (
										<div
											key={color}
											style={{
												background: color,
												width: '16.66%',
												height: '100%',
											}}
										/>
									))}
								</div>  */}
							</>
						);
					})}
				</div>

				{/* Thanh màu và mốc điểm */}
				<div style={{ position: 'relative', height: 40 }}>
					{/* Mốc điểm */}
					<div
						style={{
							display: 'flex',
							justifyContent: 'space-between',
							fontSize: 10,
							color: '#ababab',
						}}
					>
						{point.map((p, idx) => (
							<span key={idx}>
								{p.min}
								{idx === point.length - 1 ? '' : ''}
							</span>
						))}
						<span>{point[point.length - 1].max - 1}</span>
					</div>
				</div>

				{/* Danh sách loại */}
				<div style={{ marginTop: 'auto' }}>
					<Row style={{ marginTop: 12, flexDirection: 'column' }} gutter={[2, 2]}>
						{colors.map((item, index) => (
							<Col key={item} span={24}>
								<div className='row' style={{ alignItems: 'center', marginBottom: 2 }}>
									<Space>
										<span
											className='dot'
											style={{ backgroundColor: item, width: 16, height: 12, borderRadius: 2, display: 'inline-block' }}
										/>
										<span className='text' style={{ fontWeight: 500 }}>{`Loại ${text[index].toLowerCase()}`}</span>
									</Space>
									<span style={{ marginLeft: 'auto', color: '#ababab', fontSize: 13 }}>
										{index === 0 && '<35'}
										{index === 1 && '35<50'}
										{index === 2 && '50<65'}
										{index === 3 && '65<80'}
										{index === 4 && '80<90'}
										{index === 5 && '90<100'}
									</span>
								</div>
							</Col>
						))}
					</Row>
				</div>
			</div>
		</Card>
	);
};

export default CardRenLuyenDashboard;
