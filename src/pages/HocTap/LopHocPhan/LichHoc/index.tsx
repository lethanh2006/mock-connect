import ButtonExtend from '@/components/Table/ButtonExtend';
import { type ThoiKhoaBieu } from '@/services/DaoTao/ThoiKhoaBieu/typing';
import { EHinhThucGiangDay } from '@/services/HocTap/LopHocPhan/constant';
import dayjs from '@/utils/dayjs';
import { CalendarOutlined, MailOutlined, TableOutlined } from '@ant-design/icons';
import { Card, Segmented, Space, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import LichSuDonXinNghi from '../YeuCauNghiHoc/LichSuDonXinNghi';
import CalendarLichHocLopHp from './CalendarLichHoc';
import ModalThoiKhoaBieu from './Modal';
import StatDiemDanhV2 from './StatV2';
import TableLichHocLopHP from './TableLichHoc';
import ThongTinBuoiHoc from './ThongTinBuoiHoc';

const DanhSachBuoiHoc = () => {
	const intl = useIntl();
	const { record: recLopHocPhan } = useModel('lophocphan.lophocphan');
	const { setRecord, setVisibleForm, getTheoLopHocPhan, loading, danhSach } = useModel('daotao.thoikhoabieu');
	const [buoiHocGanNhat, setBuoiHocGanNhat] = useState<ThoiKhoaBieu.IRecord>();
	const [visibleDonXinNghi, setVisibleDonXinNghi] = useState<boolean>(false);
	const [show, setShow] = useState<string>('table');
	const [hinhThucFilter, setHinhThucFilter] = useState<'all' | EHinhThucGiangDay>('all');
	const danhSachHienThi = danhSach.filter(
		(item) => hinhThucFilter === 'all' || item.hinhThucGiangDay === hinhThucFilter,
	);

	useEffect(() => {
		if (recLopHocPhan?.ten)
			getTheoLopHocPhan(recLopHocPhan.ten).then((data) => {
				const end = data.every((item) => {
					if (dayjs().isSameOrBefore(dayjs(item.ngay), 'day')) {
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
			<StatDiemDanhV2 />

			{buoiHocGanNhat?._id ? (
				<div style={{ marginBottom: 16 }}>
					<ThongTinBuoiHoc
						buoiHoc={buoiHocGanNhat}
						title={
							<>
								{intl.formatMessage({ id: 'lophocphan.id.lichhoc.hocgannhat' })} (
								<a onClick={() => onClickViewTkb(buoiHocGanNhat)} style={{ fontSize: 14, fontWeight: 400 }}>
									{intl.formatMessage({ id: 'lophocphan.id.lichhoc.xemchitiet' })}
								</a>
								)
							</>
						}
					/>
				</div>
			) : null}

			<Card
				title={
					<Space wrap size={12}>
						<span style={{ fontWeight: 600, fontSize: 16 }}>Danh sách buổi học</span>
						<ButtonExtend icon={<MailOutlined />} onClick={() => setVisibleDonXinNghi(true)}>
							{intl.formatMessage({ id: 'lophocphan.id.lichhoc.nghihoc' })}
						</ButtonExtend>
						<Segmented
							options={[
								{ value: 'all', label: intl.formatMessage({ id: 'lophocphan.id.lichhoc.tatca' }) },
								...Object.values(EHinhThucGiangDay).map((item) => ({ value: item, label: item })),
							]}
							onChange={(val) => setHinhThucFilter(val as any)}
							value={hinhThucFilter}
						/>
					</Space>
				}
				extra={
					<Segmented
						value={show}
						onChange={(val) => setShow(val.toString())}
						options={[
							{
								value: 'table',
								title: intl.formatMessage({ id: 'lophocphan.id.lichhoc.dschitiet' }),
								icon: <TableOutlined />,
							},
							{
								value: 'calendar',
								title: intl.formatMessage({ id: 'lophocphan.id.lichhoc.lichhoc' }),
								icon: <CalendarOutlined />,
							},
						]}
					/>
				}
				variant='borderless'
			>
				{show === 'calendar' ? (
					<CalendarLichHocLopHp items={danhSachHienThi} onClickItem={onClickViewTkb} />
				) : (
					<TableLichHocLopHP items={danhSachHienThi} onClickItem={onClickViewTkb} />
				)}
			</Card>

			<ModalThoiKhoaBieu />

			<LichSuDonXinNghi visible={visibleDonXinNghi} setVisible={setVisibleDonXinNghi} />
		</Spin>
	);
};

export default DanhSachBuoiHoc;
