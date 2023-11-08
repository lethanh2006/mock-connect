import { Select, Spin } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

/**
 * Secect Căn cứ pháp lý để cho vào FormItem
 */
const SelectDotQuyTrinh = (props: {
	initQuery?: any;
	value?: string;
	onChange?: any;
	multiple?: boolean;
	disabled?: boolean;
	loadData?: boolean;
	allowClear?: boolean;
	placeholder?: string;
	hienThiMaQuocTich?: boolean;
}) => {
	const { value, onChange, multiple, loadData, allowClear, placeholder, disabled, initQuery } = props;
	const { danhSach, getAllModel, loading } = useModel('quytrinh.dotkhaibao');

	useEffect(() => {
		if (loadData !== false) getAllModel(undefined, undefined, initQuery);
	}, [initQuery]);

	return (
		<Select
			notFoundContent={loading ? <Spin spinning={true} /> : undefined}
			mode={multiple ? 'multiple' : undefined}
			value={value}
			disabled={disabled}
			allowClear={allowClear}
			onChange={onChange}
			options={danhSach.map((item) => ({
				key: item._id,
				value: item._id,
				label: `${item?.ten}`,
			}))}
			showSearch
			optionFilterProp='label'
			placeholder={placeholder ?? 'Chọn đợt khai báo'}
		/>
	);
};

export default SelectDotQuyTrinh;
