import ModalExpandable from '@/components/Table/ModalExpandable';
import { Steps } from 'antd';
import { useState } from 'react';
import { useModel } from 'umi';

const FormDangKyKTX = () => {
	const { visibleDangKy, setVisibleDangKy } = useModel('kytucxa.phong');

	const [currentStep, setCurrentStep] = useState<number>(0);

	const onChangeStep = (step: number) => {
		setCurrentStep(step);
	};

	return (
		<ModalExpandable
			open={visibleDangKy}
			onCancel={() => setVisibleDangKy(false)}
			footer={null}
			width={1000}
			title='Dormitory Detail'
		>
			<Steps current={currentStep} onChange={onChangeStep} style={{ marginBottom: 18 }}>
				<Steps.Step title='Thông tin chung' />
				<Steps.Step title='Student Liability Release and Waiver' />
			</Steps>
		</ModalExpandable>
	);
};

export default FormDangKyKTX;
