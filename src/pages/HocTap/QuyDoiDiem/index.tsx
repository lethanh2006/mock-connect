import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { ColorDiemChu } from '@/services/HocTap/LopHocPhan/constant';
import type { QuyDoiDiem } from '@/services/HocTap/QuyDoiDiem/typing';
import {
	colorTrangThaiHocPhanQuyDoi,
	colorTrangThaiSinhVienQuyDoiDiem,
	type ETrangThaiPhieuQuyDoiDiem,
} from '@/services/HocTap/constant';
import dayjs from '@/utils/dayjs';
import { Tag } from 'antd';
import { useState } from 'react';
import { useIntl, useModel } from 'umi';
import ViewPhieuQuyDoiDiem from './components/View';

const LichSuQuyDoiDiemPage = () => {
	const intl = useIntl();
	const { page, limit, getModel, setRecord } = useModel('daotao.quydoidiem.phieuquydoidiem');
	const { maKhoaNganh } = useModel('sinhvien.sinhvien');
	const [visibleView, setVisibleView] = useState<boolean>(false);

	const handleViewQuyDoi = (rec: QuyDoiDiem.IPhieuDangKyQuyDoiDiem) => {
		setRecord(rec);
		setVisibleView(true);
	};

	const getData = () => getModel({ maKhoaNganh }, undefined, undefined, undefined, undefined, 'me');

	const onCell = (rec: QuyDoiDiem.IPhieuDangKyQuyDoiDiem) => ({
		onClick: () => handleViewQuyDoi(rec),
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<QuyDoiDiem.IPhieuDangKyQuyDoiDiem>[] = [
		{
			title: intl.formatMessage({ id: 'tientrinhhoctap.congnhan.dot' }),
			dataIndex: 'dotDangKyQuyDoiDiemId',
			width: 150,
			render: (val, rec) => rec?.dotDangKyQuyDoiDiem?.tenDot,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'tientrinhhoctap.congnhan.hp' }),
			width: 320,
			render: (val, rec) => (
				<ExpandText>
					{rec.danhSachHocPhan?.map((item) => (
						<>
							- {item.hocPhan?.ten} -{' '}
							{item.diemChu ? (
								<b style={{ color: ColorDiemChu[item.diemChu] }}>{item.diemChu}</b>
							) : (
								intl.formatMessage({ id: 'tientrinhhoctap.congnhan.chuacodiem' })
							)}{' '}
							- <i style={{ color: colorTrangThaiHocPhanQuyDoi[item.trangThai] }}>{item.trangThai}</i>
							{item?.khuyenNghi?.length ? (
								<>
									{' '}
									-{' '}
									<small
										dangerouslySetInnerHTML={{
											__html: `(${item?.khuyenNghi?.map((items) => items).join(', ')})`,
										}}
									/>
								</>
							) : null}
							<br />
						</>
					))}
				</ExpandText>
			),
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'tientrinhhoctap.congnhan.trangthai' }),
			dataIndex: 'trangThai',
			align: 'center',
			width: 140,
			render: (val, rec) => <Tag color={colorTrangThaiSinhVienQuyDoiDiem[val as ETrangThaiPhieuQuyDoiDiem]}>{val}</Tag>,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'tientrinhhoctap.congnhan.soqd' }),
			dataIndex: 'soQuyetDinhId',
			width: 100,
			align: 'center',
			render: (val, rec) =>
				val && (
					<>
						{rec.quyetDinh?.soQuyetDinh ?? ''},{' '}
						{rec.quyetDinh?.ngayBanHanh ? dayjs(rec.quyetDinh.ngayBanHanh).format('DD/MM/YYYY') : ''}
					</>
				),
			onCell,
		},
	];

	return (
		<>
			<TableBase
				getData={getData}
				columns={columns}
				dependencies={[page, limit, maKhoaNganh]}
				modelName='daotao.quydoidiem.phieuquydoidiem'
				title={intl.formatMessage({ id: 'tientrinhhoctap.congnhan.title' })}
				buttons={{
					create: false,
				}}
				hideCard
			/>

			<ViewPhieuQuyDoiDiem visible={visibleView} setVisible={setVisibleView} />
		</>
	);
};

export default LichSuQuyDoiDiemPage;
