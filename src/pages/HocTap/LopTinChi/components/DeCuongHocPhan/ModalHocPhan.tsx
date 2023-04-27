import { Card, Steps, Modal } from 'antd';
import { useModel } from 'umi';
import FormHocPhan from './Form';
import { useEffect, useState } from 'react';
import DeCuongHocPhanPage from '.';
import ModalDeCuongHocPhan from './components/ModalDeCuongHocPhan';

const ModalHocPhan = (props: { title?: string; visible: boolean; setVisible: any }) => {
  const { record, edit } = useModel('hocphan.hocphan');
  const { title, visible, setVisible } = props;
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    setCurrentStep(0);
  }, [record?._id]);

  const onChangeStep = (step: number) => {
    setCurrentStep(step);
  };

  return (
    <Modal
      title={title ?? ''}
      visible={visible}
      width={800}
      onCancel={() => setVisible(false)}
      okButtonProps={{ hidden: true }}
      cancelText="Đóng"
    >
      <Card bordered={false}>
        <Steps
          current={currentStep}
          type="navigation"
          style={{ marginBottom: 18, paddingTop: 0 }}
          onChange={onChangeStep}
        >
          <Steps.Step title="Thông tin chung" />
          <Steps.Step title="Đề cương chi tiết học phần" />
        </Steps>

        {currentStep === 0 ? (
          <FormHocPhan afterAddNew={() => setCurrentStep(1)} />
        ) : (
          <ModalDeCuongHocPhan />
        )}
      </Card>
    </Modal>
  );
};

export default ModalHocPhan;
