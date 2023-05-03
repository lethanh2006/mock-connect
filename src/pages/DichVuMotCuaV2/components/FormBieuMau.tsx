import DiaChi from '@/components/DiaChi';
import HocPhanCoDiem from '@/components/HocPhanCoDiem';
import Upload from '@/components/Upload/UploadMultiFile';
import FormBieuMauChonXe from '@/pages/VanPhongSo/DonMuonXe/components/FormBieuMauChonXe';
import type { DichVuMotCuaV2 } from '@/services/DichVuMotCuaV2/typing';
import type { QuanLyOto } from '@/services/QuanLyOto/typings';
import type { VanphongsoCsvc } from '@/services/VanPhongSo/typings';
import { getXeKhaDung } from '@/services/VanPhongSo/vanphongso';
import {
  accessFileUpload,
  ColorTrangThaiDonMotCua,
  ETrangThaiDonVps,
  MaDichVuVps,
} from '@/utils/constants';
import rules from '@/utils/rules';
import {
  checkFileSize,
  includes,
  renderFileList,
  uploadMultiFile,
  useCheckAccess,
} from '@/utils/utils';
import { CopyOutlined } from '@ant-design/icons';
import {
  AutoComplete,
  Button,
  Card,
  Checkbox,
  DatePicker,
  Descriptions,
  Divider,
  Dropdown,
  Form,
  Input,
  InputNumber,
  Menu,
  message,
  Modal,
  Radio,
  Select,
  Tag,
  Tooltip,
} from 'antd';
import moment from 'moment';
import mm from 'moment-timezone';
import { useEffect, useState } from 'react';
import { useAccess, useModel } from 'umi';
import FormDieuPhoi from '../QuanLyDon/components/FormDieuPhoi';
import FormXuLyDon from '../QuanLyDon/components/FormXuLyDon';
import Table from './TableElement';
import ThongTinNguoiTaoDon from './ThongTinNguoiTaoDon';
import TieuDeBieuMau from './TieuDeBieuMau';
import FormBieuMauChonPhong from '@/pages/VanPhongSo/DonMuonPhongHop/components/FormBieuMauChonPhong';

mm.tz.setDefault('Asia/Ho_Chi_Minh');

