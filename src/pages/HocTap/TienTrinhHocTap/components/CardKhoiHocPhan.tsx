import { type ChuongTrinhDaoTao } from '@/services/DaoTao/ChuongTrinhDaoTao/typing';
import { Popover } from 'antd';
import CardHocPhan from './CardHocPhan';

const CardKhoiHocPhan = (props: { khoi?: ChuongTrinhDaoTao.IKhoiHocPhanCTDT }) => {
	const { khoi } = props;
	const soTinChi = khoi?.soTinChiTuChonPhaiHoc ?? 0;

	return (
		<Popover
			content={
				<div className='row-hoc-ky'>
					<div className='col-chi-tiet' style={{ flexWrap: 'wrap' }}>
						{khoi?.hocPhanCtdtList?.map((ctk) => (
							<CardHocPhan chuongTrinhKhung={ctk} key={ctk._id} />
						))}
					</div>
				</div>
			}
			title={`Khối ${khoi?.loaiHocPhanCtdt?.toLowerCase() ?? ''}: ${khoi?.ten ?? ''}`}
			trigger='click'
		>
			<div className='col-hoc-phan'>
				<div className='card-hoc-phan'>
					<h4 className='tu_chon'>{khoi?.ten}</h4>
					<span className='tin-chi'>{soTinChi} tín</span>
					<img src='/images/img-card-hoc-phan.svg' />
				</div>
			</div>
		</Popover>
	);
};

export default CardKhoiHocPhan;
