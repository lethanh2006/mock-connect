import UploadFile from '@/components/Upload/UploadFile';
import { getCauTraLoiMeBaiTap } from '@/services/TienIch/KhaoSat/BieuMau';
import type { BieuMau } from '@/services/TienIch/KhaoSat/BieuMau/typing';
import { ELoaiCauHoi } from '@/services/TienIch/KhaoSat/constants';
import { buildUpLoadMultiFile, handleSingleFile } from '@/services/uploadFile';
import { resetFieldsForm } from '@/utils/utils';
import { Alert, Button, Col, Descriptions, Divider, Form, Input, Row } from 'antd';
import moment from 'moment';
import { useEffect } from 'react';
import { useModel } from 'umi';
import BoxFile from '../../DienDan/components/BoxFile';
import '../../DienDan/style.less';
import FormQuiz from './FormQuiz';
const FormBaiTap = (props: any) => {
	const { getData } = props;
	const [form] = Form.useForm();
	const { record, visibleForm, setVisibleForm, sinhVienNopBaiTapModal, formSubmiting } = useModel('daotao.baitap');
	const { record: recBieuMau, getByIdModel: getBieuMau } = useModel('tienich.bieumau');
	const quaThoiHanNopBai =
		!record?.assignment?.thoiGianKetThuc || moment().isAfter(record?.assignment?.thoiGianKetThuc);

	useEffect(() => {
		if (!visibleForm) {
			resetFieldsForm(form);
		} else if (record?._id) {
			getBieuMau(record?.assignment?.khaoSatId ?? '');
			if (record?.cauTraLoiId) {
				getCauTraLoiMeBaiTap(record?.cauTraLoiId).then((res: any) => {
					const index = res?.data?.data?.danhSachTraLoi?.[0];
					if (index?._id) {
						const values: any = {};
						recBieuMau?.danhSachKhoi?.map((khoi) => {
							khoi.danhSachCauHoi?.map((question) => {
								if (question.loai === ELoaiCauHoi.SINGLE_CHOICE) {
									if (index && index.traLoiKhac) {
										values[question._id] = 'traLoiKhac';
										values[`${question._id}_otherAnswer`] = index.traLoiKhac;
									} else {
										values[question._id] = index?.listLuaChon?.[0];
									}
								} else if (
									question.loai === ELoaiCauHoi.GRID_MULTIPLE_CHOICE ||
									question.loai === ELoaiCauHoi.GRID_SINGLE_CHOICE
								) {
									values[question._id] = {};
									index?.listLuaChonBang?.forEach((item: any) => {
										const idHang = item.idHang;
										const idCot = item.idCot;
										if (!values[question._id][idHang]) values[question._id][idHang] = {};
										values[question._id][idHang][idCot] = true;
									});
								} else values[question._id] = index;
							});
						});
						form.setFieldsValue({
							...record,
							...values,
						});
					}
				});
			}
		}
	}, [visibleForm, record?._id]);

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
			mode: 'submit',
			thongTinCauTraLoiQuiz: {
				danhSachTraLoi,
				idKhaoSat: record?.assignment?.khaoSatId,
			},
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
			{quaThoiHanNopBai ? (
				<div style={{ marginBottom: 12 }}>
					<Alert type='error' showIcon message='Quá thời hạn nộp bài' />
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
								<Descriptions.Item label='Thời hạn nộp bài'>
									{record?.assignment?.thoiGianKetThuc
										? moment(record?.assignment?.thoiGianKetThuc).format('HH:mm DD/MM/YYYY')
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
						<Form.Item name='noiDungTraLoi' label='Nội dung trả lời'>
							<Input.TextArea rows={3} placeholder='Nhập nội dung trả lời' />
						</Form.Item>
					</Col>

					<Col span={24}>
						<Form.Item name='urlImages' label='Tệp đính kèm'>
							<UploadFile maxCount={5} disabled={quaThoiHanNopBai} />
						</Form.Item>
					</Col>
				</Row>
				{record?.assignment?.isQuiz && <FormQuiz form={form} />}

				<div className='form-footer'>
					<Button
						disabled={quaThoiHanNopBai && !record?.assignment?.choPhepCapNhatSauNop}
						loading={formSubmiting}
						htmlType='submit'
						type='primary'
					>
						Nộp bài
					</Button>
					<Button onClick={() => setVisibleForm(false)}>Hủy</Button>
				</div>
			</Form>
		</>
	);
};

export default FormBaiTap;
