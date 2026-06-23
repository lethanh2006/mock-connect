import ButtonExtend from '@/components/Table/ButtonExtend';
import { useLoaiSuKienLabel } from '@/services/Calendar/constant';
import { ColorSuKien, ELoaiSuKien, ELoaiSuKienKhac } from '@/services/SuKien/constant';
import { EditFilled /* , FilterOutlined */ } from '@ant-design/icons';
import { Checkbox, Popover } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import PickColorLich from '../PickColorLich';
import './style.less';

const FilterColumn = (props: { date: Date; setDate: (val: Date) => void }) => {
	// const intl = useIntl();
	const getLoaiSuKienLabel = useLoaiSuKienLabel();
	// const { date, setDate } = props;
	const { selectSuKiens, setSelectSuKiens, setDataCalendar, dataLich } = useModel('sukien.sukien');
	const { record: recSetting } = useModel('tienich.settinglich');
	const [hovered, setHovered] = useState<ELoaiSuKien | ELoaiSuKienKhac | null>(null);
	// const [expandMiniCalendar, setExpandMiniCalendar] = useState(false);
	// const [expandFilter, setExpandFilter] = useState(false);
	const [isMobile, setIsMobile] = useState(false);
	const [dataLichFull, setDataLichFull] = useState<any[]>([]);

	// Check if device is mobile
	useEffect(() => {
		const checkIsMobile = () => {
			const mobile = window.innerWidth < 768; // md breakpoint
			setIsMobile(mobile);
			// setExpandFilter(!mobile); // Auto open on desktop, collapsed on mobile
		};

		checkIsMobile();
		window.addEventListener('resize', checkIsMobile);
		return () => window.removeEventListener('resize', checkIsMobile);
	}, []);

	useEffect(() => {
		if (dataLich.length > 0) {
			setDataLichFull(dataLich);
		}
	}, [dataLich]);

	// const pickDate = (val: Dayjs) => setDate(val.toDate());

	// const changeLoaiSuKien = (checkedValue: any) => {
	// 	setSelectSuKiens(checkedValue as ELoaiSuKien[]);
	// 	const filteredEvents = dataLich.filter((event) => checkedValue.includes(event.loaiSuKien));
	// 	setDataCalendar(filteredEvents);
	// };

	// Handle clicking on event label to toggle checkbox
	const handleLabelClick = (loaiSuKien: ELoaiSuKien | ELoaiSuKienKhac, event: React.MouseEvent) => {
		// Prevent event bubbling to avoid conflicts with edit button
		event.stopPropagation();

		// Toggle the checkbox state
		const newSelectSuKiens = selectSuKiens.includes(loaiSuKien)
			? selectSuKiens.filter((item) => item !== loaiSuKien)
			: [...selectSuKiens, loaiSuKien];

		changeLoaiSuKien(newSelectSuKiens);
	};

	const allLoaiSuKienChinh = Object.values(ELoaiSuKien) as ELoaiSuKien[];

	const changeLoaiSuKien = (checkedValue: any) => {
		const newSelect = [...checkedValue];

		setSelectSuKiens(newSelect as (ELoaiSuKien | ELoaiSuKienKhac)[]);

		const filteredEvents = dataLichFull.filter((event) => {
			const eventLoai = event.loaiSuKien;

			// Hiển thị các loại được tick khác
			return newSelect.includes(eventLoai);
		});

		setDataCalendar(filteredEvents);
	};

	const renderCheckboxItem = (loaiSuKien: ELoaiSuKien | ELoaiSuKienKhac, label: string) => (
		<div className='checkbox-item'>
			<Checkbox value={loaiSuKien} className='checkbox' />
			<div
				className='event-label'
				style={{
					backgroundColor:
						recSetting?.danhSachSettingLich?.find((item) => item?.loaiLich === loaiSuKien)?.maMau ??
						ColorSuKien[loaiSuKien],
				}}
				onClick={(e) => handleLabelClick(loaiSuKien, e)}
			>
				{label}
				{hovered === loaiSuKien && (
					<Popover content={<PickColorLich loaiLich={loaiSuKien} />} trigger='click' placement='right'>
						<ButtonExtend
							type='link'
							icon={<EditFilled />}
							className='edit-button'
							onClick={(e) => e.stopPropagation()} // Prevent label click when clicking edit button
						/>
					</Popover>
				)}
			</div>
		</div>
	);

	return (
		<div className='filter-column'>
			{/* <Button block className={`date-button`} onClick={() => setExpandMiniCalendar(!expandMiniCalendar)}>
				<CalendarOutlined className='calendar-icon' />

				<div>{formatDate(date)}</div>
				<DownOutlined className={`down-arrow ${expandMiniCalendar ? 'expanded' : 'collapsed'}`} />
			</Button>

			<Card
				className={`calendar-container ${expandMiniCalendar ? 'expanded' : 'collapsed'} card-borderless card-big-title`}
				variant='borderless'
			>
				{expandMiniCalendar && (
					<AntdCalendar
						headerRender={({ value, onChange }) => (
							<div className='calendar-header'>
								<Row gutter={8}>
									<Col span={12}>
										<Select
											className='year-select'
											size='small'
											onChange={(newYear: any) => {
												const now = value.clone().year(newYear);
												onChange(now);
											}}
											value={value.year()}
											options={_.range(2020, dayjs().year() + 1).map((y) => ({
												key: y,
												value: y,
												label: y,
											}))}
										/>
									</Col>
									<Col span={12}>
										<Select
											className='month-select'
											size='small'
											value={value.month()}
											onChange={(selectedMonth) => {
												onChange(value.clone().month(selectedMonth));
											}}
											options={_.range(0, 12).map((m) => ({
												key: m,
												value: m,
												label: `Tháng ${m + 1} `,
											}))}
										/>
									</Col>
								</Row>
							</div>
						)}
						onChange={(val: any) => pickDate(val)}
						fullscreen={false}
						mode={'month'}
						value={dayjs(date)}
					/>
				)}
			</Card> */}

			{/* Filter Header Button */}
			{/* <Button
				block
				className={`filter-button ${expandFilter ? 'expanded' : 'collapsed'}`}
				onClick={() => setExpandFilter(!expandFilter)}
			>
				<FilterOutlined className='filter-icon' />

				<div>{intl.formatMessage({ id: 'lichsukien.boloc' })}</div>
				<DownOutlined className={`down-arrow ${expandFilter ? 'expanded' : 'collapsed'}`} />
			</Button> */}

			{/* Collapsible Filter Content */}
			<div className='filter-container expanded'>
				<Checkbox.Group value={selectSuKiens} onChange={changeLoaiSuKien} className='checkbox-group'>
					{/* Hiển thị các loại chính */}
					{allLoaiSuKienChinh.map((loaiSuKien) => renderCheckboxItem(loaiSuKien, getLoaiSuKienLabel(loaiSuKien)))}
				</Checkbox.Group>
			</div>
		</div>
	);
};

export default FilterColumn;
