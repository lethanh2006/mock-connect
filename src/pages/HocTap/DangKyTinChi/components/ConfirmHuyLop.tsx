import type { DangKyTinChi } from '@/services/DaoTao/DangKyTinChi/typing';
import { resetFieldsForm } from '@/utils/utils';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { Button, Checkbox, Col, Form, Modal, Row } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const ConfirmKetHuyLopDKTC = (props: {
	visible: boolean;
	setVisible: (val: boolean) => void;
	recLopDangKy?: DangKyTinChi.ILopDangKy;
}) => {
	const [form] = Form.useForm();
	const { visible, setVisible, recLopDangKy } = props;
	const {
		deleteDangKyTinChiModel,
		phieuDangKy,
		danhSachLopDangKy,
		tinhDataLichHoc,
		setDanhSachLopDangKy,
		formSubmiting,
	} = useModel('daotao.dotdangkytinchi');
	const commit: boolean = Form.useWatch('commit', form);

	useEffect(() => {
		if (!visible) resetFieldsForm(form);
	}, [visible]);

	const handleXoaDangKyTinChi = async () => {
		try {
			await deleteDangKyTinChiModel({
				phieuDktcId: phieuDangKy?._id ?? '',
				lopHocPhanId: recLopDangKy?._id ?? '',
			});

			const data = danhSachLopDangKy.filter((item) => item.maHocPhan !== recLopDangKy?.maHocPhan);
			tinhDataLichHoc(data);
			setDanhSachLopDangKy(data);
			setVisible(false);
		} catch (er) {
			console.log(er);
		}
	};

	return (
		<Modal
			title='Xác nhận hủy đăng ký lớp tín chỉ'
			visible={visible}
			onCancel={() => setVisible(false)}
			footer={null}
			width={500}
			maskClosable={false}
		>
			<Form form={form} layout='vertical'>
				<Row gutter={[8, 8]}>
					<Col span={24}>
						<div
							style={{
								display: 'flex',
								flexDirection: 'column',
								gap: 8,
								alignItems: 'center',
							}}
						>
							<div style={{ color: 'orange', fontSize: 48 }}>
								<ExclamationCircleFilled />
							</div>
							<div style={{ textAlign: 'center' }}>
								Bạn có chắc chắn muốn huỷ đăng ký lớp tín chỉ
								<br />
								{`${recLopDangKy?.hocPhan?.ten} - ${recLopDangKy?.ten}`}?
							</div>

							<p style={{ color: 'red' }}>
								<b>Lưu ý</b>: Thao tác không thể được hoàn tác
							</p>
						</div>
					</Col>

					<Col span={24}>
						<Form.Item name='commit' valuePropName='checked' initialValue={false}>
							<Checkbox>Tôi đã hiểu và xác nhận hủy đăng ký</Checkbox>
						</Form.Item>
					</Col>
				</Row>

				<div className='form-footer'>
					<Button
						type='primary'
						danger
						disabled={!commit}
						loading={formSubmiting}
						onClick={() => handleXoaDangKyTinChi()}
					>
						Xác nhận
					</Button>
					<Button onClick={() => setVisible(false)}>Hủy</Button>
				</div>
			</Form>
		</Modal>
	);
};

export default ConfirmKetHuyLopDKTC;
