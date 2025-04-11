import PreviewFile from '@/components/PreviewFile';
import { PaperClipOutlined } from '@ant-design/icons';
import { Button, Card, Descriptions, Modal, Tag } from 'antd';
import moment from 'moment';
import { useState } from 'react';
import { useModel } from 'umi';

const ModalDetailPhanhoi = () => {
	const { record, setVisibleForm } = useModel('tienich.phanhoi');
	const [visibleFormFile, setVisibleFormFile] = useState<boolean>(false);

	return (
		<Card title='Chi tiết phản hồi'>
			<Descriptions column={1}>
				<Descriptions.Item label='Nội dung phản hồi'>{record?.noiDungPhanHoi}</Descriptions.Item>
				{/* <Descriptions.Item label='Loại phản hồi'>
					{record?.loaiPhanHoi} {record?.loaiPhanHoi === ELoaiPhanHoi.DVMC ? <a>(xem chi tiết đơn)</a> : null}
				</Descriptions.Item> */}
				<Descriptions.Item label='File đính kèm'>
					{record?.urlPhanAnh ? (
						<>
							<PaperClipOutlined /> <a onClick={() => setVisibleFormFile(true)}>File đính kèm</a>
						</>
					) : (
						<i>Không có</i>
					)}
				</Descriptions.Item>
				<Descriptions.Item label='Ngày gửi'>{moment(record?.createdAt).format('HH:mm DD/MM/YYYY')}</Descriptions.Item>

				<Descriptions.Item label='Tiêu đề'>{record?.tieuDe ?? '--'}</Descriptions.Item>
				<Descriptions.Item label='Chủ đề'>{record?.tenLinhVuc ?? '--'}</Descriptions.Item>
				<Descriptions.Item label='Bộ phận xử lý'>{record?.donVi?.ten ?? record?.maDonVi}</Descriptions.Item>
				<Descriptions.Item label='Nội dung trả lời'>{record?.noiDungTraLoiPhanHoi}</Descriptions.Item>
				<Descriptions.Item label='Người trả lời'>{record?.maChuyenVien}</Descriptions.Item>
				<Descriptions.Item label='Thời gian trả lời'>
					{record?.thoiGianTraLoi ? (
						moment(record.thoiGianTraLoi).format('HH:mm DD/MM/YYYY')
					) : (
						<Tag color='red'>Chưa trả lời</Tag>
					)}
				</Descriptions.Item>
			</Descriptions>

			<Modal
				title='Chi tiết tập tin'
				width={800}
				visible={visibleFormFile}
				footer={
					<div className='form-footer'>
						<Button onClick={() => setVisibleFormFile(false)}>Đóng</Button>
					</div>
				}
				onCancel={() => setVisibleFormFile(false)}
			>
				<PreviewFile file={record?.urlPhanAnh ?? ''} />
			</Modal>

			<div className='form-footer'>
				<Button onClick={() => setVisibleForm(false)}>Đóng</Button>
			</div>
		</Card>
	);
};

export default ModalDetailPhanhoi;
