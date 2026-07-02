import ButtonExtend from '@/components/Table/ButtonExtend';
import { useLoaiSuKienLabel } from '@/services/Calendar/constant';
import { ColorSuKien, ELoaiSuKien, ELoaiSuKienKhac } from '@/services/SuKien/constant';
import { EditFilled /* , FilterOutlined */ } from '@ant-design/icons';
import { Checkbox, Popover } from 'antd';
import { Dayjs } from 'dayjs';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import PickColorLich from '../PickColorLich';
import './style.less';

const FilterColumn = (props: { date: Date; setDate: (val: Date) => void }) => {
	const intl = useIntl();
	const getLoaiSuKienLabel = useLoaiSuKienLabel();
	const { date, setDate } = props;
	const { selectSuKiens, setSelectSuKiens, setDataCalendar, dataLich } = useModel('sukien.sukien');
	const { record: recSetting } = useModel('tienich.settinglich');
	const [hovered, setHovered] = useState<ELoaiSuKien | ELoaiSuKienKhac | null>(null);
	const [dataLichFull, setDataLichFull] = useState<any[]>([]);

	useEffect(() => {
		if (dataLich.length > 0) {
			setDataLichFull(dataLich);
		}
	}, [dataLich]);

	const pickDate = (val: Dayjs) => setDate(val.toDate());

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
	const allLoaiSuKienKhac = Object.values(ELoaiSuKienKhac) as ELoaiSuKienKhac[];

	const changeLoaiSuKien = (checkedValue: any) => {
		let newSelect = [...checkedValue];

		// Khi bỏ tick "Khác", loại bỏ toàn bộ nhóm loại sự kiện khác để giữ logic cũ.
		if (!checkedValue.includes(ELoaiSuKienKhac.KHAC)) {
			newSelect = newSelect.filter((item) => !allLoaiSuKienKhac.includes(item));
		}

		setSelectSuKiens(newSelect as (ELoaiSuKien | ELoaiSuKienKhac)[]);

		const filteredEvents = dataLichFull.filter((event) => {
			const eventLoai = event.loaiSuKien;

			// Khi tick "Khác", hiển thị tất cả loại thuộc nhóm ELoaiSuKienKhac.
			if (newSelect.includes(ELoaiSuKienKhac.KHAC)) {
				if (
					allLoaiSuKienKhac.includes(eventLoai as ELoaiSuKienKhac) ||
					!allLoaiSuKienChinh.includes(eventLoai as ELoaiSuKien)
				) {
					return true;
				}
			}

			// Hiển thị các loại được tick.
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
			<div className='filter-container expanded'>
				<Checkbox.Group value={selectSuKiens} onChange={changeLoaiSuKien} className='checkbox-group'>
					{allLoaiSuKienChinh.map((loaiSuKien) => renderCheckboxItem(loaiSuKien, getLoaiSuKienLabel(loaiSuKien)))}
					{renderCheckboxItem(ELoaiSuKienKhac.KHAC, getLoaiSuKienLabel(ELoaiSuKienKhac.KHAC))}
				</Checkbox.Group>
			</div>
		</div>
	);
};

export default FilterColumn;
