import TableBase from '@/components/Table';
import type { IColumn } from '@/components/Table/typing';
import ViewThongTinChung from '@/pages/KhaiBaoQuyTrinh/components/ViewThongTinChung';
import SelectQuyTrinh from '@/pages/KhaiBaoQuyTrinh/QuyTrinh/Select';
import { MapColorTrangThaiTiepNhan, TrangThaiTiepNhan } from '@/services/QuyTrinh/KhaiBao/constants';
import { ELoaiDanhMucChung } from '@/services/QuyTrinh/DanhMuc/constants';
import { createDonKhaiBaoUser } from '@/services/QuyTrinh/KhaiBao/khaibaoquytrinh';
import type { KhaiBaoQuyTrinh } from '@/services/QuyTrinh/KhaiBao/typings';
import type { QuyTrinh } from '@/services/QuyTrinh/typings';
import type { EMaTrangThaiThanhToan } from '@/services/TaiChinh/constant';
import { EMauTrangThaiThanhToanTable, ETrangThaiThanhToan } from '@/services/TaiChinh/constant';
import {
	ArrowRightOutlined,
	DeleteOutlined,
	DollarCircleOutlined,
	DownloadOutlined,
	EyeOutlined,
} from '@ant-design/icons';
import { Button, Dropdown, Menu, message, Modal, Popconfirm, Tag, Tooltip } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { history, useModel } from 'umi';
import ThongTinThanhToan from '../TaiChinh/HoaDon/ThanhToan/ThongTinThanhToan';
import FormKhaiBao from './components/FormKhaiBao';

