import ThongTinTiepNhan from '@/pages/KhaiBaoQuyTrinh/ViewQuyTrinh/components/thongTinTiepNhan';
import type { TrangThaiTiepNhanDon } from '@/services/KhaiBaoQuyTrinh/constants';
import { MapColorTrangThaiTiepNhanDon, TrangThaiKhaiBao } from '@/services/KhaiBaoQuyTrinh/constants';
import type { KhaiBaoQuyTrinh } from '@/services/KhaiBaoQuyTrinh/typings';
import type { QuyTrinh } from '@/services/QuyTrinh/typing';
import { LeftOutlined } from '@ant-design/icons';
import { Button, Card, Col, Descriptions, Row, Spin, Steps, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { history, useModel } from 'umi';
import { EKieuDuLieu } from '@/services/QuyTrinh/LoaiHinh/constants';
import ViewRender from '@/pages/KhaiBaoQuyTrinh/MauDon/ViewRender';

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
	// const { record: recordQuyTrinh } = useModel('quanlykhoahoc.quytrinh.quytrinh');
	const { setCurrent, setCurrentFormKhaiBao, currentFormKhaiBao } = model;

	// const { setRecord: setRecordSanPham } = useModel('quanlykhoahoc.sanphamnckh');
	const [currentStep, setCurrentStep] = useState<number>(0);
	const onChange = (val: number) => {
		setCurrentStep(val);
	};
	const renderDescription = (value: any) => {
		// if (current) {
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
					{/*{(value?.daDienThongTin === false || value?.trangThaiTiepNhan === TrangThaiTiepNhanDon.CHINH_SUA_LAI) &&*/}
					{/*	!type && (*/}
					{/*		<Button*/}
					{/*			size='small'*/}
					{/*			icon={<EditOutlined />}*/}
					{/*			type='primary'*/}
					{/*			onClick={() => {*/}
					{/*				const arr = dataQuyTrinh?.quyTrinh?.danhSachFormKhaiBao;*/}
					{/*				const obj = arr?.find((item: { ma: any }) => item?.ma === current?.maFormKhaiBao);*/}
					{/*				setCurrentFormKhaiBao(obj);*/}

					{/*				setEditFormKhaiBao(false);*/}
					{/*				setVisibleFormKhaiBaoQuyTrinh(true);*/}
					{/*				const dataKhaiBao = dataQuyTrinh?.danhSachKhaiBao?.find(*/}
					{/*					(item: { ma: any }) => item?.ma === current?.maFormKhaiBao,*/}
					{/*				);*/}
					{/*				if (value?.trangThaiTiepNhan === TrangThaiTiepNhanDon.CHINH_SUA_LAI || dataKhaiBao) {*/}
					{/*					setEditFormKhaiBao(true);*/}
					{/*					setRecordFormKhaiBao(dataKhaiBao?.thongTinKhaiBao);*/}
					{/*				}*/}
					{/*			}}*/}
					{/*		>*/}
					{/*			Hoàn thiện thông tin*/}
					{/*		</Button>*/}
					{/*	)}*/}
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
		}
	}, [current]);

	const cauHinhForm: QuyTrinh.IMauDon = currentFormKhaiBao;
	const dataForm = dataQuyTrinh?.danhSachKhaiBao?.find((ele) => ele.ma === current.maFormKhaiBao);

	return (
		<>
			<Card title={dataQuyTrinh?.quyTrinh?.ten} bordered={false}>
				<Spin spinning={type ? false : loadingForm}>
					{!type && (
						<Button
							style={{ marginBottom: 16 }}
							icon={<LeftOutlined />}
							type={'link'}
							onClick={() => {
								history.push('/khai-bao-quy-trinh');
							}}
						>
							Quay lại
						</Button>
					)}

					<Row gutter={[16, 16]}>
						<Col xs={24} sm={24} md={6} lg={6} xl={6}>
							<Steps direction={'vertical'} current={currentStep} onChange={onChange}>
								{dataQuyTrinh?.quyTrinh?.danhSachBuocXuLy?.map((value: any) => {
									return (
										<Step
											key={value.ten}
											description={renderDescription(
												dataQuyTrinh?.danhSachBuocXuLy?.find((item) => item?.ma === value?.ma),
											)}
											disabled={dataQuyTrinh?.danhSachBuocXuLy?.find((item) => item?.ma === value?.ma) === undefined}
											title={value?.ten}
											onClick={() => {
												const obj = dataQuyTrinh?.danhSachBuocXuLy?.find((item) => item?.ma === value?.ma);
												if (obj) {
													setCurrent(obj);
												}
												// setCurrent(value);
											}}
										/>
									);
								})}
							</Steps>
						</Col>
						<Col xs={24} sm={24} md={18} lg={18} xl={18}>
							<div style={{ marginBottom: 16 }}>
								<ThongTinTiepNhan data={current as KhaiBaoQuyTrinh.IBuocXuLy} modelName={modalName} />
							</div>
							{current?.coKhaiBao ? (
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
				{/*{FormModal && (*/}
				{/*	<Modal*/}
				{/*		title={'Khai báo'}*/}
				{/*		visible={visibleFormKhaiBaoQuyTrinh}*/}
				{/*		onCancel={() => setVisibleFormKhaiBaoQuyTrinh(false)}*/}
				{/*		width={1200}*/}
				{/*		footer={null}*/}
				{/*		destroyOnClose*/}
				{/*	>*/}
				{/*		<FormModal {...formProps} />*/}
				{/*	</Modal>*/}
				{/*)}*/}
			</Card>
		</>
	);
};
export default View;
