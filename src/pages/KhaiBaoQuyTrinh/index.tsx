import TableBase from '@/components/Table';
import type { IColumn } from '@/components/Table/typing';
import SelectQuyTrinh from '@/pages/KhaiBaoQuyTrinh/QuyTrinh/Select';
import ViewThongTinChung from '@/pages/KhaiBaoQuyTrinh/components/ViewThongTinChung';
import { MapColorTrangThaiTiepNhan, TrangThaiTiepNhan } from '@/services/QuyTrinh/KhaiBao/constants';
import { createDonKhaiBaoUser } from '@/services/QuyTrinh/KhaiBao/khaibaoquytrinh';
import type { KhaiBaoQuyTrinh } from '@/services/QuyTrinh/KhaiBao/typings';
import { EPhanHe } from '@/services/QuyTrinh/constant';
import type { QuyTrinh } from '@/services/QuyTrinh/typings';
import { EMaTrangThaiThanhToan, EMauTrangThaiThanhToanTable, ETrangThaiThanhToan } from '@/services/TaiChinh/constant';
import {
	ArrowRightOutlined,
	DeleteOutlined,
	DollarCircleOutlined,
	DownloadOutlined,
	EyeOutlined,
} from '@ant-design/icons';
import { Button, Dropdown, Menu, Modal, Popconfirm, Tag, Tooltip, message } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { history, useModel } from 'umi';
import ThongTinThanhToan from '../TaiChinh/HoaDon/ThanhToan/ThongTinThanhToan';
import FormKhaiBao from './components/FormKhaiBao';
import ThongKeDichVu from './components/ThongKeDichVu';

