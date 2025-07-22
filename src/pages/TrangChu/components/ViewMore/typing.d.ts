/**
 * Props cho component XemTatCaLink
 */
export interface XemTatCaLinkProps {
	/**
	 * Đường dẫn điều hướng khi click
	 * @example '/dich-vu/tat-ca'
	 */
	to?: string;

	/**
	 * Nhãn hiển thị trong nút
	 * @default 'Xem tất cả'
	 */
	label?: string;

	/**
	 * Callback khi click vào link (tùy chọn)
	 */
	onClick?: () => void;

	/**
	 * Màu chữ
	 * @default '#007aff'
	 */
	color?: string;

	/**
	 * Màu nền
	 * @default '#d8ecff'
	 */
	backgroundColor?: string;

	/**
	 * Cỡ chữ
	 * @default 14
	 */
	fontSize?: number;
}
