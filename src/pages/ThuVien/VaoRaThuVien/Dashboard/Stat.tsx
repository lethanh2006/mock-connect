import { inputFormat } from '@/utils/utils';
import { Col, Row } from 'antd';
import _ from 'lodash';
import { useModel } from 'umi';

const StatVaoRaThuVien = () => {
	const { thongKeVaoRa } = useModel('thuvien.vaorathuvien');
	const sum = _.sumBy(thongKeVaoRa, (i) => i.totalCI);
	const lastOne = thongKeVaoRa.at(-1);
	const almostLast = thongKeVaoRa.at(-2);
	const compare = almostLast?.totalCI
		? Math.round((((lastOne?.totalCI ?? 0) - almostLast.totalCI) * 100) / almostLast.totalCI)
		: undefined;

	return (
		<Row gutter={8} className='row-thu-vien'>
			<Col span={12}>
				<div className='number'>{lastOne ? inputFormat(lastOne.totalCI ?? 0) : '--'}</div>
				<div className='text'>
					{lastOne ? (
						<>
							Tháng {lastOne.thang + 1}/{lastOne.nam % 100}
							{compare !== undefined ? (
								<>
									{' '}
									(
									<span className={compare > 0 ? 'text-success' : 'text-error'}>
										{compare > 0 ? '↑' : '↓'} {Math.abs(compare)}%
									</span>
									)
								</>
							) : null}
						</>
					) : null}
				</div>
			</Col>

			<Col span={12}>
				<div className='number text-primary'>{inputFormat(sum)}</div>
				<div className='text'>Tổng số</div>
			</Col>
		</Row>
	);
};

export default StatVaoRaThuVien;
