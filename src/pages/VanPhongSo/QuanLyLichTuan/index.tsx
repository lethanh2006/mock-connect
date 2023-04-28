import Sukien from './ViewLichTuan';
import { useCheckAccess } from '@/utils/utils';
import { Badge, Card, Col, Row } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import { ETrangThaiLichTuan, colorLichTuan } from './constants';

const LichTuan = () => {
  const { getCanBoModel, condition, setCondition } = useModel('tochuccanbo');
  const { getAllDonViModel, danhSach: danhSachDonVi } = useModel('donvi');
  const isDangKy = useCheckAccess('lich-tuan:dang-ky'); // quyền đăng ký lịch tuần
  const isQuanLy = useCheckAccess('lich-tuan:create'); //quyền quản lý lịch tuần
  const isViewer = useCheckAccess('lich-tuan'); //quyền xem lịch chính thức

  useEffect(() => {
    if (!danhSachDonVi.length) getAllDonViModel();
    return () => {
      setCondition({} as any);
    };
  }, []);

  useEffect(() => {
    getCanBoModel({ pageParam: 1, limitParam: 20 });
  }, [condition]);

  return (
    <>
      <Row gutter={[20, 20]}>
        {isDangKy || isQuanLy ? (
          <Col span={24}>
            <Card
              style={{ height: '100%' }}
              bordered
              title={<div className="cardTitle">Lịch tuần Học viện (Bản nháp)</div>}
            >
              <Sukien loaiLichTuan="nhap" />
              <div style={{ marginTop: '15px' }}>
                Ghi chú:
                <Badge
                  style={{ marginRight: '8px', marginLeft: '25px' }}
                  color={colorLichTuan[ETrangThaiLichTuan.CHO_DUYET]}
                />
                Chờ duyệt
                <Badge
                  style={{ marginRight: '8px', marginLeft: '25px' }}
                  color={colorLichTuan[ETrangThaiLichTuan.DA_DUYET]}
                />
                Đã duyệt
                <Badge
                  style={{ marginRight: '8px', marginLeft: '25px' }}
                  color={colorLichTuan[ETrangThaiLichTuan.KHONG_DUYET]}
                />
                Không duyệt
                <Badge
                  style={{ marginRight: '8px', marginLeft: '25px' }}
                  color={colorLichTuan[ETrangThaiLichTuan.DA_PHAT_HANH]}
                />
                Đã phát hành
              </div>
            </Card>
          </Col>
        ) : null}
        <Col span={24}>
          {isViewer || isQuanLy ? (
            <Card
              style={{ height: '100%' }}
              bordered
              title={<div className="cardTitle">Lịch tuần Học viện (Bản đã phát hành)</div>}
            >
              <Sukien loaiLichTuan="chinhthuc" />
            </Card>
          ) : null}
        </Col>
      </Row>
    </>
  );
};

export default LichTuan;
