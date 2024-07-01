import FilterHocKy from '@/pages/DaoTao/HocKy/FilterHocKy';
import SelectSongNganh from '@/pages/DaoTao/SongNganh/SelectSongNganh';
import { Card, Empty } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import NhuCauHocPhanPage from './NhuCauHocPhan';

const DangKyNhuCauPage = () => {
	const { getDotDangKyNhuCauHocKyModel, record } = useModel('daotao.dangkynhucau.dotdangky');
	const { record: recHocKy } = useModel('daotao.hocky');
	const { maKhoaNganh, setMaKhoaNganh } = useModel('sinhvien.sinhvien');
	const { getAllModel, danhSach: danhSachKhoaNganhDot } = useModel('daotao.dangkynhucau.khoanganhdot');
	const khoaNganhTrongDot = !!danhSachKhoaNganhDot.find((item) => maKhoaNganh === item?.maKhoaNganh);

	useEffect(() => {
		if (record?._id) getAllModel(undefined, undefined, { dotDangKyNhuCauId: record?._id });
	}, [record?._id]);

	useEffect(() => {
		if (recHocKy?.ma) getDotDangKyNhuCauHocKyModel(recHocKy?.ma);
	}, [recHocKy?.ma]);

	return (
		<>
			<Card title='Đăng ký học tập theo nhu cầu'>
				<div style={{ marginBottom: 12 }}>
					<FilterHocKy isSetHocKy>
						<SelectSongNganh style={{ width: 250 }} value={maKhoaNganh} onChange={(val) => setMaKhoaNganh(val)} />
					</FilterHocKy>
				</div>

				{/* {record?._id ? ( */}
				<NhuCauHocPhanPage khoaNganhTrongDot={khoaNganhTrongDot} />
				{/* ) : (
					<Empty description='Không có đợt đăng ký trong kỳ học' style={{ marginTop: 32 }} />
				)} */}
			</Card>
		</>
	);
};

export default DangKyNhuCauPage;
