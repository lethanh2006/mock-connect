import ModalExpandable from '@/components/Table/ModalExpandable';
import { Button, Form, Steps } from 'antd';
import { useState } from 'react';
import { useIntl, useModel } from 'umi';
import FormDangKyKTX from './Form';
import FormChinhSachKTX from './FormChinhSach';

const ModalDanKyKTX = () => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const { visibleDangKy, setVisibleDangKy } = useModel('kytucxa.phong');
	const { record: recSinhVien } = useModel('sinhvien.sinhvien');
	const [currentStep, setCurrentStep] = useState<number>(0);
	const onChangeStep = (step: number) => {
		setCurrentStep(step);
	};
	const checkbox1: boolean = Form.useWatch('checkbox1', form);
	const checkbox2: boolean = Form.useWatch('checkbox2', form);

	// useEffect(() => {
	// 	if(visibleDangKy)
	// }, [visibleDangKy]);

	const onFinish = async (values: any) => {
		try {
		} catch (e) {
			console.log(e);
		}
	};

	return (
		<ModalExpandable
			open={visibleDangKy}
			onCancel={() => setVisibleDangKy(false)}
			footer={null}
			width={1000}
			title='Dormitory Detail'
		>
			<Form layout='vertical' onFinish={onFinish} form={form}>
				<Steps current={currentStep} onChange={onChangeStep} style={{ marginBottom: 18 }}>
					<Steps.Step title='Thông tin chung' />
					<Steps.Step title='Student Liability Release and Waiver' />
				</Steps>

				{currentStep === 0 ? <FormDangKyKTX form={form} /> : <FormChinhSachKTX form={form} />}

				<div className='form-footer'>
					{currentStep === 0 ? (
						<>
							<Button disabled={!checkbox1} type='primary' onClick={() => setCurrentStep(1)}>
								Next
							</Button>

							<Button onClick={() => setVisibleDangKy(false)}>
								{intl.formatMessage({ id: 'activity.outcome.close' })}
							</Button>
						</>
					) : (
						<>
							<Button disabled={!checkbox2} htmlType='submit' type='primary'>
								Submit
							</Button>

							<Button onClick={() => setVisibleDangKy(false)}>Previous</Button>
						</>
					)}
				</div>
			</Form>
		</ModalExpandable>
	);
};

export default ModalDanKyKTX;
