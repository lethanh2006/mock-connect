import { EOperatorType } from '@/components/Table/constant';
import type { HocPhan } from '@/services/DaoTao/HocPhan/typings';
import type { QuyDoiDiem } from '@/services/HocTap/QuyDoiDiem/typing';
import { ETrangThaiSinhVienQuyDoiDiem, colorTrangThaiSinhVienQuyDoiDiem } from '@/services/HocTap/constant';
import rules from '@/utils/rules';
import { Button, Col, Descriptions, Form, Modal, Row, Tag } from 'antd';
import moment from 'moment';
import { useModel } from 'umi';
import FormItemMinhChungQuyDoi from '../MinhChungQuyDoi/FormItemMinhChung';

const ModalQuyDoiDiem = (props: { visible: boolean; setVisible: any; hocPhan?: HocPhan.IRecord }) => {
	const [form] = Form.useForm();
	const { visible, setVisible, hocPhan } = props;
	const { formSubmiting, postSinhVienQuyDoiModel, isView, record, setIsView, getModel } = useModel(
		'daotao.quydoidiem.sinhvienquydoidiem',
	);
	const { danhSach } = useModel('daotao.quydoidiem.dotquydoidiem');
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
			thongTinQuyDoiDiemSinhVien: {
				sinhVienSsoId: recSinhVien?.ssoId,
				maHocPhan: hocPhan?.ma,
				maSinhVien: recSinhVien?.ma,
				hoTen: recSinhVien?.ten,
			},
			danhSachMinhChung: values.danhSachMinhChungQuyDoi,
		};

		postSinhVienQuyDoiModel(danhSach[0]?._id ?? '', data)
			.then(() => {
				getData();
				setVisible(false);
			})
			.catch((rec) => console.log(rec));
	};

	return (
		<Modal
			width={800}
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
							<Descriptions column={{ xs: 1, sm: 1, md: 2 }}>
								<Descriptions.Item span={2} label='Học phần quy đổi'>
									{record?.maHocPhan ?? ''} - {record?.hocPhan.ten ?? ''} - {record?.hocPhan.soTinChi ?? ''}TC
								</Descriptions.Item>
								<Descriptions.Item label='Kết quả quy đổi'>
									{record?.diemHe10 ? `${record.diemHe10} điểm` : ''}
								</Descriptions.Item>

								{record?.trangThai === ETrangThaiSinhVienQuyDoiDiem.DA_RA_QUYET_DINH ? (
									<>
										<Descriptions.Item label='Số quyết định'>{record?.soQuyetDinh}</Descriptions.Item>
										<Descriptions.Item label='Ngày ban hành'>
											{record.thoiGianBanHanh ? moment(record?.thoiGianBanHanh).format('DD/MM/YYYY') : ''}
										</Descriptions.Item>
									</>
								) : null}

								<Descriptions.Item label='Ý kiến phòng ban' span={2}>
									{record?.hoTenNguoiChoYKien ? (
										<>
											{record?.hoTenNguoiChoYKien}: {record?.ghiChu ?? <i>Không có ý kiến</i>}
											{record.thoiGianChoYKien
												? ` (${moment(record.thoiGianChoYKien).format('HH:mm DD/MM/YYYY')})`
												: ''}
										</>
									) : (
										<Tag color='blue'>Chưa cho ý kiến</Tag>
									)}
								</Descriptions.Item>
								<Descriptions.Item label='Trạng thái'>
									<Tag color={colorTrangThaiSinhVienQuyDoiDiem[record?.trangThai as ETrangThaiSinhVienQuyDoiDiem]}>
										{record?.trangThai ?? ''}
									</Tag>
								</Descriptions.Item>
							</Descriptions>
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
						</>
					)}
					<Col xs={24}>
						<Form.Item name='danhSachMinhChungQuyDoi' rules={[...rules.required]}>
							<FormItemMinhChungQuyDoi />
						</Form.Item>
					</Col>
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
