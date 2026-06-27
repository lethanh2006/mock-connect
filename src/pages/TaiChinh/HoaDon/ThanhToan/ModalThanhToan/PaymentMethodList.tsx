import { EOnepayCard, titleOnepayCard } from '@/services/TaiChinh/KenhThanhToan/constants';
import { KenhThanhToan } from '@/services/TaiChinh/KenhThanhToan/typing';
import { Collapse, Image, Spin } from 'antd';
import clsx from 'clsx';
import React from 'react';
import { useIntl } from 'umi';
import './style.less';
import type { PaymentMethodListProps } from './typing';

const PaymentMethodList: React.FC<PaymentMethodListProps> = ({ methods, selectedMethod, onChange, loading }) => {
	const intl = useIntl();

	const getKenhThanhToanByPhuongThucTT = (method: KenhThanhToan.IRecord) => {
		const label =
			method.phuongThucThanhToan === 'ONEPAY'
				? titleOnepayCard?.[method?.onepayCard as EOnepayCard]
				: method.tenNganHang;

		return label;
	};

	const groupedMethods = methods.reduce(
		(acc, method) => {
			const group = method.phuongThucThanhToan;
			if (!acc[group]) {
				acc[group] = [];
			}
			acc[group].push(method);
			return acc;
		},
		{} as Record<'ONEPAY' | 'NGAN_HANG', KenhThanhToan.IRecord[]>,
	);
	console.log('groupedMethods', groupedMethods);

	return (
		<div className='payment-sidebar'>
			<div className='payment-sidebar__title'>{intl.formatMessage({ id: 'taichinh.thanhtoan.modal.phuongthuc' })}</div>
			{loading ? (
				<div className='payment-sidebar__loading'>
					<Spin />
				</div>
			) : (
				<Collapse
					defaultActiveKey={Object.entries(groupedMethods).map(([groupName]) => groupName)}
					items={Object.entries(groupedMethods).map(([groupName, groupMethods]) => ({
						key: groupName,
						label: groupName,
						children: (
							<>
								{groupMethods.map((method) => (
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
												style={{
													marginRight: 8,
													verticalAlign: 'middle',
												}}
											/>
										)}
										{getKenhThanhToanByPhuongThucTT(method)}
									</div>
								))}
							</>
						),
					}))}
				/>
			)}
		</div>
	);
};

export default React.memo(PaymentMethodList);
