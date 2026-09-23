/**
 * Helpers ánh xạ prop kiểu antd (type/size/danger/htmlType) sang variant/size của @vinuni/ui Button,
 * dùng chung cho toàn bộ Table/* khi thay Button antd bằng Button vinuni.
 */

export type AntdButtonType = 'primary' | 'default' | 'dashed' | 'text' | 'link';
export type AntdSize = 'small' | 'middle' | 'large';

export type VinuniButtonVariant =
	| 'default'
	| 'accent-secondary'
	| 'neutral-primary'
	| 'secondary'
	| 'destructive'
	| 'outline'
	| 'ghost'
	| 'link';

export type VinuniButtonSize = 'default' | 'xs' | 'sm' | 'lg' | 'icon' | 'icon-xs' | 'icon-sm' | 'icon-lg';

export const mapButtonVariant = (type?: AntdButtonType, danger?: boolean): VinuniButtonVariant => {
	if (danger) return 'destructive';
	switch (type) {
		case 'primary':
			return 'default';
		case 'text':
			return 'ghost';
		case 'dashed':
			return 'outline';
		case 'link':
			return 'link';
		default:
			// Nút toolbar của table: nền xám nhạt, chữ tối (bg-ds-bg-tiled-md).
			return 'secondary';
	}
};

export const mapButtonSize = (size?: AntdSize, iconOnly?: boolean): VinuniButtonSize => {
	if (iconOnly) {
		if (size === 'small') return 'icon-sm';
		if (size === 'large') return 'icon-lg';
		return 'icon';
	}
	if (size === 'small') return 'sm';
	if (size === 'large') return 'lg';
	return 'default';
};
