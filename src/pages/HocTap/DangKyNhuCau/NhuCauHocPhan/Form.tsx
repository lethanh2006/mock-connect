import SelectHocPhanKhoaNganhDkNhuCau from '@/pages/DaoTao/ChuongTrinhDaoTao/SelectHocPhanKhoaNganhDkNhuCau';
import SelectSongNganh from '@/pages/DaoTao/SongNganh/SelectSongNganh';
import type { DangKyNhuCau } from '@/services/DaoTao/DangKyNhuCau/typing';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Form, message, Row } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const FormDangKyNhuCau = (props: any) => {
	const intl = useIntl();
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
			message.error(intl.formatMessage({ id: 'dangkyhoctap.message.error.tonTai' }));
			return;
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
		<Card
			title={`${edit ? intl.formatMessage({ id: 'dangkyhoctap.form.chinhSua' }) : intl.formatMessage({ id: 'dangkyhoctap.form.themMoi' })} ${title?.toLowerCase()}`}
		>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
					<Col xs={24}>
						<Form.Item
							label={intl.formatMessage({ id: 'dangkyhoctap.form.khoaNganh' })}
							name='maKhoaNganh'
							rules={[...rules.required]}
						>
							<SelectSongNganh
							//  disabled
							/>
						</Form.Item>
					</Col>

					<Col xs={24}>
						<Form.Item
							name='maHocPhan'
							label={intl.formatMessage({ id: 'dangkyhoctap.form.hocPhan' })}
							rules={[...rules.required]}
						>
							<SelectHocPhanKhoaNganhDkNhuCau
								disabled={!maKhoaNganh}
								maKhoaNganh={maKhoaNganh}
								idDotDkNhuCau={recDot?._id}
								selectMa
							/>
						</Form.Item>
					</Col>
				</Row>

				<div className='form-footer'>
					{!edit ? (
						<Button loading={formSubmiting} htmlType='submit' type='primary'>
							{intl.formatMessage({ id: 'dangkyhoctap.form.themMoi' })}
						</Button>
					) : null}
					<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'dangkyhoctap.form.huy' })}</Button>
				</div>
			</Form>
		</Card>
	);
};

export default FormDangKyNhuCau;
