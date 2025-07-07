import { Empty, Select, Spin } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

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
					<Spin spinning={true} tip='Đang tìm kiếm...' style={{ width: '100%', margin: 10 }} />
				) : (
					<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='Không có dữ liệu, hãy thử nhập từ khóa khác!' />
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
			placeholder={placeHolder || 'Lọc theo học kỳ'}
			style={{ ...style }}
			showArrow
		/>
	);
};

export default SelectDotDiemRenLuyen;
