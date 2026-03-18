import TableBase from '@/components/Table';
import { EOperatorType } from '@/components/Table/constant';
import { type IColumn, type TFilter } from '@/components/Table/typing';
import { DeleteOutlined, EditOutlined, FilterOutlined, LockOutlined, StopOutlined, SyncOutlined } from '@ant-design/icons';
import { Alert, Button, Popconfirm, Segmented, Space, Switch, Tooltip } from 'antd';
import dayjs from '@/utils/dayjs';
import { formatDateTime } from '@/utils/formatDate';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useModel } from 'umi';
import Form from './components/Form';

type TDemoMode = 'sync' | 'readonly' | 'modalOff';
type TDemoPreset = 'none' | 'tenTruong' | 'maM01M02' | 'created30Days' | 'combo';

const getExternalFiltersByPreset = (preset: TDemoPreset): TFilter<ChucVu.IRecord>[] => {
  const from30Days = dayjs().subtract(30, 'day').startOf('day').toISOString();
  const toNow = dayjs().endOf('day').toISOString();

  switch (preset) {
    case 'tenTruong':
      return [
        {
          field: 'ten',
          operator: EOperatorType.CONTAIN,
          values: ['Trưởng'],
          active: true,
        },
      ];

    case 'maM01M02':
      return [
        {
          field: 'ma',
          operator: EOperatorType.INCLUDE,
          values: ['M01', 'M02'],
          active: true,
        },
      ];

    case 'created30Days':
      return [
        {
          field: 'createdAt',
          operator: EOperatorType.BETWEEN,
          values: [from30Days, toNow],
          active: true,
        },
      ];

    case 'combo':
      return [
        {
          operator: EOperatorType.AND,
          active: true,
          filters: [
            {
              field: 'ma',
              operator: EOperatorType.INCLUDE,
              values: ['M01', 'M02'],
              active: true,
            },
            {
              field: 'ten',
              operator: EOperatorType.CONTAIN,
              values: ['Trưởng'],
              active: true,
            },
          ],
        },
      ];

    case 'none':
    default:
      return [];
  }
};

