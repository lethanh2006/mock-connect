import { type ThoiKhoaBieu } from '@/services/DaoTao/ThoiKhoaBieu/typing';
import { Segmented, Space, Spin } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import CalendarLichHocLopHp from './CalendarLichHoc';
import ModalThoiKhoaBieu from './Modal';
import TableLichHocLopHP from './TableLichHoc';
import ThongTinBuoiHoc from './ThongTinBuoiHoc';

const DanhSachBuoiHoc = () => {
	const { record: recLopHocPhan } = useModel('lophocphan.lophocphan');
	const { setRecord, setVisibleForm, getTheoLopHocPhan, loading } = useModel('daotao.thoikhoabieu');
	const [buoiHocGanNhat, setBuoiHocGanNhat] = useState<ThoiKhoaBieu.IRecord>();
	const [show, setShow] = useState<string>('calendar');

	useEffect(() => {
		if (recLopHocPhan?.ten)
			getTheoLopHocPhan(recLopHocPhan.ten).then((data) => {
				data.every((item) => {
					if (moment().isSameOrBefore(item.ngay, 'day')) {
						setBuoiHocGanNhat(item);
						return false;
					}
					return true;
				});
			});
	}, [recLopHocPhan?._id]);

	return (
		<Spin spinning={loading}>
			{buoiHocGanNhat?._id ? (
				<>
					<ThongTinBuoiHoc
						buoiHoc={buoiHocGanNhat}
						title={
							<>
								Buổi học gần nhất{' '}
								<a
									onClick={() => {
										setRecord(buoiHocGanNhat);
										setVisibleForm(true);
									}}
									style={{ fontSize: 14, fontWeight: 400 }}
								>
									(xem chi tiết)
								</a>
							</>
						}
					/>
					<br />
				</>
			) : null}

			<Space wrap size={12} style={{ marginBottom: 12 }}>
				<span style={{ fontWeight: 600, fontSize: 16 }}>Tất cả buổi học</span>
				<Segmented
					value={show}
					onChange={(val) => setShow(val.toString())}
					options={[
						{ value: 'calendar', label: 'Hiển thị lịch học' },
						{ value: 'table', label: 'Danh sách chi tiết' },
					]}
				/>
			</Space>

			{show === 'calendar' ? <CalendarLichHocLopHp /> : <TableLichHocLopHP />}

			<ModalThoiKhoaBieu />
		</Spin>
	);
};

export default DanhSachBuoiHoc;
