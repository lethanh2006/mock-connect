import { Checkbox } from '@/components/Icons';
import type { ReactNode } from 'react';

/**
 * Bọc Checkbox vinui (dùng onCheckedChange nhận boolean, không phải event) để tương thích
 * với Form.Item valuePropName='checked' của antd (Form.Item tự inject value/onChange(value)).
 */
const FormCheckbox = ({
	checked,
	onChange,
	disabled,
	children,
}: {
	checked?: boolean;
	onChange?: (checked: boolean) => void;
	disabled?: boolean;
	children?: ReactNode;
}) => (
	<label className='form-checkbox-label'>
		<Checkbox checked={checked} onCheckedChange={onChange} disabled={disabled} />
		{children}
	</label>
);

export default FormCheckbox;
