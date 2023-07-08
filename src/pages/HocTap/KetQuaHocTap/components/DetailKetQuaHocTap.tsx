import { ColorDiemChu } from '@/services/HocTap/LopHocPhan/constant';
import { type LopHocPhan } from '@/services/HocTap/LopHocPhan/typings';
import { Descriptions, Tag, Spin } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const DetailKetQuaHocTap = (props: { lopHocPhanId?: string }) => {
  const { danhSach, getModel } = useModel('daotao.daudiemhocphan');
  const { sinhVienGetDiemLopHocPhanModel, sinhVienLopHocPhan, loading } = useModel(
    'daotao.sinhvienlophocphan',
  );
  const { lopHocPhanId } = props;

  useEffect(() => {
    getModel();
  }, []);

  useEffect(() => {
    if (lopHocPhanId) sinhVienGetDiemLopHocPhanModel(lopHocPhanId);
  }, [lopHocPhanId]);

  return (
    <Spin spinning={loading}>
      <Descriptions title="Chi tiết điểm lớp học phần">
        {danhSach.map((item, index) => (
          <Descriptions.Item key={item._id} label={item.ten}>
            {
              sinhVienLopHocPhan?.[
                `diemThanhPhan${index + 1}` as keyof LopHocPhan.IRecordSinhVienLopHP
              ]
            }
          </Descriptions.Item>
        ))}
        <Descriptions.Item label="Điểm thi lần 1">{sinhVienLopHocPhan?.diemThi1}</Descriptions.Item>
        <Descriptions.Item label="Điểm thi lần 2">{sinhVienLopHocPhan?.diemThi2}</Descriptions.Item>
        <Descriptions.Item label="Tổng kết (hệ 10)">
          {sinhVienLopHocPhan?.diemTongKet}
        </Descriptions.Item>
        <Descriptions.Item label="Tổng kết (hệ 4)">
          {sinhVienLopHocPhan?.diemThang4}
        </Descriptions.Item>
        <Descriptions.Item label="Tổng kết (dạng chữ)">
          {sinhVienLopHocPhan?.diemChu ? (
            <Tag color={ColorDiemChu[sinhVienLopHocPhan?.diemChu]}>
              {sinhVienLopHocPhan?.diemChu}
            </Tag>
          ) : null}
        </Descriptions.Item>
      </Descriptions>
    </Spin>
  );
};

export default DetailKetQuaHocTap;
