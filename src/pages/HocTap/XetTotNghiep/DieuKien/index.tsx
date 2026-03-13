import SelectSongNganh from '@/pages/DaoTao/SongNganh/SelectSongNganh';
import { Alert, Card, Space, Spin } from 'antd';
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
		<Card
			className='card-big-title card-borderless'
			variant='borderless'
			title={
				<Space wrap style={{ width: '100%', justifyContent: 'space-between' }}>
					<span>{intl.formatMessage({ id: 'dieukienxettotnghiep.title' })}</span>
					<SelectSongNganh style={{ width: 250 }} value={maKhoaNganh} onChange={(val) => setMaKhoaNganh(val)} />
				</Space>
			}
		>
			<Card variant='borderless'>
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
			</Card>
		</Card>
	);
};

export default CardDieuKienTotNghiep;
