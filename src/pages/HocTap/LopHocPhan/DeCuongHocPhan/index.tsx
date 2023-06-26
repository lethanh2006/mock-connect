import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Divider, Popconfirm, Switch, Tooltip } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import ModalDeCuongHocPhan from './components/ModalDeCuongHocPhan';

const DeCuongHocPhanPage = () => {
  const {
    setEdit,
    setVisibleForm,
    setRecord,
    getModel,
    page,
    limit,
    deleteModel,
    putModel,
    setDanhSach,
  } = useModel('hocphan.decuonghocphan');
  const { record: recLopTinChi } = useModel('hoctap.loptinchi');
  const { record: recHocPhan } = useModel('hocphan.hocphan');
  const [visibleCanCu, setVisibleCanCu] = useState<boolean>(false);
  const [vanBanId, setVanBanId] = useState<string>();

  useEffect(() => {
    setDanhSach([
      {
        _id: 'string',
        ma: 'string',
        hocPhanId: 'string',
        nguoiBienSoan: 'string',
        ngayApDung: 'string',
        canCuId: 'string',
        mucTieuHocPhan: 'string',
        noiDungTomTat: 'string',
        noiDungChiTiet: 'string',
        active: true,
        createdAt: 'string',
        updatedAt: 'string',
      },
    ]);
  }, []);

  const onCell = (record: HocPhan.IDeCuongHocPhan) => ({
    onClick: () => {
      setRecord(record);
      setEdit(true);
      setVisibleForm(true);
    },
    style: { cursor: 'pointer' },
  });

  const columns: IColumn<HocPhan.IDeCuongHocPhan>[] = [
    {
      title: 'Phiên bản',
      dataIndex: 'ma',
      width: 120,
      filterType: 'string',
      onCell,
    },
    {
      title: 'Người biên soạn',
      dataIndex: 'nguoiBienSoan',
      width: 120,
      filterType: 'string',
      onCell,
    },
    {
      title: 'Ngày áp dụng',
      dataIndex: 'ngayApDung',
      width: 120,
      align: 'center',
      sortable: true,
      render: (val) => val && moment(val).format('DD/MM/YYYY'),
      onCell,
    },
    // {
    //   title: 'Căn cứ pháp lý',
    //   dataIndex: 'canCuId',
    //   width: 120,
    //   render: (val, rec) => (
    //     <>
    //       {val ? (
    //         <a
    //           onClick={() => {
    //             setVanBanId(rec?.canCuId);
    //             setVisibleCanCu(true);
    //           }}
    //         >
    //           <EyeOutlined /> {rec?.canCu?.ma ?? 'Xem chi tiết'}
    //         </a>
    //       ) : (
    //         'Chưa cập nhật'
    //       )}
    //     </>
    //   ),
    // },
  ];

  return (
    <>
      <TableBase
        columns={columns}
        params={{ lopHocPhanId: recLopTinChi?._id }}
        dependencies={[page, limit]}
        modelName="hocphan.decuonghocphan"
        title="Đề cương chi tiết học phần"
        Form={ModalDeCuongHocPhan}
        widthDrawer={800}
        hideCard
        buttons={{ filter: false, reload: false, create: false }}
      />
    </>
  );
};

export default DeCuongHocPhanPage;
