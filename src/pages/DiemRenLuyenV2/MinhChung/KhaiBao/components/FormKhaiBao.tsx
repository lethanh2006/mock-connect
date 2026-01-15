import { ETrangThaiTiepNhanMinhChung } from '@/services/DiemRenLuyenV2/MinhChung/KhaiBao/constants';
import { EKieuDuLieu, ETextDisplay } from '@/services/FormDong/LoaiHinh/constants';
import { buildUpLoadMultiFile } from '@/services/uploadFile';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Divider, Form, Row, Select } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import FormRender from '../../CauHinh/components/MauDon/FormRender';
import ViewRender from '../../CauHinh/components/MauDon/ViewRender';
const FormKhaiBao = (props: { getData?: () => void; mode: 'sinhvien' | 'bancansu' }) => {
	const { getData } = props;
	const [form] = Form.useForm();
	const [formValues, setFormValues] = useState<any>({});
	const { record: recordCauHinh } = useModel('diemrenluyenv2.minhchung.cauhinh');
	const { record: recordDot } = useModel('diemrenluyenv2.dot');
	const { danhSach: danhSachDanhMuc } = useModel('quytrinh.danhmuc');
	const { edit, formSubmiting, setVisibleForm, record, visibleForm, isView, putModel, postModel } = useModel(
		props.mode === 'sinhvien' ? 'diemrenluyenv2.minhchung.khaibao' : 'diemrenluyenv2.minhchung.khaibaobcs',
	);
	const { record: recSinhVien } = useModel('sinhvien.sinhvien');
	const { record: recLopHanhChinh } = useModel('daotao.lophanhchinh');

	const onFinish = async (values: any) => {
		try {
			const recSinhVienModeBCS = recLopHanhChinh?.lopHcSvKyList?.find(
				(item) => item.sinhVien?.ma === values?.maSinhVien,
			);
			const hoTen = props.mode === 'sinhvien' ? recSinhVien?.ten : recSinhVienModeBCS?.sinhVien?.ten;
			const ssoId = props.mode === 'sinhvien' ? recSinhVien?.ssoId : recSinhVienModeBCS?.sinhVien?.ssoId;
			const maSinhVien = props.mode === 'sinhvien' ? recSinhVien?.ma : recSinhVienModeBCS?.sinhVien?.ma;
			const lopHanhChinh = props.mode === 'sinhvien' ? recSinhVien?.lopHanhChinhList?.[0]?.ten : recLopHanhChinh?.ten;
			const diemQuyDoi = recordCauHinh?.isDanhMucDiemQuyDoi ? values?.diemQuyDoi : recordCauHinh?.diemQuyDoi;
			delete values?.hoTen;
			delete values?.ssoId;
			delete values?.maSinhVien;
			delete values?.lopHanhChinh;
			delete values?.diemQuyDoi;

			const valuesFinal: any = {};
			const valuesForm = { ...(record?.thongTinKhaiBao ?? {}), ...values };
			for (const item in valuesForm) {
				const value = valuesForm[item];
				if (value?.fileList?.length) {
					valuesForm[item] = await buildUpLoadMultiFile(valuesForm, item);
				}
			}
			Object.keys(valuesForm).map((item) => {
				const cauHinh = recordCauHinh?.danhSachCauHinhMinhChung?.find((ele) => ele.ma === item);
				const isDanhMuc = cauHinh?.kieuDuLieu === EKieuDuLieu.DANHMUC;
				valuesFinal[item] = {
					value: valuesForm[item],
					info: isDanhMuc
						? danhSachDanhMuc
								?.find((ele) => ele.maDanhMuc === cauHinh.maDanhMuc)
								?.danhSachGiaTri?.find((ele) => ele.value === valuesForm[item])?.info
						: undefined,
				};
			});

			const payload = {
				thongTinKhaiBao: { ...valuesFinal },
				cauHinhMinhChungId: recordCauHinh?._id,
				dotChamDiemId: recordDot?._id,
				hoTen: hoTen,
				ssoId: ssoId,
				maSinhVien: maSinhVien,
				lopHanhChinh: lopHanhChinh,
				diemQuyDoi: diemQuyDoi,
				trangThai: ETrangThaiTiepNhanMinhChung.CHO_XU_LY,
			};
			if (edit) {
				putModel(record?._id ?? '', { ...payload }, getData);
			} else {
				postModel({ ...payload }, getData);
			}
		} catch (e) {
			console.log(e);
		}
	};

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) {
			const valuesFormKhaiBao: any = {};
			Object.keys(record?.thongTinKhaiBao ?? {}).map((key) => {
				valuesFormKhaiBao[key] = record?.thongTinKhaiBao[key]?.value;
			});
			form.setFieldsValue({
				...record,
				...valuesFormKhaiBao,
			});
		}
	}, [record?._id, visibleForm]);

	const intl = useIntl();

	if (isView) {
		return (
			<Card
				title={`${recordCauHinh?.tenMinhChung ?? intl.formatMessage({ id: 'diemrenluyen.khaibaominhchung.title' })}`}
			>
				<Divider orientation={'center'}>
					{intl.formatMessage({ id: 'diemrenluyen.khaibaominhchung.thongtinchung' })}
				</Divider>
				<Row gutter={[0, 10]}>
					<Col xs={24} sm={24} md={12}>
						<div
							style={{
								display: 'flex',
							}}
						>
							<div style={{ marginRight: 4 }}>
								<b>{intl.formatMessage({ id: 'diemrenluyen.khaibaominhchung.sinhvien' })}: </b>
							</div>
							<div>{record?.hoTen}</div>
						</div>
					</Col>
					<Col xs={24} sm={24} md={12}>
						<div
							style={{
								display: 'flex',
							}}
						>
							<div style={{ marginRight: 4 }}>
								<b>{intl.formatMessage({ id: 'diemrenluyen.khaibaominhchung.masinhvien' })}: </b>
							</div>
							<div>{record?.maSinhVien}</div>
						</div>
					</Col>
					{recordCauHinh?.isDanhMucDiemQuyDoi && (
						<Col xs={24} sm={24} md={24}>
							<div
								style={{
									display: 'flex',
								}}
							>
								<div style={{ marginRight: 4 }}>
									<b>{recordCauHinh?.tenDanhMucQuyDoi}: </b>
								</div>
								<div>
									{recordCauHinh?.danhMucDiemQuyDoi?.find((item) => item?.diemQuyDoi === record?.diemQuyDoi)?.tieuDe}
								</div>
							</div>
						</Col>
					)}

					<Divider orientation={'center'}>
						{intl.formatMessage({ id: 'diemrenluyen.khaibaominhchung.thongtinkhaibao' })}
					</Divider>
					{recordCauHinh?.danhSachCauHinhMinhChung.map((item) => {
						if (
							!item?.truongThongTinLienQuan ||
							item?.truongThongTinLienQuan
							// (dataForm?.thongTinKhaiBao?.[item?.truongThongTinLienQuan]?.value ===
							//   item?.giaTriLienQuan ||
							//   (item.giaTriLienQuan.includes &&
							//     item?.giaTriLienQuan?.includes(
							//       dataForm?.thongTinKhaiBao?.[item?.truongThongTinLienQuan]?.value,
							//     ))))
						) {
							const isTable = item?.kieuDuLieu === EKieuDuLieu.TABLE || item?.kieuDuLieu === EKieuDuLieu.DANHSACH;
							const isHtml = item?.kieuDuLieu === EKieuDuLieu.TEXT && item?.textDisplay === ETextDisplay?.TEXT_EDITOR;
							return (
								<Col key={item.ma} xs={24} sm={24} md={item.colspan || 24} lg={item.colspan || 24}>
									<div
										style={{
											display: 'flex',
											flexDirection: isHtml || isTable ? 'column' : 'row',
										}}
									>
										<div style={{ marginRight: 4, flexShrink: 0 }}>
											<b>{item.ten}: </b>
										</div>
										<div>
											<ViewRender
												cauHinh={item}
												recordSanPham={{
													thongTinKhaiBao: record?.thongTinKhaiBao,
												}}
											/>
										</div>
									</div>
								</Col>
							);
						} else return null;
					})}
				</Row>
			</Card>
		);
	} else {
		return (
			<Card
				title={`${recordCauHinh?.tenMinhChung ?? intl.formatMessage({ id: 'diemrenluyen.khaibaominhchung.title' })}`}
			>
				<Form
					style={{ position: 'relative' }}
					scrollToFirstError
					onValuesChange={(changedValues, values) => {
						setFormValues(values);
					}}
					labelCol={{ span: 24 }}
					form={form}
					onFinish={onFinish}
					layout={'vertical'}
				>
					<Row gutter={[12, 0]}>
						{props.mode === 'bancansu' && (
							<Col span={24}>
								<Form.Item name={'ssoId'} hidden />
								<Form.Item name={'hoTen'} hidden />
								<Form.Item name={'lopHanhChinh'} hidden />
								<Form.Item
									name={'maSinhVien'}
									label={intl.formatMessage({ id: 'diemrenluyen.khaibaominhchung.sinhvien' })}
									rules={[...rules.required]}
								>
									<Select
										optionFilterProp='label'
										placeholder={intl.formatMessage({ id: 'diemrenluyen.khaibaominhchung.chonsinhvien' })}
										showSearch
										options={recLopHanhChinh?.lopHcSvKyList?.map((item) => ({
											value: item.sinhVien?.ma,
											label: `${item?.sinhVien?.ten} (${item?.sinhVien?.ma})`,
										}))}
										onChange={(val, option) => {
											const rawData = recLopHanhChinh?.lopHcSvKyList?.find((item) => item?.sinhVien?.ma === val);
											form.setFieldsValue({
												ssoId: rawData?.sinhVienSsoId,
												hoTen: rawData?.sinhVien?.ten,
												lopHanhChinh: recLopHanhChinh?.ten,
											});
										}}
									/>
								</Form.Item>
							</Col>
						)}
						{recordCauHinh?.isDanhMucDiemQuyDoi && (
							<Col span={24}>
								<Form.Item
									name={'diemQuyDoi'}
									label={
										recordCauHinh?.tenDanhMucQuyDoi ??
										intl.formatMessage({ id: 'diemrenluyen.khaibaominhchung.hangmuc' })
									}
									rules={[...rules.required]}
								>
									<Select
										placeholder={
											recordCauHinh?.tenDanhMucQuyDoi ??
											intl.formatMessage({ id: 'diemrenluyen.khaibaominhchung.chonhangmuc' })
										}
										options={recordCauHinh?.danhMucDiemQuyDoi?.map((val) => ({
											value: val?.diemQuyDoi,
											label: `${val?.tieuDe}`,
										}))}
									/>
								</Form.Item>
							</Col>
						)}
						{recordCauHinh?.danhSachCauHinhMinhChung?.map((item) => (
							<FormRender
								danhSachCauHinh={recordCauHinh?.danhSachCauHinhMinhChung}
								formValues={formValues}
								key={item.ma}
								cauHinh={item}
								form={form}
							/>
						))}
					</Row>
					<div className='form-footer'>
						<Button loading={formSubmiting} htmlType='submit' type='primary'>
							{!edit
								? intl.formatMessage({ id: 'diemrenluyen.khaibaominhchung.themmoi' })
								: intl.formatMessage({ id: 'diemrenluyen.khaibaominhchung.luulai' })}
						</Button>
						<Button onClick={() => setVisibleForm(false)}>
							{intl.formatMessage({ id: 'diemrenluyen.khaibaominhchung.huy' })}
						</Button>
					</div>
				</Form>
			</Card>
		);
	}
};
export default FormKhaiBao;
