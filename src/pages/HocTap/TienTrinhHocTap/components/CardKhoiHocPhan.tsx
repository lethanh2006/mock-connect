import { accentColors, primaryColor } from '@/services/base/constant';
import { type ChuongTrinhDaoTao } from '@/services/DaoTao/ChuongTrinhDaoTao/typing';
import { Card, Empty, Modal } from 'antd';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { useIntl } from 'umi';
import CardHocPhan from './CardHocPhan';
import './CardStyles.less';

const CardKhoiHocPhan = (props: {
	khoi?: ChuongTrinhDaoTao.IKhoiHocPhanCTDT;
	colorKhoiKienThuc?: string;
	onClickHocPhan: (record: ChuongTrinhDaoTao.IKhoiHocPhanCTDT) => void;
	label?: ReactNode;
}) => {
	const intl = useIntl();
	const { khoi, onClickHocPhan, label } = props;
	const soTinChi = khoi?.soTinChiTuChonPhaiHoc ?? 0;
	const [visible, setVisible] = useState<boolean>(false);

	return (
		<>
			<div className='base-card'>
				<Card
					hoverable
					onClick={() => setVisible(true)}
					style={{
						backgroundColor: accentColors.accent800 ?? '#f8f8f8',
						border: `1px solid ${accentColors.accent600 ?? '#D2D3D5'}`,
					}}
				>
					{/* Content */}
					<div className='card-content'>
						{/* Course name */}
						{label && <span className='card-label'>{label}</span>}
						<h4
							className='card-title default'
							style={{ color: primaryColor ?? '#134D8B', textDecoration: 'underline' }}
							title={khoi?.ten}
						>
							{khoi?.ten}
						</h4>

						{/* Credits & Electives */}
						<div className='card-footer'>
							<span className='card-credits-text'>
								{soTinChi} {intl.formatMessage({ id: 'tientrinhhoctap.tinchi' })}
							</span>
							<div className='card-footer-right'>
								<span className='card-electives-text' style={{ color: primaryColor ?? '#134D8B' }}></span>
							</div>
						</div>
					</div>

					{/* Color indicator */}
					{/* <div className='color-indicator' style={{ backgroundColor: colorKhoiKienThuc }} /> */}
				</Card>
			</div>

			<Modal
				open={visible}
				title={khoi?.ten ?? intl.formatMessage({ id: 'tientrinhhoctap.ctdt.khoihp' })}
				onCancel={() => setVisible(false)}
				width={850}
				okButtonProps={{ hidden: true }}
				cancelText={intl.formatMessage({ id: 'global.button.dong' })}
				className='khoi-modal'
			>
				<span className='modal-description'>
					{intl.formatMessage({ id: 'tientrinhhoctap.ctdt.noti' }, { soTinChi })}:{' '}
				</span>

				<div className='modal-grid'>
					{(khoi?.hocPhanCtdtList ?? []).map((ctk) => (
						<CardHocPhan
							key={ctk._id}
							hocPhan={ctk.hocPhan ?? undefined}
							// colorKhoiKienThuc={colorKhoiKienThuc}
							onClick={() => {
								if (!khoi) return;
								// Truyền tên khối tự chọn vào các khối học phần chương trình
								const selectedRecord = { ...khoi, ...ctk, ten: khoi.ten } as ChuongTrinhDaoTao.IKhoiHocPhanCTDT;
								setVisible(false);
								onClickHocPhan(selectedRecord);
							}}
							trangThaiHoc={ctk.hoc}
							listDiem={ctk.lichSuDiem}
							label={label}
						/>
					))}
					{!khoi?.hocPhanCtdtList?.length && (
						<div style={{ gridColumn: '1 / -1', width: '100%' }}>
							<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
						</div>
					)}
				</div>
			</Modal>
		</>
	);
};

export default CardKhoiHocPhan;
