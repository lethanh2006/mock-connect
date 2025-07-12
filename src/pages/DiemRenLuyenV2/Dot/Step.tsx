import { Steps } from 'antd';
import { useModel } from 'umi';
import moment from 'moment';
import { useEffect, useState } from 'react';

const StepDotChamDiemRenLuyen = () => {
	const { record } = useModel('diemrenluyenv2.dot');
	const [step, setStep] = useState(0);
	const steps = [
		{
			thoiGian: record?.thoiGianTiepNhanMinhChung?.thoiGianBatDau,
			thoiGianKetThuc: record?.thoiGianTiepNhanMinhChung?.thoiGianKetThuc,
			title: 'Cập nhật, duyệt minh chứng',
		},
		{
			thoiGian: record?.thoiGianSVChamDiem?.thoiGianBatDau,
			thoiGianKetThuc: record?.thoiGianSVChamDiem?.thoiGianKetThuc,
			title: 'Sinh viên đánh giá',
		},
    {
      thoiGian: record?.thoiGianBCSChamDiem?.thoiGianBatDau,
      thoiGianKetThuc: record?.thoiGianBCSChamDiem?.thoiGianKetThuc,
      title: 'Ban cán sự đánh giá',
    },
		{
			thoiGian: record?.thoiGianCoVanChamDiem?.thoiGianBatDau,
			thoiGianKetThuc: record?.thoiGianCoVanChamDiem?.thoiGianKetThuc,
			title: 'Chủ nhiệm lớp xác nhận',
		},
		// {
		// 	thoiGian: record?.thoiGianKhoaChamDiem?.thoiGianBatDau,
		// 	thoiGianKetThuc: record?.thoiGianKhoaChamDiem?.thoiGianKetThuc,
		// 	title: 'Khoa đánh giá',
		// },
		// {
		// 	thoiGian: record?.thoiGianPhongCTSVChamDiem?.thoiGianBatDau,
		// 	thoiGianKetThuc: record?.thoiGianPhongCTSVChamDiem?.thoiGianKetThuc,
		// 	title: 'Phòng CTSV đánh giá',
		// },
		// { thoiGian: record?.thoiGianCVHTChamDiem?.thoiGianKetThuc, title: 'Kết thúc đánh giá' },
	];

	useEffect(() => {
		let s = -1;
		steps.some((item) => {
			if (moment().isBefore(item.thoiGian)) return true;
			s++;
			return false;
		});
		setStep(s);
	}, [record]);

	if (record)
		return (
			<Steps progressDot current={step} style={{ marginBottom: 12 }}>
				{steps.map((item) => (
					<Steps.Step
						description={item.title}
						title={
							<b style={{ fontSize: 13 }}>
								{moment(item.thoiGian).format('HH:mm DD/MM/YYYY')}
								{item?.thoiGianKetThuc ? ` - ${moment(item.thoiGianKetThuc).format('HH:mm DD/MM/YYYY')}` : ''}
							</b>
						}
						key={item.title}
					/>
				))}
			</Steps>
		);
	return <></>;
};

export default StepDotChamDiemRenLuyen;
