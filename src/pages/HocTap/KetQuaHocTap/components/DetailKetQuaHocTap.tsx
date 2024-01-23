import { ColorDiemChu } from '@/services/HocTap/LopHocPhan/constant';
import { type LopHocPhan } from '@/services/HocTap/LopHocPhan/typings';
import { Descriptions, Spin, Tag } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const DetailKetQuaHocTap = (props: { lopHocPhanId?: string; sinhVienLopHp?: LopHocPhan.IRecordSinhVienLopHP }) => {
	const { danhSach, getModel } = useModel('daotao.daudiemhocphan');
	const { sinhVienGetDiemLopHocPhanModel, sinhVienLopHocPhan, loading } = useModel('daotao.sinhvienlophocphan');
	const { lopHocPhanId, sinhVienLopHp } = props;
	const sinhVienDiem = sinhVienLopHp ?? sinhVienLopHocPhan;

	useEffect(() => {
		getModel();
	}, []);

	useEffect(() => {
		if (lopHocPhanId && !sinhVienLopHp) sinhVienGetDiemLopHocPhanModel(lopHocPhanId);
	}, [lopHocPhanId]);

	return (
		<Spin spinning={loading}>
			<Descriptions>
				{danhSach.map((item) => (
					<Descriptions.Item key={item._id} label={item.ten}>
						{sinhVienDiem?.diemHpSvHk?.[`diemThanhPhan${item.field}` as keyof LopHocPhan.IDiemHpSvHk]}
					</Descriptions.Item>
				))}
				<Descriptions.Item label='Điểm thi lần 1'>{sinhVienDiem?.diemHpSvHk?.diemThi1}</Descriptions.Item>
				<Descriptions.Item label='Điểm thi lần 2'>{sinhVienDiem?.diemHpSvHk?.diemThi2}</Descriptions.Item>
				<Descriptions.Item label='Tổng kết (hệ 10)'>{sinhVienDiem?.diemHpSvHk?.diemTongKet}</Descriptions.Item>
				<Descriptions.Item label='Tổng kết (hệ 4)'>{sinhVienDiem?.diemHpSvHk?.diemThang4}</Descriptions.Item>
				<Descriptions.Item label='Tổng kết (dạng chữ)'>
					{sinhVienDiem?.diemHpSvHk?.diemChu ? (
						<Tag color={ColorDiemChu[sinhVienDiem?.diemHpSvHk?.diemChu]}>{sinhVienDiem?.diemHpSvHk?.diemChu}</Tag>
					) : null}
				</Descriptions.Item>
			</Descriptions>
		</Spin>
	);
};

export default DetailKetQuaHocTap;
