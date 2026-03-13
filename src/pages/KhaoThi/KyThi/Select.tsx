import type { KyThi } from '@/services/KhaoThi/KyThi/typings';
import { Select } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

/**
 * Secect Căn cứ pháp lý để cho vào FormItem
 */
const SelectKyThi = (props: {
	value?: string;
	onChange?: (val: string) => void;
	multiple?: boolean;
	disabled?: boolean;
	allowClear?: boolean;
	loadData?: boolean;
	selectMa?: boolean;
	style?: React.CSSProperties;
	condition?: Partial<KyThi.IRecord>;
	placeHolder?: string;
	isSetRecord?: boolean;
	checkGetData?: boolean;
	maHocKy: string;
}) => {
	const {
		value,
		multiple,
		allowClear,
		selectMa,
		disabled,
		style,
		condition,
		placeHolder,
		checkGetData = true,
		maHocKy,
	} = props;
	const { danhSach, getAllModel, loading } = useModel('khaothi.kythi');

	useEffect(() => {
		if (checkGetData)
			getAllModel(
				!!props.isSetRecord,
				undefined,
				{
					...condition,
				},
				undefined,
				`me/many/${maHocKy}`,
			);
	}, [maHocKy, JSON.stringify(condition)]);

	const onChange = (val: string) => {
		if (props.onChange) props.onChange(val);
	};

	return (
		<Select
			mode={multiple ? 'multiple' : undefined}
			disabled={disabled}
			value={value}
			onChange={onChange}
			options={danhSach.map((item) => ({
				key: item._id,
				value: selectMa ? item.ma : item._id,
				label: item.ten,
			}))}
			showSearch
			optionFilterProp='label'
			placeholder={placeHolder || 'Chọn đợt thi'}
			style={{ width: '100%', ...style }}
			allowClear={allowClear ?? false}
			showArrow
			loading={loading}
		/>
	);
};

export default SelectKyThi;
