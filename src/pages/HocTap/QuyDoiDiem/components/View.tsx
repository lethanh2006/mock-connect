import { colorTrangThaiSinhVienQuyDoiDiem, type ETrangThaiPhieuQuyDoiDiem } from '@/services/HocTap/constant';
import { Col, Descriptions, Modal, Row, Space, Tag } from 'antd';
import { useModel } from 'umi';
import FormItemHocPhanQuyDoi from '../HocPhanQuyDoi/FormItemHocPhanQuyDoi';
import moment from 'moment';

const ViewPhieuQuyDoiDiem = (props: { visible: boolean; setVisible: (val: boolean) => void }) => {
	const { visible, setVisible } = props;
	const { record } = useModel('daotao.quydoidiem.phieuquydoidiem');

	const tiLeCongNhan = !record?.soTinChiChuongTrinhDaoTao
		? 0
		: ((record?.soTinChiDaCongNhan + record?.soTinChiCongNhanDot) / record?.soTinChiChuongTrinhDaoTao) * 100;

	return (
		<Modal
			width={1000}
			visible={visible}
			onCancel={() => setVisible(false)}
			footer={null}
			title='Lịch sử công nhận kết quả học tập'
		>
			<Row gutter={[12, 0]}>
				<Col xs={24}>
					<Descriptions column={{ xs: 1, sm: 1, md: 2 }}>
						<Descriptions.Item label='Đợt quy đổi điểm'>
							{record?.dotDangKyQuyDoiDiem?.tenDot ?? '--'}
						</Descriptions.Item>
						<Descriptions.Item label='Ngành đào tạo'>{record?.khoaNganh?.ten ?? '--'}</Descriptions.Item>
						<Descriptions.Item label='File minh chứng'>
							<Space>
								{record?.urlsMinhChung?.map((item, index) => (
									<a target='_blank' href={item} key={item} rel='noreferrer'>
										Xem tệp tin {index + 1}
									</a>
								))}
							</Space>
						</Descriptions.Item>
						<Descriptions.Item label='Tỷ lệ công nhận'>
							<span style={{ color: tiLeCongNhan > 50 ? 'red' : 'green' }}>
								{tiLeCongNhan.toFixed(tiLeCongNhan !== 0 ? 2 : 0)} %
							</span>
						</Descriptions.Item>
						<Descriptions.Item label='Số quyết định'>{record?.quyetDinh?.soQuyetDinh}</Descriptions.Item>
						<Descriptions.Item label='Ngày ban hành'>
							{record?.quyetDinh?.ngayBanHanh ? moment(record?.quyetDinh?.ngayBanHanh).format('DD/MM/YYYY') : ''}
						</Descriptions.Item>
						<Descriptions.Item label='Trạng thái'>
							<Tag color={colorTrangThaiSinhVienQuyDoiDiem[record?.trangThai as ETrangThaiPhieuQuyDoiDiem]}>
								{record?.trangThai ?? ''}
							</Tag>
						</Descriptions.Item>
					</Descriptions>
				</Col>
				<Col xs={24}>
					<FormItemHocPhanQuyDoi />
				</Col>
			</Row>
		</Modal>
	);
};

export default ViewPhieuQuyDoiDiem;
