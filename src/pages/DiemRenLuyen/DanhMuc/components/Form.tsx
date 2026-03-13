import {
	ELoaiDanhMucChung,
	ELoaiDanhMucChungMappingToTitle,
} from '@/services/CongTacSinhVien/DiemRenLuyen/DanhMuc/constant';
import { type DanhMucDiemRenLuyen } from '@/services/CongTacSinhVien/DiemRenLuyen/DanhMuc/typing';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Form, Input, Row } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import { SelectDanhMucDiemRenLuyen } from './Select';

export const FormDanhMuc = () => {
	const intl = useIntl();
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
				(isView ? intl.formatMessage({ id: 'diemrenluyen.danhmuc.form.chitiet' }) : edit ? intl.formatMessage({ id: 'diemrenluyen.danhmuc.form.chinhsua' }) : intl.formatMessage({ id: 'diemrenluyen.danhmuc.form.themmoi' })) + ' ' +
				ELoaiDanhMucChungMappingToTitle[getLoaiDanhMucChung()].toLowerCase()
			}
		>
			<Form id='FormDanhMuc' onFinish={onFinish} form={form} layout='vertical' disabled={isView}>
				<Form.Item name='loai' hidden />
				<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
					<Col span={24}>
						<Form.Item label={intl.formatMessage({ id: 'diemrenluyen.danhmuc.ma' })} name='ma' rules={[...rules.required]}>
							<Input placeholder={intl.formatMessage({ id: 'diemrenluyen.danhmuc.ma' })} />
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item label={intl.formatMessage({ id: 'diemrenluyen.danhmuc.ten' })} name='ten' rules={[...rules.required]}>
							<Input placeholder={intl.formatMessage({ id: 'diemrenluyen.danhmuc.ten' })} />
						</Form.Item>
					</Col>
					{getLoaiDanhMucChung() === ELoaiDanhMucChung.PHONG_KTX && (
						<Col span={24}>
							<Form.Item label={intl.formatMessage({ id: 'diemrenluyen.minhchung.ktx' })} name='idCha' rules={[...rules.required]}>
								<SelectDanhMucDiemRenLuyen loaiDanhMuc={ELoaiDanhMucChung.KY_TUC_XA} />
							</Form.Item>
						</Col>
					)}
					<Col span={24}>
						<Form.Item label={intl.formatMessage({ id: 'diemrenluyen.danhmuc.ghichu' })} name='ghiChu'>
							<Input.TextArea placeholder={intl.formatMessage({ id: 'diemrenluyen.danhmuc.ghichu' })} />
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
						{!edit ? intl.formatMessage({ id: 'diemrenluyen.danhmuc.form.themmoi' }) : intl.formatMessage({ id: 'diemrenluyen.danhmuc.form.luulai' })}
					</Button>
				)}
				<Button
					onClick={() => {
						setVisibleForm(false);
					}}
				>
					{intl.formatMessage({ id: 'diemrenluyen.modal.button.dong' })}
				</Button>
			</Form.Item>
		</Card>
	);
};
