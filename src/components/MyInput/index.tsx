import {
	IconEye,
	IconEyeSlash,
	Input as VinInput,
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
	Textarea,
} from '@/components/Icons';
import { useState, type ComponentProps, type CSSProperties, type ReactNode } from 'react';

/**
 * Bọc Input/Textarea của vinui theo API antd Input (kể cả compound `Input.TextArea`,
 * `Input.Password`) để cắm thẳng vào Form.Item và các phân hệ pull code base này về chỉ cần đổi
 * `import { Input } from 'antd'` thành `import Input from '@/components/MyInput'`.
 *
 * `MyInput`/`MyInput.TextArea` không cần adapter — native input/textarea trả `onChange(e)` với
 * `e.target.value` là string, đúng y hệt convention Form.Item và antd Input.
 *
 * `prefix`/`suffix` (icon trong ô input) dựng bằng `InputGroup` của vinui (không có sẵn trong
 * `<Input>` trần). `Input.Password` tự thêm nút mắt bật/tắt hiện mật khẩu bằng `InputGroup` vì
 * vinui chưa có field Password riêng.
 *
 * Props antd Input CỐ Ý KHÔNG hỗ trợ (dùng đến thì mở rộng file này trước, đừng đoán mò):
 * - `size` ('small'/'middle'/'large'): vinui field chỉ có 1 cỡ cố định, prop này bị bỏ qua.
 * - `addonBefore`/`addonAfter` (text/select gắn liền viền ngoài, khác `prefix`/`suffix` là icon
 *   trong viền): chưa dựng, `InputGroup` có thể làm được nhưng chưa có nhu cầu.
 * - `allowClear`, `count` (đếm ký tự), `bordered`/`variant='borderless'`: chưa có nhu cầu dùng.
 *
 * `InputNumber` (export riêng cùng file này, antd cũng để `InputNumber` là export ngang hàng chứ
 * không phải `Input.Number`) — vinui không có field số riêng, dùng `<input type='number'>` nhưng
 * phải tự parse lại thành `number` vì input HTML native trả string qua onChange, khác antd
 * InputNumber (đã trả sẵn number). Không hỗ trợ formatter/parser (dấu phân cách nghìn), controls.
 */
export type MyInputProps = Omit<ComponentProps<'input'>, 'prefix' | 'size'> & {
	prefix?: ReactNode;
	suffix?: ReactNode;
	size?: 'small' | 'middle' | 'large';
};

const MyInput = ({ prefix, suffix, size: _size, className, ...props }: MyInputProps) => {
	if (!prefix && !suffix) return <VinInput className={className} {...props} />;
	return (
		<InputGroup className={className}>
			{prefix ? <InputGroupAddon>{prefix}</InputGroupAddon> : null}
			<InputGroupInput {...props} />
			{suffix ? <InputGroupAddon align='inline-end'>{suffix}</InputGroupAddon> : null}
		</InputGroup>
	);
};

const MyTextArea = ({
	size: _size,
	...props
}: Omit<ComponentProps<'textarea'>, 'size'> & { size?: 'small' | 'middle' | 'large' }) => <Textarea {...props} />;

const MyPassword = ({ prefix, size: _size, className, ...props }: MyInputProps) => {
	const [visible, setVisible] = useState(false);
	return (
		<InputGroup className={className}>
			{prefix ? <InputGroupAddon>{prefix}</InputGroupAddon> : null}
			<InputGroupInput type={visible ? 'text' : 'password'} {...props} />
			<InputGroupAddon align='inline-end'>
				<InputGroupButton
					type='button'
					tabIndex={-1}
					aria-label={visible ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
					onClick={() => setVisible((v) => !v)}
				>
					{visible ? <IconEyeSlash size={16} /> : <IconEye size={16} />}
				</InputGroupButton>
			</InputGroupAddon>
		</InputGroup>
	);
};

MyInput.TextArea = MyTextArea;
MyInput.Password = MyPassword;

export type MyInputNumberProps = {
	value?: number | null;
	onChange?: (value: number | null) => void;
	placeholder?: string;
	disabled?: boolean;
	min?: number;
	max?: number;
	step?: number;
	className?: string;
	style?: CSSProperties;
};

export const InputNumber = ({ value, onChange, ...props }: MyInputNumberProps) => (
	<VinInput
		type='number'
		value={value ?? ''}
		onChange={(e) => {
			const raw = e.target.value;
			onChange?.(raw === '' ? null : Number(raw));
		}}
		{...props}
	/>
);

export default MyInput;
