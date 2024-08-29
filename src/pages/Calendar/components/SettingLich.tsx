import { ColorSuKien, ELoaiSuKien } from '@/services/SuKien/constant';
import { Button, Col, Form, Modal, Row } from 'antd';
import { Colorpicker } from 'antd-colorpicker';
import { useEffect } from 'react';
import { useModel } from 'umi';

const mapFieldLoaiSuKien: Partial<Record<ELoaiSuKien, string>> = {
	[ELoaiSuKien.LICH_HOC]: 'lichHoc',
	[ELoaiSuKien.LICH_THI]: 'lichThi',
	[ELoaiSuKien.CA_NHAN]: 'lichCaNhan',
	[ELoaiSuKien.CHUNG]: 'lichChung',
};

const ModalSettingMauLich = (props: any) => {
	const { getData } = props;
	const { formSubmiting, visibleForm, setVisibleForm, record, putModel, postModel } = useModel('settinglich');
	const { record: recSinhVien } = useModel('sinhvien.sinhvien');
	const [form] = Form.useForm();

	useEffect(() => {
		const mapValue = Object.values(ELoaiSuKien)
			?.slice(0, 4)
			?.reduce((acc: any, item) => {
				const setting = record?.danhSachSettingLich?.find((items) => items?.loaiLich === item)?.maMau;
				if (setting) {
					acc[mapFieldLoaiSuKien[item] as any] = setting;
				} else {
					acc[mapFieldLoaiSuKien[item] as any] = ColorSuKien[item];
				}

				return acc;
			}, {});
		form.setFieldsValue(mapValue);
	}, [record?._id, visibleForm]);

	const onFinish = async (values: any) => {
		const data = {
			ssoId: recSinhVien?.ssoId,
			maCanBo: recSinhVien?.ma,
			hoTen: recSinhVien?.ten,
			danhSachSettingLich: Object.values(ELoaiSuKien)
				?.slice(0, 4)
				?.map((item) => ({
					loaiLich: item,
					maMau: values[mapFieldLoaiSuKien[item] as any],
				})),
		};

		if (record?._id) {
			putModel(record._id ?? '', data, getData)
				.then()
				.catch((er) => console.log(er));
		} else {
			postModel(data, getData)
				.then()
				.catch((er) => console.log(er));
		}
	};

	return (
		<Modal
			visible={visibleForm}
			title='Cấu hình màu lịch'
			destroyOnClose
			width={600}
			onCancel={() => setVisibleForm(false)}
			footer={null}
		>
			<Form form={form} layout='vertical' onFinish={onFinish}>
				<Row gutter={[12, 0]}>
					{Object.values(ELoaiSuKien)
						?.slice(0, 4)
						?.map((item) => (
							<Col span={24} md={12} key={item}>
								<Form.Item name={mapFieldLoaiSuKien[item]} label={item}>
									<Colorpicker popup onColorResult={(color) => color.hex} />
								</Form.Item>
							</Col>
						))}
				</Row>

				<div className='form-footer'>
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						Lưu lại
					</Button>
					<Button onClick={() => setVisibleForm(false)}>Hủy</Button>
				</div>
			</Form>
		</Modal>
	);
};

export default ModalSettingMauLich;
