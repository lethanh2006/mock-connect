import { type ThoiKhoaBieu } from '@/services/DaoTao/ThoiKhoaBieu/typing';
import { EHinhThucGiangDay } from '@/services/HocTap/LopHocPhan/constant';
import { Segmented, Space, Spin } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import CalendarLichHocLopHp from './CalendarLichHoc';
import ModalThoiKhoaBieu from './Modal';
import StatDiemDanh from './Stat';
import TableLichHocLopHP from './TableLichHoc';
import ThongTinBuoiHoc from './ThongTinBuoiHoc';
import { CalendarOutlined, TableOutlined } from '@ant-design/icons';

const DanhSachBuoiHoc = () => {
	const { record: recLopHocPhan } = useModel('lophocphan.lophocphan');
	const { setRecord, setVisibleForm, getTheoLopHocPhan, loading, danhSach } = useModel('daotao.thoikhoabieu');
	const [buoiHocGanNhat, setBuoiHocGanNhat] = useState<ThoiKhoaBieu.IRecord>();
	const [show, setShow] = useState<string>('table');
	const [hinhThucFilter, setHinhThucFilter] = useState<'all' | EHinhThucGiangDay>('all');
	const danhSachHienThi = danhSach.filter(
		(item) => hinhThucFilter === 'all' || item.hinhThucGiangDay === hinhThucFilter,
	);

	useEffect(() => {
		if (recLopHocPhan?.ten)
			getTheoLopHocPhan(recLopHocPhan.ten).then((data) => {
				const end = data.every((item) => {
					if (moment().isSameOrBefore(item.ngay, 'day')) {
						setBuoiHocGanNhat(item);
						return false;
					}
					return true;
				});
				if (end) setBuoiHocGanNhat(data.at(-1));
			});
	}, [recLopHocPhan?._id]);

	const onClickViewTkb = (rec: ThoiKhoaBieu.IRecord) => {
		if (rec.hinhThucGiangDay !== EHinhThucGiangDay.ONLINE) {
			setRecord(rec);
			setVisibleForm(true);
		}
	};

	return (
		<Spin spinning={loading}>
			<StatDiemDanh />

			{buoiHocGanNhat?._id ? (
				<>
					<ThongTinBuoiHoc
						buoiHoc={buoiHocGanNhat}
						title={
							<>
								Buổi học gần nhất (
								<a onClick={() => onClickViewTkb(buoiHocGanNhat)} style={{ fontSize: 14, fontWeight: 400 }}>
									xem chi tiết
								</a>
								)
							</>
						}
					/>
					<br />
				</>
			) : null}

			<Space wrap style={{ marginBottom: 12, justifyContent: 'space-between', width: '100%' }}>
				<Space wrap size={12}>
					<span style={{ fontWeight: 600, fontSize: 16 }}>Danh sách buổi học</span>
					<Segmented
						options={[
							{ value: 'all', label: 'Tất cả' },
							...Object.values(EHinhThucGiangDay).map((item) => ({ value: item, label: item })),
						]}
						onChange={(val) => setHinhThucFilter(val as any)}
						value={hinhThucFilter}
					/>
				</Space>
				<Segmented
					value={show}
					onChange={(val) => setShow(val.toString())}
					options={[
						{ value: 'table', title: 'Danh sách chi tiết', icon: <TableOutlined /> },
						{ value: 'calendar', title: 'Lịch học', icon: <CalendarOutlined /> },
					]}
				/>
			</Space>

			{show === 'calendar' ? (
				<CalendarLichHocLopHp items={danhSachHienThi} onClickItem={onClickViewTkb} />
			) : (
				<TableLichHocLopHP items={danhSachHienThi} onClickItem={onClickViewTkb} />
			)}

			<ModalThoiKhoaBieu />
		</Spin>
	);
};

export default DanhSachBuoiHoc;
