import { Empty, Select, Spin } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const SelectMinhChung = (props: {
	value?: string | string[];
	onChange?: (val: string | string[] | null, option: any) => void;
	multiple?: boolean;
	disabled?: boolean;
	style?: React.CSSProperties;
	placeHolder?: string;
	allowClear?: boolean;
	isSetRecord?: boolean;
	isSuKien?: boolean;
}): any => {
	const { value, onChange, multiple, disabled, style, placeHolder, allowClear, isSetRecord, isSuKien } = props;
	const { danhSach, getAllModel, loading } = useModel('diemrenluyenv2.minhchung.cauhinh');
	const intl = useIntl();

	useEffect(() => {
		getAllModel(isSetRecord, undefined, isSuKien ? { dungChoSuKien: true } : undefined);
	}, [isSuKien]);

	return (
		<Select
			allowClear={allowClear}
			mode={multiple ? 'multiple' : undefined}
			value={value}
			onChange={onChange}
			disabled={disabled}
			notFoundContent={
				loading ? (
					<Spin spinning={true} tip={intl.formatMessage({ id: 'diemrenluyen.minhchung.timkiem' })} style={{ width: '100%', margin: 10 }} />
				) : (
					<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={intl.formatMessage({ id: 'diemrenluyen.minhchung.khongcodulieu' })} />
				)
			}
			options={danhSach.map((item) => ({
				key: item._id,
				value: item._id,
				label: `${item?.tenMinhChung}`,
				rawData: item,
			}))}
			showSearch
			optionFilterProp='label'
			placeholder={placeHolder || intl.formatMessage({ id: 'diemrenluyen.minhchung.chon' })}
			style={{ ...style }}
			showArrow
		/>
	);
};

export default SelectMinhChung;
