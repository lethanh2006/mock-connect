import ButtonExtend from '@/components/Table/ButtonExtend';
import { type BieuMau } from '@/services/TienIch/KhaoSat/BieuMau/typing';
import { ELoaiCauHoi, EVaiTroKhaoSat } from '@/services/TienIch/KhaoSat/constants';
import { handleSingleFile } from '@/services/uploadFile';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Checkbox, Divider, Form, Spin } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import FileChoice from './Question/FileChoice';
import GridChoice from './Question/GridChoice';
import MultipleChoice from './Question/MultipleChoice';
import NumericChoice from './Question/NumericChoice';
import SingleChoice from './Question/SingleChoice';
import Text from './Question/Text';

const FormTraLoiKhaoSat = (props: {
	/** Hàm xử lý bên ngoài truyền vào nếu ko sử dụng model `bieumau` */
	onOk?: (val: BieuMau.TraLoiRecord[]) => void;
	/** Câu trả lời để fill vào */
	cauTraLoi?: BieuMau.TraLoiRecord[];
	/** FormSubmiting truyền vào nếu ko sử dụng model `bieumau` */
	formSubmiting?: boolean;
	onCancel?: () => void;
	hideCard?: boolean;
	[key: string]: any;
}) => {
	const { setVisibleForm, record: recordDot, getDotMeModel, visibleForm, danhSach } = useModel('tienich.dotkhaosat');
	const { loading, record, traLoiBieuMauModel, formSubmiting: formSubmiting1 } = useModel('tienich.bieumau');
	const { record: recSinhVien } = useModel('sinhvien.sinhvien');
	const [form] = Form.useForm();
	const { onOk, cauTraLoi, onCancel, hideCard } = props;
	const formSubmiting = props.formSubmiting !== undefined ? props.formSubmiting : formSubmiting1;
	const [check, setCheck] = useState<boolean>(false);
	const ngoaiThoiGian =
		!recordDot?.thoiGianBatDau ||
		!recordDot?.thoiGianKetThuc ||
		moment().isBefore(recordDot?.thoiGianBatDau, 'd') ||
		moment().isAfter(recordDot?.thoiGianKetThuc, 'd');

	useEffect(() => {
		if (!visibleForm && !onOk) {
			resetFieldsForm(form);
			setCheck(false);
		}
	}, [visibleForm]);

	useEffect(() => {
		if (cauTraLoi?.length) {
			const values: any = {};
			record?.danhSachKhoi?.map((khoi) => {
				khoi.danhSachCauHoi?.map((question) => {
					const traLoi = cauTraLoi?.find((i) => i.idCauHoi === question._id);

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
						traLoi?.listLuaChonBang?.forEach((item) => {
							const idHang = item.idHang;
							const idCot = item.idCot;
							if (!values[question._id][idHang]) values[question._id][idHang] = {};
							values[question._id][idHang][idCot] = true;
						});
					} else values[question._id] = traLoi;
				});
			});
			form.resetFields();
			form.setFieldsValue(values);
		}
	}, [record?._id, JSON.stringify(cauTraLoi), visibleForm]);

	const renderQuestion = (question: BieuMau.CauHoi, index: number) => {
		let questionEleMent = <div />;
		if (question.loai === ELoaiCauHoi.SINGLE_CHOICE) questionEleMent = <SingleChoice form={form} question={question} />;
		else if (question.loai === ELoaiCauHoi.MULTIPLE_CHOICE) questionEleMent = <MultipleChoice question={question} />;
		else if (question.loai === ELoaiCauHoi.TEXT) questionEleMent = <Text question={question} />;
		else if (question.loai === ELoaiCauHoi.GRID_MULTIPLE_CHOICE || question.loai === ELoaiCauHoi.GRID_SINGLE_CHOICE)
			questionEleMent = <GridChoice question={question} form={form} />;
		else if (question.loai === ELoaiCauHoi.NUMERIC_RANGE) questionEleMent = <NumericChoice question={question} />;
		else if (question.loai === ELoaiCauHoi.UPLOAD_FILE) questionEleMent = <FileChoice question={question} />;

		return (
			<div key={question._id} style={{ marginBottom: 12 }}>
				<div className='fw500'>
					<u>Câu {index + 1}:</u> {question.noiDungCauHoi}{' '}
					{question.batBuoc ? <span style={{ color: 'red' }}>*</span> : null}
				</div>
				{questionEleMent}
			</div>
		);
	};

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

	// const handleConvertCauTraLoi = async (values: any) => {
	// 	const danhSachTraLoi: BieuMau.TraLoiRecord[] = [];
	// 	record?.danhSachKhoi?.forEach((khoi, indexKhoi) => {
	// 		khoi?.danhSachCauHoi?.forEach(async (cauHoi, indexCauHoi) => {
	// 			let traLoi: BieuMau.TraLoiRecord = {
	// 				idCauHoi: cauHoi._id,
	// 				listLuaChon: [],
	// 				listLuaChonBang: [],
	// 				luaChonTuyenTinh: 0,
	// 				traLoiText: '',
	// 			};
	// 			if (cauHoi.loai === 'UploadFile') {
	// 				const listUrlFile = await buildUpLoadMultiFile(values, `${indexKhoi}||${indexCauHoi}`).then(() => {});
	// 				console.log('lisst', listUrlFile);
	// 				// traLoi = { ...traLoi, listUrlFile: listUrlFile };
	// 			} else if (cauHoi.loai === 'SingleChoice' && values?.[`${indexKhoi}||${indexCauHoi}`])
	// 				traLoi = { ...traLoi, listLuaChon: [values[`${indexKhoi}||${indexCauHoi}`]] };
	// 			else if (cauHoi.loai === 'MultipleChoice' && values?.[`${indexKhoi}||${indexCauHoi}`])
	// 				traLoi = { ...traLoi, listLuaChon: values[`${indexKhoi}||${indexCauHoi}`] };
	// 			else if (cauHoi.loai === 'Text') traLoi = { ...traLoi, traLoiText: values[`${indexKhoi}||${indexCauHoi}`] };
	// 			else if (cauHoi.loai === 'GridMultipleChoice' || cauHoi.loai === 'GridSingleChoice')
	// 				traLoi = {
	// 					...traLoi,
	// 					listLuaChonBang: listLuaChonBang?.[indexKhoi || indexCauHoi] ?? [],
	// 				};
	// 			else if (cauHoi.loai === 'NumericRange') {
	// 				traLoi = { ...traLoi, luaChonTuyenTinh: values[`${indexKhoi}||${indexCauHoi}`] };
	// 			}
	// 			// else if (cauHoi.loai === 'UploadFile') {
	// 			//   const listUrlFile = await buildUpLoadMultiFile(values, `${indexKhoi}||${indexCauHoi}`);
	// 			//   console.log('listUrlFile',listUrlFile)
	// 			//   traLoi = { ...traLoi, listUrlFile:listUrlFile };
	// 			// }
	// 			danhSachTraLoi.push(traLoi);
	// 		});
	// 	});
	// 	return danhSachTraLoi;
	// };

	const onFinish = async (values: any) => {
		const danhSachTraLoi: Partial<BieuMau.TraLoiRecord[]> = [];
		const dsCauHoi = record?.danhSachKhoi?.map((khoi) => khoi.danhSachCauHoi).flat();

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

		if (!!onOk) {
			onOk(danhSachTraLoi as BieuMau.TraLoiRecord[]);
		} else {
			await traLoiBieuMauModel({
				idKhaoSat: record?._id ?? '',
				danhSachTraLoi,
				idDot: recordDot?._id ?? danhSach[0]?._id,
				vaiTroNguoiKhaoSat: EVaiTroKhaoSat.SINH_VIEN,
				trangThaiSinhVien: recSinhVien?.trangThaiHoc,
				danToc: recSinhVien?.danToc,
				gioiTinh: recSinhVien?.gioiTinh,
			})
				.then(() => {
					getDotMeModel();
					setVisibleForm(false);
				})
				.catch((er) => console.log(er));
		}
	};

	const mainContent = (
		<Spin spinning={formSubmiting || loading}>
			<Form scrollToFirstError onFinish={onFinish} layout='vertical' form={form}>
				<h3>{record?.tieuDe}</h3>
				<p>{record?.moTa}</p>

				{record?.danhSachKhoi?.map((item) => (
					// eslint-disable-next-line react/no-array-index-key
					<div key={item._id} style={{ marginBottom: 32 }}>
						<Divider />
						<div className='fw500'>{item.tieuDe}</div>
						<div style={{ marginBottom: 12 }}>{item.moTa}</div>

						{item.danhSachCauHoi?.map((cauHoi, index) => renderQuestion(cauHoi, index))}
					</div>
				))}

				{record?.coCamKet && (
					<Checkbox
						style={{ marginBottom: 12, marginTop: 12 }}
						onChange={(e) => setCheck(e.target.checked)}
						checked={check}
					>
						{record?.noiDungCamKet}
					</Checkbox>
				)}

				<div className='form-footer'>
					<ButtonExtend
						disabled={(record?.coCamKet && !check) || ngoaiThoiGian}
						loading={formSubmiting}
						htmlType='submit'
						type='primary'
						tooltip={ngoaiThoiGian ? 'Ngoài thời gian đợt khảo sát' : undefined}
					>
						Hoàn thành
					</ButtonExtend>
					{!onOk ? <Button onClick={() => setVisibleForm(false)}>Hủy</Button> : null}
					{!!onCancel ? <Button onClick={() => onCancel()}>Hủy</Button> : null}
				</div>
			</Form>
		</Spin>
	);

	if (hideCard) return mainContent;
	return <Card title='Chi tiết khảo sát'>{mainContent}</Card>;
};

export default FormTraLoiKhaoSat;
