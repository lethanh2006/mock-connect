import { EOperatorType } from '@/components/Table/constant';
import { ETrangThaiChinhSuaNhanSu } from '@/services/ToChucNhanSu/constant';
import { Empty, Select, Spin } from 'antd';
import _ from 'lodash';
import { useEffect } from 'react';
import { useModel } from 'umi';

const SelectNhanSuDebounce = (props: {
	value?: string | string[];
	onChange?: (val: string | string[], option: any) => void;
	multiple?: boolean;
	placeholder?: string;
	maDonVi?: string;
}) => {
	const { value, onChange, multiple, placeholder, maDonVi } = props;
	const { danhSach, getModel, setFilters, filters, loading } = useModel('tochucnhansu.nhansu');

	useEffect(() => {
		getModel(
			{ trangThaiChinhSua: ETrangThaiChinhSuaNhanSu.DUYET_DANG_AP_DUNG },
			!filters || !filters.length
				? value
					? [
							{
								active: true,
								field: 'ssoId',
								values: Array.isArray(value) ? value : [value],
								operator: EOperatorType.INCLUDE,
							},
					  ]
					: !!maDonVi
					? [{ active: true, field: 'maDonVi', values: [maDonVi], operator: EOperatorType.INCLUDE }]
					: undefined
				: undefined,
			undefined,
			1,
			20,
		);
	}, [filters, value]);

	const searchDebounceSinhVien = _.debounce((val) => {
		setFilters([
			{ active: true, field: 'hoTen', values: [val], operator: EOperatorType.CONTAIN },
			{ active: !!maDonVi, field: 'maDonVi', values: [maDonVi ?? ''], operator: EOperatorType.INCLUDE },
		]);
	}, 800);

	return (
		<Select
			mode={multiple ? 'multiple' : undefined}
			value={value}
			onChange={onChange}
			onSearch={(val) => searchDebounceSinhVien(val)}
			notFoundContent={
				loading ? (
					<Spin spinning={true} tip='Đang tìm kiếm...' style={{ width: '100%', margin: 10 }} />
				) : (
					<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='Không có dữ liệu, hãy thử nhập từ khóa khác!' />
				)
			}
			options={danhSach.map((item) => ({
				key: item._id,
				value: item.ssoId,
				label: `${item.hoDem ?? ''} ${item.ten ?? ''} - ${item.maCanBo ?? ''}`,
			}))}
			showSearch
			optionFilterProp='label'
			placeholder={placeholder || 'Chọn cán bộ, giảng viên (tìm kiếm theo họ tên)'}
		/>
	);
};

export default SelectNhanSuDebounce;
