import { ColorSuKien, ELoaiSuKien } from '@/services/SuKien/constant';
import { ColorPicker, Form, Modal } from 'antd';
import type { Color } from 'antd/es/color-picker';
import { Button } from '@/components/Icons';
import { Col, Row } from '@/components/MyGrid';
import ModalExpandable from '@/components/Table/ModalExpandable';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const ModalSettingMauLich = () => {
	const intl = useIntl();
	const { formSubmiting, visibleForm, setVisibleForm, recSettingLocal, putMeSettingLichModel, postMeSettingLichModel } =
		useModel('tienich.settinglich');
	const [form] = Form.useForm();

	useEffect(() => {
		const mapValue = Object.values(ELoaiSuKien).reduce((acc: any, item) => {
			acc[item] = recSettingLocal?.danhSachSettingLich?.find((i) => i?.loaiLich === item)?.maMau ?? ColorSuKien[item];
			return acc;
		}, {});

		form.setFieldsValue(mapValue);
	}, [recSettingLocal?.danhSachSettingLich, visibleForm]);

	const onFinish = async (values: any) => {
		const data = {
			danhSachSettingLich: Object.values(ELoaiSuKien).map((item) => {
				const color = values[item];
				const hexColor = typeof color === 'string' ? color : (color as Color)?.toHexString();
				return {
					loaiLich: item,
					maMau: hexColor,
				};
			}),
		};

		if (recSettingLocal?._id) {
			putMeSettingLichModel(recSettingLocal._id, data).catch(console.log);
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
		<ModalExpandable
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
					<Button loading={formSubmiting} type='submit' variant='default'>
						{intl.formatMessage({ id: 'global.button.luulai' })}
					</Button>
					<Button variant='outline' onClick={handleResetToDefault}>
						{intl.formatMessage({ id: 'lichsukien.cauhinh.macdinh' })}
					</Button>
					<Button variant='outline' onClick={() => setVisibleForm(false)}>
						{intl.formatMessage({ id: 'global.button.huy' })}
					</Button>
				</div>
			</Form>
		</ModalExpandable>
	);
};

export default ModalSettingMauLich;
