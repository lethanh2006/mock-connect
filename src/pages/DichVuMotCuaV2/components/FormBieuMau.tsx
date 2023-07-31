// import DiaChi from '@/components/DiaChi';
import MyDatePicker from '@/components/MyDatePicker';
import Upload from '@/components/Upload/UploadMultiFile';
import SelectDanToc from '@/pages/Core/DanToc/SelectDanToc';
import SelectDonViHanhChinh from '@/pages/Core/DonViHanhChinh/SelectDonViHanhChinh';
import SelectTonGiao from '@/pages/Core/TonGiao/SelectTonGiao';
import SelectHocKy from '@/pages/DaoTao/HocKy/SelectHocKy';
import SelectHocPhan from '@/pages/DaoTao/HocPhan/SelectHocPhan';
import SelectLopHocPhan from '@/pages/DaoTao/LopHocPhan/SelectLopHocPhan';
import SelectNamHoc from '@/pages/DaoTao/NamHoc/Select';
import { accessFileUpload } from '@/services/DVMC/DichVuMotCuaV2/constant';
import { type DichVuMotCuaV2 } from '@/services/DVMC/DichVuMotCuaV2/typing';
import { type SinhVien } from '@/services/DaoTao/SinhVien/typings';
import rules from '@/utils/rules';
import { checkFileSize, renderFileList, uploadMultiFile } from '@/utils/utils';
import { CopyOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Checkbox,
  Divider,
  Form,
  Input,
  InputNumber,
  Radio,
  Select,
  message,
} from 'antd';
import moment from 'moment';
import mm from 'moment-timezone';
import { useEffect, useState } from 'react';
import { useModel, history } from 'umi';
import HocPhanCoDiem from '../HocPhanCoDiem';
import Table from './TableElement';
import ThongTinNguoiTaoDon from './ThongTinNguoiTaoDon';
import TieuDeBieuMau from './TieuDeBieuMau';
import SelectDonViHanhChinhWithDinamicForm from "@/pages/Core/DonViHanhChinh/SelectDonViHanhChinhWithDinamicForm";

mm.tz.setDefault('Asia/Ho_Chi_Minh');

