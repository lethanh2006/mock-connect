import { ColorSuKien, ELoaiSuKien } from '@/services/SuKien/constant';
import { Button, Col, ColorPicker, Form, Modal, Row } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const ModalSettingMauLich = () => {
	const intl = useIntl();
	const { formSubmiting, visibleForm, setVisibleForm, record, putMeSettingLichModel, postMeSettingLichModel } =
		useModel('tienich.settinglich');
	const [form] = Form.useForm();

	useEffect(() => {
		const mapValue = Object.values(ELoaiSuKien).reduce((acc: any, item) => {
			acc[item] = record?.danhSachSettingLich?.find((i) => i?.loaiLich === item)?.maMau ?? ColorSuKien[item];
			return acc;
		}, {});

		form.setFieldsValue(mapValue);
	}, [record?._id, visibleForm]);

	const rgbaToHex = (r: number, g: number, b: number, a: number): string => {
		return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}${Math.round(a * 255)
			.toString(16)
			.padStart(2, '0')}`;
	};

	const onFinish = async (values: any) => {
		const data = {
			danhSachSettingLich: Object.values(ELoaiSuKien).map((item) => {
				const color = values[item];
				const hexColor = typeof color === 'string' ? color : rgbaToHex(color?.r, color?.g, color?.b, color?.a);
				return {
					loaiLich: item,
					maMau: hexColor,
				};
			}),
		};

		if (record?._id) {
			putMeSettingLichModel(record._id, data).catch(console.log);
		} else {
			postMeSettingLichModel(data).catch(console.log);
		}
	};

	const handleResetToDefault = () => {
		const defaultColors = Object.values(ELoaiSuKien).reduce((acc: any, item) => {
			acc[item] = ColorSuKien[item];
			return acc;
		}, {});

		form.setFieldsValue(defaultColors);
		form.submit();
	};

	return (
		<Modal
			open={visibleForm}
			title={intl.formatMessage({ id: 'lichsukien.cauhinh' })}
			destroyOnClose
			width={600}
			onCancel={() => setVisibleForm(false)}
			footer={null}
		>
			<Form form={form} layout='vertical' onFinish={onFinish}>
				<Row gutter={[12, 0]}>
					{Object.values(ELoaiSuKien).map((item) => (
						<Col span={24} md={12} key={item}>
							<Form.Item name={item} label={item}>
								<ColorPicker showText />
							</Form.Item>
						</Col>
					))}
				</Row>

				<div className='form-footer'>
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						{intl.formatMessage({ id: 'global.button.luulai' })}
					</Button>
					<Button onClick={handleResetToDefault}> {intl.formatMessage({ id: 'lichsukien.cauhinh.macdinh' })}</Button>
					<Button onClick={() => setVisibleForm(false)}> {intl.formatMessage({ id: 'global.button.huy' })}</Button>
				</div>
			</Form>
		</Modal>
	);
};

export default ModalSettingMauLich;
