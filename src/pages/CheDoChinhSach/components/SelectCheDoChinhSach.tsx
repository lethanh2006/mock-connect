import type { CheDoSinhVien } from '@/services/CheDoSinhVien/typings';
import { Select } from 'antd';
import React, { useEffect } from 'react';
import { useModel } from 'umi';

const SelectCheDoChinhSach = (props: {
	value?: string;
	onChange?: (id: string) => void;
	multiple?: boolean;
	condition?: Partial<CheDoSinhVien.IRecord>;
	disabled?: boolean;
	allowClear?: boolean;
	style?: React.CSSProperties;
	isSetRecord?: boolean;
	placeHolder?: string;
}) => {
	const { value, onChange, multiple, condition, allowClear, style, isSetRecord, disabled, placeHolder } = props;
	const { danhSach, getAllModel, visibleForm, loading } = useModel('chedochinhsach.chedochinhsach');

	useEffect(() => {
		if (!visibleForm) getAllModel(!!isSetRecord, undefined, condition);
	}, [visibleForm, JSON.stringify(condition)]);

	return (
		<Select
			mode={multiple ? 'multiple' : undefined}
			disabled={disabled}
			value={value}
			onChange={onChange}
			options={danhSach.map((item) => ({
				key: item._id,
				value: item._id,
				label: `${item.ten}`,
			}))}
			showSearch
			optionFilterProp='label'
			placeholder={placeHolder}
			allowClear={allowClear ?? false}
			style={{ width: '100%', ...style }}
			loading={loading}
		/>
	);
};

export default SelectCheDoChinhSach;
