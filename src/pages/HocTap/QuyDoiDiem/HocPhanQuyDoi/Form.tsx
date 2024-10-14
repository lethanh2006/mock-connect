import { ColorDiemChu, type ELoaiDiemChu } from '@/services/HocTap/LopHocPhan/constant';
import type { QuyDoiDiem } from '@/services/HocTap/QuyDoiDiem/typing';
import { EMinhChungQuyDoiDiem, colorTrangThaiHocPhanQuyDoi } from '@/services/HocTap/constant';
import { Button, Descriptions, Row, Space, Tag } from 'antd';
import monent from 'moment';
import { useEffect } from 'react';
import { useModel } from 'umi';

const FormHocPhanQuyDoiDiem = () => {
	const { visibleForm, setVisibleForm, record, setRecord } = useModel('daotao.quydoidiem.sinhvienquydoidiem');

	useEffect(() => {
		if (!visibleForm) setRecord({} as QuyDoiDiem.IQuyDoiDiemSinhVien);
	}, [visibleForm]);

	const renderDiem = (he10?: number, he4?: number, diemChu?: ELoaiDiemChu) => (
		<Space wrap>
			{he10 ? (
				<span>
					Điểm hệ 10: <b>{he10 ?? ''}</b>
				</span>
			) : null}
			{he4 ? (
				<span>
					Điểm hệ 4: <b>{he4}</b>
				</span>
			) : null}
			<span>
				Điểm chữ: <b style={diemChu ? { color: ColorDiemChu[diemChu] } : undefined}>{diemChu}</b>
			</span>
		</Space>
	);
	return (
		<>
			<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
				<Descriptions column={1}>
					<Descriptions.Item label='Học phần xin công nhận'>
						{record?.hocPhan?.ten ?? ''} ({record?.maHocPhan ?? ''} - {record?.hocPhan?.soTinChi ?? ''} tín chỉ)
					</Descriptions.Item>
					<Descriptions.Item label='Kết quả quy đổi'>
						{renderDiem(record?.diemHe10, record?.diemHe4, record?.diemChu)}
					</Descriptions.Item>
					<Descriptions.Item label='Khuyến nghị'>
						{(
							<div
								dangerouslySetInnerHTML={{
									__html: `${record?.khuyenNghi?.map((items) => items).join(', ')}`,
								}}
							/>
						) ?? '--'}
					</Descriptions.Item>
					<Descriptions.Item label='Trạng thái'>
						{record?.trangThai ? (
							<Tag color={colorTrangThaiHocPhanQuyDoi[record?.trangThai]}>{record?.trangThai}</Tag>
						) : null}
					</Descriptions.Item>

					{record?.loai === EMinhChungQuyDoiDiem.CHUNG_CHI ? (
						<Descriptions.Item label='Thông tin chứng chỉ'>
							<div>
								- Tên chứng chỉ: <b>{record?.tenChungChi ?? ''}</b>
								<br />- Điểm/bậc chứng chỉ: <b>{record?.bacChungChi ?? ''}</b>
								<br />- Đơn vị cấp: <b>{record?.donViCap ?? ''}</b>
								<br />- Thời gian hiệu lực:{' '}
								<b>{record?.thoiGianHieuLuc ? monent(record?.thoiGianHieuLuc).format('DD/MM/YYYY') : '--'}</b>
							</div>
						</Descriptions.Item>
					) : record?.loai === EMinhChungQuyDoiDiem.NCKH ? (
						<Descriptions.Item label='Thông tin NCKH'>
							<div>
								- Tên đề tài: <b>{record?.tenDeTaiNckh ?? ''}</b>
								<br />- Người hướng dẫn: <b>{record?.nguoiHuongDanNckh ?? ''}</b>
								<br />- Điểm NCKH: <b>{record?.diemNckh ?? ''}</b>
							</div>
						</Descriptions.Item>
					) : (
						<Descriptions.Item label='Thông tin học phần đã học'>
							<div>
								- Tên học phần: {record?.tenHocPhan ? <b>{record.tenHocPhan}</b> : <i>Không có tên học phần</i>} (
								{record?.maHocPhanMinhChung} - {record?.soTinChi} tín chỉ)
								<br />- Học tại trường: <b>{record?.tenTruong ?? ''}</b>. Trình độ: <b>{record?.trinhDoDaoTao ?? ''}</b>
								. Ngành học: <b>{record?.nganh ?? ''}</b>. Năm tốt nghiệp: <b>{record?.namTotNghiep ?? ''}</b>
								<br />- Kết quả học tập:{' '}
								{renderDiem(record?.diemHe10MinhChung, record?.diemHe4MinhChung, record?.diemChuMinhChung)}
							</div>
						</Descriptions.Item>
					)}

					<Descriptions.Item label='Ghi chú'>{record?.ghiChu ?? '--'}</Descriptions.Item>
				</Descriptions>
			</Row>

			<div className='form-footer'>
				<Button onClick={() => setVisibleForm(false)}>Đóng</Button>
			</div>
		</>
	);
};

export default FormHocPhanQuyDoiDiem;
