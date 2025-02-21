import MyDatePicker from '@/components/MyDatePicker';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { Button, Col, Form, Input, Modal, Row } from 'antd';
import moment from 'moment';
import { useEffect } from 'react';
import { history, useModel } from 'umi';

const ConfirmMuonSach = (props: { id?: string }) => {
	const { id } = props;
	const [form] = Form.useForm();
	const { dangKyAnPhamModel, formSubmiting, settingMuonTra, visibleMuon, setVisibleMuon } =
		useModel('thuvien.muonsach');
	const { record } = useModel('thuvien.anpham');

	useEffect(() => {
		if (!visibleMuon) {
			resetFieldsForm(form);
		} else {
			form.setFieldsValue({
				thoiGianMuonDuKien: moment().toISOString(),
				thoiGianTraDuKien: moment()
					.add(settingMuonTra?.thoiHanMuonTraSach || 150, 'days')
					.toISOString(),
			});
		}
	}, [record?._id, visibleMuon]);

	const onFinish = async (values: any) => {
		dangKyAnPhamModel({
			...values,
			anPhamId: record?._id ?? id,
		})
			.then(() => {
				setVisibleMuon(false);
				history.push('/thu-vien/lich-su-muon-tra');
			})
			.catch((er) => console.log(er));
	};

	return (
		<Modal
			visible={visibleMuon}
			onCancel={() => setVisibleMuon(false)}
			title='Xác nhận đăng ký mượn sách'
			footer={null}
			width={600}
		>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]}>
					<Col xs={24}>
						<div
							style={{
								display: 'flex',
								flexDirection: 'column',
								gap: 8,
								alignItems: 'center',
								marginBottom: 24,
							}}
						>
							<div style={{ color: 'orange', fontSize: 48 }}>
								<ExclamationCircleFilled />
							</div>
							<div>Bạn có chắc chắn xác nhận đăng ký mượn sách?</div>
						</div>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item name='thoiGianMuonDuKien' label='Thời gian dự kiến mượn' rules={[...rules.required]}>
							<MyDatePicker />
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item name='thoiGianTraDuKien' label='Thời gian dự kiến trả' rules={[...rules.required]}>
							<MyDatePicker />
						</Form.Item>
					</Col>
					<Col xs={24} md={24}>
						<Form.Item name='ghiChuDangKy' label='Ghi chú'>
							<Input.TextArea rows={3} placeholder='Nhập ghi chú' />
						</Form.Item>
					</Col>
				</Row>

				<div className='form-footer'>
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						Xác nhận
					</Button>
					<Button onClick={() => setVisibleMuon(false)}>Hủy</Button>
				</div>
			</Form>
		</Modal>
	);
};

export default ConfirmMuonSach;
