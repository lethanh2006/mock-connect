import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import { ETrangThaiDuThi, trangThaiDuThi } from '@/services/KhaoThi/SinhVienThi/constant';
import type { SinhVienThi } from '@/services/KhaoThi/SinhVienThi/typing';
import { IconShieldInfo } from '@/components/Icons';
import { Popover } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const DiemThiHocKy = (props: { maHocKy: string; maHocPhan: string }) => {
	const intl = useIntl();
	const { maHocKy, maHocPhan } = props;
	const { diemThiHocKySinhVien, loading, getDiemThiHocKySinhVienModel } = useModel('khaothi.sinhvienthi');

	useEffect(() => {
		if (maHocKy && maHocPhan) {
			getDiemThiHocKySinhVienModel(maHocKy, maHocPhan);
		}
	}, []);

	const columns: IColumn<SinhVienThi.IDiemThiHocKySinhVien>[] = [
		{
			title: intl.formatMessage({ id: 'lophocphan.id.ketqua.diemhk.kythi' }),
			width: 250,
			render: (val, rec) => rec?.kyThi?.ten ?? '--',
		},
		{
			title: intl.formatMessage({ id: 'lophocphan.id.ketqua.diemhk.htthi' }),
			dataIndex: ['hocPhanThi', 'tenHinhThucThi'],
			align: 'center',
			width: 100,
		},
		{
			title: intl.formatMessage({ id: 'lophocphan.id.ketqua.diemhk.sbd' }),
			dataIndex: ['sinhVienThi', 'sbd'],
			align: 'center',
			width: 80,
		},
		{
			title: intl.formatMessage({ id: 'lophocphan.id.ketqua.diemhk.trangthai' }),
			dataIndex: ['sinhVienThi', 'trangThai'],
			align: 'center',
			width: 120,
		},
		{
			title: intl.formatMessage({ id: 'lophocphan.id.ketqua.diemhk.diemthi' }),
			dataIndex: 'diemKthp',
			align: 'center',
			width: 100,
			render: (val, rec) => (
				<>
					{rec.sinhVienThi.trangThaiDuThi && rec.sinhVienThi.trangThaiDuThi !== ETrangThaiDuThi.OK ? (
						<span title={trangThaiDuThi[rec.sinhVienThi.trangThaiDuThi]}>{rec?.sinhVienThi?.trangThaiDuThi}</span>
					) : (
						(val ?? '--')
					)}{' '}
					{val ? (
						<Popover
							content={
								<div>
									{rec?.sinhVienThi?.ketQuaChamChinhThuc?.danhSachDiem?.[0]?.diemThanhPhan?.map((diem, ind) => (
										// eslint-disable-next-line react/no-array-index-key
										<p key={ind}>
											{rec?.hocPhanThi?.danhSachDiemThanhPhan?.[ind]?.tenDauDiem ??
												`${intl.formatMessage({ id: 'lophocphan.id.ketqua.diemhk.cau' })} ${ind + 1}`}
											: {diem}
										</p>
									))}
								</div>
							}
							title={intl.formatMessage({ id: 'lophocphan.id.ketqua.diemhk.chitiet' })}
						>
							<IconShieldInfo />
						</Popover>
					) : null}
				</>
			),
		},
		{
			title: intl.formatMessage({ id: 'lophocphan.id.ketqua.diemhk.phuckhao' }),
			dataIndex: 'diemPhucKhao',
			align: 'center',
			width: 100,
		},
	];

	return (
		<TableStaticData
			addStt
			data={diemThiHocKySinhVien}
			columns={columns}
			size='small'
			loading={loading}
			otherProps={{ pagination: false, scroll: { y: 150 } }}
		/>
	);
};

export default DiemThiHocKy;
