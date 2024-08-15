import DiemThiHocKy from '@/pages/KhaoThi/KyThi/DiemThiHocKy';
import { ColorDiemChu } from '@/services/HocTap/LopHocPhan/constant';
import { type LopHocPhan } from '@/services/HocTap/LopHocPhan/typings';
import { ETrangThaiThi } from '@/services/HocTap/constant';
import { Descriptions, Divider, Empty, Spin, Tag, Tooltip } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

const DetailKetQuaHocTap = (props: { lopHocPhanId?: string; diemHpSvHk?: LopHocPhan.IDiemHpSvHk }) => {
	const { lopHocPhanId, diemHpSvHk } = props;
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
		getModel();
	}, []);

	useEffect(() => {
		if (lopHocPhanId && !diemHpSvHk) sinhVienGetDiemLHPModel(lopHocPhanId);
	}, [lopHocPhanId]);

	return (
		<Spin spinning={loading}>
			{recDiem ? (
				<>
					<Divider>Điểm thành phần & Điều kiện dự thi</Divider>
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
						<Descriptions.Item label='ĐKDT'>
							<span style={{ color: recDiem?.trangThaiThi === ETrangThaiThi.CAM_THI ? 'red' : undefined }}>
								{recDiem?.trangThaiThi ?? '--'}
							</span>
						</Descriptions.Item>
					</Descriptions>

					<Divider>Điểm thi kết thúc học phần</Divider>
					<Descriptions bordered>
						<Descriptions.Item label='Điểm thi lần 1'>{recDiem?.diemThi1 ?? '--'}</Descriptions.Item>
						{/* <Descriptions.Item label='Điểm thẩm định'>{recDiem?.diemThamDinh ?? '--'}</Descriptions.Item>
						<Descriptions.Item label='Điểm phúc khảo'>{recDiem?.diemPhucKhao ?? '--'}</Descriptions.Item> */}
						<Descriptions.Item label='Điểm thi lần 2'>{recDiem?.diemThi2 ?? '--'}</Descriptions.Item>
						<Descriptions.Item label='Điểm cuối'>{recDiem?.diemKthp ?? '--'}</Descriptions.Item>
					</Descriptions>

					<div style={{ marginTop: 8 }}>
						<a onClick={() => setHienThiDiemThi(true)}>Xem chi tiết điểm thi</a>
						{hienThiDiemThi && <DiemThiHocKy maHocKy={recDiem?.maHocKy} maHocPhan={recDiem?.maHocPhan} />}
					</div>

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
				<Empty description='Chưa có kết quả học tập' style={{ margin: '18px 0' }} />
			)}
		</Spin>
	);
};

export default DetailKetQuaHocTap;
