import { Select } from 'antd';
import React, { useEffect } from 'react';
import { useModel } from 'umi';

/**
 * Secect Căn cứ pháp lý để cho vào FormItem
 */
const SelectDotThu = (props: {
	value?: string;
	onChange?: (id: string) => void;
	multiple?: boolean;
	condition?: any;
	allowClear?: boolean;
	style?: React.CSSProperties;
	isSetRecord?: boolean;
}) => {
	const { value, onChange, multiple, condition, allowClear, style, isSetRecord } = props;
	const { danhSach, getAllModel, setRecord, visibleForm } = useModel('taichinh.dotthu');

	useEffect(() => {
		if (!visibleForm)
			getAllModel(isSetRecord, undefined, condition).then(() => {
				if (!isSetRecord) setRecord(undefined);
			});
	}, [visibleForm, JSON.stringify(condition)]);

	return (
		<Select
			mode={multiple ? 'multiple' : undefined}
			value={value}
			onChange={onChange}
			options={danhSach.map((item) => ({
				key: item._id,
				value: item._id,
				label: `${item.tenDot}`,
			}))}
			showSearch
			optionFilterProp='label'
			placeholder='Chọn đợt thu tài chính'
			allowClear={allowClear ?? false}
			style={{ width: '100%', ...style }}
		/>
	);
};

export default SelectDotThu;
