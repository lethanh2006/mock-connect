import { Select } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

/**
 * Secect Căn cứ pháp lý để cho vào FormItem
 */
const SelectLopHanhChinhSinhVien = (props: {
	value?: string;
	onChange?: (val: string | string[] | null) => void;
	multiple?: boolean;
	allowClear?: boolean;
	disabled?: boolean;
	style?: React.CSSProperties;
	hasDefault?: boolean;
	selectMa?: boolean;
	placeholder?: string;
	maHocKy?: string;
}) => {
	const { value, onChange, multiple, allowClear, disabled, style, hasDefault, selectMa, placeholder, maHocKy } = props;
	const { danhSach, sinhVienGetModel, loading, setRecord } = useModel('daotao.lophanhchinh');

	useEffect(() => {
		sinhVienGetModel(undefined, maHocKy)
			.then((data) => {
				if (hasDefault && onChange) {
					onChange(data?.[0]?._id);
					setRecord(data?.[0]);
				}
			})
			.catch((er) => console.log(er));
	}, [maHocKy]);

	return (
		<Select
			mode={multiple ? 'multiple' : undefined}
			value={value}
			onChange={onChange}
			disabled={disabled}
			options={danhSach.map((item) => ({
				key: item.ten ?? item._id,
				value: selectMa ? item.ten : item._id,
				label: item.ten,
			}))}
			showSearch
			optionFilterProp='label'
			placeholder={placeholder ?? 'Chọn lớp hành chính'}
			allowClear={allowClear ?? false}
			style={{ width: '100%', ...style }}
			showArrow
			loading={loading}
		/>
	);
};

export default SelectLopHanhChinhSinhVien;
