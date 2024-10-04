import { ColorSuKien, ELoaiSuKien } from '@/services/SuKien/constant';
import { Space } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const GhiChuLich = () => {
	const { record: recSetting, getSettingLich } = useModel('settinglich');
	const { selectSuKiens, setSelectSuKiens, dataLichDashboard, setLichHienThiDashboardModel } = useModel('sukien');
	const loaiSuKien = [
		ELoaiSuKien.CHUNG,
		ELoaiSuKien.LICH_HOC,
		ELoaiSuKien.BAI_TAP,
		ELoaiSuKien.LICH_THI,
		ELoaiSuKien.HOP_LOP,
		ELoaiSuKien.CA_NHAN,
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
					: '#d3d3d3b3';

				return (
					<div
						key={sukien}
						style={{
							backgroundColor: bgColor,
							color: 'white',
							padding: '1px 4px',
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
