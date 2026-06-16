import { Image } from 'antd';
import clsx from 'clsx';
import React from 'react';
import { useIntl } from 'umi';
import './style.less';
import type { PaymentMethodListProps } from './typing';

const PaymentMethodList: React.FC<PaymentMethodListProps> = ({ methods, selectedMethod, onChange }) => {
	const intl = useIntl();

	return (
		<div className='payment-sidebar'>
			<div className='payment-sidebar__title'>{intl.formatMessage({ id: 'taichinh.thanhtoan.modal.phuongthuc' })}</div>
			{methods.map((method) => (
				<div
					key={method._id}
					className={clsx('payment-sidebar__item', {
						'payment-sidebar__item--active': selectedMethod?._id === method._id,
					})}
					onClick={() => onChange(method)}
				>
					{method.icon && (
						<Image
							src={method.icon}
							width={24}
							height={24}
							preview={false}
							style={{ marginRight: 8, verticalAlign: 'middle' }}
						/>
					)}
					{method.tenNganHang || method.code}
				</div>
			))}
		</div>
	);
};

export default React.memo(PaymentMethodList);
