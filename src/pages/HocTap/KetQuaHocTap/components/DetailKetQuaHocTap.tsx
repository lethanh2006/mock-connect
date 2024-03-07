import { ColorDiemChu } from '@/services/HocTap/LopHocPhan/constant';
import { type LopHocPhan } from '@/services/HocTap/LopHocPhan/typings';
import { Descriptions, Empty, Spin, Tag } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const DetailKetQuaHocTap = (props: { lopHocPhanId?: string; diemHpSvHk?: LopHocPhan.IDiemHpSvHk }) => {
	const { danhSach, getModel } = useModel('daotao.daudiemhocphan');
	const { sinhVienGetDiemLopHocPhanModel, sinhVienLopHocPhan, loading } = useModel('lophocphan.sinhvienlophocphan');
	const { lopHocPhanId, diemHpSvHk } = props;
	const sinhVienDiem = diemHpSvHk ?? sinhVienLopHocPhan?.diemHpSvHk;

	useEffect(() => {
		getModel();
	}, []);

	useEffect(() => {
		if (lopHocPhanId && !diemHpSvHk) sinhVienGetDiemLopHocPhanModel(lopHocPhanId);
	}, [lopHocPhanId]);

	return (
		<Spin spinning={loading}>
			{sinhVienDiem ? (
				<Descriptions bordered>
					{danhSach.map((item) => (
						<Descriptions.Item key={item._id} label={item.ten}>
							{sinhVienDiem?.[`diemThanhPhan${item.field}` as keyof LopHocPhan.IDiemHpSvHk]}
						</Descriptions.Item>
					))}
					<Descriptions.Item label='Điểm thi lần 1'>{sinhVienDiem?.diemThi1}</Descriptions.Item>
					<Descriptions.Item label='Điểm thi lần 2'>{sinhVienDiem?.diemThi2}</Descriptions.Item>
					<Descriptions.Item label='Tổng kết (hệ 10)'>{sinhVienDiem?.diemTongKet}</Descriptions.Item>
					<Descriptions.Item label='Tổng kết (hệ 4)'>{sinhVienDiem?.diemThang4}</Descriptions.Item>
					<Descriptions.Item label='Tổng kết (dạng chữ)'>
						{sinhVienDiem?.diemChu ? (
							<Tag color={ColorDiemChu[sinhVienDiem?.diemChu]}>{sinhVienDiem?.diemChu}</Tag>
						) : null}
					</Descriptions.Item>
				</Descriptions>
			) : (
				<Empty />
			)}
		</Spin>
	);
};

export default DetailKetQuaHocTap;
