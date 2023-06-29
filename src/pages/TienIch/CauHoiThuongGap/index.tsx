import { EOperatorType } from '@/components/Table/constant';
import { SearchOutlined } from '@ant-design/icons';
import { Card, Collapse, Space, Form, Button, Input } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
const { Panel } = Collapse;

const CauHoiThuongGap = () => {
  const { getAllModel, danhSach, filters, setFilters } = useModel('tienich.cauhoithuonggap');
  const [form] = Form.useForm();

  useEffect(() => {
    getAllModel(false, undefined, undefined, filters);
  }, [filters]);

  const onFinish = (values: any) => {
    setFilters([
      { active: true, field: 'cauHoi', values: [values.cauHoi], operator: EOperatorType.CONTAIN },
    ]);
  };

  return (
    <Card title="Câu hỏi thường gặp">
      <Space wrap style={{ width: '100%', justifyContent: 'space-between', marginBottom: 12 }}>
        <Form form={form} onFinish={onFinish} layout="inline">
          <Form.Item name="cauHoi">
            <Input placeholder="Tìm theo tên..." allowClear />
          </Form.Item>
          <Button icon={<SearchOutlined />} htmlType="submit" type="primary">
            Tìm kiếm
          </Button>
        </Form>

        <h4 style={{ display: 'inline-block' }}>
          Tổng số:
          <Input
            style={{
              width: 70,
              fontWeight: 700,
              fontSize: 16,
              marginLeft: 10,
              color: '#007eb9',
            }}
            value={danhSach.length}
            readOnly
            // ref={this.setTableBaseRef}
          />
        </h4>
      </Space>

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
