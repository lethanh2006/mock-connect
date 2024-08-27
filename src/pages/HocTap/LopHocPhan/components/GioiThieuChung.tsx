import { useState } from 'react';
import { useModel } from 'umi';

const GioiThieuChungLopHp = () => {
	const { record } = useModel('lophocphan.lophocphan');
	const [expand, setExpand] = useState(false);

	return (
		<div>
			<div className='fw500' style={{ marginBottom: 5 }}>
				Giới thiệu chung:
			</div>

			<div
				style={expand ? undefined : { maxHeight: 80, overflow: 'hidden' }}
				dangerouslySetInnerHTML={{ __html: record?.gioiThieuChung ?? '' }}
			/>
			{record?.gioiThieuChung ? (
				<a onClick={() => setExpand((v) => !v)} style={{ marginTop: 8 }}>
					{expand ? 'Thu gọn' : 'Xem thêm'}
				</a>
			) : null}
		</div>
	);
};

export default GioiThieuChungLopHp;