const KhaiBaoQuyTrinhPage = () => {
	const {
		page,
		limit,
		condition,
		deleteModel,
		setCondition,
		getDataKhaiBaoUser,
		visibleForm,
		setVisibleForm,
		exportMauDonTheoBuocModel,
		exportMauTraKetQuaTheoBuocModel,
		loading,
	} = useModel('quytrinh.khaibaoquytrinh');
	const { setLoading, record: recordQuyTrinh } = useModel('quytrinh.quytrinh');
	const { getAllModel: getDot } = useModel('quytrinh.dotkhaibao');
	const { getOneModel: getHoaDon } = useModel('taichinh.hoadon');
	const [quyTrinhIdSelect, setQuyTrinhIdSelect] = useState<string>('');
	const [visibleThongTinChung, setVisibleThongTinChung] = useState<boolean>(false);
	const [recordThongTinChung] = useState<QuyTrinh.IDanhSachCauHinhThongTinChung[]>([]);
	const { getAllModel: getAllDanhMucChung } = useModel('quytrinh.danhmuc');
	const [visibleModal, setVisibleModal] = useState<boolean>(false);

	useEffect(() => {
		getAllDanhMucChung(false, undefined, { maModule: ELoaiDanhMucChung.QUY_TRINH });
	}, []);

	const getData = () => {
		getDataKhaiBaoUser();
	};

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

	const columns: IColumn<KhaiBaoQuyTrinh.IRecord>[] = [
		{
			title: 'Tên dịch vụ',
			dataIndex: 'quyTrinhId',
			width: 250,
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
			title: 'Trạng thái xử lý',
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
			title: 'Trạng thái thanh toán',
			dataIndex: 'trangThaiThanhToan',
			width: 200,
			align: 'center',
			render: (val: EMaTrangThaiThanhToan) => (
				<Tag color={EMauTrangThaiThanhToanTable?.[val] ?? 'gray'}>
					{val ? ETrangThaiThanhToan[val] : 'Dịch vụ không tính phí'}
				</Tag>
			),
		},
		{
			title: 'Ngày tạo',
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
			width: 150,
			fixed: 'right',
			render: (recordVal: KhaiBaoQuyTrinh.IRecord) => {
				const buocHienTai = recordVal?.danhSachBuocXuLy?.[recordVal?.danhSachBuocXuLy?.length - 1];
				const isBuocDauTien = recordVal?.danhSachBuocXuLy?.length === 1;
				const formKhai = recordVal?.quyTrinh?.danhSachFormKhaiBao?.find(
					(item) => item.ma === buocHienTai?.maFormKhaiBao,
				);
				const formTiepNhan = recordVal?.quyTrinh?.danhSachFormTiepNhan?.find(
					(item) => item.ma === buocHienTai?.maFormTiepNhan,
				);

				return (
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
						{recordVal.identityCode && (
							<Tooltip title={<div style={{ maxWidth: 100 }}>Thông tin thanh toán</div>}>
								<Button
									onClick={() => {
										getHoaDon({ identityCode: recordVal.identityCode });
										setVisibleModal(true);
									}}
									type='link'
									icon={<DollarCircleOutlined />}
								/>
							</Tooltip>
						)}
						{(formKhai?.fileId || formTiepNhan?.fileId) && (
							<Tooltip title='Tải mẫu đơn'>
								<Dropdown
									overlay={
										<Menu
											onClick={(val) => {
												if (val.key === 'MAU_DON')
													exportMauDonTheoBuocModel(recordVal._id, buocHienTai.ma, formKhai?.ten ?? '');
												else exportMauTraKetQuaTheoBuocModel(recordVal._id, buocHienTai.ma, formTiepNhan?.ten ?? '');
											}}
										>
											{formKhai?.fileId && <Menu.Item key={'MAU_DON'}>Mẫu đơn</Menu.Item>}
											{formTiepNhan?.fileId && buocHienTai?.trangThaiTiepNhan === TrangThaiTiepNhan.DA_DUYET && (
												<Menu.Item key={'MAU_TRA_KET_QUA'}>Mẫu trả kết quả</Menu.Item>
											)}
										</Menu>
									}
									placement='bottomLeft'
								>
									<Button loading={loading} type='link' icon={<DownloadOutlined />} />
								</Dropdown>
							</Tooltip>
						)}
						<Tooltip title='Xóa'>
							<Popconfirm
								disabled={!(isBuocDauTien && buocHienTai?.trangThaiTiepNhan === TrangThaiTiepNhan.CHUA_CO)}
								onConfirm={() => deleteModel(recordVal._id ?? '', getData)}
								title='Bạn có chắc chắn muốn xóa?'
								placement='topLeft'
							>
								<Button
									disabled={!(isBuocDauTien && buocHienTai?.trangThaiTiepNhan === TrangThaiTiepNhan.CHUA_CO)}
									danger
									type='link'
									icon={<DeleteOutlined />}
								/>
							</Popconfirm>
						</Tooltip>
					</>
				);
			},
		},
	];
	return (
		<div>
			<TableBase
				modelName={'quytrinh.khaibaoquytrinh'}
				columns={columns}
				getData={getData}
				dependencies={[page, limit, condition]}
				title={'Đơn đã gửi'}
				destroyModal
				buttons={{ create: false }}
				otherButtons={[
					<>
						<SelectQuyTrinh
							placeholder='Lọc theo dịch vụ'
							loadData={false}
							allowClear
							style={{ width: 320, marginBottom: 8 }}
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
			<Modal
				title={'Thông tin chung'}
				width={1000}
				visible={visibleThongTinChung}
				onCancel={() => setVisibleThongTinChung(false)}
				footer={
					<>
						<Button
							icon={<ArrowRightOutlined />}
							type={'primary'}
							onClick={() => {
								handleRedirect(recordQuyTrinh?._id ?? '');
							}}
						>
							Tiếp theo
						</Button>
					</>
				}
				destroyOnClose
			>
				<ViewThongTinChung dataThongTinChung={recordThongTinChung} />
			</Modal>

			<Modal
				visible={visibleModal}
				onCancel={() => setVisibleModal(false)}
				footer={null}
				bodyStyle={{ padding: 0 }}
				width={1000}
				destroyOnClose
			>
				<ThongTinThanhToan setVisible={setVisibleModal} />
			</Modal>
		</div>
	);
};
export default KhaiBaoQuyTrinhPage;
