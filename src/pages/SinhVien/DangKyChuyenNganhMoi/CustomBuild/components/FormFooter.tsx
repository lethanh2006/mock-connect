import { Button, Popconfirm } from 'antd';
import { useIntl } from 'umi';

interface FormFooterProps {
	showPrevious?: boolean;
	onPrevious?: () => void;
	onNext?: () => void;
	onSubmit?: () => void;
	onSaveDraft?: () => void;
	nextText?: string;
	submitText?: string;
	saveDraftText?: string;
}

const FormFooter = ({
	showPrevious = false,
	onPrevious,
	onNext,
	onSubmit,
	onSaveDraft,
	nextText,
	submitText,
	saveDraftText,
}: FormFooterProps) => {
	const intl = useIntl();

	const defaultNextText = intl.formatMessage({ id: 'minor.idm.button.next' });
	const defaultSubmitText = intl.formatMessage({ id: 'minor.idm.button.submit' });
	const defaultSaveDraftText = intl.formatMessage({ id: 'minor.idm.button.saveDraft' });

	return (
		<div className='form-footer'>
			{onNext && (
				<Button type='primary' onClick={onNext}>
					{nextText || defaultNextText}
				</Button>
			)}
			{onSubmit && (
				<Popconfirm
					title={intl.formatMessage({ id: 'minor.popconfirm.submit' })}
					okText={intl.formatMessage({ id: 'minor.popconfirm.ok' })}
					cancelText={intl.formatMessage({ id: 'minor.popconfirm.cancel' })}
					onConfirm={onSubmit}
				>
					<Button type='primary'>{submitText || defaultSubmitText}</Button>
				</Popconfirm>
			)}
			{onSaveDraft && (
				<Button onClick={onSaveDraft}>{saveDraftText || defaultSaveDraftText}</Button>
			)}
			{showPrevious && onPrevious && (
				<Button onClick={onPrevious}>{intl.formatMessage({ id: 'minor.idm.button.previous' })}</Button>
			)}
		</div>
	);
};

export default FormFooter;
