import { Select } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

/**
 * Secect Căn cứ pháp lý để cho vào FormItem
 */
const SelectNamHoc = (props: {
	value?: string;
	onChange?: (val?: string) => void;
	multiple?: boolean;
	allowClear?: boolean;
	style?: React.CSSProperties;
	isSetRecord?: boolean;
	hasDefault?: boolean;
}) => {
	const { value, onChange, multiple, allowClear, style, isSetRecord, hasDefault } = props;
	const { danhSach, getAllModel, visibleForm } = useModel('daotao.namhoc');

	useEffect(() => {
		if (!visibleForm)
			getAllModel(isSetRecord, { thoiGianBatDau: -1 }).then((res) => {
				if (hasDefault && onChange) onChange(res?.[0]?._id);
			});
	}, [visibleForm]);

	return (
		<Select
			mode={multiple ? 'multiple' : undefined}
			allowClear={allowClear}
			value={value}
			onChange={onChange}
			options={danhSach.map((item) => ({
				key: item._id,
				value: item._id,
				label: item.ten,
			}))}
			showSearch
			optionFilterProp='label'
			placeholder='Chọn năm học'
			style={{ width: '100%', ...style }}
			showArrow
		/>
	);
};

export default SelectNamHoc;
