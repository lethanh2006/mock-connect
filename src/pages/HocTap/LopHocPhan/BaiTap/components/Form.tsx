import TinyEditor from '@/components/TinyEditor';
import UploadFile from '@/components/Upload/UploadFile';
import {
	colorTrangThaiNopBaiTap,
	ETrangThaiNopBaiTap,
	mapTrangThaiNopBaiTap,
} from '@/services/DaoTao/BaiTap/constants';
import { getCauTraLoiMeBaiTap } from '@/services/TienIch/KhaoSat/BieuMau';
import type { BieuMau } from '@/services/TienIch/KhaoSat/BieuMau/typing';
import { ELoaiCauHoi } from '@/services/TienIch/KhaoSat/constants';
import { buildUpLoadMultiFile, handleSingleFile } from '@/services/uploadFile';
import { resetFieldsForm } from '@/utils/utils';
import { Alert, Button, Col, Descriptions, Divider, Form, Row, Spin, Tag, Tooltip } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import BoxFile from '../../DienDan/components/BoxFile';
import '../../DienDan/style.less';
import FormQuiz from './FormQuiz';
const FormBaiTap = (props: any) => {
	const { getData } = props;
	const [form] = Form.useForm();
	const { record, visibleForm, setVisibleForm, sinhVienNopBaiTapModal, formSubmiting } = useModel('daotao.baitap');
	const { record: recBieuMau, getBieuMauKhaoSatSinhVienModel, loading } = useModel('tienich.bieumau');
	const [trangThaiNopBai, setTrangThaiNopBai] = useState<string>();
	const quaThoiHanNopBai = moment().isAfter(record?.assignment?.thoiGianKetThuc);
	const [cauTraLoi, setRecCauTraLoi] = useState<BieuMau.TraLoiRecord[]>([]);
	const [remainingTime, setRemainingTime] = useState('');

	const disable = quaThoiHanNopBai && !record?.assignment?.choPhepCapNhatSauNop;
	const disableIsQuiz = record?.assignment?.isQuiz && record?.trangThai === ETrangThaiNopBaiTap.DA_NOP;

	useEffect(() => {
		if (!visibleForm) {
			resetFieldsForm(form);
			form.setFieldsValue({ noiDungTraLoi: '' });
		} else if (record?._id) {
			if (record?.assignment?.khaoSatId) {
				getBieuMauKhaoSatSinhVienModel(record?.assignment?.khaoSatId ?? '').then((recBieuMau1) => {
					if (record?.cauTraLoiId) {
						getCauTraLoiMeBaiTap(record?.cauTraLoiId).then((res: any) => {
							const index = res?.data?.data?.danhSachTraLoi;
							setRecCauTraLoi(index);
							if (index?.length) {
								const values: any = {};
								recBieuMau1?.danhSachKhoi?.map((khoi: any) => {
									khoi.danhSachCauHoi?.map((question: any) => {
										const traLoi = index?.find((i: any) => i.idCauHoi === question._id);
										if (question.loai === ELoaiCauHoi.SINGLE_CHOICE) {
											if (traLoi && traLoi.traLoiKhac) {
												values[question._id] = 'traLoiKhac';
												values[`${question._id}_otherAnswer`] = traLoi.traLoiKhac;
											} else {
												values[question._id] = traLoi?.listLuaChon?.[0];
											}
										} else if (
											question.loai === ELoaiCauHoi.GRID_MULTIPLE_CHOICE ||
											question.loai === ELoaiCauHoi.GRID_SINGLE_CHOICE
										) {
											values[question._id] = {};
											traLoi?.listLuaChonBang?.forEach((item: any) => {
												const idHang = item.idHang;
												const idCot = item.idCot;
												if (!values[question._id][idHang]) values[question._id][idHang] = {};
												values[question._id][idHang][idCot] = true;
											});
										} else values[question._id] = traLoi;
									});
								});
								form.setFieldsValue({
									...record,
									...values,
								});
							}
						});
					}
				});
			} else {
				form.setFieldsValue(record);
			}
		}
	}, [visibleForm, record?._id]);

	useEffect(() => {
		if (!record?.assignment?.thoiGianKetThuc) return;

		// Hàm đếm ngược
		const countdown = () => {
			const endTime = moment(record?.assignment?.thoiGianKetThuc);
			const now = moment();
			const duration = moment.duration(endTime.diff(now));

			if (duration.asSeconds() <= 0) {
				setRemainingTime('Thời hạn đã hết');
				return;
			}

			const hours = Math.floor(duration.asHours());
			const minutes = Math.floor(duration.minutes());
			const seconds = Math.floor(duration.seconds());
			setRemainingTime(`${hours} giờ ${minutes} phút ${seconds} giây`);
		};

		// Chạy hàm đếm ngược mỗi giây
		const intervalId = setInterval(countdown, 1000);

		// Dọn dẹp khi component unmount
		return () => clearInterval(intervalId);
	}, [record?.assignment?.thoiGianKetThuc]);

	function convertList(originalList: any) {
		const convertedList = [];
		for (const idHang in originalList) {
			for (const idCot in originalList[idHang]) {
				if (originalList[idHang][idCot] === true) {
					convertedList.push({ idCot, idHang });
				}
			}
		}
		return convertedList;
	}

	const buildUpLoadTaiLieu = (url: string | { fileList: any[] }) => {
		if (typeof url === 'string') return url;
		else if (url?.fileList.length) {
			return Promise.all(url?.fileList?.map((file: any) => handleSingleFile(file)));
		}
		return null;
	};

	const onFinish = async (values: any) => {
		const urlImages = await buildUpLoadMultiFile(values, 'urlImages');

		const danhSachTraLoi: Partial<BieuMau.TraLoiRecord[]> = [];
		const dsCauHoi = recBieuMau?.danhSachKhoi?.map((khoi) => khoi.danhSachCauHoi).flat();

		if (dsCauHoi) {
			for (const question of dsCauHoi) {
				const traLoi = values[question._id];
				const otherAnswer = values[`${question._id}_otherAnswer`];
				if (traLoi || otherAnswer) {
					let tempTraLoi: Partial<BieuMau.TraLoiRecord> = { idCauHoi: question._id };

					if (question.loai === ELoaiCauHoi.UPLOAD_FILE) {
						const listUrlFile = await buildUpLoadTaiLieu(values[question._id].listUrlFile);
						tempTraLoi.listUrlFile = listUrlFile as string[];
					} else if (question.loai === ELoaiCauHoi.SINGLE_CHOICE) {
						if (traLoi === 'traLoiKhac') {
							const traLoiKhac = values[`${question._id}_otherAnswer`];
							if (traLoiKhac) {
								tempTraLoi.traLoiKhac = traLoiKhac;
								tempTraLoi.listLuaChonBang = [];
								tempTraLoi.listLuaChon = [];
							}
						} else {
							tempTraLoi.listLuaChon = question?.luaChon
								?.map((item: any) => {
									if ([traLoi]?.includes(item.noiDung)) {
										return item._id;
									}
								})
								.filter(Boolean);
						}
					} else if (question.loai === ELoaiCauHoi.MULTIPLE_CHOICE)
						tempTraLoi.listLuaChon = question?.luaChon
							?.map((item: any) => {
								if (traLoi?.listLuaChon?.includes(item.noiDung)) {
									return item._id;
								}
							})
							.filter(Boolean);
					else if (
						question.loai === ELoaiCauHoi.GRID_MULTIPLE_CHOICE ||
						question.loai === ELoaiCauHoi.GRID_SINGLE_CHOICE
					)
						tempTraLoi.listLuaChonBang = convertList(values[question._id]);
					else tempTraLoi = { ...tempTraLoi, ...values[question._id] };

					danhSachTraLoi.push(tempTraLoi as BieuMau.TraLoiRecord);
				}
			}
		}

		const data = {
			mode: trangThaiNopBai === '1' ? 'submit' : 'save',
			thongTinCauTraLoiQuiz: record?.assignment?.khaoSatId
				? {
						danhSachTraLoi,
						idKhaoSat: record?.assignment?.khaoSatId,
				  }
				: null,
			assignmentId: record?.assignmentId,
			noiDungTraLoi: values.noiDungTraLoi,
			urlImages: urlImages,
		};

		await sinhVienNopBaiTapModal(data as any, getData)
			.then(() => setVisibleForm(false))
			.catch((er) => console.log(er));
	};

	return (
		<>
			{record?.assignment?.isQuiz && record?.trangThai === ETrangThaiNopBaiTap.CHUA_NOP && !quaThoiHanNopBai && (
				<div style={{ marginBottom: 12 }}>
					<Alert
						type='warning'
						showIcon
						message='Đối với dạng bài tập QUiZ chỉ được nộp bài 1 lần, xem lại kỹ bài tập trước khi nộp bài!'
					/>
				</div>
			)}

			{record?.trangThai === ETrangThaiNopBaiTap.DA_NOP ? (
				<div style={{ marginBottom: 12 }}>
					<Alert type='success' showIcon message='Đã nộp bài' />
				</div>
			) : !quaThoiHanNopBai ? (
				<div style={{ marginBottom: 12 }}>
					<Alert
						type='info'
						showIcon
						message={
							<>
								Thời gian còn lại để nộp bài: <b style={{ color: 'red' }}>{remainingTime}</b>{' '}
								<b>({moment(record?.assignment?.thoiGianKetThuc).format('HH:mm DD/MM/YYYY')})</b>
							</>
						}
					/>
				</div>
			) : quaThoiHanNopBai ? (
				<div style={{ marginBottom: 12 }}>
					<Alert
						type='error'
						showIcon
						message={<>Quá thời hạn nộp bài {moment(record?.assignment?.thoiGianKetThuc).format('HH:mm DD/MM/YYYY')}</>}
					/>
				</div>
			) : null}

			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
					<Col span={24}>
						<Divider>Chi tiết bài tập</Divider>
					</Col>
					<div className='dien-dan'>
						<div className='content'>
							<Descriptions column={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 2 }}>
								<Descriptions.Item label='Giảng viên giao bài'>{record?.assignment?.hoTenNguoiGiao}</Descriptions.Item>
								<Descriptions.Item label='Thời gian giao bài'>
									{record?.assignment?.thoiGianGiao
										? moment(record?.assignment?.thoiGianGiao).format('HH:mm DD/MM/YYYY')
										: '--'}
								</Descriptions.Item>
							</Descriptions>
							<Row gutter={[12, 12]} style={{ marginTop: 8 }}>
								<Col xs={24}>
									<b>{record?.assignment?.noiDung}</b>{' '}
									{record?.assignment?.choPhepCapNhatSauNop && (
										<i style={{ color: APP_CONFIG_PRIMARY_COLOR }}>(Cho phép nộp bài sau thời gian hết hạn)</i>
									)}
								</Col>
								<Col xs={24}>
									<div dangerouslySetInnerHTML={{ __html: record?.assignment?.huongDanNop ?? '' }} />
								</Col>
								<Col xs={24}>
									<Row gutter={[12, 12]} style={{ marginTop: 8 }}>
										{record?.assignment?.urlTepDinhKem?.map((val) => (
											<Col span={24} md={12} key={val}>
												<BoxFile url={val} />
											</Col>
										))}
									</Row>
								</Col>
							</Row>
						</div>
					</div>

					<Col span={24}>
						<Divider>Câu trả lời của bạn</Divider>
					</Col>

					<Col span={24}>
						<Descriptions column={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 2 }}>
							<Descriptions.Item label='Trạng thái'>
								<Tag color={colorTrangThaiNopBaiTap[record?.trangThai as ETrangThaiNopBaiTap]}>
									{mapTrangThaiNopBaiTap[record?.trangThai as ETrangThaiNopBaiTap]}
								</Tag>
							</Descriptions.Item>
							<Descriptions.Item label='Thời gian cập nhật'>
								{moment(record?.thoiGianTraLoi ?? record?.updatedAt).format('HH:mm DD/MM/YYYY')}
							</Descriptions.Item>
						</Descriptions>
					</Col>

					<Col span={24}>
						<Form.Item name='noiDungTraLoi' label='Nội dung trả lời'>
							<TinyEditor height={350} miniToolbar hideMenubar disabled={disable || disableIsQuiz} />
						</Form.Item>
					</Col>

					<Col span={24}>
						<Form.Item name='urlImages' label='Tệp đính kèm'>
							<UploadFile
								maxCount={5}
								otherProps={{
									disabled: disable || disableIsQuiz,
								}}
							/>
						</Form.Item>
					</Col>
				</Row>
				{record?.assignment?.isQuiz && (
					<Spin spinning={loading}>
						<FormQuiz form={form} cauTraLoi={cauTraLoi} />
					</Spin>
				)}

				<div className='form-footer'>
					<Tooltip title={disable || disableIsQuiz ? 'Đã nộp bài tập hoặc quá thời hạn nộp bài' : 'Nộp bài'}>
						<Button
							disabled={disable || disableIsQuiz}
							loading={formSubmiting}
							htmlType='submit'
							type='primary'
							onClick={() => setTrangThaiNopBai('1')}
						>
							Nộp bài
						</Button>
					</Tooltip>
					{!record?.assignment?.isQuiz && (
						<Tooltip
							title={
								record?.trangThai === ETrangThaiNopBaiTap.DA_NOP || disable
									? 'Đã nộp bài tập hoặc quá thời hạn nộp bài'
									: 'Lưu bài'
							}
						>
							<Button
								disabled={record?.trangThai === ETrangThaiNopBaiTap.DA_NOP || disable}
								loading={formSubmiting}
								htmlType='submit'
								type='primary'
								onClick={() => setTrangThaiNopBai('2')}
							>
								Lưu lại
							</Button>
						</Tooltip>
					)}
					<Button onClick={() => setVisibleForm(false)}>Hủy</Button>
				</div>
			</Form>
		</>
	);
};

export default FormBaiTap;
