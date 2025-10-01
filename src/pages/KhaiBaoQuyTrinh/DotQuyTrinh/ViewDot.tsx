import type { DotQuyTrinh } from '@/services/QuyTrinh/DotQuyTrinh/typing';
import type { QuyTrinh } from '@/services/QuyTrinh/typings';
import { primaryColor } from '@/services/base/constant';
import dayjs from '@/utils/dayjs';
import { SyncOutlined } from '@ant-design/icons';
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
			title={`${recDot.ten} (${dayjs(recDot.thoiGianBatDau).format('DD/MM/YYYY')} - ${dayjs(
				recDot.thoiGianKetThuc,
			).format('DD/MM/YYYY')})`}
		>
			<Timeline>
				{recDot.danhSachCauHinhThoiGianDot.map((item, index) => (
					<Timeline.Item
						key={item.maBuoc}
						dot={index === indexCurrent ? <SyncOutlined spin /> : undefined}
						color={index <= indexCurrent ? undefined : 'gray'}
					>
						<div style={{ color: index === indexCurrent ? primaryColor : undefined }}>
							{recQuyTrinh.danhSachBuocXuLy.find((ele) => ele.ma === item.maBuoc)?.ten}{' '}
							<b>
								({dayjs(item.thoiGianBatDau).format('DD/MM/YYYY')} - {dayjs(item.thoiGianKetThuc).format('DD/MM/YYYY')})
							</b>
						</div>
					</Timeline.Item>
				))}
			</Timeline>
		</Card>
	);
};

export default ViewDot;
