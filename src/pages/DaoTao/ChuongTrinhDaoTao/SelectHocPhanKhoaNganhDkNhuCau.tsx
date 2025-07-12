import type { HocPhan } from '@/services/DaoTao/HocPhan/typings';
import { Select, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

/**
 * Select học phần riêng, ko dùng model hocphan
 */
const SelectHocPhanKhoaNganhDkNhuCau = (props: {
	value?: string;
	onChange?: (val: string) => void;
	multiple?: boolean;
	disabled?: boolean;
	allowClear?: boolean;
	selectMa?: boolean;
	style?: React.CSSProperties;
	maKhoaNganh?: string;
	idDotDkNhuCau?: string;
}) => {
	const { value, onChange, multiple, allowClear, selectMa, disabled, style, maKhoaNganh, idDotDkNhuCau } = props;
	const { getAllModel } = useModel('daotao.chuongtrinhdaotao');
	const [danhSach, setDanhSach] = useState<(HocPhan.IRecord & { soLuongDangKy: number })[]>([]);

	useEffect(() => {
		if (maKhoaNganh && idDotDkNhuCau)
			getAllModel(
				false,
				undefined,
				undefined,
				undefined,
				`hoc-phan/khoa-nganh/${maKhoaNganh}/dot-dknc/${idDotDkNhuCau}`,
				false,
			).then((data: any[]) => setDanhSach(data.sort((a, b) => b.soLuongDangKy - a.soLuongDangKy)));
	}, [maKhoaNganh, idDotDkNhuCau]);

	return (
		<Select
			mode={multiple ? 'multiple' : undefined}
			disabled={disabled}
			value={value}
			onChange={onChange}
			options={danhSach.map((item) => ({
				key: item.ma,
				value: selectMa ? item.ma : item._id,
				label: (
					<span>
						{item.ma} - {item.ten} - {item.soTinChi} TC - <Tag color={item.soLuongDangKy >= 30 ? 'green' : item.soLuongDangKy >= 20 ? 'yellow' : 'red'}>{item.soLuongDangKy} SV</Tag>
					</span>
				),
			}))}
			showSearch
			optionFilterProp='label'
			placeholder='Chọn học phần'
			style={{ width: '100%', ...style }}
			allowClear={allowClear ?? false}
		/>
	);
};

export default SelectHocPhanKhoaNganhDkNhuCau;
