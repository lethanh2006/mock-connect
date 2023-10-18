import { Steps } from 'antd';
import { useModel } from 'umi';
import moment from 'moment';
import { useEffect, useState } from 'react';

const StepDotChamDiemRenLuyen = () => {
	const { record } = useModel('diemrenluyen.dotchamdiem');
	const [step, setStep] = useState(0);
	const steps = [
		{
			thoiGian: record?.thoiGianSVChamDiem?.thoiGianBatDau,
			title: 'Sinh viên đánh giá',
		},
		{ thoiGian: record?.thoiGianCanSuLopChamDiem?.thoiGianBatDau, title: 'Tập thể lớp đánh giá' },
		{ thoiGian: record?.thoiGianCVHTChamDiem?.thoiGianBatDau, title: 'CVHT đánh giá' },
		{ thoiGian: record?.thoiGianCVHTChamDiem?.thoiGianKetThuc, title: 'Kết thúc đánh giá' },
	];

	useEffect(() => {
		let s = -1;
		steps.some((item) => {
			if (moment().isBefore(item.thoiGian)) return true;
			s++;
			return false;
		});
		setStep(s);
	}, [record?._id]);

	if (record)
		return (
			<Steps progressDot current={step}>
				{steps.map((item) => (
					<Steps.Step
						description={item.title}
						title={<b>{moment(item.thoiGian).format('HH:mm DD/MM/YYYY')}</b>}
						key={item.title}
					/>
				))}
			</Steps>
		);
	return <></>;
};

export default StepDotChamDiemRenLuyen;
