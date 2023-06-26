import { Button, Empty } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import DetailKetQuaHocTap from './Detail';

const KetQuaHocTapSV = (props: { id: number; onSetActiveTab?: any; isDisplay?: boolean }) => {
  const [hasDiem, setHasDiem] = useState(false);
  const [desc, setDesc] = useState('');
  const { sinhVienGetKetQuaHocTapByIdLopTinChiModel, ketQuaHocTap } = useModel('hoctap.loptinchi');

  useEffect(() => {
    if (props.id && props.isDisplay)
      sinhVienGetKetQuaHocTapByIdLopTinChiModel(props.id)
        .then((_) => {
          setHasDiem(true);
        })
        .catch((error) => {
          setHasDiem(false);
          if (error.response.data.errorDescription === 'NO_DIEM') {
            setDesc('Hiện tại điểm của bạn chưa được cập nhật!');
          } else if (error.response.data.errorDescription === 'NOT_DGGV') {
            setDesc('Bạn cần đánh giá giảng viên!');
          }
        });
  }, [props.isDisplay, props.id]);

  if (hasDiem)
    return (
      <DetailKetQuaHocTap onSetActiveTab={props.onSetActiveTab} ketQuaHocTap={[ketQuaHocTap]} />
    );
  if (!hasDiem && desc === 'Hiện tại điểm của bạn chưa được cập nhật!')
    return (
      <Empty
        description={desc}
        style={{
          height: '300px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      />
    );
  return (
    <>
      <Empty
        description={desc}
        style={{
          height: '300px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <Button onClick={props.onSetActiveTab} type="primary">
          Đánh giá giảng viên
        </Button>
      </Empty>
    </>
  );
};

export default KetQuaHocTapSV;
