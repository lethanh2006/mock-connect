import { Col, Divider, Row } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const DanhSachHoatDongTuan = () => {
  const { getAllModel: getAllHoatDong, danhSach: danhSachHoatDong } =
    useModel('daotao.loaihoatdongtuan');

  useEffect(() => {
    getAllHoatDong(false, undefined, { active: true });
  }, []);

  return (
    <>
      <Divider>Chú thích các loại hoạt động tuần</Divider>
      <Row className="loai-hoat-dong">
        {danhSachHoatDong.map((item) => (
          <Col key={item._id} span={24} md={8}>
            <span style={{ backgroundColor: item.maMau }}>{item.kyHieu}</span> → {item.ten}
          </Col>
        ))}
      </Row>
    </>
  );
};

export default DanhSachHoatDongTuan;
