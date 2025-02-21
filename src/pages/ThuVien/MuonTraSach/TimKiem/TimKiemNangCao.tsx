import { Button, Col, Form, Input, Row, Select } from 'antd';
import { useModel } from 'umi';

const danhSach = [
	{
		value: 'nhanDe',
		ten: 'Nhan đề',
	},
	{
		value: 'tacGia',
		ten: 'Tác giả',
	},
	{
		value: 'namXuatBan',
		ten: 'Năm xuất bản',
	},
	{
		value: 'nhaXuatBan',
		ten: 'Nhà xuất bản',
	},
	{
		value: 'tuKhoa',
		ten: 'Từ khóa',
	},
	{
		value: 'kyHieuPhanLoai',
		ten: 'Ký hiệu phân loại',
	},
];

const TimKiemNangCao = () => {
	const [form] = Form.useForm();
	const { setCondition } = useModel('thuvien.anpham');

	const onFinish = async (values: any) => {
		const danhSachMapping: any = {
			nhanDe: { tag: '245', code: '$a' },
			tacGia: { tag: '100', code: '$a' },
			namXuatBan: { tag: '260', code: '$c' },
			nhaXuatBan: { tag: '260', code: '$f' },
			tuKhoa: { tag: '222', code: '$a' },
			kyHieuPhanLoai: { tag: '084', code: '$a' },
		};

		const filters = Object.keys(values)
			.map((key) => values[key])
			.filter((item) => item.keyword)
			.map((item) => {
				const fieldMapping = danhSachMapping[item.field];
				return {
					tag: fieldMapping.tag,
					code: fieldMapping.code,
					value: item.keyword,
					// operator: item.operator || 'and',
				};
			});

		if (filters.length > 0) {
			setCondition({ danhSachFilter: filters });
		} else {
			setCondition(undefined);
		}
	};

	return (
		<Form onFinish={onFinish} form={form} layout='vertical'>
			<Row gutter={[12, 0]}>
				{[1, 2, 3, 4].map((index) => (
					<Col span={24} key={index}>
						<Row gutter={[12, 0]}>
							<Col span={24} md={5}>
								<Form.Item name={[`${index}`, 'field']} initialValue={danhSach[0].value}>
									<Select
										placeholder='Chọn trường'
										options={danhSach.map((item) => ({
											value: item.value,
											label: item.ten,
										}))}
									/>
								</Form.Item>
							</Col>
							<Col span={24} md={19}>
								<Form.Item name={[`${index}`, 'keyword']}>
									<Input placeholder='Nhập từ khóa' />
								</Form.Item>
							</Col>
							{/* <Col span={24} md={5}>
								<Form.Item name={[`${index}`, 'operator']} initialValue='and'>
									<Select
										placeholder='Chọn toán tử'
										options={[
											{ value: 'and', label: 'AND' },
											{ value: 'or', label: 'OR' },
											{ value: 'not', label: 'NOT' },
										]}
									/>
								</Form.Item>
							</Col> */}
						</Row>
					</Col>
				))}
			</Row>

			<div className='form-footer'>
				<Button htmlType='submit' type='primary'>
					Tìm kiếm
				</Button>
			</div>
		</Form>
	);
};

export default TimKiemNangCao;
