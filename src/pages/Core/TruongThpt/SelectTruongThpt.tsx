import { DANH_SACH_TRUONG_THPT } from '@/services/Core/TruongThpt/truongThpt';
import rules from '@/utils/rules';
import { AutoComplete, Col, Form, Input, Row, Select, type FormInstance } from 'antd';
import { useMemo } from 'react';

const normalizeSearchText = (value?: string) =>
	(value ?? '')
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase()
		.trim();

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

	const provinceCode = Form.useWatch(`maTinhTpTruong${suffix}`, form);
	const schoolCode = Form.useWatch(`hsSchoolCode${suffix}`, form);
	const schoolName = Form.useWatch(`hsName${suffix}`, form);

	const schools = useMemo(() => {
		if (!provinceCode) return DANH_SACH_TRUONG_THPT;
		const inProvince = DANH_SACH_TRUONG_THPT.filter((item) => item.maTinhTP === provinceCode);
		const outProvince = DANH_SACH_TRUONG_THPT.filter((item) => item.maTinhTP !== provinceCode);
		return [...inProvince, ...outProvince];
	}, [provinceCode]);

	const dedupedSchools = useMemo(() => {
		const seen = new Set<string>();
		return schools.filter((item) => {
			const key = `${item.maTinhTP}__${normalizeSearchText(item.tenTruong)}`;
			if (seen.has(key)) return false;
			seen.add(key);
			return true;
		});
	}, [schools]);

	const provinceSchools = useMemo(
		() => (provinceCode ? dedupedSchools.filter((item) => item.maTinhTP === provinceCode) : dedupedSchools),
		[dedupedSchools, provinceCode],
	);

	const schoolOptions = useMemo(
		() =>
			provinceSchools.map((item) => ({
				value: item.tenTruong,
				label: `${item.tenTruong} (${item.tenTinhTP})`,
			})),
		[provinceSchools],
	);

	const onChangeProvince = (provinceName?: string) => {
		const nextProvinceCode = listTinh?.find((item) => item.tenTinhTP === provinceName)?.maTinhTP;
		form.setFieldsValue({
			[`maTinhTpTruong${suffix}`]: nextProvinceCode,
			[`hsName${suffix}`]: undefined,
			[`hsSchoolCode${suffix}`]: undefined,
		});
	};

	const onChangeSchoolName = (value?: string) => {
		const nextSchoolName = value ?? '';
		const normalizedSchoolName = normalizeSearchText(nextSchoolName);
		if (!normalizedSchoolName) {
			form.setFieldsValue({
				[`hsName${suffix}`]: undefined,
				[`hsSchoolCode${suffix}`]: undefined,
			});
			return;
		}

		const school =
			dedupedSchools.find(
				(item) =>
					normalizeSearchText(item.tenTruong) === normalizedSchoolName &&
					(!provinceCode || item.maTinhTP === provinceCode),
			) ?? dedupedSchools.find((item) => normalizeSearchText(item.tenTruong) === normalizedSchoolName);
		const province = listTinh?.find((item) => item.maTinhTP === school?.maTinhTP);
		form.setFieldsValue({
			[`hsName${suffix}`]: nextSchoolName,
			[`hsSchoolCode${suffix}`]: school ? school.maTruong : 'other',
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
				<Form.Item
					name={`hsName${suffix}`}
					label={labelTruong ?? 'High School Name'}
					rules={[...rules.required, ...rules.text]}
				>
					<AutoComplete
						placeholder={placeholderTruong ?? 'Enter content'}
						value={schoolName}
						options={schoolOptions}
						allowClear
						showSearch
						filterOption={(inputValue, option) =>
							normalizeSearchText(option?.label?.toString()).includes(normalizeSearchText(inputValue))
						}
						onChange={onChangeSchoolName}
						onSelect={onChangeSchoolName}
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
