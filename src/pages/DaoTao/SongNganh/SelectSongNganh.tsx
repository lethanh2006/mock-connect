import { Select } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const SelectSongNganh = (props: {
	style?: React.CSSProperties;
	disabled?: boolean;
	value?: string;
	onChange?: (val: string) => void;
	hideSelect?: boolean;
}) => {
	const { style, disabled, value, onChange, hideSelect } = props;
	const { getKhoaNganhMeModel, khoaNganhMe, loading } = useModel('sinhvien.sinhvien');

	useEffect(() => {
		if (!khoaNganhMe)
			getKhoaNganhMeModel().then((response) => {
				if (onChange) onChange(response?.khoaNganhChinh?.ma);
			});
	}, []);

	if (hideSelect && !khoaNganhMe?.khoaNganhPhu?.ma) return null;
	return (
		<Select
			loading={loading}
			disabled={disabled}
			placeholder='Chọn ngành đào tạo'
			value={value}
			style={{ width: '100%', ...style }}
			options={
				khoaNganhMe?.khoaNganhPhu
					? [
							{
								value: khoaNganhMe?.khoaNganhChinh?.ma,
								label: `${khoaNganhMe?.khoaNganhChinh?.nganh?.ten}`,
							},
							{
								value: khoaNganhMe?.khoaNganhPhu?.ma,
								label: `${khoaNganhMe?.khoaNganhPhu?.nganh?.ten}`,
							},
					  ]
					: [
							{
								value: khoaNganhMe?.khoaNganhChinh?.ma,
								label: `${khoaNganhMe?.khoaNganhChinh?.nganh?.ten}`,
							},
					  ]
			}
			onChange={(val) => onChange?.(val)}
		/>
	);
};

export default SelectSongNganh;
