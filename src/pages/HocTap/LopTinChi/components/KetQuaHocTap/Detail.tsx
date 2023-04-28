import { ELoaiDauDiemHocPhan } from '@/services/LopTinChi/constant';
import type { LopTinChi } from '@/services/LopTinChi/typings';
import { Button, Descriptions, message, Select } from 'antd';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { history } from 'umi';

const DetailKetQuaHocTap = (props: {
  ketQuaHocTap?: LopTinChi.KetQuaHocTap[];
  onSetActiveTab?: any;
}) => {
  const { ketQuaHocTap } = props;
  const [diemHienTai, setDiemHienTai] = useState<LopTinChi.KetQuaHocTap | undefined>(
    ketQuaHocTap?.[0],
  );

  useEffect(() => {
    setDiemHienTai(ketQuaHocTap?.[0]);
  }, [ketQuaHocTap?.[0]?.id]);

  const renderItem = (label: string, diem?: any) => (
    <Descriptions.Item label={label}>
      {diem !== undefined && diem.toString() !== 'false' && diem !== '' ? diem : 'Chưa cập nhật'}
    </Descriptions.Item>
  );

  return (
    <>
      {ketQuaHocTap && ketQuaHocTap.length > 1 ? (
        <Select
          options={ketQuaHocTap.map((item, index) => ({
            value: index,
            key: index,
            label: 'Điểm lần ' + (index + 1),
          }))}
          onChange={(val) => setDiemHienTai(ketQuaHocTap[val])}
          style={{ width: 200, marginBottom: 12 }}
          defaultValue={0}
        />
      ) : null}

      {ketQuaHocTap && ketQuaHocTap.length > 0 ? (
        <>
          {diemHienTai?.is_danh_gia && (
            <Descriptions column={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 2 }} bordered>
              {diemHienTai?.loai_dau_diem_hoc_phan === ELoaiDauDiemHocPhan.TIENG_ANH_A_B ? (
                <>
                  {renderItem('Điểm nghe', diemHienTai?.diem_nghe)}
                  {renderItem('Điểm đọc', diemHienTai?.diem_doc)}
                  {renderItem('Điểm viết', diemHienTai?.diem_viet)}
                  {renderItem('Điểm nói', diemHienTai?.diem_noi)}
                </>
              ) : diemHienTai?.loai_dau_diem_hoc_phan === ELoaiDauDiemHocPhan.TIENG_ANH_COURSE ? (
                <>
                  {renderItem('Điểm chuyên cần', diemHienTai?.course_chuyen_can)}
                  {renderItem('Điểm ED TT', diemHienTai?.course_ed_tt)}
                  {renderItem('Điểm ED giấy', diemHienTai?.course_ed_giay)}
                  {renderItem('Điểm bài tập viết và nói', diemHienTai?.course_ed_bt_viet_noi)}
                  {renderItem('Điểm thi giữa HP', diemHienTai?.course_ed_thi_giua_hp)}
                  {renderItem('Điểm thi cuối HP', diemHienTai?.course_ed_thi_cuoi_hp)}
                </>
              ) : (
                <>
                  {renderItem('Điểm chuyên cần', diemHienTai?.diem_attendance)}
                  {renderItem('Điểm bài tập', diemHienTai?.diem_bai_tap)}
                  {renderItem(
                    'Điểm kiểm tra trên lớp',
                    diemHienTai?.diem_trung_binh_kiem_tra_tren_lop,
                  )}
                  {renderItem('Điểm thực hành', diemHienTai?.diem_thi_nghiem)}
                  {renderItem('Điểm cuối kỳ', diemHienTai?.diem_cuoi_ky)}
                </>
              )}

              {renderItem('Điểm tổng kết (hệ 10)', diemHienTai?.diem_tong_ket)}
              {renderItem('Điểm tổng kết (hệ 4)', diemHienTai?.diem_tong_ket_thang_4)}
              {renderItem('Điểm tổng kết (dạng chữ)', diemHienTai?.diem_tong_ket_dang_chu)}
            </Descriptions>
          )}

          {!diemHienTai?.is_danh_gia && (
            <div>
              <p>Bạn chưa đánh giá giảng viên. Vui lòng đánh giá giảng viên để xem điểm!</p>
              <Button
                // onClick={() => {
                //   console.log('clicked');
                //   history.push(`/hoctap/loptinchi/${diemHienTai?.lop_tin_chi_id[0]}#danhgia`);
                // }}
                onClick={
                  props.onSetActiveTab
                    ? props.onSetActiveTab
                    : () => {
                        console.log('🚀 ~ file: Detail.tsx:97 ~ diemHienTai', diemHienTai);
                        if (diemHienTai?.lop_tin_chi_id)
                          history.push(
                            `/hoctap/loptinchi/${diemHienTai?.lop_tin_chi_id[0]}#danhgia`,
                          );
                        else message.error('Không có lớp tín chỉ!');
                      }
                }
              >
                Đánh giá giảng viên
              </Button>
            </div>
          )}
        </>
      ) : (
        <div>
          {/*<p>Bạn chưa học môn này!</p>*/}
          <Descriptions column={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 2 }} bordered>
            {diemHienTai?.loai_dau_diem_hoc_phan === ELoaiDauDiemHocPhan.TIENG_ANH_A_B ? (
              <>
                {renderItem('Điểm nghe', '--')}
                {renderItem('Điểm đọc', '--')}
                {renderItem('Điểm viết', '--')}
                {renderItem('Điểm nói', '--')}
              </>
            ) : diemHienTai?.loai_dau_diem_hoc_phan === ELoaiDauDiemHocPhan.TIENG_ANH_COURSE ? (
              <>
                {renderItem('Điểm chuyên cần', '--')}
                {renderItem('Điểm ED TT', '--')}
                {renderItem('Điểm ED giấy', '--')}
                {renderItem('Điểm bài tập viết và nói', '--')}
                {renderItem('Điểm thi giữa HP', '--')}
                {renderItem('Điểm thi cuối HP', '--')}
              </>
            ) : (
              <>
                {renderItem('Điểm chuyên cần', '--')}
                {renderItem('Điểm bài tập', '--')}
                {renderItem('Điểm kiểm tra trên lớp', '--')}
                {renderItem('Điểm thực hành', '--')}
                {renderItem('Điểm cuối kỳ', '--')}
              </>
            )}

            {renderItem('Điểm tổng kết (hệ 10)', '--')}
            {renderItem('Điểm tổng kết (hệ 4)', '--')}
            {renderItem('Điểm tổng kết (dạng chữ)', '--')}
          </Descriptions>
          {/* <Button onClick={() => history.push('/hoctap/loptinchi')}>Xem các môn đã học</Button> */}
        </div>
      )}
    </>
  );
};

export default DetailKetQuaHocTap;
