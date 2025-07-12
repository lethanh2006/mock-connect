import { EOperatorType } from '@/components/Table/constant';
import { ETrangThaiChinhSuaNhanSu } from '@/services/ToChucNhanSu/constant';
import type { ToChucNhanSu } from '@/services/ToChucNhanSu/typing';
import { Empty, Select, Spin } from 'antd';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

const SelectNhanSuDebounce = (props: {
	value?: string | string[];
	onChange?: (val: string | string[] | null, options?: any) => void;
	multiple?: boolean;
	disabled?: boolean;
	style?: React.CSSProperties;
	selectMa?: boolean;
	isView?: boolean;
	allowClear?: boolean;
	condition?: Partial<ToChucNhanSu.INhanSu>;
	maDonVi?: string;
	placeholder?: string;
	hidePersonalInfo?: boolean; //Ẩn thông tin cá nhân
}) => {
	const {
		value,
		onChange,
		multiple,
		disabled,
		style,
		selectMa,
		allowClear,
		condition = {},
		maDonVi,
		placeholder,
		hidePersonalInfo,
	} = props;
	const { danhSach, getModel, loading, searchCanBoModel } = useModel('tochucnhansu.nhansu');
	const { initialState } = useModel('@@initialState');
	const [keyword, setKeyword] = useState<string>();

	useEffect(() => {
		const cond = { ...condition, trangThaiChinhSua: ETrangThaiChinhSuaNhanSu.DUYET_DANG_AP_DUNG };

		if (keyword) searchCanBoModel(keyword, maDonVi, undefined, cond);
		else {
			// Nếu trong danh sách đã có 1 giá trị trong `value` rồi thì ko get lại data nữa
			// Nhưng `có thể` bug khi lần đầu render
			const gotData = danhSach.some((item) =>
				Array.isArray(value)
					? value.includes(selectMa ? item.maCanBo : item.ssoId)
					: value === (selectMa ? item.maCanBo : item.ssoId),
			);
			getModel(
				cond,
				value && !gotData
					? [
							{
								field: selectMa ? 'maCanBo' : 'ssoId',
								values: Array.isArray(value) ? value : [value],
								operator: EOperatorType.INCLUDE,
							},
					  ]
					: !!maDonVi
					? [{ active: true, field: 'maDonVi', values: [maDonVi], operator: EOperatorType.INCLUDE }]
					: undefined,
				undefined,
				1,
				20,
				'sinh-vien/page',
			);
		}
	}, [keyword, JSON.stringify(value)]);

	const searchDebounceSinhVien = _.debounce((val) => {
		setKeyword(val);
	}, 800);

	const dataView = danhSach.find((item) => item.ssoId === value);

	return props.isView ? (
		<>
			{dataView?.hoDem ?? ''} ${dataView?.ten ?? ''} - ${dataView?.maCanBo ?? ''}
		</>
	) : (
		<Select
			loading={loading}
			mode={multiple ? 'multiple' : undefined}
			value={value}
			allowClear={allowClear}
			onChange={onChange}
			disabled={disabled}
			onSearch={(val) => searchDebounceSinhVien(val)}
			notFoundContent={
				loading ? (
					<Spin spinning={true} tip='Đang tìm kiếm...' style={{ width: '100%', margin: 10 }} />
				) : (
					<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='Không có dữ liệu, hãy thử nhập từ khóa khác!' />
				)
			}
			options={(hidePersonalInfo
				? danhSach?.filter((val) => val?.ssoId !== initialState?.currentUser?.ssoId)
				: danhSach
			).map((item) => ({
				key: item?.ssoId,
				value: selectMa ? item.maCanBo : item?.ssoId,
				label: `${item?.hoTen ?? ''} - ${item.maCanBo ?? ''} - ${item.donViChinh?.ten ?? ''}`,
				rawData: item,
			}))}
			showSearch
			optionFilterProp='label'
			placeholder={placeholder || 'Chọn cán bộ, giảng viên (tìm kiếm theo họ tên hoặc mã nhân sự)'}
			style={{ width: '100%', ...style }}
			showArrow
		/>
	);
};

export default SelectNhanSuDebounce;
