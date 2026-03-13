import type { HocPhan } from '@/services/DaoTao/HocPhan/typings';
import { Select } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

/**
 * Select học phần riêng, ko dùng model hocphan
 */
const SelectHocPhanKhoaNganh = (props: {
	value?: string;
	onChange?: (val: string) => void;
	multiple?: boolean;
	disabled?: boolean;
	allowClear?: boolean;
	selectMa?: boolean;
	style?: React.CSSProperties;
	maKhoaNganh?: string;
}) => {
	const { value, onChange, multiple, allowClear, selectMa, disabled, style, maKhoaNganh } = props;
	const { getAllModel } = useModel('daotao.chuongtrinhdaotao');
	const [danhSach, setDanhSach] = useState<HocPhan.IRecord[]>([]);

	useEffect(() => {
		if (maKhoaNganh)
			getAllModel(false, undefined, undefined, undefined, `hoc-phan/khoa-nganh/${maKhoaNganh}`, false).then(
				(data: any) => setDanhSach(data),
			);
	}, [maKhoaNganh]);

	return (
		<Select
			mode={multiple ? 'multiple' : undefined}
			disabled={disabled}
			value={value}
			onChange={onChange}
			options={danhSach.map((item) => ({
				key: item._id,
				value: selectMa ? item.ma : item._id,
				label: `${item.ten} (${item.ma} - ${item.soTinChi} tín)`,
			}))}
			showSearch
			optionFilterProp='label'
			placeholder='Chọn học phần'
			style={{ width: '100%', ...style }}
			allowClear={allowClear ?? false}
		/>
	);
};

export default SelectHocPhanKhoaNganh;
