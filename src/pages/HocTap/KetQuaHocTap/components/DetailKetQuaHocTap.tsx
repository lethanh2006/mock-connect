import { ColorDiemChu } from '@/services/HocTap/LopHocPhan/constant';
import { type LopHocPhan } from '@/services/HocTap/LopHocPhan/typings';
import { Descriptions, Tag } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const DetailKetQuaHocTap = (props: { lopHocPhanId?: string }) => {
  const { danhSach, getModel } = useModel('daotao.daudiemhocphan');
  const { sinhVienGetDiemLopHocPhanModel, sinhVienLopHocPhan } = useModel(
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
    <>
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
        <Descriptions.Item label="Điểm thi lần 1">
          {sinhVienLopHocPhan?.diemThi1 ?? '--'}
        </Descriptions.Item>
        <Descriptions.Item label="Điểm thi lần 2">
          {sinhVienLopHocPhan?.diemThi2 ?? '--'}
        </Descriptions.Item>
        <Descriptions.Item label="Điểm tổng kết">
          {sinhVienLopHocPhan?.diemTongKet}
        </Descriptions.Item>
        <Descriptions.Item label="Điểm thang 4">{sinhVienLopHocPhan?.diemThang4}</Descriptions.Item>
        <Descriptions.Item label="Điểm chữ">
          {sinhVienLopHocPhan?.diemChu ? (
            <Tag color={ColorDiemChu[sinhVienLopHocPhan.diemChu]}>{sinhVienLopHocPhan.diemChu}</Tag>
          ) : (
            '--'
          )}
        </Descriptions.Item>
      </Descriptions>
    </>
  );
};

export default DetailKetQuaHocTap;
