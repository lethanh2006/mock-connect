import { getTruongThptTheoTinh } from '@/services/Core/TruongThpt';
import { DANH_SACH_TRUONG_THPT } from '@/services/Core/TruongThpt/truongThpt';
import rules from '@/utils/rules';
import { Col, Form, Input, Row, Select, type FormInstance } from 'antd';
import { useEffect, useMemo, useState } from 'react';

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
				if (isCurrentProvince) setListTruong(res.data.data ?? []);
			})
			.catch(() => {
				if (isCurrentProvince) setListTruong([]);
			});

		return () => {
			isCurrentProvince = false;
		};
	}, [provinceCode]);

	const fallbackSchools = useMemo(
		() =>
			provinceCode
				? DANH_SACH_TRUONG_THPT.filter((item) => item.maTinhTP === provinceCode)
				: DANH_SACH_TRUONG_THPT,
		[provinceCode],
	);

	const schools = listTruong.length ? listTruong : fallbackSchools;

	const selectedSchoolId = useMemo(
		() =>
			(listTruong.length
				? listTruong.find((item) => item.maTruong === schoolCode)
				: DANH_SACH_TRUONG_THPT.find(
						(item) => item.maTruong === schoolCode && (!provinceCode || item.maTinhTP === provinceCode),
					)
			)?._id,
		[listTruong, provinceCode, schoolCode],
	);

	const onChangeProvince = (provinceName?: string) => {
		const nextProvinceCode = listTinh?.find((item) => item.tenTinhTP === provinceName)?.maTinhTP;
		form.setFieldsValue({
			[`maTinhTpTruong${suffix}`]: nextProvinceCode,
			[`hsName${suffix}`]: undefined,
			[`hsSchoolCode${suffix}`]: undefined,
		});
	};

	const onChangeSchool = (schoolId?: string) => {
		const school =
			schools.find((item) => item._id === schoolId) ?? DANH_SACH_TRUONG_THPT.find((item) => item._id === schoolId);
		const province = listTinh?.find((item) => item.maTinhTP === school?.maTinhTP);
		form.setFieldsValue({
			[`hsName${suffix}`]: school?.tenTruong,
			[`hsSchoolCode${suffix}`]: school?.maTruong,
			...(school
				? {
						[`maTinhTpTruong${suffix}`]: school.maTinhTP,
						[`tinhTpTruong${suffix}`]: province?.tenTinhTP ?? school.tenTinhTP,
					}
				: {}),
		});
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
				<Form.Item name={`hsName${suffix}`} hidden rules={[...rules.required]}>
					<Input />
				</Form.Item>
				<Form.Item label={labelTruong ?? 'High School Name'} required>
					<Select
						placeholder={placeholderTruong ?? 'Enter content'}
						value={selectedSchoolId}
						options={schools.map((item) => ({
							value: item._id,
							label: `${item.tenTruong} (${item.tenTinhTP})`,
						}))}
						allowClear
						showSearch
						optionFilterProp='label'
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
