import type { FormDanhGiaValues } from '@/models/diemrenluyenv2/bieumau';
import SelectLopHanhChinhSinhVien from '@/pages/HocTap/LopHanhChinh/components/Select';
import { primaryColor } from '@/services/base/constant';
import { ETrangThaiDuyetBienBanHopDiemRenLuyen } from '@/services/DiemRenLuyenV2/BienBanHop/constant';
import type { BieuMau } from '@/services/DiemRenLuyenV2/BieuMau/typing';
import {
	BCS_DANH_GIA_PREFIX,
	CTSV_DANH_GIA_PREFIX,
	CVHT_DANH_GIA_PREFIX,
	ENguoiTraLoi,
	ENguoiTraLoiDrl,
	ETrangThaiPhieuDiemRL,
	MapColorETrangThaiPhieuDiemRL,
	MapKeyColorTrangThaiKhieuNai,
	MapTitleETrangThaiPhieuDiemRL,
	TU_DANH_GIA_PREFIX,
} from '@/services/DiemRenLuyenV2/PhieuDiemRenLuyen/constants';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Button, Form, message, Modal, Spin, Tag } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import { Footer } from '../Footer';
import FormGuiKhieuNai from '../FormGuiKhieuNai';
import { FieldsNhapDiem } from './FieldsNhapDiem';

