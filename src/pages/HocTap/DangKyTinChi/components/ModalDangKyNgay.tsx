import { ELoaiDangKyTheoLop } from '@/services/DaoTao/DangKyTinChi/constant';
import { Button, Col, Descriptions, Modal, Row } from 'antd';
import { useIntl, useModel } from 'umi';
import RenderLichHoc from './RenderLichHoc';

const ModalDangKyNgay = (props: { visible: boolean; setVisible: (val: boolean) => void }) => {
	const intl = useIntl();
	const { visible, setVisible } = props;
	const { record, formSubmiting, setFormSubmiting } = useModel('lophocphan.lophocphan');
	const { dotDangKyHienTai, postDangKyTinChiModel, phieuDangKy, getPhieuDangKyModel, getLopDangKyModel } =
		useModel('daotao.dotdangkytinchi');
	const { loaiDangKy } = useModel('hocphan.hocphan');
	const { khoaNganhMe } = useModel('sinhvien.sinhvien');

	const khoaNganh =
		loaiDangKy === ELoaiDangKyTheoLop.KHOA_NGANH_2 ? khoaNganhMe?.khoaNganhPhu : khoaNganhMe?.khoaNganhChinh;

	const postDangKy = async () => {
		setFormSubmiting(true);
		postDangKyTinChiModel({
			phieuDktcId: phieuDangKy?._id ?? '',
			dangKy: { lopHocPhanId: record?._id ?? '', maKhoaNganh: khoaNganh?.ma ?? '' },
		})
			.then()
			.finally(() => {
				if (dotDangKyHienTai?._id) {
					getPhieuDangKyModel(dotDangKyHienTai._id);
					getLopDangKyModel(dotDangKyHienTai.maHocKy);
				}

				setFormSubmiting(false);
				setVisible(false);
			});
	};

	return (
		<Modal title={'Thông báo xác nhận'} open={visible} footer={null} onCancel={() => setVisible(false)} width={700}>
			<Row gutter={[12, 12]}>
				<Col span={24}>
					Bạn có chắc chắn muốn <b>"Đăng ký"</b> học lớp học phần này không?
				</Col>
				<Col span={24}>
					<Descriptions
						column={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 2 }}
						className='highlight'
						layout='vertical'
						colon={false}
					>
						<Descriptions.Item label='Mã lớp'>{record?.maLop ?? record?.ten ?? '--'}</Descriptions.Item>
						<Descriptions.Item label='Tên học phần'>{record?.hocPhan?.ten ?? '--'}</Descriptions.Item>
						<Descriptions.Item label='Giảng viên'>
							{record?.nhanSuList?.length
								? record?.nhanSuList
										?.map((item) =>
											item.nhanSu?.ten ? `${item.nhanSu?.hoDem ?? ''} ${item.nhanSu?.ten ?? ''}` : item.tenNhanSu,
										)
										.join(', ')
								: '--'}
						</Descriptions.Item>
						<Descriptions.Item label='Thông tin lớp học'>
							{record?._id ? <RenderLichHoc lopHocPhan={record} /> : '--'}
						</Descriptions.Item>
					</Descriptions>
				</Col>
			</Row>

			<div className='form-footer'>
				<Button type='primary' loading={formSubmiting} onClick={postDangKy}>
					{intl.formatMessage({ id: 'global.button.xacnhan' })}
				</Button>
				<Button onClick={() => setVisible(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
			</div>
		</Modal>
	);
};

export default ModalDangKyNgay;
