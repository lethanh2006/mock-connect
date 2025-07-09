export type TPreviewFileProps = {
	/** Đường dẫn file (hoặc idFile) */
	file: string | string[];
	width?: string;
	/** Nếu PreviewFile đứng một mình nên để height 600px, mặc định đang để full 100% không scroll */
	height?: string;
	children?: React.ReactElement;
	ip?: string;
	tenFile?: string | string[];

	/** File truyền vào là id File */
	isFileId?: boolean;

	style?: React.CSSProperties;

	// Thêm viewerProps để truyền xuống PDFViewerV2
	/** Truyền plugins [] nếu không chỉ muốn view pdf vào không hiển thị chức nào nào */
	viewerProps?: Partial<Omit<ViewerProps, 'fileUrl'>>;
};
