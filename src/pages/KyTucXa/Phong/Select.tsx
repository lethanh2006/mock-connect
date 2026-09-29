import { Phong } from '@/services/KyTucXa/Phong/typing';
import VinSelect from '@/components/VinSelect';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

/**
 * Select phong ky tuc xa.
 */
const SelectPhongKTX = (props: {
	value?: string;
	onChange?: (val: string | string[], option: any) => void;
	multiple?: boolean;
	allowClear?: boolean;
	style?: React.CSSProperties;
	isSetRecord?: boolean;
	condition?: Partial<Phong.IChinhSachPhongRecord>;
	disabled?: boolean;
}) => {
	const intl = useIntl();
	const { value, onChange, multiple, allowClear, style, isSetRecord, condition, disabled } = props;
	const { danhSach, getAllModel, loading } = useModel('kytucxa.phong');

	useEffect(() => {
		getAllModel(!!isSetRecord, undefined, { ...condition }, undefined, 'ktx/sinh-vien/available');
	}, [JSON.stringify(condition)]);

	const options = (danhSach || []).map((item) => ({
		key: item._id,
		value: item._id,
		label: item.room?.ten ?? item.room?.ma,
		rawData: item,
	}));

	return (
		<VinSelect
			loading={loading}
			disabled={disabled}
			mode={multiple ? 'multiple' : undefined}
			allowClear={allowClear}
			value={value}
			onChange={onChange}
			options={options}
			showSearch
			optionFilterProp='label'
			placeholder={intl.formatMessage({ id: 'kytucxa.dangky.filter.selectPhong' })}
			style={{ width: '100%', ...style }}
		/>
	);
};

export default SelectPhongKTX;
