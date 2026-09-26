import { Space } from 'antd';
import { useModel } from 'umi';
import SelectHocKy from './SelectHocKy';

const FilterHocKy = (props: {
	width?: number;
	isSetHocKy?: boolean;
	allowClear?: boolean;
	children?: React.ReactNode;
	style?: React.CSSProperties;
	fromLhc?: boolean;
	onChange?: (val: string) => void;
	selectLatest?: boolean;
}) => {
	const { record: recHocKy, danhSach: danhSachHocKy, setRecord: setHocKy } = useModel('daotao.hocky');

	return (
		<Space wrap className='filter-bar' style={props.style}>
			<SelectHocKy
				className={props.width == null ? 'field-w-250' : undefined}
				style={props.width != null ? { width: props.width } : undefined}
				allowClear={props.allowClear}
				value={recHocKy?._id}
				onChange={(val) => {
					if (props.onChange) props.onChange(val);
					setHocKy(danhSachHocKy.find((item) => item._id === val));
				}}
				isSetRecord={props.isSetHocKy && !recHocKy?._id}
				fromLhc={props.fromLhc}
				selectLatest={props.selectLatest}
			/>

			{props.children}
		</Space>
	);
};

export default FilterHocKy;
