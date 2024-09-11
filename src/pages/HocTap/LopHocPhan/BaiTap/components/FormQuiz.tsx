import FileChoice from '@/pages/TienIch/KhaoSat/components/Question/FileChoice';
import GridChoice from '@/pages/TienIch/KhaoSat/components/Question/GridChoice';
import MultipleChoice from '@/pages/TienIch/KhaoSat/components/Question/MultipleChoice';
import NumericChoice from '@/pages/TienIch/KhaoSat/components/Question/NumericChoice';
import SingleChoice from '@/pages/TienIch/KhaoSat/components/Question/SingleChoice';
import Text from '@/pages/TienIch/KhaoSat/components/Question/Text';
import { getCauTraLoiMeBaiTap } from '@/services/TienIch/KhaoSat/BieuMau';
import { type BieuMau } from '@/services/TienIch/KhaoSat/BieuMau/typing';
import { ELoaiCauHoi, EVaiTroKhaoSat } from '@/services/TienIch/KhaoSat/constants';
import { handleSingleFile } from '@/services/uploadFile';
import { Checkbox, Divider, Form, Spin } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

const FormQuiz = (props: any) => {
	const { getData } = props;
	const { record, traLoiBieuMauModel, formSubmiting, getByIdModel: getBieuMau } = useModel('tienich.bieumau');
	const { record: recSinhVien } = useModel('sinhvien.sinhvien');
	const { record: recBaiTap, setVisibleForm, sinhVienNopBaiTapModal } = useModel('daotao.baitap');
	const [form] = Form.useForm();
	const [check, setCheck] = useState<boolean>(false);
	const [cauTraLoi, setCauTraLoi] = useState<BieuMau.TraLoiRecord>();

	useEffect(() => {
		getBieuMau(recBaiTap?.assignment?.khaoSatId ?? '');
		if (recBaiTap?.cauTraLoiId) {
			getCauTraLoiMeBaiTap(recBaiTap?.cauTraLoiId).then((res) => setCauTraLoi(res?.data?.data));
		}
	}, [recBaiTap?._id]);

	useEffect(() => {
		if (cauTraLoi?._id) {
			const values: any = {};
			record?.danhSachKhoi?.map((khoi) => {
				khoi.danhSachCauHoi?.map((question) => {
					if (question.loai === ELoaiCauHoi.SINGLE_CHOICE) {
						if (cauTraLoi && cauTraLoi.traLoiKhac) {
							values[question._id] = 'traLoiKhac';
							values[`${question._id}_otherAnswer`] = cauTraLoi.traLoiKhac;
						} else {
							values[question._id] = cauTraLoi?.listLuaChon?.[0];
						}
					} else if (
						question.loai === ELoaiCauHoi.GRID_MULTIPLE_CHOICE ||
						question.loai === ELoaiCauHoi.GRID_SINGLE_CHOICE
					) {
						values[question._id] = {};
						cauTraLoi?.listLuaChonBang?.forEach((item) => {
							const idHang = item.idHang;
							const idCot = item.idCot;
							if (!values[question._id][idHang]) values[question._id][idHang] = {};
							values[question._id][idHang][idCot] = true;
						});
					} else values[question._id] = cauTraLoi;
				});
			});
			form.resetFields();
			form.setFieldsValue(values);
		}
	}, [cauTraLoi?._id]);

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

		await traLoiBieuMauModel({
			idKhaoSat: record?._id ?? '',
			danhSachTraLoi,
			idDot: '',
			vaiTroNguoiKhaoSat: EVaiTroKhaoSat.SINH_VIEN,
			trangThaiSinhVien: recSinhVien?.trangThaiHoc,
			danToc: recSinhVien?.danToc,
			gioiTinh: recSinhVien?.gioiTinh,
		})
			.then((res) => {
				if (res) {
					const data = {
						...recBaiTap,
						cauTraLoiId: res?._id,
						thoiGianTraLoi: moment(),
						mode: 'save',
					};
					sinhVienNopBaiTapModal(data as any, getData);
				}
				setVisibleForm(false);
			})
			.catch((er) => console.log(er));
	};

	return (
		<Spin spinning={formSubmiting}>
			<Form scrollToFirstError onFinish={onFinish} layout='vertical' form={form}>
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
			</Form>
		</Spin>
	);
};

export default FormQuiz;
