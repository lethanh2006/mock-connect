import FileChoice from '@/pages/TienIch/KhaoSat/components/Question/FileChoice';
import GridChoice from '@/pages/TienIch/KhaoSat/components/Question/GridChoice';
import MultipleChoice from '@/pages/TienIch/KhaoSat/components/Question/MultipleChoice';
import NumericChoice from '@/pages/TienIch/KhaoSat/components/Question/NumericChoice';
import SingleChoice from '@/pages/TienIch/KhaoSat/components/Question/SingleChoice';
import Text from '@/pages/TienIch/KhaoSat/components/Question/Text';
import { getCauTraLoiMeBaiTap } from '@/services/TienIch/KhaoSat/BieuMau';
import { type BieuMau } from '@/services/TienIch/KhaoSat/BieuMau/typing';
import { ELoaiCauHoi } from '@/services/TienIch/KhaoSat/constants';
import { Checkbox, Divider } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

const FormQuiz = (props: any) => {
	const { form } = props;
	const { record, getByIdModel: getBieuMau } = useModel('tienich.bieumau');
	const { record: recBaiTap } = useModel('daotao.baitap');
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

	return (
		<>
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
		</>
	);
};

export default FormQuiz;
