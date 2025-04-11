import { primaryColor } from '@/services/base/constant';
import { Button, Descriptions, Modal, Tag } from 'antd';
import { useModel } from 'umi';
import TableDeTaiQuyetDinh from './DeTaiQuyetDinh';
import { useState } from 'react';
import PreviewFile from '@/components/PreviewFile';

const ViewQuyetDinh = () => {
	const { record, visibleViewDetail, setVisibleViewDetail } = useModel('khoahoc.quyetdinhgiao');
	const [visibleFormFile, setVisibleFormFile] = useState<boolean>(false);

	const handleCancel = () => {
		setVisibleViewDetail(false);
	};

	return (
		<Modal
			width={900}
			title='Chi tiết quyết định giao'
			visible={visibleViewDetail}
			onCancel={handleCancel}
			footer={
				<Button type='primary' onClick={handleCancel}>
					OK
				</Button>
			}
		>
			<Descriptions column={{ xs: 3, sm: 3, md: 6, xl: 6, xxl: 6 }}>
				<Descriptions.Item span={6} label='Tên quyết định'>
					{record?.ten}
				</Descriptions.Item>
				<Descriptions.Item span={3} label='Số quyết định'>
					{record?.so}
				</Descriptions.Item>
				<Descriptions.Item span={3} label='File đính kèm'>
					{record?.urlQuyetDinhGiao && (
						<a onClick={() => setVisibleFormFile(true)}>
							<Tag color={primaryColor}>Xem tập tin</Tag>
						</a>
					)}
				</Descriptions.Item>
			</Descriptions>
			<div>
				<b>Danh sách đề tài</b>
			</div>
			<TableDeTaiQuyetDinh mode='view' data={record?.danhSachDeTai ?? []} />

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
				<PreviewFile file={record?.urlQuyetDinhGiao ?? ''} />
			</Modal>
		</Modal>
	);
};

export default ViewQuyetDinh;
