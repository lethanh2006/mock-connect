import FilterHocKy from '@/pages/DaoTao/HocKy/FilterHocKy';
import { Card, Empty, Space } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import NhuCauHocPhanPage from './NhuCauHocPhan';

const DangKyNhuCauPage = () => {
	const { getDotDangKyNhuCauHocKyModel, record } = useModel('daotao.dangkynhucau.dotdangky');
	const { record: recHocKy } = useModel('daotao.hocky');
	const { maKhoaNganh, setMaKhoaNganh } = useModel('sinhvien.sinhvien');
	const { getAllModel, danhSach: danhSachKhoaNganhDot } = useModel('daotao.dangkynhucau.khoanganhdot');
	const khoaNganhTrongDot = !!danhSachKhoaNganhDot.find((item) => maKhoaNganh === item?.maKhoaNganh);

	// useEffect(() => {
	// 	if (record?._id) getAllModel(undefined, undefined, { dotDangKyNhuCauId: record?._id });
	// }, [record?._id]);

	useEffect(() => {
		if (recHocKy?._id) getDotDangKyNhuCauHocKyModel(recHocKy?.ma);
	}, [recHocKy?._id]);

	return (
		<Card
			className='card-big-title card-borderless'
			title={
				<>
					<Space wrap style={{ width: '100%', justifyContent: 'space-between' }}>
						<span>Đăng ký học tập theo nhu cầu</span>
						<div style={{ marginBottom: 12 }}>
							<FilterHocKy isSetHocKy>
								{/* <SelectSongNganh style={{ width: 250 }} value={maKhoaNganh} onChange={(val) => setMaKhoaNganh(val)} /> */}
							</FilterHocKy>
						</div>
					</Space>
				</>
			}
			variant='borderless'
		>
			{record?._id ? (
				<NhuCauHocPhanPage
				// khoaNganhTrongDot={khoaNganhTrongDot}
				/>
			) : (
				<Card variant='borderless'>
					<Empty description='Không có đợt đăng ký trong kỳ học' style={{ marginTop: 32 }} />
				</Card>
			)}
		</Card>
	);
};

export default DangKyNhuCauPage;
