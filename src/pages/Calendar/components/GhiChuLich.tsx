import { ColorSuKien, ELoaiSuKien } from '@/services/SuKien/constant';
import { Space } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const GhiChuLich = () => {
	const { record: recSetting, getSettingLich } = useModel('settinglich');
	const { selectSuKiens, setSelectSuKiens } = useModel('sukien');
	const loaiSuKien = [
		ELoaiSuKien.LICH_HOC,
		ELoaiSuKien.LICH_THI,
		ELoaiSuKien.CA_NHAN,
		ELoaiSuKien.CHUNG,
		ELoaiSuKien.BAI_TAP,
	];

	useEffect(() => {
		getSettingLich();
	}, []);

	const handleToggleSuKien = (sukien: ELoaiSuKien) => {
		const isSelected = selectSuKiens.includes(sukien);
		if (isSelected) {
			setSelectSuKiens(selectSuKiens.filter((item) => item !== sukien));
		} else {
			setSelectSuKiens([...selectSuKiens, sukien]);
		}
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
