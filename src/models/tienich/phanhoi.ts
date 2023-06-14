import useInitModel from '@/hooks/useInitModel';
import { postPhanHoiUser } from '@/services/TienIch/PhanHoi/phanhoi';
import { message } from 'antd';
import { useState } from 'react';

export default () => {
  const objInit = useInitModel<PhanHoi.IRecord>('phan-hoi');
  const { setLoading, setVisibleForm, getModel } = objInit;
  const [daTraLoi, setDaTraLoi] = useState<boolean>(false);
  const userPostPhanHoiModel = async (payload: { noiDungPhanHoi: string }) => {
    setLoading(true);
    try {
      await postPhanHoiUser(payload);
      message.success('Gửi phản hồi thành công');
      setVisibleForm(false);
      getModel();
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  return {
    ...objInit,
    userPostPhanHoiModel,
    daTraLoi,
    setDaTraLoi,
  };
};
