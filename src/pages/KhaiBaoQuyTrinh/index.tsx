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
import { formatDate } from '@/utils/formatDate';
import {
	ArrowRightOutlined,
	DeleteOutlined,
	DollarCircleOutlined,
	DownloadOutlined,
	EyeOutlined,
} from '@ant-design/icons';
import { Button, Dropdown, Menu, Modal, Popconfirm, Tag, Tooltip, message } from 'antd';
import { useEffect, useState } from 'react';
import { history, useIntl, useModel } from 'umi';
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
	const intl = useIntl();
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
					const res2 = await createDonKhaiBaoUser(quyTrinhId, 'SINH_VIEN', res?.[0]?._id);
					if (res2) {
						history.push(`/khai-bao-quy-trinh/${res2?.data?.data?._id}`);
					}
				} else {
					if (res.length > 1) {
						setQuyTrinhIdSelect(quyTrinhId);
						setVisibleForm(true);
					} else {
						message.warning('Chưa có đợt');
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
			title: intl.formatMessage({ id: 'dichvuhanhchinh.lichsu.column.tendichvu' }),
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
			title: intl.formatMessage({ id: 'dichvuhanhchinh.lichsu.column.tientrinh' }),
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
							{intl.formatMessage({ id: 'dichvuhanhchinh.lichsu.column.buoc' })} {recordVal?.danhSachBuocXuLy?.length}/
							{val?.danhSachBuocXuLy?.length}: {recordVal?.danhSachBuocXuLy?.find((item) => item.laBuocHienTai)?.ten}
						</span>
						{buocHienTai && cauHinhThoiGianDotBuocHienTai && (
							<span style={{ marginLeft: 4, fontWeight: 'bold' }}>
								{formatDate(cauHinhThoiGianDotBuocHienTai.thoiGianBatDau)} -{' '}
								{formatDate(cauHinhThoiGianDotBuocHienTai.thoiGianKetThuc)}
							</span>
						)}
					</div>
				);
			},
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'dichvuhanhchinh.lichsu.column.ketqua' }),
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
							intl.formatMessage({ id: 'dichvuhanhchinh.lichsu.column.chuacokq' })}
					</Tag>
				);
			},
		},
		{
			title: intl.formatMessage({ id: 'dichvuhanhchinh.lichsu.column.trangthai' }),
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
						{coKhaiBao
							? intl.formatMessage({ id: 'dichvuhanhchinh.lichsu.column.dathuchien' })
							: intl.formatMessage({ id: 'dichvuhanhchinh.lichsu.column.chuathuchien' })}
					</Tag>
				);
			},
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'dichvuhanhchinh.lichsu.column.thanhtoan' }),
			dataIndex: 'trangThaiThanhToan',
			width: 200,
			align: 'center',
			hide: props?.tenQuyTrinh ? true : false,
			render: (val: EMaTrangThaiThanhToan) => (
				<Tag color={EMauTrangThaiThanhToanTable?.[val] ?? 'gray'}>
					{val ? ETrangThaiThanhToan[val] : intl.formatMessage({ id: 'dichvuhanhchinh.lichsu.column.dv' })}
				</Tag>
			),
		},
		{
			title: intl.formatMessage({ id: 'dichvuhanhchinh.lichsu.column.ngaytao' }),
			dataIndex: 'createdAt',
			hide: props?.tenQuyTrinh ? true : false,
			width: 150,
			align: 'center',
			render: (val) => {
				return val
					? formatDate(val)
					: intl.formatMessage({ id: 'dichvuhanhchinh.lichsu.column.khongdl' });
			},
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'dichvuhanhchinh.lichsu.column.thaotac' }),
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
						<Tooltip title={intl.formatMessage({ id: 'dichvuhanhchinh.lichsu.column.xemchitiet' })}>
							<Button
								onClick={() => {
									history.push(`/khai-bao-quy-trinh/${recordVal?._id}`);
								}}
								type='link'
								icon={<EyeOutlined />}
							/>
						</Tooltip>
						{recordVal.identityCode && (
							<Tooltip
								title={
									<div style={{ maxWidth: 100 }}>
										{intl.formatMessage({ id: 'dichvuhanhchinh.lichsu.column.ttthanhtoan' })}
									</div>
								}
							>
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
							<Tooltip title={intl.formatMessage({ id: 'dichvuhanhchinh.lichsu.column.taimaudon' })}>
								<Dropdown
									overlay={
										<Menu
											onClick={(val) => {
												if (val.key === 'MAU_DON')
													exportMauDonTheoBuocModel(recordVal._id, buocHienTai.ma, formKhai?.ten ?? '');
												else exportMauTraKetQuaTheoBuocModel(recordVal._id, buocHienTai.ma, formTiepNhan?.ten ?? '');
											}}
										>
											{formKhai?.fileId && (
												<Menu.Item key={'MAU_DON'}>
													{intl.formatMessage({ id: 'dichvuhanhchinh.lichsu.column.maudon' })}
												</Menu.Item>
											)}
											{formTiepNhan?.fileId && buocHienTai?.trangThaiTiepNhan === TrangThaiTiepNhan.DA_DUYET && (
												<Menu.Item key={'MAU_TRA_KET_QUA'}>
													{intl.formatMessage({ id: 'dichvuhanhchinh.lichsu.column.mauketqua' })}
												</Menu.Item>
											)}
										</Menu>
									}
									placement='bottomLeft'
								>
									<Button loading={loading} type='link' icon={<DownloadOutlined style={{ color: '#007AFF' }} />} />
								</Dropdown>
							</Tooltip>
						)}
						<Tooltip title={intl.formatMessage({ id: 'dichvuhanhchinh.lichsu.column.xoa' })}>
							<Popconfirm
								// disabled={!(isBuocDauTien && buocHienTai?.trangThaiTiepNhan === TrangThaiTiepNhan.CHUA_CO)}
								disabled={!allowDelete}
								onConfirm={() => deleteModel(recordVal._id ?? '', getData)}
								title={intl.formatMessage({ id: 'dichvuhanhchinh.lichsu.column.xoa.xacnhan' })}
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
				title={props.title || intl.formatMessage({ id: 'dichvuhanhchinh.lichsu.don' })}
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
								{intl.formatMessage({ id: 'dichvuhanhchinh.lichsu.button.themmoi' })}
							</Button>
						) : null}
						{props.hasFilterHoatDong && (
							<SelectQuyTrinh
								placeholder={intl.formatMessage({ id: 'dichvuhanhchinh.lichsu.loc' })}
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
				title={intl.formatMessage({ id: 'dichvuhanhchinh.lichsu.chondot' })}
				width={500}
				open={visibleForm}
				onCancel={() => setVisibleForm(false)}
				footer={null}
				destroyOnClose
			>
				<FormKhaiBao quyTrinhId={quyTrinhIdSelect} />
			</Modal>
			<Modal
				title={intl.formatMessage({ id: 'dichvuhanhchinh.lichsu.thongtinchung' })}
				width={1000}
				open={visibleThongTinChung}
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
							{intl.formatMessage({ id: 'dichvuhanhchinh.lichsu.button.tieptheo' })}
						</Button>
					</>
				}
				destroyOnClose
			>
				<ViewThongTinChung dataThongTinChung={recordThongTinChung} />
			</Modal>

			<Modal
				open={visibleModal}
				onCancel={() => setVisibleModal(false)}
				footer={null}
				styles={{ body: { padding: 0 } }}
				width={1000}
				destroyOnClose
			>
				<ThongTinThanhToan setVisible={setVisibleModal} />
			</Modal>
		</div>
	);
};
export default KhaiBaoQuyTrinhPage;
