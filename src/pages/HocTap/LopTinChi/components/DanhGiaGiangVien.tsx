/* eslint-disable no-nested-ternary */
/* eslint-disable no-underscore-dangle */
import { Empty } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import FormDanhGia from './FormDanhGia';
import logo from '@/assets/anh.jpg';

const DanhGiaGiangVien = (props: { idLop: number }) => {
  const {
    getDotDanhGiaModel,
    record,
    dataDotDanhGia,
    sinhVienThucHienBieuMauModel,
    verifyAccessDanhGiaModel,
    flagDaDanhGia,
  } = useModel('hoctap.loptinchi');

  useEffect(() => {
    console.log(
      '🚀 ~ file: DanhGiaGiangVien.tsx:25 ~ useEffect ~ props.idLop && dataDotDanhGia?._id',
      props.idLop,
      dataDotDanhGia?._id,
    );
    if (props.idLop && dataDotDanhGia?._id)
      verifyAccessDanhGiaModel(dataDotDanhGia?._id, props.idLop, dataDotDanhGia?.idBieuMau);
  }, [props.idLop, dataDotDanhGia?._id]);

  useEffect(() => {
    if (record?.ky_nam_hoc_id?.[0]) getDotDanhGiaModel(record?.ky_nam_hoc_id?.[0]);
  }, [record?.ky_nam_hoc_id?.[0]]);

  const handleSubmit = async (arr: KhaiBaoSucKhoe.TraLoiRecord[]) => {
    try {
      await sinhVienThucHienBieuMauModel({
        // eslint-disable-next-line no-underscore-dangle
        idDotDanhGiaGiangVien: dataDotDanhGia?._id,
        idLopTinChi: record?.id,
        danhSachTraLoi: arr,
      });
    } catch (error) {}

    // eslint-disable-next-line no-underscore-dangle
    verifyAccessDanhGiaModel(dataDotDanhGia?._id, record?.id);
  };

  return (
    <>
      {flagDaDanhGia === true ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            height: '500px',
          }}
        >
          <img src={logo} alt="Đã khai báo đánh giá" width={32} />
          <p style={{ marginTop: 10 }}>Đã thực hiện đánh giá </p>
        </div>
      ) : !dataDotDanhGia ? (
        <Empty
          description="Không trong thời gian đánh giá giảng viên"
          style={{ padding: '150px' }}
        />
      ) : (
        <FormDanhGia record={dataDotDanhGia} idLopTinChi={record?.id} onSubmit={handleSubmit} />
      )}
      {/* {dataDotDanhGia && flagDaDanhGia === false && (
        <FormDanhGia record={dataDotDanhGia} idLopTinChi={record?.id} onSubmit={handleSubmit} />
      )} */}
    </>
  );
};

export default DanhGiaGiangVien;
