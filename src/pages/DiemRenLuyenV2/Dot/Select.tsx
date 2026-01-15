import { Empty, Select, Spin } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const SelectDotDiemRenLuyen = (props: {
	value?: string | string[];
	onChange?: (val: string | string[] | null, option: any) => void;
	multiple?: boolean;
	disabled?: boolean;
	style?: React.CSSProperties;
	placeHolder?: string;
	allowClear?: boolean;
	isSetRecord?: boolean;
}): any => {
	const { value, onChange, multiple, disabled, style, placeHolder, allowClear, isSetRecord } = props;
	const { danhSach, getAllModel, loading } = useModel('diemrenluyenv2.dot');
  const intl = useIntl();

	const { danhSach: danhSachHocKy, getAllModel: getAllHocKy } = useModel('daotao.hocky');

	useEffect(() => {
		if (!danhSachHocKy.length) getAllHocKy(false, { ma: -1 });
	}, []);

	useEffect(() => {
		getAllModel(isSetRecord, { kyHoc: -1 });
	}, [isSetRecord]);

	return (
		<Select
			allowClear={allowClear}
			mode={multiple ? 'multiple' : undefined}
			value={value}
			onChange={onChange}
			disabled={disabled}
			notFoundContent={
				loading ? (
					<Spin
						spinning={true}
						tip={intl.formatMessage({ id: 'diemrenluyen.dot.timkiem' })}
						style={{ width: '100%', margin: 10 }}
					/>
				) : (
					<Empty
						image={Empty.PRESENTED_IMAGE_SIMPLE}
						description={intl.formatMessage({ id: 'diemrenluyen.dot.khongcodulieu' })}
					/>
				)
			}
			options={danhSach.map((item) => ({
				key: item._id,
				value: item._id,
				label: `${item?.tenDot}`,
				rawData: item,
			}))}
			showSearch
			optionFilterProp='label'
			placeholder={placeHolder || intl.formatMessage({ id: 'diemrenluyen.dot.placeholder' })}
			style={{ ...style }}
			showArrow
		/>
	);
};

export default SelectDotDiemRenLuyen;
