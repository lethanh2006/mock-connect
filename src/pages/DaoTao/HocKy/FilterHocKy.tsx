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
}) => {
	const { record: recHocKy, danhSach: danhSachHocKy, setRecord: setHocKy } = useModel('daotao.hocky');
	const width = props.width ?? 250;

	return (
		<Space wrap style={props.style}>
			<SelectHocKy
				style={{ width }}
				allowClear={props.allowClear}
				value={recHocKy?._id}
				onChange={(val) => setHocKy(danhSachHocKy.find((item) => item._id === val))}
				isSetRecord={props.isSetHocKy && !recHocKy?._id}
				fromLhc={props.fromLhc}
			/>

			{props.children}
		</Space>
	);
};

export default FilterHocKy;
