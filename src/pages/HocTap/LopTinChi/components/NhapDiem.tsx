import { Checkbox } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const NhapDiem = (props: { id: number }) => {
  const { getBangDiemModel } = useModel('hoctap.loptinchi');

  useEffect(() => {
    if (props.id) getBangDiemModel(props.id);
  }, [props.id]);

  return (
    <div>
      <Checkbox /> Là học phần tiếng Anh
    </div>
  );
};

export default NhapDiem;
