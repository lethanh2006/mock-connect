import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';
import { type DiemHocPhan } from '@/services/DaoTao/DiemHocPhan/typing';
import { ELoaiHocPhanCTDT } from '@/services/DaoTao/constant';
import rules from '@/utils/rules';
import { convertNumberScoreToAlphabet } from '@/utils/utils';
import {
  Col,
  Descriptions,
  Form,
  Input,
  Modal,
  Popover,
  Radio,
  Row,
  type RadioChangeEvent,
  Card,
  Button,
} from 'antd';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

const MayTinhThongMinh = () => {
  const { getDiemSinhVienModel, loading, tongTuChon } = useModel('daotao.diemhocphan');
  const [danhSach, setDanhSach] = useState<DiemHocPhan.IDiemSinhVien[]>();
  const [record, setRecord] = useState<DiemHocPhan.IDiemSinhVien>();
  const [tongKet, setTongKet] = useState<number>(0);
  const [tuChonCoDiem, setTuChonCoDiem] = useState<number>(0);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [showAll, setShowAll] = useState<boolean>(false);
  const [form] = Form.useForm();

  const tinhDiemTongKet = (data: DiemHocPhan.IDiemSinhVien[]) => {
    const sum = _.sumBy(data, (item) => {
      const diem = (item.diemDuKienThang4 ?? item.diemThang4 ?? 0) * (item.soTinChi ?? 0);
      return diem;
    });
    const tinchi = _.sumBy(data, (item) =>
      item.diemDuKienThang4 || item.diemThang4 ? item.soTinChi ?? 0 : 0,
    );
    setTongKet(Math.round(tinchi === 0 ? 0 : (sum * 100) / tinchi) / 100);

    const monTuChonCoDiem = data.filter(
      (item) =>
        item.loaiHocPhanCtdt === ELoaiHocPhanCTDT.TU_CHON &&
        (item.diemDuKienThang4 || item.diemThang4),
    );
    setTuChonCoDiem(_.sumBy(monTuChonCoDiem, (item) => item.soTinChi ?? 0));
  };

  const fetch = async () => {
    await getDiemSinhVienModel().then((data) => {
      tinhDiemTongKet(data);
      setDanhSach(data);
    });
  };

  useEffect(() => {
    fetch();
  }, []);

  const onOk = (values: any) => {
    const data = danhSach?.map((item) =>
      item.ma === record?.ma
        ? {
            ...record,
            diemDuKien: parseFloat(values.diemDuKien) || undefined,
            diemDuKienThang4:
              parseFloat(convertNumberScoreToAlphabet(values.diemDuKien)[1]) || undefined,
          }
        : item,
    );
    tinhDiemTongKet(data ?? []);
    setDanhSach(data);
    setModalVisible(false);
  };

  const onCell = (rec: DiemHocPhan.IDiemSinhVien) => ({
    onClick: () => {
      setRecord(rec);
      form.setFieldsValue({
        diemDuKien: rec?.diemDuKien ?? rec?.diemTongKet ?? undefined,
      });
      setModalVisible(true);
    },
    style: { cursor: 'pointer' },
  });

  const columns: IColumn<DiemHocPhan.IDiemSinhVien>[] = [
    {
      dataIndex: 'ten',
      title: 'Tên học phần',
      width: 150,
      render: (s, r) => (
        <span style={r.loaiHocPhanCtdt === ELoaiHocPhanCTDT.TU_CHON ? { fontStyle: 'italic' } : {}}>
          {s} {r.loaiHocPhanCtdt === ELoaiHocPhanCTDT.TU_CHON ? '(tự chọn)' : ''}
        </span>
      ),
      onCell,
    },
    {
      dataIndex: 'soTinChi',
      title: 'Số tín chỉ',
      width: 60,
      align: 'center',
      onCell,
    },
    {
      dataIndex: 'diemThang4',
      title: 'Điểm tổng kết (hệ 4)',
      // render: (s, r) => (
      //   <b style={r.is_danh_gia ? (r.trang_thai === 'Không đạt' ? { color: 'red' } : {}) : {}}>
      //     {Object.hasOwn(r, 'is_danh_gia') ? (r.is_danh_gia ? s : '--') : ''}
      //   </b>
      // ),
      width: 80,
      align: 'center',
      onCell,
    },
    {
      dataIndex: 'diemDuKien',
      title: 'Điểm dự kiến (hệ 10)',
      render: (s) => <b>{s}</b>,
      width: 80,
      align: 'center',
      onCell,
    },
    {
      dataIndex: 'diemDuKienThang4',
      title: 'Điểm dự kiến (hệ 4)',
      render: (s) => <b>{s}</b>,
      width: 80,
      align: 'center',
      onCell,
    },
  ];

  return (
    <>
      <Row gutter={[12, 12]}>
        {/* <Text italic style={{ marginBottom: '16px' }}>
        * Lưu ý: Những điểm &#34;--&#34; là do bạn chưa đánh giá giảng viên. Vui lòng đánh giá để
        xem điểm!
      </Text> */}
        <Col span={24}>
          Tại đây sinh viên có thể thực hiện &quot;giả lập điểm&quot;, để chủ động trong việc đăng
          ký học lại, học cải thiện.{' '}
          <Popover
            content={
              <div style={{ maxWidth: 600 }}>
                Bước 1: Sinh viên ấn vào môn muốn nhập điểm cải thiện;
                <br />
                Bước 2: Tại popup Giả lập điểm, sinh viên nhập điểm mong muốn (chỉ nhập điểm từ 4 -
                10) tại trường <b>Điểm dự kiến sau khi học lại / cải thiện (hệ 10)</b>;
                <br />
                Bước 3: Ấn OK.
                <br />
                Hệ thống sẽ tự động quy đổi điểm từ hệ 10 sang hệ 4 và tính lại điểm trung bình tích
                lũy hệ 4
              </div>
            }
          >
            <a>(Xem thêm)</a>
          </Popover>
        </Col>
        <Col span={24}>
          Điểm tổng kết dự kiến sau khi đã cải thiện và học lại:{' '}
          {/* Hệ 10:{' '}
        <b style={{ fontSize: '1.5rem',  }}>{tongKet}</b>
        <Divider type="vertical" /> */}
          <b style={{ fontSize: '1.5rem' }} className="text-primary">
            {tongKet}
          </b>
          /4
          {/* <Divider type="vertical" />
        Dạng chữ: <b style={{ fontSize: '1.5rem',  }}>{chuDuKien}</b> */}
        </Col>
        <Col span={24}>
          Số tín chỉ tự chọn đã có điểm:{' '}
          <b style={{ color: tuChonCoDiem === tongTuChon ? '#2ec94f' : '#f36f52' }}>
            {tuChonCoDiem} / {tongTuChon}
          </b>{' '}
          (tổng số tín chỉ tự chọn phải học).
        </Col>

        <Col span={24} style={{ textAlign: 'center' }}>
          <Radio.Group
            optionType="button"
            value={showAll}
            onChange={({ target: { value } }: RadioChangeEvent) => setShowAll(value)}
            options={[
              { label: 'Hiển thị các môn đã học', value: false },
              { label: 'Tất cả các môn học', value: true },
            ]}
          />
        </Col>

        <Col span={24}>
          <TableStaticData
            columns={columns}
            data={
              danhSach?.filter(
                (item) => showAll || (item.trangThai && item.trangThai !== 'Chưa có điểm'),
              ) ?? []
            }
            otherProps={{ scroll: { y: 600 } }}
            addStt
            loading={loading}
            hasTotal
          />
        </Col>
      </Row>

      <Modal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        width={600}
        footer={null}
        bodyStyle={{ padding: 0 }}
      >
        <Card title="Giả lập điểm">
          <Descriptions column={1}>
            <Descriptions.Item label="Tên học phần">{record?.ten}</Descriptions.Item>
            <Descriptions.Item label="Mã học phần">{record?.ma}</Descriptions.Item>
            <Descriptions.Item label="Số tín chỉ">{record?.soTinChi}</Descriptions.Item>
            <Descriptions.Item label="Điểm tổng kết (hệ 10)">
              {record?.diemTongKet}
            </Descriptions.Item>
            <Descriptions.Item label="Điểm tổng kết (hệ 4)">{record?.diemThang4}</Descriptions.Item>
            <Descriptions.Item label="Điểm tổng kết (dạng chữ)">
              {record?.diemChu}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">{record?.trangThai}</Descriptions.Item>
          </Descriptions>

          <Form form={form} layout="vertical" onFinish={onOk}>
            <Form.Item
              name="diemDuKien"
              label="Điểm dự kiến sau khi học lại / cải thiện (hệ 10)"
              rules={[...rules.number(10, 4)]}
            >
              <Input placeholder="Nhập điểm dự kiến" />
            </Form.Item>

            <div className="form-footer">
              <Button htmlType="submit" type="primary">
                Đồng ý
              </Button>
              <Button onClick={() => setModalVisible(false)}>Hủy</Button>
            </div>
          </Form>
        </Card>
      </Modal>
    </>
  );
};

export default MayTinhThongMinh;
