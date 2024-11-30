import ViewKetQuaHocKy from '@/pages/HocTap/KetQuaHocTap/KetQuaHocKy/ViewKetQua';
import type { KetQuaHocKy } from '@/services/HocTap/KetQuaHocKy/typing';
import { Empty, Spin, Tabs } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import TableDiemHocKyHocBa from './TableDiemHocKy';
import ViewKqRenLuyenYKienHocBa from './ViewRenLuyen';

const TabHocTapRenLuyenSinhVien = () => {
	const { record: recSinhVien, maKhoaNganh } = useModel('sinhvien.sinhvien');
	const {
		getAllModel: getHocBa,
		setRecord: setHocBa,
		record: recHocBa,
		loading,
		danhSach,
		setDanhSach,
	} = useModel('sinhvien.hocba.hocba');
	const { setRecord: setKqhtHocKy } = useModel('daotao.ketquahocky');

	useEffect(() => {
		if (recSinhVien?.ssoId && maKhoaNganh)
			getHocBa(true, undefined, undefined, undefined, `all-hoc-ba/me/${maKhoaNganh}`).then((res) => {
				setKqhtHocKy(res[0] as any);
			});
		else setDanhSach([]);
	}, [recSinhVien?.ssoId, maKhoaNganh]);

	const onChangeHocKy = (maHocKy: string) => {
		const hocBa = danhSach.find((i) => i.maHocKy === maHocKy);
		setKqhtHocKy(hocBa as KetQuaHocKy.IRecord | undefined);
		setHocBa(hocBa);
	};

	if (!recSinhVien?.ssoId) return null;
	return (
		<>
			<Spin spinning={loading}>
				{!!danhSach.length ? (
					<>
						<Tabs
							activeKey={recHocBa?.maHocKy}
							onChange={(tab) => onChangeHocKy(tab)}
							type='card'
							tabBarExtraContent={{
								left: (
									<span style={{ marginRight: 12 }} className='fw500'>
										DS học kỳ
									</span>
								),
							}}
						>
							{danhSach.map((hk) => (
								<Tabs.TabPane key={hk.maHocKy} tab={`${hk.maHocKy}`} />
							))}
						</Tabs>

						{maKhoaNganh && recHocBa?.maHocKy ? (
							<>
								<ViewKetQuaHocKy />

								<div style={{ marginTop: 12 }}>
									<ViewKqRenLuyenYKienHocBa />
								</div>

								<TableDiemHocKyHocBa maKhoaNganh={maKhoaNganh} />
							</>
						) : null}
					</>
				) : (
					<Empty description='Không có dữ liệu' />
				)}
			</Spin>
		</>
	);
};

export default TabHocTapRenLuyenSinhVien;
