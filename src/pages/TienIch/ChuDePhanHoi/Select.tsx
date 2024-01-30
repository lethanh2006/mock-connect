import { Select } from 'antd';
import React, { useEffect } from 'react';
import { useModel } from 'umi';

/**
 * Secect Căn cứ pháp lý để cho vào FormItem
 */
const SelectChuDePhanHoi = (props: {
	value?: string;
	onChange?: (id: string) => void;
	multiple?: boolean;
	condition?: any;
	disabled?: boolean;
	allowClear?: boolean;
	style?: React.CSSProperties;
	isSetRecord?: boolean;
}) => {
	const { value, onChange, multiple, condition, allowClear, style, isSetRecord, disabled } = props;
	const { danhSach, getAllModel, visibleForm, loading } = useModel('tienich.chudephanhoi');

	useEffect(() => {
		if (!visibleForm) getAllModel(!!isSetRecord, undefined, condition);
	}, [visibleForm, JSON.stringify(condition)]);

	return (
		<Select
			mode={multiple ? 'multiple' : undefined}
			disabled={disabled}
			value={value}
			onChange={onChange}
			options={[
				{
					value: 'Khác',
					label: 'Khác',
				},
				...danhSach.map((item) => ({
					key: item._id,
					value: item._id,
					label: `${item.tenLinhVuc}`,
				})),
			]}
			showSearch
			optionFilterProp='label'
			placeholder='Chọn chủ đề phản hồi'
			allowClear={allowClear ?? false}
			style={{ width: '100%', ...style }}
			loading={loading}
		/>
	);
};

export default SelectChuDePhanHoi;
