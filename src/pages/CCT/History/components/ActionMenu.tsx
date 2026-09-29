import { Icon3DotVertical, IconSend, IconTrash } from '@/components/Icons';
import {
	Button,
	ConfirmDialog,
	ConfirmDialogAction,
	ConfirmDialogActions,
	ConfirmDialogCancel,
	ConfirmDialogContent,
	ConfirmDialogHeader,
	ConfirmDialogTitle,
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@vinuni/ui';
import { useState } from 'react';
import { useIntl } from 'umi';

type TAction = 'submit' | 'delete';

const ActionMenu = (props: { canSubmit: boolean; canDelete: boolean; onSubmit: () => void; onDelete: () => void }) => {
	const { canSubmit, canDelete, onSubmit, onDelete } = props;
	const intl = useIntl();
	const [openMenu, setOpenMenu] = useState(false);
	const [confirmAction, setConfirmAction] = useState<TAction>();

	const openConfirm = (action: TAction) => {
		setOpenMenu(false);
		setConfirmAction(action);
	};

	return (
		<>
			<Popover open={openMenu} onOpenChange={setOpenMenu}>
				<PopoverTrigger asChild>
					<Button variant='outline' className='activity-figma-card__more' icon={<Icon3DotVertical />} />
				</PopoverTrigger>
				<PopoverContent align='end' className='action-popover'>
					<Button
						className='action-popover__item'
						disabled={!canSubmit}
						variant='ghost'
						icon={<IconSend />}
						size='sm'
						onClick={() => openConfirm('submit')}
					>
						{intl.formatMessage({ id: 'activity.history.button.duyet' })}
					</Button>
					<Button
						className='action-popover__item'
						disabled={!canDelete}
						variant='ghost-destructive'
						icon={<IconTrash />}
						size='sm'
						onClick={() => openConfirm('delete')}
					>
						{intl.formatMessage({ id: 'activity.history.button.xoa' })}
					</Button>
				</PopoverContent>
			</Popover>

			<ConfirmDialog open={!!confirmAction} onOpenChange={(open) => !open && setConfirmAction(undefined)}>
				<ConfirmDialogContent>
					<ConfirmDialogHeader>
						<ConfirmDialogTitle>
							{intl.formatMessage({
								id: confirmAction === 'delete' ? 'activity.history.confirm.xoa' : 'activity.history.confirm.duyet',
							})}
						</ConfirmDialogTitle>
					</ConfirmDialogHeader>
					<ConfirmDialogActions>
						<ConfirmDialogAction
							variant={confirmAction === 'delete' ? 'destructive' : 'default'}
							onClick={() => (confirmAction === 'delete' ? onDelete() : onSubmit())}
						>
							{intl.formatMessage({ id: 'global.button.xacnhan' })}
						</ConfirmDialogAction>
						<ConfirmDialogCancel>{intl.formatMessage({ id: 'global.button.huy' })}</ConfirmDialogCancel>
					</ConfirmDialogActions>
				</ConfirmDialogContent>
			</ConfirmDialog>
		</>
	);
};

export default ActionMenu;
