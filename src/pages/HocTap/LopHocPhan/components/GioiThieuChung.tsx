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
				style={
					expand
						? undefined
						: {
								display: '-webkit-box',
								lineClamp: 3,
								overflow: 'hidden',
								textOverflow: 'ellipsis',
								overflowWrap: 'anywhere',
						  }
				}
				dangerouslySetInnerHTML={{ __html: record?.gioiThieuChung ?? '' }}
			/>
			{record?.gioiThieuChung && !expand ? (
				<a onClick={() => setExpand(true)} style={{ marginTop: 8 }}>
					Xem tiếp
				</a>
			) : null}
		</div>
	);
};

export default GioiThieuChungLopHp;
