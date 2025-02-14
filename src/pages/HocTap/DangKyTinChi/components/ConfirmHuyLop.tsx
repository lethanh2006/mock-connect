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
	const { deleteDangKyTinChiModel, phieuDangKy, danhSachLopDangKy, tinhDataLichHoc, setDanhSachLopDangKy } =
		useModel('daotao.dotdangkytinchi');
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
			width={600}
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
							<div style={{ width: 450, textAlign: 'center' }}>
								Bạn có chắc chắn muốn huỷ đăng ký lớp tín chỉ{' '}
								{`${recLopDangKy?.hocPhan?.ten} (${recLopDangKy?.maHocPhan})`} này?
							</div>

							<i style={{ color: 'red' }}>Lưu ý: Thao tác không thể được hoàn tác</i>
						</div>
					</Col>

					<Col span={24}>
						<Form.Item name='commit' valuePropName='checked' initialValue={false}>
							<Checkbox>Tôi đã hiểu và xác nhận hủy lớp</Checkbox>
						</Form.Item>
					</Col>
				</Row>

				<div className='form-footer'>
					<Button type='primary' disabled={!commit} onClick={() => handleXoaDangKyTinChi()}>
						Xác nhận
					</Button>
					<Button onClick={() => setVisible(false)}>Hủy</Button>
				</div>
			</Form>
		</Modal>
	);
};

export default ConfirmKetHuyLopDKTC;
