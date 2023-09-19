import { Select } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

export const SelectDotChamDiem = (props: {
	value?: string;
	onChange?: (val: string) => void;
	multiple?: boolean;
	condition?: any;
	allowClear?: boolean;
	disabled?: boolean;
	readOnly?: boolean;
}) => {
	const { value, onChange, multiple, condition, allowClear, disabled, readOnly } = props;
	const { danhSach, getAllModel, visibleForm } = useModel('diemrenluyen.dotchamdiem');

	useEffect(() => {
		if (!visibleForm) {
			getAllModel(false, undefined, { ...condition });
		}
	}, [visibleForm, condition]);

	return (
		<Select
			mode={multiple ? 'multiple' : undefined}
			value={value}
			onChange={onChange}
			disabled={disabled}
			options={danhSach.map((item) => ({
				key: item._id,
				value: item._id,
				label: item.tenDot,
			}))}
			removeIcon={readOnly ? null : undefined}
			showSearch
			optionFilterProp='label'
			placeholder='Đợt chấm điểm'
			allowClear={allowClear ?? false}
			style={{ width: '100%', pointerEvents: readOnly ? 'none' : undefined }}
		/>
	);
};
