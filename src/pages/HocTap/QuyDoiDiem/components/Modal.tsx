import { EOperatorType } from '@/components/Table/constant';
import type { HocPhan } from '@/services/DaoTao/HocPhan/typings';
import type { QuyDoiDiem } from '@/services/HocTap/QuyDoiDiem/typing';
import rules from '@/utils/rules';
import { Button, Col, Descriptions, Form, Modal, Row } from 'antd';
import { useModel } from 'umi';
import FormItemHocPhanQuyDoi from '../HocPhanQuyDoi/FormItemHocPhanQuyDoi';
import FormItemMinhChungQuyDoi from '../MinhChungQuyDoi/FormItemMinhChung';

const ModalQuyDoiDiem = (props: { visible: boolean; setVisible: any; hocPhan?: HocPhan.IRecord }) => {
	const [form] = Form.useForm();
	const { visible, setVisible, hocPhan } = props;
	const { formSubmiting, isView, record, setIsView, getModel } = useModel('daotao.quydoidiem.phieuquydoidiem');
	const { postSinhVienQuyDoiModel, postSinhVienQuyDoiPhieuModel } = useModel('daotao.quydoidiem.sinhvienquydoidiem');
	const { record: recDot } = useModel('daotao.quydoidiem.dotquydoidiem');
	const { record: recSinhVien } = useModel('sinhvien.sinhvien');

	const getData = () =>
		getModel(undefined, [
			{
				active: true,
				field: 'sinhVienSsoId',
				operator: EOperatorType.INCLUDE,
				values: [recSinhVien?.ssoId ?? ''],
			},
		]);

	const onFinish = async (values: QuyDoiDiem.IQuyDoiDiemSinhVien) => {
		const data = {
			danhSachHocPhanDangKyQuyDoiDiem: {
				thongTinQuyDoiDiemSinhVien: {
					phieuDangKyQuyDoiDiemId: record?._id,
					maHocPhan: hocPhan?.ma,
					tenHocPhan: hocPhan?.ten,
				},
				danhSachMinhChung: values.danhSachMinhChungQuyDoi,
			},
			sinhVienSsoId: recSinhVien?.ssoId,

			maSinhVien: recSinhVien?.ma,
			hoTen: recSinhVien?.ten,
		};

		if (record?._id) {
			postSinhVienQuyDoiPhieuModel(recDot?._id ?? '', data.danhSachHocPhanDangKyQuyDoiDiem)
				.then(() => {
					getData();
					setVisible(false);
				})
				.catch((rec) => console.log(rec));
		} else {
			postSinhVienQuyDoiModel(recDot?._id ?? '', data)
				.then(() => {
					getData();
					setVisible(false);
				})
				.catch((rec) => console.log(rec));
		}
	};

	return (
		<Modal
			width={1000}
			visible={visible}
			onCancel={() => {
				setVisible(false);
				setIsView(false);
			}}
			footer={null}
			title={`${isView ? 'Lịch sử công nhận kết quả học tập' : 'Công nhận kết quả học tập'}`}
		>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]}>
					{isView ? (
						<Col xs={24}>
							<FormItemHocPhanQuyDoi />
						</Col>
					) : (
						<>
							<Descriptions column={{ xs: 1, md: 2, sm: 1, lg: 2, xl: 2 }}>
								<Descriptions.Item span={2} label='Học phần xin công nhận'>
									{hocPhan?.ten ?? ''}
								</Descriptions.Item>
								<Descriptions.Item label='Mã học phần'>{hocPhan?.ma ?? ''}</Descriptions.Item>
								<Descriptions.Item label='Số tín chỉ'>{hocPhan?.soTinChi ?? ''}</Descriptions.Item>
							</Descriptions>
							<Col xs={24}>
								<Form.Item name='danhSachMinhChungQuyDoi' rules={[...rules.required]}>
									<FormItemMinhChungQuyDoi />
								</Form.Item>
							</Col>
						</>
					)}
				</Row>

				<div className='form-footer'>
					{!isView ? (
						<Button loading={formSubmiting} htmlType='submit' type='primary'>
							Đăng ký
						</Button>
					) : null}

					<Button
						onClick={() => {
							setVisible(false);
							setIsView(false);
						}}
					>
						Hủy
					</Button>
				</div>
			</Form>
		</Modal>
	);
};

export default ModalQuyDoiDiem;
