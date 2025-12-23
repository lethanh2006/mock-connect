import { Select } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

/**
 * Secect Căn cứ pháp lý để cho vào FormItem
 */
const SelectDanToc = (props: {
	value?: string;
	onChange?: any;
	multiple?: boolean;
	loadData?: boolean;
	allowClear?: boolean;
}) => {
	const intl = useIntl();
	const { value, onChange, multiple, loadData, allowClear } = props;
	const { danhSach, getAllModel } = useModel('core.dantoc');

	useEffect(() => {
		if (loadData !== false) getAllModel();
	}, []);

	return (
		<Select
			mode={multiple ? 'multiple' : undefined}
			value={value}
			allowClear={allowClear}
			onChange={onChange}
			options={danhSach.map((item) => ({
				key: item._id,
				value: item.tenDanToc,
				label: `${item.tenDanToc} - ${item.ma}`,
			}))}
			showSearch
			optionFilterProp='label'
			placeholder={intl.formatMessage({ id: 'thongtincanhan.form.dantoc.place' })}
		/>
	);
};

export default SelectDanToc;
