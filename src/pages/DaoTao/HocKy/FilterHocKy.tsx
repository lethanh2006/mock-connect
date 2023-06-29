import { useState } from 'react';
import SelectHocKy from './SelectHocKy';
import { useModel } from 'umi';
import { Button, Tooltip } from 'antd';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import SelectNamHoc from '../NamHoc/Select';

const FilterHocKy = (props: { width?: number; isSetHocKy?: boolean; allowClear?: boolean }) => {
  const {
    record: recHocKy,
    danhSach: danhSachHocKy,
    setRecord: setHocKy,
  } = useModel('daotao.hocky');
  // const [trinhDoDaoTaoId, setTrinhDoDaoTaoId] = useState<string>();
  // const [hinhThucDaoTaoId, setHinhThucDaoTaoId] = useState<string>();
  const [namHocId, setNamHocId] = useState<string>();
  const [visibleOption, setVisibleOption] = useState(false);
  const width = props.width ?? 250;

  return (
    <>
      {visibleOption ? (
        <Tooltip title="Ẩn bộ lọc">
          <Button icon={<MinusOutlined />} onClick={() => setVisibleOption(false)} type="dashed" />
        </Tooltip>
      ) : (
        <Tooltip title="Mở rộng bộ lọc">
          <Button icon={<PlusOutlined />} onClick={() => setVisibleOption(true)} type="dashed" />
        </Tooltip>
      )}

      {visibleOption ? (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {/* <SelectTrinhDo style={{ width }} allowClear onChange={(val) => setTrinhDoDaoTaoId(val)} />
          <SelectHinhThuc
            style={{ width }}
            allowClear
            onChange={(val) => setHinhThucDaoTaoId(val)}
          /> */}
          <SelectNamHoc
            style={{ width }}
            allowClear
            // condition={{ hinhThucDaoTaoId, trinhDoDaoTaoId }}
            onChange={(val) => setNamHocId(val)}
          />
        </div>
      ) : null}

      <SelectHocKy
        style={{ width }}
        allowClear={props.allowClear}
        condition={{ namHocId }}
        value={recHocKy?._id}
        onChange={(val) => setHocKy(danhSachHocKy.find((item) => item._id === val))}
        isSetRecord={props.isSetHocKy && !recHocKy?._id}
      />
    </>
  );
};

export default FilterHocKy;
