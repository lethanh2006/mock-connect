import { Select } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

/**
 * Select lớp học phần
 */
const SelectLopHocPhan = (props: {
	value?: string;
	onChange?: (hocPhanId: string) => void;
	multiple?: boolean;
	allowClear?: boolean;
	loadData?: boolean;
	selectMa?: boolean;
	style?: React.CSSProperties;
	label?: 'ten' | 'ma';
	filterHocKy?: boolean; // <-- thêm logic filter theo học kỳ
}) => {
	const { value, onChange, multiple, allowClear, loadData, selectMa, style, label, filterHocKy } = props;

	const { danhSach, sinhVienGetAllModel, getModel, sinhVienGetModel } = useModel('lophocphan.lophocphan');
	const { record: recHocKy } = useModel('daotao.hocky');

	// Load danh sách theo chế độ filter hoặc toàn bộ
	useEffect(() => {
		if (loadData === false) return;

		if (filterHocKy) {
			// Nếu filter theo học kỳ → chỉ lấy theo học kỳ
			if (recHocKy?.ma) {
				sinhVienGetModel({ maHocKy: recHocKy.ma });
			}
		} else {
			// Ngược lại → lấy toàn bộ danh sách
			sinhVienGetAllModel();
		}
	}, [loadData, filterHocKy, recHocKy?.ma]);

	return (
		<div style={{ display: 'flex', gap: 8, ...style }}>
			<Select
				mode={multiple ? 'multiple' : undefined}
				value={value}
				onChange={onChange}
				options={danhSach.map((item) => ({
					key: item._id,
					value: selectMa ? item.ten : item._id,
					label: `${label === 'ten' ? item.hocPhan?.ten : item.ten}`,
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
