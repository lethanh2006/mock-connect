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
	isGetAll?: boolean;
	/** Dùng `ma` (vd '2025-2026') làm value thay vì `_id`. */
	selectMa?: boolean;
}) => {
	const { value, onChange, multiple, allowClear, style, isSetRecord, hasDefault, isGetAll, selectMa } = props;
	const { danhSach, getAllModel } = useModel('daotao.namhoc');

	useEffect(() => {
		if (!danhSach.length)
			getAllModel(isSetRecord, undefined, undefined, undefined, !isGetAll ? 'sinh-vien/me' : undefined).then((res) => {
				if (hasDefault && onChange) onChange(res?.[0]?._id);
			});
	}, []);

	return (
		<Select
			mode={multiple ? 'multiple' : undefined}
			allowClear={allowClear}
			value={value}
			onChange={onChange}
			options={danhSach.map((item) => ({
				key: item._id,
				value: selectMa ? item.ma : item._id,
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
