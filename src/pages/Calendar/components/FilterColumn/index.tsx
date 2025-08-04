import ButtonExtend from '@/components/Table/ButtonExtend';
import { ColorSuKien, ELoaiSuKien } from '@/services/SuKien/constant';
import { CalendarOutlined, DownOutlined, EditFilled, FilterOutlined } from '@ant-design/icons';
import { Calendar as AntdCalendar, Button, Card, Checkbox, Col, Popover, Row, Select } from 'antd';
import dayjs from 'dayjs';
import _ from 'lodash';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import PickColorLich from '../PickColorLich';
import './style.less';

const FilterColumn = (props: { date: Date; setDate: (val: Date) => void }) => {
	const { date, setDate } = props;
	const { selectSuKiens, setSelectSuKiens, setDataCalendar, dataLich } = useModel('sukien.sukien');
	const { record: recSetting } = useModel('tienich.settinglich');
	const [hovered, setHovered] = useState<ELoaiSuKien | null>(null);
	const [expandMiniCalendar, setExpandMiniCalendar] = useState(false);
	const [expandFilter, setExpandFilter] = useState(false);
	const [isMobile, setIsMobile] = useState(false);

	// Check if device is mobile
	useEffect(() => {
		const checkIsMobile = () => {
			const mobile = window.innerWidth < 768; // md breakpoint
			setIsMobile(mobile);
			setExpandFilter(!mobile); // Auto open on desktop, collapsed on mobile
		};

		checkIsMobile();
		window.addEventListener('resize', checkIsMobile);
		return () => window.removeEventListener('resize', checkIsMobile);
	}, []);

	const pickDate = (val: moment.Moment) => setDate(val.toDate());

	const changeLoaiSuKien = (checkedValue: any) => {
		setSelectSuKiens(checkedValue as ELoaiSuKien[]);
		const filteredEvents = dataLich.filter((event) => checkedValue.includes(event.loaiSuKien));
		setDataCalendar(filteredEvents);
	};

	// Handle clicking on event label to toggle checkbox
	const handleLabelClick = (loaiSuKien: ELoaiSuKien, event: React.MouseEvent) => {
		// Prevent event bubbling to avoid conflicts with edit button
		event.stopPropagation();

		// Toggle the checkbox state
		const newSelectSuKiens = selectSuKiens.includes(loaiSuKien)
			? selectSuKiens.filter((item) => item !== loaiSuKien)
			: [...selectSuKiens, loaiSuKien];

		changeLoaiSuKien(newSelectSuKiens);
	};

	const renderCheckboxItem = (loaiSuKien: ELoaiSuKien, label: string) => (
		<div className='checkbox-item' onMouseEnter={() => setHovered(loaiSuKien)}>
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
			<Button className={`date-button`} onClick={() => setExpandMiniCalendar(!expandMiniCalendar)}>
				<span className='button-content'>
					<CalendarOutlined className='calendar-icon' />
				</span>
				<div>{moment(date).format('DD/MM/YYYY')}</div>
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
											options={_.range(2020, moment().year() + 1).map((y) => ({
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
												label: `Tháng ${m + 1}`,
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
			</Card>

			{/* Filter Header Button */}
			<Button
				className={`filter-button ${expandFilter ? 'expanded' : 'collapsed'}`}
				onClick={() => setExpandFilter(!expandFilter)}
			>
				<div className='button-content'>
					<FilterOutlined className='filter-icon' />
				</div>
				<div>Bộ lọc sự kiện</div>
				<DownOutlined className={`down-arrow ${expandFilter ? 'expanded' : 'collapsed'}`} />
			</Button>

			{/* Collapsible Filter Content */}
			<Card
				className={`filter-container ${expandFilter ? 'expanded' : 'collapsed'} card-borderless card-big-title`}
				variant='borderless'
			>
				<Checkbox.Group value={selectSuKiens} onChange={changeLoaiSuKien} className='checkbox-group'>
					{renderCheckboxItem(ELoaiSuKien.CHUNG, 'Sự kiện chung')}
					{renderCheckboxItem(ELoaiSuKien.LICH_HOC, 'Lịch học')}
					{renderCheckboxItem(ELoaiSuKien.BAI_TAP, 'Bài tập')}
					{renderCheckboxItem(ELoaiSuKien.LICH_THI, 'Lịch thi')}
					{renderCheckboxItem(ELoaiSuKien.HOP_LOP, 'Họp lớp')}
					{renderCheckboxItem(ELoaiSuKien.CA_NHAN, 'Sự kiện cá nhân')}
				</Checkbox.Group>
			</Card>
		</div>
	);
};

export default FilterColumn;
