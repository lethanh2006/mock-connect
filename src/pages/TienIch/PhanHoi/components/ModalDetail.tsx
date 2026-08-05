import PreviewFile from '@/components/PreviewFile';
import ModalExpandable from '@/components/Table/ModalExpandable';
import { formatDateTime } from '@/utils/formatDate';
import { PaperClipOutlined } from '@ant-design/icons';
import { Button, Card, Descriptions, Tag } from 'antd';
import { useState } from 'react';
import { useIntl, useModel } from 'umi';

const ModalDetailPhanhoi = () => {
	const intl = useIntl();
	const { record, setVisibleForm } = useModel('tienich.phanhoi');
	const [visibleFormFile, setVisibleFormFile] = useState<boolean>(false);
	const [filePhanHoi, setFilePhanHoi] = useState<string[]>();

	return (
		<Card title={intl.formatMessage({ id: 'phanhoi.chitiet.title' })}>
			<Descriptions column={1}>
				<Descriptions.Item label={intl.formatMessage({ id: 'phanhoi.chitiet.noidung' })}>
					{record?.noiDungPhanHoi}
				</Descriptions.Item>
				{/* <Descriptions.Item label='Loại phản hồi'>
					{record?.loaiPhanHoi} {record?.loaiPhanHoi === ELoaiPhanHoi.DVMC ? <a>(xem chi tiết đơn)</a> : null}
				</Descriptions.Item> */}
				<Descriptions.Item label={intl.formatMessage({ id: 'phanhoi.chitiet.file' })}>
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
								{intl.formatMessage({ id: 'phanhoi.chitiet.file' })}
							</a>
						</>
					) : null}
				</Descriptions.Item>
				<Descriptions.Item label={intl.formatMessage({ id: 'phanhoi.chitiet.ngaygui' })}>
					{formatDateTime(record?.createdAt)}
				</Descriptions.Item>
				<Descriptions.Item label={intl.formatMessage({ id: 'phanhoi.chitiet.tieude' })}>
					{record?.tieuDe ?? '--'}
				</Descriptions.Item>
				<Descriptions.Item label={intl.formatMessage({ id: 'phanhoi.chitiet.chude' })}>
					{record?.tenLinhVuc ?? '--'}
				</Descriptions.Item>
				<Descriptions.Item label={intl.formatMessage({ id: 'phanhoi.chitiet.xuly' })}>
					{record?.donVi?.ten ?? record?.maDonVi}
				</Descriptions.Item>
				<Descriptions.Item label={intl.formatMessage({ id: 'phanhoi.chitiet.noidungtl' })}>
					{record?.noiDungTraLoiPhanHoi}
				</Descriptions.Item>
				<Descriptions.Item label={intl.formatMessage({ id: 'phanhoi.chitiet.nguoitl' })}>
					{record?.maChuyenVien}
				</Descriptions.Item>
				<Descriptions.Item label={intl.formatMessage({ id: 'phanhoi.chitiet.tgtraloi' })}>
					{record?.thoiGianTraLoi ? (
						formatDateTime(record.thoiGianTraLoi)
					) : (
						<Tag color='red'>{intl.formatMessage({ id: 'phanhoi.chitiet.chuatraloi' })}</Tag>
					)}
				</Descriptions.Item>
				<Descriptions.Item label={intl.formatMessage({ id: 'phanhoi.chitiet.filetraloi' })}>
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
								{intl.formatMessage({ id: 'phanhoi.chitiet.file' })}
							</a>
						</>
					) : null}
				</Descriptions.Item>
			</Descriptions>

			{filePhanHoi ? (
				<ModalExpandable
					title={intl.formatMessage({ id: 'phanhoi.chitiet.file.title' })}
					width={1000}
					open={visibleFormFile}
					footer={
						<div className='form-footer'>
							<Button onClick={() => setVisibleFormFile(false)}>
								{intl.formatMessage({ id: 'global.button.dong' })}
							</Button>
						</div>
					}
					onCancel={() => setVisibleFormFile(false)}
				>
					<PreviewFile file={filePhanHoi} isPrivate />
				</ModalExpandable>
			) : null}

			<div className='form-footer'>
				<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.dong' })}</Button>
			</div>
		</Card>
	);
};

export default ModalDetailPhanhoi;
