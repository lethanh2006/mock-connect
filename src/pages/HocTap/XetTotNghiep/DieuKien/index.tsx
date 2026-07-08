import PageCard from '@/components/PageCard';
import SelectSongNganh from '@/pages/DaoTao/SongNganh/SelectSongNganh';
import { Alert, Spin } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import DieuKienChungChiSection from './ChungChi';
import DieuKienKqhtSection from './KetQuaHocTap';

const CardDieuKienTotNghiep = () => {
	const intl = useIntl();
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
		<PageCard
			title={intl.formatMessage({ id: 'dieukienxettotnghiep.title' })}
			extra={<SelectSongNganh style={{ width: 250 }} value={maKhoaNganh} onChange={(val) => setMaKhoaNganh(val)} />}
		>
			<Spin spinning={loading}>
				<DieuKienKqhtSection />

				<DieuKienChungChiSection />

				{/* <DieuKienKhacSection /> */}
			</Spin>

			{dieuKienTotNghiep?.isDuKieuKien ? (
				<Alert
					type='success'
					description={intl.formatMessage({ id: 'dieukienxettotnghiep.alert.success.dudieukien' })}
					showIcon
				/>
			) : (
				<Alert
					type='warning'
					description={intl.formatMessage({ id: 'dieukienxettotnghiep.alert.warning.chuadudieukien' })}
					showIcon
				/>
			)}
		</PageCard>
	);
};

export default CardDieuKienTotNghiep;
