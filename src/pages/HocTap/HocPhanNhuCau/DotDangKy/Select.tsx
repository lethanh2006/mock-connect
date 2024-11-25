import { Select } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

/**
 * Secect Căn cứ pháp lý để cho vào FormItem
 */
const SelectDotDangKyHocPhanNhuCau = (props: {
	value?: string;
	onChange?: (val?: string) => void;
	multiple?: boolean;
	allowClear?: boolean;
	style?: React.CSSProperties;
	condition?: { maHocKy?: string };
	isSetRecord?: boolean;
}) => {
	const { value, onChange, multiple, allowClear, style, condition, isSetRecord } = props;
	const { danhSach, getAllModel, loading } = useModel('sinhvien.nhucauhocphan.dotdangky');
	const { record: recHocKy } = useModel('daotao.hocky');
	const { maKhoaNganh } = useModel('sinhvien.sinhvien');

	useEffect(() => {
		if (recHocKy?._id && maKhoaNganh)
			getAllModel(isSetRecord, undefined, condition, undefined, `hoc-ky/${recHocKy?.ma}/khoa-nganh/${maKhoaNganh}/me`);
	}, [JSON.stringify(condition), recHocKy?._id, maKhoaNganh]);

	return (
		<Select
			loading={loading}
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
			placeholder='Chọn đợt đăng ký nhu cầu học phần'
			style={{ width: '100%', ...style }}
		/>
	);
};

export default SelectDotDangKyHocPhanNhuCau;
