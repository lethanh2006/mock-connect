import { Spin } from 'antd';
import classNames from 'classnames';
import { ReactNode } from 'react';
import './Statistic.less';

export type StatisticItem = {
	title?: ReactNode;
	value: ReactNode;
	onClick?: () => void;
	selected?: boolean;
};

const Statistic = (props: { data: StatisticItem[]; loading?: boolean }) => {
	const { data, loading = false } = props;

	return (
		<Spin spinning={loading}>
			<div className='cct-statistic'>
				{data.map((item, index) => (
					<div
						key={index}
						className={classNames('cct-statistic__item', {
							'is-clickable': !!item.onClick,
							'is-selected': item.selected,
						})}
						onClick={item.onClick}
					>
						<div className='cct-statistic__label'>
							<div className='cct-statistic__title'>{item.title}</div>
						</div>
						<div className='cct-statistic__value'>{item.value}</div>
					</div>
				))}
			</div>
		</Spin>
	);
};

export default Statistic;
