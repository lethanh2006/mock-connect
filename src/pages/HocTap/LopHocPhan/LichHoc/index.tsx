import { type ThoiKhoaBieu } from '@/services/DaoTao/ThoiKhoaBieu/typing';
import { EHinhThucGiangDay, mapHinhThucGiangDayI18n } from '@/services/HocTap/LopHocPhan/constant';
import dayjs from '@/utils/dayjs';
import { Card, Col, Row, Segmented, Space, Spin } from 'antd';
import { IconCalendar, IconBoard } from '@/components/Icons';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import CalendarLichHocLopHp from './CalendarLichHoc';
import ModalThoiKhoaBieu from './Modal';
import StatDiemDanhV2 from './StatV2';
import TableLichHocLopHP from './TableLichHoc';
import ThongTinBuoiHoc from './ThongTinBuoiHoc';

const DanhSachBuoiHoc = () => {
	const intl = useIntl();
	const { record: recLopHocPhan } = useModel('lophocphan.lophocphan');
	const { setRecord, setVisibleForm, getTheoLopHocPhan, danhSach } = useModel('daotao.thoikhoabieu');
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
		<Spin spinning={false}>
			<Row gutter={[16, 16]} style={{ marginBottom: 16 }} align='stretch'>
				<Col xs={24} md={10} lg={8} xl={7}>
					<StatDiemDanhV2 />
				</Col>
				<Col xs={24} md={14} lg={16} xl={17}>
					<ThongTinBuoiHoc
						buoiHoc={buoiHocGanNhat}
						cardProps={{
							extra: buoiHocGanNhat ? (
								<>
									{' '}
									<a onClick={() => onClickViewTkb(buoiHocGanNhat)} style={{ fontSize: 14, fontWeight: 400 }}>
										{intl.formatMessage({ id: 'lophocphan.id.lichhoc.xemchitiet' })}
									</a>
								</>
							) : null,
						}}
						title={<>{intl.formatMessage({ id: 'lophocphan.id.lichhoc.hocgannhat' })}</>}
					/>
				</Col>
			</Row>

			<Card
				title={
					<Space wrap size={12}>
						<span>{intl.formatMessage({ id: 'lophocphan.id.lichhoc.dsbuoihoc' })}</span>
						<Segmented
							options={[
								{ value: 'all', label: intl.formatMessage({ id: 'lophocphan.id.lichhoc.tatca' }) },
								...Object.values(EHinhThucGiangDay).map((item) => ({
									value: item,
									label: intl.formatMessage({ id: mapHinhThucGiangDayI18n[item] }),
								})),
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
								icon: <IconBoard />,
							},
							{
								value: 'calendar',
								title: intl.formatMessage({ id: 'lophocphan.id.lichhoc.lichhoc' }),
								icon: <IconCalendar />,
							},
						]}
					/>
				}
				variant='borderless'
			>
				{show === 'calendar' ? (
					<CalendarLichHocLopHp items={danhSachHienThi} onClickItem={onClickViewTkb} />
				) : (
					<TableLichHocLopHP
						items={danhSachHienThi}
						onClickItem={onClickViewTkb}
						onReload={() => getTheoLopHocPhan(recLopHocPhan?.ten ?? '')}
					/>
				)}
			</Card>

			<ModalThoiKhoaBieu />
		</Spin>
	);
};

export default DanhSachBuoiHoc;
