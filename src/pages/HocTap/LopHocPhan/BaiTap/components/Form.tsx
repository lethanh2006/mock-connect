import UploadFile from '@/components/Upload/UploadFile';
import type { BieuMau } from '@/services/TienIch/KhaoSat/BieuMau/typing';
import { ELoaiCauHoi } from '@/services/TienIch/KhaoSat/constants';
import { buildUpLoadMultiFile, handleSingleFile } from '@/services/uploadFile';
import { resetFieldsForm } from '@/utils/utils';
import { Alert, Button, Col, Form, Input, Modal, Row } from 'antd';
import moment from 'moment';
import { useEffect } from 'react';
import { useModel } from 'umi';
import FormQuiz from './FormQuiz';

const FormBaiTap = (props: any) => {
	const { getData } = props;
	const [form] = Form.useForm();
	const { record, visibleForm, setVisibleForm, sinhVienNopBaiTapModal, formSubmiting } = useModel('daotao.baitap');
	const { record: recBieuMau, traLoiBieuMauModel, formSubmiting: formBieuMau } = useModel('tienich.bieumau');
	const quaThoiHanNopBai =
		!record?.assignment?.thoiGianKetThuc || moment().isAfter(record?.assignment?.thoiGianKetThuc);

	useEffect(() => {
		if (!visibleForm) {
			resetFieldsForm(form);
		} else if (record?._id) form.setFieldsValue(record);
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
		values.urlImages = urlImages;

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

		if (!record?.assignment?.isQuiz) {
			const data = {
				...record,
				...values,
				thoiGianTraLoi: moment(),
				mode: 'submit',
			};

			await sinhVienNopBaiTapModal(data as any, getData)
				.then(() => setVisibleForm(false))
				.catch((er) => console.log(er));
		} else {
			await traLoiBieuMauModel({
				idKhaoSat: record?._id ?? '',
				danhSachTraLoi,
				idDot: '',
			})
				.then((res) => {
					if (res) {
						const data = {
							...record,
							cauTraLoiId: res?._id,
							thoiGianTraLoi: moment(),
							mode: 'submit',
						};
						sinhVienNopBaiTapModal(data as any, getData);
					}
					setVisibleForm(false);
				})
				.catch((er) => console.log(er));
		}
	};

	return (
		<Modal visible={visibleForm} onCancel={() => setVisibleForm(false)} footer={null} width={800} title='Nộp bài tập'>
			{quaThoiHanNopBai && (
				<div style={{ marginBottom: 12 }}>
					<Alert type='error' showIcon message='Quá thời hạn nộp bài' />
				</div>
			)}

			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
					<Col span={24}>
						<b>{record?.assignment?.noiDung}</b>
					</Col>
					<Col span={24}>
						<div
							dangerouslySetInnerHTML={{ __html: record?.assignment?.huongDanNop ?? '--' }}
							className='notif-content'
						/>
					</Col>

					<Col span={24}>
						<Form.Item name='noiDungTraLoi' label='Nội dung trả lời'>
							<Input.TextArea rows={3} placeholder='Nhập nội dung trả lời' />
						</Form.Item>
					</Col>

					<Col span={24}>
						<Form.Item name='urlImages' label='Tệp đính kèm'>
							<UploadFile drag maxCount={5} disabled={quaThoiHanNopBai} />
						</Form.Item>
					</Col>
				</Row>
				{record?.assignment?.isQuiz && <FormQuiz form={form} />}

				<div className='form-footer'>
					<Button
						// disabled={record?.trangThai === ETrangThaiNopBaiTap.DA_NOP || quaThoiHanNopBai}
						loading={formSubmiting || formBieuMau}
						htmlType='submit'
						type='primary'
					>
						Nộp bài
					</Button>
					<Button onClick={() => setVisibleForm(false)}>Hủy</Button>
				</div>
			</Form>
		</Modal>
	);
};

export default FormBaiTap;
