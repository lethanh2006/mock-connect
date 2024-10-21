import { ColorSuKien, type ELoaiSuKien } from '@/services/SuKien/constant';
import { Button, Form } from 'antd';
import { Colorpicker } from 'antd-colorpicker';
import { useEffect } from 'react';
import { useModel } from 'umi';

const PickColorLich = (props: { loaiLich: ELoaiSuKien }) => {
	const { loaiLich } = props;
	const [form] = Form.useForm();
	const {
		record: recSetting,
		putMeSettingLichModel,
		postMeSettingLichModel,
		formSubmiting,
	} = useModel('tienich.settinglich');

	useEffect(() => {
		const maMau = recSetting?.danhSachSettingLich?.find((item) => item?.loaiLich === loaiLich)?.maMau;
		form.setFieldsValue({ maMau: maMau ?? ColorSuKien[loaiLich] });
	}, []);

	const rgbaToHex = (r: number, g: number, b: number, a: number): string => {
		return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}${Math.round(a * 255)
			.toString(16)
			.padStart(2, '0')}`;
	};

	const onFinish = (values: any) => {
		let danhSachLich = [];

		const color = values?.maMau;
		const hexColor = rgbaToHex(color?.r, color?.g, color?.b, color?.a);

		if (recSetting?._id) {
			danhSachLich = recSetting.danhSachSettingLich.map((item) =>
				item.loaiLich === loaiLich ? { ...item, maMau: typeof color === 'string' ? color : hexColor } : item,
			);
		} else {
			danhSachLich = [
				{
					loaiLich: loaiLich,
					maMau: typeof color === 'string' ? color : hexColor,
				},
			];
		}

		const data = {
			danhSachSettingLich: danhSachLich,
		};

		if (recSetting?._id) {
			putMeSettingLichModel(recSetting._id ?? '', data).catch((er) => console.log(er));
		} else {
			postMeSettingLichModel(data).catch((er) => console.log(er));
		}
	};

	return (
		<Form form={form} onFinish={onFinish}>
			<Form.Item name='maMau' label=''>
				<Colorpicker onColorResult={(color) => color.rgb} />
			</Form.Item>

			<div className='form-footer'>
				<Button size='small' loading={formSubmiting} htmlType='submit' type='primary'>
					Xác nhận
				</Button>
				<Button
					size='small'
					onClick={() =>
						onFinish({
							maMau: ColorSuKien[loaiLich],
						})
					}
				>
					Đặt về mặc định
				</Button>
			</div>
		</Form>
	);
};

export default PickColorLich;
