import { type BieuMau } from '@/services/TienIch/KhaoSat/BieuMau/typing';
import { ELoaiCauHoi } from '@/services/TienIch/KhaoSat/constants';
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
	isDanhGiaGiangVien?: boolean;
	onOk: (val: BieuMau.TraLoiRecord[]) => void;
	cauTraLoi?: BieuMau.TraLoiRecord[];
	giangVienSsoId: string;
	[key: string]: any;
}) => {
	const [form] = Form.useForm();
	const { isDanhGiaGiangVien, onOk, cauTraLoi, giangVienSsoId } = props;
	const { loading, record, traLoiBieuMauModel, formSubmiting } = useModel('tienich.bieumau');

	const { formSubmiting: formSubmitingGV } = useModel('sinhvien.danhgiagiangvien');
	const { setVisibleForm, record: recordDot, getDotMeModel, visibleForm, danhSach } = useModel('tienich.dotkhaosat');
	const [check, setCheck] = useState<boolean>(false);

	const ngoaiThoiGian =
		!recordDot?.thoiGianBatDau ||
		!recordDot?.thoiGianKetThuc ||
		moment().isBefore(recordDot?.thoiGianBatDau, 'd') ||
		moment().isAfter(recordDot?.thoiGianKetThuc, 'd');

	useEffect(() => {
		if (!visibleForm && !giangVienSsoId) {
			resetFieldsForm(form);
			setCheck(false);
		}
	}, [visibleForm]);

	useEffect(() => {
		if (giangVienSsoId) {
			const values: any = {};
			record?.danhSachKhoi?.map((khoi) => {
				khoi.danhSachCauHoi?.map((question) => {
					const traLoi = cauTraLoi?.find((i) => i.idCauHoi === question._id);

					if (question.loai === ELoaiCauHoi.SINGLE_CHOICE) values[question._id] = traLoi?.listLuaChon?.[0];
					else if (
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
	}, [record?._id, JSON.stringify(cauTraLoi)]);

	const renderQuestion = (question: BieuMau.CauHoi, index: number) => {
		let questionEleMent = <div />;
		if (question.loai === ELoaiCauHoi.SINGLE_CHOICE) questionEleMent = <SingleChoice question={question} />;
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

		dsCauHoi?.map(async (question) => {
			const traLoi = values[question._id];
			if (traLoi) {
				let tempTraLoi: Partial<BieuMau.TraLoiRecord> = { idCauHoi: question._id };

				if (question.loai === ELoaiCauHoi.UPLOAD_FILE) {
					const listUrlFile = await buildUpLoadTaiLieu(values[question._id].listUrlFile);
					tempTraLoi.listUrlFile = listUrlFile as string[];
				} else if (question.loai === ELoaiCauHoi.SINGLE_CHOICE)
					tempTraLoi.listLuaChon = question?.luaChon
						?.map((item: any) => {
							if ([traLoi]?.includes(item.noiDung)) {
								return item._id;
							}
						})
						.filter(Boolean);
				else if (question.loai === ELoaiCauHoi.MULTIPLE_CHOICE)
					tempTraLoi.listLuaChon = question?.luaChon
						?.map((item: any) => {
							if (traLoi?.listLuaChon?.includes(item.noiDung)) {
								return item._id;
							}
						})
						.filter(Boolean);
				else if (question.loai === ELoaiCauHoi.GRID_MULTIPLE_CHOICE || question.loai === ELoaiCauHoi.GRID_SINGLE_CHOICE)
					tempTraLoi.listLuaChonBang = convertList(values[question._id]);
				else tempTraLoi = { ...tempTraLoi, ...values[question._id] };

				danhSachTraLoi.push(tempTraLoi as BieuMau.TraLoiRecord);
			}
		});

		if (isDanhGiaGiangVien) {
			onOk(danhSachTraLoi as BieuMau.TraLoiRecord[]);
		} else {
			await traLoiBieuMauModel({
				idKhaoSat: record?._id ?? '',
				danhSachTraLoi,
				idDot: recordDot?._id ?? danhSach[0]?._id,
			})
				.then(() => {
					getDotMeModel();
					setVisibleForm(false);
				})
				.catch((er) => console.log(er));
		}
	};

	return (
		<Card loading={loading} title={isDanhGiaGiangVien ? undefined : 'Chi tiết khảo sát'}>
			<Spin spinning={formSubmiting}>
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
						<Button
							disabled={(record?.coCamKet && !check) || ngoaiThoiGian}
							loading={formSubmiting || formSubmitingGV}
							htmlType='submit'
							type='primary'
						>
							Hoàn thành
						</Button>
						{!isDanhGiaGiangVien ? <Button onClick={() => setVisibleForm(false)}>Hủy</Button> : null}
					</div>
				</Form>
			</Spin>
		</Card>
	);
};

export default FormTraLoiKhaoSat;
