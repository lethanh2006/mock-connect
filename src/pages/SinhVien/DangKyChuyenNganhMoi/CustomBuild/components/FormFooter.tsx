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
	loading?: boolean;
	submitLoading?: boolean;
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
	loading = false,
	submitLoading = false,
}: FormFooterProps) => {
	const intl = useIntl();

	const defaultNextText = intl.formatMessage({ id: 'minor.idm.button.next' });
	const defaultSubmitText = intl.formatMessage({ id: 'minor.idm.button.submit' });
	const defaultSaveDraftText = intl.formatMessage({ id: 'minor.idm.button.saveDraft' });

	return (
		<div className='form-footer'>
			{onNext && (
				<Button type='primary' onClick={onNext} loading={loading}>
					{nextText || defaultNextText}
				</Button>
			)}
			{onSubmit && (
				<Popconfirm
					title={intl.formatMessage({ id: 'minor.popconfirm.submit' })}
					okText={intl.formatMessage({ id: 'minor.popconfirm.ok' })}
					cancelText={intl.formatMessage({ id: 'minor.popconfirm.cancel' })}
					onConfirm={onSubmit}
					disabled={submitLoading}
				>
					<Button type='primary' loading={submitLoading}>
						{submitText || defaultSubmitText}
					</Button>
				</Popconfirm>
			)}
			{onSaveDraft && (
				<Button onClick={onSaveDraft} loading={loading}>
					{saveDraftText || defaultSaveDraftText}
				</Button>
			)}
			{showPrevious && onPrevious && (
				<Button onClick={onPrevious} disabled={loading || submitLoading}>
					{intl.formatMessage({ id: 'minor.idm.button.previous' })}
				</Button>
			)}
		</div>
	);
};

export default FormFooter;
