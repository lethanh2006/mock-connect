import ModalExpandable from '@/components/Table/ModalExpandable';
import type { DangKyTinChi } from '@/services/DaoTao/DangKyTinChi/typing';
import type { ThoiKhoaBieu } from '@/services/DaoTao/ThoiKhoaBieu/typing';
import { ELoaiLopHocPhan } from '@/services/HocTap/LopHocPhan/constant';
import { formatDate, formatTimeRange } from '@/utils/formatDate';
import { Descriptions, Divider } from 'antd';
import { useIntl } from 'umi';
import RenderLichHoc from './RenderLichHoc';

export type CalendarLichHocEvent = {
	title: string;
	start: Date;
	end: Date;
	lopHocPhan: DangKyTinChi.ILopDangKy;
	tkb: ThoiKhoaBieu.IRecord;
};

const ModalChiTietBuoiHoc = (props: {
	visible: boolean;
	setVisible: (val: boolean) => void;
	event?: CalendarLichHocEvent;
}) => {
	const intl = useIntl();
	const { visible, setVisible, event } = props;

	return (
		<ModalExpandable
			open={visible}
			onCancel={() => setVisible(false)}
			footer={null}
			width={720}
			title={intl.formatMessage({ id: 'dangkytinchi.modallichhoc.chitiet.title' })}
		>
			{event ? (
				<>
					<Descriptions column={1} size='small'>
						<Descriptions.Item label={intl.formatMessage({ id: 'dangkytinchi.phieudangky.columntable.tenhocphan' })}>
							{event.lopHocPhan?.hocPhan?.ten || event.lopHocPhan?.maHocPhan}
						</Descriptions.Item>
						<Descriptions.Item label={intl.formatMessage({ id: 'dangkytinchi.phieudangky.columntable.loptinchi' })}>
							{event.lopHocPhan?.ten}
						</Descriptions.Item>
						<Descriptions.Item label={intl.formatMessage({ id: 'dangkytinchi.modallichhoc.chitiet.thoigian' })}>
							{formatDate(event.tkb?.ngay)}
							{event.tkb?.thoiGianBatDau && event.tkb?.thoiGianKetThuc
								? ` (${formatTimeRange(event.tkb.thoiGianBatDau, event.tkb.thoiGianKetThuc)})`
								: ''}
						</Descriptions.Item>
						<Descriptions.Item label={intl.formatMessage({ id: 'dangkytinchi.modallichhoc.chitiet.phonghoc' })}>
							{event.tkb?.phongHoc || '--'}
						</Descriptions.Item>
						<Descriptions.Item label={intl.formatMessage({ id: 'dangkytinchi.phieudangky.columntable.giangvien' })}>
							{event.lopHocPhan?.nhanSuList
								?.map((item) =>
									item.nhanSu?.ten ? `${item.nhanSu?.hoDem ?? ''} ${item.nhanSu?.ten ?? ''}` : item.tenNhanSu,
								)
								.join(', ') || '--'}
						</Descriptions.Item>
					</Descriptions>

					<Divider orientation='left' className='divider-big-title'>
						{intl.formatMessage({ id: 'dangkytinchi.modallichhoc.chitiet.lichhoc' })}
					</Divider>
					<RenderLichHoc lopHocPhan={{ ...event.lopHocPhan, loai: ELoaiLopHocPhan.CHINH }} showAll />
				</>
			) : null}
		</ModalExpandable>
	);
};

export default ModalChiTietBuoiHoc;
