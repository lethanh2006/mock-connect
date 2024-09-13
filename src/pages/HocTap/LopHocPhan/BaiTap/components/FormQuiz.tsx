import FileChoice from '@/pages/TienIch/KhaoSat/components/Question/FileChoice';
import GridChoice from '@/pages/TienIch/KhaoSat/components/Question/GridChoice';
import MultipleChoice from '@/pages/TienIch/KhaoSat/components/Question/MultipleChoice';
import NumericChoice from '@/pages/TienIch/KhaoSat/components/Question/NumericChoice';
import SingleChoice from '@/pages/TienIch/KhaoSat/components/Question/SingleChoice';
import Text from '@/pages/TienIch/KhaoSat/components/Question/Text';
import { ETrangThaiNopBaiTap } from '@/services/DaoTao/BaiTap/constants';
import { type BieuMau } from '@/services/TienIch/KhaoSat/BieuMau/typing';
import { ELoaiCauHoi } from '@/services/TienIch/KhaoSat/constants';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Checkbox, Divider } from 'antd';
import { useState } from 'react';
import { useModel } from 'umi';

const FormQuiz = (props: any) => {
	const { form, cauTraLoi } = props;
	const { record } = useModel('tienich.bieumau');
	const { record: recBaiTap } = useModel('daotao.baitap');
	const [check, setCheck] = useState<boolean>(false);

	const renderQuestion = (question: BieuMau.CauHoi, index: number) => {
		let questionEleMent = <div />;
		if (question.loai === ELoaiCauHoi.SINGLE_CHOICE)
			questionEleMent = (
				<SingleChoice form={form} question={question} disabled={recBaiTap?.trangThai === ETrangThaiNopBaiTap.DA_NOP} />
			);
		else if (question.loai === ELoaiCauHoi.MULTIPLE_CHOICE)
			questionEleMent = (
				<MultipleChoice question={question} disabled={recBaiTap?.trangThai === ETrangThaiNopBaiTap.DA_NOP} />
			);
		else if (question.loai === ELoaiCauHoi.TEXT)
			questionEleMent = <Text question={question} disabled={recBaiTap?.trangThai === ETrangThaiNopBaiTap.DA_NOP} />;
		else if (question.loai === ELoaiCauHoi.GRID_MULTIPLE_CHOICE || question.loai === ELoaiCauHoi.GRID_SINGLE_CHOICE)
			questionEleMent = (
				<GridChoice question={question} form={form} disabled={recBaiTap?.trangThai === ETrangThaiNopBaiTap.DA_NOP} />
			);
		else if (question.loai === ELoaiCauHoi.NUMERIC_RANGE)
			questionEleMent = (
				<NumericChoice question={question} disabled={recBaiTap?.trangThai === ETrangThaiNopBaiTap.DA_NOP} />
			);
		else if (question.loai === ELoaiCauHoi.UPLOAD_FILE)
			questionEleMent = (
				<FileChoice question={question} disabled={recBaiTap?.trangThai === ETrangThaiNopBaiTap.DA_NOP} />
			);

		return (
			<div key={question._id} style={{ marginBottom: 12 }}>
				<div
					className='fw500'
					style={
						recBaiTap?.assignment?.congBoDapAnDungSauNop
							? { color: cauTraLoi?.find((item: any) => item?.idCauHoi === question?._id)?.correct ? 'green' : 'red' }
							: undefined
					}
				>
					<u>Câu {index + 1}:</u> {question.noiDungCauHoi}{' '}
					{question.batBuoc ? <span style={{ color: 'red' }}>*</span> : null}{' '}
					{question.diem ? <span>({question.diem} điểm)</span> : null}{' '}
					{recBaiTap?.assignment?.congBoDapAnDungSauNop ? (
						cauTraLoi?.find((item: any) => item?.idCauHoi === question?._id)?.correct ? (
							<CheckOutlined />
						) : (
							<CloseOutlined />
						)
					) : null}
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
