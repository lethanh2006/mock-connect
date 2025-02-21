import { Select } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

/**
 * Secect Căn cứ pháp lý để cho vào FormItem
 */
const SelectTruongBienMuc = (props: {
	value?: string;
	onChange?: (val?: string) => void;
	multiple?: boolean;
	allowClear?: boolean;
	style?: React.CSSProperties;
	isSetRecord?: boolean;
	condition?: Partial<TruongBienMuc.IRecord>;
	selectMa?: boolean;
	disabled?: boolean;
}) => {
	const { value, onChange, multiple, allowClear, style, isSetRecord, condition, selectMa, disabled } = props;
	const { danhSach, getAllModel } = useModel('thuvien.truongbienmuc');

	useEffect(() => {
		getAllModel(!!isSetRecord, undefined, condition);
	}, [JSON.stringify(condition)]);

	return (
		<Select
			disabled={disabled}
			mode={multiple ? 'multiple' : undefined}
			allowClear={allowClear}
			value={value}
			onChange={onChange}
			options={danhSach.map((item) => ({
				key: item._id,
				value: selectMa ? item.ma : item._id,
				label: item.noiDung ?? '',
			}))}
			showSearch
			optionFilterProp='label'
			placeholder='Chọn trường biên mục'
			style={{ width: '100%', ...style }}
			showArrow
		/>
	);
};

export default SelectTruongBienMuc;
