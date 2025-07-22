import { type ChuongTrinhDaoTao } from '@/services/DaoTao/ChuongTrinhDaoTao/typing';
import { Card, Modal, Tag } from 'antd';
import { useState } from 'react';
import { useModel } from 'umi';
import CardHocPhanV2 from './CardHocPhan';

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
			<div style={{ position: 'relative', marginBottom: '4px' }}>
				<Card
					hoverable
					onClick={() => setVisible(true)}
					style={{
						borderRadius: '8px',
						position: 'relative',
						overflow: 'hidden',
						background: '#fff',
						minHeight: '120px',
						boxShadow: '0px 0px 12px 0px #0000000A',
						cursor: 'pointer',
					}}
					bodyStyle={{
						padding: '20px',
						position: 'relative',
						height: '100%',
					}}
				>
					{/* Folder icon background */}
					<div
						style={{
							position: 'absolute',
							bottom: 0,
							right: 0,
							width: '60%',
							height: '60%',
							// backgroundImage: `url(/images/folder-khoi-hp.svg)`,
							backgroundSize: 'contain',
							backgroundRepeat: 'no-repeat',
							backgroundPosition: 'bottom right',
							zIndex: 1,
						}}
					/>

					{/* Content */}
					<div style={{ position: 'relative', zIndex: 2 }}>
						{/* Course name */}
						<h4
							style={{
								fontSize: '18px',
								fontWeight: '600',
								color: '#262626',
								marginBottom: '12px',
								marginTop: '0',
								paddingRight: '60px',
								lineHeight: '1.4',
							}}
							title={khoi?.ten}
						>
							{khoi?.ten}
						</h4>

						{/* Credits */}
						<Tag
							style={{
								background: '#fff2f0',
								color: '#ff4d4f',
								border: '1px solid #ffccc7',
								padding: '1px 6px',
								fontWeight: '500',
							}}
						>
							{soTinChi} tín chỉ
						</Tag>
					</div>

					{/* Color indicator */}
					<div
						style={{
							position: 'absolute',
							left: 0,
							top: 0,
							bottom: 0,
							width: '4px',
							backgroundColor: colorKhoiKienThuc,
							borderRadius: '8px 0 0 8px',
						}}
					/>
				</Card>
			</div>

			<Modal
				visible={visible}
				title={khoi?.ten ?? 'Khối học phần'}
				onCancel={() => setVisible(false)}
				width={680}
				okButtonProps={{ hidden: true }}
				cancelText='Đóng'
			>
				<span style={{ fontWeight: 500 }}>
					Bạn phải đảm bảo học {soTinChi} tín chỉ trong số những học phần sau đây:{' '}
				</span>
				<div style={{ marginTop: '16px' }}>
					<div
						style={{
							display: 'grid',
							gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
							gap: '16px',
						}}
					>
						{khoi?.hocPhanCtdtList?.map((ctk) => (
							<CardHocPhanV2
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
				</div>
			</Modal>
		</>
	);
};

export default CardKhoiHocPhan;
