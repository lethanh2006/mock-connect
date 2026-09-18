import MyDatePicker from '@/components/MyDatePicker';
import SelectCategory from '@/pages/Core/Category/SelectCategory';
import SelectQuocTich from '@/pages/Core/QuocTich/SelectQuocTich';
import { SoLanNhapCanhVisa, TenSoLanNhapCanhVisa } from '@/services/DaoTao/SinhVien/constants';
import type { SinhVien } from '@/services/DaoTao/SinhVien/typings';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button } from '@/components/Icons';
import { Col, Row } from '@/components/MyGrid';
import Select from '@/components/MySelect';
import { Card } from '@/components/PageCard';
import Input from '@/components/MyInput';
import { Checkbox, Form } from 'antd';
import { useEffect } from 'react';
import { useIntl } from 'umi';

const FormThongTinVisa = (props: {
	visible: boolean;
	onOk: (rec: SinhVien.TThongTinVisa) => void;
	onCancel: () => void;
	record?: SinhVien.TThongTinVisa;
}) => {
	const intl = useIntl();
	const { visible, onCancel, onOk, record } = props;
	const [form] = Form.useForm();

	useEffect(() => {
		if (!visible) {
			resetFieldsForm(form);
		} else if (record) {
			form.setFieldsValue(record);
		}
	}, [visible, record, form]);

	const onFinish = async (values: SinhVien.TThongTinVisa) => {
		onOk(values);
	};

	const handleSelectQuocGia = (tenQuocTich: string) => {
		form.setFieldValue('tenQuocGia', tenQuocTich);
	};

	return (
		<Card
			bordered={false}
			title={
				record?.key === undefined
					? intl.formatMessage({ id: 'thongtincanhan.form.thongtinvisa.form.themmoi' })
					: intl.formatMessage({ id: 'thongtincanhan.form.thongtinvisa.form.chinhsua' })
			}
		>
			<Form onFinish={onFinish} form={form} layout="vertical">
				<Row gutter={[12, 0]}>
					<Col span={24} md={12}>
						<Form.Item name="_id" hidden />
						<Form.Item name="maQuocGia" hidden>
							<Input type="hidden" />
						</Form.Item>
						<Form.Item
							name="tenQuocGia"
							label={intl.formatMessage({ id: 'thongtincanhan.form.thongtinvisa.maquocgia' })}
							rules={[...rules.required]}
						>
							<SelectQuocTich
								allowClear
								selectTen
								placeholder={intl.formatMessage({ id: 'thongtincanhan.form.thongtinvisa.maquocgia.place' })}
								onChange={handleSelectQuocGia}
							/>
						</Form.Item>
					</Col>
					<Col span={24} md={12}>
						<Form.Item
							name="soHieuVisa"
							label={intl.formatMessage({ id: 'thongtincanhan.form.thongtinvisa.sohieuvisa' })}
							rules={[...rules.required, ...rules.text, ...rules.length(100)]}
						>
							<Input
								placeholder={intl.formatMessage({ id: 'thongtincanhan.form.thongtinvisa.sohieuvisa.place' })}
							/>
						</Form.Item>
					</Col>

					<Col span={24} md={12}>
						<Form.Item
							name="loaiVisa"
							label={intl.formatMessage({ id: 'thongtincanhan.form.thongtinvisa.loaivisa' })}
							rules={[...rules.required]}
						>
							<SelectCategory allowClear category="visa" />
						</Form.Item>
					</Col>
					<Col span={24} md={12}>
						<Form.Item
							name="soLanNhapCanh"
							label={intl.formatMessage({ id: 'thongtincanhan.form.thongtinvisa.solannhapcanh' })}
							rules={[...rules.required]}
						>
							<Select
								placeholder={intl.formatMessage({
									id: 'thongtincanhan.form.thongtinvisa.solannhapcanh.place',
								})}
								allowClear
								options={Object.values(SoLanNhapCanhVisa).map((value) => ({
									value,
									label: intl.formatMessage({ id: TenSoLanNhapCanhVisa[value] }),
								}))}
							/>
						</Form.Item>
					</Col>

					<Col span={24} md={12}>
						<Form.Item
							name="ngayCapPhep"
							label={intl.formatMessage({ id: 'thongtincanhan.form.thongtinvisa.ngaycapphep' })}
							rules={[...rules.required]}
						>
							<MyDatePicker
								style={{ width: '100%' }}
								placeholder={intl.formatMessage({ id: 'thongtincanhan.form.thongtinvisa.ngaycapphep.place' })}
							/>
						</Form.Item>
					</Col>
					<Col span={24} md={12}>
						<Form.Item
							name="ngayHetHan"
							label={intl.formatMessage({ id: 'thongtincanhan.form.thongtinvisa.ngayhethan' })}
							rules={[...rules.required]}
						>
							<MyDatePicker
								style={{ width: '100%' }}
								placeholder={intl.formatMessage({ id: 'thongtincanhan.form.thongtinvisa.ngayhethan.place' })}
							/>
						</Form.Item>
					</Col>

					<Col span={24} md={12}>
						<Form.Item
							name="coQuanCap"
							label={intl.formatMessage({ id: 'thongtincanhan.form.thongtinvisa.coquancap' })}
							rules={[...rules.required, ...rules.text, ...rules.length(250)]}
						>
							<Input
								placeholder={intl.formatMessage({ id: 'thongtincanhan.form.thongtinvisa.coquancap.place' })}
							/>
						</Form.Item>
					</Col>
					<Col span={24} md={12}>
						<Form.Item
							name="noiCap"
							label={intl.formatMessage({ id: 'thongtincanhan.form.thongtinvisa.noicap' })}
							rules={[...rules.required, ...rules.text, ...rules.length(250)]}
						>
							<Input
								placeholder={intl.formatMessage({ id: 'thongtincanhan.form.thongtinvisa.noicap.place' })}
							/>
						</Form.Item>
					</Col>

					<Col span={24}>
						<Form.Item
							name="urlMinhChung"
							label={intl.formatMessage({ id: 'thongtincanhan.form.thongtinvisa.urlminhchung' })}
							rules={[...rules.text, ...rules.length(500)]}
						>
							<Input
								placeholder={intl.formatMessage({ id: 'thongtincanhan.form.thongtinvisa.urlminhchung.place' })}
							/>
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item name="visaChinh" valuePropName="checked">
							<Checkbox>
								{intl.formatMessage({ id: 'thongtincanhan.form.thongtinvisa.visachinh' })}
							</Checkbox>
						</Form.Item>
					</Col>
				</Row>

				<div className="form-footer">
					<Button type="submit" variant="default">
						{record?.key === undefined
							? intl.formatMessage({ id: 'global.button.themmoi' })
							: intl.formatMessage({ id: 'global.button.luulai' })}
					</Button>
					<Button variant="outline" onClick={onCancel}>
						{intl.formatMessage({ id: 'global.button.huy' })}
					</Button>
				</div>
			</Form>
		</Card>
	);
};

export default FormThongTinVisa;
