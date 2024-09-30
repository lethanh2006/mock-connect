import { ColorSuKien, ELoaiSuKien } from '@/services/SuKien/constant';
import { Space } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const GhiChuLich = () => {
	const { record: recSetting, getSettingLich } = useModel('settinglich');
	const loaiSuKien = [ELoaiSuKien.LICH_HOC, ELoaiSuKien.LICH_THI, ELoaiSuKien.CA_NHAN, ELoaiSuKien.CHUNG];

	useEffect(() => {
		getSettingLich();
	}, []);

	return (
		<Space wrap size={12}>
			<span>Ghi chú: </span>
			{loaiSuKien.map((sukien) => (
				<div
					key={sukien}
					style={{
						backgroundColor:
							recSetting?.danhSachSettingLich?.find((item) => item?.loaiLich === sukien)?.maMau ?? ColorSuKien[sukien],
						color: 'white',
						padding: '2px 6px',
						borderRadius: 2,
					}}
				>
					{sukien}
				</div>
			))}
		</Space>
	);
};

export default GhiChuLich;
