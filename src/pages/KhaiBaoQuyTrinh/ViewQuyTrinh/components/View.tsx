import ViewRender from '@/pages/KhaiBaoQuyTrinh/MauDon/ViewRender';
import ThongTinTiepNhan from '@/pages/KhaiBaoQuyTrinh/ViewQuyTrinh/components/thongTinTiepNhan';
import ThongTinThanhToan from '@/pages/TaiChinh/HoaDon/ThanhToan/ThongTinThanhToan';
import { ELoaiDanhMucChung } from '@/services/QuyTrinh/DanhMuc/constants';
import {
	MapColorTrangThaiTiepNhanDon,
	TrangThaiKhaiBao,
	TrangThaiTiepNhanDon,
} from '@/services/QuyTrinh/KhaiBao/constants';
import type { KhaiBaoQuyTrinh } from '@/services/QuyTrinh/KhaiBao/typings';
import { EKieuDuLieu } from '@/services/QuyTrinh/LoaiHinh/constants';
import type { QuyTrinh } from '@/services/QuyTrinh/typing';
import { LeftOutlined } from '@ant-design/icons';
import { Button, Card, Col, Descriptions, Modal, Popconfirm, Row, Spin, Steps, Tag } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { history, useModel } from 'umi';

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
	const { setCurrent, setCurrentFormKhaiBao, currentFormKhaiBao, setEditFormKhaiBao, setRecordFormKhaiBao } = model;
	const { danhSach: danhSachDotQuyTrinh } = useModel('quytrinh.dotkhaibao');

	const dotCurrent = danhSachDotQuyTrinh?.find((item) => item._id === dataQuyTrinh?.dotQuyTrinhId);

	const [currentStep, setCurrentStep] = useState<number>(0);

	const { getAllModel: getAllDanhMucChung, danhSach: danhSachDanhMuc } = useModel('quytrinh.danhmuc');

	useEffect(() => {
		if (danhSachDanhMuc.length === 0) getAllDanhMucChung(false, undefined, { maModule: ELoaiDanhMucChung.QUY_TRINH });
	}, []);

	const onChange = (val: number) => {
		setCurrentStep(val);
	};
	const renderDescription = (value: any) => {
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
							{value?.coKhaiBao ? TrangThaiKhaiBao.DA_KHAI_BAO : TrangThaiKhaiBao.CHUA_KHAI_BAO}
						</Tag>
					</div>
				</>
			);
		} else {
			return (
				<>
					<div style={{ marginBottom: 8 }}>
						<Tag color={'blue'}>Chưa đến bước xử lý</Tag>
					</div>
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
				console.log('dataFormKhaiBao?.thongTinKhaiBao', dataFormKhaiBao?.thongTinKhaiBao);
				setRecordQuyTrinhForm(dataFormKhaiBao);
				setRecordFormKhaiBao(dataFormKhaiBao?.thongTinKhaiBao);
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
			<Card title={dataQuyTrinh?.quyTrinh?.ten} bordered={false}>
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
											history.push('/khai-bao-quy-trinh/lich-su');
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
											history.push('/khai-bao-quy-trinh/lich-su');
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

									return (
										<Step
											key={value.ten}
											description={renderDescription(
												dataQuyTrinh?.danhSachBuocXuLy?.find((item) => item?.ma === value?.ma),
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
							{current?.coKhaiBao && (
								<div style={{ marginBottom: 16 }}>
									<ThongTinTiepNhan data={current as KhaiBaoQuyTrinh.IBuocXuLy} modelName={modalName} />
								</div>
							)}

							{current?.coKhaiBao && current?.trangThaiTiepNhan !== TrangThaiTiepNhanDon.CHINH_SUA_LAI ? (
								<div>
									<Descriptions column={{ xs: 2, sm: 2, md: 4, lg: 6, xl: 6, xxl: 6 }}>
										{cauHinhForm?.cauHinhLoaiHinh
											?.filter(
												(item) => item.kieuDuLieu !== EKieuDuLieu.TABLE && item.kieuDuLieu !== EKieuDuLieu.DANHSACH,
											)
											.map((item) =>
												!item?.truongThongTinLienQuan ||
												(item?.truongThongTinLienQuan &&
													(dataForm?.thongTinKhaiBao?.[item?.truongThongTinLienQuan] === item?.giaTriLienQuan ||
														(item.giaTriLienQuan.includes &&
															item?.giaTriLienQuan?.includes(
																dataForm?.thongTinKhaiBao?.[item?.truongThongTinLienQuan],
															)))) ? (
													<Descriptions.Item
														key={item.ma}
														span={item?.colspan ? item.colspan / 4 : 6}
														label={<div style={{ maxWidth: 300 }}>{item.ten}</div>}
													>
														<ViewRender
															cauHinh={item}
															recordSanPham={
																{
																	thongTinKhaiBao: dataForm?.thongTinKhaiBao,
																} as any
															}
														/>
													</Descriptions.Item>
												) : null,
											)}
									</Descriptions>
									{cauHinhForm?.cauHinhLoaiHinh
										.filter((item) => {
											return item.kieuDuLieu === EKieuDuLieu.TABLE || item.kieuDuLieu === EKieuDuLieu.DANHSACH;
										})
										.map((item) => (
											<>
												<Descriptions>
													<Descriptions.Item span={6} label={<div style={{ maxWidth: 300 }}>{item.ten}</div>}>
														{' '}
													</Descriptions.Item>
												</Descriptions>
												<ViewRender
													cauHinh={item}
													recordSanPham={{
														thongTinKhaiBao: dataForm?.thongTinKhaiBao,
													}}
												/>
												<br />
											</>
										))}
								</div>
							) : (
								<>{FormModal && <FormModal {...formProps} />}</>
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
			</Card>
		</>
	);
};
export default View;
