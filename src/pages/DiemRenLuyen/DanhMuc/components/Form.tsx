import { ELoaiDanhMucChung, ELoaiDanhMucChungMappingToTitle } from '@/services/DiemRenLuyen/DanhMuc/constant';
import { type DanhMucDiemRenLuyen } from '@/services/DiemRenLuyen/DanhMuc/typing';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Form, Input, Row } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import { SelectDanhMucDiemRenLuyen } from './Select';

export const FormDanhMuc = () => {
	const [form] = Form.useForm();
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
		getLoaiDanhMucChung,
	} = useModel('diemrenluyen.danhmuc');

	useEffect(() => {
		resetFieldsForm(form, {
			...record,
			loai: getLoaiDanhMucChung(),
		} as DanhMucDiemRenLuyen.IRecord);
	}, [record?._id, visibleForm]);

	const onFinish = async (values: DanhMucDiemRenLuyen.IRecord) => {
		if (edit) {
			putModel(record?._id ?? '', values, getModel)
				.then()
				.catch((er) => console.log(er));
		} else postModel(values, getModel).catch((er) => console.log(er));
	};

	return (
		<Card
			title={
				(isView ? 'Chi tiết ' : edit ? 'Chỉnh sửa ' : 'Thêm mới ') +
				ELoaiDanhMucChungMappingToTitle[getLoaiDanhMucChung()].toLowerCase()
			}
		>
			<Form id='FormDanhMuc' onFinish={onFinish} form={form} layout='vertical' disabled={isView}>
				<Form.Item name='loai' hidden />
				<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
					<Col span={24}>
						<Form.Item label='Mã' name='ma' rules={[...rules.required]}>
							<Input placeholder='Mã' />
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item label='Tên' name='ten' rules={[...rules.required]}>
							<Input placeholder='Tên' />
						</Form.Item>
					</Col>
					{getLoaiDanhMucChung() === ELoaiDanhMucChung.PHONG_KTX && (
						<Col span={24}>
							<Form.Item label='Ký túc xá' name='idCha' rules={[...rules.required]}>
								<SelectDanhMucDiemRenLuyen loaiDanhMuc={ELoaiDanhMucChung.KY_TUC_XA} />
							</Form.Item>
						</Col>
					)}
					<Col span={24}>
						<Form.Item label='Ghi chú' name='ghiChu'>
							<Input.TextArea placeholder='Ghi chú' />
						</Form.Item>
					</Col>
				</Row>
			</Form>
			<Form.Item style={{ textAlign: 'center', marginTop: 24 }}>
				{!isView && (
					<Button
						form='FormDanhMuc'
						loading={formSubmiting}
						style={{ marginRight: 8 }}
						htmlType='submit'
						type='primary'
					>
						{!edit ? 'Thêm mới ' : 'Lưu lại'}
					</Button>
				)}
				<Button
					onClick={() => {
						setVisibleForm(false);
					}}
				>
					Đóng
				</Button>
			</Form.Item>
		</Card>
	);
};
