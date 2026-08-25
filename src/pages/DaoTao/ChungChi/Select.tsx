import { Select } from 'antd';
import { useEffect, useMemo } from 'react';
import { useIntl, useModel } from 'umi';

export const CERTIFICATE_TYPE_OTHER = 'OTHER';

/**
 * Secect Căn cứ pháp lý để cho vào FormItem
 */
const SelectChungChi = (props: {
	value?: string;
	onChange?: (id: string) => void;
	hasCreate?: boolean;
	multiple?: boolean;
	allowClear?: boolean;
	disabled?: boolean;
	placeholder?: string;
	hasDefault?: boolean;
	selectMa?: boolean;
	hasOther?: boolean;
	onlyNgoaiNgu?: boolean;
	style?: React.CSSProperties;
}) => {
	const intl = useIntl();
	const {
		value,
		onChange,
		multiple,
		allowClear,
		placeholder,
		disabled,
		hasDefault,
		selectMa,
		hasOther,
		onlyNgoaiNgu,
		style,
	} = props;
	const { danhSach, getAllModel } = useModel('daotao.chungchi');

	useEffect(() => {
		getAllModel(undefined, undefined, { choPhepDangKy: true }).then((data) => {
			const filtered = onlyNgoaiNgu ? data.filter((item) => item.loaiChungChi?.isNgoaiNgu) : data;
			// Nếu chưa chọn giá trị và (sau khi thêm mới hoặc data chỉ có 1 phần tử)
			// Thì chọn phần tử đầu tiên
			if (hasDefault && filtered.length === 1 && !!onChange) onChange(selectMa ? filtered[0].ma : filtered[0]._id);
		});
	}, []);

	const options = useMemo(() => {
		const filtered = onlyNgoaiNgu ? danhSach.filter((item) => item.loaiChungChi?.isNgoaiNgu) : danhSach;
		const list = filtered.map((item) => ({
			key: item._id,
			value: selectMa ? item.ma : item._id,
			label: `${item?.ten} - ${item.loaiChungChi?.ten ?? ''}${
				item.loaiChungChi?.isNgoaiNgu ? ` - ${item.ngonNgu?.ten ?? item.maNgonNgu}` : ''
			}`,
		}));

		if (hasOther) {
			list.push({
				key: CERTIFICATE_TYPE_OTHER,
				value: CERTIFICATE_TYPE_OTHER,
				label: intl.formatMessage({ id: 'global.enrollmentDeclaration.academic.certificateType.other' }),
			});
		}

		return list;
	}, [danhSach, hasOther, intl, onlyNgoaiNgu, selectMa]);

	return (
		<Select
			mode={multiple ? 'multiple' : undefined}
			disabled={disabled}
			allowClear={allowClear}
			value={value}
			onChange={onChange}
			options={options}
			showSearch
			optionFilterProp='label'
			placeholder={placeholder ?? 'Chọn chứng chỉ'}
			style={{ width: '100%', ...style }}
			showArrow
		/>
	);
};

export default SelectChungChi;
