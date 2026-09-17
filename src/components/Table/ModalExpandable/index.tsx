import { Button, Dialog, DialogContent, IconArrowdownSquare, IconButton, IconXmark } from '@/components/Icons';
import { type VinuniButtonVariant } from '@/components/Table/utils/vinuniAdapters';
import classNames from 'classnames';
import { useState } from 'react';
import './style.less';

/** Props được phép truyền vào nút OK / nút Hủy trong footer mặc định */
export interface ModalButtonProps {
	hidden?: boolean;
	disabled?: boolean;
	loading?: boolean;
	/** VinUni Button variant. Mặc định OK: 'default', Cancel: 'outline' */
	variant?: VinuniButtonVariant;
	className?: string;
	style?: React.CSSProperties;
}

export interface ModalExpandableProps {
	children?: ((isExpand: boolean) => React.ReactNode) | React.ReactNode;
	/** Có hiển thị full screen ko? Mặc định: Không */
	fullScreen?: boolean;
	open?: boolean;
	onCancel?: (e?: any) => void;
	title?: React.ReactNode;
	width?: number | string;
	maskClosable?: boolean;
	destroyOnClose?: boolean;
	className?: string;
	styles?: { body?: React.CSSProperties };
	loading?: boolean;
	/**
	 * Truyền `null` để ẩn hoàn toàn footer.
	 * Truyền ReactNode để hiển thị nội dung tùy chỉnh.
	 * Không truyền (undefined) + có `onOk` → tự render footer mặc định.
	 */
	footer?: React.ReactNode | null;
	allowExpand?: boolean;
	/** Text nút OK (mặc định: 'OK') */
	okText?: React.ReactNode;
	/** Text nút Đóng/Cancel (mặc định: 'Đóng') */
	cancelText?: React.ReactNode;
	/** Props bổ sung cho nút OK. Dùng `hidden: true` để ẩn hoàn toàn. */
	okButtonProps?: ModalButtonProps;
	/** Props bổ sung cho nút Hủy. Dùng `hidden: true` để ẩn hoàn toàn. */
	cancelButtonProps?: ModalButtonProps;
	/** Handler khi bấm OK — khi truyền prop này, footer mặc định tự hiện */
	onOk?: (e?: any) => void;
}

const ModalExpandable = (props: ModalExpandableProps) => {
	const [isExpanded, setIsExpanded] = useState(false);
	const {
		children,
		fullScreen,
		open,
		onCancel,
		title,
		width,
		maskClosable,
		destroyOnClose,
		className,
		styles,
		footer,
		allowExpand = true,
		okText = 'OK',
		cancelText = 'Đóng',
		okButtonProps,
		cancelButtonProps,
		onOk,
	} = props;

	const isFull = isExpanded || fullScreen;

	/** Footer mặc định: nút Đóng bên trái + nút OK bên phải (nếu onOk được truyền) */
	const renderDefaultFooter = () => {
		const { hidden: okHidden, variant: okVariant = 'default', ...okRest } = okButtonProps ?? {};
		const { hidden: cancelHidden, variant: cancelVariant = 'outline', ...cancelRest } = cancelButtonProps ?? {};
		return (
			<div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
				{!cancelHidden && (
					<Button type='button' variant={cancelVariant} onClick={onCancel} {...cancelRest}>
						{cancelText}
					</Button>
				)}
				{!okHidden && onOk && (
					<Button type='button' variant={okVariant} onClick={onOk} {...okRest}>
						{okText}
					</Button>
				)}
			</div>
		);
	};

	/**
	 * footer === null    → không render footer
	 * footer = ReactNode → render custom
	 * footer = undefined + onOk → render footer mặc định
	 * footer = undefined, không có onOk → không render footer
	 */
	const footerContent = footer === null ? null : footer !== undefined ? footer : onOk ? renderDefaultFooter() : null;

	return (
		<Dialog
			open={open}
			onOpenChange={(next) => {
				if (!next) onCancel?.();
			}}
		>
			<DialogContent
				showCloseButton={false}
				className={classNames('modal-expandable', { 'modal-full': isFull }, className)}
				style={
					isFull
						? {
								width: '100vw',
								maxWidth: '100vw',
								height: '100vh',
								maxHeight: '100vh',
								borderRadius: 0,
								inset: 0,
								top: 0,
								left: 0,
								transform: 'none',
								translate: 'none',
						  }
						: { width: width ?? 600, maxWidth: 'calc(100vw - 2rem)' }
				}
				onPointerDownOutside={(e) => {
					const target = ((e as any)?.detail?.originalEvent?.target || (e as any)?.target) as HTMLElement | null;
					if (
						target?.closest?.(
							'.ant-select-dropdown, .ant-picker-dropdown, .ant-dropdown, .ant-popover, .ant-tooltip, .ant-cascader-dropdown, .ant-tree-select-dropdown, .ant-color-picker-dropdown, .ant-tour, .ant-message, .ant-notification, .ant-modal-wrap'
						)
					) {
						e.preventDefault();
						return;
					}
					if (!maskClosable) e.preventDefault();
				}}
				onInteractOutside={(e) => {
					const target = ((e as any)?.detail?.originalEvent?.target || (e as any)?.target) as HTMLElement | null;
					if (
						target?.closest?.(
							'.ant-select-dropdown, .ant-picker-dropdown, .ant-dropdown, .ant-popover, .ant-tooltip, .ant-cascader-dropdown, .ant-tree-select-dropdown, .ant-color-picker-dropdown, .ant-tour, .ant-message, .ant-notification, .ant-modal-wrap'
						)
					) {
						e.preventDefault();
						return;
					}
					if (!maskClosable) e.preventDefault();
				}}
				key={destroyOnClose ? String(open) : undefined}
			>
				{title ? <div className='modal-expandable-title'>{title}</div> : null}
				<div className='modal-expandable-body' style={styles?.body}>
					{typeof children === 'function' ? children(isExpanded) : children}
				</div>
				{footerContent ? <div className='modal-expandable-footer'>{footerContent}</div> : null}

				<div className='modal-buttons'>
					{!fullScreen && allowExpand && (
						<IconButton
							label={isExpanded ? 'Thu nhỏ' : 'Phóng to'}
							variant='ghost'
							onClick={() => setIsExpanded((expand) => !expand)}
							className='button'
						>
							<IconArrowdownSquare />
						</IconButton>
					)}

					<IconButton label='Đóng' variant='ghost' onClick={() => onCancel?.()} className='button'>
						<IconXmark />
					</IconButton>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default ModalExpandable;

// Modal "trơn" — ẩn nút phóng to/thu nhỏ theo mặc định (allowExpand=false), dùng cho các chỗ chỉ
// cần 1 modal thường (form, xác nhận...) mà không cần tính năng expand-fullscreen. Vẫn cho phép
// truyền allowExpand={true} nếu chỗ nào sau này cần bật lại.
export const Modal: React.FC<ModalExpandableProps> = ({ allowExpand = false, ...props }) => (
	<ModalExpandable {...props} allowExpand={allowExpand} />
);
