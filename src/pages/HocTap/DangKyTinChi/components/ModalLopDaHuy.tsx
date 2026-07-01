import ExpandText from '@/components/ExpandText';
import ModalExpandable from '@/components/Table/ModalExpandable';
import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import type { DangKyTinChi } from '@/services/DaoTao/DangKyTinChi/typing';
import { ELoaiLopHocPhan } from '@/services/HocTap/LopHocPhan/constant';
import { ELogActionDktc, logActionDktc } from '@/services/TienIch/AuditLog/constant';
import { formatDateTime } from '@/utils/formatDate';
import { Button } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import RenderLichHoc from './RenderLichHoc';

const ModalLopDaHuy = (props: { visible: boolean; setVisible: (val: boolean) => void }) => {
	const intl = useIntl();

	const { visible, setVisible } = props;
	const {
		phieuDangKy,
		dotDangKyHienTai,
		getPhieuDangKyModel,
		getLopDaHuyDangKyTinChiModel,
		danhSachLopDaHuy,
		loading,
	} = useModel('daotao.dotdangkytinchi');

	const getDataHuy = async () => {
		if (!dotDangKyHienTai?._id) return;

		const isPhieuHienTai = phieuDangKy?.idDotDangKyTinChi === dotDangKyHienTai._id;
		const nextPhieuDangKy =
			phieuDangKy?._id && isPhieuHienTai ? phieuDangKy : await getPhieuDangKyModel(dotDangKyHienTai._id);

		if (nextPhieuDangKy?._id) {
			getLopDaHuyDangKyTinChiModel(nextPhieuDangKy._id);
		}
	};

	useEffect(() => {
		if (visible) {
			getDataHuy();
		}
	}, [dotDangKyHienTai?._id, phieuDangKy?._id, phieuDangKy?.idDotDangKyTinChi, visible]);

	// const tongHocPhi = _.sumBy(danhSachLopDaHuy, (lop) =>
	// 	tinhHocPhi(lop?.lopHocPhan?.hocPhan?.soTinChi, lop.lopHocPhan.loai, lop?.lopHocPhan?.maNganh),
	// );

	const columnsLopHuy: IColumn<DangKyTinChi.AuditLog>[] = [
		{
			title: intl.formatMessage({ id: 'dangkytinchi.modallophuy.columntable.mahp' }),
			align: 'center',
			dataIndex: ['response', 'data'],
			width: 140,
			render: (val: DangKyTinChi.ILopDangKy) => {
				return val?.lopHocPhan?.maHocPhan;
			},
		},
		{
			title: intl.formatMessage({ id: 'dangkytinchi.modallophuy.columntable.tenhocphan' }),
			dataIndex: ['response', 'data'],
			width: 170,
			render: (val: DangKyTinChi.ILopDangKy) => val?.lopHocPhan?.hocPhan?.ten,
		},
		{
			title: intl.formatMessage({ id: 'dangkytinchi.dankylophocphan.columntable.malop' }),
			width: 140,
			dataIndex: ['response', 'data'],
			align: 'center',
			render: (val: DangKyTinChi.ILopDangKy) => val?.lopHocPhan?.maLop ?? val?.lopHocPhan?.ten,
		},
		{
			title: intl.formatMessage({ id: 'dangkytinchi.modallophuy.columntable.sotinchi' }),
			width: 90,
			dataIndex: ['response', 'data'],
			align: 'center',
			render: (val: DangKyTinChi.ILopDangKy) => (
				<>
					{val?.lopHocPhan?.hocPhan?.soTinChi}{' '}
					{val?.lopHocPhan?.hocPhan?.loaiHocPhan?.isTinhSoTinChiDangKy === false ? (
						<i>{intl.formatMessage({ id: 'dangkytinchi.modallophuy.columntable.label.khongtinh' })}</i>
					) : null}
				</>
			),
		},
		{
			title: intl.formatMessage({ id: 'dangkytinchi.modallophuy.columntable.giangvien' }),
			dataIndex: ['response', 'data'],
			width: 160,
			render: (val: DangKyTinChi.ILopDangKy) => (
				<ExpandText>
					{val?.lopHocPhan?.nhanSuList
						?.map((item) =>
							item.nhanSu?.ten ? `${item.nhanSu?.hoDem ?? ''} ${item.nhanSu?.ten ?? ''}` : item.tenNhanSu,
						)
						.join(', ')}
				</ExpandText>
			),
		},
		{
			title: intl.formatMessage({ id: 'dangkytinchi.modallophuy.columntable.thongtinchitiet' }),
			dataIndex: ['response', 'data'],
			width: 250,
			render: (val: DangKyTinChi.ILopDangKy) => (
				<RenderLichHoc lopHocPhan={{ ...val?.lopHocPhan, loai: ELoaiLopHocPhan.CHINH } as any} />
			),
		},

		{
			title: intl.formatMessage({ id: 'dangkytinchi.lichsuthaotac.columntable.ip' }),
			dataIndex: 'ip',
			align: 'center',
			width: 120,
			filterType: 'string',
			render: (val, rec) => val ?? (rec.data as { ip?: string })?.ip ?? '--',
		},
		{
			title: intl.formatMessage({ id: 'dangkytinchi.lichsuthaotac.columntable.thoigianthuchien' }),
			width: 160,
			dataIndex: 'createdAt',
			render: (val) => (val ? formatDateTime(val) : '--'),
		},
		{
			title: intl.formatMessage({ id: 'dangkytinchi.lopdahuy.columntable.ghichu' }),
			width: 160,
			render: (_, rec) => {
				const responseData = rec.response?.data as DangKyTinChi.ILopDangKy & { ghiChu?: string };
				const logData = rec.data as { ghiChu?: string; note?: string };
				return <ExpandText>{logData?.ghiChu ?? logData?.note ?? responseData?.ghiChu ?? '--'}</ExpandText>;
			},
		},
		{
			title: intl.formatMessage({ id: 'dangkytinchi.lichsuthaotac.columntable.loaithaotac' }),
			dataIndex: 'action',
			width: 160,
			fixed: 'right',
			align: 'center',
			filterType: 'select',
			filterData: [ELogActionDktc.SV_DK_LTC, ELogActionDktc.SV_DEL_DK_LTC].map((val) => ({
				label: intl.formatMessage({ id: logActionDktc[val] ?? val }),
				value: val,
			})),
			render: (val: ELogActionDktc) =>
				val ? <span>{intl.formatMessage({ id: logActionDktc[val] ?? val })}</span> : '--',
		},
	];

	return (
		<ModalExpandable
			title={intl.formatMessage({ id: 'dangkytinchi.lichsuthaotac.title' })}
			open={visible}
			onCancel={() => setVisible(false)}
			width={1100}
			footer={null}
		>
			<TableStaticData
				columns={columnsLopHuy}
				data={danhSachLopDaHuy ?? []}
				addStt
				loading={loading}
				hasTotal
				onReload={getDataHuy}
				otherProps={{ pagination: false, scroll: { y: 600 } }}
			/>

			<div className='form-footer'>
				<Button onClick={() => setVisible(false)}>{intl.formatMessage({ id: 'dangkytinchi.action.dong' })}</Button>
			</div>
		</ModalExpandable>
	);
};

export default ModalLopDaHuy;
