import { IconCheckMini } from '@/components/Icons';
import { DEFAULT_FILTER_VISUAL, FILTER_VISUAL, useLoaiSuKienLabel } from '@/services/Calendar/constant';
import { ELoaiSuKien, ELoaiSuKienKhac } from '@/services/SuKien/constant';
import { Checkbox } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import './style.less';

const FilterColumn = (_props: { date: Date; setDate: (val: Date) => void }) => {
	const getLoaiSuKienLabel = useLoaiSuKienLabel();
	const { selectSuKiens, setSelectSuKiens, setDataCalendar, dataLich } = useModel('sukien.sukien');
	const [dataLichFull, setDataLichFull] = useState<any[]>([]);

	useEffect(() => {
		if (dataLich.length > 0) {
			setDataLichFull(dataLich);
		}
	}, [dataLich]);

	const allLoaiSuKienChinh = Object.values(ELoaiSuKien) as ELoaiSuKien[];

	const changeLoaiSuKien = (checkedValue: (ELoaiSuKien | ELoaiSuKienKhac)[]) => {
		const newSelect = [...checkedValue];

		setSelectSuKiens(newSelect);

		const filteredEvents = dataLichFull.filter((event) => {
			const eventLoai = event.loaiSuKien;

			// Hiển thị các loại được tick
			return newSelect.includes(eventLoai);
		});

		setDataCalendar(filteredEvents);
	};

	// Handle clicking on event row to toggle checkbox
	const handleLabelClick = (loaiSuKien: ELoaiSuKien | ELoaiSuKienKhac) => {
		const newSelectSuKiens = selectSuKiens.includes(loaiSuKien)
			? selectSuKiens.filter((item) => item !== loaiSuKien)
			: [...selectSuKiens, loaiSuKien];

		changeLoaiSuKien(newSelectSuKiens);
	};

	const renderCheckboxItem = (loaiSuKien: ELoaiSuKien | ELoaiSuKienKhac, label: string) => {
		const visual = FILTER_VISUAL[loaiSuKien] ?? DEFAULT_FILTER_VISUAL;
		const { Icon, color } = visual;

		return (
			<div key={loaiSuKien} className='select-cell' onClick={() => handleLabelClick(loaiSuKien)}>
				<span className='select-cell__icon' style={{ color }}>
					<Icon size={24} color={color} />
				</span>
				<span className='select-cell__label'>{label}</span>
				<span className='select-cell__box'>
					<Checkbox value={loaiSuKien} />
					<IconCheckMini size={24} className='select-cell__tick' />
				</span>
			</div>
		);
	};

	return (
		<div className='filter-column'>
			<Checkbox.Group
				value={selectSuKiens}
				onChange={(checkedValue) => changeLoaiSuKien(checkedValue as (ELoaiSuKien | ELoaiSuKienKhac)[])}
				className='checkbox-group'
			>
				{/* Hiển thị các loại chính */}
				{allLoaiSuKienChinh.map((loaiSuKien) => renderCheckboxItem(loaiSuKien, getLoaiSuKienLabel(loaiSuKien)))}
			</Checkbox.Group>
		</div>
	);
};

export default FilterColumn;
