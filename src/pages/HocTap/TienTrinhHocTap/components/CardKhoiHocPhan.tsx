import { type ChuongTrinhDaoTao } from '@/services/DaoTao/ChuongTrinhDaoTao/typing';
import { Modal } from 'antd';
import { useState } from 'react';
import CardHocPhan from './CardHocPhan';

const CardKhoiHocPhan = (props: { khoi?: ChuongTrinhDaoTao.IKhoiHocPhanCTDT; colorKhoiKienThuc?: string }) => {
	const { khoi, colorKhoiKienThuc } = props;
	const soTinChi = khoi?.soTinChiTuChonPhaiHoc ?? 0;
	const [visible, setVisible] = useState<boolean>(false);

	return (
		<>
			<div className='col-hoc-phan' onClick={() => setVisible(true)}>
				<div className='card-hoc-phan'>
					<h4 className='tu_chon'>{khoi?.ten}</h4>
					<span className='tin-chi'>{soTinChi} tín chỉ</span>
					<div className='khoi-kien-thuc' style={{ borderLeftColor: colorKhoiKienThuc }} />
					{/* <img src='/images/img-card-hoc-phan.svg' /> */}
				</div>
			</div>

			<Modal
				visible={visible}
				title={`Khối ${khoi?.loaiHocPhanCtdt?.toLowerCase() ?? ''}: ${khoi?.ten ?? ''}`}
				onCancel={() => setVisible(false)}
				width={680}
				okButtonProps={{ hidden: true }}
				cancelText='Đóng'
			>
				<i className='fw500'>Bạn phải đảm bảo học {soTinChi} tín chỉ trong số những học phần sau đây: </i>
				<div className='row-hoc-ky'>
					<div className='col-chi-tiet' style={{ flexWrap: 'wrap' }}>
						{khoi?.hocPhanCtdtList?.map((ctk) => (
							<CardHocPhan
								chuongTrinhKhung={ctk}
								khoiHocPhanCt={khoi}
								key={ctk._id}
								colorKhoiKienThuc={colorKhoiKienThuc}
							/>
						))}
					</div>
				</div>
			</Modal>
		</>
	);
};

export default CardKhoiHocPhan;
