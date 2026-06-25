import PreviewFile from '@/components/PreviewFile';
import ModalExpandable from '@/components/Table/ModalExpandable';
import type { ChuongTrinhDaoTao } from '@/services/DaoTao/ChuongTrinhDaoTao/typing';
import type { DangKyTinChi } from '@/services/DaoTao/DangKyTinChi/typing';
import { Button, Descriptions, Divider } from 'antd';
import { useState } from 'react';
import { useIntl, useModel } from 'umi';

const ThongTinChungPage = (props: { khoiChuongTrinh?: any }) => {
	const intl = useIntl();
	const { record } = useModel('hocphan.decuonghocphan');
	const { record: recLopHocPhan } = useModel('lophocphan.lophocphan');
	const [visibleFormFile, setVisibleFormFile] = useState<boolean>(false);
	const { chiTietHocPhan } = useModel('daotao.dotdangkytinchi');
	const { khoiChuongTrinh } = props;
	const thongTinCtdt = chiTietHocPhan?.thongTinCtdt;
	const hasThongTinCtdt = Array.isArray(thongTinCtdt) && thongTinCtdt.length > 0;
	const thongTinCtdtHienThi: DangKyTinChi.TThongTinCtdtHocPhan = hasThongTinCtdt
		? thongTinCtdt[0]
		: (khoiChuongTrinh ?? {});
	const soTinChi = record?.hocPhan?.soTinChi ?? recLopHocPhan?.hocPhan?.soTinChi ?? chiTietHocPhan?.soTinChi;

	const renderHocPhanCt = (dsHocPhan?: ChuongTrinhDaoTao.THocPhanTuongQuan[] | null, label?: string) => {
		const danhSachHienThi = Array.isArray(dsHocPhan) && dsHocPhan[0]?.ten ? dsHocPhan : [];

		return (
			<Descriptions.Item label={label} span={3}>
				{danhSachHienThi.length ? (
					<ul style={{ marginBottom: 0, paddingLeft: 14 }}>
						{danhSachHienThi.map((item) => (
							<li key={item.ma}>
								{item.ma} - {item.ten}
							</li>
						))}
					</ul>
				) : (
					'--'
				)}
			</Descriptions.Item>
		);
	};

	return (
		<>
			<Divider className='divider-big-title' orientation='left' dashed style={{ marginTop: 0 }}>
				{intl.formatMessage({ id: 'lophocphan.id.decuong.thongtinchung.title' })}
			</Divider>
			<Descriptions
				style={{ marginBottom: '15px', marginTop: '5px' }}
				size='small'
				column={{ xxl: 2, xl: 2, lg: 2, md: 2, sm: 2, xs: 1 }}
			>
				<Descriptions.Item label={intl.formatMessage({ id: 'lophocphan.id.decuong.thongtinchung.tenhp' })}>
					{record?.hocPhan?.ten ?? recLopHocPhan?.hocPhan?.ten ?? chiTietHocPhan?.tenHocPhan ?? <i>--</i>}
				</Descriptions.Item>
				<Descriptions.Item label={intl.formatMessage({ id: 'lophocphan.id.decuong.thongtinchung.tenhpta' })}>
					{record?.hocPhan?.tenTiengAnh ?? recLopHocPhan?.hocPhan?.tenTiengAnh ?? <i>--</i>}
				</Descriptions.Item>
				<Descriptions.Item label={intl.formatMessage({ id: 'lophocphan.id.decuong.thongtinchung.mahp' })}>
					{record?.hocPhan?.ma ?? recLopHocPhan?.hocPhan?.ma ?? chiTietHocPhan?.maHocPhan ?? <i>--</i>}
				</Descriptions.Item>
				<Descriptions.Item label={intl.formatMessage({ id: 'lophocphan.id.decuong.thongtinchung.stc' })}>
					{soTinChi ? soTinChi + ' ' + intl.formatMessage({ id: 'tientrinhhoctap.tientrinhthucte.tc' }) : <i>--</i>}
				</Descriptions.Item>
			</Descriptions>

			<Divider className='divider-big-title' orientation='left'>
				{intl.formatMessage({ id: 'tientrinhhoctap.tientrinhthucte.chuongtrinh' })}
			</Divider>
			<Descriptions style={{ marginTop: 12 }}>
				<Descriptions.Item label={intl.formatMessage({ id: 'tientrinhhoctap.tientrinhthucte.tt' })}>
					<b>{thongTinCtdtHienThi?.soThuTuKy ?? '--'}</b>
				</Descriptions.Item>
				<Descriptions.Item
					label={intl.formatMessage({ id: 'tientrinhhoctap.tientrinhthucte.khoikienthuc' })}
					span={thongTinCtdtHienThi.soThuTuKy ? 2 : 3}
				>
					<span>
						{thongTinCtdtHienThi.khoiKienThuc?.ten ??
							thongTinCtdtHienThi.maKhoiKienThuc ??
							thongTinCtdtHienThi.khoiKienThuc?.ma ??
							'--'}
					</span>
				</Descriptions.Item>
				<Descriptions.Item label={intl.formatMessage({ id: 'tientrinhhoctap.tientrinhthucte.tuchon' })} span={3}>
					{thongTinCtdtHienThi.tenKhoi ?? thongTinCtdtHienThi.ten ?? '--'}
				</Descriptions.Item>
				{renderHocPhanCt(
					thongTinCtdtHienThi.dsHocPhanTienQuyet,
					intl.formatMessage({ id: 'tientrinhhoctap.tientrinhthucte.tienquyet' }),
				)}
				{renderHocPhanCt(
					thongTinCtdtHienThi.dsHocPhanTruoc,
					intl.formatMessage({ id: 'tientrinhhoctap.tientrinhthucte.hptruoc' }),
				)}
				{renderHocPhanCt(
					thongTinCtdtHienThi.dsHocPhanSongHanh,
					intl.formatMessage({ id: 'tientrinhhoctap.tientrinhthucte.hpsongnganh' }),
				)}
				{(!hasThongTinCtdt || thongTinCtdtHienThi.chuyenNganh?.ten) && (
					<Descriptions.Item label={intl.formatMessage({ id: 'tientrinhhoctap.ctdt.chuyennganh' })} span={3}>
						{thongTinCtdtHienThi.chuyenNganh?.ten ?? '--'}
					</Descriptions.Item>
				)}
			</Descriptions>
			{/* <Divider className='divider-big-title' orientation='left'>
				{intl.formatMessage({ id: 'lophocphan.id.decuong.thongtinchung.decuong' })}
			</Divider>
			<Descriptions
				style={{ marginBottom: '15px', marginTop: '5px' }}
				size='small'
				bordered={false}
				column={{ xxl: 2, xl: 2, lg: 2, md: 2, sm: 2, xs: 1 }}
			>
				<Descriptions.Item label={intl.formatMessage({ id: 'lophocphan.id.decuong.thongtinchung.phienban' })}>
					{record?.ma ?? <i>--</i>}
				</Descriptions.Item>
				<Descriptions.Item label={intl.formatMessage({ id: 'lophocphan.id.decuong.thongtinchung.banhanh' })}>
					{record?.thoiDiemApDung ?? <i>--</i>}
				</Descriptions.Item>
				<Descriptions.Item label={intl.formatMessage({ id: 'lophocphan.id.decuong.thongtinchung.quyetdinh' })}>
					{record?.canCu?.ten ?? <i>--</i>}
				</Descriptions.Item>
				<Descriptions.Item label={intl.formatMessage({ id: 'lophocphan.id.decuong.thongtinchung.dinhkem' })}>
					{record?.url ? <a onClick={() => setVisibleFormFile(true)}>{getNameFile(record.url)}</a> : <i>--</i>}
				</Descriptions.Item>
			</Descriptions> */}

			{/* <TrongSoHocPhanPage /> */}

			{/* <Collapse style={{ marginTop: 12 }}>
				<Collapse.Panel header={intl.formatMessage({ id: 'lophocphan.id.decuong.thongtinchung.muctieu' })} key='1'>
					<div dangerouslySetInnerHTML={{ __html: record?.mucTieuHocPhan ?? '--' }} />
				</Collapse.Panel>
				<Collapse.Panel header={intl.formatMessage({ id: 'lophocphan.id.decuong.thongtinchung.cdr' })} key='2'>
					<div dangerouslySetInnerHTML={{ __html: record?.chuanDauRa ?? '--' }} />
				</Collapse.Panel> */}
			{/* <Collapse.Panel header='Nội dung tóm tắt' key='2'>
					<div dangerouslySetInnerHTML={{ __html: record?.noiDungTomTat ?? '--' }} />
				</Collapse.Panel>
				<Collapse.Panel header='Nội dung chi tiết' key='3'>
					<div dangerouslySetInnerHTML={{ __html: record?.noiDungChiTiet ?? '--' }} />
				</Collapse.Panel> */}
			{/* </Collapse> */}

			<ModalExpandable
				title={intl.formatMessage({ id: 'lophocphan.id.decuong.thongtinchung.chitiet' })}
				width={1000}
				open={visibleFormFile}
				footer={null}
				onCancel={() => setVisibleFormFile(false)}
			>
				<PreviewFile file={record?.url ?? ''} />

				<div className='form-footer'>
					<Button onClick={() => setVisibleFormFile(false)}>{intl.formatMessage({ id: 'global.button.dong' })}</Button>
				</div>
			</ModalExpandable>
		</>
	);
};

export default ThongTinChungPage;
