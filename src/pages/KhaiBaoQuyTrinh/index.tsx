import TableBase from '@/components/Table';
import { history, useModel } from 'umi';
import FormKhaiBao from './components/FormKhaiBao';
import type { IColumn } from '@/components/Table/typing';
import { Button, Card, Checkbox, message, Modal, Popconfirm, Tabs, Tag, Tooltip } from 'antd';
import {DeleteOutlined, DownloadOutlined, EyeOutlined} from '@ant-design/icons';
import type { KhaiBaoQuyTrinh } from '@/services/KhaiBaoQuyTrinh/typings';
import SelectQuyTrinh from '@/pages/KhaiBaoQuyTrinh/QuyTrinh/Select';
import moment from 'moment';
import type { TrangThaiTiepNhan } from '@/services/KhaiBaoQuyTrinh/constants';
import { MapColorTrangThaiTiepNhan } from '@/services/KhaiBaoQuyTrinh/constants';
import { useState } from 'react';
import type { QuyTrinh } from '@/services/QuyTrinh/typings';
import { createDonKhaiBaoUser } from '@/services/KhaiBaoQuyTrinh/khaibaoquytrinh';

const KhaiBaoQuyTrinhPage = () => {
	const { page, limit, condition, deleteModel, setCondition, getDataKhaiBaoUser, visibleForm, setVisibleForm } =
		useModel('quytrinh.khaibaoquytrinh');
	const { getModel: getQuyTrinh, setLoading } = useModel('quytrinh.quytrinh');
	const { getAllModel: getDot } = useModel('quytrinh.dotkhaibao');
	const [quyTrinhIdSelect, setQuyTrinhIdSelect] = useState<string>('');
	// const { getAllModel: getAllDanhMucChung } = useModel('quanlykhoahoc.danhmuc.chung');

	const onCell = (recordVal: KhaiBaoQuyTrinh.IRecord) => ({
		onClick: () => {
			history.push(`/khai-bao-quy-trinh/${recordVal?._id}`);
		},
		style: { cursor: 'pointer' },
	});
	const handleRedirect = async (quyTrinhId: string) => {
		try {
			setLoading(true);
			const res = await getDot(undefined, undefined, { quyTrinhId: quyTrinhId });
			if (res) {
				if (res.length === 1) {
					const res2 = await createDonKhaiBaoUser(quyTrinhId, res?.[0]?._id);
					if (res2) {
						history.push(`/khai-bao-quy-trinh/${res2?.data?.data?._id}`);
					}
				} else {
					if (res.length > 1) {
						setQuyTrinhIdSelect(quyTrinhId);
						setVisibleForm(true);
					} else {
						message.warn('Chưa có đợt');
					}
				}
			}
		} catch (e) {
			console.log(e);
		} finally {
			setLoading(false);
		}
	};
	const onCellQuyTrinh = (recordVal: QuyTrinh.IRecord) => ({
		onClick: async () => {
			handleRedirect(recordVal?._id);
		},
		style: { cursor: 'pointer' },
	});

	// useEffect(() => {
	// 	getAllDanhMucChung();
	// }, []);

	const getData = () => {
		getDataKhaiBaoUser();
	};
	const columns: IColumn<KhaiBaoQuyTrinh.IRecord>[] = [
		{
			title: 'Tên quy trình',
			dataIndex: 'quyTrinhId',
			width: 150,
			// filterType: 'customselect',
			// filterCustomSelect: <SelectQuyTrinh multiple/>,
			render: (val, recordVal) => {
				return recordVal?.quyTrinh?.ten;
			},
			onCell,
		},
		{
			title: 'Chi tiết',
			dataIndex: 'moTa',
			width: 150,
			onCell,
		},
		{
			title: 'Tiến trình',
			dataIndex: 'quyTrinh',
			width: 250,
			align: 'center',
			render: (val, recordVal: KhaiBaoQuyTrinh.IRecord) => {
				return (
					<>
						Bước {recordVal?.danhSachBuocXuLy?.length}/{val?.danhSachBuocXuLy?.length}:{' '}
						{recordVal?.danhSachBuocXuLy?.find((item) => item.laBuocHienTai)?.ten}
					</>
				);
			},
			onCell,
		},
		{
			title: 'Trạng thái',
			dataIndex: 'quyTrinh',
			width: 200,
			align: 'center',
			render: (val, recordVal) => (
				<Tag
					color={
						MapColorTrangThaiTiepNhan?.[
							recordVal?.danhSachBuocXuLy?.[recordVal?.danhSachBuocXuLy?.length - 1]
								?.trangThaiTiepNhan as TrangThaiTiepNhan
						] ?? 'yellow'
					}
				>
					{recordVal?.danhSachBuocXuLy?.[recordVal?.danhSachBuocXuLy?.length - 1]?.trangThaiTiepNhan}
				</Tag>
			),
		},
		{
			title: 'Ngày khai',
			dataIndex: 'createdAt',
			width: 150,
			align: 'center',
			render: (val) => {
				return val ? moment(val).format('DD/MM/YYYY') : 'Không có dữ liệu';
			},
			onCell,
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (recordVal: KhaiBaoQuyTrinh.IRecord) => (
				<>
					<Tooltip title='Xem chi tiết'>
						<Button
							onClick={() => {
								history.push(`/khai-bao-quy-trinh/${recordVal?._id}`);
							}}
							type='link'
							icon={<EyeOutlined />}
						/>
					</Tooltip>
          <Tooltip title='Tải mẫu đơn'>
            <Button
              onClick={() => {
              message.warn('Chức năng đang phát triển')
              }}
              type='link'
              icon={<DownloadOutlined />}
            />
          </Tooltip>
					<Tooltip title='Xóa'>
						<Popconfirm
							onConfirm={() => deleteModel(recordVal._id ?? '', getData)}
							title='Bạn có chắc chắn muốn xóa?'
							placement='topLeft'
						>
							<Button danger type='link' icon={<DeleteOutlined />} />
						</Popconfirm>
					</Tooltip>
				</>
			),
		},
	];
	const columns2: IColumn<QuyTrinh.IRecord>[] = [
		{
			title: 'Tên quy trình',
			dataIndex: 'ten',
			width: 250,
			filterType: 'string',
			// onCell: onCellQuyTrinh,
		},
		{
			title: 'Trả phí',
			dataIndex: ['cauTrucThanhToan', 'yeuCauTraPhi'],
			width: 150,
			align: 'center',
			render: (val) => {
				return (
					<>
						<Checkbox checked={val} />
					</>
				);
			},
			// onCell: onCellQuyTrinh,
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (recordVal: QuyTrinh.IRecord) => (
				<>
					<Tooltip title='Sử dụng quy trình'>
            <Popconfirm
              title="Bạn có muốn sử dụng quy trình trên?"
              onConfirm={()=>{
                handleRedirect(recordVal?._id);
              }}
              okText="Sủ dụng"
              cancelText="Đóng"
            >
						<Button
							onClick={() => {
								// setQuyTrinhIdSelect(recordVal?._id);
								// setVisibleForm(true);
								// handleRedirect(recordVal?._id);
							}}
							type='primary'
							// icon={<EyeOutlined />}
						>
							Sử dụng
						</Button>
            </Popconfirm>
					</Tooltip>
				</>
			),
		},
	];
	const getDataQuyTrinh = () => {
		getQuyTrinh(undefined, undefined, undefined, undefined, undefined, 'page/Quản lý đào tạo - Sinh viên');
	};
	return (
		<Card>
			<Tabs defaultActiveKey='1'>
				<Tabs.TabPane tab='Đơn dịch vụ' key='1'>
					<TableBase
						buttons={{ create: false, filter: false }}
						modelName={'quytrinh.quytrinh'}
						columns={columns2}
						getData={getDataQuyTrinh}
					/>
				</Tabs.TabPane>
				<Tabs.TabPane tab='Lịch sử gửi đơn' key='2'>
					<TableBase
						modelName={'quytrinh.khaibaoquytrinh'}
						columns={columns}
						// Form={FormKhaiBao}
						getData={getData}
						dependencies={[page, limit, condition]}
						// title={'Khai báo quy trình'}
						destroyModal
						buttons={{ create: false }}
						otherButtons={[
							<>
								<SelectQuyTrinh
									loadData={false}
									allowClear
									style={{ width: 220, marginBottom: 8 }}
									onChange={(val: any) => {
										setCondition({
											...condition,
											quyTrinhId: val,
										});
									}}
								/>
							</>,
						]}
					/>
				</Tabs.TabPane>
			</Tabs>

			<Modal
				title={'Chọn đợt khai báo'}
				width={500}
				visible={visibleForm}
				onCancel={() => setVisibleForm(false)}
				footer={null}
				destroyOnClose
			>
				<FormKhaiBao quyTrinhId={quyTrinhIdSelect} />
			</Modal>
		</Card>
	);
};
export default KhaiBaoQuyTrinhPage;