const KhaiBaoQuyTrinhPage = (props: {
	title?: string;
	tenQuyTrinh?: string;
	hasFilterHoatDong?: boolean;
	hasColumnTenQuyTrinh?: boolean;
	hasCreate?: boolean;
	linhVuc?: string;
}) => {
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
		setDanhSach,
	} = useModel('quytrinh.khaibaoquytrinh');
	const {
		setLoading,
		record: recordQuyTrinh,
		getModel: getQuyTrinh,
		danhSach: danhSachQuyTrinh,
		setRecord: setRecordQuyTrinh,
	} = useModel('quytrinh.quytrinh');
	const { getAllModel: getDot, danhSach: danhSachDot } = useModel('quytrinh.dotkhaibao');
	const { getOneModel: getHoaDon } = useModel('taichinh.hoadon');
	const [quyTrinhIdSelect, setQuyTrinhIdSelect] = useState<string>('');
	const [visibleThongTinChung, setVisibleThongTinChung] = useState<boolean>(false);
	const [recordThongTinChung, setRecordThongTinChung] = useState<QuyTrinh.IDanhSachCauHinhThongTinChung[]>([]);
	const [visibleModal, setVisibleModal] = useState<boolean>(false);

	const getDataQuyTrinh = () => {
		getQuyTrinh(
			{ ten: props.tenQuyTrinh, linhVuc: props.linhVuc },
			undefined,
			undefined,
			undefined,
			undefined,
			'page/SINH_VIEN',
		);
	};

	useEffect(() => {
		getDataQuyTrinh();
		getDot();
	}, []);

	const getData = () => {
		if (props.tenQuyTrinh) {
			if (danhSachQuyTrinh.length) getDataKhaiBaoUser({ quyTrinhId: danhSachQuyTrinh[0]._id });
			else setDanhSach([]);
		} else
			getDataKhaiBaoUser({
				phanHe: {
					$ne: EPhanHe.QUAN_LY_KHOA_HOC,
				},
			});
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
			render: (val, recordVal) => {
				return recordVal?.quyTrinh?.ten;
			},
			onCell,
			hide: !props.hasColumnTenQuyTrinh,
		},
		// {
		// 	title: 'Chi tiết',
		// 	dataIndex: 'moTa',
		// 	width: 250,
		// 	onCell,
		// },
		{
			title: 'Tiến trình',
			dataIndex: 'quyTrinh',
			width: 250,
			filterType: 'select',

			align: 'center',
			render: (val, recordVal: KhaiBaoQuyTrinh.IRecord) => {
				const buocHienTai = recordVal?.danhSachBuocXuLy?.find((item) => item.laBuocHienTai);
				const dotHienTai = danhSachDot.find((item) => item._id === recordVal.dotQuyTrinhId);
				const cauHinhThoiGianDotBuocHienTai = dotHienTai?.danhSachCauHinhThoiGianDot.find(
					(item: { maBuoc: string | undefined }) => item.maBuoc === buocHienTai?.ma,
				);

				return (
					<div style={{ color: '#007AFF', fontWeight: '400' }}>
						<span>
							{' '}
							Bước {recordVal?.danhSachBuocXuLy?.length}/{val?.danhSachBuocXuLy?.length}:{' '}
							{recordVal?.danhSachBuocXuLy?.find((item) => item.laBuocHienTai)?.ten}
						</span>
						{buocHienTai && cauHinhThoiGianDotBuocHienTai && (
							<span style={{ marginLeft: 4, fontWeight: 'bold' }}>
								({moment(cauHinhThoiGianDotBuocHienTai.thoiGianBatDau).format('DD/MM/YYYY')} -{' '}
								{moment(cauHinhThoiGianDotBuocHienTai.thoiGianKetThuc).format('DD/MM/YYYY')})
							</span>
						)}
					</div>
				);
			},
			onCell,
		},
		{
			title: 'Kết quả',
			dataIndex: 'quyTrinh',
			width: 200,
			align: 'center',
			render: (val, recordVal) => {
				const color =
					MapColorTrangThaiTiepNhan[
						recordVal?.danhSachBuocXuLy?.[recordVal?.danhSachBuocXuLy?.length - 1]
							?.trangThaiTiepNhan as TrangThaiTiepNhan
					] || '#faad14'; // mặc định là vàng

				return (
					<Tag
						style={{
							color,
							borderColor: color + '40',
							backgroundColor: color + '16', // màu nhạt (hex + alpha)
							fontWeight: 400,
						}}
					>
						{recordVal?.danhSachBuocXuLy?.[recordVal?.danhSachBuocXuLy?.length - 1]?.trangThaiTiepNhan ||
							'Chưa có kết quả tiếp nhận'}
					</Tag>
				);
			},
		},
		{
			title: 'Trạng thái thực hiện',
			dataIndex: 'coKhaiBao',
			width: 200,
			align: 'center',

			render: (val, recordVal) => {
				const coKhaiBao = recordVal?.danhSachBuocXuLy?.[recordVal?.danhSachBuocXuLy?.length - 1]?.coKhaiBao ?? false;

				const color = coKhaiBao ? '#1fba36' : '#ffca2c';

				return (
					<Tag
						style={{
							color,
							borderColor: color + '40',
							backgroundColor: color + '16', // màu nhạt trong nền
							fontWeight: 400,
						}}
					>
						{coKhaiBao ? 'Đã thực hiện' : 'Chưa thực hiện'}
					</Tag>
				);
			},
			onCell,
		},
		{
			title: 'Trạng thái thanh toán',
			dataIndex: 'trangThaiThanhToan',
			width: 200,
			align: 'center',
			hide: props?.tenQuyTrinh ? true : false,
			render: (val: EMaTrangThaiThanhToan) => (
				<Tag color={EMauTrangThaiThanhToanTable?.[val] ?? 'gray'}>
					{val ? ETrangThaiThanhToan[val] : 'Dịch vụ không tính phí'}
				</Tag>
			),
		},
		{
			title: 'Ngày tạo',
			dataIndex: 'createdAt',
			hide: props?.tenQuyTrinh ? true : false,
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
				const allowDelete =
					!!recordVal?.quyTrinh?.thongTinQuyTrinh?.choPhepHuyDonSauThanhToan ||
					recordVal?.trangThaiThanhToan !== EMaTrangThaiThanhToan.DA_THANH_TOAN_DU;

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
									icon={<DollarCircleOutlined style={{ color: '#FFAF0B' }} />}
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
									<Button loading={loading} type='link' icon={<DownloadOutlined style={{ color: '#007AFF' }} />} />
								</Dropdown>
							</Tooltip>
						)}
						<Tooltip title='Xóa'>
							<Popconfirm
								// disabled={!(isBuocDauTien && buocHienTai?.trangThaiTiepNhan === TrangThaiTiepNhan.CHUA_CO)}
								disabled={!allowDelete}
								onConfirm={() => deleteModel(recordVal._id ?? '', getData)}
								title='Bạn có chắc chắn muốn xóa?'
								placement='topLeft'
							>
								<Button
									// disabled={!(isBuocDauTien && buocHienTai?.trangThaiTiepNhan === TrangThaiTiepNhan.CHUA_CO)}
									disabled={!allowDelete}
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
			<ThongKeDichVu />
			<TableBase
				modelName={'quytrinh.khaibaoquytrinh'}
				columns={columns}
				getData={getData}
				dependencies={[page, limit, condition, props.tenQuyTrinh, danhSachQuyTrinh.length]}
				title={props.title || 'Đơn đã gửi'}
				destroyModal
				buttons={{ create: false }}
				otherButtons={[
					<>
						{danhSachQuyTrinh.length && props.hasCreate ? (
							<Button
								onClick={() => {
									if (
										danhSachQuyTrinh[0]?.danhSachCauHinhThongTinChung &&
										danhSachQuyTrinh[0]?.danhSachCauHinhThongTinChung?.length > 0
									) {
										setRecordThongTinChung(danhSachQuyTrinh[0]?.danhSachCauHinhThongTinChung);
										setRecordQuyTrinh(danhSachQuyTrinh[0]);
										setVisibleThongTinChung(true);
									} else {
										handleRedirect(danhSachQuyTrinh[0]?._id ?? '');
									}
								}}
								type='primary'
								key={'add'}
							>
								Thêm mới
							</Button>
						) : null}
						{props.hasFilterHoatDong && (
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
						)}
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
