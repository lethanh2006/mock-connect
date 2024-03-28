import type { QuyDoiDiem } from '@/services/HocTap/QuyDoiDiem/typing';
import {
	EMinhChungQuyDoiDiem,
	colorTrangThaiHocPhanQuyDoi,
	type ETrangThaiHocPhanQuyDoi,
} from '@/services/HocTap/constant';
import { Button, Descriptions, Row, Tag } from 'antd';
import monent from 'moment';
import { useEffect } from 'react';
import { useModel } from 'umi';

const FormHocPhanQuyDoiDiem = () => {
	const { visibleForm, setVisibleForm, record, setRecord } = useModel('daotao.quydoidiem.sinhvienquydoidiem');

	useEffect(() => {
		if (!visibleForm) setRecord({} as QuyDoiDiem.IQuyDoiDiemSinhVien);
	}, [visibleForm]);

	return (
		<>
			<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
				<Descriptions column={1}>
					<Descriptions.Item label='Học phần xin công nhận'>
						{record?.hocPhan?.ten ?? ''} ({record?.maHocPhan ?? ''} - {record?.hocPhan?.soTinChi ?? ''} tín chỉ)
					</Descriptions.Item>
					<Descriptions.Item label='Kế quả quy đổi'>
						Điểm hệ 10: {record?.diemHe10 ?? ''} {record?.diemHe4 ? <>, điểm hệ 4: {record?.diemHe4}</> : ''}{' '}
						{record?.diemChu ? <>, điểm chữ: {record?.diemChu}</> : ''}
					</Descriptions.Item>
					<Descriptions.Item label='Trạng thái'>
						<Tag color={colorTrangThaiHocPhanQuyDoi[record?.trangThai as ETrangThaiHocPhanQuyDoi]}>
							{record?.trangThai ?? ''}
						</Tag>
					</Descriptions.Item>
					<Descriptions.Item label='Minh chứng'>
						{record?.loai === EMinhChungQuyDoiDiem.CHUNG_CHI ? (
							<div>
								- Tên chứng chỉ: <b>{record?.tenChungChi ?? ''}</b>
								<br />- Điểm/bậc chứng chỉ: <b>{record?.bacChungChi ?? ''}</b>
								<br />- Đơn vị cấp: <b>{record?.donViCap ?? ''}</b>
								<br />- Thời gian hiệu lực:
								<b>{record?.thoiGianHieuLuc && monent(record?.thoiGianHieuLuc).format('DD/MM/YYYY')}</b>
								<br />- Thời gian hết hiệu lực:{' '}
								<b>{record?.thoiGianHetHieuLuc && monent(record?.thoiGianHetHieuLuc).format('DD/MM/YYYY')}</b>
							</div>
						) : (
							<div>
								- Tên học phần:{' '}
								<b>
									{record?.tenHocPhan} ({record?.maHocPhan} - {record?.soTinChi} tín chỉ)
								</b>
								<br />- Trình độ: <b>{record?.trinhDoDaoTao ?? ''}</b>
								<br />- Trường đã học: <b>{record?.tenTruong ?? ''}</b>
								<br />- Kết quả học tập:{' '}
							</div>
						)}
					</Descriptions.Item>
				</Descriptions>
			</Row>

			<div className='form-footer'>
				<Button onClick={() => setVisibleForm(false)}>Hủy</Button>
			</div>
		</>
	);
};

export default FormHocPhanQuyDoiDiem;
