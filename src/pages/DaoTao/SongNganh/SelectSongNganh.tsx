import VinSelect from '@/components/VinSelect';
import { getLocalizedName } from '@/utils/localeName';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const SelectSongNganh = (props: {
	style?: React.CSSProperties;
	className?: string;
	disabled?: boolean;
	value?: string;
	onChange?: (val: string) => void;
	hideSelect?: boolean;
	size?: 'small' | 'middle' | 'large';
}) => {
	const intl = useIntl();
	const { style, className, disabled, value, onChange, hideSelect, size } = props;
	const { getKhoaNganhMeModel, khoaNganhMe, loading } = useModel('sinhvien.sinhvien');

	useEffect(() => {
		getKhoaNganhMeModel().then((response) => {
			if (onChange && !value) onChange(response?.khoaNganhChinh?.ma);
		});
	}, []);

	if (hideSelect && !khoaNganhMe?.khoaNganhPhu?.ma) return null;
	return (
		<VinSelect
			disabled={disabled || loading}
			size={size === 'small' ? 'sm' : 'default'}
			placeholder={intl.formatMessage({ id: 'tientrinhhoctap.songnganh' })}
			value={value}
			className={className ?? (style?.width == null ? 'field-fill' : undefined)}
			style={style}
			options={
				khoaNganhMe?.khoaNganhPhu
					? [
							{
								value: khoaNganhMe.khoaNganhChinh.ma,
								label: getLocalizedName(khoaNganhMe.khoaNganhChinh.nganh),
							},
							{
								value: khoaNganhMe.khoaNganhPhu.ma,
								label: getLocalizedName(khoaNganhMe.khoaNganhPhu.nganh),
							},
						]
					: khoaNganhMe?.khoaNganhChinh
						? [
								{
									value: khoaNganhMe.khoaNganhChinh.ma,
									label: getLocalizedName(khoaNganhMe.khoaNganhChinh.nganh),
								},
							]
						: []
			}
			onChange={(val) => onChange?.((val ?? undefined) as string)}
		/>
	);
};

export default SelectSongNganh;
