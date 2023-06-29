import { Modal } from 'antd';
import TabsDeCuongHocPhan from './components/TabsDeCuongHocPhan';
import { useModel } from 'umi';
import { useEffect } from 'react';

const ModalHocPhan = (props: { title?: string; visible: boolean; setVisible: any }) => {
  const { title, visible, setVisible } = props;
  const { record } = useModel('daotao.lophocphan');
  const { getByIdModel } = useModel('hocphan.decuonghocphan');

  useEffect(() => {
    if (record?.deCuongHpHk?.deCuongId || record?.hocPhan?.deCuongHienTaiId)
      getByIdModel((record?.deCuongHpHk?.deCuongId || record?.hocPhan?.deCuongHienTaiId) ?? '');
  }, [record?._id]);

  return (
    <Modal
      title={title ?? ''}
      visible={visible}
      width={800}
      onCancel={() => setVisible(false)}
      okButtonProps={{ hidden: true }}
      cancelText="Đóng"
      bodyStyle={{ paddingTop: 0 }}
    >
      <TabsDeCuongHocPhan />
    </Modal>
  );
};

export default ModalHocPhan;
