import { Alert, Card, Divider, Empty, Spin } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import SelectNamHoc from '../NamHoc/Select';
import DanhSachHoatDongTuan from './DanhSachHoatDongTuan';
import KeHoachHeader from './KeHoachHeader';
import { calHeader } from './functions';
import './style.less';

const KeHoachNamHocPage = (props: { hideSelect?: boolean }) => {
	const { hideSelect } = props;
	const { record: recNam, danhSach: danhSachNamHoc, setRecord: setNamHoc } = useModel('daotao.namhoc');
	const { getAllService: getHocKy } = useModel('daotao.hocky');
	const { loading, getAllModel } = useModel('daotao.kehoachnamhoc');
	const [data, setData] = useState<KeHoachNamHoc.TKeHoachData[]>([]);
	const [header, setHeader] = useState<KeHoachNamHoc.TGridHeader>();
	const getData = async () => {
		getHocKy({ sort: { soThuTu: 1 }, condition: { namHocId: recNam?._id } }).then((hocKyList) => {
			const day = moment(recNam?.thoiGianBatDau).startOf('isoWeek');
			const head = calHeader(day, hocKyList.data?.data ?? [], recNam?.soTuan ?? 0);
			setHeader(head);
		});

		getAllModel(false, { thuTuTuan: 1 }, { namHocId: recNam?._id }).then((res) => {
			const gKhoaNganh = _.groupBy(
				_.sortBy(res, (item) => item.khoaNganh?.maKhoaSinhVien),
				(item) => item.maKhoaNganh,
			);
			const dat: KeHoachNamHoc.TKeHoachData[] = Object.entries(gKhoaNganh)?.map(([maKhoaNganh, keHoachList]) => ({
				maKhoa: keHoachList[0].khoaNganh?.maKhoaSinhVien,
				maNganh: keHoachList[0].khoaNganh?.maNganh,
				maKhoaNganh,
				keHoachList,
				tenKhoaNganh: [keHoachList[0].khoaNganh?.khoaSinhVien?.ten, keHoachList[0].khoaNganh?.nganh?.ma].join(' - '),
			}));
			setData(dat);
		});
	};

	useEffect(() => {
		if (recNam?._id) getData();
	}, [recNam?._id]);

	const mainContent = () => (
		<div className='table-base'>
			{!hideSelect ? (
				<SelectNamHoc
					isSetRecord={!recNam?._id}
					style={{ width: '200px' }}
					value={recNam?._id}
					onChange={(id) => setNamHoc(danhSachNamHoc.find((item) => item._id === id))}
				/>
			) : null}

			{!recNam?.isKhoiTaoKeHoach ? (
				<Spin spinning={loading}>
					<div style={{ display: 'flex', justifyContent: 'center', margin: '24px 12px' }}>
						<Empty description={<>Chưa có kế hoạch năm học!</>} />
					</div>
				</Spin>
			) : recNam.daChotKeHoachNamHoc ? (
				<>
					<Divider>Chi tiết kế hoạch năm học theo từng ngành đào tạo</Divider>
					<Spin spinning={loading}>
						<div className='grid-ke-hoach'>
							<KeHoachHeader header={header} />

							{data.map((item) => (
								<div className='row-ke-hoach' key={item.maKhoaNganh}>
									<div className='cell first-cell border-right'>{item.maKhoaNganh}</div>
									{_.sortBy(item.keHoachList, (j) => j.thuTuTuan).map((kh, index) => (
										<div
											className={`cell ${header?.days?.[index]?.isBreak ? 'break' : ''}`}
											key={kh._id}
											style={{
												backgroundColor: kh.hoatDongTuan?.maMau,
												cursor: header?.days?.[index]?.isBreak ? 'not-allowed' : undefined,
											}}
										>
											{header?.days?.[index]?.isBreak ? null : kh.hoatDongTuan?.kyHieu ?? '--'}
										</div>
									))}
								</div>
							))}
						</div>
					</Spin>

					<DanhSachHoatDongTuan />
				</>
			) : (
				<div style={{ marginTop: 12 }}>
					<Alert description={<>Chưa chốt kế hoạch năm học</>} showIcon type='warning' />
				</div>
			)}
		</div>
	);

	return <>{!hideSelect ? <Card title='Kế hoạch năm học'>{mainContent()}</Card> : mainContent()}</>;
};

export default KeHoachNamHocPage;
