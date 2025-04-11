import { colorTrangThaiSinhVienQuyDoiDiem, type ETrangThaiPhieuQuyDoiDiem } from '@/services/HocTap/constant';
import { Button, Carousel, Col, Descriptions, Modal, Row, Space, Tag } from 'antd';
import { useModel } from 'umi';
import FormItemHocPhanQuyDoi from '../HocPhanQuyDoi/FormItemHocPhanQuyDoi';
import moment from 'moment';
import { useState } from 'react';
import PreviewFile from '@/components/PreviewFile';

const ViewPhieuQuyDoiDiem = (props: { visible: boolean; setVisible: (val: boolean) => void }) => {
	const { visible, setVisible } = props;
	const { record } = useModel('daotao.quydoidiem.phieuquydoidiem');
	const [visibleFormFile, setVisibleFormFile] = useState<boolean>(false);

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
								{record?.urlsMinhChung?.length ? <a onClick={() => setVisibleFormFile(true)}>Xem tệp tin</a> : null}
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

			<div className='form-footer'>
				<Button onClick={() => setVisible(false)}>Đóng</Button>
			</div>

			<Modal
				title='Chi tiết minh chứng'
				width={800}
				visible={visibleFormFile}
				footer={
					<div className='form-footer'>
						<Button onClick={() => setVisibleFormFile(false)}>Đóng</Button>
					</div>
				}
				onCancel={() => setVisibleFormFile(false)}
			>
				<Carousel autoplay pauseOnDotsHover>
					{record?.urlsMinhChung?.map((item) => (
						// eslint-disable-next-line react/jsx-key
						<PreviewFile file={item ?? ''} />
					))}
				</Carousel>
			</Modal>
		</Modal>
	);
};

export default ViewPhieuQuyDoiDiem;
