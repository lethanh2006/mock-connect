// import { sinhVienGetGiaLapDiem } from '@/services/LopTinChi/ketquahoctap';
import { type IColumn } from '@/components/Table/typing';
import rules from '@/utils/rules';
import { convert4NumberScoreToAlphabet, convertNumberScoreToAlphabet } from '@/utils/utils';
import { Col, Descriptions, Form, Input, Modal, Popover, Row, Table, Typography } from 'antd';
import _ from 'lodash';
import { useEffect, useState } from 'react';

const GiaLapDiem = () => {
  const [danhSachDiem, setDanhSachDiem] = useState<LopTinChi.IGiaLapDiem[]>();
  const [record, setRecord] = useState<LopTinChi.IGiaLapDiem>();
  const [tongKet, setTongKet] = useState<number>(0);
  const [tongTuChon, setTongTuChon] = useState<number>(0);
  const [tuChonCoDiem, setTuChonCoDiem] = useState<number>(0);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [showAll, setShowAll] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const chuDuKien = convert4NumberScoreToAlphabet(tongKet);
  const [form] = Form.useForm();
  const { Text } = Typography;

  const tinhDiemTongKet = (data: LopTinChi.IGiaLapDiem[]) => {
    const sum = _.sumBy(data, (item) => {
      const diem = (item.diem_du_kien_4 ?? item.diem_thang_4 ?? 0) * (item.so_tin_chi ?? 0);
      return diem;
    });
    const tinchi = _.sumBy(data, (item) =>
      item.diem_du_kien_4 || item.diem_thang_4 ? item.so_tin_chi : 0,
    );
    setTongKet(Math.round(tinchi === 0 ? 0 : (sum * 100) / tinchi) / 100);

    const monTuChonCoDiem = data.filter(
      (item) => item.loai_hoc_phan === 'tu_chon' && (item.diem_du_kien_4 || item.diem_thang_4),
    );
    setTuChonCoDiem(_.sumBy(monTuChonCoDiem, (item) => item.so_tin_chi));
  };

  // const fetch = async () => {
  //   await sinhVienGetGiaLapDiem().then((response) => {
  //     const data: LopTinChi.IGiaLapDiem[] = response.data?.data?.dsDiem ?? [];
  //     setTongTuChon(response.data?.data?.tongSoTinChiTuChon ?? 0);
  //     tinhDiemTongKet(data);
  //     setDanhSachDiem(data.map((item, index) => ({ index: index + 1, ...item })));
  //     setLoading(false);
  //   });
  // };

  useEffect(() => {
    // fetch();
  }, []);

  const onOk = () => {
    form
      .validateFields()
      .then((values) => {
        const data = danhSachDiem?.map((item) =>
          item.hoc_phan_id === record?.hoc_phan_id
            ? {
                ...record,
                diem_du_kien: parseFloat(values.diem_du_kien) || undefined,
                diem_du_kien_4:
                  parseFloat(convertNumberScoreToAlphabet(values.diem_du_kien)[1]) || undefined,
              }
            : item,
        );
        tinhDiemTongKet(data ?? []);
        setDanhSachDiem(data);
        setModalVisible(false);
      })
      .catch((error) => console.log(error));
  };

  const onCell = (rec: LopTinChi.IGiaLapDiem) => ({
    onClick: () => {
      console.log(rec);
      setRecord(rec);
      form.setFieldsValue({
        diem_du_kien: rec?.diem_du_kien ?? rec?.diem_hoc_phan ?? undefined,
      });
      setModalVisible(true);
    },
    style: { cursor: 'pointer' },
  });

  const columns: IColumn<LopTinChi.IGiaLapDiem>[] = [
    {
      dataIndex: 'ten_hoc_phan',
      title: 'Tên học phần',
      width: 150,
      render: (s, r) => (
        <span style={r.loai_hoc_phan === 'tu_chon' ? { fontStyle: 'italic' } : {}}>
          {s} {r.loai_hoc_phan === 'tu_chon' ? '(tự chọn)' : ''}
        </span>
      ),
      onCell,
    },
    {
      dataIndex: 'so_tin_chi',
      title: 'Số tín chỉ',

      width: 60,
      onCell,
    },
    {
      dataIndex: 'diem_thang_4',
      title: 'Điểm tổng kết (hệ 4)',

      render: (s, r) => (
        <b style={r.is_danh_gia ? (r.trang_thai === 'Không đạt' ? { color: 'red' } : {}) : {}}>
          {Object.hasOwn(r, 'is_danh_gia') ? (r.is_danh_gia ? s : '--') : ''}
        </b>
      ),
      width: 80,
      onCell,
    },
    {
      dataIndex: 'diem_du_kien',
      title: 'Điểm dự kiến (hệ 10)',

      render: (s) => <b>{s}</b>,
      width: 80,
      onCell,
    },
    {
      dataIndex: 'diem_du_kien',
      title: 'Điểm dự kiến (hệ 4)',

      render: (s) => <b>{convertNumberScoreToAlphabet(s)[1]}</b>,
      width: 80,
      onCell,
    },
  ];

  return (
    <Row gutter={[12, 12]}>
      <Text italic style={{ marginBottom: '16px' }}>
        * Lưu ý: Những điểm &#34;--&#34; là do bạn chưa đánh giá giảng viên. Vui lòng đánh giá để
        xem điểm!
      </Text>
      <Col span={24}>
        Tại đây sinh viên có thể thực hiện &quot;giả lập điểm&quot;, để chủ động trong việc đăng ký
        học lại, học cải thiện.{' '}
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
        <b style={{ fontSize: '1.5rem', color: '#CC0d00' }}>{tongKet}</b>
        <Divider type="vertical" /> */}
        Hệ 4: <b style={{ fontSize: '1.5rem', color: '#CC0d00' }}>{tongKet}</b>
        {/* <Divider type="vertical" />
        Dạng chữ: <b style={{ fontSize: '1.5rem', color: '#CC0d00' }}>{chuDuKien}</b> */}
      </Col>
      <Col span={24}>
        Số tín chỉ tự chọn đã có điểm:{' '}
        <b style={{ color: tuChonCoDiem === tongTuChon ? '#2ec94f' : '#f36f52' }}>
          {tuChonCoDiem} / {tongTuChon}
        </b>{' '}
        (tổng số tín chỉ tự chọn phải học).
      </Col>

      {/* <Col span={24} style={{ textAlign: 'center' }}>
        <Radio.Group
          optionType="button"
          value={showAll}
          onChange={({ target: { value } }: RadioChangeEvent) => setShowAll(value)}
          options={[
            { label: 'Hiển thị các môn đã học', value: false },
            { label: 'Tất cả các môn học', value: true },
          ]}
        />
      </Col> */}

      <Col span={24}>
        <Table
          columns={columns}
          dataSource={danhSachDiem
            ?.filter((item) => showAll || item.trang_thai !== 'Chưa có điểm')
            ?.map((item, index) => ({ ...item, key: index }))}
          scroll={{ x: 500 }}
          loading={loading}
          // pagination={false}
        />
      </Col>

      <Modal
        visible={modalVisible}
        title="Giả lập điểm"
        onCancel={() => {
          setModalVisible(false);
        }}
        onOk={onOk}
        width={700}
      >
        <Form form={form}>
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Tên học phần">{record?.ten_hoc_phan}</Descriptions.Item>
            <Descriptions.Item label="Số tín chỉ">{record?.so_tin_chi}</Descriptions.Item>
            <Descriptions.Item label="Điểm tổng kết (hệ 10)">
              {record?.is_danh_gia ? record?.diem_hoc_phan : '--'}
            </Descriptions.Item>
            <Descriptions.Item label="Điểm tổng kết (hệ 4)">
              {record?.is_danh_gia ? record?.diem_thang_4 : '--'}
            </Descriptions.Item>
            <Descriptions.Item label="Điểm tổng kết (dạng chữ)">
              {record?.is_danh_gia ? record?.diem_chu : '--'}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              {record?.is_danh_gia ? record?.trang_thai : 'Chưa đánh giá'}
            </Descriptions.Item>
            <Descriptions.Item label="Điểm dự kiến sau khi học lại / cải thiện (hệ 10)">
              <Form.Item name="diem_du_kien" rules={[...rules.number(10, 4)]}>
                <Input placeholder="Nhập điểm dự kiến" />
              </Form.Item>
            </Descriptions.Item>
          </Descriptions>
        </Form>
      </Modal>
    </Row>
  );
};

export default GiaLapDiem;
