import SelectSongNganh from '@/pages/DaoTao/SongNganh/SelectSongNganh';
import { Alert, Card, Space, Spin } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import DieuKienChungChiSection from './ChungChi';
import DieuKienKqhtSection from './KetQuaHocTap';
import DieuKienKhacSection from './Khac';

const CardDieuKienTotNghiep = () => {
	const { maKhoaNganh, setMaKhoaNganh } = useModel('sinhvien.sinhvien');
	const { record: recDot, getDotHienHanhModel } = useModel('sinhvien.xettotnghiep');
	const { getTienTrinhTotNghiepModel, loading, dieuKienTotNghiep } = useModel('sinhvien.tientrinhtotnghiep');

	const getData = async () => {
		let dot = null;
		if (!recDot?._id) dot = await getDotHienHanhModel();
		const idDot = recDot?._id ?? dot?._id;

		if (maKhoaNganh) {
			getTienTrinhTotNghiepModel(maKhoaNganh, idDot);
		}
	};

	useEffect(() => {
		getData();
	}, [maKhoaNganh]);

	return (
		<Card
			title={
				<Space wrap style={{ width: '100%', justifyContent: 'space-between' }}>
					<span>Điều kiện xét tốt nghiệp</span>
					<SelectSongNganh style={{ width: 250 }} value={maKhoaNganh} onChange={(val) => setMaKhoaNganh(val)} />
				</Space>
			}
		>
			<Spin spinning={loading}>
				<DieuKienKqhtSection />

				<DieuKienChungChiSection />

				<DieuKienKhacSection />
			</Spin>

			{dieuKienTotNghiep?.isDuKieuKien ? (
				<Alert type='success' description='Bạn đã đủ điều kiện để xét tốt nghiệp!' showIcon />
			) : (
				<Alert type='warning' description='Bạn chưa đủ điều kiện để xét tốt nghiệp!' showIcon />
			)}
		</Card>
	);
};

export default CardDieuKienTotNghiep;
