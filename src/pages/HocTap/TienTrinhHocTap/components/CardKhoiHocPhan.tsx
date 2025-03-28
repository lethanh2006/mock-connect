import { type ChuongTrinhDaoTao } from '@/services/DaoTao/ChuongTrinhDaoTao/typing';
import { Modal } from 'antd';
import { useState } from 'react';
import { useModel } from 'umi';
import CardHocPhan from './CardHocPhan';

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
			<div className='col-hoc-phan' onClick={() => setVisible(true)}>
				<div className='card-hoc-phan' title={khoi?.ten}>
					<h4 className='tu_chon'>{khoi?.ten}</h4>
					<span className='tin-chi'>{soTinChi} tín chỉ</span>
					<div className='khoi-kien-thuc' style={{ borderLeftColor: colorKhoiKienThuc }} />
					<img src='/images/folder-khoi-hp.svg' className='folder-khoi' title='Khối học phần' alt='khoi-hoc-phan' />
				</div>
			</div>

			<Modal
				visible={visible}
				title={khoi?.ten ?? 'Khối học phần'}
				onCancel={() => setVisible(false)}
				width={680}
				okButtonProps={{ hidden: true }}
				cancelText='Đóng'
			>
				<span className='fw500'>Bạn phải đảm bảo học {soTinChi} tín chỉ trong số những học phần sau đây: </span>
				<div className='row-hoc-ky'>
					<div className='col-chi-tiet' style={{ flexWrap: 'wrap' }}>
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
				</div>
			</Modal>
		</>
	);
};

export default CardKhoiHocPhan;
