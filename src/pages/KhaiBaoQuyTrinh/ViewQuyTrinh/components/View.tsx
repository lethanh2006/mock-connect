import ThongTinTiepNhan from '@/pages/KhaiBaoQuyTrinh/ViewQuyTrinh/components/thongTinTiepNhan';
import ThongTinThanhToan from '@/pages/TaiChinh/HoaDon/ThanhToan/ThongTinThanhToan';
import {
	ETienDoQuyTrinh,
	MapColorTienDoQuyTrinh,
	MapColorTrangThaiTiepNhanDon,
	TrangThaiTiepNhanDon,
} from '@/services/QuyTrinh/KhaiBao/constants';
import type { KhaiBaoQuyTrinh } from '@/services/QuyTrinh/KhaiBao/typings';
import type { QuyTrinh } from '@/services/QuyTrinh/typing';
import { EditOutlined, LeftOutlined } from '@ant-design/icons';
import { Button, Card, Col, Collapse, Modal, Popconfirm, Row, Spin, Steps, Tag } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import ViewDot from '../../DotQuyTrinh/ViewDot';
import ThongTinHoiDong from './ThongTinHoiDong';
import ThongTinQuyetDinh from './ThongTinQuyetDinh';
import ViewFromCauHinh from './ViewFormCauHinh';

