import { TheChat } from '@/services/TienIch/TheChat/typing';
import { Select } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

/**
 * Secect Căn cứ pháp lý để cho vào FormItem
 */
const SelectDotTheChat = (props: {
	value?: string;
	onChange?: (val?: string) => void;
	multiple?: boolean;
	allowClear?: boolean;
	style?: React.CSSProperties;
	isSetRecord?: boolean;
	condition?: Partial<TheChat.IDotDanhGiaTheChat>;
	disabled?: boolean;
}) => {
	const { value, onChange, multiple, allowClear, style, isSetRecord, condition, disabled } = props;
	const { danhSach, getAllModel } = useModel('tienich.thechat.dot');

	useEffect(() => {
		getAllModel(!!isSetRecord, undefined, condition);
	}, [JSON.stringify(condition)]);

	return (
		<Select
			disabled={disabled}
			mode={multiple ? 'multiple' : undefined}
			allowClear={allowClear}
			value={value}
			onChange={onChange}
			options={danhSach.map((item) => ({
				key: item._id,
				value: item._id,
				label: item.tenDot,
			}))}
			showSearch
			optionFilterProp='label'
			placeholder={'Chọn đợt đánh giá thể chất'}
			style={{ width: '100%', ...style }}
		/>
	);
};

export default SelectDotTheChat;
