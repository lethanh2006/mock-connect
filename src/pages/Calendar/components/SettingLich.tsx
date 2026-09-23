import { ColorSuKien, ELoaiSuKien } from '@/services/SuKien/constant';
import { ColorPicker, Form } from 'antd';
import { Button } from '@/components/Icons';
import ModalExpandable from '@/components/Table/ModalExpandable';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import './style.less';

const COLOR_FIELDS: { loai: ELoaiSuKien; labelId: string }[] = [
	{ loai: ELoaiSuKien.LICH_HOC, labelId: 'lichsukien.maulich.course' },
	{ loai: ELoaiSuKien.CHUNG, labelId: 'lichsukien.maulich.activity' },
	// { loai: ELoaiSuKien.BAI_TAP, labelId: 'lichsukien.maulich.mental' },
	// { loai: ELoaiSuKien.LICH_THI, labelId: 'lichsukien.maulich.academic' },
	// { loai: ELoaiSuKien.CA_NHAN, labelId: 'lichsukien.maulich.personal' },
];

const toRgb = (color: any) => {
	if (!color) return null;
	if (typeof color === 'string') {
		const hex = color.replace('#', '');
		if (hex.length < 6) return null;
		const r = parseInt(hex.slice(0, 2), 16);
		const g = parseInt(hex.slice(2, 4), 16);
		const b = parseInt(hex.slice(4, 6), 16);
		const a = hex.length >= 8 ? parseInt(hex.slice(6, 8), 16) / 255 : 1;
		return { r, g, b, a };
	}

	const rgb = color.toRgb?.() ?? color;
	if (rgb?.r == null) return null;
	return { r: rgb.r, g: rgb.g, b: rgb.b, a: rgb.a ?? 1 };
};

const rgbaToHex = (r: number, g: number, b: number, a: number): string => {
	return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}${Math.round(a * 255)
		.toString(16)
		.padStart(2, '0')}`;
};

const formatColorText = (color: any) => {
	const rgb = toRgb(color);
	if (!rgb) return '';
	const hex = [rgb.r, rgb.g, rgb.b]
		.map((channel) => Math.round(channel).toString(16).padStart(2, '0'))
		.join('')
		.toUpperCase();
	return `#${hex}, ${Math.round(rgb.a * 100)}%`;
};

const CalendarColorField = ({ value, onChange }: { value?: any; onChange?: (color: any) => void }) => {
	const rgb = toRgb(value);
	const background = rgb ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${rgb.a})` : 'transparent';

	return (
		<ColorPicker value={value} onChange={onChange}>
			<button type='button' className='calendar-color-field'>
				<span className='calendar-color-field__swatch' style={{ background }} />
				<span className='calendar-color-field__text'>{formatColorText(value)}</span>
			</button>
		</ColorPicker>
	);
};

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
				const color = values[item] ?? recSettingLocal?.danhSachSettingLich?.find((i) => i?.loaiLich === item)?.maMau ?? ColorSuKien[item];
				const rgb = toRgb(color);
				const hexColor = rgb ? rgbaToHex(rgb.r, rgb.g, rgb.b, rgb.a) : String(color);
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
			title={intl.formatMessage({ id: 'lichsukien.caidat' })}
			destroyOnClose
			allowExpand={false}
			width={720}
			className='calendar-color-dialog'
			onCancel={() => setVisibleForm(false)}
			footer={null}
			styles={{ body: { padding: 0 } }}
		>
			<Form form={form} layout='vertical' colon={false} onFinish={onFinish}>
				<div className='calendar-color-fields'>
					{COLOR_FIELDS.map((field) => (
						<Form.Item key={field.loai} name={field.loai} label={intl.formatMessage({ id: field.labelId })}>
							<CalendarColorField />
						</Form.Item>
					))}
				</div>

				<div className='form-footer'>
					<Button className='calendar-color-dialog__save' loading={formSubmiting} type='submit' variant='default'>
						{intl.formatMessage({ id: 'global.button.luulai' })}
					</Button>
					<Button className='calendar-color-dialog__ghost' variant='outline' onClick={handleResetToDefault}>
						{intl.formatMessage({ id: 'lichsukien.cauhinh.macdinh' })}
					</Button>
					<Button className='calendar-color-dialog__ghost' variant='outline' onClick={() => setVisibleForm(false)}>
						{intl.formatMessage({ id: 'global.button.huy' })}
					</Button>
				</div>
			</Form>
		</ModalExpandable>
	);
};

export default ModalSettingMauLich;
