import { KyTucXa } from '@/services/KyTucXa/typings';
import { Select } from 'antd';
import React, { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

/**
 * Select Toà nhà KTX để cho vào FormItem
 */
const SelectToaNhaKTX = (props: {
	value?: string;
	onChange?: (id: string) => void;
	multiple?: boolean;
	condition?: any;
	allowClear?: boolean;
	style?: React.CSSProperties;
	isSetRecord?: boolean;
	selectMa?: boolean;
	disableFetch?: boolean;
}) => {
	const { value, onChange, multiple, condition, allowClear, style, isSetRecord, disableFetch } = props;
	const { danhSach, getAllModel, setRecord, loading } = useModel('kytucxa.toanha');
	const intl = useIntl();

	useEffect(() => {
		if (!disableFetch) {
			if (condition && 'maDotId' in condition && !condition.maDotId) {
				return;
			}
			getAllModel(undefined, undefined, undefined, undefined, undefined, undefined, undefined, condition).then(() => {
				if (!isSetRecord) setRecord(undefined);
			});
		}
	}, [JSON.stringify(condition), disableFetch]);

	return (
		<Select
			mode={multiple ? 'multiple' : undefined}
			value={value}
			onChange={onChange}
			options={danhSach.map((item: KyTucXa.IToa) => ({
				key: item._id,
				value: item._id,
				label: `${item.ten}`,
			}))}
			showSearch
			optionFilterProp='label'
			placeholder={intl.formatMessage({ id: 'kytucxa.dangky.select.buildingPlaceholder' })}
			allowClear={allowClear ?? false}
			style={{ width: '100%', ...style }}
			showArrow
			loading={loading}
		/>
	);
};

export default SelectToaNhaKTX;
