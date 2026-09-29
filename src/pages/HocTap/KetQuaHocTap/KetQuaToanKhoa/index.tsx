import EmptyState from '@/components/EmptyState';
import { Carousel, Divider, Spin } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import ChartDiemTrungBinh from './ChartDiemTrungBinh';
import ChartSoTinChi from './ChartSoTinChi';
import StatKetQuaTichLuySinhVien from './StatKetQuaTichLuy';

const KetQuaToanKhoaSinhVien = (props: {
	maKhoaNganh?: string;
	loadData?: boolean;
	data?: import('@/services/HocTap/KetQuaHocKy/typing').KetQuaHocKy.IRecord[];
	tongSoTinChiChuongTrinh?: number;
}) => {
	const intl = useIntl();
	const { maKhoaNganh, loadData, data, tongSoTinChiChuongTrinh } = props;
	const { getKetQuaHocKy, danhSach: danhSachModel, loading: loadingModel } = useModel('daotao.ketquahocky');
	const danhSach = data ?? danhSachModel;
	const loading = data ? false : loadingModel;

	const getData = () => maKhoaNganh && getKetQuaHocKy(maKhoaNganh);

	useEffect(() => {
		if (!data && loadData !== false) getData();
	}, [data, maKhoaNganh]);

	return (
		<Spin spinning={loading}>
			{danhSach.length ? (
				<>
					<StatKetQuaTichLuySinhVien
						maKhoaNganh={maKhoaNganh}
						record={data?.at(-1)}
						tongSoTinChiChuongTrinh={tongSoTinChiChuongTrinh}
					/>
					<Divider orientation='left' dashed className='divider-big-title'>
						{intl.formatMessage({ id: 'ketquahoctap.chart.creditStatistics' })}
					</Divider>
					<Carousel pauseOnDotsHover style={{ marginTop: 12 }} autoplay>
						<div>
							<div style={{ marginBottom: 8 }}>
								<ChartSoTinChi data={data} />
							</div>
						</div>
						<div>
							<div style={{ marginBottom: 8 }}>
								<ChartDiemTrungBinh data={data} />
							</div>
						</div>
						{/* <div>
							<div style={{ marginBottom: 8 }}>
								<ChartPloToanKhoa maKhoaNganh={maKhoaNganh ?? ''} />
							</div>
						</div> */}
					</Carousel>
				</>
			) : (
				<EmptyState
					description={intl.formatMessage({ id: 'ketquahoctap.empty' })}
					style={{ marginTop: 50, marginBottom: 32 }}
				/>
			)}
		</Spin>
	);
};

export default KetQuaToanKhoaSinhVien;
