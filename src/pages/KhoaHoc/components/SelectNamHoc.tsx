import { Select } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import _ from 'lodash';

interface Props {
	allowClear: boolean;
	style?: any;
	onChange?: any;
	mode?: any;
	notInitSelect?: boolean;
	value?: string | string[];
	disabled?: boolean;
}

const SelectNamHoc = (props: Props) => {
	const { getAllModel, record, danhSach, setRecord } = useModel('khoahoc.danhmuc.namhoc');

	useEffect(() => {
		if (!danhSach.length) getAllModel(true, { thoiGianBatDau: -1 });
	}, []);

	const dsFinal = _.sortBy(danhSach, 'thoiGianKetThuc');

	return (
		<Select
			disabled={props?.disabled}
			mode={props?.mode}
			style={props.style}
			allowClear={props.allowClear}
			placeholder='Lọc theo học kỳ, năm học'
			key='1'
			value={props?.notInitSelect ? props?.value : props?.value || record?._id}
			options={dsFinal?.reverse()?.map((item) => ({ value: item._id, label: item.tenNamHoc }))}
			onChange={
				props.onChange
					? props.onChange
					: (val) => {
							setRecord(danhSach.find((item) => item._id === val));
					  }
			}
		/>
	);
};

export default SelectNamHoc;
