import { Card, Empty } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import NhuCauHocPhanPage from './NhuCauHocPhan';
import FilterHocKy from '@/pages/DaoTao/HocKy/FilterHocKy';
import SelectSongNganh from '@/pages/DaoTao/SongNganh/SelectSongNganh';

const DangKyNhuCauPage = () => {
	const { getDotDangKyNhuCauHocKyModel, record } = useModel('daotao.dangkynhucau.dotdangky');
	const { record: recHocKy } = useModel('daotao.hocky');
	const { maKhoaNganh, setMaKhoaNganh } = useModel('sinhvien.sinhvien');

	useEffect(() => {
		if (recHocKy?._id) getDotDangKyNhuCauHocKyModel(recHocKy?.ma);
	}, [recHocKy?._id]);

	return (
		<>
			<Card title='Đăng ký nhu cầu'>
				<div style={{ marginBottom: 12 }}>
					<FilterHocKy isSetHocKy>
						<SelectSongNganh style={{ width: 250 }} value={maKhoaNganh} onChange={(val) => setMaKhoaNganh(val)} />
					</FilterHocKy>
				</div>

				{record?._id ? <NhuCauHocPhanPage /> : <Empty description='Không có đợt đăng ký' style={{ marginTop: 32 }} />}
			</Card>
		</>
	);
};

export default DangKyNhuCauPage;
