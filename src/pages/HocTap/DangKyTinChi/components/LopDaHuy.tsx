import ExpandText from '@/components/ExpandText';
import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import type { DangKyTinChi } from '@/services/DaoTao/DangKyTinChi/typing';
import { ELoaiLopHocPhan } from '@/services/HocTap/LopHocPhan/constant';
import { formatDateTime } from '@/utils/formatDate';
import { Empty, Tag } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import RenderLichHoc from './RenderLichHoc';

const getLopData = (rec: DangKyTinChi.AuditLog): DangKyTinChi.ILopDangKy | undefined =>
	rec.response?.data as DangKyTinChi.ILopDangKy | undefined;

const LopDaHuy = () => {
	const intl = useIntl();
	const { phieuDangKy, dotDangKyHienTai, sinhVienDot, getLopDaHuyDangKyTinChiModel, danhSachLopDaHuy, loading } =
		useModel('daotao.dotdangkytinchi');

	useEffect(() => {
		if (phieuDangKy?._id) getLopDaHuyDangKyTinChiModel(phieuDangKy._id);
	}, [phieuDangKy?._id]);

	const onReload = () => {
		if (phieuDangKy?._id) getLopDaHuyDangKyTinChiModel(phieuDangKy._id);
	};

	const columns: IColumn<DangKyTinChi.AuditLog>[] = [
		{
			title: intl.formatMessage({ id: 'dangkytinchi.lopdahuy.columntable.mahocphan' }),
			align: 'center',
			width: 100,
			render: (_, rec) => getLopData(rec)?.lopHocPhan?.maHocPhan,
		},
		{
			title: intl.formatMessage({ id: 'dangkytinchi.lopdahuy.columntable.tenhocphan' }),
			width: 170,
			render: (_, rec) => getLopData(rec)?.lopHocPhan?.hocPhan?.ten,
		},
		{
			title: intl.formatMessage({ id: 'dangkytinchi.lopdahuy.columntable.malop' }),
			width: 120,
			align: 'center',
			render: (_, rec) => {
				const lop = getLopData(rec)?.lopHocPhan;
				if (!lop) return null;
				return `${lop.maLop ?? lop.ten}`;
			},
		},
		{
			title: intl.formatMessage({ id: 'dangkytinchi.lopdahuy.columntable.sotinchi' }),
			width: 80,
			align: 'center',
			render: (_, rec) => {
				const lop = getLopData(rec);
				const soTinChi = lop?.lopHocPhan?.hocPhan?.soTinChi;
				return soTinChi ?? '-';
			},
		},
		{
			title: intl.formatMessage({ id: 'dangkytinchi.lopdahuy.columntable.giangvien' }),
			width: 160,
			render: (_, rec) => {
				const lop = getLopData(rec)?.lopHocPhan;
				return (
					<ExpandText>
						{lop?.nhanSuList
							?.map((item) =>
								item.nhanSu?.ten ? `${item.nhanSu?.hoDem ?? ''} ${item.nhanSu?.ten ?? ''}` : item.tenNhanSu,
							)
							.join(', ')}
					</ExpandText>
				);
			},
		},
		{
			title: intl.formatMessage({ id: 'dangkytinchi.lopdahuy.columntable.lichhoc' }),
			width: 250,
			render: (_, rec) => {
				const lopHocPhan = getLopData(rec)?.lopHocPhan;
				return lopHocPhan ? <RenderLichHoc lopHocPhan={{ ...lopHocPhan, loai: ELoaiLopHocPhan.CHINH }} /> : null;
			},
		},
		{
			title: intl.formatMessage({ id: 'dangkytinchi.lopdahuy.columntable.tgdangky' }),
			width: 150,
			render: (_, rec) => {
				const thoiGianDangKy = getLopData(rec)?.createdAt ?? (rec.data as { createdAt?: string })?.createdAt;
				return thoiGianDangKy ? formatDateTime(thoiGianDangKy) : '--';
			},
		},
		{
			title: intl.formatMessage({ id: 'dangkytinchi.lopdahuy.columntable.tghuy' }),
			width: 150,
			render: (_, rec) => (rec.createdAt ? formatDateTime(rec.createdAt) : '-'),
		},
		{
			title: intl.formatMessage({ id: 'dangkytinchi.lopdahuy.columntable.trangthai' }),
			width: 120,
			align: 'center',
			render: () => (
				<Tag color='red'>{intl.formatMessage({ id: 'dangkytinchi.lopdahuy.columntable.trangthai.dahuy' })}</Tag>
			),
		},
		{
			title: intl.formatMessage({ id: 'dangkytinchi.lopdahuy.columntable.ghichu' }),
			width: 160,
			render: (_, rec) => <ExpandText>{(rec.data as { ghiChu?: string })?.ghiChu ?? '-'}</ExpandText>,
		},
	];

	if (!dotDangKyHienTai || !sinhVienDot)
		return (
			<Empty
				description={
					<i style={{ color: '#999' }}>
						{intl.formatMessage({ id: 'dangkytinchi.thongtindangky.empty.khongcodotdangky' })}
					</i>
				}
			/>
		);

	return (
		<TableStaticData
			columns={columns}
			data={danhSachLopDaHuy ?? []}
			addStt
			hasTotal
			loading={loading}
			onReload={onReload}
		/>
	);
};

export default LopDaHuy;
