import type { ChuongTrinhDaoTao } from '@/services/DaoTao/ChuongTrinhDaoTao/typing';
import { Divider, Empty, Spin, Typography } from 'antd';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import ModalChiTietDiem from '../../KetQuaHocTap/components/ModalChiTietDiem';
import CardHocPhanV2 from '../components/CardHocPhan';

const { Title, Text } = Typography;

const TienTrinhThucTeV2 = () => {
	const { loading, sinhVienGetTienTrinhThucTeModel } = useModel('daotao.chuongtrinhdaotao');
	const { maKhoaNganh } = useModel('sinhvien.sinhvien');
	const [tienTrinhHocKy, setTienTrinhHocKy] = useState<ChuongTrinhDaoTao.TTienTrinhThucTe[][]>();
	const [recTienTrinh, setRecTienTrinh] = useState<ChuongTrinhDaoTao.TTienTrinhThucTe>();
	const [visibleDiem, setVisibleDiem] = useState(false);

	const fetch = async () => {
		if (maKhoaNganh)
			sinhVienGetTienTrinhThucTeModel(maKhoaNganh).then((data) => {
				const gHocKy = Object.entries(_.groupBy(data, (item) => item.kyHoc?.ma));
				const dataHocKy = _.sortBy(gHocKy, ([ma, ds]) => ma);
				setTienTrinhHocKy(dataHocKy.map(([ma, ds]) => ds));
			});
	};

	useEffect(() => {
		fetch();
	}, [maKhoaNganh]);

	return (
		<div style={{ backgroundColor: 'transparent', minHeight: '100vh' }}>
			<Spin spinning={loading}>
				{tienTrinhHocKy?.length ? (
					tienTrinhHocKy.map((data, index) => (
						<div key={index} style={{ marginBottom: '32px' }}>
							{/* Header học kỳ */}
							<div
								style={{
									display: 'flex',
									alignItems: 'center',
									marginBottom: '16px',
								}}
							>
								<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
									<Title level={5} style={{ margin: 0, color: '#262626' }}>
										{data[0].kyHoc?.ten}
									</Title>
									<div
										style={{
											width: '8px',
											height: '8px',
											backgroundColor: '#ff4d4f',
											borderRadius: '50%',
										}}
									/>
									<div
										style={{
											color: 'red',
											padding: '2px',
											fontWeight: 500,
										}}
									>
										{_.sumBy(data, (i) => i.soTinChi ?? 0)} tín chỉ
									</div>
								</div>
							</div>

							{/* Grid các môn học */}
							<div
								style={{
									display: 'grid',
									gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
									gap: '16px',
								}}
							>
								{data.map((sv) => (
									<CardHocPhanV2
										key={sv.diemHpSvHk._id}
										hocPhan={sv.hocPhan}
										onClick={() => {
											setRecTienTrinh(sv);
											setVisibleDiem(true);
										}}
										listDiem={sv.diemHpSvHk ? [sv.diemHpSvHk] : []}
									/>
								))}
							</div>

							{/* Divider giữa các học kỳ */}
							{index < tienTrinhHocKy.length - 1 && <Divider style={{ margin: '32px 0', borderColor: '#e8e8e8' }} />}
						</div>
					))
				) : (
					<Empty
						description={<Text style={{ color: '#8c8c8c', fontSize: '16px' }}>Không có dữ liệu</Text>}
						style={{
							marginTop: '100px',
							marginBottom: '32px',
							backgroundColor: '#fff',
							padding: '40px',
							borderRadius: '8px',
							boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
						}}
					/>
				)}
			</Spin>

			<ModalChiTietDiem
				setVisible={setVisibleDiem}
				visible={visibleDiem}
				hocPhan={recTienTrinh?.hocPhan}
				listDiem={recTienTrinh?.diemHpSvHk ? [recTienTrinh.diemHpSvHk] : []}
				deCuongId={recTienTrinh?.lopHocPhan?.deCuong?.deCuongId}
				maKhoaNganh={maKhoaNganh}
			/>
		</div>
	);
};

export default TienTrinhThucTeV2;
