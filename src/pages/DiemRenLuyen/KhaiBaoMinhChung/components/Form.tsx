import MyDatePicker from '@/components/MyDatePicker';
import UploadFile from '@/components/Upload/UploadFile';
import { SelectSuKien } from '@/pages/CongTacSinhVien/SuKien/components/Select';
import SelectDonViHanhChinh from '@/pages/Core/DonViHanhChinh/SelectDonViHanhChinh';
import { ELoaiDanhMucChung } from '@/services/CongTacSinhVien/DiemRenLuyen/DanhMuc/constant';
import { type DotChamDiem } from '@/services/CongTacSinhVien/DiemRenLuyen/DotChamDiem/typing';
import {
	ELoaiMinhChungDiemRenLuyen,
	ELoaiMinhChungDiemRenLuyenMappingToTitle,
	ENguoiGui,
	EPhanLoaiNoiNgoaiTru,
	EPhanLoaiNoiNgoaiTruMappingToLabel,
} from '@/services/CongTacSinhVien/DiemRenLuyen/MinhChung/constants';
import { type MinhChungDiemRenLuyen } from '@/services/CongTacSinhVien/DiemRenLuyen/MinhChung/typing';
import { getTinhThanhPho } from '@/services/Core/DonViHanhChinh';
import { type DonViHanhChinh } from '@/services/Core/DonViHanhChinh/typing';
import dayjs from '@/utils/dayjs';
import rules from '@/utils/rules';
import { resetFieldsForm, uploadMultiFile } from '@/utils/utils';
import { Button, Card, Col, Form, Input, Radio, Row, Select, message } from 'antd';
import { useWatch } from 'antd/lib/form/Form';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import { SelectDanhMucDiemRenLuyen } from '../../DanhMuc/components/Select';
import { SelectDotChamDiem } from '../../DotChamDiem/components/Select';

interface FormValues extends Omit<MinhChungDiemRenLuyen.IRecord, 'urlFileList'> {
	urlFileList: any;
	tinhTp?: string;
	quanHuyen?: string;
	xaPhuong?: string;
	soNhaTenDuong?: string;
}