const ChucVuPage = () => {
  const { getModel, page, limit, deleteModel, handleEdit, setFilters, setPage } = useModel('danhmuc.chucvu') as any;

  const [mode, setMode] = useState<TDemoMode>('sync');
  const [syncPreset, setSyncPreset] = useState<TDemoPreset>('tenTruong');
  const [modalOffPreset, setModalOffPreset] = useState<TDemoPreset>('maM01M02');
  const [readOnlySyncToColumnFilter, setReadOnlySyncToColumnFilter] = useState<boolean>(true);
  const [syncExternalFilters, setSyncExternalFilters] = useState<TFilter<ChucVu.IRecord>[]>(
    getExternalFiltersByPreset('tenTruong'),
  );
  const [modalOffExternalFilters, setModalOffExternalFilters] = useState<TFilter<ChucVu.IRecord>[]>(
    getExternalFiltersByPreset('maM01M02'),
  );

  const readOnlyExternalFilters = useMemo(() => getExternalFiltersByPreset('combo'), []);

  const applySyncPreset = useCallback(
    (preset: TDemoPreset) => {
      setSyncPreset(preset);
      setSyncExternalFilters(getExternalFiltersByPreset(preset));
      setPage?.(1);
    },
    [setPage],
  );

  const applyModalOffPreset = useCallback(
    (preset: TDemoPreset) => {
      setModalOffPreset(preset);
      setModalOffExternalFilters(getExternalFiltersByPreset(preset));
      setPage?.(1);
    },
    [setPage],
  );

  const getDataSync = useCallback(() => getModel(undefined, syncExternalFilters), [getModel, syncExternalFilters]);
  const getDataReadOnly = useCallback(() => getModel(undefined, readOnlyExternalFilters), [getModel, readOnlyExternalFilters]);
  const getDataModalOff = useCallback(
    () => getModel(undefined, modalOffExternalFilters),
    [getModel, modalOffExternalFilters],
  );

  useEffect(() => {
    setFilters?.([]);
    setPage?.(1);
  }, [mode, readOnlySyncToColumnFilter, setFilters, setPage]);

  const columns: IColumn<ChucVu.IRecord>[] = [
    {
      title: 'Mã',
      dataIndex: 'ma',
      width: 80,
      filterType: 'select',
      filterData: ['M01', 'M02', 'M03'],
      sortable: true,
      resizable: true,
    },
    {
      title: 'Tên chức vụ',
      dataIndex: 'ten',
      width: 250,
      minWidth: 150,
      maxWidth: 600,
      filterType: 'string',
      sortable: true,
      resizable: true,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      align: 'center',
      width: 120,
      filterType: 'datetime',
      sortable: true,
      render: (val) => formatDateTime(val),
      resizable: true,
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 90,
      fixed: 'right',
      render: (record: ChucVu.IRecord) => (
        <>
          <Tooltip title="Chỉnh sửa">
            <Button onClick={() => handleEdit(record)} type="link" icon={<EditOutlined />} />
          </Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm
              onConfirm={() => deleteModel(record._id, getModel)}
              title="Bạn có chắc chắn muốn xóa chức vụ này?"
              placement="topLeft"
            >
              <Button danger type="link" icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
        </>
      ),
    },
  ];

  const demoModeOptions = [
    {
      label: (
        <Space size={6}>
          <SyncOutlined />
          Đồng bộ 2 chiều
        </Space>
      ),
      value: 'sync',
    },
    {
      label: (
        <Space size={6}>
          <LockOutlined />
          External readOnly
        </Space>
      ),
      value: 'readonly',
    },
    {
      label: (
        <Space size={6}>
          <StopOutlined />
          Tắt Modal Filter
        </Space>
      ),
      value: 'modalOff',
    },
  ];

  const presetOptions = [
    { label: 'Không lọc ngoài', value: 'none' },
    { label: 'Tên chứa Trưởng', value: 'tenTruong' },
    { label: 'Mã M01/M02', value: 'maM01M02' },
    { label: 'Trong 30 ngày', value: 'created30Days' },
    { label: 'Kết hợp nhóm', value: 'combo' },
  ];

  const currentModeConfig = useMemo(() => {
    if (mode === 'readonly') {
      return {
        modeTitle: 'Demo 2: Bộ lọc ngoài chỉ đọc',
        modeDescription:
          'Filter bên ngoài đã được nhúng vào TableBase và Modal Filter nhưng không cho sửa trong Modal vì không truyền callback đồng bộ. Có thể bật/tắt việc hiển thị đồng bộ sang filter cột.',
        externalFilters: readOnlyExternalFilters,
        onExternalFiltersChange: undefined,
        disableFilterModal: false,
        syncExternalToColumnFilter: readOnlySyncToColumnFilter,
        getData: getDataReadOnly,
      };
    }

    if (mode === 'modalOff') {
      return {
        modeTitle: 'Demo 3: Tắt Modal Filter, chỉ dùng filter ngoài + filter cột',
        modeDescription:
          'Ẩn nút Bộ lọc trong header/dropdown. Người dùng thao tác filter ngoài ở phần preset để giữ UX đơn giản, đồng nhất.',
        externalFilters: modalOffExternalFilters,
        onExternalFiltersChange: (filters: TFilter<ChucVu.IRecord>[]) => setModalOffExternalFilters(filters),
        disableFilterModal: true,
        syncExternalToColumnFilter: true,
        getData: getDataModalOff,
      };
    }

    return {
      modeTitle: 'Demo 1: Đồng bộ 2 giao diện filter',
      modeDescription:
        'Filter bên ngoài được truyền vào TableBase và có callback đồng bộ. Chỉnh ở preset ngoài hoặc trong Modal Filter đều cập nhật lẫn nhau.',
      externalFilters: syncExternalFilters,
      onExternalFiltersChange: (filters: TFilter<ChucVu.IRecord>[]) => setSyncExternalFilters(filters),
      disableFilterModal: false,
      syncExternalToColumnFilter: true,
      getData: getDataSync,
    };
  }, [
    mode,
    syncExternalFilters,
    modalOffExternalFilters,
    readOnlyExternalFilters,
    readOnlySyncToColumnFilter,
    getDataSync,
    getDataReadOnly,
    getDataModalOff,
  ]);

  const renderExternalPresetControl = () => {
    if (mode === 'readonly') {
      return (
        <>
          <Alert
            type='warning'
            showIcon
            style={{ marginBottom: 12 }}
            message='Chế độ readOnly'
            description='Trong chế độ này bạn chỉ xem được filter external đã khóa. Mở Modal Filter sẽ thấy các điều kiện đã nhúng nhưng không sửa được.'
          />

          <Space align='center' style={{ marginBottom: 12 }}>
            <span style={{ fontWeight: 500 }}>Đồng bộ external ra filter cột:</span>
            <Switch checked={readOnlySyncToColumnFilter} onChange={setReadOnlySyncToColumnFilter} />
            <span>{readOnlySyncToColumnFilter ? 'Bật (giữ như hiện tại)' : 'Tắt (filter cột thêm điều kiện AND riêng)'}</span>
          </Space>
        </>
      );
    }

    const activePreset = mode === 'sync' ? syncPreset : modalOffPreset;
    const onChangePreset = mode === 'sync' ? applySyncPreset : applyModalOffPreset;

    return (
      <Space wrap style={{ marginBottom: 12 }}>
        <span style={{ fontWeight: 500 }}>Preset filter ngoài:</span>
        <Segmented
          options={presetOptions}
          value={activePreset}
          onChange={(val) => onChangePreset(val as TDemoPreset)}
        />
      </Space>
    );
  };

  return (
    <TableBase
      columns={columns}
      dependencies={[page, limit, mode]}
      modelName="danhmuc.chucvu"
      title="Chức vụ - Demo đồng bộ filter ngoài vào TableBase"
      Form={Form}
      buttons={{ import: true }}
      getData={currentModeConfig.getData}
      externalFilters={currentModeConfig.externalFilters}
      onExternalFiltersChange={currentModeConfig.onExternalFiltersChange}
      disableFilterModal={currentModeConfig.disableFilterModal}
      syncExternalToColumnFilter={currentModeConfig.syncExternalToColumnFilter}
      cardExtra={
        <Segmented options={demoModeOptions} value={mode} onChange={(val) => setMode(val as TDemoMode)} />
      }
    >
      <Alert
        type='info'
        showIcon
        style={{ marginBottom: 12 }}
        message={currentModeConfig.modeTitle}
        description={currentModeConfig.modeDescription}
      />

      {renderExternalPresetControl()}

      <div style={{ marginBottom: 16, border: '1px solid #f0f0f0', borderRadius: 8, padding: 12 }}>
        <Space size={8} style={{ marginBottom: 8 }}>
          <FilterOutlined />
          <b>External filters đang truyền vào TableBase</b>
        </Space>
        <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
          {JSON.stringify(currentModeConfig.externalFilters, undefined, 2)}
        </pre>
      </div>
    </TableBase>
  );
};

export default ChucVuPage;
