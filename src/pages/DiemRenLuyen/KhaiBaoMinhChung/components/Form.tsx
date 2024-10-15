import { ELoaiDanhMucChung } from '@/services/CongTacSinhVien/DiemRenLuyen/DanhMuc/constant';
import {
	ELoaiMinhChungDiemRenLuyen,
	ELoaiMinhChungDiemRenLuyenMappingToTitle,
	ENguoiGui,
	EPhanLoaiNoiNgoaiTru,
	EPhanLoaiNoiNgoaiTruMappingToLabel,
} from '@/services/CongTacSinhVien/DiemRenLuyen/MinhChung/constants';
import { type MinhChungDiemRenLuyen } from '@/services/CongTacSinhVien/DiemRenLuyen/MinhChung/typing';
import rules from '@/utils/rules';
import { resetFieldsForm, uploadMultiFile } from '@/utils/utils';
import { Button, Card, Col, Form, Input, Radio, Row, Select, message } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import { SelectDanhMucDiemRenLuyen } from '../../DanhMuc/components/Select';
import { SelectDotChamDiem } from '../../DotChamDiem/components/Select';
import MyDatePicker from '@/components/MyDatePicker';
import moment from 'moment';
import UploadFile from '@/components/Upload/UploadFile';
import { SelectSuKien } from '@/pages/CongTacSinhVien/SuKien/components/Select';
import { useWatch } from 'antd/lib/form/Form';
import SelectDonViHanhChinh from '@/pages/Core/DonViHanhChinh/SelectDonViHanhChinh';
import { type DonViHanhChinh } from '@/services/Core/DonViHanhChinh/typing';
import { getTinhThanhPho } from '@/services/Core/DonViHanhChinh';
import { type DotChamDiem } from '@/services/CongTacSinhVien/DiemRenLuyen/DotChamDiem/typing';

interface FormValues extends Omit<MinhChungDiemRenLuyen.IRecord, 'urlFileList'> {
	urlFileList: any;
	tinhTp?: string;
	quanHuyen?: string;
	xaPhuong?: string;
	soNhaTenDuong?: string;
}

