import DiemThiHocKy from '@/pages/KhaoThi/KyThi/DiemThiHocKy';
import { ETrangThaiThi } from '@/services/HocTap/constant';
import { ColorDiemChu } from '@/services/HocTap/LopHocPhan/constant';
import { type LopHocPhan } from '@/services/HocTap/LopHocPhan/typings';
import { ETrangThaiDuThi, trangThaiDuThi } from '@/services/KhaoThi/SinhVienThi/constant';
import { ArrowRightOutlined } from '@ant-design/icons';
import { Button, Descriptions, Divider, Empty, Spin, Tag, Tooltip } from 'antd';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

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

	const hasTrongSo = !!recDiem?.trongSo1 || !!recDiem?.trongSo2 || !!recDiem?.trongSo3;
	// Đầu điểm học phần theo đề cương
	const dauDiemCoTrongSo = danhSachDauDiem.filter(
		(item) =>
			!hasTrongSo || // Đề cương học phần học kỳ này ko có trọng số
			recDiem?.[`trongSo${item.field}` as keyof LopHocPhan.IDiemHpSvHk],
	);

	const hasTrongTrongSoThi = !!recDiem?.trongSoThi1 || !!recDiem?.trongSoThi2 || !!recDiem?.trongSoThi3;
	const trongSoThanhPhan = _.range(1, 11).reduce((pre, cur) => {
		const trongSo = +(recDiem?.[`trongSo${cur}` as keyof LopHocPhan.IDiemHpSvHk] ?? 0);
		return pre + trongSo;
	}, 0);

	useEffect(() => {
		setHienThiDiemThi(false);
	}, [recDiem?._id]);

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
						<Divider>Điểm thành phần & ĐKDT</Divider>
						<Descriptions bordered>
							{dauDiemCoTrongSo?.map((item) => (
								<Descriptions.Item
									label={`${item.ten}${
										hasTrongSo ? ` (${recDiem?.[`trongSo${item.field}` as keyof LopHocPhan.IDiemHpSvHk]}%)` : ''
									}`}
									key={item._id}
								>
									<div>{recDiem?.[`diemThanhPhan${item.field}` as keyof LopHocPhan.IDiemHpSvHk] ?? '--'}</div>
								</Descriptions.Item>
							))}
							<Descriptions.Item label='Điều kiện dự thi'>
								<span style={{ color: recDiem?.trangThaiThi === ETrangThaiThi.CAM_THI ? 'red' : undefined }}>
									{recDiem?.trangThaiThi ?? '--'}
								</span>
							</Descriptions.Item>
						</Descriptions>

						<Divider>Điểm thi kết thúc học phần</Divider>
						<Descriptions bordered>
							{hasTrongTrongSoThi && (
								<Descriptions.Item label='Trọng số'>
									<div>{hasTrongTrongSoThi ? recDiem.trongSoThi1 : 100 - trongSoThanhPhan}%</div>
								</Descriptions.Item>
							)}
							<Descriptions.Item label='Thi lần 1'>
								<div>{recDiem?.diemThi1 ?? '--'}</div>
							</Descriptions.Item>
							<Descriptions.Item label='Thi lần 2'>
								<div>{recDiem?.diemThi2 ?? '--'}</div>
							</Descriptions.Item>

							{_.range(2, 6).map((i) =>
								recDiem?.[`trongSoThi${i}` as keyof LopHocPhan.IDiemHpSvHk] ? (
									<>
										<Descriptions.Item label={`Trọng số đầu điểm ${i}`}>
											<div>{recDiem?.[`trongSoThi${i}` as keyof LopHocPhan.IDiemHpSvHk]}%</div>
										</Descriptions.Item>
										<Descriptions.Item label='Thi lần 1'>
											<div>{recDiem?.[`diemThi1${i}` as keyof LopHocPhan.IDiemHpSvHk] ?? '--'}</div>
										</Descriptions.Item>
										<Descriptions.Item label='Thi lần 2'>
											<div>{recDiem?.[`diemThi2${i}` as keyof LopHocPhan.IDiemHpSvHk] ?? '--'}</div>
										</Descriptions.Item>
									</>
								) : null,
							)}

							<Descriptions.Item label={`Điểm cuối (${100 - trongSoThanhPhan}%)`}>
								<div>
									{recDiem?.trangThaiDuThi && recDiem.trangThaiDuThi !== ETrangThaiDuThi.OK ? (
										<span title={trangThaiDuThi[recDiem.trangThaiDuThi]}>{recDiem?.trangThaiDuThi}</span>
									) : (
										recDiem?.diemKthp ?? '--'
									)}
								</div>
							</Descriptions.Item>
						</Descriptions>

						{recDiem && recDiem.diemKthp !== undefined && recDiem.diemKthp !== null && (
							<div style={{ marginTop: 8 }}>
								<a
									onClick={(e) => {
										e.preventDefault();
										setHienThiDiemThi(true);
									}}
								>
									Xem chi tiết lịch sử thi
								</a>
								{hienThiDiemThi && <DiemThiHocKy maHocKy={recDiem?.maHocKy} maHocPhan={recDiem?.maHocPhan} />}
							</div>
						)}

						<Divider>Điểm tổng kết</Divider>
						<Descriptions bordered>
							<Descriptions.Item label='Điểm hệ 10'>{recDiem?.diemTongKet ?? '--'}</Descriptions.Item>
							<Descriptions.Item label='Điểm hệ 4'>{recDiem?.diemThang4 ?? '--'}</Descriptions.Item>
							<Descriptions.Item label='Điểm chữ'>
								{recDiem?.diemChu ? <Tag color={ColorDiemChu[recDiem.diemChu]}>{recDiem.diemChu}</Tag> : '--'}{' '}
								{recDiem?.isCongNhanQuyDoiDiem && (
									<Tooltip title='Điểm quy đổi'>(R{recDiem.coTichLuyQuyDoi ? ' - Tích lũy' : ''})</Tooltip>
								)}
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
