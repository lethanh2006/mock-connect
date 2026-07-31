import { Empty, Spin } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import StatKetQuaTichLuySinhVien from './StatKetQuaTichLuy';

const KetQuaToanKhoaSinhVien = (props: { maKhoaNganh?: string; loadData?: boolean }) => {
	const intl = useIntl();
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
					<StatKetQuaTichLuySinhVien maKhoaNganh={maKhoaNganh} />
					{/* <Divider orientation='left' dashed className='divider-big-title'>
						{intl.formatMessage({ id: 'ketquahoctap.chart.creditStatistics' })}
					</Divider> */}
					{/* <Carousel pauseOnDotsHover style={{ marginTop: 12 }} autoplay>
						<div>
							<div style={{ marginBottom: 8 }}>
								<ChartSoTinChi />
							</div>
						</div>
						<div>
							<div style={{ marginBottom: 8 }}>
								<ChartDiemTrungBinh />
							</div>
						</div> */}
					{/* <div>
							<div style={{ marginBottom: 8 }}>
								<ChartPloToanKhoa maKhoaNganh={maKhoaNganh ?? ''} />
							</div>
						</div> */}
					{/* </Carousel> */}
				</>
			) : (
				<Empty
					description={intl.formatMessage({ id: 'ketquahoctap.empty' })}
					image={Empty.PRESENTED_IMAGE_SIMPLE}
					style={{ marginTop: 50, marginBottom: 32 }}
				/>
			)}
		</Spin>
	);
};

export default KetQuaToanKhoaSinhVien;
