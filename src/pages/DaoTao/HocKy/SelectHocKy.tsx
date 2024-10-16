import { Select } from 'antd';
import React, { useEffect } from 'react';
import { useModel } from 'umi';

/**
 * Secect Căn cứ pháp lý để cho vào FormItem
 */
const SelectHocKy = (props: {
	value?: string;
	onChange?: (id: string) => void;
	multiple?: boolean;
	disabled?: boolean;
	allowClear?: boolean;
	style?: React.CSSProperties;
	isSetRecord?: boolean;
	selectMa?: boolean;
	/** Nếu căn cứ từ lớp hành chính thì chỉ lọc những HK có `sinh viên học kỳ`, còn ko mặc định sẽ lấy toàn bộ học kỳ theo `Khóa ngành` */
	fromLhc?: boolean;
}) => {
	const { value, onChange, multiple, allowClear, style, isSetRecord, selectMa, disabled, fromLhc = false } = props;
	const { danhSach, getAllModel, loading } = useModel('daotao.hocky');

	useEffect(() => {
		getAllModel(
			!!isSetRecord,
			{ ma: -1 },
			undefined,
			undefined,
			fromLhc ? 'lop-hanh-chinh/sinh-vien/me' : 'sinh-vien/me',
		);
	}, [fromLhc]);

	return (
		<Select
			mode={multiple ? 'multiple' : undefined}
			disabled={disabled}
			value={value}
			onChange={onChange}
			options={danhSach.map((item) => ({
				key: item._id,
				value: selectMa ? item.ma : item._id,
				label: `${item.ten}`,
			}))}
			showSearch
			optionFilterProp='label'
			placeholder='Chọn học kỳ'
			allowClear={allowClear ?? false}
			style={{ width: '100%', ...style }}
			loading={loading}
		/>
	);
};

export default SelectHocKy;
