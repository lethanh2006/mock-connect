import { useState, useEffect, useMemo } from 'react';
import TableBase from '@/components/Table';
import type { IColumn } from '@/components/Table/typing';
import { useIntl, useModel } from 'umi';
import { Tag, Modal, Col } from 'antd';
import { ETrangThaiDuyet } from '@/services/KyTucXa/constant';
import { KyTucXa } from '@/services/KyTucXa/typings';
import FormLichSuDk from '@/pages/KyTucXa/LichSu/components/FormDangKy'; 
import "@/pages/KyTucXa/DangKy/style.less"
import SelectDotDangKyKTX from './components/SelectDotDangKy';
import { FilterIconCustom } from '@/pages/KyTucXa/DangKy/components/IconsRoom';
import { UnorderedListOutlined, DeleteOutlined, CreditCardOutlined, ReloadOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Popover } from 'antd';
import PaymentModal from './components/ModalPayment';
import dayjs from '@/utils/dayjs';

const LichSuDangKyKTX = () => {
	const intl = useIntl();
    const { danhSach: danhSachToa, getAllModel: getAllToa } = useModel('kytucxa.toanha');
	const { setRecord, deleteModel, setVisibleForm, setIsView } = useModel('kytucxa.dangky');
	const { danhSach: danhSachKhoanThu, getAllModel: getAllKhoanThu } = useModel('kytucxa.khoanthu');
	const { danhSach: danhSachDot } = useModel('kytucxa.dotdangky');

	const dotMap = useMemo(() => {
		return new Map((danhSachDot as KyTucXa.IDotDangKy[]).map((d) => [d._id, d]));
	}, [danhSachDot]);

	const [drawerVisible, setDrawerVisible] = useState(false);
	const [selectedDotId, setSelectedDotId] = useState<string>();
	const [visiblePaymentModal, setVisiblePaymentModal] = useState(false);

	useEffect(() => {
		getAllKhoanThu();
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
                if (!val) return '-';
                if (!danhSachToa || danhSachToa.length === 0) return '...';
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
			render: (val, record: KyTucXa.IThongTinDangKy) => {
				if (!danhSachKhoanThu || danhSachKhoanThu.length === 0) return '...';
				const maKhoanThuPhong = record.phong?.maKhoanThuPhong;
				const khoanThu = (danhSachKhoanThu as KyTucXa.IKhoanThu[])?.find((item: KyTucXa.IKhoanThu) => item.maMucThu === maKhoanThuPhong);
				const giaHienThi = khoanThu?.unitAmount ?? val;
				const currency = khoanThu?.currency || 'VND';
				return giaHienThi ? `${giaHienThi.toLocaleString('vi-VN')} ${currency}` : '-';
			},
		},		
        {
            title: intl.formatMessage({ id: 'kytucxa.lichsu.table.moveInDate' }),
            dataIndex: 'maDotId',
            width: 160,
            align: 'center',
            render: (_val, record: KyTucXa.IThongTinDangKy) => {
                const dot = dotMap.get(record.maDotId!);
                return dot?.ngayChuyenVao ? dayjs(dot.ngayChuyenVao).format('DD/MM/YYYY') : '-';
            },
        },
        {
            title: intl.formatMessage({ id: 'kytucxa.lichsu.table.moveOutDate' }),
            dataIndex: 'maDotId',
            width: 160,
            align: 'center',
            render: (_val, record: KyTucXa.IThongTinDangKy) => {
                const dot = dotMap.get(record.maDotId!);
                return dot?.ngayChuyenRa ? dayjs(dot.ngayChuyenRa).format('DD/MM/YYYY') : '-';
            },
        },
        {
            title: intl.formatMessage({ id: 'kytucxa.lichsu.table.status' }),
            dataIndex: 'trangThaiDuyet',
            width: 120,
            align: 'center',
            render: (val) => {
                let color = 'default';
                let label = val;
                if ([ETrangThaiDuyet.DA_THANH_TOAN].includes(val as ETrangThaiDuyet)) {
                    color = 'success';
                    label = intl.formatMessage({ id: 'kytucxa.lichsu.table.status.success' });
                } else if ([ETrangThaiDuyet.DA_NHAN_PHONG].includes(val as ETrangThaiDuyet)) {
                    color = 'success';
                    label = intl.formatMessage({ id: 'kytucxa.lichsu.table.status.checkedin' });
                } else if ([ETrangThaiDuyet.CHO_THANH_TOAN].includes(val as ETrangThaiDuyet)) {
                    color = 'processing';
                    label = intl.formatMessage({ id: 'kytucxa.lichsu.table.status.processing' });
                } else if ([ETrangThaiDuyet.HUY].includes(val as ETrangThaiDuyet)) {
                    color = 'error';
                    label = intl.formatMessage({ id: 'kytucxa.lichsu.table.status.expired' });
                }
                return <Tag color={color}>{label || '-'}</Tag>;
            },
        },
        {
            title: intl.formatMessage({ id: 'kytucxa.lichsu.table.action' }),
            width: 80,
            align: 'center',
            fixed: 'right',
            render: (_, record: KyTucXa.IThongTinDangKy) => {
                const isChoThanhToan = record.trangThaiDuyet === ETrangThaiDuyet.CHO_THANH_TOAN;
                const isChoPhepXoa = record.trangThaiDuyet === ETrangThaiDuyet.HUY || record.trangThaiDuyet === ETrangThaiDuyet.CHO_THANH_TOAN;

                const content = (
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <Button 
                            onClick={() => {
                                setRecord(record);
                                setIsView(true);
                                setVisibleForm(true);
                            }}
                            type="text"
                            icon={<EyeOutlined />}
                        >
                            {intl.formatMessage({ id: 'kytucxa.lichsu.tooltip.view' })}
                        </Button>
                        <Button 
                            type="text"
                            disabled={!isChoThanhToan}
                            icon={<CreditCardOutlined />}
                         
                            onClick={() => {
                                setRecord(record);
                                setVisiblePaymentModal(true);
                            }}
                        >
                            {intl.formatMessage({ id: 'kytucxa.lichsu.tooltip.payment' })}
                        </Button>
                        <Button 
                            onClick={() => {
                                deleteModel(record._id);
                            }}
                            type="text"
                            danger
                            disabled={!isChoPhepXoa}
                            icon={<DeleteOutlined />}
                        >
                            {intl.formatMessage({ id: 'kytucxa.lichsu.tooltip.delete' })}
                        </Button>
                    </div>
                );

                return (
                    <Popover content={content} trigger={['click', 'hover']} placement="bottomRight">
                        <Button 
                            type="text"
                            icon={<UnorderedListOutlined />}
                        />
                    </Popover>
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
				Form={FormLichSuDk}
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
			>
                <div key='select-dot' style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 12, padding: '0 16px 16px 0' }}>
                    <FilterIconCustom />
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
			<Modal
				open={drawerVisible}
				onCancel={() => setDrawerVisible(false)}
				footer={null}
				width={800}
				centered
				bodyStyle={{ padding: 0 }}
				destroyOnClose
			>
				<FormLichSuDk />
			</Modal>
			<PaymentModal
				visible={visiblePaymentModal}
				onClose={() => setVisiblePaymentModal(false)}
			/>
		</>
    );
};

export default LichSuDangKyKTX;