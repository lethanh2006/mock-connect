import { ReactNode } from 'react';

/**
 * Interface cho một item thống kê
 * @interface StatisticsItem
 */
export interface StatisticsItem {
	/** Tiêu đề hiển thị của item thống kê */
	title: string;

	/** Giá trị hiển thị, có thể là số hoặc chuỗi (đã format)
	 * @example 100, '1,234 VNĐ', '50%'
	 */
	value: string | number;

	/** Icon hiển thị bên trái item */
	icon: ReactNode;

	/** Màu của giá trị và border trái
	 * @example '#17C229', '#FFAF0B', '#DA2128'
	 */
	valueColor?: string;

	/** Màu nền của card
	 * @example '#EAFFDF', '#fffbe6', '#fff2e8'
	 */
	backgroundColor?: string;

	/** Màu border (tùy chọn)
	 * @example '#b7eb8f', '#ffe58f', '#ffbb96'
	 */
	borderColor?: string;

	/** Trạng thái của item, dùng để xác định màu sắc
	 * @default 'gray'
	 * @example 'success', 'warning', 'error', 'info', 'gray'
	 */
	status?: 'success' | 'warning' | 'error' | 'info' | 'gray';

	/** Hàm callback khi click vào item (tùy chọn) */
	onClick?: () => void;

	/** Hiển thị borderleft 4px (tùy chọn) */
	borderAccent?: boolean;

	/** Hiển thị statShadow (tùy chọn) */
	statShadow?: boolean;
}

/**
 * Props cho StatisticsCard component
 * @interface StatisticsCardProps
 */
export interface StatisticsCardProps {
	/** Tiêu đề của card thống kê */
	title: string;

	/** Mảng dữ liệu thống kê cần hiển thị */
	data: StatisticsItem[];

	/** Trạng thái loading của card
	 * @default false
	 */
	loading?: boolean;

	/** Custom style cho container bên ngoài */
	containerStyle?: React.CSSProperties;

	/** Custom style cho từng card item */
	cardStyle?: React.CSSProperties;

	/** Ẩn card và title tương tự Tablebase */
	hideCard?: boolean;

	/** Cấu hình responsive breakpoints cho columns
	 * @default { xs: 24, sm: 12, md: 8 }
	 * @example { xs: 12, sm: 6, md: 4, lg: 3 }
	 */
	colSpan?: {
		/** Extra small devices (<576px) */
		xs?: number;
		/** Small devices (≥576px) */
		sm?: number;
		/** Medium devices (≥768px) */
		md?: number;
		/** Large devices (≥992px) */
		lg?: number;
		/** Extra large devices (≥1200px) */
		xl?: number;
		/** Extra extra large devices (≥1600px) */
		xxl?: number;
	};
}
