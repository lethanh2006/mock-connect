import { Card, Steps, Button } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import FormDeCuong from './FormDeCuong';
import GiangVienDeCuongPage from '../GiangVienDeCuong';
import LichTrinhCuTheList from '../LichTrinhCuThe';
import HocLieuDeCuongPage from '../HocLieuDeCuong';
import TrongSoHocPhanPage from '../TrongSoHocPhan';

const ModalDeCuongHocPhan = (props: any) => {
  const { record, setVisibleForm } = useModel('hocphan.decuonghocphan');
  const title = props?.title ?? '';
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    setCurrentStep(0);
  }, [record?._id]);

  const onChangeStep = (step: number) => {
    setCurrentStep(step);
  };

  return (
    <Card bordered={false}>
      <Steps
        current={currentStep}
        style={{ marginBottom: 18, paddingTop: 0 }}
        onChange={onChangeStep}
        progressDot
        size="small"
      >
        <Steps.Step title="Thông tin chung" />
        <Steps.Step title="Giảng viên" />
        <Steps.Step title="Lịch trình cụ thể" />
        <Steps.Step title="Học liệu" />
        <Steps.Step title="Đánh giá KQHT" />
      </Steps>

      {currentStep === 0 ? (
        <FormDeCuong afterAddNew={() => setCurrentStep(1)} />
      ) : currentStep === 1 ? (
        <GiangVienDeCuongPage />
      ) : currentStep === 2 ? (
        <LichTrinhCuTheList />
      ) : currentStep === 3 ? (
        <HocLieuDeCuongPage />
      ) : currentStep === 4 ? (
        <TrongSoHocPhanPage />
      ) : null}
    </Card>
  );
};

export default ModalDeCuongHocPhan;
