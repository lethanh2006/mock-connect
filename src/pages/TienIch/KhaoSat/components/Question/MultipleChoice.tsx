import { type BieuMau } from '@/services/TienIch/KhaoSat/BieuMau/typing';
import rules from '@/utils/rules';
import { Checkbox, Form } from 'antd';

const MultipleChoice = (props: {
  question: BieuMau.CauHoi;
  indexKhoi: number;
  indexCauHoi: number;
}) => {
  return (
    <Form.Item
      rules={props.question.batBuoc ? [...rules.required] : []}
      name={`${props.indexKhoi}||${props.indexCauHoi}`}
    >
      <Checkbox.Group>
        {props.question.luaChon?.map((item) => (
          <div key={item._id}>
            <Checkbox value={item._id}>{item.noiDung}</Checkbox>
          </div>
        ))}
      </Checkbox.Group>
    </Form.Item>
  );
};

export default MultipleChoice;