const FormBieuMau = (props: {
  infoNguoiTaoDon?: SinhVien.IRecord;
  record?: DichVuMotCuaV2.Don & { index?: number };
  type?: 'view' | 'handle' | 'create' | 'edit';
  onCancel?: any;
  textSaveButton?: string;
  title?: string;
  handleAdd?: any;
  handleDel?: any;
  handleEdit?: any;
  edit?: boolean;
  hideTitle?: boolean;
  hideCamKet?: boolean;
  traKetQua?: boolean;
  duocPhepSuaKetQua?: boolean;
  isMuonPhongHop?: boolean;
  isBaoCaoSuCo?: boolean;
}) => {
  const [form] = Form.useForm();
  const {
    loading,
    danhSachDataTable,
    setDanhSachDataTable,
    postDonSinhVienModel,
    record,
    recordDonThaoTac,
    recordDon,
    sinhVienPutDonModel,
  } = useModel('dvmc.dichvumotcuav2');

  const { getTinhThanhPhoModel, danhSachTinh } = useModel('core.donvihanhchinh');

  const [valuesForm, setValuesForm] = useState<any>({});

  const [check, setCheck] = useState<boolean>(false);

  const buildValuesForm = (
    valuesInit: any,
    name: string,
    arrCauHinh: DichVuMotCuaV2.CauHinhBieuMau[],
  ) => {
    arrCauHinh?.forEach((cauHinh, indexCauHinh) => {
      if (cauHinh?.type === 'TABLE' && (props?.type === 'edit' || props?.type === 'handle')) {
        const recordTemp: any = {};
        const arrData: { cauHinhBieuMau: DichVuMotCuaV2.CauHinhBieuMau[] }[] = cauHinh?.value?.map(
          (row: DichVuMotCuaV2.CauHinhBieuMau[]) => ({ cauHinhBieuMau: row }),
        );

        recordTemp[`${name}[${indexCauHinh}].${cauHinh?.label}`] = arrData;
        setDanhSachDataTable(recordTemp);
      }
      valuesInit[`${name}[${indexCauHinh}].${cauHinh?.label}`] = cauHinh?.value;
      cauHinh?.dataSource?.forEach((data, indexDataSource) => {
        data?.relatedElement?.forEach((item, indexElement) => {
          buildValuesForm(
            valuesInit,
            `${name}[${indexCauHinh}].dataSource[${indexDataSource}].relatedElement[${indexElement}]`,
            data?.relatedElement ?? [],
          );
        });
      });
      buildValuesForm(valuesInit, `${name}[${indexCauHinh}]`, cauHinh?.relatedElement ?? []);
    });
  };

  const buildTableData = (values: { cauHinhBieuMau: DichVuMotCuaV2.CauHinhBieuMau[] }) => {
    const arrData: { label: string; value: string }[] = [];
    values?.cauHinhBieuMau?.forEach((cauHinh) => {
      arrData.push({ label: cauHinh?.label ?? '', value: cauHinh?.value ?? '' });
    });
    return arrData;
  };

  const buildPostData = (
    name: string,
    values: any,
    arrCauHinh: DichVuMotCuaV2.CauHinhBieuMau[],
  ): any => {
    return (
      arrCauHinh?.map((item, index) => {
        let value = values?.[`${name}[${index}].${item?.label}`];
        if (item?.type === 'DON_VI_HANH_CHINH') {
          value = {
            ...values?.[`${name}[${index}].${item?.label}`],
            tenTinh: values?.tinhTp,
            tenQuanHuyen: values?.quanHuyen,
            tenPhuongXa: values?.xaPhuong,
            // soNhaTenDuong: values?.soNhaTenDuong,
          };
        } else if (item?.type === 'TABLE') {
          value = danhSachDataTable?.[`${name}[${index}].${item?.label}`]?.map(
            (row: { cauHinhBieuMau: DichVuMotCuaV2.CauHinhBieuMau[] }) => buildTableData(row),
          );
        }

        return {
          ...item,
          dataSource: item?.dataSource?.map((data, indexData) => ({
            ...data,
            relatedElement: buildPostData(
              `cauHinhBieuMau[${index}].dataSource[${indexData}].relatedElement`,
              values,
              data?.relatedElement,
            ),
          })),
          value,
        };
      }) ?? []
    );
  };

  const onSubmitForm = async (values: any): Promise<any> => {
    const objectFileUpload = {};
    // eslint-disable-next-line no-restricted-syntax
    for (const item of Object.keys(values)) {
      if (values[item]?.fileList) {
        const checkSize = checkFileSize(values[item]?.fileList ?? []);
        if (!checkSize) return;
        // TODO: Check upload multiple file
        // @ts-ignore
        objectFileUpload[item] = await uploadMultiFile(values[item]?.fileList ?? [], true);
      }
    }
    const valuesFinal = { ...values, ...objectFileUpload };
    const duLieuBieuMau = buildPostData(
      'cauHinhBieuMau',
      valuesFinal,
      props?.handleAdd || props?.type === 'edit' || props?.type === 'handle'
        ? props?.record?.thongTinDichVu?.cauHinhBieuMau ?? []
        : record?.cauHinhBieuMau ?? [],
    );
    return { valuesFinal, duLieuBieuMau };
  };

  useEffect(() => {
    const valuesTemp = {};
    buildValuesForm(
      valuesTemp,
      'cauHinhBieuMau',
      props?.record?.thongTinDichVu?.cauHinhBieuMau ?? [],
    );
    setValuesForm(valuesTemp);
    getTinhThanhPhoModel();
    return () => {
      if (!props?.handleAdd) setDanhSachDataTable({});
      // setTenTinh({});
      // setTenQuanHuyen({});
      // setTenXaPhuong({});
      // setObjDanhSachQuanHuyen({});
      // setObjDanhSachXaPhuong({});
    };
  }, []);

  const buildForm = (name: string, item: DichVuMotCuaV2.CauHinhBieuMau) => {
    let element = <Input placeholder="Nhập nội dung" />;
    let ruleElement: any[] = item.isRequired ? [...rules.required] : [];
    let initialValue = item?.value;

    if (!item?.type) return <div />;
    switch (item?.type) {
      case 'TEXT_AREA': {
        ruleElement = item.isRequired ? [...rules.required, ...rules.text] : [...rules.text];
        element = <Input.TextArea rows={3} placeholder={item?.label ?? ''} />;
        break;
      }
      case 'INPUT_NUMBER': {
        initialValue = Number(item?.value);
        if (item.min || item.max) {
          ruleElement = [
            ...(item.isRequired ? rules.required : []),
            ...rules.number(item.max, item.min, false),
          ];
        }
        element = <InputNumber style={{ width: '100%' }} placeholder={item?.label ?? ''} />;
        break;
      }

      case 'DATE_PICKER': {
        initialValue = item?.value ? moment(item?.value) : undefined;
        element = (
          <MyDatePicker
            format="DD/MM/YYYY HH:mm"
            showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
          />
        );
        break;
      }

      case 'UPLOAD_SINGLE': {
        ruleElement = item.isRequired ? [...rules.fileRequired] : [];
        initialValue = renderFileList(
          item?.value?.map((file: { url: string; type: string }) => file?.url),
        );
        element = (
          <Upload
            otherProps={{
              maxCount: 1,
              accept: item?.fileType?.map((type) => accessFileUpload?.[type])?.join(','),
              multiple: false,
              showUploadList: { showDownloadIcon: false },
            }}
          />
        );
        break;
      }
      case 'UPLOAD_MULTI': {
        ruleElement = item.isRequired ? [...rules.fileRequired] : [];
        initialValue = renderFileList(
          typeof item?.value === 'object'
            ? item?.value?.map((file: { url: string; type: string }) => file?.url)
            : [],
        );

        element = (
          <Upload
            otherProps={{
              maxCount: 5,
              accept: item?.fileType?.map((type) => accessFileUpload?.[type])?.join(','),
              multiple: true,
              showUploadList: { showDownloadIcon: false },
            }}
            limit={5}
          />
        );
        break;
      }
      case 'DROP_LIST_SINGLE': {
        initialValue = item?.value;
        element = (
          <Select allowClear placeholder={item?.label ?? ''}>
            {item?.dataSource?.map((datasource) => (
              <Select.Option key={datasource?.label} value={datasource?.label}>
                {datasource?.label}
              </Select.Option>
            ))}
          </Select>
        );
        break;
      }
      case 'DROP_LIST_MULTI': {
        initialValue = item?.value;
        element = (
          <Select allowClear mode="multiple" placeholder={item?.label ?? ''}>
            {item?.dataSource?.map((datasource) => (
              <Select.Option key={datasource.label} value={datasource?.label}>
                {datasource?.label}
              </Select.Option>
            ))}
          </Select>
        );
        break;
      }
      case 'DON_VI_HANH_CHINH': {
        initialValue = item?.value;
        ruleElement = [];
        element = (
          <SelectDonViHanhChinhWithDinamicForm
            form={form}
            // hasSoNha={item?.level === 4}
            hideDiaChiCuThe={item?.level === 4}
            listTinh={danhSachTinh}
            hideQuanHuyen={item?.level === 1}
            hideXaPhuong={[1, 2].includes(item?.level)}
            notRequiredDiaChiCuThe={!item?.isRequired}
            notRequiredQuanHuyen={!item?.isRequired}
            notRequiredTinh={!item?.isRequired}
            notRequiredXaPhuong={!item?.isRequired}
            initialValue={
              typeof item?.value?.maPhuongXa === 'string'
                ? item?.value
                : { ...item.value, maPhuongXa: item?.value?.maPhuongXa?.maPhuongXa }
            }
            fields={{
              tinh: [`${name}.${item?.label ?? ''}`, 'maTinh'],
              quanHuyen: [`${name}.${item?.label ?? ''}`, 'maQuanHuyen'],
              xaPhuong: [`${name}.${item?.label ?? ''}`, 'maPhuongXa'],
              diaChiCuThe: [`${name}.${item?.label ?? ''}`, 'soNhaTenDuong'],
            }}
          />
        );
        break;
      }
      case 'RADIO_BUTTON': {
        initialValue = item?.value;
        element = (
          <Radio.Group>
            {item?.dataSource?.map((datasource) => (
              <Radio key={datasource?.label} value={datasource?.label}>
                {datasource?.label}
              </Radio>
            ))}
          </Radio.Group>
        );
        break;
      }

      case 'CHECKLIST': {
        initialValue = item?.value;
        element = (
          <Checkbox.Group>
            {item?.dataSource?.map((datasource) => (
              <Checkbox key={datasource?.label} value={datasource?.label ?? ''}>
                {datasource?.label ?? ''}
              </Checkbox>
            ))}
          </Checkbox.Group>
        );
        break;
      }
      case 'TABLE': {
        ruleElement = item?.isRequired
          ? [
              {
                validator: (__: { field: string | number }, value: any, callback: any) => {
                  if (!danhSachDataTable || !danhSachDataTable?.[__?.field]?.length) callback('');
                  callback();
                },
                message: 'Bắt buộc',
                required: true,
              },
            ]
          : [];
        const data = item?.value?.map((recordRow: DichVuMotCuaV2.CauHinhBieuMau[]) => {
          const row: any = {};
          recordRow?.forEach((cell: DichVuMotCuaV2.CauHinhBieuMau) => {
            let value = typeof cell?.value === 'object' ? cell?.value?.join(', ') : cell?.value;
            if (cell.type === 'DATE_PICKER') {
              value = moment(cell?.value)?.format('HH:mm DD/MM/YYYY');
            }

            row[cell?.label] = value;
          });
          return row;
        });

        element = (
          <Table
            type={props?.type}
            name={`${name}.${item?.label}`}
            danhSachDataTable={danhSachDataTable}
            setDanhSachDataTable={(
              dataTable: Record<string, { cauHinhBieuMau: DichVuMotCuaV2.CauHinhBieuMau[] }[]>,
            ) => {
              setDanhSachDataTable(dataTable);
            }}
            data={data}
            recordForm={
              {
                thongTinDichVu: { cauHinhBieuMau: item?.relatedElement ?? [] },
              } as DichVuMotCuaV2.Don
            }
            textSaveButton="Lưu"
            hascreate
            // hasTotal
            widthDrawer="55%"
            Form={FormBieuMau}
            otherProps={{
              scroll: { x: 500 },
              pagination: false,
            }}
            columns={item?.relatedElement?.map((column) => {
              return {
                title: column?.label ?? '',
                dataIndex: `${column?.label}`,
                align: 'center',
                width: 200,
                render: (val: any) =>
                  column?.type === 'DATE_PICKER' ? (
                    <div>
                      {val && props.type !== 'create' && props.type !== 'edit'
                        ? moment(val)?.format('HH:mm DD/MM/YYYY')
                        : val}
                    </div>
                  ) : (
                    <div>{val}</div>
                  ),
              };
            })}
          />
        );
        break;
      }
      case 'TEXT_BLOCK': {
        element = <p style={{ marginLeft: 12 }}>{item?.label ?? ''}</p>;
        break;
      }

      case 'MY_SEMESTER': {
        initialValue = item?.value;

        element = <SelectHocKy selectMa={true} />;
        break;
      }
      case 'MY_YEAR': {
        initialValue = item?.value;

        element = <SelectNamHoc selectTen={true} />;
        break;
      }
      case 'MY_CREDIT': {
        initialValue = item?.value;
        element = <SelectHocPhan selectMa={true} />;
        break;
      }
      case 'MY_COURSE': {
        initialValue = item?.value;
        element = <SelectLopHocPhan selectMa={true} />;
        break;
      }
      case 'DAN_TOC': {
        initialValue = item?.value;
        element = <SelectDanToc />;
        break;
      }

      case 'TON_GIAO': {
        initialValue = item?.value;
        element = <SelectTonGiao />;
        break;
      }
      case 'HOC_PHAN_CO_DIEM': {
        initialValue = item?.value;
        element = (
          <HocPhanCoDiem
            initialValue={item?.value}
            form={form}
            fields={{
              idHocKy: [`${name}.${item?.label ?? ''}`, 'idHocKy'],
              idDiem: [`${name}.${item?.label ?? ''}`, 'idDiem'],
            }}
          />
        );
        break;
      }
      default:
        break;
    }

    const formItemElement =
      item?.type === 'TEXT_BLOCK' ? (
        <div>{element}</div>
      ) : (
        <Form.Item
          key={item?.label}
          extra={item?.note ? <i>{item?.note}</i> : false}
          label={
            <div
              title={item?.label ?? 'Chưa có tiêu đề'}
              style={{
                marginLeft: item?.isRequired && item?.type !== 'TABLE' ? 0 : 10,
                whiteSpace: 'pre-wrap',
              }}
            >
              {item.type === 'DON_VI_HANH_CHINH' && item.isRequired && (
                <span style={{ color: '#ff4d4f', fontSize: 14, fontFamily: 'SimSun, sans-serif' }}>
                  *
                </span>
              )}{' '}
              {item?.label ?? 'Chưa có tiêu đề'}
            </div>
          }
          name={item.type === 'DON_VI_HANH_CHINH' ? undefined : `${name}.${item?.label}`}
          rules={[...ruleElement]}
          initialValue={initialValue}
        >
          {element}
        </Form.Item>
      );

    return (
      <div key={item._id}>
        {formItemElement}
        {item?.dataSource?.map((data, indexDataSource) => {
          return valuesForm?.[`${name}.${item?.label}`] === data?.label ||
            (valuesForm?.[`${name}.${item?.label}`]?.length &&
              valuesForm?.[`${name}.${item?.label}`]?.includes(data?.label)) ? (
            data?.relatedElement?.map((ele, indexEle) => {
              return buildForm(
                `${name}.dataSource[${indexDataSource}].relatedElement[${indexEle}]`,
                ele,
              );
            })
          ) : (
            <div />
          );
        })}
      </div>
    );
  };

  const onFinish = async (values: any) => {
    console.log('values',values)
    const { valuesFinal, duLieuBieuMau } = await onSubmitForm(values);
    if (props?.edit !== null && props?.edit !== undefined) {
      if (props?.edit === false && props?.handleAdd) props.handleAdd(valuesFinal, duLieuBieuMau);
      else props.handleEdit(valuesFinal, duLieuBieuMau, props.record?.index);
    } else {
      if (props.type === 'edit') {
        sinhVienPutDonModel(props?.record?._id ?? '', {
          duLieuBieuMau,
          traKetQua: props?.record?.thongTinDichVu?.traKetQua,
          daTraKetQua: false,
        });
      } else {
        postDonSinhVienModel({
          soLuongThanhToan: values?.soLuongThanhToan,
          duLieuBieuMau,
          dichVuId: record?._id,
          traKetQua: props?.record?.thongTinDichVu?.traKetQua,
          daTraKetQua: false,
        }).then(() => {
          if (!props?.record?.thongTinDichVu?.thongTinThuTuc?.yeuCauTraPhi) {
            history.push('/dich-vu-hanh-chinh');
          }
        });
      }
    }
  };

  return (
    <Card title={props?.title} bodyStyle={{ padding: window.screen.width > 600 ? '30px' : 12 }}>
      {!props.hideTitle && <TieuDeBieuMau title={props?.record?.thongTinDichVu?.ten ?? ''} />}

      <br />
      {!props.hideTitle && (
        <>
          <h3 style={{ fontWeight: 'bold' }}>Thông tin người tạo đơn</h3>
          <ThongTinNguoiTaoDon
            record={props?.infoNguoiTaoDon}
            thongTinNguoiTaoAdmin={props?.record?.thongTinNguoiTao}
          />
          <Divider />
        </>
      )}
      <h3 style={{ fontWeight: 'bold' }}>Thông tin đơn</h3>
      <Form
        onValuesChange={(changeValues, allValues) => setValuesForm(allValues)}
        labelAlign="left"
        labelCol={{ xs: 6, lg: 6, xl: 6 }}
        onFinish={onFinish}
        form={form}
      >
        {props?.record?.thongTinDichVu?.cauHinhBieuMau?.length ?? 0 ? (
          <>
            {props.record?.thongTinDichVu?.cauHinhBieuMau?.map((item, index) => {
              return buildForm(`cauHinhBieuMau[${index}]`, item);
            })}

            {props?.record?.thongTinDichVu?.thongTinThuTuc?.yeuCauTraPhi &&
              props?.record?.thongTinDichVu?.thongTinThuTuc?.tinhTienTheoSoLuong &&
              !(props?.edit !== null && props?.edit !== undefined) && (
                <Form.Item
                  initialValue={props?.record?.soLuongThanhToan}
                  rules={[...rules.required]}
                  label="Số lượng"
                  name="soLuongThanhToan"
                >
                  <InputNumber
                    disabled={props.type !== 'create'}
                    min={1}
                    max={100}
                    placeholder="Số lượng"
                  />
                </Form.Item>
              )}
          </>
        ) : (
          <>
            <div>Chưa tạo thông tin đơn.</div>
            <br />
          </>
        )}
        <div>
          <b>{props.record?.thongTinDichVu?.ghiChu}</b>
        </div>
        {/* {!['handle', 'view'].includes(props?.type ?? '') && !props.hideCamKet && (
          <Checkbox
            style={{ marginBottom: 8, marginLeft: 12 }}
            onChange={(e) => setCheck(e.target.checked)}
          >
            Tôi xin cam đoan các thông tin là kê khai là chính xác và sử dụng giấy chứng nhận sinh
            viên đúng theo lý do đã trình bày trên.
          </Checkbox>
        )} */}

        {(recordDonThaoTac?.urlFileDinhKem?.length || recordDonThaoTac?.info?.ghiChuXuLy) && (
          <>
            <Divider />
            <h3 style={{ fontWeight: 'bold' }}>Thông tin xử lý đơn</h3>
            {recordDonThaoTac?.urlFileDinhKem?.length !== 0 && (
              <Form.Item label="File xử lý">
                {recordDonThaoTac?.urlFileDinhKem?.map((item: any, index: number) => (
                  <>
                    <a href={item} target="_blank" rel="noreferrer">
                      File {index + 1}
                    </a>
                    <br />
                  </>
                ))}
              </Form.Item>
            )}
            {recordDonThaoTac?.info?.ghiChuXuLy && (
              <Form.Item label="Ghi chú xử lý">
                {recordDonThaoTac?.info?.ghiChuXuLy ?? ''}
              </Form.Item>
            )}
          </>
        )}

        {(recordDon?.ketQuaDinhKem?.length || recordDon?.ketQuaText) && (
          <>
            <Divider />
            <h3 style={{ fontWeight: 'bold' }}>Kết quả</h3>
            {recordDon?.ketQuaDinhKem?.length !== 0 && (
              <Form.Item label="File kết quả">
                {recordDon?.ketQuaDinhKem?.map((item: any, index: number) => (
                  <>
                    <a href={item} target="_blank" rel="noreferrer">
                      File {index + 1}
                    </a>
                    <br />
                  </>
                ))}
              </Form.Item>
            )}
            {recordDon?.ketQuaText && (
              <Form.Item label="Ghi chú kết quả">{recordDon?.ketQuaText ?? ''}</Form.Item>
            )}
          </>
        )}

        {/*{recordDon?.maDon ? (*/}
        {/*  <Form.Item label={'Mã đơn'} style={{ marginLeft: '10px' }}>*/}
        {/*    <>*/}
        {/*      {recordDon?.maDon && (*/}
        {/*        <>*/}
        {/*          {recordDon?.maDon ?? ''}{' '}*/}
        {/*          <CopyOutlined*/}
        {/*            onClick={() => {*/}
        {/*              const textField = document.createElement('textarea');*/}
        {/*              textField.innerText = recordDon?.maDon;*/}
        {/*              document.body.appendChild(textField);*/}
        {/*              textField.select();*/}
        {/*              document.execCommand('copy');*/}
        {/*              textField.remove();*/}
        {/*              message.success('Copy thành công');*/}
        {/*            }}*/}
        {/*          />{' '}*/}
        {/*        </>*/}
        {/*      )}*/}
        {/*    </>*/}
        {/*  </Form.Item>*/}
        {/*) : null}*/}

        <Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>
          {!['view', 'handle', 'edit'].includes(props?.type ?? '') && (
            <Button loading={loading} style={{ marginRight: 8 }} htmlType="submit" type="primary">
              {props?.textSaveButton || 'Gửi đơn'}
            </Button>
          )}
          {['edit'].includes(props?.type ?? '') && (
            <Button loading={loading} style={{ marginRight: 8 }} htmlType="submit" type="primary">
              Lưu
            </Button>
          )}

          {props?.onCancel && <Button onClick={() => props?.onCancel()}>Đóng</Button>}
        </Form.Item>
      </Form>
    </Card>
  );
};

export default FormBieuMau;
