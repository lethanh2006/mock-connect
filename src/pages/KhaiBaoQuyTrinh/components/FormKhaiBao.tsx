import { Button, Col, Form, Row, Spin } from 'antd';
import SelectQuyTrinh from '../QuyTrinh/Select';
import { history } from 'umi';
import { createDonKhaiBaoUser } from '@/services/KhaiBaoQuyTrinh/khaibaoquytrinh';
import SelectDotQuyTrinh from '@/pages/KhaiBaoQuyTrinh/DotQuyTrinh/Select';
import { SetStateAction, useState } from 'react';
import { useModel } from '@@/plugin-model/useModel';

const FormKhaiBao = (props: { quyTrinhId?: string }) => {
	const { setVisibleForm } = useModel('quytrinh.khaibaoquytrinh');
	const [loading, setLoading] = useState<boolean>(false);
	const [currentQuyTrinh, setCurrentQuyTrinh] = useState<string>();
	const onFinish = async (values: any) => {
		try {
			setLoading(true);
			const res = await createDonKhaiBaoUser(values?.quyTrinhId, values?.dotQuyTrinhId);
			if (res) {
				setVisibleForm(false);
				history.push(`/khai-bao-quy-trinh/${res?.data?.data?._id}`);
			}
		} catch (e) {
			console.log(e);
		} finally {
			setLoading(false);
		}
	};
	return (
		// <Card title={'Thêm mới'}>
			<Spin spinning={loading}>
				<Form onFinish={onFinish} layout={'vertical'}>
					<Row gutter={16}>
						<Col span={24}>
							<Form.Item name={'quyTrinhId'} label={'Quy trình'} initialValue={props?.quyTrinhId}>
								<SelectQuyTrinh
                  disabled={props?.quyTrinhId}
									onChange={(value: SetStateAction<string | undefined>) => {
										setCurrentQuyTrinh(value);
									}}
								/>
							</Form.Item>
						</Col>
						<Col span={24}>
							<Form.Item name={'dotQuyTrinhId'} label={'Đợt khai báo'}>
								<SelectDotQuyTrinh loadData={false}  initQuery={{ quyTrinhId: props?.quyTrinhId }} />
							</Form.Item>
						</Col>
						<Col span={24}>
							<Form.Item>
								<div style={{ display: 'flex', justifyContent: 'center' }}>
									<Button style={{ marginRight: 8 }} type={'primary'} htmlType={'submit'}>
										Tạo
									</Button>
									<Button onClick={() => setVisibleForm(false)}>Huỷ</Button>
								</div>
							</Form.Item>
						</Col>
					</Row>
				</Form>
			</Spin>
		// </Card>
	);
};
export default FormKhaiBao;
