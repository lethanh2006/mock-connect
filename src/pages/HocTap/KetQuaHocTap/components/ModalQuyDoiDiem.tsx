import type { HocPhan } from '@/services/DaoTao/HocPhan/typings';
import type { QuyDoiDiem } from '@/services/HocTap/QuyDoiDiem/typing';
import rules from '@/utils/rules';
import { Button, Col, Descriptions, Form, Modal, Row } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import FormItemMinhChungQuyDoi from '../MinhChungQuyDoi/FormItemMinhChung';

const ModalQuyDoiDiem = (props: {
	visible: boolean;
	setVisible: any;
	chuongTrinhKhung?: { hocPhan?: HocPhan.IRecord; soTinChi?: number };
}) => {
	const [form] = Form.useForm();
	const { visible, setVisible, chuongTrinhKhung } = props;
	const { formSubmiting, postSinhVienQuyDoiModel } = useModel('daotao.quydoidiem.sinhvienquydoidiem');
	const { danhSach } = useModel('daotao.quydoidiem.dotquydoidiem');
	const { record: recSinhVien, getThongTinCuaToiModel } = useModel('sinhvien.sinhvien');

	useEffect(() => {
		getThongTinCuaToiModel();
	}, []);

	const onFinish = async (values: QuyDoiDiem.IQuyDoiDiemSinhVien) => {
		const data = {
			thongTinQuyDoiDiemSinhVien: {
				sinhVienSsoId: recSinhVien?.ssoId,
				maHocPhan: chuongTrinhKhung?.hocPhan?.ma,
				maSinhVien: recSinhVien?.ma,
				hoTen: recSinhVien?.ten,
			},
			danhSachMinhChung: values.danhSachMinhChungQuyDoi,
		};

		postSinhVienQuyDoiModel(danhSach[0]?._id ?? '', data)
			.then(() => {
				// if (getData) getData();
				setVisible(false);
			})
			.catch((rec) => console.log(rec));
	};

	return (
		<Modal
			width={800}
			visible={visible}
			onCancel={() => setVisible(false)}
			footer={null}
			title='Công nhận kết quả học tập'
		>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]}>
					<Descriptions column={1}>
						<Descriptions.Item label='Học phần xin công nhận'>{chuongTrinhKhung?.hocPhan?.ten ?? ''}</Descriptions.Item>
						<Descriptions.Item label='Mã học phần'>{chuongTrinhKhung?.hocPhan?.ma ?? ''}</Descriptions.Item>
						<Descriptions.Item label='Số tín chỉ'>{chuongTrinhKhung?.hocPhan?.soTinChi ?? ''}</Descriptions.Item>
					</Descriptions>

					<Col xs={24}>
						<Form.Item name='danhSachMinhChungQuyDoi' rules={[...rules.required]}>
							<FormItemMinhChungQuyDoi />
						</Form.Item>
					</Col>
				</Row>

				<div className='form-footer'>
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						Công nhận
					</Button>
					<Button onClick={() => setVisible(false)}>Hủy</Button>
				</div>
			</Form>
		</Modal>
	);
};

export default ModalQuyDoiDiem;
