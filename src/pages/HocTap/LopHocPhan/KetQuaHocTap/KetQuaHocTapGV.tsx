import TableBaseStatic from '@/components/OldTable/Table';
import type { LopTinChi } from '@/services/LopTinChi/typings';
import rules from '@/utils/rules';
import { CloseOutlined, FileOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, Form, Input, message, Modal, Popconfirm } from 'antd';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import DiemCong from '../DiemCong';
import { type IColumn } from '@/components/Table/typing';

const KetQuaHocTapGV = (props: { id: number; isDisplay: boolean }) => {
  const {
    getBangDiemModel,
    loading,
    danhSachKetQuaHocTap,
    setDanhSachKetQuaHocTap,
    giangVienNhapDiemModel,
  } = useModel('hoctap.loptinchi');
  const [edit, setEdit] = useState<boolean>(false);
  const [isTiengAnh, setIsTiengAnh] = useState<boolean>(false);
  const [modalDiemCong, setModalDiemCong] = useState<boolean>(false);
  const [recordKetQua, setRecordKetQua] = useState<LopTinChi.KetQuaHocTap>();
  const [form] = Form.useForm();

  useEffect(() => {
    if (props.id && props.isDisplay && !edit) getBangDiemModel(props.id);

    return () => {
      setDanhSachKetQuaHocTap([]);
    };
  }, [props.id, props.isDisplay]);

  useEffect(() => {
    setIsTiengAnh(danhSachKetQuaHocTap?.[0]?.is_diem_tieng_anh ?? false);
  }, [danhSachKetQuaHocTap?.[0]?.is_diem_tieng_anh]);

  const onFinish = async () => {
    form
      .validateFields()
      .then((values) => {
        const danhSachDiem: LopTinChi.KetQuaHocTap[] = [];
        danhSachKetQuaHocTap?.forEach((item) => {
          if (isTiengAnh || values?.[item.ma_dinh_danh]?.diem_attendance >= 0)
            danhSachDiem.push({
              ...values?.[item.ma_dinh_danh],
              is_diem_tieng_anh: isTiengAnh,
              id: item.id,
              sinh_vien_id: item.sinh_vien_id,
              //diem_cuoi_ky: values?.[item.ma_dinh_danh]?.diem_cuoi_ky?.toString() ?? '',
              //diem_doc: values?.[item.ma_dinh_danh]?.diem_doc?.toString() ?? '',
              //diem_nghe: values?.[item.ma_dinh_danh]?.diem_nghe?.toString() ?? '',
              //diem_viet: values?.[item.ma_dinh_danh]?.diem_viet?.toString() ?? '',
              //diem_noi: values?.[item.ma_dinh_danh]?.diem_noi?.toString() ?? '',
              //diem_tong_tieng_anh: values?.[item.ma_dinh_danh]?.diem_tong_tieng_anh?.toString() ?? '',
              diem_attendance: +values?.[item.ma_dinh_danh]?.diem_attendance,
              diem_trung_binh_kiem_tra_tren_lop:
                +values?.[item.ma_dinh_danh]?.diem_trung_binh_kiem_tra_tren_lop,
              diem_bai_tap: +values?.[item.ma_dinh_danh]?.diem_bai_tap,
              diem_thi_nghiem: +values?.[item.ma_dinh_danh]?.diem_thi_nghiem,
            });
        });

        giangVienNhapDiemModel(Number(props.id), { danhSachDiem })
          .then()
          .finally(() => setEdit(false));
      })
      .catch((error) => {
        console.log(error);
        message.error('Có lỗi xảy ra, vui lòng kiểm tra lại');
      });
  };

  const renderInput = (
    name: string[],
    initialValue: any,
    mode: 'number' | 'string',
    hasDecimal: boolean = true,
  ) => (
    <Form.Item
      style={{ marginBottom: 0 }}
      initialValue={initialValue === false || initialValue === 'false' ? '' : initialValue}
      name={name}
      rules={mode === 'number' ? [...rules.number(10, 0, hasDecimal)] : undefined}
    >
      <Input />
    </Form.Item>
  );

  const columns: IColumn<LopTinChi.KetQuaHocTap>[] = [
    {
      title: 'Họ tên',
      dataIndex: 'name',
      filterType: 'string',
      width: 120,
    },
    {
      title: 'Mã sinh viên',
      dataIndex: 'ma_dinh_danh',
      align: 'center',
      width: 100,
      filterType: 'string',
    },
    {
      title: 'Điểm cộng',
      align: 'center',
      width: 90,
      render: (s, r) => (
        <a>{_.sumBy(r.diemCong?.[0]?.lichSuDiem ?? [], (item) => item.soDiemCong)}</a>
      ),
      onCell: (r) => ({
        onClick: () => {
          setRecordKetQua(r);
          setModalDiemCong(true);
        },
        style: { cursor: 'pointer' },
      }),
    },
    {
      title: 'Điểm chuyên cần',
      dataIndex: 'diem_attendance',
      align: 'center',
      width: 90,
      hide: isTiengAnh,
      render: (val, record) => {
        return edit ? (
          renderInput(
            [record.ma_dinh_danh, 'diem_attendance'],
            record.diem_attendance,
            'number',
            false,
          )
        ) : (
          <div>{val !== undefined && val !== false && val !== '' ? val : '--'}</div>
        );
      },
    },
    {
      title: 'Điểm bài tập',
      dataIndex: 'diem_bai_tap',
      align: 'center',
      hide: isTiengAnh,
      width: 90,
      render: (val, record) => {
        return edit ? (
          renderInput([record.ma_dinh_danh, 'diem_bai_tap'], record.diem_bai_tap, 'number')
        ) : (
          <div>{val !== undefined && val !== false && val !== '' ? val : '--'}</div>
        );
      },
    },
    {
      title: 'Điểm thí nghiệm',
      dataIndex: 'diem_thi_nghiem',
      align: 'center',
      width: 90,
      hide: isTiengAnh,
      render: (val, record) => {
        return edit ? (
          renderInput([record.ma_dinh_danh, 'diem_thi_nghiem'], record.diem_thi_nghiem, 'number')
        ) : (
          <div>{val !== undefined && val !== false && val !== '' ? val : '--'}</div>
        );
      },
    },
    {
      title: 'Điểm kiểm tra trên lớp',
      dataIndex: 'diem_trung_binh_kiem_tra_tren_lop',
      align: 'center',
      width: 90,
      hide: isTiengAnh,
      render: (val, record) => {
        return edit ? (
          renderInput(
            [record.ma_dinh_danh, 'diem_trung_binh_kiem_tra_tren_lop'],
            record.diem_trung_binh_kiem_tra_tren_lop,
            'number',
          )
        ) : (
          <div>{val !== undefined && val !== false && val !== '' ? val : '--'}</div>
        );
      },
    },
    {
      title: 'Điểm cuối kỳ',
      dataIndex: 'diem_cuoi_ky',
      align: 'center',
      hide: isTiengAnh,
      width: 90,
      render: (val) => (val !== undefined && val !== false && val !== '' ? val : '--'),
    },

    {
      title: 'Điểm nghe',
      dataIndex: 'diem_nghe',
      align: 'center',
      hide: !isTiengAnh,
      width: 90,
      render: (val, record) => {
        return edit ? (
          renderInput([record.ma_dinh_danh, 'diem_nghe'], record.diem_nghe, 'string')
        ) : (
          <div>{val !== undefined && val !== false && val !== '' ? val : '--'}</div>
        );
      },
    },
    {
      title: 'Điểm nói',
      dataIndex: 'diem_noi',
      align: 'center',
      hide: !isTiengAnh,
      width: 90,
      render: (val, record) => {
        return edit ? (
          renderInput([record.ma_dinh_danh, 'diem_noi'], record.diem_noi, 'string')
        ) : (
          <div>{val !== undefined && val !== false && val !== '' ? val : '--'}</div>
        );
      },
    },
    {
      title: 'Điểm đọc',
      dataIndex: 'diem_doc',
      align: 'center',
      width: 90,
      hide: !isTiengAnh,
      render: (val, record) => {
        return edit ? (
          renderInput([record.ma_dinh_danh, 'diem_doc'], record.diem_doc, 'string')
        ) : (
          <div>{val !== undefined && val !== false && val !== '' ? val : '--'}</div>
        );
      },
    },
    {
      title: 'Điểm viết',
      dataIndex: 'diem_viet',
      align: 'center',
      width: 90,
      hide: !isTiengAnh,
      render: (val, record) => {
        return edit ? (
          renderInput([record.ma_dinh_danh, 'diem_viet'], record.diem_viet, 'string')
        ) : (
          <div>{val !== undefined && val !== false && val !== '' ? val : '--'}</div>
        );
      },
    },

    {
      title: 'Điểm tổng',
      dataIndex: 'diem_tong_tieng_anh',
      align: 'center',
      hide: !isTiengAnh,
      width: 90,
      render: (val, record) => {
        return edit ? (
          renderInput(
            [record.ma_dinh_danh, 'diem_tong_tieng_anh'],
            record.diem_tong_tieng_anh,
            'string',
          )
        ) : (
          <div>{val !== undefined && val !== false && val !== '' ? val : '--'}</div>
        );
      },
    },
    // {
    //   title: 'Điểm tổng kết (hệ 10)',
    //   align: 'center',
    //   // fixed: 'right',
    //   dataIndex: 'diem_tong_ket',
    //   render: (val) => <b>{val}</b>,
    //   width: 90,
    // },
    // {
    //   title: 'Điểm tổng kết (hệ 4)',
    //   align: 'center',
    //   // fixed: 'right',
    //   dataIndex: 'diem_tong_ket_thang_4',
    //   render: (val) => <b>{val}</b>,
    //   width: 90,
    // },
    // {
    //   title: 'Điểm tổng kết (dạng chữ)',
    //   align: 'center',
    //   // fixed: 'right',
    //   dataIndex: 'diem_tong_ket_dang_chu',
    //   render: (val, record) => (
    //     <b>{val ? val : convertNumberScoreToAlphabet(record?.diem_tong_ket ?? '')}</b>
    //   ),
    //   width: 90,
    // },
  ];

  return (
    <>
      <Form form={form}>
        {!edit ? (
          <Button
            icon={<FileOutlined />}
            onClick={() => {
              setEdit(true);
            }}
            style={{ marginBottom: 8 }}
            type="primary"
          >
            Nhập điểm
          </Button>
        ) : (
          <>
            {/* <Checkbox
            checked={isTiengAnh}
            onChange={(e) => {
              setIsTiengAnh(e.target.checked);
            }}
          />{' '}
          Là học phần tiếng anh */}
            <Popconfirm
              title={
                <>
                  Xác nhận lưu điểm cho sinh viên?
                  <br />
                  Lưu ý: Bỏ Tìm kiếm trước khi thực hiện Lưu
                </>
              }
              onConfirm={onFinish}
            >
              <Button
                icon={<SaveOutlined />}
                style={{ marginBottom: 8, marginRight: 8 }}
                type="primary"
              >
                Lưu
              </Button>
            </Popconfirm>
            <Button onClick={() => setEdit(false)} icon={<CloseOutlined />}>
              Hủy
            </Button>
          </>
        )}

        <TableBaseStatic
          hasTotal
          data={danhSachKetQuaHocTap?.map((item, index) => {
            return { ...item, index: index + 1 };
          })}
          otherProps={{
            pagination: false,
            loading,
            scroll: { x: 900 },
          }}
          addStt
          columns={columns?.filter((item) => item?.hide !== true)}
        />
      </Form>

      <Modal
        visible={modalDiemCong}
        title="Điểm cộng sinh viên"
        onCancel={() => {
          setModalDiemCong(false);
        }}
        okButtonProps={{ hidden: true }}
        cancelText="Đóng"
        width={800}
      >
        <DiemCong
          data={recordKetQua?.diemCong?.[0]?.lichSuDiem ?? []}
          ma_dinh_danh={recordKetQua?.ma_dinh_danh ?? ''}
          lop_tin_chi_id={props.id}
          name={recordKetQua?.name}
          add={false}
        />
      </Modal>
    </>
  );
};

export default KetQuaHocTapGV;