const FormBieuMau = (props: {
  infoNguoiTaoDon?: SinhVien.IRecord;
  record?: DichVuMotCuaV2.Don & { index?: number };
  type?: 'view' | 'handle' | 'create' | 'edit' | 'muonCsvc';
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
  const chuyenVienDieuPhoiDuyetDon = useCheckAccess('don-dvmc-thao-tac:duyet-all');
  const chuyenVienXuLyDuyetDon = useCheckAccess('don-dvmc-thao-tac:duyet-my');
  const canDieuPhoiDon = useCheckAccess('don-dvmc-thao-tac:dieu-phoi');
  const isQuanTriVps = useCheckAccess('quan-tri-vps');

  const [form] = Form.useForm();
  const access = useAccess();
  const {
    loading,
    danhSachDataTable,
    setDanhSachDataTable,
    postDonSinhVienModel,
    record,
    recordDonThaoTac,
    recordDon,
    sinhVienPutDonModel,
    exportDonModel,
    setVisibleForm,
    getDonSinhVienModel,
    loaiDichVu,
    adminGetDonVpsModel,
  } = useModel('dichvumotcuav2');
  const { danhSach: danhSachKyHoc } = useModel('hocky');
  const { danhSach: danhSachNamHoc } = useModel('namhoc');
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
  const { getQuanLyOtoAllModel, danhSach: danhSachOto } = useModel('quanlyoto');
  const { getAllDonMuonPhongByIdDonModel, getAllPhongKhaDungModel, getAllPhongModel } =
    useModel('quantriphonghop');
  const { laiXe, xeChon, setXeChon, setLaiXe } = useModel('quantrixecong');
  const { getAllLaiXeModel } = useModel('quanlylaixe');

  const [recordEdit, setRecordEdit] = useState<{ duLieuBieuMau: DichVuMotCuaV2.CauHinhBieuMau[] }>({
    duLieuBieuMau: [],
  });

  const [valuesForm, setValuesForm] = useState<any>({});
  const [visibleFormDieuPhoi, setVisibleFormDieuPhoi] = useState<boolean>(false);
  const [visibleFormXuLy, setVisibleFormXuLy] = useState<boolean>(false);
  const [typeXuLy, setTypeXuLy] = useState<'ok' | 'not-ok' | 'edit-result'>('ok');

  // state xe công
  const [visibleChonXe, setVisibleChonXe] = useState<boolean>(false);
  const [dataXeKhacLoai, setDataXeKhacLoai] = useState<any>();
  const [dataXeCungLoai, setDataXeCungLoai] = useState<any>();

  // state phòng họp
  const [selectedRow, setSelectedRow] = useState<VanphongsoCsvc.PhongHopRecord>();
  const [timeMuonPhong, setTimeMuonPhong] = useState<string>();
  const [timeTraPhong, setTimeTraPhong] = useState<string>();
  const [visibleChonPhong, setVisibleChonPhong] = useState<boolean>(false);

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
        const recordTemp = {};
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
        // else if (item?.type === 'BUTTON_SEARCH_PHONG') {
        //   value = selectedRow?._id ?? '';
        // }
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
        objectFileUpload[item] = await uploadMultiFile(values[item]?.fileList ?? [], true);
      }
    }
    const valuesFinal = { ...values, ...objectFileUpload };
    const duLieuBieuMau = buildPostData(
      'cauHinhBieuMau',
      valuesFinal,
      props?.handleAdd ||
        props?.type === 'edit' ||
        props?.type === 'handle' ||
        props?.type === 'muonCsvc'
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

    // phần văn phòng số
    if (props?.record?.thongTinDichVu?.maDichVu === MaDichVuVps.MUON_PHONG_HOC) {
      if (['handle'].includes(props?.type ?? '')) {
        getAllPhongKhaDungModel({
          thoiGianBd: props?.record?.thongTinDichVu?.cauHinhBieuMau[0].value,
          thoiGianKt: props?.record?.thongTinDichVu?.cauHinhBieuMau[1].value,
        });
        getAllDonMuonPhongByIdDonModel(props?.record?._id ?? '');
      }
      if (['create', 'muonCsvc'].includes(props?.type ?? '')) {
        getAllPhongModel();
      }
    }
    if (props?.record?.thongTinDichVu?.maDichVu === MaDichVuVps.MUON_OTO) {
      getAllLaiXeModel();
    }
    if (props?.record?.thongTinDichVu?.cauHinhBieuMau?.find((item) => item?.type == '_OTO')) {
      getQuanLyOtoAllModel();
    }
    return () => {
      if (!props?.handleAdd) setDanhSachDataTable({});
      setTenTinh({});
      setTenQuanHuyen({});
      setTenXaPhuong({});
      setObjDanhSachQuanHuyen({});
      setObjDanhSachXaPhuong({});
    };
  }, []);

  const onClickMenuExport = (
    idDon: string,
    item: { key: 'word' | 'pdf' },
    mauExport: 'MAU_DON' | 'TRA_LOI',
    tenDon: string,
  ) => {
    exportDonModel({
      idDon,
      mauExport,
      exportType: item.key,
      tenDon,
    });
  };

  const handleChonXe = async (item: any) => {
    await getXeKhaDung({
      thoiGianBd: item.cauHinhBieuMau[0]?.value as string,
      thoiGianKt: item.cauHinhBieuMau[1]?.value as string,
      // loaiXe: item.cauHinhBieuMau[2]?.value as string,
    }).then((res) => {
      setDataXeKhacLoai(
        res?.data?.data?.result
          ?.filter((el: any) => el?.info?.loaiXe !== item.cauHinhBieuMau[2]?.value)
          ?.map((e: any) => {
            return { ...e.info, id: e._id };
          }),
      );
      setDataXeCungLoai(
        res?.data?.data?.result
          ?.filter((it: any) => {
            return it?.info?.loaiXe == item.cauHinhBieuMau[2]?.value;
          })
          ?.map((e: any) => {
            return { ...e.info, id: e._id };
          }),
      );
      setVisibleChonXe(true);
    });
  };

  const handleCloseChonXe = () => {
    setVisibleChonXe(false);
    setXeChon({} as any);
    setLaiXe({} as any);
  };

  //xử lý ở modal chọn xe công và phòng họp
  const handleDuyetDon = async () => {
    const values = form.getFieldsValue();
    const { duLieuBieuMau } = await onSubmitForm(values);
    setRecordEdit({ duLieuBieuMau });
    setVisibleFormXuLy(true);
    setTypeXuLy('ok');
  };

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
      case '_OTO': {
        initialValue = item?.value;
        element = (
          <Select allowClear placeholder={item?.label ?? ''}>
            {danhSachOto &&
              danhSachOto.map((oto: QuanLyOto.Record, index: number) => (
                <Select.Option key={oto._id} value={oto?.hoTen}>
                  {oto?.hoTen} - {oto?.bienSoXe}
                </Select.Option>
              ))}
          </Select>
        );
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
          <DatePicker
            style={{ width: '100%' }}
            format="DD/MM/YYYY HH:mm"
            showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
            onChange={(val: any) => {
              if (item?.label === 'Ngày giờ mượn') {
                setTimeMuonPhong(val);
              } else {
                setTimeTraPhong(val);
              }
            }}
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
          <DiaChi
            hideDiaChiCuThe={item?.level !== 4}
            hideQuanHuyen={item?.level === 1}
            hideXaPhuong={[1, 2].includes(item?.level)}
            notRequiredDiaChiCuThe={!item?.isRequired}
            notRequiredQuanHuyen={!item?.isRequired}
            notRequiredTinh={!item?.isRequired}
            notRequiredXaPhuong={!item?.isRequired}
            initialValue={item?.value}
            form={form}
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
          const row = {};
          recordRow?.forEach((cell: DichVuMotCuaV2.CauHinhBieuMau) => {
            let value = typeof cell?.value === 'object' ? cell?.value?.join(', ') : cell?.value;
            if (cell.type === 'DATE_PICKER') {
              value = moment(cell?.value)?.format('HH:mm DD/MM/YYYY');
            }
            if (
              props?.record?.thongTinDichVu?.maDichVu === MaDichVuVps.BAO_CAO_SU_CO &&
              cell.type === 'UPLOAD_SINGLE'
            ) {
              value = cell?.value?.map((el: any) => {
                return el.url ? (
                  <a href={el?.url} rel="noreferrer" target="_blank">
                    {el?.url}
                  </a>
                ) : (
                  'Ảnh trống'
                );
              });
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
        const kyHoc = access.sinhVien
          ? danhSachKyHoc
          : [
              // { id: 1, ten_ky_nam_hoc: '1', nam_hoc_id: [1, '2022-2023'] },
              // { id: 2, ten_ky_nam_hoc: '2', nam_hoc_id: [2, '2022-2023'] },
            ];
        ruleElement = [...rules.text];
        element = access.sinhVien ? (
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
        ) : (
          <Input placeholder="Nhập kỳ học" />
        );
        break;
      }
      case 'MY_YEAR': {
        initialValue = item?.value;
        ruleElement = [...rules.text];
        const namHoc = access.sinhVien
          ? danhSachNamHoc
          : [
              // { id: 1, ten_nam_hoc: '2021-2022' },
              // { id: 2, ten_nam_hoc: '2022-2023' },
            ];
        element = access.sinhVien ? (
          <Select allowClear placeholder={item?.label ?? ''}>
            {namHoc?.map((nam: any) => (
              <Select.Option key={nam.id} value={`Năm học ${nam.ten_nam_hoc}`}>
                Năm học {nam.ten_nam_hoc}
              </Select.Option>
            ))}
          </Select>
        ) : (
          <Input placeholder="Nhập năm học" />
        );
        break;
      }
      case 'MY_CREDIT': {
        initialValue = item?.value;
        const monHoc = access.sinhVien ? danhSachMonHoc : [];
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
        const lopHoc = access.sinhVien ? danhSachLopTinChi : [];
        element = access.sinhVien ? (
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
        ) : (
          <Input placeholder="Chọn lớp tín chỉ" />
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
              {item.type === 'DON_VI_HANH_CHINH' && !access.sinhVien && (
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
              )}
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
        if (
          (props?.type === 'muonCsvc' && arrPathName?.includes('xecong')) ||
          arrPathName?.includes('phonghop')
        ) {
          if (Number(moment(timeTraPhong).diff(moment(timeMuonPhong), 'minutes')) <= 0) {
            message.error('Thời gian mượn phải nhỏ hơn thời gian trả!');
            return;
          }
        }
        postDonSinhVienModel({
          soLuongThanhToan: values?.soLuongThanhToan,
          duLieuBieuMau,
          dichVuId: props?.type === 'muonCsvc' ? props?.record?.thongTinDichVu?._id : record?._id,
          traKetQua: props?.record?.thongTinDichVu?.traKetQua,
          daTraKetQua: false,
          idCoSoVatChat: props?.isMuonPhongHop ? selectedRow?._id : null,
        }).then(() => {
          if (props?.type === 'muonCsvc') {
            if (isQuanTriVps) {
              adminGetDonVpsModel(
                props?.isMuonPhongHop
                  ? MaDichVuVps.MUON_PHONG_HOC
                  : props?.isBaoCaoSuCo
                  ? MaDichVuVps.BAO_CAO_SU_CO
                  : MaDichVuVps.MUON_OTO,
              );
            } else {
              getDonSinhVienModel(
                props?.isMuonPhongHop
                  ? MaDichVuVps.MUON_PHONG_HOC
                  : props?.isBaoCaoSuCo
                  ? MaDichVuVps.BAO_CAO_SU_CO
                  : MaDichVuVps.MUON_OTO,
              );
            }
            setVisibleForm(false);
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
            {props?.type === 'view' && props?.record?.thongTinMuonPhong ? (
              <>
                <p>Thông tin mượn phòng:</p>
                <Descriptions
                  size="small"
                  column={{ xxl: 4, xl: 4, lg: 3, md: 3, sm: 2, xs: 1 }}
                  layout="vertical"
                  bordered
                  style={{ marginBottom: '20px' }}
                >
                  <Descriptions.Item label="Tòa nhà">
                    {props?.record?.idCoSoVatChat?.info?.toaNha ?? 'Không xác định'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Tên phòng">
                    {props?.record?.idCoSoVatChat?.info?.tenPhong ?? 'Không xác định'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Số phòng">
                    {props?.record?.idCoSoVatChat?.info?.soPhong ?? 'Không xác định'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Số chỗ">
                    {props?.record?.idCoSoVatChat?.info?.soCho ?? 'Không xác định'}
                  </Descriptions.Item>
                </Descriptions>
              </>
            ) : null}

            {props?.record?.thongTinMuonXe ? (
              <div style={{ marginBottom: '20px' }}>
                <p>Thông tin mượn xe:</p>
                <Descriptions
                  size="small"
                  column={{ xxl: 4, xl: 4, lg: 3, md: 3, sm: 2, xs: 1 }}
                  layout="vertical"
                  bordered
                  style={{ marginBottom: '20px' }}
                >
                  <Descriptions.Item label="Biển số xe">
                    {props?.record?.thongTinMuonXe?.bienSoXe ?? 'Không xác định'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Thời gian mượn">
                    {props?.record?.thongTinMuonXe?.thoiGianBd
                      ? moment(props?.record?.thongTinMuonXe?.thoiGianBd).format('DD/MM/YYYY')
                      : 'Không xác định'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Thời gian trả">
                    {props?.record?.thongTinMuonXe?.thoiGianKt
                      ? moment(props?.record?.thongTinMuonXe?.thoiGianKt).format('DD/MM/YYYY')
                      : 'Không xác định'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Trạng thái mượn xe">
                    <Tag
                      color={
                        props?.record?.thongTinMuonXe?.trangThai === ETrangThaiDonVps.DA_DUYET
                          ? ColorTrangThaiDonMotCua.OK
                          : props?.record?.thongTinMuonXe?.trangThai === ETrangThaiDonVps.DA_HUY
                          ? ColorTrangThaiDonMotCua.NOT_OK
                          : props?.record?.thongTinMuonXe?.trangThai === ETrangThaiDonVps.DANG_MUON
                          ? '#72c9f1'
                          : '#299b8c'
                      }
                    >
                      {props?.record?.thongTinMuonXe?.trangThai ?? 'Không xác định'}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Thông tin lái xe">
                    Họ tên:{' '}
                    {props?.record?.thongTinMuonXe?.thongTinlaiXe[0]?.hoTen ?? 'Không xác định'}
                    <br />
                    Số điện thoại:{' '}
                    {props?.record?.thongTinMuonXe?.thongTinlaiXe[0]?.sdt ?? 'Không xác định'}
                  </Descriptions.Item>
                </Descriptions>
              </div>
            ) : null}

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
              disabled={props?.hideCamKet || props.type === 'muonCsvc' ? false : !check}
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
              disabled={props?.hideCamKet || props.type === 'muonCsvc' ? false : !check}
              loading={loading}
              style={{ marginRight: 8 }}
              htmlType="submit"
              type="primary"
            >
              Lưu
            </Button>
          )}

          {['handle'].includes(props?.type ?? '') && (
            <>
              {props.record?.thongTinDichVu?.maDichVu === MaDichVuVps.MUON_OTO ? (
                <Button
                  disabled={!chuyenVienDieuPhoiDuyetDon && !chuyenVienXuLyDuyetDon}
                  onClick={() => handleChonXe(props.record?.thongTinDichVu)}
                  style={{
                    marginRight: 8,
                    backgroundColor: '#007F3E',
                    border: '1px solid #007F3E',
                    color: 'white',
                  }}
                >
                  Chọn xe và duyệt
                </Button>
              ) : props.record?.thongTinDichVu?.maDichVu === MaDichVuVps.MUON_PHONG_HOC ? (
                <Button
                  disabled={!chuyenVienDieuPhoiDuyetDon && !chuyenVienXuLyDuyetDon}
                  onClick={() => setVisibleChonPhong(true)}
                  style={{
                    marginRight: 8,
                    backgroundColor: '#007F3E',
                    border: '1px solid #007F3E',
                    color: 'white',
                  }}
                >
                  Chọn phòng và duyệt
                </Button>
              ) : (
                <Button
                  disabled={!chuyenVienDieuPhoiDuyetDon && !chuyenVienXuLyDuyetDon}
                  onClick={async () => {
                    const values = form.getFieldsValue();
                    const { duLieuBieuMau } = await onSubmitForm(values);
                    setRecordEdit({ duLieuBieuMau });
                    setVisibleFormXuLy(true);
                    setTypeXuLy('ok');
                  }}
                  style={{
                    marginRight: 8,
                    backgroundColor: '#007F3E',
                    border: '1px solid #007F3E',
                    color: 'white',
                  }}
                >
                  {props.record?.thongTinDichVu?.maDichVu !== MaDichVuVps.BAO_CAO_SU_CO
                    ? 'Duyệt'
                    : 'Tiếp nhận'}
                </Button>
              )}

              <Button
                disabled={!chuyenVienDieuPhoiDuyetDon && !chuyenVienXuLyDuyetDon}
                onClick={() => {
                  setVisibleFormXuLy(true);
                  setTypeXuLy('not-ok');
                }}
                type="primary"
                style={{
                  marginRight: 8,
                  backgroundColor: '#007EB9',
                  border: '1px solid #007EB9',
                  color: 'white',
                }}
              >
                {props.record?.thongTinDichVu?.maDichVu !== MaDichVuVps.BAO_CAO_SU_CO
                  ? 'Không duyệt'
                  : 'Từ chối'}
              </Button>

              {arrPathName?.includes('quanlydondieuphoi') && (
                <Button
                  disabled={!canDieuPhoiDon}
                  style={{
                    marginRight: 8,
                    backgroundColor: '#1890ff',
                    border: '1px solid #1890ff',
                    color: 'white',
                  }}
                  onClick={() => {
                    setVisibleFormDieuPhoi(true);
                  }}
                >
                  Điều phối
                </Button>
              )}

              {loaiDichVu !== 'VAN_PHONG_SO' ? (
                <>
                  <Dropdown
                    overlay={
                      <Menu
                        onClick={(item: any) =>
                          onClickMenuExport(
                            recordDon?._id ?? '',
                            item,
                            'MAU_DON',
                            `BieuMau_${recordDon?.thongTinDichVu?.ten}_${recordDon?.thongTinNguoiTao?.maSinhVien}_${recordDon?.thongTinNguoiTao?.hoTen}`,
                          )
                        }
                      >
                        <Menu.Item key="word">Tải về</Menu.Item>
                        <Menu.Item key="pdf">In mẫu</Menu.Item>
                      </Menu>
                    }
                  >
                    <Button style={{ marginRight: 8 }} loading={loading}>
                      Xuất mẫu đơn
                    </Button>
                  </Dropdown>
                  {props?.traKetQua && (
                    <Dropdown
                      overlay={
                        <Menu
                          onClick={(item: any) =>
                            onClickMenuExport(
                              recordDon?._id ?? '',
                              item,
                              'TRA_LOI',
                              `KetQua_${recordDon?.thongTinDichVu?.ten}_${recordDon?.thongTinNguoiTao?.maSinhVien}_${recordDon?.thongTinNguoiTao?.hoTen}`,
                            )
                          }
                        >
                          <Menu.Item key="word">Tải về</Menu.Item>
                          <Menu.Item key="pdf">In mẫu</Menu.Item>
                        </Menu>
                      }
                    >
                      <Button style={{ marginRight: 8 }} loading={loading}>
                        Xuất mẫu trả KQ
                      </Button>
                    </Dropdown>
                  )}
                </>
              ) : null}
            </>
          )}
          {props?.traKetQua &&
            ['view'].includes(props?.type ?? '') &&
            props?.duocPhepSuaKetQua === true &&
            !arrPathName?.includes('vanphongso') && (
              <Button
                style={{ marginRight: 8 }}
                type="primary"
                onClick={() => {
                  setVisibleFormXuLy(true);
                  setTypeXuLy('edit-result');
                }}
              >
                Sửa kết quả
              </Button>
            )}
          {props?.onCancel && <Button onClick={() => props?.onCancel()}>Đóng</Button>}
          {/* <Button
            onClick={() => (props?.onCancel ? props?.onCancel() : setVisibleFormBieuMau(false))}
          >
            Đóng
          </Button> */}
        </Form.Item>
      </Form>
      <Modal
        destroyOnClose
        bodyStyle={{ padding: 0 }}
        footer={false}
        visible={visibleFormDieuPhoi}
        onCancel={() => {
          setVisibleFormDieuPhoi(false);
        }}
      >
        <FormDieuPhoi
          onCancel={() => {
            setVisibleFormDieuPhoi(false);
          }}
        />
      </Modal>
      <Modal
        destroyOnClose
        bodyStyle={{ padding: 0 }}
        footer={false}
        visible={visibleFormXuLy}
        onCancel={() => {
          setVisibleFormXuLy(false);
        }}
      >
        <FormXuLyDon
          recordEdit={recordEdit}
          traKetQua={props?.traKetQua ?? false}
          type={typeXuLy}
          onCancel={() => {
            setVisibleFormXuLy(false);
          }}
          idCoSoVatChat={xeChon?.id}
          laiXe={laiXe}
          xeChon={xeChon}
          idCsvcPhong={selectedRow?._id ?? ''}
        />
      </Modal>
      <Modal
        maskClosable={false}
        bodyStyle={{ padding: 0 }}
        footer={false}
        visible={visibleChonXe}
        onCancel={() => handleCloseChonXe()}
        width={800}
      >
        <FormBieuMauChonXe
          propsRecord={props?.record}
          dataXeKhacLoai={dataXeKhacLoai}
          dataXeCungLoai={dataXeCungLoai}
          setVisibleChonXe={setVisibleChonXe}
          handleDuyetDon={handleDuyetDon}
          handleCloseChonXe={handleCloseChonXe}
        />
      </Modal>

      <Modal
        maskClosable={false}
        bodyStyle={{ padding: 0 }}
        footer={false}
        visible={visibleChonPhong}
        onCancel={() => {
          setVisibleChonPhong(false);
        }}
        width={800}
      >
        <FormBieuMauChonPhong
          propsRecord={props?.record}
          setSelectedRow={setSelectedRow}
          selectedRow={selectedRow}
          setVisibleChonPhong={setVisibleChonPhong}
          handleDuyetDon={handleDuyetDon}
        />
      </Modal>
    </Card>
  );
};

export default FormBieuMau;
