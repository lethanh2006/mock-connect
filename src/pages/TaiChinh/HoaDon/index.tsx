import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { type IColumn } from '@/components/Table/typing';
import type { HoaDon } from '@/services/TaiChinh/HoaDon/typing';
import { EMaTrangThaiThanhToan, EMauTrangThaiThanhToanTable, ETrangThaiThanhToan } from '@/services/TaiChinh/constant';
import { inputFormat } from '@/utils/utils';
import { UnorderedListOutlined } from '@ant-design/icons';
import { Modal, Tag, notification } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import SelectDotThu from '../DotThu/Select';
import ThongTinThanhToan from './ThanhToan/ThongTinThanhToan';

const HoaDonPage = () => {
	const intl = useIntl();
	const { getModel, page, limit, setRecord, record } = useModel('taichinh.hoadon');
	const [visibleModal, setVisibleModal] = useState<boolean>(false);

	// Callback from MOMO
	useEffect(() => {
		if (window.location.href.includes('orderType=momo_wallet'))
			if (window.location.href.includes('resultCode=0'))
				notification.success({
					message: intl.formatMessage({ id: 'taichinh.hoadon.notify.success.title' }),
					description: intl.formatMessage({ id: 'taichinh.hoadon.notify.success.desc' }),
				});
			else
				notification.warning({
					message: intl.formatMessage({ id: 'taichinh.hoadon.notify.fail.title' }),
					description: intl.formatMessage({ id: 'taichinh.hoadon.notify.fail.desc' }),
				});
	}, []);

	const getData = () =>
		getModel().then((res) => {
			// Sau khi thanh toán => Get lại danh sách và set lại record hóa đơn hiện tại
			if (record?._id) setRecord(res.find((item) => item._id === record._id));
		});

	const handleDetail = (rec: HoaDon.IRecord) => {
		setRecord(rec);
		setVisibleModal(true);
	};

	const columns: IColumn<HoaDon.IRecord>[] = [
		{
			title: intl.formatMessage({ id: 'taichinh.hoadon.column.identityCode' }),
			dataIndex: 'identityCode',
			align: 'center',
			filterType: 'string',
			width: 120,
		},
		{
			title: intl.formatMessage({ id: 'taichinh.hoadon.column.dotthu' }),
			dataIndex: 'idDotThu',
			width: 180,
			render: (val, rec) => rec.dotThu?.tenDot,
			filterType: 'customselect',
			filterCustomSelect: <SelectDotThu multiple />,
		},
		{
			title: intl.formatMessage({ id: 'taichinh.hoadon.column.khoanthu' }),
			width: 250,
			render: (val, rec) => (
				<ExpandText>
					{rec?.billItems
						?.filter((item) => item.status !== EMaTrangThaiThanhToan.DONG)
						?.map((item) => <div key={item._id}>- {item.ten ?? item?.tenKhoanThu}</div>)}
				</ExpandText>
			),
		},
		{
			title: intl.formatMessage({ id: 'taichinh.hoadon.column.trangthai' }),
			dataIndex: 'status',
			align: 'center',
			width: 150,
			render: (val: EMaTrangThaiThanhToan) =>
				val && <Tag color={EMauTrangThaiThanhToanTable?.[val]}>{ETrangThaiThanhToan?.[val] ?? ''}</Tag>,
			filterType: 'select',
			filterData: Object.values(EMaTrangThaiThanhToan).map((item) => ({
				label: ETrangThaiThanhToan[item],
				value: item,
			})),
		},
		{
			title: intl.formatMessage({ id: 'taichinh.hoadon.column.sotienphainop' }),
			width: 150,
			align: 'right',
			render: (val, rec) => {
				const totalAmountDue = rec?.soTienPhaiThu;
				return `${inputFormat(totalAmountDue ?? 0)} VND`;
			},
		},
		{
			title: intl.formatMessage({ id: 'taichinh.hoadon.column.sotiendanop' }),
			width: 150,
			align: 'right',
			render: (val, rec) => {
				const totalAmountDue = rec?.soTienDaThu;
				return `${inputFormat(totalAmountDue ?? 0)} VND`;
			},
		},
		{
			title: intl.formatMessage({ id: 'taichinh.hoadon.column.thaotac' }),
			align: 'center',
			width: 60,
			fixed: 'right',
			render: (val, rec) => (
				<ButtonExtend
					tooltip={intl.formatMessage({ id: 'taichinh.hoadon.action.thanhtoan' })}
					onClick={() => handleDetail(rec)}
					type='link'
					className='text-success'
					icon={<UnorderedListOutlined />}
				/>
			),
		},
	];

	return (
		<>
			<TableBase
				columns={columns}
				getData={getData}
				buttons={{ create: false }}
				dependencies={[page, limit]}
				modelName='taichinh.hoadon'
				title={intl.formatMessage({ id: 'taichinh.hoadon.title' })}
				widthDrawer={1000}
			/>

			<Modal
				open={visibleModal}
				onCancel={() => setVisibleModal(false)}
				footer={null}
				styles={{ body: { padding: 0 } }}
				width={1000}
			>
				<ThongTinThanhToan setVisible={setVisibleModal} getData={getData} />
			</Modal>
		</>
	);
};

export default HoaDonPage;
