import { type ChuongTrinhDaoTao } from '@/services/DaoTao/ChuongTrinhDaoTao/typing';
import { Col, Row, Spin } from 'antd';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import CardHocPhan from '../components/CardHocPhan';
import flag from '../components/flag.svg';

const TienTrinhChuongTrinhKhung = () => {
  const { loading, sinhVienGetTienTrinhKhungModel } = useModel('daotao.chuongtrinhdaotao');
  const [count, setCount] = useState(0);
  const [tongTinChi, setTongTinChi] = useState(0);
  const [danhSachHocKy, setDanhSachHocKy] = useState<
    Record<string, ChuongTrinhDaoTao.IKhoiHocPhanCTDT[]>
  >({});

  // const [soKyTheoChuyenNganh, setSoKyTheoChuyenNganh] = useState<number[] | undefined>(undefined);

  // const [ctkChuyenNganh, setCtkChuyenNganh] = useState<
  //   ChuongTrinhKhungChuyenNganh.ICtkChuyenNganhRecord[] | undefined
  // >();

  const fetch = async () => {
    await sinhVienGetTienTrinhKhungModel().then((data) => {
      // if (response.data.data.ctkChuyenNganh) {
      //   const cacKy = response.data?.data?.ctkChuyenNganh
      //     .filter((chuyenNganh: any) => chuyenNganh.tienTrinh.length > 0)[0]
      //     ?.tienTrinh.map((el: any) => Number(el.hoc_ky));
      //   setSoKyTheoChuyenNganh(cacKy);
      //   setCtkChuyenNganh(response.data?.data?.ctkChuyenNganh);
      // }
      const gHocKy = _.groupBy(data, (item) => item.soThuTuKy);
      setDanhSachHocKy(gHocKy);
      setTongTinChi(_.sumBy(data, (item) => item.soTinChi));
      setCount(
        _.sumBy(
          data.filter((item) => item.lichSuDiem?.length),
          (item) => item.soTinChi,
        ),
      );
    });
  };

  useEffect(() => {
    fetch();
  }, []);

  return (
    <>
      {/* {chuongTrinhKhung && chuongTrinhKhung.length > 0 ? (
        <Row style={{ marginBottom: 8 }}>
          {chuongTrinhKhung.map((ctk) => (
            <Col key={ctk.id} span={24}>
              Chương trình khung {ctk.is_nganh ? 'ngành' : 'chuyên ngành'}:{' '}
              <a target="_blank" rel="noreferrer" href={ctk.file_mau_ctk}>
                Tải về
              </a>
            </Col>
          ))}
        </Row>
      ) : null} */}
      <Row>
        <Col>Số tín chỉ đã tích lũy:</Col>
      </Row>
      <Row align="middle">
        <Col span={20} md={22}>
          <div className="progress-wrapper">
            <div className="proress-bar" style={{ width: `${(count * 100) / tongTinChi}%` }}>
              <div className="progress-label">{count} tín</div>
            </div>
          </div>
        </Col>
        <Col span={4} md={2}>
          <div className="progress-end">
            <img src={flag} />
            <br />
            {tongTinChi} tín chỉ
          </div>
        </Col>
      </Row>

      <Spin spinning={loading}>
        {Object.entries(danhSachHocKy)?.map(([hocKy, data]) => (
          <div className="row-hoc-ky" key={hocKy}>
            <div className="col-hoc-ky">
              {/* <Tooltip
                title={
                  <>
                    Tổng số tín chỉ cần học: {hocKy.tongSoTinCanHoc}
                    <br />
                    Số tín chỉ tự chọn: {hocKy.so_tin_chi_tu_chon_phai_hoc}
                    <br />
                    Số tín chỉ đã đạt: {hocKy.tongSoTinDaDat}
                  </>
                }
              > */}
              <h4>Học kỳ {hocKy}</h4>
              <span className="tin-chi">({_.sumBy(data, (i) => i.soTinChi)} TC)</span>
              {/* </Tooltip> */}
            </div>
            <div className="col-chi-tiet">
              {data.map((ctk) => (
                <CardHocPhan chuongTrinhKhung={ctk} key={ctk._id} />
              ))}
            </div>
          </div>
        ))}
        {/* {soKyTheoChuyenNganh &&
          danhSachHocPhan
            ?.filter((hocKy) => Number(hocKy.hoc_ky) <= soKyTheoChuyenNganh[0])
            ?.map((hocKy) => (
              <div className="row-hoc-ky" key={hocKy.hoc_ky}>
                <div className="col-hoc-ky">
                  <Tooltip
                    title={
                      <>
                        Tổng số tín chỉ cần học: {hocKy.tongSoTinCanHoc}
                        <br />
                        Số tín chỉ tự chọn: {hocKy.so_tin_chi_tu_chon_phai_hoc}
                        <br />
                        Số tín chỉ đã đạt: {hocKy.tongSoTinDaDat}
                      </>
                    }
                  >
                    <h4>Học kỳ {hocKy.hoc_ky}</h4>
                    <span className="tin-chi">({hocKy.tongSoTinCanHoc} TC)</span>
                  </Tooltip>
                </div>
                <div className="col-chi-tiet">
                  {hocKy.data.map((ctk) => (
                    <CardHocPhan hocPhan={ctk.hocPhan} chuongTrinhKhung={ctk} key={ctk.id} />
                  ))}
                </div>
              </div>
            ))} */}

        {/* {ctkChuyenNganh?.map((el) => (
          <Collapse accordion key={el.chuyen_nganh.id} bordered={false}>
            <Collapse.Panel
              key={el.chuyen_nganh.id}
              header={`Chuyên ngành: ${el.chuyen_nganh.name}`}
              style={{
                marginBottom: 10,
                paddingTop: 10,
                paddingBottom: 10,
              }}
            >
              {el.tienTrinh.map((kyHoc) => (
                <div className="row-hoc-ky" key={kyHoc.hoc_ky}>
                  <div className="col-hoc-ky">
                    <Tooltip>
                      <h4>Học kỳ {kyHoc.hoc_ky}</h4>
                      <span className="tin-chi">({kyHoc.tongSoTinCanHoc} TC)</span>
                    </Tooltip>
                  </div>
                  <div className="col-chi-tiet">
                    {kyHoc.data.map((monHoc) => (
                      <CardHocPhan isChuyenNganh chuongTrinhKhung={monHoc} key={monHoc.id} />
                    ))}
                  </div>
                </div>
              ))}
            </Collapse.Panel>
          </Collapse>
        ))}

        {soKyTheoChuyenNganh &&
          danhSachHocPhan
            ?.filter(
              (hocKy) =>
                Number(hocKy.hoc_ky) > soKyTheoChuyenNganh[soKyTheoChuyenNganh?.length - 1],
            )
            ?.map((hocKy) => (
              <div className="row-hoc-ky" key={hocKy.hoc_ky}>
                <div className="col-hoc-ky">
                  <Tooltip
                    title={
                      <>
                        Tổng số tín chỉ cần học: {hocKy.tongSoTinCanHoc}
                        <br />
                        Số tín chỉ tự chọn: {hocKy.so_tin_chi_tu_chon_phai_hoc}
                        <br />
                        Số tín chỉ đã đạt: {hocKy.tongSoTinDaDat}
                      </>
                    }
                  >
                    <h4>Học kỳ {hocKy.hoc_ky}</h4>
                    <span className="tin-chi">({hocKy.tongSoTinCanHoc} TC)</span>
                  </Tooltip>
                </div>
                <div className="col-chi-tiet">
                  {hocKy.data.map((ctk) => (
                    <CardHocPhan hocPhan={ctk.hocPhan} chuongTrinhKhung={ctk} key={ctk.id} />
                  ))}
                </div>
              </div>
            ))} */}
      </Spin>
    </>
  );
};

export default TienTrinhChuongTrinhKhung;