const { Step } = Steps;
interface Iprops {
	dataQuyTrinh: KhaiBaoQuyTrinh.IRecord;
	current: KhaiBaoQuyTrinh.IBuocXuLy;
	initStep?: number;
	handleClickHoanThien?: () => void;
	loadingForm?: boolean;
	modalName?: any;
	FormModal?: React.FC;
	formProps?: any;
	type?: 'dieu_phoi' | 'tiep_nhan';
	getData?: () => void;
}
const View = (props: Iprops) => {
	const { dataQuyTrinh, current, loadingForm, modalName, FormModal, formProps, type } = props;
	const model = useModel(modalName);
	const { visibleForm, setVisibleForm } = useModel('taichinh.hoadon');
	const { setRecordQuyTrinhForm } = useModel('quytrinh.quanlyquytrinh');
	const {
		setCurrent,
		setCurrentFormKhaiBao,
		currentFormKhaiBao,
		setEditFormKhaiBao,
		setRecordFormKhaiBao,
		editFormKhaiBao,
	} = model;
	const { danhSach: danhSachDotQuyTrinh } = useModel('quytrinh.dotkhaibao');
	const { getAllModel: getDot } = useModel('quytrinh.dotkhaibao');
	const dotCurrent = danhSachDotQuyTrinh?.find((item) => item._id === dataQuyTrinh?.dotQuyTrinhId);
	const cauHinhThoiGianDotBuocHienTai = dotCurrent?.danhSachCauHinhThoiGianDot?.find(
		(item: { maBuoc: string }) => item.maBuoc === current.ma,
	);
	const [currentStep, setCurrentStep] = useState<number>(0);

	const [visibleViewDetailDot, setVisibleViewDetailDot] = useState<boolean>(false);

	useEffect(() => {
		getDot();
	}, []);

	const onChange = (val: number) => {
		setCurrentStep(val);
	};
	const renderDescription = (value: any, tienDo?: ETienDoQuyTrinh, isBuocNgoaiHeThong?: boolean) => {
		if (isBuocNgoaiHeThong) {
			return (
				<div>
					{tienDo && (
						<div style={{ marginBottom: 8 }}>
							<Tag color={MapColorTienDoQuyTrinh[tienDo]}>{tienDo}</Tag>
						</div>
					)}
				</div>
			);
		}
		if (value) {
			return (
				<>
					<div style={{ marginBottom: 8 }}>
						<Tag color={MapColorTrangThaiTiepNhanDon?.[value?.trangThaiTiepNhan as TrangThaiTiepNhanDon] ?? 'yellow'}>
							{value?.trangThaiTiepNhan}
						</Tag>
					</div>
					<div style={{ marginBottom: 8 }}>
						<Tag color={value?.coKhaiBao ? '#1fba36' : '#ffca2c'}>
							{value?.coKhaiBao ? 'Đã thực hiện' : 'Chưa thực hiện'}
						</Tag>
					</div>
					{tienDo && (
						<div style={{ marginBottom: 8 }}>
							<Tag color={MapColorTienDoQuyTrinh[tienDo]}>{tienDo}</Tag>
						</div>
					)}
				</>
			);
		} else {
			return (
				<>
					<div style={{ marginBottom: 8 }}>
						<Tag color={'gray'}>Chưa đến bước xử lý</Tag>
					</div>
					{tienDo && (
						<div style={{ marginBottom: 8 }}>
							<Tag color={MapColorTienDoQuyTrinh[tienDo]}>{tienDo}</Tag>
						</div>
					)}
				</>
			);
		}

		// }
	};
	useEffect(() => {
		setCurrentStep(dataQuyTrinh?.danhSachBuocXuLy?.length - 1);
	}, [dataQuyTrinh]);
	useEffect(() => {
		if (current) {
			const arr = dataQuyTrinh?.quyTrinh?.danhSachFormKhaiBao;
			const obj = arr?.find((item: { ma: any }) => item?.ma === current?.maFormKhaiBao);

			setCurrentFormKhaiBao(obj);
			if (current?.trangThaiTiepNhan === TrangThaiTiepNhanDon.CHINH_SUA_LAI) {
				const dataFormKhaiBao = dataQuyTrinh?.danhSachKhaiBao?.find((ele) => ele.ma === current.maFormKhaiBao);
				const valuesFormKhaiBao: any = {};
				Object.keys(dataFormKhaiBao?.thongTinKhaiBao).map((key) => {
					valuesFormKhaiBao[key] = dataFormKhaiBao?.thongTinKhaiBao[key]?.value;
				});
				setRecordQuyTrinhForm({ ...dataFormKhaiBao, thongTinKhaiBao: valuesFormKhaiBao });
				setRecordFormKhaiBao(valuesFormKhaiBao);
				setEditFormKhaiBao(true);
			}
		}
	}, [current]);

	const cauHinhForm: QuyTrinh.IMauDon = currentFormKhaiBao;

	//lấy thông tin đã khai báo trong danhSachKhaiBaoArchive còn cái thông tin khai báo ở ngoài để fill chỉnh sửa khi có yêu cầu chỉnh sửa
	const dataForm =
		current?.trangThaiTiepNhan !== TrangThaiTiepNhanDon.DUYET &&
		current?.trangThaiTiepNhan !== TrangThaiTiepNhanDon.KHONG_DUYET
			? dataQuyTrinh?.danhSachKhaiBao?.find((ele) => ele.ma === current.maFormKhaiBao)
			: dataQuyTrinh?.danhSachKhaiBao
					?.find((ele) => ele.ma === current.maFormKhaiBao)
					?.danhSachKhaiBaoArchive?.find((item) => item?.maBuoc === current?.ma);

	return (
		<>
			<Card
				title={
					<div>
						{dataQuyTrinh?.quyTrinh?.ten}{' '}
						{dotCurrent && dotCurrent?.danhSachCauHinhThoiGianDot?.length > 0 && (
							<a onClick={() => setVisibleViewDetailDot(true)}>{dotCurrent?.ten}</a>
						)}
					</div>
				}
				bordered={false}
			>
				<Spin spinning={type ? false : loadingForm}>
					{!type && (
						<>
							{current?.coKhaiBao ? (
								<>
									<Button
										style={{ marginBottom: 16 }}
										icon={<LeftOutlined />}
										type={'link'}
										onClick={() => {
											window.history.back();
											setCurrentFormKhaiBao(undefined);
											setCurrent(undefined);
										}}
									>
										Quay lại
									</Button>
								</>
							) : (
								<>
									<Popconfirm
										title='Bạn chưa khai báo đơn, có muốn quay lại?'
										onConfirm={() => {
											window.history.back();
											setCurrentFormKhaiBao(undefined);
											setCurrent(undefined);
										}}
										okText='Đồng ý'
										cancelText='Đóng'
									>
										<Button style={{ marginBottom: 16 }} icon={<LeftOutlined />} type={'link'}>
											Quay lại
										</Button>
									</Popconfirm>
								</>
							)}
						</>
					)}

					<Row gutter={[16, 16]}>
						<Col xs={24} sm={24} md={6} lg={6} xl={6}>
							<Steps size='small' direction={'vertical'} current={currentStep} onChange={onChange}>
								{dataQuyTrinh?.quyTrinh?.danhSachBuocXuLy?.map((value: any) => {
									const cauHinhThoiGianDot = dotCurrent?.danhSachCauHinhThoiGianDot?.find(
										(item: any) => item.maBuoc === value.ma,
									);
									let tienDo;
									const coKhaiBao = dataQuyTrinh?.danhSachBuocXuLy?.find((item) => item?.ma === value?.ma)?.coKhaiBao;

									if (
										cauHinhThoiGianDot &&
										moment().isAfter(moment(cauHinhThoiGianDot.thoiGianKetThuc)) &&
										!coKhaiBao
									) {
										tienDo = ETienDoQuyTrinh.QUA_HAN;
									} else if (
										cauHinhThoiGianDot &&
										moment(cauHinhThoiGianDot.thoiGianBatDau).isBefore(moment()) &&
										moment().isBefore(cauHinhThoiGianDot.thoiGianKetThuc)
									) {
										tienDo = ETienDoQuyTrinh.DANG_DIEN_RA;
									} else if (
										cauHinhThoiGianDot &&
										moment().isBefore(moment(cauHinhThoiGianDot.thoiGianBatDau)) &&
										moment(cauHinhThoiGianDot.thoiGianBatDau).diff(moment(), 'days') === 7
									) {
										tienDo = ETienDoQuyTrinh.SAP_TOI;
									} else if (cauHinhThoiGianDot && moment().isAfter(moment(cauHinhThoiGianDot.thoiGianKetThuc))) {
										tienDo = ETienDoQuyTrinh.DA_DIEN_RA;
									}

									return (
										<Step
											key={value.ten}
											description={renderDescription(
												dataQuyTrinh?.danhSachBuocXuLy?.find((item) => item?.ma === value?.ma),
												tienDo,
												cauHinhThoiGianDot?.tuDongChuyenBuocKhiHetHan,
											)}
											disabled={dataQuyTrinh?.danhSachBuocXuLy?.find((item) => item?.ma === value?.ma) === undefined}
											title={
												<div>
													{value.ten}{' '}
													{cauHinhThoiGianDot && (
														<b>
															({moment(cauHinhThoiGianDot?.thoiGianBatDau).format('DD/MM/YYYY')} -{' '}
															{moment(cauHinhThoiGianDot?.thoiGianKetThuc).format('DD/MM/YYYY')})
														</b>
													)}
												</div>
											}
											onClick={() => {
												const obj = dataQuyTrinh?.danhSachBuocXuLy?.find((item) => item?.ma === value?.ma);
												if (obj) {
													setCurrent(obj);
												}
											}}
										/>
									);
								})}
							</Steps>
						</Col>
						<Col xs={24} sm={24} md={18} lg={18} xl={18}>
							<ThongTinTiepNhan
								isBuocNgoaiHeThong={cauHinhThoiGianDotBuocHienTai?.tuDongChuyenBuocKhiHetHan}
								data={current as KhaiBaoQuyTrinh.IBuocXuLy}
								modelName={modalName}
							/>

							<ThongTinHoiDong
								maBuoc={current?.ma}
								quyTrinhId={dataQuyTrinh?.quyTrinhId}
								dotQuyTrinhId={dotCurrent?._id}
							/>
							<ThongTinQuyetDinh maBuoc={current?.ma} dotQuyTrinhId={dotCurrent?._id} />

							{current?.coKhaiBao &&
							current?.trangThaiTiepNhan !== TrangThaiTiepNhanDon.CHINH_SUA_LAI &&
							!editFormKhaiBao ? (
								<Collapse ghost defaultActiveKey={['viewkhaibao']}>
									<Collapse.Panel
										key={'viewkhaibao'}
										header={
											<b>{dataQuyTrinh?.danhSachKhaiBao?.find((ele) => ele.ma === current.maFormKhaiBao)?.ten}</b>
										}
									>
										<Row gutter={[0, 10]}>
											<ViewFromCauHinh
												cauHinhLoaiHinh={cauHinhForm?.cauHinhLoaiHinh ?? []}
												thongTinKhaiBao={dataForm?.thongTinKhaiBao ?? {}}
											/>
										</Row>
										{!editFormKhaiBao && (
											<div style={{ display: 'flex', justifyContent: 'center', marginTop: 8 }}>
												<Button
													onClick={() => {
														setEditFormKhaiBao(true);
														const dataFormKhaiBao = dataQuyTrinh?.danhSachKhaiBao?.find(
															(ele) => ele.ma === current.maFormKhaiBao,
														);
														const valuesFormKhaiBao: any = {};
														Object.keys(dataFormKhaiBao?.thongTinKhaiBao).map((key) => {
															valuesFormKhaiBao[key] = dataFormKhaiBao?.thongTinKhaiBao[key]?.value;
														});
														setRecordQuyTrinhForm({ ...dataFormKhaiBao, thongTinKhaiBao: valuesFormKhaiBao });
														setRecordFormKhaiBao(valuesFormKhaiBao);
													}}
													style={{ margin: '0 auto' }}
													icon={<EditOutlined />}
													type='primary'
												>
													Chỉnh sửa
												</Button>
											</div>
										)}
									</Collapse.Panel>
								</Collapse>
							) : (
								<Collapse ghost defaultActiveKey={['viewkhaibao']}>
									<Collapse.Panel
										key={'viewkhaibao'}
										header={
											<b>
												{
													dataQuyTrinh?.quyTrinh?.danhSachFormKhaiBao?.find((ele) => ele.ma === current.maFormKhaiBao)
														?.ten
												}
											</b>
										}
									>
										{FormModal && <FormModal {...formProps} />}
									</Collapse.Panel>
								</Collapse>
							)}
						</Col>
					</Row>
				</Spin>

				<Modal
					visible={visibleForm}
					onCancel={() => setVisibleForm(false)}
					footer={null}
					bodyStyle={{ padding: 0 }}
					width={1000}
					destroyOnClose
				>
					<ThongTinThanhToan setVisible={setVisibleForm} />
				</Modal>
				<Modal
					footer={
						<Button
							type='primary'
							onClick={() => {
								setVisibleViewDetailDot(false);
							}}
						>
							OK
						</Button>
					}
					bodyStyle={{ padding: 0 }}
					visible={visibleViewDetailDot}
					onCancel={() => setVisibleViewDetailDot(false)}
				>
					{dotCurrent && dataQuyTrinh.quyTrinh && <ViewDot recDot={dotCurrent} recQuyTrinh={dataQuyTrinh.quyTrinh} />}
				</Modal>
			</Card>
		</>
	);
};
export default View;
