import dayjs from '@/utils/dayjs';
import { formatDateTime } from '@/utils/formatDate';
import { Steps } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';

const StepDotChamDiemRenLuyen = () => {
	const { record } = useModel('diemrenluyen.dotchamdiem');
  const intl = useIntl();
	const [step, setStep] = useState(0);
	const steps = [
		{
			thoiGian: record?.thoiGianSVChamDiem?.thoiGianBatDau,
			title: intl.formatMessage({ id: 'diemrenluyen.phieudiem.svtudanhgia' }),
		},
		{ thoiGian: record?.thoiGianCanSuLopChamDiem?.thoiGianBatDau, title: intl.formatMessage({ id: 'diemrenluyen.dotchamdiem.tapthelopdanhgia' }) },
		{ thoiGian: record?.thoiGianCVHTChamDiem?.thoiGianBatDau, title: intl.formatMessage({ id: 'diemrenluyen.dotchamdiem.cvhtdanhgia' }) },
		{ thoiGian: record?.thoiGianCVHTChamDiem?.thoiGianKetThuc, title: intl.formatMessage({ id: 'diemrenluyen.dotchamdiem.ketthucdanhgia' }) },
	];

	useEffect(() => {
		let s = -1;
		steps.some((item) => {
			if (dayjs().isBefore(item.thoiGian)) return true;
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
						title={<b>{formatDateTime(item.thoiGian)}</b>}
						key={item.title}
					/>
				))}
			</Steps>
		);
	return <></>;
};

export default StepDotChamDiemRenLuyen;
