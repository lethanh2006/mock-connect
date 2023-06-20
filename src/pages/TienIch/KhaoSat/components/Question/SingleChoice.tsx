import { type BieuMau } from '@/services/TienIch/KhaoSat/BieuMau/typing';
import rules from '@/utils/rules';
import { Radio, Form } from 'antd';

const SingleChoice = (props: {
  question: BieuMau.CauHoi;
  indexKhoi: number;
  indexCauHoi: number;
}) => {
  return (
    <Form.Item
      rules={props.question.batBuoc ? [...rules.required] : []}
      name={`${props.indexKhoi}||${props.indexCauHoi}`}
    >
      <Radio.Group>
        {props.question?.luaChon?.map((item) => (
          <div key={item._id}>
            <Radio value={item._id}>{item.noiDung}</Radio>
          </div>
        ))}
      </Radio.Group>
    </Form.Item>
  );
};

export default SingleChoice;
