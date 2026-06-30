import { KhoaNganh } from '@/services/DaoTao/KhoaNganh/typing';
import { Select } from 'antd';
import type { SizeType } from 'antd/lib/config-provider/SizeContext';
import { useEffect } from 'react';
import { getLocale, useIntl, useModel } from 'umi';

const SelectSongNganh = (props: {
	style?: React.CSSProperties;
	disabled?: boolean;
	value?: string;
	onChange?: (val: string) => void;
	hideSelect?: boolean;
	size?: SizeType;
}) => {
	const intl = useIntl();
	const locale = getLocale();
	const { style, disabled, value, onChange, hideSelect, size } = props;
	const { getKhoaNganhMeModel, khoaNganhMe, loading } = useModel('sinhvien.sinhvien');
	const getTenNganh = (khoaNganh?: KhoaNganh.IRecord) =>
		locale === 'vi-VN'
			? (khoaNganh?.nganh?.ten ?? khoaNganh?.nganh?.tenTiengAnh ?? khoaNganh?.ten)
			: (khoaNganh?.nganh?.tenTiengAnh ?? khoaNganh?.nganh?.ten ?? khoaNganh?.ten);

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
								label: getTenNganh(khoaNganhMe?.khoaNganhChinh),
							},
							{
								value: khoaNganhMe?.khoaNganhPhu?.ma,
								label: getTenNganh(khoaNganhMe?.khoaNganhPhu),
							},
						]
					: [
							{
								value: khoaNganhMe?.khoaNganhChinh?.ma,
								label: getTenNganh(khoaNganhMe?.khoaNganhChinh),
							},
						]
			}
			onChange={(val) => onChange?.(val)}
		/>
	);
};

export default SelectSongNganh;
