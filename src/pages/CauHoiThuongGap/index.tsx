import { Card, Collapse } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
const { Panel } = Collapse;

const CauHoiThuongGap = () => {
  const { getAllModel, danhSach } = useModel('cauhoithuonggap');

  useEffect(() => {
    getAllModel(false);
  }, []);

  return (
    <Card title="Câu hỏi thường gặp">
      <Collapse>
        {danhSach.map((item) => (
          <Panel header={item.cauHoi} key={item._id}>
            <p style={{ paddingLeft: 24 }}>
              <div dangerouslySetInnerHTML={{ __html: item.cauTraLoi }} />
            </p>
          </Panel>
        ))}
      </Collapse>
    </Card>
  );
};

export default CauHoiThuongGap;
