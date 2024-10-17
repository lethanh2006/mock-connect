import { Alert, Card, Divider, Empty, Spin } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import { useModel } from 'umi';
import SelectNamHoc from '../NamHoc/Select';
import DanhSachHoatDongTuan from './DanhSachHoatDongTuan';
import KeHoachHeader from './KeHoachHeader';
import { calHeader } from './functions';
import './style.less';

const KeHoachNamHocPage = (props: { hideSelect?: boolean }) => {
	const { hideSelect } = props;
	const { record: recNam, danhSach: danhSachNam, setRecord: setNam } = useModel('daotao.namhoc');
	const { getAllService: getHocKy } = useModel('daotao.hocky');
	const { loading, getDataModel } = useModel('daotao.kehoachnamhoc');
	const { getAllModel: getKhoa } = useModel('daotao.khoasinhvien');
	const { getAllModel: getNganh } = useModel('daotao.nganhdaotao');
	const [data, setData] = useState<KeHoachNamHoc.TKeHoachData[]>([]);
	const [header, setHeader] = useState<KeHoachNamHoc.TGridHeader>();
	// Để lấy dữ liệu đầy đủ của toàn bộ khóa, ngành
	const mapNganh = useRef<Record<string, NganhDaoTao.IRecordCoSo>>();
	const mapKhoa = useRef<Record<string, KhoaSinhVien.IRecord>>();

	/** Lấy danh sách học kỳ, tính toán giá trị tháng, tuần, ngày
	 * Lấy toàn bộ kế hoạch năm học & group by `Khóa ngành`N
	 */
	const getData = async () => {
		getHocKy({ sort: { soThuTu: 1 }, condition: { namHocId: recNam?._id } }).then((hocKyList) => {
			const day = moment(recNam?.thoiGianBatDau).startOf('isoWeek');
			const head = calHeader(day, hocKyList.data?.data ?? [], recNam?.soTuan ?? 0);
			setHeader(head);
		});

		getDataModel(recNam?._id ?? '').then((res) => {
			const gKhoaNganh = _.groupBy(
				_.sortBy(res, (item) => [item.khoaNganh?.maKhoaSinhVien, item.khoaNganh?.maNganh]),
				(item) => item.maKhoaNganh,
			);
			/** Với khóa mới thì chỉ hiển thị của 1 khóa ngành đầu tiên */
			const khoaMoiMap = new Set();
			const dat: KeHoachNamHoc.TKeHoachData[] = [];
			Object.entries(gKhoaNganh)?.forEach(([maKhoaNganh, keHoachList]) => {
				const khoa = mapKhoa.current?.[keHoachList[0].khoaNganh.maKhoaSinhVien];
				const nganh = mapNganh.current?.[keHoachList[0].khoaNganh?.maNganh];
				const isKhoaMoi = khoa?.ma && recNam?.maKhoaMoiList?.includes(khoa.ma);
				if (!khoaMoiMap.has(khoa?.ma))
					dat.push({
						maKhoa: keHoachList[0].khoaNganh?.maKhoaSinhVien,
						maNganh: keHoachList[0].khoaNganh?.maNganh,
						maTrinhDo: khoa?.maTrinhDoDaoTao,
						maHinhThuc: khoa?.maHinhThucDaoTao,
						maKhoaNganh,
						keHoachList,
						tenKhoaNganh: isKhoaMoi ? `KHÓA ${khoa.ten}` : [khoa?.ten, nganh?.ten].join(' - '),
						tenKhoaNganhVietTat: isKhoaMoi
							? `KHÓA ${khoa.ten}`
							: [khoa?.ten, nganh?.tenVietTat ?? nganh?.ten].join('').toUpperCase(),
					});
				if (isKhoaMoi) khoaMoiMap.add(khoa.ma);
			});
			setData(dat);
		});
	};

	const getMapNganh = async () => {
		const res = await getNganh(undefined, undefined, undefined, undefined, undefined, false);
		const temp = {};
		res.map((item) => Object.assign(temp, { [item.ma]: item }));
		return temp;
	};

	const getMapKhoa = async () => {
		const res = await getKhoa(undefined, undefined, undefined, undefined, undefined, false);
		const temp = {};
		res.map((item) => Object.assign(temp, { [item.ma]: item }));
		return temp;
	};

	const updateNamHoc = async () => {
		if (recNam?.isKhoiTaoKeHoach && recNam.daChotKeHoachNamHoc) {
			if (!mapNganh.current) mapNganh.current = await getMapNganh();
			if (!mapKhoa.current) mapKhoa.current = await getMapKhoa();
			getData();
		}
	};

	useEffect(() => {
		updateNamHoc();
	}, [recNam?._id]);

	const mainContent = () => (
		<div className='table-base'>
			{!hideSelect ? (
				<SelectNamHoc
					isSetRecord={!recNam?._id}
					style={{ width: '200px' }}
					value={recNam?._id}
					onChange={(id) => setNam(danhSachNam.find((item) => item._id === id))}
				/>
			) : null}

			<Spin spinning={loading}>
				{!recNam?.isKhoiTaoKeHoach ? (
					<div style={{ display: 'flex', justifyContent: 'center', margin: '24px 12px' }}>
						<Empty description={<>Chưa có kế hoạch năm học!</>} />
					</div>
				) : recNam.daChotKeHoachNamHoc ? (
					<>
						<Divider>Chi tiết kế hoạch năm học theo từng ngành đào tạo</Divider>
						<Spin spinning={loading}>
							<div className='grid-ke-hoach'>
								<KeHoachHeader header={header} />

								{data.map((item) => (
									<div className='row-ke-hoach' key={item.maKhoaNganh}>
										<div className='cell first-cell border-right' title={item.tenKhoaNganh}>
											{item.tenKhoaNganhVietTat}
										</div>
										{_.sortBy(item.keHoachList, (j) => j.thuTuTuan).map((kh, index) => (
											<div
												className={`cell ${
													!!kh.ghiChu
														? 'highlight1'
														: index && header?.days?.[index - 1]?.isBreak && !kh.hoatDongTuan?._id
														? 'break'
														: ''
												}`}
												key={kh._id}
												title={kh.ghiChu ?? kh.hoatDongTuan?.ten}
												style={{
													backgroundColor: kh.hoatDongTuan?.maMau,
												}}
											>
												{kh.ghiChu ?? kh.hoatDongTuan?.kyHieu ?? '--'}
											</div>
										))}
									</div>
								))}
							</div>
						</Spin>

						<DanhSachHoatDongTuan />
					</>
				) : (
					<div style={{ marginTop: 24 }}>
						<Empty description={<>Chưa công bố kế hoạch năm học</>} />
					</div>
				)}
			</Spin>
		</div>
	);

	return <>{!hideSelect ? <Card title='Kế hoạch năm học'>{mainContent()}</Card> : mainContent()}</>;
};

export default KeHoachNamHocPage;
