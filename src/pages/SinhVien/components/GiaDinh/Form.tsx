import MyDatePicker from '@/components/MyDatePicker';
import SelectDanToc from '@/pages/Core/DanToc/SelectDanToc';
import SelectDiaChiHoSoFormItem from '@/pages/Core/DonViHanhChinh/SelectDiaChiHoSo';
import SelectQuocTich from '@/pages/Core/QuocTich/SelectQuocTich';
import SelectTonGiao from '@/pages/Core/TonGiao/SelectTonGiao';
import { getTinhThanhPho } from '@/services/Core/DonViHanhChinh';
import type { DonViHanhChinh } from '@/services/Core/DonViHanhChinh/typing';
import { ELoaiThanhVienGiaDinh, ETrangThaiThanhVienGiaDinh } from '@/services/DaoTao/SinhVien/constants';
import type { SinhVien } from '@/services/DaoTao/SinhVien/typings';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button } from '@/components/Icons';
import { Col, Row } from '@/components/MyGrid';
import Select from '@/components/MySelect';
import { Card } from '@/components/PageCard';
import Input from '@/components/MyInput';
import { Form } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl } from 'umi';

const FormThongTinGiaDinh = (props: {
	visible: boolean;
	onOk: (rec: SinhVien.TThongTinGiaDinh) => void;
	onCancel: () => void;
	record?: SinhVien.TThongTinGiaDinh;
}) => {
	const intl = useIntl();
	const { visible, onCancel, onOk, record } = props;
	const [listTinh, setListTinh] = useState<DonViHanhChinh.IRecord[]>();
	const [form] = Form.useForm();
	const trangThaiThanhVien: ETrangThaiThanhVienGiaDinh = Form.useWatch('trangThaiThanhVien', form);

	useEffect(() => {
		getTinhThanhPho().then((data) => {
			setListTinh(data.data.data);
		});
	}, []);

	useEffect(() => {
		if (!visible) resetFieldsForm(form);
		else if (record?.key !== undefined) form.setFieldsValue(record);
	}, [record?.key, visible]);

	const onFinish = async (values: SinhVien.TThongTinGiaDinh) => {
		if (onOk) onOk(values);
	};

	return (
		<Card
			bordered={false}
			title={
				record?.key === undefined
					? `${intl.formatMessage({ id: 'thongtincanhan.form.thongtingiadinh.form.themmoi' })}`
					: `${intl.formatMessage({ id: 'thongtincanhan.form.thongtingiadinh.form.luulai' })}`
			}
		>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]}>
					<Col span={12} md={6}>
						<Form.Item
							name='loaiThanhVien'
							label={intl.formatMessage({ id: 'thongtincanhan.form.thongtingiadinh.form.loaithanhvien' })}
							rules={[...rules.required]}
						>
							<Select
								placeholder={intl.formatMessage({ id: 'thongtincanhan.form.thongtingiadinh.form.loaithanhvien.place' })}
								options={Object.values(ELoaiThanhVienGiaDinh).map((item) => ({ key: item, value: item, label: item }))}
							/>
						</Form.Item>
					</Col>
					<Col span={12} md={6}>
						<Form.Item
							name='trangThaiThanhVien'
							label={intl.formatMessage({ id: 'thongtincanhan.form.thongtingiadinh.form.trangthai' })}
							rules={[...rules.required]}
						>
							<Select
								placeholder={intl.formatMessage({ id: 'thongtincanhan.form.thongtingiadinh.form.trangthai.place' })}
								options={Object.values(ETrangThaiThanhVienGiaDinh).map((item) => ({
									key: item,
									value: item,
									label: item,
								}))}
							/>
						</Form.Item>
					</Col>

					{trangThaiThanhVien !== ETrangThaiThanhVienGiaDinh.KHONG_CO_THONG_TIN ? (
						<>
							<Col span={12} md={6}>
								<Form.Item
									name='hoDem'
									label={intl.formatMessage({ id: 'thongtincanhan.form.thongtingiadinh.form.hodem' })}
									rules={[...rules.required, ...rules.ten]}
								>
									<Input
										placeholder={intl.formatMessage({ id: 'thongtincanhan.form.thongtingiadinh.form.hodem.place' })}
									/>
								</Form.Item>
							</Col>
							<Col span={12} md={6}>
								<Form.Item
									name='ten'
									label={intl.formatMessage({ id: 'thongtincanhan.form.thongtingiadinh.form.ten' })}
									rules={[...rules.required, ...rules.ten]}
								>
									<Input
										placeholder={intl.formatMessage({ id: 'thongtincanhan.form.thongtingiadinh.form.ten.place' })}
									/>
								</Form.Item>
							</Col>

							<Col span={12} md={6}>
								<Form.Item
									name='ngaySinh'
									label={intl.formatMessage({ id: 'thongtincanhan.form.thongtingiadinh.form.ngaysinh' })}
								>
									<MyDatePicker
										placeholder={intl.formatMessage({ id: 'thongtincanhan.form.thongtingiadinh.form.ngaysinh.place' })}
									/>
								</Form.Item>
							</Col>
							<Col span={12} md={6}>
								<Form.Item
									name='quocTich'
									label={intl.formatMessage({ id: 'thongtincanhan.form.thongtingiadinh.form.quoctich' })}
								>
									<SelectQuocTich />
								</Form.Item>
							</Col>
							<Col span={12} md={6}>
								<Form.Item
									name='danToc'
									label={intl.formatMessage({ id: 'thongtincanhan.form.thongtingiadinh.form.danhtoc' })}
								>
									<SelectDanToc />
								</Form.Item>
							</Col>
							<Col span={12} md={6}>
								<Form.Item
									name='tonGiao'
									label={intl.formatMessage({ id: 'thongtincanhan.form.thongtingiadinh.form.tongiao' })}
								>
									<SelectTonGiao />
								</Form.Item>
							</Col>

							<Col span={12} md={6}>
								<Form.Item
									name='soDienThoai'
									label={intl.formatMessage({ id: 'thongtincanhan.form.thongtingiadinh.form.sdt' })}
									rules={
										trangThaiThanhVien === ETrangThaiThanhVienGiaDinh.DA_MAT
											? [...rules.soDienThoai]
											: [...rules.required, ...rules.soDienThoai]
									}
								>
									<Input
										placeholder={intl.formatMessage({ id: 'thongtincanhan.form.thongtingiadinh.form.sdt.place' })}
									/>
								</Form.Item>
							</Col>
							<Col span={12} md={6}>
								<Form.Item
									name='email'
									label={intl.formatMessage({ id: 'thongtincanhan.form.thongtingiadinh.form.email' })}
									rules={[...rules.email]}
								>
									<Input
										placeholder={intl.formatMessage({ id: 'thongtincanhan.form.thongtingiadinh.form.email.place' })}
									/>
								</Form.Item>
							</Col>
							<Col span={12} md={6}>
								<Form.Item
									name='ngheNghiep'
									label={intl.formatMessage({ id: 'thongtincanhan.form.thongtingiadinh.form.nghenghiep' })}
									rules={
										trangThaiThanhVien === ETrangThaiThanhVienGiaDinh.DA_MAT
											? [...rules.text, ...rules.length(250)]
											: [...rules.text, ...rules.length(250), ...rules.required]
									}
								>
									<Input
										placeholder={intl.formatMessage({
											id: 'thongtincanhan.form.thongtingiadinh.form.nghenghiep.place',
										})}
									/>
								</Form.Item>
							</Col>
							<Col span={12} md={6}>
								<Form.Item
									name='coQuanCongTac'
									label={intl.formatMessage({ id: 'thongtincanhan.form.thongtingiadinh.form.congtac' })}
									rules={[...rules.text, ...rules.length(250)]}
								>
									<Input
										placeholder={intl.formatMessage({ id: 'thongtincanhan.form.thongtingiadinh.form.congtac.place' })}
									/>
								</Form.Item>
							</Col>

							<Col span={24}>
								<Form.Item
									name='hoKhauThuongTru'
									label={intl.formatMessage({ id: 'thongtincanhan.form.thongtingiadinh.form.hokhau' })}
									rules={trangThaiThanhVien === ETrangThaiThanhVienGiaDinh.DA_MAT ? undefined : [...rules.required]}
								>
									<SelectDiaChiHoSoFormItem listTinh={listTinh} required />
								</Form.Item>
							</Col>
							<Col span={24}>
								<Form.Item
									name='diaChiHienNay'
									label={intl.formatMessage({ id: 'thongtincanhan.form.thongtingiadinh.form.diachi' })}
								>
									<SelectDiaChiHoSoFormItem listTinh={listTinh} hasSoNha />
								</Form.Item>
							</Col>

							<Col span={24} md={6}>
								<Form.Item
									name='soTheBHYT'
									label={intl.formatMessage({ id: 'thongtincanhan.form.thongtingiadinh.form.bh' })}
									rules={[...rules.text, ...rules.length(50)]}
								>
									<Input
										placeholder={intl.formatMessage({ id: 'thongtincanhan.form.thongtingiadinh.form.bh.place' })}
									/>
								</Form.Item>
							</Col>
							<Col span={24} md={18}>
								<Form.Item
									name='hoatDongChinhTriXaHoi'
									label={intl.formatMessage({ id: 'thongtincanhan.form.thongtingiadinh.form.hd' })}
									rules={[...rules.text, ...rules.length(250)]}
								>
									<Input
										placeholder={intl.formatMessage({ id: 'thongtincanhan.form.thongtingiadinh.form.hd.place' })}
									/>
								</Form.Item>
							</Col>
						</>
					) : null}
				</Row>

				<div className='form-footer'>
					<Button type='submit' variant='default'>
						{record?.key === undefined
							? `${intl.formatMessage({ id: 'global.button.themmoi' })}`
							: `${intl.formatMessage({ id: 'global.button.luulai' })}`}
					</Button>
					<Button variant='outline' onClick={onCancel}>
						{intl.formatMessage({ id: 'global.button.huy' })}
					</Button>
				</div>
			</Form>
		</Card>
	);
};

export default FormThongTinGiaDinh;
