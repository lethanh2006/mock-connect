import { resetFieldsForm } from '@/utils/utils';
import { ReloadOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, Row } from 'antd';
import { useModel } from 'umi';

const TimKiemCoBan = () => {
	const [form] = Form.useForm();
	const { setCondition } = useModel('thuvien.anpham');

	const onFinish = async (values: any) => {
		const fieldMap: Record<string, { tag: string; code: string }> = {
			nhanDe: { tag: '245', code: '$a' },
			tacGia: { tag: '100', code: '$a' },
			namXuatBan: { tag: '260', code: '$c' },
			nhaXuatBan: { tag: '260', code: '$f' },
			tuKhoa: { tag: '222', code: '$a' },
			kyHieuPhanLoai: { tag: '084', code: '$a' },
		};

		const danhSachFilter = Object.entries(values)
			.filter(([_, value]) => value)
			.map(([field, value]) => {
				const mapping = fieldMap[field];
				if (mapping) {
					return {
						tag: mapping.tag,
						code: mapping.code,
						value: value,
					};
				}
				return null;
			})
			.filter(Boolean);

		if (danhSachFilter.length > 0) {
			setCondition({ danhSachFilter });
		} else {
			setCondition(undefined);
		}
	};

	return (
		<Form onFinish={onFinish} form={form} layout='vertical'>
			<Row gutter={[12, 0]}>
				<Col span={24} md={8}>
					<Form.Item name='nhanDe'>
						<Input placeholder='Nhan đề' />
					</Form.Item>
				</Col>
				<Col span={24} md={8}>
					<Form.Item name='tacGia'>
						<Input placeholder='Tác giả' />
					</Form.Item>
				</Col>
				<Col span={24} md={8}>
					<Form.Item name='namXuatBan'>
						<Input placeholder='Năm xuất bản' />
					</Form.Item>
				</Col>
				<Col span={24} md={8}>
					<Form.Item name='nhaXuatBan'>
						<Input placeholder='Nhà xuất bản' />
					</Form.Item>
				</Col>
				<Col span={24} md={8}>
					<Form.Item name='tuKhoa'>
						<Input placeholder='Từ khóa' />
					</Form.Item>
				</Col>
				<Col span={24} md={8}>
					<Form.Item name='kyHieuPhanLoai'>
						<Input placeholder='Ký hiệu phân loại' />
					</Form.Item>
				</Col>
			</Row>

			<div className='form-footer'>
				<Button htmlType='submit' type='primary'>
					Tìm kiếm
				</Button>
				<Button icon={<ReloadOutlined />} onClick={() => resetFieldsForm(form)}>
					Làm mới
				</Button>
			</div>
		</Form>
	);
};

export default TimKiemCoBan;