const nguoiTraLoi = ENguoiTraLoi.CA_NHAN;
const FormNhapPhieuDiem = () => {
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
	const { initialState } = useModel('@@initialState');
	const currentUser = initialState?.currentUser;
	const { record: recordDot } = useModel('diemrenluyenv2.dot');
	const {
		getAllModel: getAllBienBanHop,
		setRecord: setRecBienBanHop,
		record: recBienBanHop,
	} = useModel('diemrenluyenv2.bienbanhop');
	const {
		record: recLopHanhChinh,
		setRecord: setRecLopHanhChinh,
		danhSach: danhSachLopHanhChinh,
	} = useModel('daotao.lophanhchinh');
	const {
		setVisibleFormGuiKhieuNai,
		record: recPhieuDiem,
		exportDonKhieuNaiModel,
	} = useModel('diemrenluyenv2.phieudiemrenluyen');

	const [tongDiemTuDanhGia, setTongDiemTuDanhGia] = useState(0);
	const [tongDiemCVHTDanhGia, setTongDiemCVHTDanhGia] = useState(0);
	const [tongDiemCTSVDanhGia, setTongDiemCTSVDanhGia] = useState(0);
	const [tongDiemBCSDanhGia, setTongDiemBCSDanhGia] = useState(0);
	const ngoaiThoiGian =
		recordDot?.thoiGianSVChamDiem &&
		(moment().isAfter(recordDot.thoiGianSVChamDiem.thoiGianKetThuc) ||
			moment().isBefore(recordDot?.thoiGianSVChamDiem?.thoiGianBatDau));

	const handleTinhDiemVaPhanLoai = (formValues_?: Partial<any>) => {
		const formValues = formValues_ ?? form.getFieldsValue();
		let tongDiemTuDanhGia_ = 0;
		let tongDiemCVHTDanhGia_ = 0;
		let tongDiemCTSVDanhGia_ = 0;
		let tongDiemBCSDanhGia_ = 0;
		Object.keys(formValues ?? {}).forEach((key) => {
			const key_ = key as keyof typeof formValues;
			const valueInNumber = Number(formValues[key_]);
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

	const handleSave = (variant: 'Lưu và gửi sau' | 'Gửi ngay') => async () => {
		try {
			await form.validateFields();
			if (form.getFieldsError().length) {
				traLoiBieuMauTuDanhGiaDrl(form, variant === 'Gửi ngay').then(() => {
					handleGetFormValuesTuDanhGiaVaDonViDanhGia(recordDot?._id ?? '', ENguoiTraLoiDrl.SINH_VIEN);
				});
			}
		} catch (e) {
			console.log(e);
			message.warning('Một số điểm chưa nhập vui lòng kiểm tra lại');
		}
	};

	const getBienBanHop = async () => {
		if (recLopHanhChinh?.ten && recordDot?._id) {
			const res: any = await getAllBienBanHop(
				false,
				undefined,
				{ tenLopHC: recLopHanhChinh.ten, dotChamDiemId: recordDot?._id },
				undefined,
				'one',
				false,
				undefined,
				undefined,
				true,
			);
			setRecBienBanHop(res?.data?.data ?? {});
		}
	};

	useEffect(() => {
		if (recordDot?._id) {
			handleGetFormValuesTuDanhGiaVaDonViDanhGia(recordDot?._id, ENguoiTraLoiDrl.SINH_VIEN);
			handleGetDiemMinhChungDRL(recordDot?._id, currentUser?.ssoId ?? '');
		}
	}, [recordDot?._id]);

	useEffect(() => {
		getBienBanHop();
	}, [recordDot?._id, recLopHanhChinh?.ten]);

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
		form.setFieldsValue(formValues as any);
		handleTinhDiemVaPhanLoai(formValues as any);
	}, [formValuesTuDanhGiaVaDonViDanhGia, dataDiemMinhChung]);

	return (
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
				{recordDot?.kyHoc && (
					<SelectLopHanhChinhSinhVien
						value={recLopHanhChinh?._id}
						onChange={(val) => setRecLopHanhChinh(danhSachLopHanhChinh.find((item) => item._id === val))}
						style={{ width: 180, display: 'none' }}
						hasDefault
						maHocKy={recordDot?.kyHoc}
					/>
				)}
				<FieldsNhapDiem
					tongDiemCTSVDanhGia={tongDiemCTSVDanhGia}
					tongDiemDonViDanhGia={tongDiemCVHTDanhGia}
					tongDiemTuDanhGia={tongDiemTuDanhGia}
					tongDiemBCSDanhGia={tongDiemBCSDanhGia}
					disabled={ngoaiThoiGian || formValuesTuDanhGiaVaDonViDanhGia?.trangThaiNopSV === ETrangThaiPhieuDiemRL.DA_GUI}
					nguoiTraLoi={ENguoiTraLoiDrl.SINH_VIEN}
					title={
						<div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
							<div>
								PHIẾU ĐIỂM RÈN LUYỆN <Tag color={primaryColor}>{tongDiemCTSVDanhGia} điểm</Tag>
								{recBienBanHop?._id &&
									recBienBanHop.trangThaiDuyet === ETrangThaiDuyetBienBanHopDiemRenLuyen.DA_DUYET &&
									recPhieuDiem?._id && (
										<>
											{!recPhieuDiem?.trangThaiXuLyKhieuNai ? (
												<Button
													size='small'
													onClick={() => {
														setVisibleFormGuiKhieuNai(true);
													}}
													type='primary'
												>
													Gửi khiếu nại
													<QuestionCircleOutlined />
												</Button>
											) : (
												<div>
													Sinh viên đã gửi khiếu nại (
													<a
														onClick={() => {
															Modal.info({
																title: 'Chi tiết khiếu nại',
																content: (
																	<div>
																		<div>
																			<b>Nội dung khiếu nại:</b> {recPhieuDiem?.noiDungKhieuNai}
																		</div>
																		<div>
																			<b>Tập tin minh chứng (nếu có): </b>{' '}
																			{recPhieuDiem?.urlFileDinhKem?.map((item) => (
																				<Tag color={primaryColor} key={item}>
																					<a href={item} target='_blank' rel='noreferrer'>
																						Xem tập tin
																					</a>
																				</Tag>
																			))}
																		</div>
																		{recPhieuDiem?.traLoiNoiDungKhieuNai && (
																			<div>
																				<b style={{ color: primaryColor }}>Ghi chú của phòng CTSV: </b>
																				{recPhieuDiem.traLoiNoiDungKhieuNai}
																			</div>
																		)}
																	</div>
																),
															});
														}}
													>
														xem chi tiết
													</a>{' '}
													hoặc <a onClick={() => exportDonKhieuNaiModel(recPhieuDiem._id)}>xuất mẫu đơn</a>
													), trạng thái:{' '}
													<Tag color={MapKeyColorTrangThaiKhieuNai[recPhieuDiem.trangThaiXuLyKhieuNai]}>
														{recPhieuDiem.trangThaiXuLyKhieuNai}
													</Tag>
												</div>
											)}
										</>
									)}
							</div>

							<div>
								{formValuesTuDanhGiaVaDonViDanhGia?.trangThaiNopSV ? (
									<Tag
										color={
											MapColorETrangThaiPhieuDiemRL?.[
												formValuesTuDanhGiaVaDonViDanhGia?.trangThaiNopSV as ETrangThaiPhieuDiemRL
											]
										}
									>
										{
											MapTitleETrangThaiPhieuDiemRL?.[
												formValuesTuDanhGiaVaDonViDanhGia?.trangThaiNopSV as ETrangThaiPhieuDiemRL
											]
										}
									</Tag>
								) : (
									''
								)}{' '}
								{ngoaiThoiGian ? <Tag color={primaryColor}>Ngoài thời gian chấm điểm</Tag> : ''}
							</div>
						</div>
					}
				/>
			</Form>
			<Footer
				isView={true}
				dangGuiNgay={dangGuiNgay}
				trangThaiDanhGia={formValuesTuDanhGiaVaDonViDanhGia?.trangThai}
				nguoiTraLoi={nguoiTraLoi}
				formSubmiting={formDanhGiaCaNhanSubmiting}
				onGuiNgay={handleSave('Gửi ngay')}
				onLuuVaGuiSau={handleSave('Lưu và gửi sau')}
				disabled={ngoaiThoiGian || formValuesTuDanhGiaVaDonViDanhGia?.trangThaiNopSV === ETrangThaiPhieuDiemRL.DA_GUI}
			/>
			<FormGuiKhieuNai
				getData={() => {
					handleGetFormValuesTuDanhGiaVaDonViDanhGia(recordDot?._id ?? '', ENguoiTraLoiDrl.SINH_VIEN);
				}}
			/>
		</Spin>
	);
};
export default FormNhapPhieuDiem;
