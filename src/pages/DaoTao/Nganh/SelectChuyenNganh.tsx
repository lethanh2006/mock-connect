import { EOperatorType } from '@/components/Table/constant';
import { Select } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

/**
 * Secect Căn cứ pháp lý để cho vào FormItem
 */
const SelectChuyenNganh = (props: {
	value?: string;
	onChange?: (val: string | null) => void;
	multiple?: boolean;
	allowClear?: boolean;
	disabled?: boolean;
	maNganh?: string;
	selectMa?: boolean;
}) => {
	const { value, multiple, allowClear, disabled, maNganh, selectMa } = props;
	const { danhSach, getAllModel } = useModel('daotao.nganhdaotao');

	useEffect(() => {
		getAllModel(false, undefined, undefined, [
			{
				field: 'maNganhGoc',
				operator: !!maNganh ? EOperatorType.INCLUDE : EOperatorType.NOT_NULL,
				values: [maNganh ?? ''],
			},
		]);
	}, [maNganh]);

	const onChange = (val: string) => {
		if (props.onChange)
			if (val) props.onChange(val);
			else props.onChange(null);
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
				label: `${item.ten} (${item.ma})`,
			}))}
			showSearch
			optionFilterProp='label'
			placeholder='Chọn chuyên ngành đào tạo'
			allowClear={allowClear ?? false}
		/>
	);
};

export default SelectChuyenNganh;
