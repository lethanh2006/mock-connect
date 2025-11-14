import { Space } from 'antd';
import { useModel } from 'umi';
import SelectLopHocPhan from './SelectLopHocPhan';

const FilterLopHocPhan = (props: {
	width?: number;
	isSetHocKy?: boolean;
	allowClear?: boolean;
	children?: React.ReactNode;
	style?: React.CSSProperties;
	fromLhc?: boolean;
	onChange?: (val: string) => void;
	selectLatest?: boolean;
	label?: 'ten' | 'ma';
}) => {
	const { record: recLhp, danhSach: danhSachLhp, setRecord: setLhp } = useModel('lophocphan.lophocphan');
	const width = props.width ?? 250;

	return (
		<Space wrap style={props.style}>
			<SelectLopHocPhan
				style={{ width }}
				allowClear={props.allowClear}
				value={recLhp?._id}
				onChange={(val) => {
					if (props.onChange) props.onChange(val);
					setLhp(danhSachLhp.find((item) => item._id === val));
				}}
				label={props?.label}
				filterHocKy
			/>

			{props.children}
		</Space>
	);
};

export default FilterLopHocPhan;
