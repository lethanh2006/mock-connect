import { Modal } from 'antd';
import TabsDeCuongHocPhan from './components/ModalDeCuongHocPhan';

const ModalHocPhan = (props: { title?: string; visible: boolean; setVisible: any }) => {
  const { title, visible, setVisible } = props;

  return (
    <Modal
      title={title ?? ''}
      visible={visible}
      width={800}
      onCancel={() => setVisible(false)}
      okButtonProps={{ hidden: true }}
      cancelText="Đóng"
      bodyStyle={{ paddingTop: '0px' }}
    >
      {/* <Card bordered={false} bodyStyle={{ margin: '0' }}> */}
      {/* <Steps
          current={currentStep}
          type="navigation"
          style={{ marginBottom: 18, paddingTop: 0 }}
          onChange={onChangeStep}
        >
          <Steps.Step title="Thông tin chung" />
          <Steps.Step title="Đề cương chi tiết học phần" />
        </Steps> */}
      <TabsDeCuongHocPhan />

      {/* {currentStep === 0 ? (
          <FormHocPhan afterAddNew={() => setCurrentStep(1)} />
        ) : (
          <ModalDeCuongHocPhan />
        )} */}
      {/* </Card> */}
    </Modal>
  );
};

export default ModalHocPhan;
