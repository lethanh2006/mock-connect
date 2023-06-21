import { type BieuMau } from '@/services/TienIch/KhaoSat/BieuMau/typing';
import { Button, Card, Checkbox, Form } from 'antd';
import { useState } from 'react';
import { useModel } from 'umi';
import GridChoice from './Question/GridChoice';
import MultipleChoice from './Question/MultipleChoice';
import NumericChoice from './Question/NumericChoice';
import SingleChoice from './Question/SingleChoice';
import Text from './Question/Text';

const FormTraLoiKhaoSat = () => {
  const { loading, record, traLoiBieuMauModel, formSubmiting } = useModel('tienich.bieumau');
  const { setVisibleForm, record: recordDot, getDotMeModel } = useModel('tienich.dotkhaosat');
  const [listLuaChonBang, setListLuaChonBang] = useState<BieuMau.LuaChonBangRecord[][]>([]);
  const [check, setCheck] = useState<boolean>(false);
  const [form] = Form.useForm();

  const renderQuestion = (question: BieuMau.CauHoi, indexKhoi: number, indexCauHoi: number) => {
    let questionEleMent = <div />;
    if (question.loai === 'SingleChoice')
      questionEleMent = (
        <SingleChoice question={question} indexKhoi={indexKhoi} indexCauHoi={indexCauHoi} />
      );
    else if (question.loai === 'MultipleChoice')
      questionEleMent = (
        <MultipleChoice question={question} indexKhoi={indexKhoi} indexCauHoi={indexCauHoi} />
      );
    else if (question.loai === 'Text')
      questionEleMent = (
        <Text question={question} indexKhoi={indexKhoi} indexCauHoi={indexCauHoi} />
      );
    else if (question.loai === 'GridMultipleChoice' || question.loai === 'GridSingleChoice')
      questionEleMent = (
        <GridChoice
          listLuaChonBang={listLuaChonBang}
          setListLuaChonBang={setListLuaChonBang}
          question={question}
          indexKhoi={indexKhoi}
          indexCauHoi={indexCauHoi}
        />
      );
    else if (question.loai === 'NumericRange')
      questionEleMent = (
        <NumericChoice question={question} indexKhoi={indexKhoi} indexCauHoi={indexCauHoi} />
      );
    return (
      <div key={question._id}>
        <div className="ant-form-item-label fw500">
          <label className={question.batBuoc ? 'ant-form-item-required' : ''}>
            Câu {indexCauHoi + 1}: {question.noiDungCauHoi}
          </label>
        </div>
        <br />
        {questionEleMent}
        <br />
      </div>
    );
  };

  const onFinish = async (values: any) => {
    const danhSachTraLoi: BieuMau.TraLoiRecord[] = [];
    record?.danhSachKhoi?.forEach((item, indexKhoi) => {
      item?.danhSachCauHoi?.forEach((cauHoi, indexCauHoi) => {
        let traLoi: BieuMau.TraLoiRecord = {
          idCauHoi: cauHoi._id,
          listLuaChon: [],
          listLuaChonBang: [],
          luaChonTuyenTinh: 0,
          traLoiText: '',
        };
        if (cauHoi.loai === 'SingleChoice' && values?.[`${indexKhoi}||${indexCauHoi}`])
          traLoi = { ...traLoi, listLuaChon: [values[`${indexKhoi}||${indexCauHoi}`]] };
        else if (cauHoi.loai === 'MultipleChoice' && values?.[`${indexKhoi}||${indexCauHoi}`])
          traLoi = { ...traLoi, listLuaChon: values[`${indexKhoi}||${indexCauHoi}`] };
        else if (cauHoi.loai === 'Text')
          traLoi = { ...traLoi, traLoiText: values[`${indexKhoi}||${indexCauHoi}`] };
        else if (cauHoi.loai === 'GridMultipleChoice' || cauHoi.loai === 'GridSingleChoice')
          traLoi = {
            ...traLoi,
            listLuaChonBang: listLuaChonBang?.[indexKhoi || indexCauHoi] ?? [],
          };
        else if (cauHoi.loai === 'NumericRange') {
          traLoi = { ...traLoi, luaChonTuyenTinh: values[`${indexKhoi}||${indexCauHoi}`] };
        }
        danhSachTraLoi.push(traLoi);
      });
    });

    await traLoiBieuMauModel({
      idKhaoSat: record?._id ?? '',
      danhSachTraLoi,
      idDot: recordDot?._id ?? '',
    })
      .then(() => {
        getDotMeModel();
        setVisibleForm(false);
      })
      .catch((er) => console.log(er));
  };

  return (
    <Card loading={loading} title="Chi tiết khảo sát">
      <Form scrollToFirstError onFinish={onFinish} layout="vertical" form={form}>
        <h3>{record?.tieuDe}</h3>
        <p>{record?.moTa}</p>

        {record?.danhSachKhoi?.map((item, indexKhoi) => (
          // eslint-disable-next-line react/no-array-index-key
          <div key={indexKhoi}>
            <div className="fw500">{item.tieuDe}</div>
            <p>{item.moTa}</p>

            {item.danhSachCauHoi?.map((cauHoi, indexCauHoi) =>
              renderQuestion(cauHoi, indexKhoi, indexCauHoi),
            )}
          </div>
        ))}

        {record?.coCamKet && (
          <Checkbox
            style={{ marginBottom: 12, marginTop: 12 }}
            onChange={(e) => setCheck(e.target.checked)}
            checked={check}
          >
            {record?.noiDungCamKet}
          </Checkbox>
        )}

        <div className="form-footer">
          <Button
            disabled={record?.coCamKet && !check}
            loading={formSubmiting}
            htmlType="submit"
            type="primary"
          >
            Hoàn thành
          </Button>
          <Button onClick={() => setVisibleForm(false)}>Đóng</Button>
        </div>
      </Form>
    </Card>
  );
};

export default FormTraLoiKhaoSat;
