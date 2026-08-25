import type { Vi } from '@/services/TaiChinh/Vi/typing';
import rules from '@/utils/rules';
import { tienVietNam } from '@/utils/utils';
import { Alert, Button, Col, Divider, Form, Input, Modal, Row } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const ModalYeuCauRutTien = (props: {
	visible: boolean;
	setVisible: (value: boolean) => void;
	getData: () => void;
}) => {
	const { visible, setVisible, getData } = props;
	const intl = useIntl();
	const [form] = Form.useForm();
	const { viCuaToi } = useModel('taichinh.vi');
	const { postYeuCauRutTienModel, formSubmiting } = useModel('taichinh.viyeucaurut');
	const { record: recSinhVien, getThongTinCuaToiModel } = useModel('sinhvien.sinhvien');

	const soDu = viCuaToi?.soDu ?? 0;

	// Hồ sơ sinh viên thường đã được nạp sẵn toàn app, chỉ gọi bù khi vào thẳng trang mà chưa có
	useEffect(() => {
		if (visible && !recSinhVien?._id) getThongTinCuaToiModel().catch((er) => console.log(er));
	}, [visible]);

	useEffect(() => {
		if (!visible) return;

		form.setFieldsValue({
			userFullname: viCuaToi?.userFullname ?? recSinhVien?.ten,
			userCode: viCuaToi?.userCode ?? recSinhVien?.ma,
			userEmail: viCuaToi?.userEmail ?? recSinhVien?.email,
			soDienThoai: viCuaToi?.userPhone ?? recSinhVien?.soDienThoai,
			soTaiKhoanNganHang: recSinhVien?.soTaiKhoanNganHang,
			tenNganHang: recSinhVien?.tenNganHang,
			chiNhanhNganHang: recSinhVien?.chiNhanhNganHang,
		});
	}, [visible, recSinhVien?._id]);

	const onClose = () => {
		setVisible(false);
		form.resetFields();
	};

	const handleSubmit = async (values: any) => {
		try {
			// Số tiền rút do backend tự lấy toàn bộ số dư khả dụng của ví, frontend không gửi lên
			const payload: Vi.TYeuCauRutTienPayload = {
				soTaiKhoanNganHang: values.soTaiKhoanNganHang,
				tenNganHang: values.tenNganHang,
				chiNhanhNganHang: values.chiNhanhNganHang,
				soDienThoai: values.soDienThoai,
				lyDoSinhVien: values.lyDoSinhVien,
			};

			await postYeuCauRutTienModel(payload);
			onClose();
			getData();
		} catch (er) {
			console.log(er);
		}
	};

	return (
		<Modal
			open={visible}
			onCancel={onClose}
			footer={null}
			destroyOnClose
			width={900}
			centered
			styles={{ body: { maxHeight: '85vh', overflowY: 'auto', overflowX: 'hidden', paddingRight: 8 } }}
			title={intl.formatMessage({ id: 'visinhvien.ruttien.modal.title' })}
		>
			<Alert
				type='info'
				showIcon
				style={{ marginBottom: 16 }}
				message={intl.formatMessage({ id: 'visinhvien.ruttien.modal.alert.sodu' }, { soDu: tienVietNam(soDu) })}
				description={intl.formatMessage({ id: 'visinhvien.ruttien.modal.alert.dongbang' })}
			/>

			<Form layout='vertical' form={form} onFinish={handleSubmit}>
				<Row gutter={16}>
					<Col span={24} md={12}>
						<Form.Item name='userFullname' label={intl.formatMessage({ id: 'visinhvien.info.hoten' })}>
							<Input disabled />
						</Form.Item>
					</Col>
					<Col span={24} md={12}>
						<Form.Item name='userCode' label={intl.formatMessage({ id: 'visinhvien.info.masv' })}>
							<Input disabled />
						</Form.Item>
					</Col>
					<Col span={24} md={12}>
						<Form.Item name='userEmail' label={intl.formatMessage({ id: 'visinhvien.info.email' })}>
							<Input disabled />
						</Form.Item>
					</Col>
					<Col span={24} md={12}>
						<Form.Item
							name='soDienThoai'
							label={intl.formatMessage({ id: 'visinhvien.ruttien.form.sdt' })}
							rules={[...rules.soDienThoai]}
						>
							<Input placeholder={intl.formatMessage({ id: 'visinhvien.ruttien.form.sdt.place' })} />
						</Form.Item>
					</Col>
				</Row>

				<Divider orientation='center'>{intl.formatMessage({ id: 'visinhvien.ruttien.form.divider.nganhang' })}</Divider>

				<Alert
					type='warning'
					showIcon
					style={{ marginBottom: 16 }}
					message={intl.formatMessage({ id: 'visinhvien.ruttien.form.nganhang.canhbao' })}
				/>

				<Row gutter={16}>
					<Col span={24} md={12}>
						<Form.Item
							name='soTaiKhoanNganHang'
							label={intl.formatMessage({ id: 'visinhvien.ruttien.form.stk' })}
							rules={[...rules.required, ...rules.sotaikhoan]}
						>
							<Input placeholder={intl.formatMessage({ id: 'visinhvien.ruttien.form.stk.place' })} />
						</Form.Item>
					</Col>
					<Col span={24} md={12}>
						<Form.Item
							name='tenNganHang'
							label={intl.formatMessage({ id: 'visinhvien.ruttien.form.nganhang' })}
							rules={[...rules.required, ...rules.length(250)]}
						>
							<Input placeholder={intl.formatMessage({ id: 'visinhvien.ruttien.form.nganhang.place' })} />
						</Form.Item>
					</Col>
					<Col span={24} md={12}>
						<Form.Item
							name='chiNhanhNganHang'
							label={intl.formatMessage({ id: 'visinhvien.ruttien.form.chinhanh' })}
							rules={[...rules.length(250)]}
						>
							<Input placeholder={intl.formatMessage({ id: 'visinhvien.ruttien.form.chinhanh.place' })} />
						</Form.Item>
					</Col>
				</Row>

				<Form.Item
					name='lyDoSinhVien'
					label={intl.formatMessage({ id: 'visinhvien.ruttien.form.lydo' })}
					rules={[...rules.length(1000)]}
				>
					<Input.TextArea rows={3} placeholder={intl.formatMessage({ id: 'visinhvien.ruttien.form.lydo.place' })} />
				</Form.Item>

				<div style={{ textAlign: 'center', marginTop: 8 }}>
					<Button style={{ marginRight: 8 }} onClick={onClose}>
						{intl.formatMessage({ id: 'global.button.huy' })}
					</Button>
					<Button type='primary' htmlType='submit' loading={formSubmiting}>
						{intl.formatMessage({ id: 'visinhvien.ruttien.button.gui' })}
					</Button>
				</div>
			</Form>
		</Modal>
	);
};

export default ModalYeuCauRutTien;
