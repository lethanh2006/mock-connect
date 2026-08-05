import UploadFile from '@/components/Upload/UploadFile';
import {
	colorTrangThaiNopBaiTap,
	ETrangThaiNopBaiTap,
	mapTrangThaiNopBaiTap,
} from '@/services/DaoTao/BaiTap/constants';
import { getCauTraLoiMeBaiTap } from '@/services/TienIch/KhaoSat/BieuMau';
import type { BieuMau } from '@/services/TienIch/KhaoSat/BieuMau/typing';
import { ELoaiCauHoi } from '@/services/TienIch/KhaoSat/constants';
import { buildUpLoadMultiFileMultipart, EFileScope, handleSingleFile } from '@/services/uploadFile';
import dayjs from '@/utils/dayjs';
import { formatDateTime } from '@/utils/formatDate';
import { resetFieldsForm } from '@/utils/utils';
import { Alert, Button, Col, Descriptions, Divider, Form, Input, Row, Spin, Tag, Tooltip } from 'antd';
import DOMPurify from 'dompurify';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import BoxFile from '../../DienDan/components/BoxFile';
import '../../DienDan/style.less';
import FormQuiz from './FormQuiz';

const FormBaiTap = (props: any) => {
	const intl = useIntl();
	const { getData } = props;
	const [form] = Form.useForm();
	const { record, visibleForm, setVisibleForm, sinhVienNopBaiTapModal, formSubmiting } = useModel('daotao.baitap');
	const { record: recBieuMau, getBieuMauKhaoSatSinhVienModel, loading } = useModel('tienich.bieumau');
	const [trangThaiNopBai, setTrangThaiNopBai] = useState<string>();
	const quaThoiHanNopBai = dayjs().isAfter(record?.assignment?.thoiGianKetThuc);
	const [cauTraLoi, setRecCauTraLoi] = useState<BieuMau.TraLoiRecord[]>([]);
	const [remainingTime, setRemainingTime] = useState('');

	const disable = quaThoiHanNopBai && !record?.assignment?.choPhepCapNhatSauNop;
	const disableIsQuiz = record?.assignment?.isQuiz && record?.trangThai === ETrangThaiNopBaiTap.DA_NOP;

	useEffect(() => {
		if (!visibleForm) {
			resetFieldsForm(form);
		} else if (record?._id) {
			if (record?.assignment?.khaoSatId && record?.assignment?.isQuiz) {
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
							} else {
								form.setFieldsValue(record);
							}
						});
					} else {
						form.setFieldsValue(record);
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
			const endTime = dayjs(record?.assignment?.thoiGianKetThuc);
			const now = dayjs();
			const diff = endTime.diff(now);

			if (diff <= 0) {
				setRemainingTime(intl.formatMessage({ id: 'lophocphan.id.baitap.thoihan' }));
				return;
			}

			const dur = dayjs.duration(diff);
			const days = Math.floor(dur.asDays());
			const hours = dur.hours();
			const minutes = dur.minutes();
			const seconds = dur.seconds();

			setRemainingTime(
				`${days} ${intl.formatMessage({ id: 'lophocphan.id.baitap.ngay' })} ${hours} ${intl.formatMessage({ id: 'lophocphan.id.baitap.gio' })} ${minutes} ${intl.formatMessage({ id: 'lophocphan.id.baitap.phut' })} ${seconds} ${intl.formatMessage({ id: 'lophocphan.id.baitap.giay' })}`,
			);
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
		const urlImages = await buildUpLoadMultiFileMultipart(values, 'urlImages', {
			scope: EFileScope.INTERNAL,
			module: 'bai-tap',
			returnValue: 'url',
		});

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
			thongTinCauTraLoiQuiz:
				record?.assignment?.khaoSatId && record?.assignment?.isQuiz
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
			{record?.trangThai === ETrangThaiNopBaiTap.DA_NOP ? (
				<div style={{ marginBottom: 12 }}>
					<Alert type='success' showIcon message={intl.formatMessage({ id: 'lophocphan.id.baitap.danopbai' })} />
				</div>
			) : !quaThoiHanNopBai ? (
				<div style={{ marginBottom: 12 }}>
					<Alert
						type='info'
						showIcon
						message={
							<>
								{intl.formatMessage({ id: 'lophocphan.id.baitap.tgconlai' })}:{' '}
								<b style={{ color: 'red' }}>{remainingTime}</b>{' '}
								<b>({formatDateTime(record?.assignment?.thoiGianKetThuc)})</b>
							</>
						}
					/>
				</div>
			) : quaThoiHanNopBai ? (
				<div style={{ marginBottom: 12 }}>
					<Alert
						type='error'
						showIcon
						message={
							<>
								{intl.formatMessage({ id: 'lophocphan.id.baitap.tgquahan' })}{' '}
								{formatDateTime(record?.assignment?.thoiGianKetThuc)}
							</>
						}
					/>
				</div>
			) : null}

			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
					<Col span={24}>
						<Divider>{intl.formatMessage({ id: 'lophocphan.id.baitap.chitietbt' })}</Divider>
					</Col>
					<div className='dien-dan'>
						<div className='content'>
							<Descriptions column={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 2 }}>
								<Descriptions.Item label={intl.formatMessage({ id: 'lophocphan.id.baitap.gv' })}>
									{record?.assignment?.hoTenNguoiGiao}
								</Descriptions.Item>
								<Descriptions.Item label={intl.formatMessage({ id: 'lophocphan.id.baitap.tggiaobai' })}>
									{formatDateTime(record?.assignment?.thoiGianGiao ?? record?.assignment?.updatedAt)}
								</Descriptions.Item>
							</Descriptions>
							<Row gutter={[12, 12]} style={{ marginTop: 8 }}>
								<Col xs={24}>
									<b>{record?.assignment?.noiDung}</b>{' '}
									{record?.assignment?.choPhepCapNhatSauNop && (
										<i style={{ color: APP_CONFIG_PRIMARY_COLOR }}>
											{intl.formatMessage({ id: 'lophocphan.id.baitap.chophep' })}
										</i>
									)}
								</Col>
								<Col xs={24}>
									<div
										className='detail-noi-dong-post'
										dangerouslySetInnerHTML={{
											__html: DOMPurify.sanitize(
												record?.assignment?.huongDanNop
													? record?.assignment.huongDanNop.replace(
															/<img/g,
															'<img style="max-width:100%;height:auto;display:block;margin:10px 0;"',
														)
													: '',
											),
										}}
									/>
								</Col>
								{record?.assignment?.urlTepDinhKem && (
									<Col xs={24}>
										<BoxFile url={record?.assignment?.urlTepDinhKem ?? []} />
									</Col>
								)}
							</Row>
						</div>
					</div>

					<Col span={24}>
						<Divider>{intl.formatMessage({ id: 'lophocphan.id.baitap.cautl' })}</Divider>
					</Col>

					<Col span={24}>
						<Descriptions column={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 2 }}>
							<Descriptions.Item label={intl.formatMessage({ id: 'lophocphan.id.baitap.trangthai' })}>
								<Tag color={colorTrangThaiNopBaiTap[record?.trangThai as ETrangThaiNopBaiTap]}>
									{mapTrangThaiNopBaiTap[record?.trangThai as ETrangThaiNopBaiTap]}
								</Tag>
							</Descriptions.Item>
							<Descriptions.Item label={intl.formatMessage({ id: 'lophocphan.id.baitap.tgcapnhat' })}>
								{record?.thoiGianTraLoi ? formatDateTime(record?.thoiGianTraLoi) : '--'}
							</Descriptions.Item>
						</Descriptions>
					</Col>

					<Col span={24}>
						<Form.Item name='noiDungTraLoi' label={intl.formatMessage({ id: 'lophocphan.id.baitap.ndtraloi' })}>
							<Input.TextArea rows={3} disabled={disable || disableIsQuiz} />
						</Form.Item>
					</Col>

					<Col span={24}>
						<Form.Item name='urlImages' label={intl.formatMessage({ id: 'lophocphan.id.baitap.tepdinhkem' })}>
							<UploadFile
								maxCount={5}
								otherProps={{
									disabled: disable || disableIsQuiz,
								}}
								resize
								isPrivate
							/>
						</Form.Item>
					</Col>
				</Row>
				{record?.assignment?.isQuiz && (
					<Col span={24}>
						<Spin spinning={loading}>
							<FormQuiz form={form} cauTraLoi={cauTraLoi} disabled={disable || disableIsQuiz} />
						</Spin>
					</Col>
				)}

				{record?.assignment?.isQuiz && record?.trangThai === ETrangThaiNopBaiTap.CHUA_NOP && !quaThoiHanNopBai && (
					<Col span={24}>
						<i style={{ color: 'red' }}>{intl.formatMessage({ id: 'lophocphan.id.baitap.notiQ' })}</i>
					</Col>
				)}

				<div className='form-footer'>
					<Tooltip
						title={
							disable || disableIsQuiz
								? intl.formatMessage({ id: 'lophocphan.id.baitap.tooltip1' })
								: !!record?.tongDiem
									? intl.formatMessage({ id: 'lophocphan.id.baitap.tooltip2' })
									: intl.formatMessage({ id: 'lophocphan.id.baitap.nopbai' })
						}
					>
						<Button
							disabled={disable || disableIsQuiz || !!record?.tongDiem}
							loading={formSubmiting}
							htmlType='submit'
							type='primary'
							onClick={() => setTrangThaiNopBai('1')}
						>
							{intl.formatMessage({ id: 'lophocphan.id.baitap.nopbai' })}
						</Button>
					</Tooltip>
					{!record?.assignment?.isQuiz && (
						<Tooltip
							title={
								record?.trangThai === ETrangThaiNopBaiTap.DA_NOP || disable
									? intl.formatMessage({ id: 'lophocphan.id.baitap.tooltip3' })
									: intl.formatMessage({ id: 'lophocphan.id.baitap.luulai' })
							}
						>
							<Button
								disabled={record?.trangThai === ETrangThaiNopBaiTap.DA_NOP || disable}
								loading={formSubmiting}
								htmlType='submit'
								type='primary'
								onClick={() => setTrangThaiNopBai('2')}
							>
								{intl.formatMessage({ id: 'global.button.luulai' })}
							</Button>
						</Tooltip>
					)}
					<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
				</div>
			</Form>
		</>
	);
};

export default FormBaiTap;
