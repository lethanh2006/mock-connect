import { Select, type SelectProps } from 'antd';
import { useMemo } from 'react';
import { useIntl } from 'umi';
import { getDialCodeByIso, getIsoByDialCode, getPhoneCountryOptions } from './phoneCountryOptions';

type PhoneCountrySelectProps = Omit<SelectProps<string>, 'value' | 'onChange' | 'options'> & {
	/** Dial code, e.g. '+84' — matches the Form.Item value contract used for this field elsewhere. */
	value?: string;
	onChange?: (dial: string) => void;
};

/**
 * antd's Select needs a unique `value` per option; several countries share a dial code (+1, +7...),
 * so the options here key on ISO alpha-2 while this wrapper converts to/from the plain dial code
 * string at the Form.Item boundary, keeping every other consumer (payload builders, initial values)
 * unaware of ISO codes.
 */
const PhoneCountrySelect = ({ value, onChange, style, ...rest }: PhoneCountrySelectProps) => {
	const intl = useIntl();
	const options = useMemo(() => getPhoneCountryOptions(intl), [intl]);

	return (
		<Select
			style={style ?? { width: 150 }}
			options={options}
			value={getIsoByDialCode(value)}
			onChange={(iso) => onChange?.(getDialCodeByIso(iso) ?? '')}
			showSearch
			optionFilterProp='label'
			{...rest}
		/>
	);
};

export default PhoneCountrySelect;
