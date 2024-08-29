import type { ELoaiDeTai } from '@/services/KhoaHoc/KeHoachDeTai/constants';
import { Select, Spin } from 'antd';
import type { CSSProperties } from 'react';
import { useEffect } from 'react';
import { useModel } from 'umi';

const SelectKeHoachDeTai = (props: {
	value?: string;
	onChange?: any;
	multiple?: boolean;
	disabled?: boolean;
	loadData?: boolean;
	allowClear?: boolean;
	placeholder?: string;
	style?: CSSProperties;
	isSetRecord?: boolean;
	size?: 'small' | 'middle' | 'large' | undefined;
	loaiDeTai?: ELoaiDeTai;
}) => {
	const {
		value,
		onChange,
		multiple,
		loadData,
		allowClear,
		placeholder,
		disabled,
		style,
		size,
		isSetRecord,
		loaiDeTai,
	} = props;
	const { danhSach, loading, getAllModel } = useModel('khoahoc.kehoachdetai');
	useEffect(() => {
		if (loadData !== false && !danhSach.length) getAllModel(isSetRecord, undefined, { loaiDeTai });
	}, []);

	return (
		<Select
			size={size}
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
			style={style}
			showSearch
			optionFilterProp='label'
			placeholder={placeholder ?? 'Chọn đợt khai báo'}
		/>
	);
};

export default SelectKeHoachDeTai;
