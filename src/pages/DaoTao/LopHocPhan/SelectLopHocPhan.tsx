import { Select } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

/**
 * Secect Căn cứ pháp lý để cho vào FormItem
 */
const SelectLopHocPhan = (props: {
	value?: string;
	onChange?: (hocPhanId: string) => void;
	multiple?: boolean;
	allowClear?: boolean;
	loadData?: boolean;
	selectMa?: boolean;
}) => {
	const { value, onChange, multiple, allowClear, loadData, selectMa } = props;
	const { danhSach, sinhVienGetAllModel } = useModel('daotao.lophocphan');

	useEffect(() => {
		if (loadData !== false) sinhVienGetAllModel();
	}, [loadData]);

	return (
		<div style={{ display: 'flex', gap: 8 }}>
			<Select
				mode={multiple ? 'multiple' : undefined}
				value={value}
				onChange={onChange}
				options={danhSach.map((item) => ({
					key: item._id,
					value: selectMa ? item.ten : item._id,
					label: `${item.ten} `,
				}))}
				showSearch
				optionFilterProp='label'
				placeholder='Chọn lớp tín chỉ'
				style={{ width: '100%' }}
				allowClear={allowClear ?? false}
			/>
		</div>
	);
};

export default SelectLopHocPhan;
