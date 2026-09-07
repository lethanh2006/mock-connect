import { Dialog, DialogContent, IconArrowdownSquare, IconButton, IconXmark } from '@/components/Icons';
import classNames from 'classnames';
import { useState } from 'react';
import './style.less';

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
	footer?: React.ReactNode;
}

const ModalExpandable = (props: ModalExpandableProps) => {
	const [isExpanded, setIsExpanded] = useState(false);
	const { children, fullScreen, open, onCancel, title, width, maskClosable, destroyOnClose, className, styles, footer } =
		props;

	const isFull = isExpanded || fullScreen;

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
						? { width: '100vw', maxWidth: '100vw', height: '100vh', maxHeight: '100vh', borderRadius: 0 }
						: { width: width ?? 600, maxWidth: 'calc(100vw - 2rem)' }
				}
				onInteractOutside={(e) => {
					if (!maskClosable) e.preventDefault();
				}}
				key={destroyOnClose ? String(open) : undefined}
			>
				{title ? <div className='modal-expandable-title'>{title}</div> : null}
				<div style={styles?.body}>{typeof children === 'function' ? children(isExpanded) : children}</div>
				{footer}

				<div className='modal-buttons'>
					{!fullScreen && (
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
