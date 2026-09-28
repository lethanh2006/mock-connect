import { Button, IconFilter, IconXmark } from '@/components/Icons';
import { useIntl } from 'umi';
import './style.less';

interface ModalFooterProps {
	onReset: () => void;
	onCancel: () => void;
}

export const ModalFooter = ({ onReset, onCancel }: ModalFooterProps) => {
	const intl = useIntl();

	return (
		<div className='filter-footer'>
			<Button variant='default' type='submit' icon={<IconFilter />} form='custom-filter-form'>
				{intl.formatMessage({ id: 'global.table.customfilter.button.apdung' })}
			</Button>
			<Button
				variant='outline'
				type='button'
				className='filter-footer-danger'
				icon={<IconXmark />}
				onClick={onReset}
			>
				{intl.formatMessage({ id: 'global.table.customfilter.button.xoa' })}
			</Button>
			<Button variant='outline' type='button' onClick={onCancel}>
				{intl.formatMessage({ id: 'global.table.customfilter.button.huy' })}
			</Button>
		</div>
	);
};
