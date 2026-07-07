import { Phong } from '@/services/KyTucXa/Phong/typing';
import { Select } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

/**
 * Secect Căn cứ pháp lý để cho vào FormItem
 */
const SelectPhongKTX = (props: {
	value?: string;
	onChange?: (val: string | string[], option: any) => void;
	multiple?: boolean;
	allowClear?: boolean;
	style?: React.CSSProperties;
	isSetRecord?: boolean;
	condition?: Partial<Phong.IChinhSachPhongRecord>;
	disabled?: boolean;
}) => {
	const { value, onChange, multiple, allowClear, style, isSetRecord, condition, disabled } = props;
	const { danhSach, getAllModel, loading } = useModel('kytucxa.phong');

	useEffect(() => {
		getAllModel(!!isSetRecord, undefined, { ...condition }, undefined, 'ktx/sinh-vien/available');
	}, [JSON.stringify(condition)]);

	const options = (danhSach || []).map((item) => ({
		key: item._id,
		value: item._id,
		label: item.room?.ten ?? item.room?.ma,
		rawData: item,
	}));

	return (
		<Select
			loading={loading}
			disabled={disabled}
			mode={multiple ? 'multiple' : undefined}
			allowClear={allowClear}
			value={value}
			onChange={onChange}
			options={options}
			showSearch
			optionFilterProp='label'
			placeholder='Chọn phòng'
			style={{ width: '100%', ...style }}
		/>
	);
};

export default SelectPhongKTX;
