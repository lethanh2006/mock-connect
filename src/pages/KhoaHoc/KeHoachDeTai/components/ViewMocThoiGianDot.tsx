import {
	EMocThoiGianDot,
	MapKeyFieldMocThoiGianDot,
	MapKeyNameMocThoiGianDot,
} from '@/services/KhoaHoc/KeHoachDeTai/constants';
import type { KeHoachDeTai } from '@/services/KhoaHoc/KeHoachDeTai/typings';
import dayjs from '@/utils/dayjs';
import { LoadingOutlined } from '@ant-design/icons';
import { Timeline } from 'antd';

const ViewMocThoiGianDot = (props: { rec: KeHoachDeTai.IRecord }) => {
	const { rec }: any = props;

	return (
		<Timeline>
			{Object.values(EMocThoiGianDot).map((item) => {
				const isPass = dayjs().isAfter(dayjs(rec?.[MapKeyFieldMocThoiGianDot[item][1]]));
				const isFuture = dayjs().isBefore(dayjs(rec?.[MapKeyFieldMocThoiGianDot[item][0]]));

				return (
					<Timeline.Item
						key={item}
						dot={!isPass && !isFuture ? <LoadingOutlined /> : undefined}
						color={isPass ? 'green' : isFuture ? 'gray' : 'blue'}
					>
						<div>
							<div>{MapKeyNameMocThoiGianDot[item]}</div>
							<div>
								{dayjs(rec?.[MapKeyFieldMocThoiGianDot[item][0]]).format('DD/MM/YYYY')} -{' '}
								{dayjs(rec?.[MapKeyFieldMocThoiGianDot[item][1]]).format('DD/MM/YYYY')}
							</div>
						</div>
					</Timeline.Item>
				);
			})}
		</Timeline>
	);
};

export default ViewMocThoiGianDot;
