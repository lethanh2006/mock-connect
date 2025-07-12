import {
	CTSV_DANH_GIA_PREFIX,
	CVHT_DANH_GIA_PREFIX,
	ENguoiTraLoiDrl,
	ETrangThaiPhieuDiemRL,
	BCS_DANH_GIA_PREFIX,
	MapColorETrangThaiPhieuDiemRL,
	TU_DANH_GIA_PREFIX,
	MapTitleETrangThaiPhieuDiemRL,
} from '@/services/DiemRenLuyenV2/PhieuDiemRenLuyen/constants';
import { Card, Descriptions, Form, message, Space, Spin, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import type { FormDanhGiaValues } from '@/models/diemrenluyenv2/bieumau';
import type { BieuMau } from '@/services/DiemRenLuyenV2/BieuMau/typing';
import moment from 'moment';
import { Footer } from '../../Footer';
import { FieldsNhapDiem } from '../../components/FieldsNhapDiem';
import { primaryColor } from '@/services/base/constant';

const FormNhapPhieuDiem = (props: { getData: any }) => {
	const [form] = Form.useForm();
	const {
		formValuesTuDanhGiaVaDonViDanhGia,
		isLoadingFormValuesTuDanhGiaVaDonViDanhGia,
		handleGetFormValuesTuDanhGiaVaDonViDanhGia,
		handleGetDiemMinhChungDRL,
		dataDiemMinhChung,
	} = useModel('diemrenluyenv2.bieumau');
	const {
		formSubmiting: formDanhGiaCaNhanSubmiting,
		dangGuiNgay,
		traLoiBieuMauTuDanhGiaDrl,
	} = useModel('diemrenluyenv2.bieumau');
	const { record: recordDot } = useModel('diemrenluyenv2.dot');
	const { record: recordPhieuDiem } = useModel('diemrenluyenv2.phieudiemrenluyenbcs');

	const nguoiTraLoi = ENguoiTraLoiDrl.BCS;
	const [tongDiemTuDanhGia, setTongDiemTuDanhGia] = useState(0);
	const [tongDiemCVHTDanhGia, setTongDiemCVHTDanhGia] = useState(0);
	const [tongDiemCTSVDanhGia, setTongDiemCTSVDanhGia] = useState(0);
	const [tongDiemKhoaDanhGia, setTongDiemKhoaDanhGia] = useState(0);

	const ngoaiThoiGian =
		recordDot?.thoiGianBCSChamDiem &&
		(moment().isAfter(recordDot.thoiGianBCSChamDiem.thoiGianKetThuc) ||
			moment().isBefore(recordDot?.thoiGianBCSChamDiem?.thoiGianBatDau));

	const handleTinhDiemVaPhanLoai = (formValues_?: Partial<any>) => {
		const formValues = formValues_ ?? form.getFieldsValue();
		let tongDiemTuDanhGia_ = 0;
		let tongDiemCVHTDanhGia_ = 0;
		let tongDiemCTSVDanhGia_ = 0;
		let tongDiemKhoaDanhGia_ = 0;
		let isCVHTDaDanhGia = false;
		let isCTSVDaDanhGia = false;
		Object.keys(formValues ?? {}).forEach((key) => {
			const key_ = key as keyof typeof formValues;
			const valueInNumber = Number(formValues[key_]);
			if (key.startsWith(TU_DANH_GIA_PREFIX)) {
				tongDiemTuDanhGia_ += isNaN(valueInNumber) ? 0 : valueInNumber;
			} else if (key.startsWith(CVHT_DANH_GIA_PREFIX)) {
				tongDiemCVHTDanhGia_ += isNaN(valueInNumber) ? 0 : valueInNumber;
				isCVHTDaDanhGia = true;
			} else if (key.startsWith(CTSV_DANH_GIA_PREFIX)) {
				tongDiemCTSVDanhGia_ += isNaN(valueInNumber) ? 0 : valueInNumber;
				isCTSVDaDanhGia = true;
			} else if (key.startsWith(BCS_DANH_GIA_PREFIX)) {
				tongDiemKhoaDanhGia_ += isNaN(valueInNumber) ? 0 : valueInNumber;
				isCTSVDaDanhGia = true;
			}
		});
		setTongDiemTuDanhGia(tongDiemTuDanhGia_);
		setTongDiemCVHTDanhGia(tongDiemCVHTDanhGia_);
		setTongDiemCTSVDanhGia(tongDiemCTSVDanhGia_);
		setTongDiemKhoaDanhGia(tongDiemKhoaDanhGia_);
		// setPhanLoaiSinhVien(getPhanLoaiValue(isAdmin ? tongDiemCTSVDanhGia_ : tongDiemCVHTDanhGia_));
	};

	const handleSave = (variant: 'Lưu và gửi sau' | 'Gửi ngay') => async () => {
		try {
			await form.validateFields();
			if (form.getFieldsError().length) {
				traLoiBieuMauTuDanhGiaDrl(form, variant === 'Gửi ngay', recordPhieuDiem?.ssoId, nguoiTraLoi).then(() => {
					handleGetFormValuesTuDanhGiaVaDonViDanhGia(recordDot?._id ?? '', nguoiTraLoi, recordPhieuDiem?.ssoId);
					props.getData();
				});
			} else {
				message.warning('Một số điểm chưa nhập vui lòng kiểm tra lại');
			}
		} catch (e) {
			console.log(e);
			message.warning('Một số điểm chưa nhập vui lòng kiểm tra lại');
		}
	};

	useEffect(() => {
		if (recordDot?._id) {
			handleGetFormValuesTuDanhGiaVaDonViDanhGia(recordDot?._id, nguoiTraLoi, recordPhieuDiem?.ssoId);
			handleGetDiemMinhChungDRL(recordDot?._id, recordPhieuDiem?.ssoId ?? '');
		}
	}, [recordDot?._id]);

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

	useEffect(() => {
		form.resetFields();

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
		const khoaDanhGiaFields = handleCheckUniq(
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
			...khoaDanhGiaFields,
		};
		form.setFieldsValue(formValues as any);
		handleTinhDiemVaPhanLoai(formValues as any);
	}, [formValuesTuDanhGiaVaDonViDanhGia, dataDiemMinhChung]);

	const renderTrangThai = () => {
		switch (nguoiTraLoi) {
			case ENguoiTraLoiDrl.BCS:
				return (
					<>
						{formValuesTuDanhGiaVaDonViDanhGia?.trangThaiNopBCS ? (
							<Tag
								color={
									MapColorETrangThaiPhieuDiemRL?.[
										formValuesTuDanhGiaVaDonViDanhGia?.trangThaiNopBCS as ETrangThaiPhieuDiemRL
									]
								}
							>
								{MapTitleETrangThaiPhieuDiemRL?.[formValuesTuDanhGiaVaDonViDanhGia?.trangThaiNopBCS]}
							</Tag>
						) : (
							''
						)}
					</>
				);
				break;
			default:
				return null;
				break;
		}
	};
	return (
		<Card>
			<Spin spinning={isLoadingFormValuesTuDanhGiaVaDonViDanhGia}>
				<Form
					layout='vertical'
					form={form}
					onChange={() => handleTinhDiemVaPhanLoai()}
					scrollToFirstError={{
						behavior: 'smooth',
						block: 'center',
						inline: 'center',
					}}
					onFinishFailed={() => {
						message.warning('Một số điểm chưa nhập vui lòng kiểm tra lại');
					}}
				>
					<FieldsNhapDiem
						tongDiemCTSVDanhGia={tongDiemCTSVDanhGia}
						tongDiemDonViDanhGia={tongDiemCVHTDanhGia}
						tongDiemTuDanhGia={tongDiemTuDanhGia}
						tongDiemBCSDanhGia={tongDiemKhoaDanhGia}
						disabled={
							ngoaiThoiGian || formValuesTuDanhGiaVaDonViDanhGia?.trangThaiNopBCS === ETrangThaiPhieuDiemRL.DA_GUI
						}
						nguoiTraLoi={nguoiTraLoi}
						title={
							<>
								<div style={{ marginBottom: 12 }}>
									I.PHIẾU ĐIỂM RÈN LUYỆN{' '}
									<Space>
										{renderTrangThai()}
										{ngoaiThoiGian ? <Tag color={primaryColor}>Ngoài thời gian chấm điểm</Tag> : ''}
									</Space>
								</div>
								<div>
									<Descriptions bordered>
										<Descriptions.Item label='Họ và tên'>{recordPhieuDiem?.hoTen}</Descriptions.Item>
										<Descriptions.Item label='Mã sinh viên'>
											{recordPhieuDiem?.maSinhVien?.toUpperCase()}
										</Descriptions.Item>
									</Descriptions>
								</div>
							</>
						}
					/>
					{/*<div style={{ marginTop: 12 }}>*/}
					{/*	<PhanLoaiSinhVien phanLoai={phanLoaiSinhVien} />*/}
					{/*</div>*/}
				</Form>
				<Footer
					isView={true}
					dangGuiNgay={dangGuiNgay}
					trangThaiDanhGia={formValuesTuDanhGiaVaDonViDanhGia?.trangThai}
					nguoiTraLoi={nguoiTraLoi as any}
					formSubmiting={formDanhGiaCaNhanSubmiting}
					onGuiNgay={handleSave('Gửi ngay')}
					onLuuVaGuiSau={handleSave('Lưu và gửi sau')}
					disabled={
						ngoaiThoiGian || formValuesTuDanhGiaVaDonViDanhGia?.trangThaiNopBCS === ETrangThaiPhieuDiemRL.DA_GUI
					}
				/>
			</Spin>
		</Card>
	);
};
export default FormNhapPhieuDiem;
