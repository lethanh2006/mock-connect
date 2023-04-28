import rules from '@/utils/rules';
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  CloseCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import type { FormInstance } from 'antd';
import { Button, Card, Col, Form, Input, Row } from 'antd';
import styles from './block.css';
import BlockThaoTac from './BlockThaoTac';

const Block = (props: {
  field: { name: number; key: number; isListField?: boolean };
  step: number;
  form: FormInstance;
}) => {
  return (
    <>
      <Row gutter={[20, 0]}>
        <Col xs={24}>
          <Form.Item
            labelCol={{ span: 24 }}
            name={[props.field.name, 'ten']}
            label="Tên bước"
            rules={[...rules.required, ...rules.text, ...rules.length(200)]}
          >
            <Input placeholder="Tên bước" />
          </Form.Item>
        </Col>
      </Row>

      <Form.List
        name={[props.field.name, 'danhSachThaoTac']}
        rules={[
          {
            validator: async (_, names) => {
              if (!names || names.length < 1) {
                return Promise.reject(new Error('Ít nhất 1 thao tác'));
              }
              return '';
            },
          },
        ]}
      >
        {(fields, { add, remove, move }, { errors }) => {
          return (
            <>
              {fields.map((field, index) => (
                <>
                  <div key={field.key}>
                    <Card
                      size="small"
                      headStyle={{ padding: '0px 24px' }}
                      bodyStyle={{ padding: '8px 24px' }}
                      className={styles.block}
                      title={
                        <>
                          <div style={{ float: 'left' }}>Thao tác {index + 1}</div>
                          <CloseCircleOutlined
                            style={{ float: 'right', marginLeft: 8 }}
                            onClick={() => remove(field.name)}
                          />
                          <ArrowUpOutlined
                            style={{ float: 'right', marginLeft: 8 }}
                            onClick={() => move(field.name, field.name - 1)}
                          />
                          <ArrowDownOutlined
                            style={{ float: 'right' }}
                            onClick={() => move(field.name, field.name + 1)}
                          />
                        </>
                      }
                    >
                      <BlockThaoTac form={props.form} step={props.step} field={{ ...field }} />
                    </Card>
                    <br />
                  </div>
                </>
              ))}
              <Form.Item style={{ marginBottom: 8 }}>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  style={{ width: '100%' }}
                  icon={<PlusOutlined />}
                >
                  Thêm thao tác
                </Button>
                <Form.ErrorList errors={errors} />
              </Form.Item>
            </>
          );
        }}
      </Form.List>

      {/* <Form.Item valuePropName="checked" name={[props.field.name, 'isRequired']}>
        <Checkbox>Bắt buộc</Checkbox>
      </Form.Item> */}
    </>
  );
};

export default Block;
