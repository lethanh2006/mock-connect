import DiemThiHocKy from '@/pages/KhaoThi/KyThi/DiemThiHocKy';
import { ColorDiemChu } from '@/services/HocTap/LopHocPhan/constant';
import { type LopHocPhan } from '@/services/HocTap/LopHocPhan/typings';
import { ETrangThaiThi } from '@/services/HocTap/constant';
import { ArrowRightOutlined } from '@ant-design/icons';
import { Button, Descriptions, Divider, Empty, Spin, Tag, Tooltip } from 'antd';
import { useEffect, useState } from 'react';
import { Link, useModel } from 'umi';

const DetailKetQuaHocTap = (props: {
	lopHocPhanId?: string;
	diemHpSvHk?: LopHocPhan.IDiemHpSvHk;
	toDanhGiaGiangVien?: () => void;
}) => {
	const { lopHocPhanId, diemHpSvHk, toDanhGiaGiangVien } = props;
	const { danhSach: danhSachDauDiem, getModel } = useModel('daotao.daudiemhocphan');
	const { sinhVienGetDiemLHPModel, record: recSinhVienLhp, loading } = useModel('lophocphan.sinhvienlophocphan');
	const [hienThiDiemThi, setHienThiDiemThi] = useState<boolean>(false);

	const recDiem = diemHpSvHk ?? recSinhVienLhp?.diemHpSvHk;
	const hasTrongSo = !!recDiem?.trongSo1;
	// Đầu điểm học phần theo đề cương
	const dauDiemCoTrongSo = danhSachDauDiem.filter(
		(item) =>
			!hasTrongSo || // Đề cương học phần học kỳ này ko có trọng số
			recDiem?.[`trongSo${item.field}` as keyof LopHocPhan.IDiemHpSvHk],
	);

	useEffect(() => {
		if (!danhSachDauDiem.length) getModel();
	}, []);

	useEffect(() => {
		if (lopHocPhanId && !diemHpSvHk) sinhVienGetDiemLHPModel(lopHocPhanId);
	}, [lopHocPhanId]);

	return (
		<Spin spinning={loading}>
			{recDiem ? (
				recDiem.daDanhGiaGiangVien !== false ? (
					<>
						<Divider>Điểm thành phần & Điểm thi</Divider>
						<Descriptions bordered>
							{dauDiemCoTrongSo?.map((item) => (
								<Descriptions.Item
									label={`${item.ten}${
										hasTrongSo ? ` (${recDiem?.[`trongSo${item.field}` as keyof LopHocPhan.IDiemHpSvHk]}%)` : ''
									}`}
									key={item._id}
								>
									{recDiem?.[`diemThanhPhan${item.field}` as keyof LopHocPhan.IDiemHpSvHk] ?? '--'}
								</Descriptions.Item>
							))}
							{/* <Descriptions.Item label='ĐKDT'>
								<span style={{ color: recDiem?.trangThaiThi === ETrangThaiThi.CAM_THI ? 'red' : undefined }}>
									{recDiem?.trangThaiThi ?? '--'}
								</span>
							</Descriptions.Item> */}
							<Descriptions.Item label='Điểm thi'>{recDiem?.diemThi1 ?? '--'}</Descriptions.Item>
							{/* <Descriptions.Item label='Điểm thẩm định'>{recDiem?.diemThamDinh ?? '--'}</Descriptions.Item>
						<Descriptions.Item label='Điểm phúc khảo'>{recDiem?.diemPhucKhao ?? '--'}</Descriptions.Item> */}
							{recDiem?.diemThi2 ? (
								<>
									<Descriptions.Item label='Điểm thi lần 2'>{recDiem?.diemThi2 ?? '--'}</Descriptions.Item>
									<Descriptions.Item label='Điểm cuối'>{recDiem?.diemKthp ?? '--'}</Descriptions.Item>
								</>
							) : null}
						</Descriptions>

						{recDiem.diemKthp !== undefined ? (
							<div style={{ marginTop: 8 }}>
								<a onClick={() => setHienThiDiemThi(true)}>Xem chi tiết điểm thi</a>
								{hienThiDiemThi && <DiemThiHocKy maHocKy={recDiem?.maHocKy} maHocPhan={recDiem?.maHocPhan} />}
							</div>
						) : null}

						<Divider>Điểm tổng kết</Divider>
						<Descriptions bordered>
							<Descriptions.Item label='Điểm hệ 10'>{recDiem?.diemTongKet ?? '--'}</Descriptions.Item>
							<Descriptions.Item label='Điểm hệ 4'>{recDiem?.diemThang4 ?? '--'}</Descriptions.Item>
							<Descriptions.Item label='Điểm chữ'>
								{recDiem?.diemChu ? <Tag color={ColorDiemChu[recDiem?.diemChu]}>{recDiem?.diemChu}</Tag> : null}{' '}
								{recDiem?.isCongNhanQuyDoiDiem && <Tooltip title='Điểm quy đổi'>(R)</Tooltip>}
							</Descriptions.Item>
						</Descriptions>
					</>
				) : (
					<Empty
						description={
							<>
								Vui lòng Đánh giá giảng viên trước khi xem điểm học phần
								{toDanhGiaGiangVien ? (
									<div style={{ marginTop: 12 }}>
										<Button type='link' onClick={() => toDanhGiaGiangVien()}>
											Đánh giá ngay <ArrowRightOutlined />
										</Button>
									</div>
								) : null}
							</>
						}
						style={{ margin: '18px 0' }}
					/>
				)
			) : (
				<Empty description='Chưa có kết quả học tập' style={{ margin: '18px 0' }} />
			)}
		</Spin>
	);
};

export default DetailKetQuaHocTap;
