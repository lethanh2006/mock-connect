import { Select } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';

const SelectCategory = (props: {
	value?: string;
	onChange?: any;
	multiple?: boolean;
	loadData?: boolean;
	allowClear?: boolean;
	placeholder?: string;
	category?: string;

}) => {
	const intl = useIntl();
	const { value, onChange, multiple, allowClear, loadData, category, placeholder } = props;

	const { getAllModel } = useModel('core.category');
	const [data, setData] = useState<any[]>([]);

	useEffect(() => {
		if (loadData !== false) {
			getAllModel(
				false,
				undefined,
				{
					category,
				},
				undefined,
				undefined,
				false,
			).then((res) => {
				setData(res || []);
			});
		}
	}, [loadData, category]);

	return <Select
		mode={multiple ? 'multiple' : undefined}
		value={value}
		allowClear={allowClear}
		onChange={onChange}
		options={data.map((item) => ({
			key: item._id,
			value: item.code,
			label: item.name,
		}))}
		showSearch
		optionFilterProp="label"
		placeholder={placeholder ?? intl.formatMessage({ id: 'thongtincanhan.form.thongtinvisa.loaivisa.place' })}
		{...props}
	/>;
};

export default SelectCategory;
