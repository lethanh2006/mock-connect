import { Carousel, Empty, Spin } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import ChartDiemTrungBinh from './ChartDiemTrungBinh';
import ChartSoTinChi from './ChartSoTinChi';
import StatKetQuaTichLuySinhVien from './StatKetQuaTichLuy';
import './style.less';

const KetQuaToanKhoaSinhVien = (props: { maKhoaNganh?: string }) => {
	const { maKhoaNganh } = props;
	const { getAllModel: getKetQuaHocKy, danhSach, loading, setRecord } = useModel('daotao.ketquahocky');

	const getData = () =>
		maKhoaNganh &&
		getKetQuaHocKy(false, { maHocKy: 1 }, undefined, undefined, `me/many/khoa-nganh/${maKhoaNganh}`).then((res) => {
			if (res.length) setRecord(res.at(-1));
		});

	useEffect(() => {
		getData();
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
