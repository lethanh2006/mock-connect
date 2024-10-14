import { Carousel, Empty, Spin } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import ChartDiemTrungBinh from './ChartDiemTrungBinh';
import ChartSoTinChi from './ChartSoTinChi';
import StatKetQuaTichLuySinhVien from './StatKetQuaTichLuy';
import './style.less';

const KetQuaToanKhoaSinhVien = (props: { maKhoaNganh?: string; loadData?: boolean }) => {
	const { maKhoaNganh, loadData } = props;
	const { getKetQuaHocKy, danhSach, loading } = useModel('daotao.ketquahocky');

	const getData = () => maKhoaNganh && getKetQuaHocKy(maKhoaNganh);

	useEffect(() => {
		if (loadData !== false) getData();
	}, [maKhoaNganh]);

	return (
		<Spin spinning={loading}>
			{danhSach.length ? (
				<>
					<div style={{ marginBottom: 12 }}>
						<StatKetQuaTichLuySinhVien />
					</div>

					<Carousel autoplay pauseOnDotsHover>
						<div>
							<div style={{ marginBottom: 8 }}>
								<ChartSoTinChi />
							</div>
						</div>
						<div>
							<div style={{ marginBottom: 8 }}>
								<ChartDiemTrungBinh />
							</div>
						</div>
					</Carousel>
				</>
			) : (
				<Empty
					description='Chưa có kết quả học tập!'
					image={Empty.PRESENTED_IMAGE_SIMPLE}
					style={{ marginTop: 50, marginBottom: 32 }}
				/>
			)}
		</Spin>
	);
};

export default KetQuaToanKhoaSinhVien;
