import PreviewFile from '@/components/PreviewFile';
import ModalExpandable from '@/components/Table/ModalExpandable';
import dayjs from '@/utils/dayjs';
import { PaperClipOutlined } from '@ant-design/icons';
import { Button, Card, Descriptions, Tag } from 'antd';
import { useState } from 'react';
import { useModel } from 'umi';

const ModalDetailPhanhoi = () => {
	const { record, setVisibleForm } = useModel('tienich.phanhoi');
	const [visibleFormFile, setVisibleFormFile] = useState<boolean>(false);
	const [filePhanHoi, setFilePhanHoi] = useState<string[]>();

	return (
		<Card title='Chi tiết phản hồi'>
			<Descriptions column={1}>
				<Descriptions.Item label='Nội dung phản hồi'>{record?.noiDungPhanHoi}</Descriptions.Item>
				{/* <Descriptions.Item label='Loại phản hồi'>
					{record?.loaiPhanHoi} {record?.loaiPhanHoi === ELoaiPhanHoi.DVMC ? <a>(xem chi tiết đơn)</a> : null}
				</Descriptions.Item> */}
				<Descriptions.Item label='File đính kèm'>
					{(Array.isArray(record?.urlPhanAnh) ? record.urlPhanAnh : [record?.urlPhanAnh]).filter(Boolean).length ? (
						<>
							<PaperClipOutlined />{' '}
							<a
								onClick={() => {
									const files = Array.isArray(record?.urlPhanAnh)
										? record.urlPhanAnh
										: record?.urlPhanAnh
											? [record.urlPhanAnh]
											: [];
									setFilePhanHoi(files);
									setVisibleFormFile(true);
								}}
							>
								File đính kèm
							</a>
						</>
					) : null}
				</Descriptions.Item>
				<Descriptions.Item label='Ngày gửi'>{dayjs(record?.createdAt).format('HH:mm DD/MM/YYYY')}</Descriptions.Item>
				<Descriptions.Item label='Tiêu đề'>{record?.tieuDe ?? '--'}</Descriptions.Item>
				<Descriptions.Item label='Chủ đề'>{record?.tenLinhVuc ?? '--'}</Descriptions.Item>
				<Descriptions.Item label='Bộ phận xử lý'>{record?.donVi?.ten ?? record?.maDonVi}</Descriptions.Item>
				<Descriptions.Item label='Nội dung trả lời'>{record?.noiDungTraLoiPhanHoi}</Descriptions.Item>
				<Descriptions.Item label='Người trả lời'>{record?.maChuyenVien}</Descriptions.Item>
				<Descriptions.Item label='Thời gian trả lời'>
					{record?.thoiGianTraLoi ? (
						dayjs(record.thoiGianTraLoi).format('HH:mm DD/MM/YYYY')
					) : (
						<Tag color='red'>Chưa trả lời</Tag>
					)}
				</Descriptions.Item>
				<Descriptions.Item label='File đính kèm trả lời'>
					{(Array.isArray(record?.urlChuyenVienPhanAnh)
						? record.urlChuyenVienPhanAnh
						: [record?.urlChuyenVienPhanAnh]
					).filter(Boolean).length ? (
						<>
							<PaperClipOutlined />{' '}
							<a
								onClick={() => {
									const files = Array.isArray(record?.urlChuyenVienPhanAnh)
										? record.urlChuyenVienPhanAnh
										: record?.urlChuyenVienPhanAnh
											? [record.urlChuyenVienPhanAnh]
											: [];
									setFilePhanHoi(files);
									setVisibleFormFile(true);
								}}
							>
								File đính kèm
							</a>
						</>
					) : null}
				</Descriptions.Item>
			</Descriptions>

			{filePhanHoi ? (
				<ModalExpandable
					title='Chi tiết file đính kèm'
					width={1000}
					open={visibleFormFile}
					footer={
						<div className='form-footer'>
							<Button onClick={() => setVisibleFormFile(false)}>Đóng</Button>
						</div>
					}
					onCancel={() => setVisibleFormFile(false)}
				>
					<PreviewFile file={filePhanHoi} />
				</ModalExpandable>
			) : null}

			<div className='form-footer'>
				<Button onClick={() => setVisibleForm(false)}>Đóng</Button>
			</div>
		</Card>
	);
};

export default ModalDetailPhanhoi;
