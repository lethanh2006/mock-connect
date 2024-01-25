import type { DotQuyTrinh } from '@/services/QuyTrinh/DotQuyTrinh/typing';
import type { QuyTrinh } from '@/services/QuyTrinh/typings';
import { primaryColor } from '@/services/base/constant';
import { SyncOutlined } from '@ant-design/icons';
import { Card, Timeline } from 'antd';
import moment from 'moment';
import type { Key } from 'react';

const ViewDot = (props: { recDot: DotQuyTrinh.IRecord; recQuyTrinh: QuyTrinh.IRecord }) => {
	const { recDot, recQuyTrinh } = props;
	const indexCurrent =
		recDot.danhSachCauHinhThoiGianDot?.findIndex(
			(item: { thoiGianBatDau: moment.MomentInput; thoiGianKetThuc: moment.MomentInput }) =>
				moment(item.thoiGianBatDau).isBefore(moment()) && moment().isBefore(item.thoiGianKetThuc),
		) ?? 0;

	return (
		<Card
			bodyStyle={{ paddingBottom: 0 }}
			title={`${recDot.ten} (${moment(recDot.thoiGianBatDau).format('DD/MM/YYYY')} - ${moment(
				recDot.thoiGianKetThuc,
			).format('DD/MM/YYYY')})`}
		>
			<Timeline>
				{recDot.danhSachCauHinhThoiGianDot.map(
					(
						item: {
							maBuoc: Key | null | undefined;
							thoiGianBatDau: moment.MomentInput;
							thoiGianKetThuc: moment.MomentInput;
						},
						index: number,
					) => (
						<Timeline.Item
							key={item.maBuoc}
							dot={index === indexCurrent ? <SyncOutlined spin /> : undefined}
							color={index <= indexCurrent ? undefined : 'gray'}
						>
							<div style={{ color: index === indexCurrent ? primaryColor : undefined }}>
								{recQuyTrinh.danhSachBuocXuLy.find((ele) => ele.ma === item.maBuoc)?.ten}{' '}
								<b>
									({moment(item.thoiGianBatDau).format('DD/MM/YYYY')} -{' '}
									{moment(item.thoiGianKetThuc).format('DD/MM/YYYY')})
								</b>
							</div>
						</Timeline.Item>
					),
				)}
			</Timeline>
		</Card>
	);
};

export default ViewDot;