export const FormKhaiBaoMinhChung = () => {
	const [form] = Form.useForm<FormValues>();

	const phanLoai = useWatch(['phanLoai'], form);
	const isNhaRieng = useWatch(['thongTinNgoaiTru', 'nhaRieng'], form);
	const idKyTucXa = useWatch(['thongTinNoiTru', 'idKyTucXa'], form);

	const [listTinh, setListTinh] = useState<DonViHanhChinh.IRecord[]>();
	const [dotChamDiem, setDotChamDiem] = useState<DotChamDiem.IRecord | undefined>(undefined);

	useEffect(() => {
		getTinhThanhPho().then((data) => {
			setListTinh(data.data.data);
		});
	}, []);

	const {
		isView,
		record,
		setVisibleForm,
		edit,
		postModel,
		putModel,
		getModel,
		formSubmiting,
		visibleForm,
		getLoaiMinhChung,
	} = useModel('diemrenluyen.minhchung');

	const isShowUploadFileNDatePicker = [
		ELoaiMinhChungDiemRenLuyen.THAM_GIA_CONG_TAC_XA_HOI,
		ELoaiMinhChungDiemRenLuyen.THANH_TICH_DAC_BIET,
		ELoaiMinhChungDiemRenLuyen.TUYEN_TRUYEN_TRUONG_TICH_CUC,
	].includes(getLoaiMinhChung());

	const disabledForm = isView;
	const isNgoaiThoiGianTiepNhan =
		moment().isBefore(dotChamDiem?.thoiGianTiepNhanMinhChung?.thoiGianBatDau) ||
		moment().isAfter(dotChamDiem?.thoiGianTiepNhanMinhChung?.thoiGianKetThuc);

	useEffect(() => {
		resetFieldsForm(form, {
			...record,
			loaiMinhChung: getLoaiMinhChung(),
			xaPhuong: record?.thongTinNgoaiTru?.xa?.ma,
			tinhTp: record?.thongTinNgoaiTru?.tinh?.ma,
			quanHuyen: record?.thongTinNgoaiTru?.quan?.ma,
			soNhaTenDuong: record?.thongTinNgoaiTru?.soNha,
		} as FormValues);
	}, [record?._id, visibleForm]);

	const onFinish = async (values: FormValues) => {
		if (isShowUploadFileNDatePicker) {
			const urlFileList = await uploadMultiFile(values?.urlFileList?.fileList ?? []);
			values.urlFileList = urlFileList;

			if (!values.urlFileList?.length && !values.duongDan) {
				message.warn('Phải nhập tối thiểu 1 trong 2 loại: Đường dẫn hoặc Tập tin minh chứng');
				return;
			}
		}

		const values_ = {
			...values,
			nguoiGui: record?.nguoiGui ?? ENguoiGui.SINH_VIEN,
			thongTinNgoaiTru: {
				...values.thongTinNgoaiTru,
				soNha: values.soNhaTenDuong,
				quan: values.quanHuyen as any,
				tinh: values.tinhTp as any,
				xa: values.xaPhuong as any,
			},
		};
		if (edit) {
			putModel(record?._id ?? '', values_, getModel)
				.then()
				.catch((er) => console.log(er));
		} else {
			postModel(values_, getModel).catch((er) => console.log(er));
		}
	};

	return (
		<Card
			title={
				(isView ? 'Chi tiết ' : edit ? 'Chỉnh sửa ' : 'Thêm mới ') +
				ELoaiMinhChungDiemRenLuyenMappingToTitle[getLoaiMinhChung()].toLowerCase()
			}
		>
			<Form
				onFinishFailed={console.log}
				id='FormKhaiBaoMinhChung'
				onFinish={onFinish}
				form={form}
				layout='vertical'
				disabled={disabledForm}
			>
				<Form.Item name='loaiMinhChung' hidden />
				<Row gutter={12}>
					<Col span={24}>
						<Form.Item
							name='idDotChamDiem'
							label='Đợt chấm điểm'
							rules={[...rules.required]}
							extra={
								isNgoaiThoiGianTiepNhan && !disabledForm ? (
									<i style={{ color: 'red' }}>Ngoài khoảng thời gian tiếp nhận minh chứng</i>
								) : null
							}
						>
							<SelectDotChamDiem
								onChange={(_, option) => {
									const rawData = option?.rawData as DotChamDiem.IRecord | undefined;
									setDotChamDiem(rawData);
								}}
							/>
						</Form.Item>
					</Col>
					{getLoaiMinhChung() === ELoaiMinhChungDiemRenLuyen.THAM_GIA_CONG_TAC_XA_HOI && (
						<Col span={24}>
							<Form.Item name='idNoiDungCongTacXaHoi' label='Tham gia công tác xã hội' rules={[...rules.required]}>
								<SelectDanhMucDiemRenLuyen loaiDanhMuc={ELoaiDanhMucChung.CTXH} />
							</Form.Item>
						</Col>
					)}

					{getLoaiMinhChung() === ELoaiMinhChungDiemRenLuyen.THANH_TICH_DAC_BIET && (
						<Col span={24}>
							<Form.Item name='idCapDatGiai' label='Cấp đạt giải' rules={[...rules.required]}>
								<SelectDanhMucDiemRenLuyen loaiDanhMuc={ELoaiDanhMucChung.CAP_DAT_GIAI} />
							</Form.Item>
						</Col>
					)}

					{[
						ELoaiMinhChungDiemRenLuyen.THANH_TICH_DAC_BIET,
						ELoaiMinhChungDiemRenLuyen.TUYEN_TRUYEN_TRUONG_TICH_CUC,
					].includes(getLoaiMinhChung()) && (
						<Col span={24}>
							<Form.Item name='noiDungHoatDong' label='Nội dung hoạt động' rules={[...rules.length(250)]}>
								<Input placeholder='Mô tả ngắn gọn' />
							</Form.Item>
						</Col>
					)}

					{getLoaiMinhChung() === ELoaiMinhChungDiemRenLuyen.TUYEN_TRUYEN_TRUONG_TICH_CUC ? (
						<Col span={24}>
							<Form.Item name='idSuKienCTSV' label='Sự kiện'>
								<SelectSuKien />
							</Form.Item>
						</Col>
					) : null}

					{isShowUploadFileNDatePicker && (
						<Col span={24}>
							<Form.Item
								name='ngayThamGia'
								label={`Thời gian ${
									getLoaiMinhChung() === ELoaiMinhChungDiemRenLuyen.TUYEN_TRUYEN_TRUONG_TICH_CUC
										? 'chia sẻ'
										: 'tham gia'
								}`}
								rules={[...rules.required]}
							>
								<MyDatePicker
									placeholder={`Thời gian ${
										getLoaiMinhChung() === ELoaiMinhChungDiemRenLuyen.TUYEN_TRUYEN_TRUONG_TICH_CUC
											? 'chia sẻ'
											: 'tham gia'
									}`}
									disabledDate={(cur) => moment(cur).isAfter(moment())}
								/>
							</Form.Item>
						</Col>
					)}

					{isShowUploadFileNDatePicker && (
						<Col span={24}>
							<Form.Item name='duongDan' label='Đường dẫn' rules={[...rules.httpLink]}>
								<Input placeholder='Nhập đường dẫn thông tin' />
							</Form.Item>
						</Col>
					)}

					{isShowUploadFileNDatePicker && (
						<>
							<Col span={24}>
								<Form.Item name='urlFileList' label='Tập tin minh chứng'>
									<UploadFile
										maxCount={5}
										accept='image/*, .docx, .doc, .xls, .xlsx, .pdf'
										otherProps={{ showUploadList: { showDownloadIcon: false } }}
									/>
								</Form.Item>
							</Col>

							{!disabledForm ? (
								<Col span={24}>
									<i>Phải nhập tối thiểu 1 trong 2 loại: Đường dẫn hoặc Tập tin minh chứng</i>
								</Col>
							) : null}
						</>
					)}

					{getLoaiMinhChung() === ELoaiMinhChungDiemRenLuyen.NOI_NGOAI_TRU && (
						<Col span={24}>
							<Form.Item name='phanLoai' label='Phân loại cư trú' rules={[...rules.required]}>
								<Select
									placeholder='Chọn phân loại cư trú'
									options={Object.values(EPhanLoaiNoiNgoaiTru).map((item) => ({
										value: item,
										label: EPhanLoaiNoiNgoaiTruMappingToLabel[item],
									}))}
								/>
							</Form.Item>
						</Col>
					)}
					{phanLoai === EPhanLoaiNoiNgoaiTru.NGOAI_TRU ? (
						<>
							<Col span={24}>
								<div className='ant-descriptions-title'>Nơi ở hiện nay</div>
							</Col>
							<Form.Item name='thongTinNgoaiTru' noStyle>
								<SelectDonViHanhChinh listTinh={listTinh} hasLabel hasSoNha form={form} />
							</Form.Item>

							<Col span={24}>
								<Form.Item name={['thongTinNgoaiTru', 'nhaRieng']} initialValue={true}>
									<Radio.Group>
										<Radio value={true}>Ở nhà riêng</Radio>
										<Radio value={false}>Ở nhà trọ/nhà người thân</Radio>
									</Radio.Group>
								</Form.Item>
							</Col>

							{!isNhaRieng ? (
								<>
									<Col span={24}>
										<div className='ant-descriptions-title'>Liên hệ</div>
									</Col>
									<Col span={24} md={12}>
										<Form.Item
											name={['thongTinNgoaiTru', 'tenChuTro']}
											label='Họ tên chủ trọ/người thân'
											rules={[...rules.required, ...rules.length(100)]}
										>
											<Input placeholder='Nhập họ tên chủ trọ/người thân' />
										</Form.Item>
									</Col>
									<Col span={24} md={12}>
										<Form.Item
											name={['thongTinNgoaiTru', 'sdtChuTro']}
											label='SĐT của chủ trọ/người thân'
											rules={[...rules.required, ...rules.soDienThoai]}
										>
											<Input placeholder='Nhập SĐT của chủ trọ/người thân' />
										</Form.Item>
									</Col>
								</>
							) : null}
						</>
					) : phanLoai === EPhanLoaiNoiNgoaiTru.NOI_TRU ? (
						<>
							<Col span={24}>
								<div className='ant-descriptions-title'>Nơi ở hiện nay</div>
							</Col>
							<Col span={24} md={12}>
								<Form.Item name={['thongTinNoiTru', 'idKyTucXa']} label='Ký túc xá' rules={[...rules.required]}>
									<SelectDanhMucDiemRenLuyen
										loaiDanhMuc={ELoaiDanhMucChung.KY_TUC_XA}
										onChange={() => {
											form.setFields([{ name: ['thongTinNoiTru', 'idSoPhong'], value: undefined }]);
										}}
									/>
								</Form.Item>
							</Col>
							{idKyTucXa !== undefined ? (
								<Col span={24} md={12}>
									<Form.Item name={['thongTinNoiTru', 'idSoPhong']} label='Số phòng' rules={[...rules.required]}>
										<SelectDanhMucDiemRenLuyen
											loaiDanhMuc={ELoaiDanhMucChung.PHONG_KTX}
											idKyTucXa={idKyTucXa}
											// hasDefault
										/>
									</Form.Item>
								</Col>
							) : (
								<Col span={24} md={12}>
									<Form.Item name={['thongTinNoiTru', 'idSoPhong']} label='Số phòng' rules={[...rules.required]}>
										<i style={{ color: 'red' }}>Bạn chưa chọn ký túc xá</i>
									</Form.Item>
								</Col>
							)}
						</>
					) : null}
				</Row>
			</Form>
			<Form.Item style={{ textAlign: 'center', marginTop: 24 }}>
				{!isView && (
					<Button
						form='FormKhaiBaoMinhChung'
						loading={formSubmiting}
						style={{ marginRight: 8 }}
						htmlType='submit'
						type='primary'
					>
						{!edit ? 'Thêm mới ' : 'Lưu lại'}
					</Button>
				)}
				<Button
					onClick={() => {
						setVisibleForm(false);
					}}
				>
					Đóng
				</Button>
			</Form.Item>
		</Card>
	);
};