export const FormKhaiBaoMinhChung = () => {
	const [form] = Form.useForm<FormValues>();

	const intl = useIntl();
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
		dayjs().isBefore(dotChamDiem?.thoiGianTiepNhanMinhChung?.thoiGianBatDau) ||
		dayjs().isAfter(dotChamDiem?.thoiGianTiepNhanMinhChung?.thoiGianKetThuc);

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
				message.warning(intl.formatMessage({ id: 'diemrenluyen.khaibaominhchung.minhchungtoithieu' }));
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
				(isView ? intl.formatMessage({ id: 'diemrenluyen.danhmuc.form.chitiet' }) : edit ? intl.formatMessage({ id: 'diemrenluyen.danhmuc.form.chinhsua' }) : intl.formatMessage({ id: 'diemrenluyen.danhmuc.form.themmoi' })) + ' ' +
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
							label={intl.formatMessage({ id: 'diemrenluyen.dotchamdiem.placeholder' })}
							rules={[...rules.required]}
							extra={
								isNgoaiThoiGianTiepNhan && !disabledForm ? (
									<i style={{ color: 'red' }}>{intl.formatMessage({ id: 'diemrenluyen.khaibaominhchung.ngoaikhoangthoigian' })}</i>
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
							<Form.Item name='idNoiDungCongTacXaHoi' label={intl.formatMessage({ id: 'diemrenluyen.minhchung.thamgiacongtac' })} rules={[...rules.required]}>
								<SelectDanhMucDiemRenLuyen loaiDanhMuc={ELoaiDanhMucChung.CTXH} />
							</Form.Item>
						</Col>
					)}

					{getLoaiMinhChung() === ELoaiMinhChungDiemRenLuyen.THANH_TICH_DAC_BIET && (
						<Col span={24}>
							<Form.Item name='idCapDatGiai' label={intl.formatMessage({ id: 'diemrenluyen.minhchung.capdatgiai' })} rules={[...rules.required]}>
								<SelectDanhMucDiemRenLuyen loaiDanhMuc={ELoaiDanhMucChung.CAP_DAT_GIAI} />
							</Form.Item>
						</Col>
					)}

					{[
						ELoaiMinhChungDiemRenLuyen.THANH_TICH_DAC_BIET,
						ELoaiMinhChungDiemRenLuyen.TUYEN_TRUYEN_TRUONG_TICH_CUC,
					].includes(getLoaiMinhChung()) && (
						<Col span={24}>
							<Form.Item name='noiDungHoatDong' label={intl.formatMessage({ id: 'diemrenluyen.minhchung.noidunghoatdong' })} rules={[...rules.length(250)]}>
								<Input placeholder={intl.formatMessage({ id: 'diemrenluyen.minhchung.noidunghoatdong' })} />
							</Form.Item>
						</Col>
					)}

					{getLoaiMinhChung() === ELoaiMinhChungDiemRenLuyen.TUYEN_TRUYEN_TRUONG_TICH_CUC ? (
						<Col span={24}>
							<Form.Item name='idSuKienCTSV' label={intl.formatMessage({ id: 'diemrenluyen.minhchung.sukien' })}>
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
										? intl.formatMessage({ id: 'diemrenluyen.khaibaominhchung.chiase' })
										: 'tham gia'
								}`}
								rules={[...rules.required]}
							>
								<MyDatePicker
									placeholder={`Thời gian ${
										getLoaiMinhChung() === ELoaiMinhChungDiemRenLuyen.TUYEN_TRUYEN_TRUONG_TICH_CUC
											? intl.formatMessage({ id: 'diemrenluyen.khaibaominhchung.chiase' })
											: 'tham gia'
									}`}
									disabledDate={(cur) => dayjs(cur).isAfter(dayjs())}
								/>
							</Form.Item>
						</Col>
					)}

					{isShowUploadFileNDatePicker && (
						<Col span={24}>
							<Form.Item name='duongDan' label={intl.formatMessage({ id: 'diemrenluyen.minhchung.duongdan' })} rules={[...rules.httpLink]}>
								<Input placeholder={intl.formatMessage({ id: 'diemrenluyen.minhchung.duongdan' })} />
							</Form.Item>
						</Col>
					)}

					{isShowUploadFileNDatePicker && (
						<>
							<Col span={24}>
								<Form.Item name='urlFileList' label={intl.formatMessage({ id: 'diemrenluyen.minhchung.taptin' })}>
									<UploadFile
										maxCount={5}
										accept='image/*, .docx, .doc, .xls, .xlsx, .pdf'
										otherProps={{ showUploadList: { showDownloadIcon: false } }}
									/>
								</Form.Item>
							</Col>

							{!disabledForm ? (
								<Col span={24}>
									<i>{intl.formatMessage({ id: 'diemrenluyen.khaibaominhchung.minhchungtoithieu' })}</i>
								</Col>
							) : null}
						</>
					)}

					{getLoaiMinhChung() === ELoaiMinhChungDiemRenLuyen.NOI_NGOAI_TRU && (
						<Col span={24}>
							<Form.Item name='phanLoai' label={intl.formatMessage({ id: 'diemrenluyen.minhchung.phanloai' })} rules={[...rules.required]}>
								<Select
									placeholder={intl.formatMessage({ id: 'diemrenluyen.minhchung.phanloai' })}
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
								<div className='ant-descriptions-title'>{intl.formatMessage({ id: 'diemrenluyen.minhchung.noio' })}</div>
							</Col>
							<Form.Item name='thongTinNgoaiTru' noStyle>
								<SelectDonViHanhChinh listTinh={listTinh} hasLabel hasSoNha form={form} />
							</Form.Item>

							<Col span={24}>
								<Form.Item name={['thongTinNgoaiTru', 'nhaRieng']} initialValue={true}>
									<Radio.Group>
										<Radio value={true}>{intl.formatMessage({ id: 'diemrenluyen.minhchung.nharieng' })}</Radio>
										<Radio value={false}>{intl.formatMessage({ id: 'diemrenluyen.minhchung.chatro' })}</Radio>
									</Radio.Group>
								</Form.Item>
							</Col>

							{!isNhaRieng ? (
								<>
									<Col span={24}>
										<div className='ant-descriptions-title'>{intl.formatMessage({ id: 'diemrenluyen.minhchung.lienhe' })}</div>
									</Col>
									<Col span={24} md={12}>
										<Form.Item
											name={['thongTinNgoaiTru', 'tenChuTro']}
											label={intl.formatMessage({ id: 'diemrenluyen.khaibaominhchung.hotenchutro' })}
											rules={[...rules.required, ...rules.length(100)]}
										>
											<Input placeholder={intl.formatMessage({ id: 'diemrenluyen.khaibaominhchung.placeholder.hotenchutro' })} />
										</Form.Item>
									</Col>
									<Col span={24} md={12}>
										<Form.Item
											name={['thongTinNgoaiTru', 'sdtChuTro']}
											label={intl.formatMessage({ id: 'diemrenluyen.khaibaominhchung.sdtchutro' })}
											rules={[...rules.required, ...rules.soDienThoai]}
										>
											<Input placeholder={intl.formatMessage({ id: 'diemrenluyen.khaibaominhchung.placeholder.sdtchutro' })} />
										</Form.Item>
									</Col>
								</>
							) : null}
						</>
					) : phanLoai === EPhanLoaiNoiNgoaiTru.NOI_TRU ? (
						<>
							<Col span={24}>
								<div className='ant-descriptions-title'>{intl.formatMessage({ id: 'diemrenluyen.minhchung.noio' })}</div>
							</Col>
							<Col span={24} md={12}>
								<Form.Item name={['thongTinNoiTru', 'idKyTucXa']} label={intl.formatMessage({ id: 'diemrenluyen.minhchung.ktx' })} rules={[...rules.required]}>
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
									<Form.Item name={['thongTinNoiTru', 'idSoPhong']} label={intl.formatMessage({ id: 'diemrenluyen.minhchung.sophong' })} rules={[...rules.required]}>
										<SelectDanhMucDiemRenLuyen
											loaiDanhMuc={ELoaiDanhMucChung.PHONG_KTX}
											idKyTucXa={idKyTucXa}
											// hasDefault
										/>
									</Form.Item>
								</Col>
							) : (
								<Col span={24} md={12}>
									<Form.Item name={['thongTinNoiTru', 'idSoPhong']} label={intl.formatMessage({ id: 'diemrenluyen.minhchung.sophong' })} rules={[...rules.required]}>
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
						{!edit ? intl.formatMessage({ id: 'diemrenluyen.danhmuc.form.themmoi' }) : intl.formatMessage({ id: 'diemrenluyen.danhmuc.form.luulai' })}
					</Button>
				)}
				<Button
					onClick={() => {
						setVisibleForm(false);
					}}
				>
					{intl.formatMessage({ id: 'diemrenluyen.modal.button.dong' })}
				</Button>
			</Form.Item>
		</Card>
	);
};
