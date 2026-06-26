import { useState, useEffect, useMemo } from 'react';
import TableBase from '@/components/Table';
import type { IColumn } from '@/components/Table/typing';
import { useIntl, useModel } from 'umi';
import { Tag, Col } from 'antd';
import { ETrangThaiThanhToan } from '@/services/KyTucXa/constant';
import { KyTucXa } from '@/services/KyTucXa/typings';
import "@/pages/KyTucXa/DangKy/style.less"
import SelectDotDangKyKTX from './components/SelectDotDangKy';
import { DeleteOutlined, DollarOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button, Space, Tooltip, Popconfirm } from 'antd';
import ModalDetailDangKy from './components/ModalChiTiet';
import dayjs from '@/utils/dayjs';
import ModalPayment from './ThanhToan/ModalThanhToan';
import { FilterIconCustom } from '../DangKy/components/IconsRoom';

const LichSuDangKyKTX = () => {
	const intl = useIntl();
    const { danhSach: danhSachToa, getAllModel: getAllToa } = useModel('kytucxa.toanha');
	const { record, setRecord, deleteModel } = useModel('kytucxa.dangky');
	const { danhSach: danhSachDot } = useModel('kytucxa.dotdangky');

	const dotMap = useMemo(() => {
		return new Map((danhSachDot as KyTucXa.IDotDangKy[]).map((d) => [d._id, d]));
	}, [danhSachDot]);

	const [selectedDotId, setSelectedDotId] = useState<string>();
	const [visibleDetailModal, setVisibleDetailModal] = useState(false);
	const [visiblePaymentModal, setVisiblePaymentModal] = useState(false);

	useEffect(() => {
		if (!danhSachToa || danhSachToa.length === 0) getAllToa();
	}, []);

	const handleReset = () => {
		setSelectedDotId(undefined);
	};

    const columns: IColumn<KyTucXa.IThongTinDangKy>[] = [
        {
            title: intl.formatMessage({ id: 'kytucxa.lichsu.table.floor' }),
            dataIndex: ['phong', 'tangThu'],
            width: 80,
            align: 'center',
            sortable: true,
            render: (val: number) => {
                if (val === undefined || val === null) return '-';
                const isEnglish = intl.locale.startsWith('en');
                if (isEnglish) {
                    const s = ["th", "st", "nd", "rd"];
                    const v = val % 100;
                    return val + (s[(v - 20) % 10] || s[v] || s[0]);
                }
                
                return `${val}`;
            },
        },
        {
            title: intl.formatMessage({ id: 'kytucxa.lichsu.table.roomCode' }),
            dataIndex: ['phong', 'ma'],
            width: 120,
            align: 'center',
            filterType: 'string',
        },
		{
            title: intl.formatMessage({ id: 'kytucxa.lichsu.table.apartmentType' }),
            dataIndex: ['phong', 'maToaNha'],
            width: 200,
            align: 'center',
            filterType: 'string',
            render: (val) => {
                if (!val) return '';
                if (!danhSachToa || danhSachToa.length === 0) return '';
                const toa = (danhSachToa as KyTucXa.IToa[])?.find((item) => item.ma === val);
                return toa ? toa.ten : val;
            },
        },
		{
			title: intl.formatMessage({ id: 'kytucxa.lichsu.table.roomPrice' }),
			dataIndex: ['phong', 'maKhoanThuPhong'],
			width: 150,
			align: 'center',
			filterType: 'number',
			sortable: true,
		},		
        {
            title: intl.formatMessage({ id: 'kytucxa.lichsu.table.moveInDate' }),
            dataIndex: 'maDotId',
            width: 160,
            align: 'center',
            render: (_val, record: KyTucXa.IThongTinDangKy) => {
                const dot = dotMap.get(record.maDotId!);
                return dot?.ngayChuyenVao ? dayjs(dot.ngayChuyenVao).format('MM/YYYY') : '-';
            },
        },
        {
            title: intl.formatMessage({ id: 'kytucxa.lichsu.table.moveOutDate' }),
            dataIndex: 'maDotId',
            width: 160,
            align: 'center',
            render: (_val, record: KyTucXa.IThongTinDangKy) => {
                const dot = dotMap.get(record.maDotId!);
                return dot?.ngayChuyenRa ? dayjs(dot.ngayChuyenRa).format('MM/YYYY') : '-';
            },
        },
        {
            title: intl.formatMessage({ id: 'kytucxa.lichsu.table.status' }),
            dataIndex: 'trangThaiThanhToan',
            width: 120,
            align: 'center',
            render: (val) => {
                let color = 'default';
                let label = val;
                if ([ETrangThaiThanhToan.DA_THANH_TOAN].includes(val as ETrangThaiThanhToan)) {
                    color = 'success';
                    label = intl.formatMessage({ id: 'kytucxa.lichsu.table.status.success' });
                } else if ([ETrangThaiThanhToan.DA_NHAN_PHONG].includes(val as ETrangThaiThanhToan)) {
                    color = 'purple';
                    label = intl.formatMessage({ id: 'kytucxa.lichsu.table.status.checkedin' });
                } else if ([ETrangThaiThanhToan.CHO_THANH_TOAN].includes(val as ETrangThaiThanhToan)) {
                    color = 'processing';
                    label = intl.formatMessage({ id: 'kytucxa.lichsu.table.status.processing' });
                } else if ([ETrangThaiThanhToan.HUY].includes(val as ETrangThaiThanhToan)) {
                    color = 'error';
                    label = intl.formatMessage({ id: 'kytucxa.lichsu.table.status.expired' });
                }
                return <Tag color={color}>{label || ''}</Tag>;
            },
        },
        {
            title: intl.formatMessage({ id: 'kytucxa.lichsu.table.action' }),
            width: 120,
            align: 'center',
            fixed: 'right',
            render: (_, record: KyTucXa.IThongTinDangKy) => {
                const isChoThanhToan = record.trangThaiThanhToan === ETrangThaiThanhToan.CHO_THANH_TOAN;
                const isChoPhepXoa = record.trangThaiThanhToan === ETrangThaiThanhToan.HUY || record.trangThaiThanhToan === ETrangThaiThanhToan.CHO_THANH_TOAN;

                return (
                    <div onClick={(e) => e.stopPropagation()}>
                        <Space size="small">
                            <Tooltip title={intl.formatMessage({ id: 'kytucxa.lichsu.tooltip.payment' })}>
                                <Button 
                                    type="text"
                                    disabled={!isChoThanhToan}
                                    icon={<DollarOutlined />}
                                    onClick={() => {
                                        setRecord(record);
                                        setVisiblePaymentModal(true);
                                    }}
                                />
                            </Tooltip>

                            {isChoPhepXoa ? (
                                <Popconfirm
                                    title={intl.formatMessage({ id: 'kytucxa.lichsu.popconfirm.delete' })}
                                    onConfirm={() => deleteModel(record._id)}
                                    okText={intl.formatMessage({ id: 'kytucxa.lichsu.detail.yes' })}
                                    cancelText={intl.formatMessage({ id: 'kytucxa.lichsu.detail.no' })}
                                >
                                    <Tooltip title={intl.formatMessage({ id: 'kytucxa.lichsu.tooltip.delete' })}>
                                        <Button 
                                            type="text"
                                            danger
                                            icon={<DeleteOutlined />}
                                        />
                                    </Tooltip>
                                </Popconfirm>
                            ) : (
                                <Tooltip title={intl.formatMessage({ id: 'kytucxa.lichsu.tooltip.delete' })}>
                                    <Button 
                                        type="text"
                                        danger
                                        disabled
                                        icon={<DeleteOutlined />}
                                    />
                                </Tooltip>
                            )}
                        </Space>
                    </div>
                );
            },
        },
    ];

    return (
		<>
			<TableBase
				modelName='kytucxa.dangky'
				title={intl.formatMessage({ id: 'kytucxa.lichsu.title' })}
				columns={columns}
				dependencies={[selectedDotId]}
				externalConditions={
					selectedDotId
						? [{ field: 'maDotId', label: intl.formatMessage({ id: 'kytucxa.lichsu.filter.period' }), value: selectedDotId }]
						: []
				}
				otherButtons={[
					
				]}
				buttons={{ create: false, globalSearch: false, filter: false }}
				widthDrawer={1000}
				otherProps={{
					onRow: (record: KyTucXa.IThongTinDangKy) => ({
						onClick: () => {
							setRecord(record);
							setVisibleDetailModal(true);
						},
						style: { cursor: 'pointer' },
					}),
				}}
			>
                <div key='select-dot' style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 12, padding: '0 16px 16px 0' }}>
                    <Col flex='none' style={{ display: 'flex', alignItems: 'center', marginLeft: 4 }}>
                        <FilterIconCustom />
                    </Col>
                    <SelectDotDangKyKTX
                        value={selectedDotId}
                        onChange={setSelectedDotId}
                        allowClear
                        style={{ width: 250 }}
                    />
                    <Col flex='none'>
                        <Button icon={<ReloadOutlined />} onClick={handleReset} className='ktx-page__reset-btn' />
                    </Col>
                </div>
            </TableBase>    
			<ModalDetailDangKy
				open={visibleDetailModal}
				onClose={() => setVisibleDetailModal(false)}
			/>
			<ModalPayment 
				open={visiblePaymentModal} 
				onClose={() => setVisiblePaymentModal(false)} 
				record={record as KyTucXa.IThongTinDangKy} 
			/>
		</>
    );
};

export default LichSuDangKyKTX;