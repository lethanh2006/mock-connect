import { EOperatorType } from '@/components/Table/constant';
import SelectSongNganh from '@/pages/DaoTao/SongNganh/SelectSongNganh';
import { ETrangThaiDotQuyDoiDiem } from '@/services/HocTap/constant';
import { Alert, Card, Tabs } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import LichSuQuyDoiDiemPage from '../QuyDoiDiem';
import TienTrinhChuongTrinhKhung from './ChuongTrinhKhung';
import TienTrinhThucTe from './TienTrinhThucTe';
import './components/style.less';

const TienTrinhHocTap = () => {
	const [activeTabKey, setActiveTabKey] = useState<string>('2');
	const { getModel, record, setRecord } = useModel('daotao.quydoidiem.dotquydoidiem');
	const { getModel: getPhieuQuyDoiDiem, setRecord: setRecPheu } = useModel('daotao.quydoidiem.phieuquydoidiem');
	const { getThongTinCuaToiModel, getKhoaNganhMeModel, record: recSinhVien } = useModel('sinhvien.sinhvien');
	const { getAllModel: getAllQuyDoiDiem } = useModel('daotao.dmquydoidiem');
	const { maKhoaNganh, setMaKhoaNganh } = useModel('sinhvien.sinhvien');

	useEffect(() => {
		getModel({ trangThai: ETrangThaiDotQuyDoiDiem.DA_BAN_HANH }, [
			{
				active: true,
				field: 'thoiGianBatDau',
				operator: EOperatorType.LESS_EQUAL,
				values: [moment().toISOString()],
			},
			{
				active: true,
				field: 'thoiGianKetThuc',
				operator: EOperatorType.GREAT_EQUAL,
				values: [moment().toISOString()],
			},
		]).then((res) => setRecord(res[0]));

		getThongTinCuaToiModel();
		getKhoaNganhMeModel();
		getAllQuyDoiDiem();
	}, []);

	useEffect(() => {
		if (record?._id && recSinhVien?._id)
			getPhieuQuyDoiDiem(
				{ dotDangKyQuyDoiDiemId: record?._id, sinhVienSsoId: recSinhVien?.ssoId },
				undefined,
				undefined,
				undefined,
				undefined,
				undefined,
				undefined,
				false,
			).then((res) => setRecPheu(res[0]));
	}, [record?._id, recSinhVien?._id]);

	return (
		<Card
			title='Tiến trình học tập'
			className='card-tien-trinh'
			extra={<SelectSongNganh style={{ width: 250 }} value={maKhoaNganh} onChange={(val) => setMaKhoaNganh(val)} />}
		>
			{record?._id ? (
				<Alert
					style={{ marginBottom: 12 }}
					type='info'
					message={
						<>
							Đợt công nhận kết quả học tập <b>{record?.tenDot}</b> đang diễn ra từ{' '}
							<b>{moment(record?.thoiGianBatDau).format('DD/MM/YYYY')}</b> đến{' '}
							<b>{moment(record?.thoiGianKetThuc).format('DD/MM/YYYY')}</b>. Bạn có thể đăng ký quy đổi điểm các học
							phần trong chương trình đào tạo
						</>
					}
				/>
			) : null}

			<Tabs accessKey={activeTabKey} onChange={(tab) => setActiveTabKey(tab)} style={{ overflow: 'inherit' }}>
				<Tabs.TabPane tab='Tiến trình thực tế' key='2'>
					<TienTrinhThucTe />
				</Tabs.TabPane>

				<Tabs.TabPane tab='Chương trình đào tạo' key='1'>
					<TienTrinhChuongTrinhKhung />
				</Tabs.TabPane>

				<Tabs.TabPane tab='Công nhận KQHT' key='3'>
					<LichSuQuyDoiDiemPage />
				</Tabs.TabPane>
			</Tabs>
		</Card>
	);
};

export default TienTrinhHocTap;
