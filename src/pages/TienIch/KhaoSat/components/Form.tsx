import ButtonExtend from '@/components/Table/ButtonExtend';
import { type BieuMau } from '@/services/TienIch/KhaoSat/BieuMau/typing';
import { ELoaiCauHoi, ELoaiDot, EVaiTroKhaoSat } from '@/services/TienIch/KhaoSat/constants';
import { handleSingleFile } from '@/services/uploadFile';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Checkbox, Divider, Form, InputNumber, Spin, Steps } from 'antd';
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
	recBieuMauProps?: BieuMau.Record;
	[key: string]: any;

	/** Khảo sát bắt buộc */
	isBatBuoc?: boolean;

	/** Loại đợt khảo sát */
	loai?: ELoaiDot;

	/** Thông tin câu trả lời khảo sát tổng */
	khaoSat?: BieuMau.ICauTraLoiKhaoSat;
}) => {
	const {
		setVisibleForm,
		record: recordDot,
		getDotMeModel,
		visibleForm,
		danhSach,
		isThanhCong,
		setIsThanhCong,
		setDsKhaoSatBatBuoc,
		ngoaiThoiGian,
	} = useModel('tienich.dotkhaosat');
	const {
		loading,
		record: recBieuMau,
		traLoiBieuMauModel,
		formSubmiting: formSubmiting1,
	} = useModel('tienich.bieumau');
	const { record: recSinhVien } = useModel('sinhvien.sinhvien');
	const [form] = Form.useForm();
	const { onOk, cauTraLoi, onCancel, hideCard, isBatBuoc, loai, khaoSat } = props;
	const formSubmiting = props.formSubmiting !== undefined ? props.formSubmiting : formSubmiting1;
	const [check, setCheck] = useState<boolean>(false);
	const record = props?.recBieuMauProps ?? recBieuMau;
	const [currentStep, setCurrentStep] = useState<number>(0);

	const disabled = ngoaiThoiGian || recordDot?.kichHoat === false;

	useEffect(() => {
		if (!isThanhCong) {
			resetFieldsForm(form);
		}
	}, [isThanhCong]);

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
		if (question.loai === ELoaiCauHoi.SINGLE_CHOICE)
			questionEleMent = <SingleChoice form={form} question={question} disabled={disabled} />;
		else if (question.loai === ELoaiCauHoi.MULTIPLE_CHOICE)
			questionEleMent = <MultipleChoice question={question} disabled={disabled} />;
		else if (question.loai === ELoaiCauHoi.TEXT || question.loai === ELoaiCauHoi.RENDER_INPUT)
			questionEleMent = <Text question={question} disabled={disabled} />;
		else if (question.loai === ELoaiCauHoi.GRID_MULTIPLE_CHOICE || question.loai === ELoaiCauHoi.GRID_SINGLE_CHOICE)
			questionEleMent = <GridChoice question={question} form={form} disabled={disabled} />;
		else if (question.loai === ELoaiCauHoi.NUMERIC_RANGE)
			questionEleMent = <NumericChoice question={question} disabled={disabled} />;
		else if (question.loai === ELoaiCauHoi.UPLOAD_FILE)
			questionEleMent = <FileChoice question={question} disabled={disabled} />;

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
				duDoanSoNguoiThamDu: values.duDoanSoNguoiThamDu,
			})
				.then(() => {
					getDotMeModel(loai ?? ELoaiDot.BIEU_MAU).then((res) => {
						if (isBatBuoc) {
							const index = res?.filter((item) => item?.defaultOpenAuth && !item?.daLam);
							setDsKhaoSatBatBuoc(index ?? []);
						}
					});

					if (isBatBuoc) {
						setIsThanhCong(true);
					} else {
						setVisibleForm(false);
					}
				})
				.catch((er) => console.log(er));
		}
	};

	const onChangeStep = (step: number) => {
		setCurrentStep(step);
	};

	const mainContent = (
		<Spin spinning={formSubmiting || loading}>
			<Form scrollToFirstError onFinish={onFinish} layout='vertical' form={form}>
				{recordDot?.loai === ELoaiDot.CUOC_THI && (
					<div style={{ marginBottom: 8 }}>
						<b>
							Số lượt trả lời: {khaoSat?.soLuotDaTraLoi ?? '--'}/{khaoSat?.soLuotTraLoiToiDa ?? '--'}
						</b>
					</div>
				)}

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

				{recordDot?.loai === ELoaiDot.CUOC_THI && (
					<Form.Item
						name='duDoanSoNguoiThamDu'
						rules={[...rules.required]}
						label='Theo bạn, sẽ có bao nhiêu người tham gia cuộc thi này?'
					>
						<InputNumber style={{ width: '100%' }} disabled={disabled} placeholder='Nhập dự đoán' />
					</Form.Item>
				)}

				{record?.coCamKet && (
					<Checkbox
						style={{ marginBottom: 12, marginTop: 12 }}
						onChange={(e) => setCheck(e.target.checked)}
						checked={check}
						disabled={disabled}
					>
						{record?.noiDungCamKet}
					</Checkbox>
				)}

				<div className='form-footer'>
					<ButtonExtend
						disabled={(record?.coCamKet && !check) || disabled}
						loading={formSubmiting}
						htmlType='submit'
						type='primary'
						tooltip={disabled ? 'Ngoài thời gian đợt khảo sát' : undefined}
					>
						Hoàn thành
					</ButtonExtend>

					{!isBatBuoc ? (
						<>
							{!onOk ? <Button onClick={() => setVisibleForm(false)}>Hủy</Button> : null}
							{!!onCancel ? <Button onClick={() => onCancel()}>Hủy</Button> : null}
						</>
					) : null}
				</div>
			</Form>
		</Spin>
	);

	if (hideCard) return mainContent;
	return (
		<Card title='Chi tiết khảo sát'>
			{recordDot?.loai === ELoaiDot.CUOC_THI ? (
				<>
					<Steps
						current={currentStep}
						type='navigation'
						style={{ marginBottom: 18, paddingTop: 0 }}
						onChange={onChangeStep}
					>
						<Steps.Step title='Gới thiệu' />
						<Steps.Step title='Nội dung khảo sát' />
					</Steps>

					{currentStep === 0 ? (
						<div dangerouslySetInnerHTML={{ __html: recordDot?.noiDungGioiThieu ?? '--' }} />
					) : currentStep === 1 ? (
						mainContent
					) : null}
				</>
			) : (
				mainContent
			)}
		</Card>
	);
};

export default FormTraLoiKhaoSat;
