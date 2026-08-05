import MyDatePicker from '@/components/MyDatePicker';
import UploadFile from '@/components/Upload/UploadFile';
import SelectHocPhan from '@/pages/DaoTao/HocPhan/SelectHocPhan';
import SelectQuyDoiDiem from '@/pages/DaoTao/QuyDoiDiem/Select';
import {
	ELoaiHocPhanMinhChung,
	EMinhChungQuyDoiDiem,
	ETrinhDoMinhChungQuyDoiDiem,
	mapNameLoaiHocPhanMinhChung,
} from '@/services/HocTap/constant';
import rules from '@/utils/rules';
import { Col, Form, type FormInstance, Input, InputNumber, Row, Select } from 'antd';
import { useIntl, useModel } from 'umi';
import AutoHocPhanQuyDoi from './AutoHocPhan';
import AutoTruongHocQuyDoi from './AutoTruongHoc';

const FormQuyDoiDiem = (props: { form: FormInstance; isHocPhan?: boolean }) => {
	const intl = useIntl();
	const { form, isHocPhan } = props;
	const { danhSach: danhSachQuyDoiDiem } = useModel('daotao.dmquydoidiem');
	const { danhSach: danhSachHocPhan } = useModel('hocphan.hocphan');
	const loaiMinhChung: string = Form.useWatch('loai', form);
	const loaiHocPhan: string = Form.useWatch('loaiHocPhan', form);
	const trinhDoDaoTao: ETrinhDoMinhChungQuyDoiDiem = Form.useWatch('trinhDoDaoTao', form);
	const tenTruong = Form.useWatch('tenTruong', form);
	const diemHe10MinhChung = Form.useWatch('diemHe10MinhChung', form);
	const diemHe4MinhChung = Form.useWatch('diemHe4MinhChung', form);

	const onChangeHocPhanMinhChung = (maHocPhanMinhChung?: string) => {
		const ns = danhSachHocPhan.find((item) => item.ma === maHocPhanMinhChung);
		form.setFieldsValue({
			tenHocPhan: ns?.ten,
			soTinChi: ns?.soTinChi,
			trinhDoDaoTao: ETrinhDoMinhChungQuyDoiDiem.DAI_HOC,
			tenTruong: APP_CONFIG_TEN_TRUONG,
		});
	};

	const onChangeDiem10 = (number: number) => {
		const rule = danhSachQuyDoiDiem.find((i) => number >= i.diemFrom && number <= i.diemTo);
		form.setFieldsValue({
			diemHe10: number,
			diemHe4MinhChung: rule?.diemThang4,
			diemChuMinhChung: rule?.diemChu,
		});
	};

	const onChangeDiem4 = (score: number) => {
		const rule = danhSachQuyDoiDiem.find((i) => i.diemThang4 === score);
		form.setFieldsValue({ diemChuMinhChung: rule?.diemChu });
	};

	return (
		<Row gutter={[12, 0]}>
			<Col xs={24}>
				<Form.Item
					name='loai'
					label={intl.formatMessage({ id: 'tientrinhhoctap.tientrinhthucte.congnhan.form.loai' })}
					rules={[...rules.required]}
					extra={intl.formatMessage({ id: 'tientrinhhoctap.tientrinhthucte.congnhan.form.loai.extra' })}
				>
					<Select
						placeholder={intl.formatMessage({ id: 'tientrinhhoctap.tientrinhthucte.congnhan.form.loai.place' })}
						options={Object.values(EMinhChungQuyDoiDiem).map((item) => ({
							key: item,
							label: item,
							value: item,
						}))}
					/>
				</Form.Item>
			</Col>

			{loaiMinhChung === EMinhChungQuyDoiDiem.HOC_PHAN ? (
				<>
					<Col xs={24}>
						<div className='fw500'>
							{intl.formatMessage({ id: 'tientrinhhoctap.tientrinhthucte.congnhan.form.thongtin' })}
						</div>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item
							initialValue={ELoaiHocPhanMinhChung.NGOAI_CHUONG_TRINH}
							name='loaiHocPhan'
							label={intl.formatMessage({ id: 'tientrinhhoctap.tientrinhthucte.congnhan.form.loaihp' })}
							rules={[...rules.required]}
						>
							<Select
								placeholder={intl.formatMessage({ id: 'tientrinhhoctap.tientrinhthucte.congnhan.form.loaihp.place' })}
								options={Object.values(ELoaiHocPhanMinhChung).map((item) => ({
									key: item,
									value: item,
									label: mapNameLoaiHocPhanMinhChung[item],
								}))}
								onSelect={() => {
									form.resetFields([
										'tenHocPhan',
										'soTinChi',
										'trinhDoDaoTao',
										'tenTruong',
										'nganh',
										'maHocPhanMinhChung',
									]);
								}}
							/>
						</Form.Item>
					</Col>

					{loaiHocPhan === ELoaiHocPhanMinhChung.NGOAI_CHUONG_TRINH ? (
						<>
							<Col xs={24} md={12}>
								<Form.Item
									name='trinhDoDaoTao'
									label={intl.formatMessage({ id: 'tientrinhhoctap.tientrinhthucte.congnhan.form.trinhdo' })}
									rules={[...rules.required]}
								>
									<Select
										onSelect={() => form.setFieldsValue({ tenTruong: undefined, tenHocPhan: undefined })}
										placeholder={intl.formatMessage({
											id: 'tientrinhhoctap.tientrinhthucte.congnhan.form.trinhdo.place',
										})}
										options={Object.values(ETrinhDoMinhChungQuyDoiDiem).map((item) => ({
											key: item,
											label: item,
											value: item,
										}))}
									/>
								</Form.Item>
							</Col>
							<Col xs={24} md={12}>
								<Form.Item
									name='tenTruong'
									label={intl.formatMessage({ id: 'tientrinhhoctap.tientrinhthucte.congnhan.form.truonghoc' })}
									rules={[...rules.required, ...rules.text, ...rules.length(500)]}
								>
									<AutoTruongHocQuyDoi
										trinhDoDaoTao={trinhDoDaoTao}
										onSelect={() => form.setFieldsValue({ tenHocPhan: undefined })}
									/>
								</Form.Item>
							</Col>
							<Col xs={24} md={12}>
								<Form.Item
									name='nganh'
									label={intl.formatMessage({ id: 'tientrinhhoctap.tientrinhthucte.congnhan.form.nganh' })}
									rules={[...rules.required, ...rules.text, ...rules.length(500)]}
								>
									<Input
										placeholder={intl.formatMessage({
											id: 'tientrinhhoctap.tientrinhthucte.congnhan.form.nganh.place',
										})}
									/>
								</Form.Item>
							</Col>
							<Col xs={24} md={12}>
								<Form.Item
									name='tenHocPhan'
									label={intl.formatMessage({ id: 'tientrinhhoctap.tientrinhthucte.congnhan.form.tenhp' })}
									rules={[...rules.required, ...rules.text, ...rules.length(250)]}
								>
									<AutoHocPhanQuyDoi
										trinhDoDaoTao={trinhDoDaoTao}
										tenTruong={tenTruong}
										onSelect={(val) =>
											form.setFieldsValue({
												maHocPhanMinhChung: val?.maHocPhanMinhChung,
												soTinChi: val?.soTinChi,
											})
										}
									/>
								</Form.Item>
							</Col>
							<Col xs={24} md={12}>
								<Form.Item
									name='maHocPhanMinhChung'
									label={intl.formatMessage({ id: 'tientrinhhoctap.tientrinhthucte.congnhan.form.mahp' })}
									rules={[...rules.text, ...rules.length(20)]}
								>
									<Input
										placeholder={intl.formatMessage({ id: 'tientrinhhoctap.tientrinhthucte.congnhan.form.mahp.place' })}
									/>
								</Form.Item>
							</Col>
							<Col xs={24} md={8}>
								<Form.Item
									name='soDVHT'
									label={intl.formatMessage({ id: 'tientrinhhoctap.tientrinhthucte.congnhan.form.sodv' })}
									extra={
										<small style={{ color: '#999' }}>
											<i>{intl.formatMessage({ id: 'tientrinhhoctap.tientrinhthucte.congnhan.form.sodv.extra' })}</i>
										</small>
									}
								>
									<InputNumber
										style={{ width: '100%' }}
										placeholder={intl.formatMessage({
											id: 'tientrinhhoctap.tientrinhthucte.congnhan.form.sodv.place',
										})}
										min={0}
										onChange={(val) => form.setFieldsValue({ soTinChi: Math.round((val ?? 0) / 1.5) })}
									/>
								</Form.Item>
							</Col>
							<Col xs={24} md={8}>
								<Form.Item
									name='soTinChi'
									label={intl.formatMessage({ id: 'tientrinhhoctap.tientrinhthucte.congnhan.form.stc' })}
								>
									<InputNumber
										style={{ width: '100%' }}
										placeholder={intl.formatMessage({ id: 'tientrinhhoctap.tientrinhthucte.congnhan.form.stc.place' })}
										min={0}
									/>
								</Form.Item>
							</Col>
							<Col xs={24} md={8}>
								<Form.Item
									name='namTotNghiep'
									label={intl.formatMessage({ id: 'tientrinhhoctap.tientrinhthucte.congnhan.form.nam' })}
								>
									<InputNumber
										style={{ width: '100%' }}
										placeholder={intl.formatMessage({
											id: 'tientrinhhoctap.tientrinhthucte.congnhan.form.nam.place',
										})}
										min={0}
									/>
								</Form.Item>
							</Col>
						</>
					) : loaiHocPhan === ELoaiHocPhanMinhChung.TRONG_CHUONG_TRINH ? (
						<>
							<Col xs={24} md={12}>
								<Form.Item
									name='maHocPhanMinhChung'
									label={intl.formatMessage({ id: 'tientrinhhoctap.tientrinhthucte.congnhan.form.hpdahoc' })}
									rules={[...rules.required]}
								>
									<SelectHocPhan selectMa onChange={(val) => onChangeHocPhanMinhChung(val?.toString())} />
								</Form.Item>
								<Form.Item name='tenHocPhan' hidden />
								<Form.Item name='soTinChi' hidden />
								<Form.Item name='trinhDoDaoTao' hidden />
								<Form.Item name='tenTruong' hidden />
							</Col>
						</>
					) : null}

					<Col xs={24}>
						<div className='fw500'>
							{intl.formatMessage({ id: 'tientrinhhoctap.tientrinhthucte.congnhan.form.kq' })}
						</div>
					</Col>
					<Col xs={12} md={8}>
						<Form.Item
							name='diemHe10MinhChung'
							label={intl.formatMessage({ id: 'tientrinhhoctap.tientrinhthucte.congnhan.form.diem10' })}
						>
							<InputNumber
								style={{ width: '100%' }}
								placeholder={intl.formatMessage({ id: 'tientrinhhoctap.tientrinhthucte.congnhan.form.diem10.place' })}
								min={0}
								max={10}
								onChange={(val) => onChangeDiem10(Number(val))}
							/>
						</Form.Item>
					</Col>
					<Col xs={12} md={8}>
						<Form.Item
							name='diemHe4MinhChung'
							label={intl.formatMessage({ id: 'tientrinhhoctap.tientrinhthucte.congnhan.form.diem4' })}
						>
							<Select
								options={danhSachQuyDoiDiem.map((item) => ({
									key: item._id,
									value: item.diemThang4,
									label: item.diemThang4,
								}))}
								placeholder={intl.formatMessage({ id: 'tientrinhhoctap.tientrinhthucte.congnhan.form.diem4.place' })}
								onChange={(val) => onChangeDiem4(val)}
								disabled={!!diemHe10MinhChung}
							/>
						</Form.Item>
					</Col>
					<Col span={12} md={8}>
						<Form.Item
							name='diemChuMinhChung'
							label={intl.formatMessage({ id: 'tientrinhhoctap.tientrinhthucte.congnhan.form.diemchu' })}
							rules={[...rules.required]}
						>
							<SelectQuyDoiDiem
								disabled={!!diemHe4MinhChung}
								onChange={(val) => form.setFieldsValue({ diemChu: val })}
							/>
						</Form.Item>
					</Col>
				</>
			) : loaiMinhChung === EMinhChungQuyDoiDiem.CHUNG_CHI ? (
				<>
					<Col xs={24}>
						<div className='fw500'>
							{intl.formatMessage({ id: 'tientrinhhoctap.tientrinhthucte.congnhan.form.ttchungchi' })}
						</div>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item
							name='tenChungChi'
							label={intl.formatMessage({ id: 'tientrinhhoctap.tientrinhthucte.congnhan.form.tenchungchi' })}
							rules={[...rules.required, ...rules.text, ...rules.length(250)]}
						>
							<Input
								placeholder={intl.formatMessage({
									id: 'tientrinhhoctap.tientrinhthucte.congnhan.form.tenchungchi.place',
								})}
							/>
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item
							name='bacChungChi'
							label={intl.formatMessage({
								id: 'tientrinhhoctap.tientrinhthucte.congnhan.form.bac',
							})}
							rules={[...rules.required, ...rules.text, ...rules.length(20)]}
						>
							<Input
								placeholder={intl.formatMessage({
									id: 'tientrinhhoctap.tientrinhthucte.congnhan.form.bac.place',
								})}
							/>
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item
							name='donViCap'
							label={intl.formatMessage({
								id: 'tientrinhhoctap.tientrinhthucte.congnhan.form.dvcap',
							})}
							rules={[...rules.required, ...rules.text, ...rules.length(250)]}
						>
							<Input
								placeholder={intl.formatMessage({
									id: 'tientrinhhoctap.tientrinhthucte.congnhan.form.dvcap.place',
								})}
							/>
						</Form.Item>
					</Col>

					<Col xs={24} md={12}>
						<Form.Item
							name='thoiGianHieuLuc'
							label={intl.formatMessage({ id: 'tientrinhhoctap.tientrinhthucte.congnhan.form.tghieuluc' })}
						>
							<MyDatePicker
								placeholder={intl.formatMessage({
									id: 'tientrinhhoctap.tientrinhthucte.congnhan.form.tghieuluc.place',
								})}
							/>
						</Form.Item>
					</Col>
				</>
			) : (
				<>
					<Col xs={24}>
						<div className='fw500'>
							{intl.formatMessage({ id: 'tientrinhhoctap.tientrinhthucte.congnhan.form.nghiencuu' })}
						</div>
					</Col>
					<Col xs={24}>
						<Form.Item
							name='tenDeTaiNckh'
							label={intl.formatMessage({ id: 'tientrinhhoctap.tientrinhthucte.congnhan.form.tendetai' })}
							rules={[...rules.required, ...rules.text, ...rules.length(500)]}
						>
							<Input
								placeholder={intl.formatMessage({ id: 'tientrinhhoctap.tientrinhthucte.congnhan.form.tendetai.place' })}
							/>
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item
							name='nguoiHuongDanNckh'
							label={intl.formatMessage({ id: 'tientrinhhoctap.tientrinhthucte.congnhan.form.nguoihuongdan' })}
							rules={[...rules.text, ...rules.length(100)]}
						>
							<Input
								placeholder={intl.formatMessage({
									id: 'tientrinhhoctap.tientrinhthucte.congnhan.form.nguoihuongdan.place',
								})}
							/>
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item
							name='diemNckh'
							label={intl.formatMessage({ id: 'tientrinhhoctap.tientrinhthucte.congnhan.form.diemnckh' })}
							rules={[...rules.required]}
						>
							<InputNumber
								placeholder={intl.formatMessage({ id: 'tientrinhhoctap.tientrinhthucte.congnhan.form.diemnckh.place' })}
								style={{ width: '100%' }}
								min={0}
							/>
						</Form.Item>
					</Col>
				</>
			)}

			{!isHocPhan ? (
				<Col xs={24} md={12}>
					<Form.Item
						name='urlsMinhChung'
						label={intl.formatMessage({ id: 'tientrinhhoctap.tientrinhthucte.congnhan.form.fileminhchung' })}
						rules={[...rules.required]}
					>
						<UploadFile resize maxCount={5} isPrivate />
					</Form.Item>
				</Col>
			) : (
				<Col xs={24}>
					<Form.Item
						name='ghiChu'
						label={intl.formatMessage({ id: 'tientrinhhoctap.tientrinhthucte.congnhan.form.ghichu' })}
					>
						<Input
							placeholder={intl.formatMessage({ id: 'tientrinhhoctap.tientrinhthucte.congnhan.form.ghichu.place' })}
						/>
					</Form.Item>
				</Col>
			)}
		</Row>
	);
};

export default FormQuyDoiDiem;
