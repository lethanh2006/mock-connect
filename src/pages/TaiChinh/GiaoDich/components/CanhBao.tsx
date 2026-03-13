import { useIntl } from 'umi';

const CanhBaoGiaoDich = () => {
	const intl = useIntl();

	return (
		<div>
			<i>{intl.formatMessage({ id: 'taichinh.thanhtoan.luuy' })}: </i>
			<br />- <b className='text-error'>{intl.formatMessage({ id: 'taichinh.thanhtoan.khonghuy' })}</b>{' '}
			{intl.formatMessage({ id: 'taichinh.thanhtoan.canhbao' })}
			<br />- {intl.formatMessage({ id: 'taichinh.thanhtoan.canhbao1' })}
			<br />-{' '}
			{intl.formatMessage(
				{ id: 'taichinh.thanhtoan.canhbao2' },
				{
					b: (chunks) => <b>{chunks}</b>,
				},
			)}
		</div>
	);
};

export default CanhBaoGiaoDich;
