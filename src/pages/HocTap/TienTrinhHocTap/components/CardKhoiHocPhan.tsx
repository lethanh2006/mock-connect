import ModalExpandable from '@/components/Table/ModalExpandable';
import { type ChuongTrinhDaoTao } from '@/services/DaoTao/ChuongTrinhDaoTao/typing';
import { Card, Modal } from 'antd';
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
	const hasDanhSachHocPhan = !!khoi?.hocPhanCtdtList?.length;
	const title = khoi?.ten ?? intl.formatMessage({ id: 'tientrinhhoctap.ctdt.khoihp' });

	const handleClickKhoi = () => {
		if (hasDanhSachHocPhan) {
			setVisible(true);
			return;
		}

		Modal.confirm({
			className: 'khoi-confirm-modal',
			title,
			content: intl.formatMessage({ id: 'tientrinhhoctap.ctdt.noti.ngoaiChuongTrinh' }, { soTinChi }),
			okText: intl.formatMessage({ id: 'global.button.dong' }),
			cancelButtonProps: { hidden: true },
		});
	};

	return (
		<>
			<div className='degree-audit-card'>
				<Card
					hoverable
					onClick={handleClickKhoi}
					style={{
						height: '100%',
						backgroundColor: 'var(--ds-bg-tiled-sm)',
						borderColor: 'var(--ds-line-primary)',
					}}
					styles={{ body: { height: '100%', padding: 16 } }}
				>
					{/* Content */}
					<div className='card-content'>
						{/* Course name */}
						{label && <span className='card-label'>{label}</span>}
						<h4 className='card-title default' style={{ color: 'var(--ds-function-link)' }} title={khoi?.ten}>
							{khoi?.ten}
						</h4>

						{/* Credits & Electives */}
						<div className='card-footer'>
							<span className='card-credits-text'>
								{soTinChi} {intl.formatMessage({ id: 'tientrinhhoctap.tinchi' })}
							</span>
						</div>
					</div>

					{/* Color indicator */}
					{/* <div className='color-indicator' style={{ backgroundColor: colorKhoiKienThuc }} /> */}
				</Card>
			</div>

			{visible && (
				<ModalExpandable
					open={visible}
					title={title}
					onCancel={() => setVisible(false)}
					width={850}
					okButtonProps={{ hidden: true }}
					cancelText={intl.formatMessage({ id: 'global.button.dong' })}
					className='khoi-modal'
				>
					<span className='modal-description'>
						{intl.formatMessage({ id: 'tientrinhhoctap.ctdt.noti.trongChuongTrinh' }, { soTinChi })}:{' '}
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
					</div>
				</ModalExpandable>
			)}
		</>
	);
};

export default CardKhoiHocPhan;
