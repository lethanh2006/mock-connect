/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
import GridChoice from '@/pages/KhaoSatSVGV/components/Question/GridChoice';
import MultipleChoice from '@/pages/KhaoSatSVGV/components/Question/MultipleChoice';
import NumericChoice from '@/pages/KhaoSatSVGV/components/Question/NumericChoice';
import SingleChoice from '@/pages/KhaoSatSVGV/components/Question/SingleChoice';
import Text from '@/pages/KhaoSatSVGV/components/Question/Text';
import type { BieuMau } from '@/services/BieuMau/typings';
import { Button, Card, Form, message } from 'antd';
import { useState } from 'react';
import { useModel } from 'umi';

const FormTraLoiKhaoSat = (props: any) => {
  const { dataBieuMau } = useModel('hoctap.loptinchi');
  const [form] = Form.useForm();
  const [err, setErr] = useState(false);
  const [listLuaChonBang, setListLuaChonBang] = useState<{ idHang: string; idCot: string }[]>([]);
  const renderQuestion = (question: BieuMau.CauHoi, indexKhoi: number, indexCauHoi: number) => {
    let questionEleMent = <div />;
    // const dataBieuMauDapAn = dataBieuMau?.danhSachTraLoi?.find((item) => item.idCauHoi === question._id);
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
          setErr={setErr}
        />
      );
    else if (question?.loai === 'NumericRange')
      questionEleMent = (
        <NumericChoice question={question} indexKhoi={indexKhoi} indexCauHoi={indexCauHoi} />
      );
    return (
      <div>
        <div>
          {question.batBuoc && <span style={{ color: '#dc3545' }}>*</span>}{' '}
          <b>{question?.noiDungCauHoi}</b>
        </div>
        <div>{questionEleMent}</div>
        <br />
      </div>
    );
  };
  return (
    <>
      {/* <h4 style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 16 }}>
        Chi tiết biểu mẫu đánh giá
      </h4> */}
      <Form
        onFinish={(values) => {
          const danhSachTraLoi: KhaiBaoSucKhoe.TraLoiRecord[] = [];
          dataBieuMau?.danhSachKhoi?.forEach((item, indexKhoi) => {
            item?.danhSachCauHoi?.forEach((cauHoi, indexCauHoi) => {
              let traLoi: KhaiBaoSucKhoe.TraLoiRecord = {
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
                  listLuaChonBang: listLuaChonBang?.[`${indexKhoi}||${indexCauHoi}`] ?? [],
                };
              else if (cauHoi.loai === 'NumericRange') {
                traLoi = { ...traLoi, luaChonTuyenTinh: values[`${indexKhoi}||${indexCauHoi}`] };
              }
              danhSachTraLoi.push(traLoi);
            });
          });
          if (!err) {
            props.onSubmit(danhSachTraLoi);
            // console.log('submited');
          } else {
            message.error('Cần điền hết các câu bắt buộc!');
          }
        }}
        labelCol={{ span: 24 }}
        form={form}
      >
        <h3>{dataBieuMau?.tieuDe}</h3>
        <p>{dataBieuMau?.moTa}</p>
        <div>
          {dataBieuMau?.danhSachKhoi?.map((item: BieuMau.Khoi, indexKhoi) => (
            <Card key={indexKhoi}>
              <div>{item?.tieuDe}</div>
              <div>{item?.moTa}</div>
              <div>
                {item?.danhSachCauHoi?.map((cauHoi: BieuMau.CauHoi, indexCauHoi) =>
                  renderQuestion(cauHoi, indexKhoi, indexCauHoi),
                )}
              </div>
            </Card>
          ))}
        </div>
        <br />
        <Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>
          <Button style={{ marginRight: 8 }} htmlType="submit" type="primary">
            Hoàn thành
          </Button>
          {/* <Button onClick={() => setVisibleForm(false)}>Đóng</Button> */}
        </Form.Item>
      </Form>
    </>
  );
};

export default FormTraLoiKhaoSat;
