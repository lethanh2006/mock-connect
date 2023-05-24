// import DiaChi from '@/components/DiaChi';
import HocPhanCoDiem from '@/components/HocPhanCoDiem';
import MyDatePicker from '@/components/MyDatePicker';
import Upload from '@/components/Upload/UploadMultiFile';
import type { DichVuMotCuaV2 } from '@/services/DichVuMotCuaV2/typing';
import rules from '@/utils/rules';
import { checkFileSize, includes, renderFileList } from '@/utils/utils';
import { CopyOutlined } from '@ant-design/icons';
import {
  AutoComplete,
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
import { useModel } from 'umi';
import Table from './TableElement';
import ThongTinNguoiTaoDon from './ThongTinNguoiTaoDon';
import TieuDeBieuMau from './TieuDeBieuMau';
import { accessFileUpload } from '@/services/DichVuMotCuaV2/constant';
import { type SinhVien } from '@/services/DaoTao/SinhVien/typings';
import SelectDonViHanhChinh from '@/pages/Core/DonViHanhChinh/SelectDonViHanhChinh';

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
    loaiDichVu,
  } = useModel('dichvumotcuav2');
  const { danhSach: danhSachKyHoc } = useModel('daotao.hocky');
  const { danhSach: danhSachNamHoc } = useModel('daotao.namhoc');
  const { danhSach: danhSachLopTinChi, danhSachMonHoc } = useModel('hoctap.loptinchi');
  const { danhSachDanToc, danhSachTonGiao, getAllTonGiao, getAllDanToc } =
    useModel('dantoctongiao');
  const {
    tenTinh,
    tenPhuongXa,
    tenQuanHuyen,
    setTenTinh,
    setTenXaPhuong,
    setTenQuanHuyen,
    setObjDanhSachXaPhuong,
    setObjDanhSachQuanHuyen,
  } = useModel('donvihanhchinh');

  const [valuesForm, setValuesForm] = useState<any>({});
  const [typeXuLy, setTypeXuLy] = useState<'ok' | 'not-ok' | 'edit-result'>('ok');
  const { pathname } = window.location;
  const arrPathName = pathname?.split('/') ?? [];
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
            tenTinh: tenTinh?.[`${name}[${index}].${item?.label}.maTinh`],
            tenQuanHuyen: tenQuanHuyen?.[`${name}[${index}].${item?.label}.maQuanHuyen`],
            tenPhuongXa: tenPhuongXa?.[`${name}[${index}].${item?.label}.maPhuongXa`],
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
        // objectFileUpload[item] = await uploadMultiFile(values[item]?.fileList ?? [], true);
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
    getAllDanToc();
    getAllTonGiao();
    buildValuesForm(
      valuesTemp,
      'cauHinhBieuMau',
      props?.record?.thongTinDichVu?.cauHinhBieuMau ?? [],
    );
    setValuesForm(valuesTemp);

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
    let ruleElement: any[] = [...rules.required];
    let initialValue = item?.value;

    if (!item?.type) return <div />;
    switch (item?.type) {
      case 'TEXT_AREA': {
        ruleElement = [...rules.text];
        element = <Input.TextArea rows={3} placeholder={item?.label ?? ''} />;
        break;
      }
      case 'INPUT_NUMBER': {
        initialValue = Number(item?.value);
        element = (
          <InputNumber
            style={{ width: '100%' }}
            placeholder={item?.label ?? ''}
            min={item?.min ?? 0}
            max={item?.max ?? 100000000}
          />
        );
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
        ruleElement = [...rules.fileRequired];
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
        ruleElement = [...rules.fileRequired];
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
          // <DiaChi
          //   hideDiaChiCuThe={item?.level !== 4}
          //   hideQuanHuyen={item?.level === 1}
          //   hideXaPhuong={[1, 2].includes(item?.level)}
          //   notRequiredDiaChiCuThe={!item?.isRequired}
          //   notRequiredQuanHuyen={!item?.isRequired}
          //   notRequiredTinh={!item?.isRequired}
          //   notRequiredXaPhuong={!item?.isRequired}
          //   initialValue={item?.value}
          //   form={form}
          //   fields={{
          //     tinh: [`${name}.${item?.label ?? ''}`, 'maTinh'],
          //     quanHuyen: [`${name}.${item?.label ?? ''}`, 'maQuanHuyen'],
          //     xaPhuong: [`${name}.${item?.label ?? ''}`, 'maPhuongXa'],
          //     diaChiCuThe: [`${name}.${item?.label ?? ''}`, 'soNhaTenDuong'],
          //   }}
          // />
          <SelectDonViHanhChinh form={form} />
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
        ruleElement = [
          {
            validator: (__: { field: string | number }, value: any, callback: any) => {
              if (!danhSachDataTable || !danhSachDataTable?.[__?.field]?.length) callback('');
              callback();
            },
            message: 'Bắt buộc',
            required: true,
          },
        ];

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
        ruleElement = [...rules.text];
        const kyHoc = danhSachKyHoc;
        ruleElement = [...rules.text];
        element = (
          <Select allowClear placeholder={item?.label ?? ''}>
            {kyHoc?.map((kyhoc: any) => (
              <Select.Option
                key={kyhoc.id}
                value={`Kỳ ${kyhoc.ten_ky_nam_hoc} năm ${kyhoc.nam_hoc_id?.[1]}`}
              >
                Kỳ {kyhoc.ten_ky_nam_hoc} năm {kyhoc.nam_hoc_id?.[1]}
              </Select.Option>
            ))}
          </Select>
        );
        break;
      }
      case 'MY_YEAR': {
        initialValue = item?.value;
        ruleElement = [...rules.text];
        const namHoc = danhSachNamHoc;
        element = (
          <Select allowClear placeholder={item?.label ?? ''}>
            {namHoc?.map((nam: any) => (
              <Select.Option key={nam.id} value={`Năm học ${nam.ten_nam_hoc}`}>
                Năm học {nam.ten_nam_hoc}
              </Select.Option>
            ))}
          </Select>
        );
        break;
      }
      case 'MY_CREDIT': {
        initialValue = item?.value;
        const monHoc = danhSachMonHoc;
        element = (
          <AutoComplete
            filterOption={(value, option) => includes(option?.props.children, value)}
            showSearch
            allowClear
            placeholder={item?.label ?? ''}
          >
            {monHoc?.map((mon: any) => (
              <Select.Option key={mon.id} value={`${mon.ten_hoc_phan} (${mon.ma_hoc_phan_moi})`}>
                {mon.ten_hoc_phan} ({mon.ma_hoc_phan_moi})
              </Select.Option>
            ))}
          </AutoComplete>
        );
        break;
      }
      case 'MY_COURSE': {
        initialValue = item?.value;
        const lopHoc = danhSachLopTinChi;
        element = (
          <Select
            filterOption={(value, option) => includes(option?.props.children, value)}
            showSearch
            allowClear
            placeholder={item?.label ?? ''}
          >
            {lopHoc?.map((lop: any) => (
              <Select.Option key={lop.id} value={`${lop.ten_hoc_phan} (${lop.ma_lop})`}>
                {lop.ten_hoc_phan} ({lop.ma_lop})
              </Select.Option>
            ))}
          </Select>
        );
        break;
      }
      case 'DAN_TOC': {
        initialValue = item?.value;
        element = (
          <Select showSearch allowClear placeholder={item?.label ?? ''}>
            {danhSachDanToc?.map((dantoc: any) => (
              <Select.Option key={dantoc._id} value={dantoc.tenDanToc}>
                {dantoc.tenDanToc}
              </Select.Option>
            ))}
          </Select>
        );
        break;
      }

      case 'TON_GIAO': {
        initialValue = item?.value;
        element = (
          <Select showSearch allowClear placeholder={item?.label ?? ''}>
            {danhSachTonGiao?.map((tongiao: any) => (
              <Select.Option key={tongiao._id} value={tongiao.tenTonGiao}>
                {tongiao.tenTonGiao}
              </Select.Option>
            ))}
          </Select>
        );
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
              {/* {item.type === 'DON_VI_HANH_CHINH' && !access.sinhVien && (
                <Tooltip title="Sao chép địa chỉ">
                  <CopyOutlined
                    onClick={() => {
                      navigator.clipboard.writeText(
                        [
                          item?.value?.soNhaTenDuong,
                          item?.value?.tenPhuongXa,
                          item?.value?.tenQuanHuyen,
                          item?.value?.tenTinh,
                        ]
                          ?.filter((text) => text !== undefined && text !== null && text !== '')
                          ?.join(', '),
                      );
                      message.success('Đã copy địa chỉ');
                    }}
                    style={{ marginLeft: 8 }}
                  />
                </Tooltip>
              )} */}
            </div>
          }
          name={item.type === 'DON_VI_HANH_CHINH' ? undefined : `${name}.${item?.label}`}
          rules={item?.isRequired ? [...ruleElement, ...rules.required] : []}
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

            {((record?.thongTinThuTuc?.yeuCauTraPhi &&
              record?.thongTinThuTuc?.tinhTienTheoSoLuong) ||
              props?.record?.trangThaiThanhToan) &&
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
        {!['handle', 'view'].includes(props?.type ?? '') && !props.hideCamKet && (
          <Checkbox
            style={{ marginBottom: 8, marginLeft: 12 }}
            onChange={(e) => setCheck(e.target.checked)}
          >
            Tôi xin cam đoan các thông tin là kê khai là chính xác và sử dụng giấy chứng nhận sinh
            viên đúng theo lý do đã trình bày trên.
          </Checkbox>
        )}

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

        {recordDon?.maDon && loaiDichVu !== 'VAN_PHONG_SO' ? (
          <Form.Item label={'Mã đơn'} style={{ marginLeft: '10px' }}>
            <>
              {recordDon?.maDon && (
                <>
                  {recordDon?.maDon ?? ''}{' '}
                  <CopyOutlined
                    onClick={() => {
                      const textField = document.createElement('textarea');
                      textField.innerText = recordDon?.maDon;
                      document.body.appendChild(textField);
                      textField.select();
                      document.execCommand('copy');
                      textField.remove();
                      message.success('Copy thành công');
                    }}
                  />{' '}
                </>
              )}
            </>
          </Form.Item>
        ) : null}

        <Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>
          {!['view', 'handle', 'edit'].includes(props?.type ?? '') && (
            <Button
              disabled={props?.hideCamKet ? false : !check}
              loading={loading}
              style={{ marginRight: 8 }}
              htmlType="submit"
              type="primary"
            >
              {props?.textSaveButton || 'Gửi đơn'}
            </Button>
          )}
          {['edit'].includes(props?.type ?? '') && (
            <Button
              disabled={props?.hideCamKet ? false : !check}
              loading={loading}
              style={{ marginRight: 8 }}
              htmlType="submit"
              type="primary"
            >
              Lưu
            </Button>
          )}

          {/* {props?.traKetQua &&
            ['view'].includes(props?.type ?? '') &&
            props?.duocPhepSuaKetQua === true &&
            !arrPathName?.includes('vanphongso') && (
              <Button
                style={{ marginRight: 8 }}
                type="primary"
                onClick={() => {
                  setTypeXuLy('edit-result');
                }}
              >
                Sửa kết quả
              </Button>
            )} */}
          {props?.onCancel && <Button onClick={() => props?.onCancel()}>Đóng</Button>}
        </Form.Item>
      </Form>
    </Card>
  );
};

export default FormBieuMau;
