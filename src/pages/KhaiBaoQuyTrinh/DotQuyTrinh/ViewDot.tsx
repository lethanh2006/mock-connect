import type { DotQuyTrinh } from '@/services/QuyTrinh/DotQuyTrinh/typing';
import type { QuyTrinh } from '@/services/QuyTrinh/typings';
import { primaryColor } from '@/services/base/constant';
import dayjs from '@/utils/dayjs';
import { formatDate } from '@/utils/formatDate';
import { IconRotateArrow } from '@/components/Icons';
import { Card, Timeline } from 'antd';

const ViewDot = (props: { recDot: DotQuyTrinh.IRecord; recQuyTrinh: QuyTrinh.IRecord }) => {
	const { recDot, recQuyTrinh } = props;

	const indexCurrent =
		recDot.danhSachCauHinhThoiGianDot?.findIndex(
			(item) => dayjs(item.thoiGianBatDau).isBefore(dayjs()) && dayjs().isBefore(dayjs(item.thoiGianKetThuc)),
		) ?? 0;

	return (
		<Card
			bodyStyle={{ paddingBottom: 0 }}
			title={`${recDot.ten} (${formatDate(recDot.thoiGianBatDau)} - ${formatDate(recDot.thoiGianKetThuc)})`}
		>
			<Timeline>
				{recDot.danhSachCauHinhThoiGianDot.map((item, index) => (
					<Timeline.Item
						key={item.maBuoc}
						dot={index === indexCurrent ? <IconRotateArrow className='anticon-spin' /> : undefined}
						color={index <= indexCurrent ? undefined : 'gray'}
					>
						<div style={{ color: index === indexCurrent ? primaryColor : undefined }}>
							{recQuyTrinh.danhSachBuocXuLy.find((ele) => ele.ma === item.maBuoc)?.ten}{' '}
							<b>
								({formatDate(item.thoiGianBatDau)} - {formatDate(item.thoiGianKetThuc)})
							</b>
						</div>
					</Timeline.Item>
				))}
			</Timeline>
		</Card>
	);
};

export default ViewDot;
