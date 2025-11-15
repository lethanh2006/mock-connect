import FilterHocKy from '@/pages/DaoTao/HocKy/FilterHocKy';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Space, Tooltip } from 'antd';
import { useState } from 'react';
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
	miniHocKy?: boolean; // Nếu true thì ẩn FilterHocKy mặc định
}) => {
	const { record: recLhp, danhSach: danhSachLhp, setRecord: setLhp } = useModel('lophocphan.lophocphan');
	const width = props.width ?? 250;

	// Nếu miniHocKy = true => FilterHocKy ẩn mặc định
	const [showFilterHocKy, setShowFilterHocKy] = useState(!props.miniHocKy);

	return (
		<Space wrap style={props.style} align='center'>
			{/* Toggle FilterHocKy chỉ hiển thị khi miniHocKy = true */}
			{props.miniHocKy && (
				<Tooltip title={showFilterHocKy ? 'Ẩn bộ lọc học kỳ' : 'Hiện bộ lọc học kỳ'}>
					<Button
						type='dashed'
						icon={showFilterHocKy ? <MinusOutlined /> : <PlusOutlined />}
						onClick={() => setShowFilterHocKy(!showFilterHocKy)}
					/>
				</Tooltip>
			)}

			{/* FilterHocKy chỉ hiện khi showFilterHocKy = true */}
			{showFilterHocKy && <FilterHocKy isSetHocKy />}

			{/* SelectLopHocPhan luôn hiện */}
			<SelectLopHocPhan
				style={{ width }}
				allowClear={props.allowClear}
				value={recLhp?._id}
				onChange={(val) => {
					if (props.onChange) props.onChange(val);
					setLhp(danhSachLhp.find((item) => item._id === val));
				}}
				label={props.label}
			/>

			{props.children}
		</Space>
	);
};

export default FilterLopHocPhan;
