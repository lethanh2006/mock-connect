import { DangKyKyTucXa } from '@/services/KyTucXa/typings';
import { Select } from 'antd';
import React, { useEffect, useMemo } from 'react';
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
	danhSachMaToa?: string[];
}) => {
	const { value, onChange, multiple, condition, allowClear, style, isSetRecord, danhSachMaToa } = props;
	const { danhSach, getAllModel, setRecord, loading } = useModel('kytucxa.toanha');
	const intl = useIntl();

	useEffect(() => {
		getAllModel(undefined, undefined, condition).then(() => {
			if (!isSetRecord) setRecord(undefined);
		});
	}, [JSON.stringify(condition)]);

	const filteredDanhSach = useMemo(() => {
		if (!danhSachMaToa || danhSachMaToa.length === 0) return danhSach;
		return danhSach.filter((item: DangKyKyTucXa.IToaKTX)=> danhSachMaToa.includes(item.ma));
	}, [danhSach, danhSachMaToa]);

	return (
		<Select
			mode={multiple ? 'multiple' : undefined}
			value={value}
			onChange={onChange}
			options={filteredDanhSach.map((item: DangKyKyTucXa.IToaKTX) => ({
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
