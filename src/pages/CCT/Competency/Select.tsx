import { Select } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

/**
 * Secect Căn cứ pháp lý để cho vào FormItem
 */
const SelectCompetency = (props: {
	value?: string;
	onChange?: (val?: string) => void;
	multiple?: boolean;
	allowClear?: boolean;
	style?: React.CSSProperties;
	isSetRecord?: boolean;
	condition?: Partial<Competency.IRecord>;
	disabled?: boolean;
}) => {
	const intl = useIntl();
	const { value, onChange, multiple, allowClear, style, isSetRecord, condition, disabled } = props;
	const { danhSach, getAllModel } = useModel('cct.competency');

	useEffect(() => {
		getAllModel(
			!!isSetRecord,
			{ order: 1 },
			{ ...condition, isActive: true },
			undefined,
			undefined,
			undefined,
			undefined,
			{
				population: [
					{
						path: 'attributes',
					},
				],
			},
		);
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
				label: item.name,
			}))}
			showSearch
			optionFilterProp='label'
			placeholder='Select competency'
			style={{ width: '100%', ...style }}
		/>
	);
};

export default SelectCompetency;
