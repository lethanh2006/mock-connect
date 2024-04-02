import { Select } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

/**
 * Secect Căn cứ pháp lý để cho vào FormItem
 */
const SelectChungChi = (props: {
	value?: string;
	onChange?: (id: string) => void;
	hasCreate?: boolean;
	multiple?: boolean;
	allowClear?: boolean;
	disabled?: boolean;
	placeholder?: string;
	hasDefault?: boolean;
	selectMa?: boolean;
	style?: React.CSSProperties;
}) => {
	const { value, onChange, multiple, allowClear, placeholder, disabled, hasDefault, selectMa, style } = props;
	const { danhSach, getAllModel, visibleForm } = useModel('daotao.chungchi');

	useEffect(() => {
		if (!visibleForm)
			getAllModel().then((data) => {
				// Nếu chưa chọn giá trị và (sau khi thêm mới hoặc data chỉ có 1 phần tử)
				// Thì chọn phần tử đầu tiên
				if (hasDefault && data.length === 1 && !!onChange) onChange(selectMa ? data[0].ma : data[0]._id);
			});
	}, [visibleForm]);

	return (
		<Select
			mode={multiple ? 'multiple' : undefined}
			disabled={disabled}
			allowClear={allowClear}
			value={value}
			onChange={onChange}
			options={danhSach.map((item) => ({
				key: item._id,
				value: selectMa ? item.ma : item._id,
				label: `${item?.ten} - ${item.loaiChungChi?.ten ?? ''}${
					item.loaiChungChi?.isNgoaiNgu ? ` - ${item.ngonNgu?.ten ?? item.maNgonNgu}` : ''
				}`,
			}))}
			showSearch
			optionFilterProp='label'
			placeholder={placeholder ?? 'Chọn chứng chỉ'}
			style={{ width: '100%', ...style }}
			showArrow
		/>
	);
};

export default SelectChungChi;
