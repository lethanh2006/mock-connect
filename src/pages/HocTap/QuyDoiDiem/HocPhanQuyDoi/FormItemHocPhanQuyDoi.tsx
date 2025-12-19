import ExpandText from '@/components/ExpandText';
import ButtonExtend from '@/components/Table/ButtonExtend';
import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';
import { ColorDiemChu, type ELoaiDiemChu } from '@/services/HocTap/LopHocPhan/constant';
import type { QuyDoiDiem } from '@/services/HocTap/QuyDoiDiem/typing';
import {
	EMinhChungQuyDoiDiem,
	ETrangThaiHocPhanQuyDoi,
	ETrangThaiPhieuQuyDoiDiem,
	colorTrangThaiHocPhanQuyDoi,
} from '@/services/HocTap/constant';
import { EditOutlined } from '@ant-design/icons';
import { Tag } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import FormHocPhanQuyDoiDiem from './Form';

const FormItemHocPhanQuyDoi = () => {
	const intl = useIntl();
	const { getModel, danhSach, loading, handleView, handleEdit } = useModel('daotao.quydoidiem.sinhvienquydoidiem');
	const { record: recPhieu } = useModel('daotao.quydoidiem.phieuquydoidiem');

	const getData = () => getModel({ phieuDangKyQuyDoiDiemId: recPhieu?._id });

	useEffect(() => {
		if (recPhieu?._id) getData();
	}, [recPhieu?._id]);

	const onCell = (rec: QuyDoiDiem.IQuyDoiDiemSinhVien) => ({
		onClick: () => handleView(rec),
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<QuyDoiDiem.IQuyDoiDiemSinhVien>[] = [
		{
			title: intl.formatMessage({ id: 'tientrinhhoctap.congnhan.hocphan.hocphan' }),
			width: 300,
			children: [
				{
					title: intl.formatMessage({ id: 'tientrinhhoctap.congnhan.hocphan.mahp' }),
					width: 80,
					dataIndex: 'maHocPhan',
					align: 'center',
					onCell,
				},
				{
					title: intl.formatMessage({ id: 'tientrinhhoctap.congnhan.hocphan.tenhp' }),
					width: 160,
					render: (val, rec) => rec.hocPhan?.ten,
					onCell,
				},
				{
					title: intl.formatMessage({ id: 'tientrinhhoctap.congnhan.hocphan.stc' }),
					width: 60,
					align: 'center',
					render: (val, rec) => rec.hocPhan?.soTinChi,
					onCell,
				},
			],
		},
		{
			title: intl.formatMessage({ id: 'tientrinhhoctap.congnhan.hocphan.minhchung' }),
			width: 220,
			render: (val, rec) => (
				<>
					{rec?.loai}:{' '}
					{(rec?.loai === EMinhChungQuyDoiDiem.CHUNG_CHI
						? rec?.tenChungChi
						: rec.loai === EMinhChungQuyDoiDiem.NCKH
							? rec.tenDeTaiNckh
							: rec?.tenHocPhan) ?? ''}
				</>
			),
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'tientrinhhoctap.congnhan.hocphan.ketqua' }),
			dataIndex: 'diemChu',
			align: 'center',
			width: 120,
			render: (val: ELoaiDiemChu, rec) =>
				val ? (
					<>
						{rec.diemHe10 ?? ''} - {rec.diemHe4 ?? ''} - <b style={{ color: ColorDiemChu[val] }}>{val}</b>
						{rec.tinhDiemTichLuy ? (
							<span className='text-success'>
								{' '}
								{intl.formatMessage({ id: 'tientrinhhoctap.congnhan.hocphan.tichluy' })}
							</span>
						) : null}
					</>
				) : (
					<i>{intl.formatMessage({ id: 'tientrinhhoctap.congnhan.hocphan.chuacodiem' })}</i>
				),
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'tientrinhhoctap.congnhan.hocphan.ghichu' }),
			dataIndex: 'ghiChu',
			width: 180,
			render: (val, rec) => <ExpandText>{val}</ExpandText>,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'tientrinhhoctap.congnhan.hocphan.trangthai' }),
			dataIndex: 'trangThai',
			align: 'center',
			width: 130,
			render: (val, rec) => <Tag color={colorTrangThaiHocPhanQuyDoi[val as ETrangThaiHocPhanQuyDoi]}>{val}</Tag>,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'tientrinhhoctap.congnhan.hocphan.thaotac' }),
			align: 'center',
			width: 60,
			fixed: 'right',
			render: (val, rec) => (
				<ButtonExtend
					disabled={
						rec?.trangThai !== ETrangThaiHocPhanQuyDoi.CHO_XU_LY ||
						recPhieu?.trangThai !== ETrangThaiPhieuQuyDoiDiem.CHO_XU_LY
					}
					tooltip={intl.formatMessage({ id: 'tientrinhhoctap.congnhan.hocphan.edit' })}
					onClick={() => handleEdit(rec)}
					type='link'
					icon={<EditOutlined />}
				/>
			),
		},
	];

	return (
		<>
			<div className='fw500' style={{ marginTop: 8, marginBottom: 8 }}>
				{intl.formatMessage({ id: 'tientrinhhoctap.congnhan.hocphan.title' })}
			</div>

			<TableStaticData
				loading={loading}
				data={danhSach}
				columns={columns}
				size='small'
				addStt
				otherProps={{ pagination: false }}
			/>
			<FormHocPhanQuyDoiDiem getData={getData} />
		</>
	);
};

export default FormItemHocPhanQuyDoi;
