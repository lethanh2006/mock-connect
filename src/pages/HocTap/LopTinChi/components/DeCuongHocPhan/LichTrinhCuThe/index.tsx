import { MenuOutlined } from '@ant-design/icons';
import { Button, Col, Collapse, Row, Space } from 'antd';
import _ from 'lodash';
import { useState } from 'react';
import './style.less';

const LichTrinhCuTheList = () => {
  const [groupLichTrinh, setGroupLichTrinh] = useState<Record<string, HocPhan.ITienTrinhHocPhan[]>>(
    {},
  );
  const [maxWeek, setMaxWeek] = useState(0);
  const [activeKeys, setActiveKeys] = useState<string[]>();

  const onExpandAll = () => {
    const weeks = Object.keys(groupLichTrinh);
    setActiveKeys(weeks);
  };

  return (
    <Row gutter={[12, 12]}>
      Lịch trình cụ thể
      {maxWeek ? (
        <Col span={24}>
          <Button icon={<MenuOutlined />} type="primary" onClick={onExpandAll}>
            Xem đầy đủ
          </Button>
        </Col>
      ) : null}
      <Col span={24}>
        <Collapse
          activeKey={activeKeys}
          onChange={(key) => setActiveKeys(typeof key !== 'string' ? key : [key])}
        >
          {groupLichTrinh
            ? Object.entries(groupLichTrinh).map(([week, data]) => (
                <Collapse.Panel
                  header={
                    <Space>
                      <b>TUẦN {week}</b>
                    </Space>
                  }
                  key={week}
                >
                  <Collapse>
                    {data.map((rec, index) => (
                      <Collapse.Panel
                        header={
                          <span className="fw500">
                            Nội dung {index + 1}: {rec.noiDung}
                          </span>
                        }
                        key={rec._id}
                      >
                        <ol className="noi-dung">
                          <li>
                            <span className="fw500">Nội dung chính:</span>
                            <p>{rec.noiDungChinh}</p>
                          </li>
                          <li>
                            <span className="fw500">Yêu cầu đối với sinh viên:</span>
                            <p>{rec.yeuCauSinhVien}</p>
                          </li>
                          <li>
                            <span className="fw500">Hình thức tổ chức dạy học:</span>
                            <p>
                              <ul>
                                {rec.ndTienTrinhList?.map((nd) =>
                                  nd.soTiet ? (
                                    <li key={nd._id}>
                                      {nd.loaiToChucDayHoc} ({nd.soTiet} tiết)
                                    </li>
                                  ) : null,
                                )}
                              </ul>
                            </p>
                          </li>
                          <li>
                            <span className="fw500">Ghi chú:</span>
                            <p>{rec.ghiChu}</p>
                          </li>
                        </ol>
                      </Collapse.Panel>
                    ))}
                  </Collapse>
                </Collapse.Panel>
              ))
            : null}
        </Collapse>
      </Col>
    </Row>
  );
};

export default LichTrinhCuTheList;
