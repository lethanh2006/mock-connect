import { Select } from 'antd';
import type { SizeType } from 'antd/lib/config-provider/SizeContext';
import { useEffect } from 'react';
import { useModel } from 'umi';

const SelectSongNganh = (props: {
	style?: React.CSSProperties;
	disabled?: boolean;
	value?: string;
	onChange?: (val: string) => void;
	hideSelect?: boolean;
	size?: SizeType;
}) => {
	const { style, disabled, value, onChange, hideSelect, size } = props;
	const { getKhoaNganhMeModel, khoaNganhMe, loading } = useModel('sinhvien.sinhvien');

	useEffect(() => {
		getKhoaNganhMeModel().then((response) => {
			if (onChange && !value) onChange(response?.khoaNganhChinh?.ma);
		});
	}, []);

	if (hideSelect && !khoaNganhMe?.khoaNganhPhu?.ma) return null;
	return (
		<Select
			loading={loading}
			size={size}
			disabled={disabled}
			placeholder='Chọn ngành đào tạo'
			value={value}
			style={{ width: '100%', ...style }}
			options={
				khoaNganhMe?.khoaNganhPhu
					? [
							{
								value: khoaNganhMe?.khoaNganhChinh?.ma,
								label: `${khoaNganhMe?.khoaNganhChinh?.ten}`,
							},
							{
								value: khoaNganhMe?.khoaNganhPhu?.ma,
								label: `${khoaNganhMe?.khoaNganhPhu?.ten}`,
							},
					  ]
					: [
							{
								value: khoaNganhMe?.khoaNganhChinh?.ma,
								label: `${khoaNganhMe?.khoaNganhChinh?.ten}`,
							},
					  ]
			}
			onChange={(val) => onChange?.(val)}
		/>
	);
};

export default SelectSongNganh;
