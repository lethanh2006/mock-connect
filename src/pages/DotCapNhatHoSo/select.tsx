import { Select } from 'antd';
import { CSSProperties, useEffect } from 'react';
import { useModel } from 'umi';

export const SelectDotCapNhat = (props: {
	value?: string;
	onChange?: any;
	multiple?: boolean;
	style?: CSSProperties;
	isSetRecord?: boolean;
}) => {
	const { value, onChange, multiple, isSetRecord, style } = props;
	const { danhSach, getAllModel, visibleForm } = useModel('daotao.dotcapnhathoso');

	useEffect(() => {
		if (!visibleForm) getAllModel(isSetRecord);
	}, [visibleForm, isSetRecord]);

	return (
		<div style={{ display: 'flex', gap: 8 }}>
			<div className={'fullWidth'}>
				<Select
					style={style}
					mode={multiple ? 'multiple' : undefined}
					value={value}
					onChange={onChange}
					options={danhSach.map((item) => ({
						key: item._id,
						value: item._id,
						label: `${item.tenDot}`,
            rawData:item
					}))}
					showSearch
					optionFilterProp='label'
					placeholder='Chọn đợt'
				/>
			</div>
		</div>
	);
};
