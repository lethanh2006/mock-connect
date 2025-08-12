import { type ChuongTrinhDaoTao } from '@/services/DaoTao/ChuongTrinhDaoTao/typing';
import { Card, Modal, Tag } from 'antd';
import { useState } from 'react';
import { useModel } from 'umi';
import CardHocPhan from './CardHocPhan';
import './CardStyles.less';

const CardKhoiHocPhan = (props: {
	khoi?: ChuongTrinhDaoTao.IKhoiHocPhanCTDT;
	colorKhoiKienThuc?: string;
	onClickHocPhan: () => void;
}) => {
	const { khoi, colorKhoiKienThuc, onClickHocPhan } = props;
	const { setRecord: setChuongTrinh } = useModel('daotao.chuongtrinhdaotao');
	const soTinChi = khoi?.soTinChiTuChonPhaiHoc ?? 0;
	const [visible, setVisible] = useState<boolean>(false);

	return (
		<>
			<div className='base-card'>
				<Card hoverable onClick={() => setVisible(true)}>
					{/* Folder icon background */}
					<div className='card-background-image' />

					{/* Content */}
					<div className='card-content'>
						{/* Course name */}
						<h4 className='card-title default' title={khoi?.ten}>
							{khoi?.ten}
						</h4>

						{/* Credits */}
						<Tag className='credits-tag'>{soTinChi} tín chỉ</Tag>
					</div>

					{/* Color indicator */}
					<div className='color-indicator' style={{ backgroundColor: colorKhoiKienThuc }} />
				</Card>
			</div>

			<Modal
				visible={visible}
				title={khoi?.ten ?? 'Khối học phần'}
				onCancel={() => setVisible(false)}
				width={680}
				okButtonProps={{ hidden: true }}
				cancelText='Đóng'
				className='khoi-modal'
			>
				<span className='modal-description'>
					Bạn phải đảm bảo học {soTinChi} tín chỉ trong số những học phần sau đây:{' '}
				</span>

				<div className='modal-grid'>
					{khoi?.hocPhanCtdtList?.map((ctk) => (
						<CardHocPhan
							key={ctk._id}
							hocPhan={ctk.hocPhan}
							colorKhoiKienThuc={colorKhoiKienThuc}
							onClick={() => {
								// Truyền tên khối tự chọn vào các khối học phần chương trình
								setChuongTrinh({ ...khoi, ...ctk, ten: khoi.ten });
								setVisible(false);
								if (onClickHocPhan) onClickHocPhan();
							}}
							trangThaiHoc={ctk.hoc}
							listDiem={ctk.lichSuDiem}
						/>
					))}
				</div>
			</Modal>
		</>
	);
};

export default CardKhoiHocPhan;
