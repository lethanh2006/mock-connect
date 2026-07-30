import { getTruongThptTheoTinh } from '@/services/Core/TruongThpt';
import rules from '@/utils/rules';
import { Col, Form, Input, Row, Select, type FormInstance } from 'antd';
import { useEffect, useState } from 'react';

/** Cascading Tỉnh/TP + Trường THPT select, dùng cho khối "Thông tin học tập THPT" của form nhập học */
const SelectTruongThpt = (props: {
	form: FormInstance<any>;
	suffix?: string;
	listTinh?: TruongThpt.ITinhTP[];
	labelTinh?: string;
	placeholderTinh?: string;
	labelTruong?: string;
	placeholderTruong?: string;
}) => {
	const { form, suffix = '', listTinh, labelTinh, placeholderTinh, labelTruong, placeholderTruong } = props;
	const [listTruong, setListTruong] = useState<TruongThpt.IRecord[]>([]);

	const provinceCode = Form.useWatch(`maTinhTpTruong${suffix}`, form);
	const schoolCode = Form.useWatch(`hsSchoolCode${suffix}`, form);

	useEffect(() => {
		if (!provinceCode) {
			setListTruong([]);
			return;
		}

		let isCurrentProvince = true;
		getTruongThptTheoTinh(provinceCode)
			.then((res) => {
				if (isCurrentProvince) setListTruong(res.data.data);
			})
			.catch(() => {
				if (isCurrentProvince) setListTruong([]);
			});

		return () => {
			isCurrentProvince = false;
		};
	}, [provinceCode]);

	const onChangeProvince = (provinceName?: string) => {
		const provinceCode = listTinh?.find((item) => item.tenTinhTP === provinceName)?.maTinhTP;
		form.setFieldsValue({
			[`maTinhTpTruong${suffix}`]: provinceCode,
			[`hsName${suffix}`]: undefined,
			[`hsSchoolCode${suffix}`]: undefined,
		});
	};

	const onChangeSchool = (_: string, opt: any) => {
		form.setFieldsValue({ [`hsSchoolCode${suffix}`]: opt?.key });
	};

	return (
		<Row gutter={[12, 0]}>
			<Col span={24} md={12}>
				<Form.Item name={`tinhTpTruong${suffix}`} label={labelTinh ?? 'Province/City'} rules={[...rules.required]}>
					<Select
						placeholder={placeholderTinh ?? 'Enter content'}
						options={listTinh?.map((item) => ({ key: item.maTinhTP, value: item.tenTinhTP, label: item.tenTinhTP }))}
						allowClear
						showSearch
						optionFilterProp='label'
						onChange={onChangeProvince}
					/>
				</Form.Item>
				<Form.Item name={`maTinhTpTruong${suffix}`} noStyle>
					<Input type='hidden' />
				</Form.Item>
			</Col>
			<Col span={24} md={12}>
				<Form.Item name={`hsName${suffix}`} label={labelTruong ?? 'High School Name'} rules={[...rules.required]}>
					<Select
						placeholder={placeholderTruong ?? 'Enter content'}
						options={listTruong?.map((item) => ({ key: item.maTruong, value: item.tenTruong, label: item.tenTruong }))}
						allowClear
						showSearch
						optionFilterProp='label'
						notFoundContent={!provinceCode ? 'Select a province first' : undefined}
						onChange={onChangeSchool}
					/>
				</Form.Item>
				<Form.Item name={`hsSchoolCode${suffix}`} noStyle>
					<Input type='hidden' />
				</Form.Item>
			</Col>
			<Col span={24} md={12}>
				<Form.Item label='Province Code' required>
					<Input disabled value={provinceCode} placeholder='Enter content' />
				</Form.Item>
			</Col>
			<Col span={24} md={12}>
				<Form.Item label='School Code' required>
					<Input disabled value={schoolCode} placeholder='Enter content' />
				</Form.Item>
			</Col>
		</Row>
	);
};

export default SelectTruongThpt;
