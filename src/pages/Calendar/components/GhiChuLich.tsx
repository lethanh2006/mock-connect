import { ColorSuKien, ELoaiSuKien } from '@/services/SuKien/constant';
import { Space } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const GhiChuLich = () => {
	const { record: recSetting, getSettingLich } = useModel('settinglich');
	const { selectSuKiens, setSelectSuKiens, dataLichDashboard, setLichHienThiDashboardModel } = useModel('sukien');
	const loaiSuKien = [
		ELoaiSuKien.LICH_HOC,
		ELoaiSuKien.LICH_THI,
		ELoaiSuKien.CA_NHAN,
		ELoaiSuKien.CHUNG,
		ELoaiSuKien.BAI_TAP,
		ELoaiSuKien.HOP_LOP,
	];

	useEffect(() => {
		getSettingLich();
	}, []);

	const handleToggleSuKien = (sukien: ELoaiSuKien) => {
		const isSelected = selectSuKiens.includes(sukien);
		let updatedSelectSuKiens;

		if (isSelected) {
			updatedSelectSuKiens = selectSuKiens.filter((item) => item !== sukien);
		} else {
			updatedSelectSuKiens = [...selectSuKiens, sukien];
		}
		setSelectSuKiens(updatedSelectSuKiens);

		const filteredEvents = dataLichDashboard?.filter((event) => updatedSelectSuKiens.includes(event.loaiSuKien));
		setLichHienThiDashboardModel(filteredEvents ?? []);
	};

	return (
		<Space wrap size={12}>
			{/* <span>Ghi chú: </span> */}
			{loaiSuKien.map((sukien) => {
				const isSelected = selectSuKiens.includes(sukien);
				const bgColor = isSelected
					? recSetting?.danhSachSettingLich?.find((item) => item?.loaiLich === sukien)?.maMau ?? ColorSuKien[sukien]
					: 'gray';

				return (
					<div
						key={sukien}
						style={{
							backgroundColor: bgColor,
							color: 'white',
							padding: '2px 6px',
							borderRadius: 2,
							cursor: 'pointer',
						}}
						onClick={() => handleToggleSuKien(sukien)}
					>
						{sukien}
					</div>
				);
			})}
		</Space>
	);
};

export default GhiChuLich;
