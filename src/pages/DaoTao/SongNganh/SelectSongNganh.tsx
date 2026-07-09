import { getLocalizedName } from '@/utils/localeName';
import { Select } from 'antd';
import type { SizeType } from 'antd/lib/config-provider/SizeContext';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const SelectSongNganh = (props: {
	style?: React.CSSProperties;
	disabled?: boolean;
	value?: string;
	onChange?: (val: string) => void;
	hideSelect?: boolean;
	size?: SizeType;
}) => {
	const intl = useIntl();
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
			placeholder={intl.formatMessage({ id: 'tientrinhhoctap.songnganh' })}
			value={value}
			style={{ width: '100%', ...style }}
			options={
				khoaNganhMe?.khoaNganhPhu
					? [
							{
								value: khoaNganhMe?.khoaNganhChinh?.ma,
								label: getLocalizedName(khoaNganhMe?.khoaNganhChinh.nganh),
							},
							{
								value: khoaNganhMe?.khoaNganhPhu?.ma,
								label: getLocalizedName(khoaNganhMe?.khoaNganhPhu.nganh),
							},
						]
					: [
							{
								value: khoaNganhMe?.khoaNganhChinh?.ma,
								label: getLocalizedName(khoaNganhMe?.khoaNganhChinh.nganh),
							},
						]
			}
			onChange={(val) => onChange?.(val)}
		/>
	);
};

export default SelectSongNganh;
