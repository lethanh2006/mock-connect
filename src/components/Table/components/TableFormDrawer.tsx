import { Drawer, DrawerContent, IconButton, IconXmark } from '@/components/Icons';
import React from 'react';
import { useTableContext } from './TableContext';

export const TableFormDrawer: React.FC = () => {
	const { Form, visibleForm, setVisibleForm, title, widthDrawer, maskCloseableForm, destroyModal, formProps } =
		useTableContext();

	if (!Form) return null;

	const width = widthDrawer === 'full' ? '100vw' : typeof widthDrawer === 'number' ? `${widthDrawer}px` : '520px';

	return (
		<Drawer
			direction='right'
			open={visibleForm}
			onOpenChange={(open) => {
				if (!open) setVisibleForm?.(false);
			}}
			dismissible={maskCloseableForm || false}
		>
			<DrawerContent style={{ width, maxWidth: '100vw' }} key={destroyModal ? String(visibleForm) : undefined}>
				<Form title={title ?? ''} {...formProps} />

				<div className='modal-buttons'>
					<IconButton label='Đóng' variant='ghost' onClick={() => setVisibleForm?.(false)} className='button'>
						<IconXmark />
					</IconButton>
				</div>
			</DrawerContent>
		</Drawer>
	);
};
