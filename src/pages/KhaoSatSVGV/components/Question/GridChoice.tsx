/* eslint-disable no-underscore-dangle */
import type { BieuMau } from '@/services/BieuMau/typings';
import { Checkbox, Form, Table } from 'antd';
import type { ColumnProps } from 'antd/lib/table';
import { useState } from 'react';

const GridChoice = (props: {
  question: BieuMau.CauHoi;
  indexKhoi: number;
  indexCauHoi: number;
  listLuaChonBang: { idHang: string; idCot: string; [x: string]: any }[];
  setListLuaChonBang: any;
  setErr?: any;
}) => {
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const columns: ColumnProps<any>[] = [
    {
      title: '',
      dataIndex: 'tieuChi',
      width: 250,
      fixed: 'left',
    },
  ];

  const fieldName = `${props.indexKhoi}||${props.indexCauHoi}`;

  const onChange = (e: any, idHang: string, idCot: string) => {
    const listTemp =
      props?.question?.loai === 'GridSingleChoice'
        ? props.listLuaChonBang?.[fieldName]?.filter(
            (item: { idHang: string; idCot: string }) => item?.idHang !== idHang,
          ) ?? []
        : props.listLuaChonBang?.[fieldName] ?? [];
    const check = e.target.checked;
    const record = { ...props.listLuaChonBang };
    if (check) {
      listTemp.push({ idHang, idCot });
      record[fieldName] = listTemp;
      props.setListLuaChonBang(record);
    } else {
      record[fieldName] =
        props?.question?.loai === 'GridSingleChoice'
          ? listTemp
          : listTemp?.filter(
              (item: { idCot: string; idHang: string }) =>
                item.idCot !== idCot && item.idHang !== idHang,
            );

      props.setListLuaChonBang(record);
    }

    if (!props.setErr) return;

    if (props.question.batBuoc && record[fieldName].length !== props.question.luaChonHang.length) {
      props?.setErr(true);
    } else {
      props?.setErr(false);
    }
  };
  const data = props?.question?.luaChonHang?.map((hang) => {
    const record = {
      tieuChi: hang.noiDung,
      idHang: hang._id,
    };

    return record;
  });
  props?.question?.luaChonCot?.forEach((item) => {
    columns.push({
      key: item._id,
      title: item.noiDung,
      dataIndex: 'idHang',
      align: 'center',
      width: '50px',
      render: (val: string) => {
        const luaChon = props?.listLuaChonBang?.[fieldName]?.find(
          (ele: { idHang: string; idCot: string }) => ele.idHang === val && ele.idCot === item._id,
        );
        return props?.question?.loai === 'GridSingleChoice' ? (
          <Checkbox checked={luaChon?.idHang} onChange={(e) => onChange(e, val, item._id)} />
        ) : (
          <Checkbox onChange={(e) => onChange(e, val, item._id)} />
        );
      },
    });
  });

  const isRequired =
    !props.listLuaChonBang?.[fieldName] ||
    props.listLuaChonBang?.[fieldName]?.length !== props.question.luaChonHang.length;

  return (
    <Form.Item
      extra={
        props.question.batBuoc && isSubmit && isRequired ? (
          <span style={{ color: '#FF4D4F' }}>Bắt buộc</span>
        ) : undefined
      }
      rules={
        props.question.batBuoc
          ? [
              {
                validator: (_: any, value, callback) => {
                  if (isRequired) {
                    callback('');
                    setIsSubmit(true);
                  } else {
                    setIsSubmit(false);
                  }
                  callback();
                },
              },
            ]
          : []
      }
      name={fieldName}
    >
      <Table pagination={false} scroll={{ x: 700 }} dataSource={data} columns={columns} />
    </Form.Item>
  );
};

export default GridChoice;
