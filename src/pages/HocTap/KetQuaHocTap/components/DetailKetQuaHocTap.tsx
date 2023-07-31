import { ColorDiemChu } from '@/services/HocTap/LopHocPhan/constant';
import { type LopHocPhan } from '@/services/HocTap/LopHocPhan/typings';
import { Descriptions, Tag, Spin } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const DetailKetQuaHocTap = (props: {
  lopHocPhanId?: string;
  sinhVienLopHp?: LopHocPhan.IRecordSinhVienLopHP;
}) => {
  const { danhSach, getModel } = useModel('daotao.daudiemhocphan');
  const { sinhVienGetDiemLopHocPhanModel, sinhVienLopHocPhan, loading } = useModel(
    'daotao.sinhvienlophocphan',
  );
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
            {sinhVienDiem?.[`diemThanhPhan${item.field}` as keyof LopHocPhan.IRecordSinhVienLopHP]}
          </Descriptions.Item>
        ))}
        <Descriptions.Item label="Điểm thi lần 1">{sinhVienDiem?.diemThi1}</Descriptions.Item>
        <Descriptions.Item label="Điểm thi lần 2">{sinhVienDiem?.diemThi2}</Descriptions.Item>
        <Descriptions.Item label="Tổng kết (hệ 10)">{sinhVienDiem?.diemTongKet}</Descriptions.Item>
        <Descriptions.Item label="Tổng kết (hệ 4)">{sinhVienDiem?.diemThang4}</Descriptions.Item>
        <Descriptions.Item label="Tổng kết (dạng chữ)">
          {sinhVienDiem?.diemChu ? (
            <Tag color={ColorDiemChu[sinhVienDiem?.diemChu]}>{sinhVienDiem?.diemChu}</Tag>
          ) : null}
        </Descriptions.Item>
      </Descriptions>
    </Spin>
  );
};

export default DetailKetQuaHocTap;
