import SelectHocPhanKhoaNganh from '@/pages/DaoTao/ChuongTrinhDaoTao/SelectHocPhanKhoaNganh';
import SelectSongNganh from '@/pages/DaoTao/SongNganh/SelectSongNganh';
import type { DangKyNhuCau } from '@/services/DaoTao/DangKyNhuCau/typing';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Form, message, Row } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const FormDangKyNhuCau = (props: any) => {
	const { getData, title } = props;
	const [form] = Form.useForm();
	const { danhSach, record, setVisibleForm, edit, sinhVienDangKyNhuCauModel, putModel, formSubmiting, visibleForm } =
		useModel('daotao.dangkynhucau.hocphannhucau');
	const { record: recDot } = useModel('daotao.dangkynhucau.dotdangky');
	const { maKhoaNganh } = useModel('sinhvien.sinhvien');

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) form.setFieldsValue(record);
		else {
			form.setFieldsValue({ maKhoaNganh: maKhoaNganh });
		}
	}, [record?._id, visibleForm]);

	const onFinish = async (values: DangKyNhuCau.IHocPhanDangKyNhuCau) => {
		const index = danhSach?.find((item) => item?.maHocPhan === values.maHocPhan);

		if (index) {
			return message.error('Đã tồn tại học phần trong bảng đăng ký!');
		}

		if (edit) {
			putModel(record?._id ?? '', values, getData)
				.then()
				.catch((er) => console.log(er));
		} else
			sinhVienDangKyNhuCauModel(recDot?._id ?? '', values, getData)
				.then(() => setVisibleForm(false))
				.catch((er) => console.log(er));
	};

	return (
		<Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} ${title?.toLowerCase()}`}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
					<Col xs={24}>
						<Form.Item label='Khóa ngành' name='maKhoaNganh' rules={[...rules.required]}>
							<SelectSongNganh
							//  disabled
							/>
						</Form.Item>
					</Col>

					<Col xs={24}>
						<Form.Item name='maHocPhan' label='Học phần' rules={[...rules.required]}>
							<SelectHocPhanKhoaNganh disabled={!maKhoaNganh} maKhoaNganh={maKhoaNganh} selectMa />
						</Form.Item>
					</Col>
				</Row>

				<div className='form-footer'>
					{!edit ? (
						<Button loading={formSubmiting} htmlType='submit' type='primary'>
							Thêm mới
						</Button>
					) : null}
					<Button onClick={() => setVisibleForm(false)}>Hủy</Button>
				</div>
			</Form>
		</Card>
	);
};

export default FormDangKyNhuCau;
