import { ELoaiHocPhanCTDT } from '@/services/DaoTao/constant';
import { type ChuongTrinhDaoTao } from '@/services/DaoTao/ChuongTrinhDaoTao/typing';
import { BookOutlined } from '@ant-design/icons';
import { Card, Modal, Tag, Tooltip } from 'antd';
import { useState } from 'react';
import { useIntl, useModel } from 'umi';
import CardHocPhan from './CardHocPhan';
import './CardStyles.less';

const CardKhoiHocPhan = (props: {
	khoi?: ChuongTrinhDaoTao.IKhoiHocPhanCTDT;
	colorKhoiKienThuc?: string;
	onClickHocPhan: () => void;
}) => {
	const intl = useIntl();
	const { khoi, colorKhoiKienThuc, onClickHocPhan } = props;
	const { setRecord: setChuongTrinh } = useModel('daotao.chuongtrinhdaotao');
	const soTinChi = khoi?.soTinChiTuChonPhaiHoc ?? 0;
	const [visible, setVisible] = useState<boolean>(false);

	const renderCard = () => (
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
				<Tag className='credits-tag'>
					{soTinChi} {intl.formatMessage({ id: 'tientrinhhoctap.ctdt.tinchi' })}
					{khoi?.loaiHocPhanCtdt === ELoaiHocPhanCTDT.TU_CHON && (
						<Tooltip title={intl.formatMessage({ id: 'tientrinhhoctap.ctdt.hptuchon' })}>
							<BookOutlined style={{ color: 'var(--color-info)', marginLeft: 4, fontSize: '10px' }} />
						</Tooltip>
					)}
				</Tag>
			</div>

			{/* Color indicator */}
			<div className='color-indicator' style={{ backgroundColor: colorKhoiKienThuc }} />
		</Card>
	);

	return (
		<>
			<div className='base-card'>{renderCard()}</div>

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
					{khoi?.hocPhanCtdtList?.map((ctk) => (
						<CardHocPhan
							key={ctk._id}
							hocPhan={ctk.hocPhan}
							onClick={() => {
								// Truyền tên khối tự chọn vào các khối học phần chương trình
								setChuongTrinh({ ...khoi, ...ctk, ten: khoi.ten });
								setVisible(false);
								if (onClickHocPhan) onClickHocPhan();
							}}
							trangThaiHoc={ctk.hoc}
							listDiem={ctk.lichSuDiem}
							loaiHocPhan={ELoaiHocPhanCTDT.TU_CHON}
						/>
					))}
				</div>
			</Modal>
		</>
	);
};

export default CardKhoiHocPhan;
