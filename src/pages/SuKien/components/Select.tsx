import { Select } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

export const SelectSuKien = (props: { value?: string; onChange?: any; multiple?: boolean }) => {
	const { value, onChange, multiple } = props;
	const { danhSach, getAllModel, visibleForm } = useModel('sukien');

	useEffect(() => {
		if (!visibleForm) getAllModel();
	}, [visibleForm]);

	return (
		<div style={{ display: 'flex', gap: 8 }}>
			<div className={'fullWidth'}>
				<Select
					mode={multiple ? 'multiple' : undefined}
					value={value}
					onChange={onChange}
					options={danhSach.map((item) => ({
						key: item._id,
						value: item._id,
						label: `${item.tenSuKien}`,
					}))}
					showSearch
					optionFilterProp='label'
					placeholder='Chọn sự kiện'
				/>
			</div>
		</div>
	);
};
