/* eslint-disable no-underscore-dangle */
import { Setting, TrangThaiBuoc, TrangThaiThaoTac } from '@/utils/constants';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  LoadingOutlined,
  PauseCircleOutlined,
} from '@ant-design/icons';
import { Button, Card, Modal, Spin, Timeline } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useAccess, useModel } from 'umi';
import FormBieuMau from './FormBieuMau';
import type { DichVuMotCuaV2 } from '@/services/DichVuMotCuaV2/typing';

const IconTrangThai = {
  PENDING: (
    <PauseCircleOutlined
      style={{
        fontSize: '16px',
        color: 'gray',
      }}
    />
  ),
  OK: (
    <CheckCircleOutlined
      style={{
        fontSize: '16px',
        color: '#73d13d',
      }}
    />
  ),
  NOT_OK: (
    <CloseCircleOutlined
      style={{
        fontSize: '16px',
        color: '#d9363e',
      }}
    />
  ),
  PROCESSING: (
    <LoadingOutlined
      style={{
        fontSize: '16px',
        color: '#1890ff',
      }}
    />
  ),
  ANY: (
    <ClockCircleOutlined
      style={{
        fontSize: '16px',
        color: 'gray',
      }}
    />
  ),
};

const FormQuyTrinh = (props: {
  idDon?: string;
  record?: DichVuMotCuaV2.QuyTrinh;
  type?: string;
  thoiGianTaoDon?: string;
}) => {
  const access = useAccess();
  const {
    sinhVienGetTrangThaiDonModel,
    chuyenVienDieuPhoiGetTrangThaiDonModel,
    chuyenVienTiepNhanGetTrangThaiDonModel,
    recordTrangThaiDon,
    setRecordDonThaoTac,
    recordDonThaoTac: recordDonThaoTacModel,
    setRecordTrangThaiDon,
    loading,
    visibleFormBieuMau,
    setVisibleFormBieuMau,
    adminGetTrangThaiDonModel,
    danhSachDonThaoTac,
    setDanhSachDonThaoTac,
    record,
    recordDon,
  } = useModel('dichvumotcuav2');
  const { getChuyenVienXuLyDonModel } = useModel('phanquyen');
  const { pathname } = window.location;
  const arrPathName = pathname?.split('/') ?? [];
  const [checkLastStep, setCheckLastStep] = useState<boolean>(false);
  const [checkDuocPhepXuLy, setCheckDuocPhepXuLy] = useState<boolean>(false);
  const lastStep = props?.record?.danhSachBuoc?.[props?.record?.danhSachBuoc?.length - 1 ?? 0];
  const [type, setType] = useState<string>('handle');
  const [trangThaiDon, setTrangThaiDon] = useState<string>();

  useEffect(() => {
    if (props.idDon) {
      if (access.adminVaQuanTri) {
        adminGetTrangThaiDonModel(props.idDon);
      } else if (access.sinhVien) sinhVienGetTrangThaiDonModel(props.idDon);
      else {
        if (arrPathName?.includes('quanlydondieuphoi'))
          chuyenVienDieuPhoiGetTrangThaiDonModel(props.idDon);
        else chuyenVienTiepNhanGetTrangThaiDonModel(props.idDon);
      }
    }
  }, [props.idDon]);

  useEffect(() => {
    return () => {
      setRecordTrangThaiDon([]);
      setDanhSachDonThaoTac([]);
    };
  }, []);

  const xemChiTietDon = (
    recordDonThaoTac: DichVuMotCuaV2.DonThaoTac,
    isDonThaoTacOBuocCuoi: boolean,
    isDuocPhepXuLyDonThaoTac: boolean,
  ): any => {
    setType('view');
    setRecordDonThaoTac(recordDonThaoTac);
    setVisibleFormBieuMau(true);
    setCheckLastStep(isDonThaoTacOBuocCuoi);
    setCheckDuocPhepXuLy(isDuocPhepXuLyDonThaoTac);
  };

  const xuLyDon = (
    recordDonThaoTac: DichVuMotCuaV2.DonThaoTac,
    isDonThaoTacOBuocCuoi: boolean,
    isDuocPhepXuLyDonThaoTac: boolean,
  ): any => {
    if (arrPathName?.includes('quanlydondieuphoi')) {
      getChuyenVienXuLyDonModel(recordDonThaoTac?.idDonVi);
    }
    setType('handle');
    setRecordDonThaoTac(recordDonThaoTac);
    setVisibleFormBieuMau(true);
    setCheckLastStep(isDonThaoTacOBuocCuoi);
    setCheckDuocPhepXuLy(isDuocPhepXuLyDonThaoTac);
  };

  useEffect(() => {
    props?.record?.danhSachBuoc?.map((buoc, index) => {
      const recordBuoc = recordTrangThaiDon?.find((item) => item.idBuoc === buoc._id);
      setTrangThaiDon(recordBuoc?.trangThai);
    });
  }, [props]);

  return (
    <Card title={props?.type === 'view' ? false : 'Quy trình'}>
      <Spin spinning={loading}>
        {props?.type === 'view' && (
          <div>
            {props?.thoiGianTaoDon ? (
              <Timeline style={{ marginLeft: '-100px' }} mode="left">
                <Timeline.Item
                  style={{ marginBottom: 20 }}
                  dot={IconTrangThai?.OK}
                  label={
                    <div style={{ width: 200, float: 'right' }}>
                      <b>
                        Tạo đơn thành công
                        {props?.thoiGianTaoDon
                          ? ` vào lúc ${moment(props?.thoiGianTaoDon).format('HH:mm DD/MM/YYYY')}`
                          : ''}
                      </b>
                    </div>
                  }
                >
                  <div style={{ height: 30 }} />
                </Timeline.Item>
                <Timeline.Item style={{ display: 'none' }}>
                  <div style={{ height: 20 }} />
                </Timeline.Item>
              </Timeline>
            ) : (
              ''
            )}
          </div>
        )}
        {props?.record?.danhSachBuoc?.length
          ? props?.record?.danhSachBuoc?.map((buoc, index) => {
              const recordBuoc = recordTrangThaiDon?.find((item) => item.idBuoc === buoc._id);
              const IconBuoc = IconTrangThai?.[recordBuoc?.trangThai ?? 'ANY'];
              return (
                <>
                  <Timeline key={recordBuoc?._id} style={{ marginLeft: '-100px' }} mode="left">
                    <Timeline.Item
                      style={{ marginBottom: 20 }}
                      dot={IconBuoc}
                      label={
                        <div style={{ width: 200, float: 'right' }}>
                          <b>{buoc?.ten ?? ''}</b>
                          <br />
                          <div>
                            Trạng thái: {TrangThaiBuoc?.[recordBuoc?.trangThai ?? ''] ?? 'Đang chờ'}
                          </div>
                        </div>
                      }
                    >
                      <div style={{ height: 30 }} />
                    </Timeline.Item>

                    {buoc?.danhSachThaoTac?.map((thaoTac) => {
                      const recordDonThaoTac = danhSachDonThaoTac?.find(
                        (item) => item.idThaoTac === thaoTac._id,
                      );
                      const isDonThaoTacOBuocCuoi = recordDonThaoTac?.idBuoc === lastStep?._id;
                      const recordThaoTac = recordBuoc?.danhSachThongKeThaoTac?.find(
                        (item) => item.idThaoTac === thaoTac._id,
                      );
                      const isDuocPhepXuLy = recordDonThaoTac?.phanQuyen ?? false;
                      const IconThaoTac = IconTrangThai?.[recordThaoTac?.trangThai ?? 'ANY'];
                      return (
                        <Timeline.Item key={recordThaoTac?._id} dot={IconThaoTac}>
                          <b
                            style={{
                              color:
                                recordDonThaoTac &&
                                recordDonThaoTac?.trangThai === 'PENDING' &&
                                isDuocPhepXuLy
                                  ? Setting.primaryColor
                                  : '#000',
                            }}
                          >
                            {thaoTac?.tenThaoTac ?? ''}
                          </b>
                          <div>Đơn vị: {thaoTac?.tenDonVi || 'Đơn vị quản lý'}</div>
                          <div>
                            Trạng thái:{' '}
                            {TrangThaiThaoTac?.[recordThaoTac?.trangThai ?? ''] ?? 'Chưa xử lý'}
                          </div>
                          {!['OK', 'NOT_OK'].includes(recordThaoTac?.trangThai ?? '') ? (
                            <div>
                              {recordThaoTac?.hanXuLy ? (
                                <div>
                                  Hạn xử lý: {moment(recordThaoTac?.hanXuLy)?.format('DD/MM/YYYY')}
                                </div>
                              ) : (
                                <div>
                                  Số ngày xử lý:{' '}
                                  {thaoTac?.soNgayXuLy
                                    ? `${thaoTac?.soNgayXuLy} ngày`
                                    : 'Chưa cập nhật'}
                                </div>
                              )}
                              {recordDonThaoTac?.nguoiDuocGiao?.hoTen && (
                                <div>
                                  Người được giao: {recordDonThaoTac?.nguoiDuocGiao?.hoTen} (
                                  {recordDonThaoTac?.nguoiDuocGiao?.maDinhDanh ?? ''})
                                </div>
                              )}
                              {recordDonThaoTac && isDuocPhepXuLy && (
                                <Button
                                  onClick={() => {
                                    xuLyDon(
                                      recordDonThaoTac,
                                      isDonThaoTacOBuocCuoi,
                                      isDuocPhepXuLy,
                                    );
                                  }}
                                  style={{ padding: 0 }}
                                  type="link"
                                >
                                  Xử lý
                                </Button>
                              )}
                            </div>
                          ) : (
                            <>
                              <div>
                                {recordThaoTac?.updatedAt
                                  ? `Vào lúc: ${moment(recordThaoTac?.updatedAt).format(
                                      'HH:mm DD/MM/YYYY',
                                    )}`
                                  : ''}
                              </div>
                              {recordDonThaoTac && (
                                <Button
                                  onClick={() =>
                                    xemChiTietDon(
                                      recordDonThaoTac,
                                      isDonThaoTacOBuocCuoi,
                                      isDuocPhepXuLy,
                                    )
                                  }
                                  style={{ padding: 0 }}
                                  type="link"
                                >
                                  Chi tiết
                                </Button>
                              )}
                            </>
                          )}
                        </Timeline.Item>
                      );
                    })}
                    {index !== (props.record?.danhSachBuoc?.length ?? 0) - 1 && (
                      <Timeline.Item style={{ display: 'none' }}>
                        <div style={{ height: 20 }} />
                      </Timeline.Item>
                    )}
                  </Timeline>
                </>
              );
            })
          : 'Chưa tạo thông tin đơn'}
        {record?.soNgayHen && trangThaiDon === 'OK' ? (
          <p
            style={{ marginTop: '20px', marginBottom: '0', color: 'red' }}
          >{`Lưu ý: Đơn này được xử lý trong ${record?.soNgayHen} ngày, sinh viên vui lòng đến lấy sau thời gian xử lý!`}</p>
        ) : (
          ''
        )}
        {access.nhanVien && (
          <Modal
            destroyOnClose
            width="850px"
            footer={false}
            visible={visibleFormBieuMau}
            onCancel={() => {
              setVisibleFormBieuMau(false);
            }}
          >
            <FormBieuMau
              hideCamKet
              infoNguoiTaoDon={recordDonThaoTacModel?.nguoiTao}
              type={type}
              record={
                arrPathName?.includes('vanphongso') ? recordDon : recordDonThaoTacModel?.idDon
              }
              traKetQua={checkLastStep}
              duocPhepSuaKetQua={checkDuocPhepXuLy}
            />
          </Modal>
        )}{' '}
      </Spin>
    </Card>
  );
};

export default FormQuyTrinh;
