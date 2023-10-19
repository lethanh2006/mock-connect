import { Select } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

/**
 * Secect Căn cứ pháp lý để cho vào FormItem
 */
const SelectDonVi = (props: {
	value?: string;
	onChange?: any;
	multiple?: boolean;
	disabled?: boolean;
	isSelectMa?: boolean;
}) => {
	const { value, onChange, multiple, disabled, isSelectMa } = props;
	const { danhSach, getAllModel } = useModel('tochucnhansu.donvi');

	useEffect(() => {
		getAllModel();
	}, []);

	return (
		<div style={{ display: 'flex', gap: 8 }}>
			<Select
				mode={multiple ? 'multiple' : undefined}
				value={value}
				onChange={onChange}
				disabled={disabled}
				options={danhSach.map((item) => ({
					key: item._id,
					value: isSelectMa ? item?.maDonVi : item._id,
					label: [item.ten, item.donViCha?.ten].join(' - '),
				}))}
				showSearch
				optionFilterProp='label'
				placeholder='Chọn đơn vị'
			/>
		</div>
	);
};

export default SelectDonVi;
