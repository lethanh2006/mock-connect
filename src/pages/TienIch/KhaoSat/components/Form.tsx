import { type BieuMau } from '@/services/TienIch/KhaoSat/BieuMau/typing';
import { buildUpLoadMultiFile } from '@/services/uploadFile';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Checkbox, Divider, Form, Spin } from 'antd';
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
	giangVienSsoId?: string;
	getDanhGiaGiangVien?: any;
	ngoaiThoiGian?: boolean;
}) => {
	const { isDanhGiaGiangVien, giangVienSsoId, getDanhGiaGiangVien, ngoaiThoiGian } = props;
	const { loading, record, traLoiBieuMauModel, formSubmiting } = useModel('tienich.bieumau');
	const { danhGiaGiangVienModel, danhSach: dannhSachDanhGia } = useModel('sinhvien.danhgiagiangvien');
	const { setVisibleForm, record: recordDot, getDotMeModel, visibleForm, danhSach } = useModel('tienich.dotkhaosat');
	const { danhSach: danhSachNhanSu } = useModel('daotao.nhansulophocphan');
	const { record: recLopHocPhan } = useModel('daotao.lophocphan');
	const [listLuaChonBang, setListLuaChonBang] = useState<BieuMau.LuaChonBangRecord[][]>([]);
	const [check, setCheck] = useState<boolean>(false);
	const [loadingForm, setLoadingform] = useState<boolean>(false);
	const [form] = Form.useForm();

	const cauTraLoi = dannhSachDanhGia.find((item) => item.giangVienSsoId === giangVienSsoId)?.danhSachTraLoi;

	useEffect(() => {
		if (!visibleForm) {
			resetFieldsForm(form);
			setCheck(false);
		}
	}, [visibleForm]);

	useEffect(() => {
		if (!cauTraLoi) {
			resetFieldsForm(form);
		}
	}, [giangVienSsoId]);

	const renderQuestion = (question: BieuMau.CauHoi, indexKhoi: number, indexCauHoi: number) => {
		let questionEleMent = <div />;
		if (question.loai === 'SingleChoice')
			questionEleMent = (
				<SingleChoice
					question={question}
					indexKhoi={indexKhoi}
					indexCauHoi={indexCauHoi}
					traLoi={cauTraLoi?.find((item) => item?.idCauHoi === question?._id)}
					form={form}
				/>
			);
		else if (question.loai === 'MultipleChoice')
			questionEleMent = (
				<MultipleChoice
					question={question}
					indexKhoi={indexKhoi}
					indexCauHoi={indexCauHoi}
					traLoi={cauTraLoi?.find((item) => item?.idCauHoi === question?._id)}
					form={form}
				/>
			);
		else if (question.loai === 'Text')
			questionEleMent = (
				<Text
					question={question}
					indexKhoi={indexKhoi}
					indexCauHoi={indexCauHoi}
					traLoi={cauTraLoi?.find((item) => item?.idCauHoi === question?._id)}
					form={form}
				/>
			);
		else if (question.loai === 'GridMultipleChoice' || question.loai === 'GridSingleChoice')
			questionEleMent = (
				<GridChoice
					listLuaChonBang={listLuaChonBang}
					setListLuaChonBang={setListLuaChonBang}
					question={question}
					indexKhoi={indexKhoi}
					indexCauHoi={indexCauHoi}
					traLoi={cauTraLoi?.find((item) => item?.idCauHoi === question?._id)}
				/>
			);
		else if (question.loai === 'NumericRange')
			questionEleMent = (
				<NumericChoice
					question={question}
					indexKhoi={indexKhoi}
					indexCauHoi={indexCauHoi}
					traLoi={cauTraLoi?.find((item) => item?.idCauHoi === question?._id)}
					form={form}
				/>
			);
		else if (question.loai === 'UploadFile') {
			questionEleMent = (
				<FileChoice
					question={question}
					indexKhoi={indexKhoi}
					indexCauHoi={indexCauHoi}
					traLoi={cauTraLoi?.find((item) => item?.idCauHoi === question?._id)}
					form={form}
				/>
			);
		}

		return (
			<div key={question._id}>
				<div className='fw500'>
					Câu {indexCauHoi + 1}: {question.noiDungCauHoi}{' '}
					{question.batBuoc ? <span style={{ color: 'red' }}>*</span> : null}
				</div>
				{questionEleMent}
			</div>
		);
	};

	const handleConvertCauTraLoi = async (values: any) => {
		const danhSachTraLoi: BieuMau.TraLoiRecord[] = [];
		record?.danhSachKhoi?.forEach((khoi, indexKhoi) => {
			khoi?.danhSachCauHoi?.forEach(async (cauHoi, indexCauHoi) => {
				let traLoi: BieuMau.TraLoiRecord = {
					idCauHoi: cauHoi._id,
					listLuaChon: [],
					listLuaChonBang: [],
					luaChonTuyenTinh: 0,
					traLoiText: '',
				};
				if (cauHoi.loai === 'UploadFile') {
					const listUrlFile = await buildUpLoadMultiFile(values, `${indexKhoi}||${indexCauHoi}`).then(() => {});
					console.log('lisst', listUrlFile);
					// traLoi = { ...traLoi, listUrlFile: listUrlFile };
				} else if (cauHoi.loai === 'SingleChoice' && values?.[`${indexKhoi}||${indexCauHoi}`])
					traLoi = { ...traLoi, listLuaChon: [values[`${indexKhoi}||${indexCauHoi}`]] };
				else if (cauHoi.loai === 'MultipleChoice' && values?.[`${indexKhoi}||${indexCauHoi}`])
					traLoi = { ...traLoi, listLuaChon: values[`${indexKhoi}||${indexCauHoi}`] };
				else if (cauHoi.loai === 'Text') traLoi = { ...traLoi, traLoiText: values[`${indexKhoi}||${indexCauHoi}`] };
				else if (cauHoi.loai === 'GridMultipleChoice' || cauHoi.loai === 'GridSingleChoice')
					traLoi = {
						...traLoi,
						listLuaChonBang: listLuaChonBang?.[indexKhoi || indexCauHoi] ?? [],
					};
				else if (cauHoi.loai === 'NumericRange') {
					traLoi = { ...traLoi, luaChonTuyenTinh: values[`${indexKhoi}||${indexCauHoi}`] };
				}
				// else if (cauHoi.loai === 'UploadFile') {
				//   const listUrlFile = await buildUpLoadMultiFile(values, `${indexKhoi}||${indexCauHoi}`);
				//   console.log('listUrlFile',listUrlFile)
				//   traLoi = { ...traLoi, listUrlFile:listUrlFile };
				// }
				danhSachTraLoi.push(traLoi);
			});
		});
		return danhSachTraLoi;
	};

	const onFinish = async (values: any) => {
		setLoadingform(true);
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
					if (cauHoi.loai === 'UploadFile') {
						const listUrlFile = await buildUpLoadMultiFile(values, `${indexKhoi}||${indexCauHoi}`);
						traLoi = { ...traLoi, listUrlFile: listUrlFile };
					} else if (cauHoi.loai === 'SingleChoice' && values?.[`${indexKhoi}||${indexCauHoi}`])
						traLoi = { ...traLoi, listLuaChon: [values[`${indexKhoi}||${indexCauHoi}`]] };
					else if (cauHoi.loai === 'MultipleChoice' && values?.[`${indexKhoi}||${indexCauHoi}`])
						traLoi = { ...traLoi, listLuaChon: values[`${indexKhoi}||${indexCauHoi}`] };
					else if (cauHoi.loai === 'Text') traLoi = { ...traLoi, traLoiText: values[`${indexKhoi}||${indexCauHoi}`] };
					else if (cauHoi.loai === 'GridMultipleChoice' || cauHoi.loai === 'GridSingleChoice')
						traLoi = {
							...traLoi,
							listLuaChonBang: listLuaChonBang?.[indexKhoi || indexCauHoi] ?? [],
						};
					else if (cauHoi.loai === 'NumericRange') {
						traLoi = { ...traLoi, luaChonTuyenTinh: values[`${indexKhoi}||${indexCauHoi}`] };
					}
					// else if (cauHoi.loai === 'UploadFile') {
					//   const listUrlFile = await buildUpLoadMultiFile(values, `${indexKhoi}||${indexCauHoi}`);
					//   console.log('listUrlFile',listUrlFile)
					//   traLoi = { ...traLoi, listUrlFile:listUrlFile };
					// }
					danhSachTraLoi.push(traLoi);
				}
			}
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
			await danhGiaGiangVienModel({
				idKhaoSat: record?._id ?? '',
				danhSachTraLoi,
				idDot: recordDot?._id ?? danhSach[0]?._id,
				maLop: isDanhGiaGiangVien ? recLopHocPhan?.maHocPhan : undefined,
				lopHocPhanId: isDanhGiaGiangVien ? recLopHocPhan?._id : undefined,
				giangVienSsoId: isDanhGiaGiangVien ? giangVienSsoId : undefined,
				maGiangVien: isDanhGiaGiangVien
					? danhSachNhanSu.find((item) => item.nhanSuSsoId === giangVienSsoId)?.maNhanSu
					: undefined,
				hoTenGiangVien: isDanhGiaGiangVien
					? danhSachNhanSu.find((item) => item.nhanSuSsoId === giangVienSsoId)?.tenNhanSu
					: undefined,
			})
				.then(() => {
					if (getDanhGiaGiangVien) getDanhGiaGiangVien();
					setLoadingform(false);
				})
				.catch((er) => console.log(er));
		} else {
			await traLoiBieuMauModel({
				idKhaoSat: record?._id ?? '',
				danhSachTraLoi,
				idDot: recordDot?._id ?? danhSach[0]?._id,
			})
				.then(() => {
					getDotMeModel();
					setVisibleForm(false);
					setLoadingform(false);
				})
				.catch((er) => console.log(er));
		}
	};

	return (
		<Card loading={loading} title={isDanhGiaGiangVien ? undefined : 'Chi tiết khảo sát'}>
			<Spin spinning={loadingForm}>
				<Form scrollToFirstError onFinish={onFinish} layout='vertical' form={form}>
					<h3>{record?.tieuDe}</h3>
					<p>{record?.moTa}</p>

					{record?.danhSachKhoi?.map((item, indexKhoi) => (
						// eslint-disable-next-line react/no-array-index-key
						<div key={indexKhoi} style={{ marginBottom: 24 }}>
							<Divider />
							<div className='fw500'>{item.tieuDe}</div>
							<div style={{ marginBottom: 8 }}>{item.moTa}</div>

							{item.danhSachCauHoi?.map((cauHoi, indexCauHoi) => renderQuestion(cauHoi, indexKhoi, indexCauHoi))}
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
							loading={formSubmiting}
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
