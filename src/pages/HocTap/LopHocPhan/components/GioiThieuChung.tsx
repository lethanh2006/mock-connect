import { Empty } from 'antd';
import { useState } from 'react';
import { useModel } from 'umi';
import './style.less';

const GioiThieuChungLopHp = () => {
	const { record } = useModel('lophocphan.lophocphan');
	const [expand, setExpand] = useState(false);

	return (
		<div style={{ minHeight: '150px' }}>
			<div className='fw500' style={{ marginBottom: '16px' }}>
				Giới thiệu môn học
			</div>

			<div
				className='gioi-thieu-chung-content'
				style={{ display: expand ? 'block' : '-webkit-box' }}
				dangerouslySetInnerHTML={{ __html: record?.gioiThieuChung ?? '' }}
			/>
			{record?.gioiThieuChung ? (
				<a onClick={() => setExpand((v) => !v)} style={{ marginTop: 8 }}>
					{expand ? 'Thu gọn' : 'Xem thêm'}
				</a>
			) : (
				<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='Chưa có thông tin' />
			)}
		</div>
	);
};

export default GioiThieuChungLopHp;
