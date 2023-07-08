import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import {
  EColorLopDangKy,
  ELoaiDangKyTinChi,
  ETrangThaiDangKyTinChi,
  LoaiHocPhanDangKyTinChi,
} from '@/services/DaoTao/DangKyTinChi/constant';
import { ELoaiLopHocPhan } from '@/services/HocTap/LopHocPhan/constant';
import { type LopHocPhan } from '@/services/HocTap/LopHocPhan/typings';
import { Empty } from 'antd';
import { type TableRowSelection } from 'antd/lib/table/interface';
import { useModel } from 'umi';
import FilterHocPhanDKTC from './FilterHocPhan';

const DangKyLopHocPhan = () => {
  const { record: recHocKy } = useModel('daotao.hocky');
  const { page, limit, danhSach } = useModel('daotao.lophocphan');
  const { danhSachLopDangKy, hocPhanDangKy, setDanhSachLopDangKy, loaiHocPhan } =
    useModel('daotao.dotdangkytinchi');
  const dangKyRoi = danhSachLopDangKy.find(
    // Học phần đang chọn đã được đăng ký 1 lớp nào đó rồi
    (item) =>
      item.maHocPhan === hocPhanDangKy?.maMonHoc &&
      item.trangThai !== ETrangThaiDangKyTinChi.CHUA_DANG_KY,
  );

  const onCell = (rec: LopHocPhan.IRecord) => ({
    style: {
      background: rec.siSoToiDa - (rec.siSo ?? 0) <= 0 ? EColorLopDangKy.FULL_LOP : undefined,
    },
  });

  const rowSelection: TableRowSelection<LopHocPhan.IRecord> = {
    hideSelectAll: true,
    preserveSelectedRowKeys: true,
    // type: 'radio',
    selectedRowKeys: danhSachLopDangKy?.map((item) => item.ten),

    onChange: (selectedRowKeys, selectedRows) => {
      const lopVuaChon = selectedRows?.at(-1);
      // Nếu chọn ít nhất 1 lớp và chưa đăng ký
      if (lopVuaChon && !dangKyRoi) {
        const temp = danhSachLopDangKy.filter((item) => item.maHocPhan !== lopVuaChon.maHocPhan); // Bỏ những lớp khác
        let soTinChi = lopVuaChon.stc ?? lopVuaChon.deCuong?.deCuong?.soTinChi ?? 0;
        // Nếu lớp vừa chọn là lớp thực hành thì lấy số tín chỉ của lớp cha nó
        if (!soTinChi && lopVuaChon.tenCha) {
          const lopCha = danhSach.find((item) => item.ten === lopVuaChon.tenCha);
          soTinChi = lopCha?.stc ?? lopCha?.deCuong?.deCuong?.soTinChi ?? 0;
        }
        // Thêm lớp vừa chọn vào danh sách Lớp đăng ký
        temp.splice(0, 0, {
          ...lopVuaChon,
          soTinChi,
          loaiDangKy: Object.values(ELoaiDangKyTinChi).includes(
            LoaiHocPhanDangKyTinChi[loaiHocPhan] as ELoaiDangKyTinChi,
          )
            ? (LoaiHocPhanDangKyTinChi[loaiHocPhan] as ELoaiDangKyTinChi)
            : ELoaiDangKyTinChi.DK_LAN_DAU,
          trangThai: ETrangThaiDangKyTinChi.CHUA_DANG_KY,
        });
        setDanhSachLopDangKy(temp);
      }
    },

    getCheckboxProps: (record) => ({
      disabled:
        !!dangKyRoi || !!record.children?.length || record.siSoToiDa - (record.siSo ?? 0) <= 0,
    }),
  };

  const columns: IColumn<LopHocPhan.IRecord>[] = [
    {
      title: 'Lớp học phần',
      dataIndex: 'ten',
      width: 220,
      onCell,
    },
    {
      title: 'Lịch học',
      width: 300,
      render: (val, rec) => (
        <ul className="lich-hoc">
          {rec.maHoaLichHoc
            ?.sort((a, b) => a.thu - b.thu)
            ?.map((item, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <li key={index}>
                {item.thu < 7 ? `T${item.thu + 1}` : 'CN'} ({item.tietBatDau}-
                {item.tietBatDau + item.soTiet - 1}), tuần{' '}
                {item.danhSachTuan
                  .map((j) => j.tuan)
                  .sort((a, b) => a - b)
                  .join(',')}
              </li>
            ))}
        </ul>
      ),
      onCell,
    },
    {
      title: 'Sĩ số',
      dataIndex: 'siSo',
      align: 'center',
      width: 60,
      onCell,
    },
    {
      title: 'Còn trống',
      align: 'center',
      width: 60,
      render: (val, rec) => rec.siSoToiDa - (rec.siSo ?? 0),
      onCell,
    },
    {
      title: 'Giảng viên',
      width: 120,
      render: (val, rec) => rec.nhanSuList?.map((item) => `${item.hoDem} ${item.ten}`).join(', '),
      onCell,
    },
  ];

  return (
    <>
      <FilterHocPhanDKTC />

      {hocPhanDangKy?.maMonHoc ? (
        <TableBase
          columns={columns}
          dependencies={[page, limit, recHocKy?.ma, hocPhanDangKy?.maMonHoc]}
          params={{
            maHocKy: recHocKy?.ma,
            loai: ELoaiLopHocPhan.CHINH,
            maHocPhan: hocPhanDangKy?.maMonHoc,
          }}
          // getData={sinhVienGetModel}
          modelName="daotao.lophocphan"
          hideCard
          buttons={{ create: false, reload: false, filter: false }}
          hideTotal
          addStt={false}
          rowSelection
          detailRow={rowSelection}
          otherProps={{
            rowKey: 'ten',
            expandable: { expandRowByClick: true, indentSize: 10 },
          }}
        />
      ) : (
        <Empty
          description={<i style={{ color: '#999' }}>Vui lòng chọn học phần muốn đăng ký</i>}
          style={{ marginTop: 30, marginBottom: 30 }}
        />
      )}
    </>
  );
};

export default DangKyLopHocPhan;
