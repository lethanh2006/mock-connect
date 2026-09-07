import { IconFilter, IconXmark } from '@/components/Icons';
import { Button } from 'antd';
import { useIntl } from 'umi';

interface ModalFooterProps {
	onReset: () => void;
	onCancel: () => void;
}

export const ModalFooter = ({ onReset, onCancel }: ModalFooterProps) => {
	const intl = useIntl();

	return [
		<Button key='submit' htmlType='submit' type='primary' icon={<IconFilter />} form='custom-filter-form'>
			{intl.formatMessage({ id: 'global.table.customfilter.button.apdung' })}
		</Button>,
		<Button key='reset' danger icon={<IconXmark />} onClick={onReset}>
			{intl.formatMessage({ id: 'global.table.customfilter.button.xoa' })}
		</Button>,
		<Button key='cancel' onClick={onCancel}>
			{intl.formatMessage({ id: 'global.table.customfilter.button.huy' })}
		</Button>,
	];
};
