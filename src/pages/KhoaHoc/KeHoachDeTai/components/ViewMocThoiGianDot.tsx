import {
	EMocThoiGianDot,
	MapKeyFieldMocThoiGianDot,
	MapKeyNameMocThoiGianDot,
} from '@/services/KhoaHoc/KeHoachDeTai/constants';
import type { KeHoachDeTai } from '@/services/KhoaHoc/KeHoachDeTai/typings';
import { LoadingOutlined } from '@ant-design/icons';
import { Timeline } from 'antd';
import moment from 'moment';

const ViewMocThoiGianDot = (props: { rec: KeHoachDeTai.IRecord }) => {
	const { rec }: any = props;

	return (
		<Timeline>
			{Object.values(EMocThoiGianDot).map((item) => {
				const isPass = moment().isAfter(moment(rec?.[MapKeyFieldMocThoiGianDot[item][1]]));
				const isFuture = moment().isBefore(moment(rec?.[MapKeyFieldMocThoiGianDot[item][0]]));

				return (
					<Timeline.Item
						key={item}
						dot={!isPass && !isFuture ? <LoadingOutlined /> : undefined}
						color={isPass ? 'green' : isFuture ? 'gray' : 'blue'}
					>
						<div>
							<div>{MapKeyNameMocThoiGianDot[item]}</div>
							<div>
								{moment(rec?.[MapKeyFieldMocThoiGianDot[item][0]]).format('DD/MM/YYYY')} -{' '}
								{moment(rec?.[MapKeyFieldMocThoiGianDot[item][1]]).format('DD/MM/YYYY')}
							</div>
						</div>
					</Timeline.Item>
				);
			})}
		</Timeline>
	);
};

export default ViewMocThoiGianDot;
