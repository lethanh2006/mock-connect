import { MenuOutlined } from '@ant-design/icons';
import { Button, Col, Collapse, Row, Space } from 'antd';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import './style.less';
import { type HocPhan } from '@/services/DaoTao/HocPhan/typings';
import { useModel } from 'umi';

const LichTrinhCuTheList = () => {
  const { getAllModel, setRecord } = useModel('hocphan.tientrinhhp');
  const { record: recDeCuong } = useModel('hocphan.decuonghocphan');
  const [groupLichTrinh, setGroupLichTrinh] = useState<Record<string, HocPhan.ITienTrinhHocPhan[]>>(
    {},
  );
  const [maxWeek, setMaxWeek] = useState(0);
  const [activeKeys, setActiveKeys] = useState<string[]>();

  const getData = async () => {
    if (recDeCuong?._id)
      getAllModel(false, { tuan: 1 }, { deCuongId: recDeCuong._id }).then((data) => {
        const groupWeek = _.groupBy(data, (item) => item.tuan);
        setGroupLichTrinh(groupWeek);
        const maxw = _.max(data.map((item) => item.tuan));
        setMaxWeek(maxw ?? 0);
      });
    setRecord(undefined);
  };

  useEffect(() => {
    getData();
  }, [recDeCuong?._id]);

  const onExpandAll = () => {
    const weeks = Object.keys(groupLichTrinh);
    setActiveKeys(weeks);
  };

  return (
    <Row gutter={[12, 12]}>
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
