import { type BieuMau } from '@/services/TienIch/KhaoSat/BieuMau/typing';
import { buildUpLoadMultiFile } from '@/services/uploadFile';
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
import { ELoaiCauHoi } from '@/services/TienIch/KhaoSat/constants';

const FormTraLoiKhaoSat = (props: {
	isDanhGiaGiangVien?: boolean;
	onOk: (val: BieuMau.TraLoiRecord[]) => void;
	[key: string]: any;
	cauTraLoi?: BieuMau.TraLoiRecord[];
}) => {
	const { isDanhGiaGiangVien, onOk, cauTraLoi } = props;
	const { loading, record, traLoiBieuMauModel, formSubmiting } = useModel('tienich.bieumau');
	const { formSubmiting: formSubmitingGV } = useModel('sinhvien.danhgiagiangvien');
	const { setVisibleForm, record: recordDot, getDotMeModel, visibleForm, danhSach } = useModel('tienich.dotkhaosat');
	const [check, setCheck] = useState<boolean>(false);
	const [form] = Form.useForm();

	const ngoaiThoiGian =
		!recordDot?.thoiGianBatDau ||
		!recordDot?.thoiGianKetThuc ||
		moment().isBefore(recordDot?.thoiGianBatDau, 'd') ||
		moment().isAfter(recordDot?.thoiGianKetThuc, 'd');

	useEffect(() => {
		if (!visibleForm) {
			resetFieldsForm(form);
			setCheck(false);
		}
	}, [visibleForm]);

	const renderQuestion = (question: BieuMau.CauHoi, index: number) => {
		let questionEleMent = <div />;
		if (question.loai === ELoaiCauHoi.SINGLE_CHOICE)
			questionEleMent = (
				<SingleChoice
					question={question}
					traLoi={cauTraLoi?.find((item) => item?.idCauHoi === question?._id)}
					form={form}
				/>
			);
		else if (question.loai === ELoaiCauHoi.MULTIPLE_CHOICE)
			questionEleMent = (
				<MultipleChoice
					question={question}
					traLoi={cauTraLoi?.find((item) => item?.idCauHoi === question?._id)}
					form={form}
				/>
			);
		else if (question.loai === ELoaiCauHoi.TEXT)
			questionEleMent = (
				<Text question={question} traLoi={cauTraLoi?.find((item) => item?.idCauHoi === question?._id)} form={form} />
			);
		else if (question.loai === ELoaiCauHoi.GRID_MULTIPLE_CHOICE || question.loai === ELoaiCauHoi.GRID_SINGLE_CHOICE)
			questionEleMent = (
				<GridChoice
					question={question}
					traLoi={cauTraLoi?.find((item) => item?.idCauHoi === question?._id)}
					form={form}
				/>
			);
		else if (question.loai === ELoaiCauHoi.NUMERIC_RANGE)
			questionEleMent = (
				<NumericChoice
					question={question}
					traLoi={cauTraLoi?.find((item) => item?.idCauHoi === question?._id)}
					form={form}
				/>
			);
		else if (question.loai === ELoaiCauHoi.UPLOAD_FILE) {
			questionEleMent = (
				<FileChoice
					question={question}
					traLoi={cauTraLoi?.find((item) => item?.idCauHoi === question?._id)}
					form={form}
				/>
			);
		}

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
		const danhSachTraLoi: BieuMau.TraLoiRecord[] = [];
		if (record?.danhSachKhoi) {
			for (let indexKhoi = 0; indexKhoi < record?.danhSachKhoi?.length; indexKhoi++) {
				for (
					let indexCauHoi = 0;
					indexCauHoi < record?.danhSachKhoi?.[indexKhoi]?.danhSachCauHoi?.length;
					indexCauHoi++
				) {
					const cauHoi = record?.danhSachKhoi?.[indexKhoi]?.danhSachCauHoi?.[indexCauHoi];
					let traLoi: BieuMau.TraLoiRecord = {
						idCauHoi: cauHoi._id,
						listLuaChon: [],
						listLuaChonBang: [],
						luaChonTuyenTinh: 0,
						traLoiText: '',
					};
					if (cauHoi.loai === ELoaiCauHoi.UPLOAD_FILE) {
						const listUrlFile = await buildUpLoadMultiFile(values, cauHoi._id);
						traLoi = { ...traLoi, listUrlFile: listUrlFile };
					} else if (cauHoi.loai === ELoaiCauHoi.SINGLE_CHOICE && values?.[cauHoi._id])
						traLoi = { ...traLoi, listLuaChon: [values[cauHoi._id]] };
					else if (cauHoi.loai === ELoaiCauHoi.MULTIPLE_CHOICE && values?.[cauHoi._id])
						traLoi = { ...traLoi, listLuaChon: values[cauHoi._id] };
					else if (cauHoi.loai === ELoaiCauHoi.TEXT) traLoi = { ...traLoi, traLoiText: values[cauHoi._id] };
					else if (cauHoi.loai === ELoaiCauHoi.GRID_MULTIPLE_CHOICE || cauHoi.loai === ELoaiCauHoi.GRID_SINGLE_CHOICE)
						traLoi = { ...traLoi, listLuaChonBang: convertList(values[cauHoi._id]) };
					else if (cauHoi.loai === ELoaiCauHoi.NUMERIC_RANGE) {
						traLoi = { ...traLoi, luaChonTuyenTinh: values[cauHoi._id] };
					}
					danhSachTraLoi.push(traLoi);
				}
			}
		}

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

		// record?.danhSachKhoi?.forEach((khoi, indexKhoi) => {
		// 	khoi?.danhSachCauHoi?.forEach(async (cauHoi, indexCauHoi) => {
		// 		let traLoi: BieuMau.TraLoiRecord = {
		// 			idCauHoi: cauHoi._id,
		// 			listLuaChon: [],
		// 			listLuaChonBang: [],
		// 			luaChonTuyenTinh: 0,
		// 			traLoiText: '',
		// 		};
		// 		if (cauHoi.loai === 'UploadFile') {
		// 			const listUrlFile = await buildUpLoadMultiFile(values, `${indexKhoi}||${indexCauHoi}`);
		// 			traLoi = { ...traLoi, listUrlFile: listUrlFile };
		// 		} else if (cauHoi.loai === 'SingleChoice' && values?.[`${indexKhoi}||${indexCauHoi}`])
		// 			traLoi = { ...traLoi, listLuaChon: [values[`${indexKhoi}||${indexCauHoi}`]] };
		// 		else if (cauHoi.loai === 'MultipleChoice' && values?.[`${indexKhoi}||${indexCauHoi}`])
		// 			traLoi = { ...traLoi, listLuaChon: values[`${indexKhoi}||${indexCauHoi}`] };
		// 		else if (cauHoi.loai === 'Text') traLoi = { ...traLoi, traLoiText: values[`${indexKhoi}||${indexCauHoi}`] };
		// 		else if (cauHoi.loai === 'GridMultipleChoice' || cauHoi.loai === 'GridSingleChoice')
		// 			traLoi = {
		// 				...traLoi,
		// 				listLuaChonBang: listLuaChonBang?.[indexKhoi || indexCauHoi] ?? [],
		// 			};
		// 		else if (cauHoi.loai === 'NumericRange') {
		// 			traLoi = { ...traLoi, luaChonTuyenTinh: values[`${indexKhoi}||${indexCauHoi}`] };
		// 		}
		// 		// else if (cauHoi.loai === 'UploadFile') {
		// 		//   const listUrlFile = await buildUpLoadMultiFile(values, `${indexKhoi}||${indexCauHoi}`);
		// 		//   console.log('listUrlFile',listUrlFile)
		// 		//   traLoi = { ...traLoi, listUrlFile:listUrlFile };
		// 		// }
		// 		danhSachTraLoi.push(traLoi);
		// 	});
		// });

		// Promise.all()

		// setTimeout(() => {
		// 	console.log('daaaaa', danhSachTraLoi);
		// 	traLoiBieuMauModel({
		// 		idKhaoSat: record?._id ?? '',
		// 		danhSachTraLoi,
		// 		idDot: recordDot?._id ?? '',
		// 	})
		// 		.then(() => {
		// 			getDotMeModel();
		// 			setVisibleForm(false);
		// 			setLoadingform(false);
		// 		})
		// 		.catch((er) => console.log(er))
		// 		.finally(() => {
		// 			setLoadingform(false);
		// 		});
		// }, 2000);

		if (isDanhGiaGiangVien) {
			onOk(danhSachTraLoi);
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
