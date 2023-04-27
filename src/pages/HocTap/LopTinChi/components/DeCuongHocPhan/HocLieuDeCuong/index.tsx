import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { EyeOutlined } from '@ant-design/icons';
import { Switch } from 'antd';
import { useState } from 'react';
import { useModel } from 'umi';

const HocLieuDeCuongPage = () => {
  const { getModel, page, limit, putModel } = useModel('hocphan.hoclieudecuong');
  const { record: recDeCuong } = useModel('hocphan.decuonghocphan');
  const [visibleVanBan, setVisibleVanBan] = useState<boolean>(false);
  const [hocLieuId, setHocLieuId] = useState<string>();

  const columns: IColumn<HocPhan.IHocLieuDeCuong>[] = [
    {
      title: 'Tên học liệu',
      width: 150,
      render: (val, rec) => rec.hocLieu?.ten,
    },
    {
      title: 'Loại học liệu',
      width: 120,
      render: (val, rec) => rec.hocLieu?.loaiHocLieu,
    },
    {
      title: 'Bắt buộc',
      width: 100,
      dataIndex: 'batBuoc',
      align: 'center',
      render: (val, rec) => (
        <Switch
          checked={val}
          onChange={(checked) =>
            putModel(rec._id, { ...rec, batBuoc: checked }, () =>
              getModel({ deCuongId: recDeCuong?._id }),
            )
          }
        />
      ),
    },
    {
      title: 'Học liệu',
      width: 120,
      align: 'center',
      dataIndex: 'hocLieuId',
      render: (val, rec) =>
        rec.hocLieu?.url ? (
          <a
            onClick={() => {
              setHocLieuId(val);
              setVisibleVanBan(true);
            }}
          >
            <EyeOutlined /> Xem chi tiết
          </a>
        ) : (
          'Chưa cập nhật'
        ),
    },
  ];

  return (
    <>
      <TableBase
        columns={columns}
        dependencies={[page, limit]}
        params={{ deCuongId: recDeCuong?._id }}
        modelName="hocphan.hoclieudecuong"
        title="Đề cương học liệu"
        hideCard
        buttons={{ reload: false, create: false }}
      />
    </>
  );
};

export default HocLieuDeCuongPage;
