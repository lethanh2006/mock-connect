import { EOperatorType } from '@/components/Table/constant';
import { SearchOutlined } from '@ant-design/icons';
import { Button, Card, Collapse, Form, Input, Space } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import { sanitizeObject } from '@/utils/utils';
const { Panel } = Collapse;

const CauHoiThuongGap = () => {
	const intl = useIntl();
	const { getAllModel, danhSach, filters, setFilters } = useModel('tienich.cauhoithuonggap');
	const [form] = Form.useForm();

	useEffect(() => {
		getAllModel(false, undefined, undefined, filters);
	}, [filters]);

	const onFinish = (values: any) => {
		setFilters([{ active: true, field: 'cauHoi', values: [values.cauHoi], operator: EOperatorType.CONTAIN }]);
	};

	return (
		<Card
			title={intl.formatMessage({ id: 'cauhoithuonggap.title' })}
			className='card-big-title card-borderless'
			variant='borderless'
		>
			<Card variant='borderless'>
				<Space wrap style={{ width: '100%', justifyContent: 'space-between', marginBottom: 12 }}>
					<Form form={form} onFinish={onFinish} layout='inline'>
						<Form.Item name='cauHoi'>
							<Input placeholder={intl.formatMessage({ id: 'cauhoithuonggap.timkiem.place' })} allowClear />
						</Form.Item>
						<Button icon={<SearchOutlined />} htmlType='submit' type='primary'>
							{intl.formatMessage({ id: 'cauhoithuonggap.timkiem' })}
						</Button>
					</Form>

					<h4 style={{ display: 'inline-block' }}>
						{intl.formatMessage({ id: 'cauhoithuonggap.tongso' })}:
						<Input
							style={{
								width: 70,
								fontWeight: 700,
								fontSize: 16,
								marginLeft: 10,
								color: '#007eb9',
							}}
							value={danhSach.length}
							readOnly
							// ref={this.setTableBaseRef}
						/>
					</h4>
				</Space>

				<Collapse>
					{danhSach.map((item) => (
						<Panel header={item.cauHoi} key={item._id}>
							<p style={{ paddingLeft: 24 }}>
								<div dangerouslySetInnerHTML={{ __html: sanitizeObject(item.cauTraLoi ?? '') }} />
							</p>
						</Panel>
					))}
				</Collapse>
			</Card>
		</Card>
	);
};

export default CauHoiThuongGap;
