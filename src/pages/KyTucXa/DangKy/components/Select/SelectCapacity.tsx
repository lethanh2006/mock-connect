import { Select } from 'antd';
import React, { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

/**
 * Select Sức chứa để cho vào FormItem
 */
const SelectCapacityKTX = (props: {
	value?: number | number[];
	onChange?: (value: any) => void;
	multiple?: boolean;
	condition?: any;
	allowClear?: boolean;
	style?: React.CSSProperties;
	isSetRecord?: boolean;
	selectMa?: boolean;
	disableFetch?: boolean;
}) => {
	const { value, onChange, multiple, allowClear, style, isSetRecord, condition, disableFetch } = props;
	const { danhSach, getModel, setRecord, loading } = useModel('kytucxa.phong');
	const intl = useIntl();

	useEffect(() => {
		if (!disableFetch) {
			getModel(condition, undefined, undefined, undefined, undefined, '').then(() => {
				if (!isSetRecord) setRecord?.(undefined);
			});
		}
	}, [JSON.stringify(condition), disableFetch]);

	const uniqueCapacities = Array.from(
		new Set((danhSach || []).map((item) => item.soLuongToiDa).filter((val) => typeof val === 'number'))
	).sort((a, b) => a - b);

	return (
		<Select
			mode={multiple ? 'multiple' : undefined}
			value={value}
			onChange={onChange}
			options={uniqueCapacities.map((capacity) => ({
				key: capacity,
				value: capacity,
				label: `${intl.formatMessage({ id: 'kytucxa.dangky.select.capacityLabel' }, { capacity })}`,
			}))}
			showSearch
			optionFilterProp='label'
			placeholder={intl.formatMessage({ id: 'kytucxa.dangky.select.capacityPlaceholder' })}
			allowClear={allowClear ?? false}
			style={{ width: '100%', ...style }}
			showArrow
			loading={loading}
		/>
	);
};

export default SelectCapacityKTX;
