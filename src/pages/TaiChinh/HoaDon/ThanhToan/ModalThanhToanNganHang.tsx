import { ESettingKey, unitName } from '@/services/base/constant';
import { getBankQr } from '@/services/TaiChinh/GiaoDich';
import { ELoaiHinhThucThanhToan } from '@/services/TaiChinh/HinhThucThanhToan/constant';
import dayjs from '@/utils/dayjs';
import { removeVietnameseTones } from '@/utils/utils';
import EmptyState from '@/components/EmptyState';
import ModalExpandable from '@/components/Table/ModalExpandable';
import { Space, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { Col, Row } from '@/components/MyGrid';
import { useIntl, useModel } from 'umi';

const ModalThanhToanNganHang = (props: { visible: boolean; onOk: () => void }) => {
	const intl = useIntl();
	const { visible, onOk } = props;
	const { record } = useModel('taichinh.giaodich');
	const { record: recDotThu } = useModel('taichinh.dotthu');
	const { settings } = useModel('tienich.caidat');
	const { getAllModel: getHinhThuc, defaultHinhThuc } = useModel('taichinh.hinhthucthanhtoan');
	const [qrImageUrl, setQrImageUrl] = useState<string>();
	const [qrLoading, setQrLoading] = useState(false);

	// Thông tin thanh toán từ cài đặt
	const { tienToTaiKhoan, maNganHang, urlHuongDanThanhToan } = settings[ESettingKey.THONG_TIN_THANH_TOAN] ?? {};
	/** Hình thức thanh toán cuối cùng, theo thứ tự ưu tiên: Kênh từ Đợt thu => Kênh mặc định => Thông tin ở Setting */
	const hinhThucFinal = recDotThu?.kenhThanhToan ??
		defaultHinhThuc ?? {
			loaiKenhThanhToan: ELoaiHinhThucThanhToan.DONG,
			maNganHangVNPay: maNganHang,
			tienToSTK: tienToTaiKhoan,
			huongDanThanhToan: urlHuongDanThanhToan,
		};
	/** Tên ngân hàng: Lấy từ Hình thức hoặc Tên trường */
	const unitInfo = removeVietnameseTones(hinhThucFinal.tenNganHang ?? unitName).toUpperCase();

	// Define the start and end times
	const start = dayjs('23:00', 'HH:mm'); // Từ 23h đến
	const end = dayjs('00:00', 'HH:mm').add(1, 'day'); // 0h ngày hôm sau
	const start1 = dayjs('00:00', 'HH:mm'); // Hoặc từ 0h đến
	const end1 = dayjs('01:00', 'HH:mm'); // 1h hôm nay
	const nganHangBaoTri = dayjs().isBetween(start, end) || dayjs().isBetween(start1, end1);

	useEffect(() => {
		// getByKeyModel(ESettingKey.THONG_TIN_THANH_TOAN, ipTaiChinh)
		// 	.then()
		// 	.catch((er) => console.log(er));

		// Chỉ get 1 lần
		if (!defaultHinhThuc) getHinhThuc();
	}, []);

	useEffect(() => {
		let cancelled = false;
		let objectUrl: string | undefined;
		setQrImageUrl(undefined);

		if (!visible || !record?.identityCode || nganHangBaoTri) {
			setQrLoading(false);
			return () => undefined;
		}

		setQrLoading(true);
		getBankQr(record.identityCode)
			.then(({ data }) => {
				if (cancelled) return;
				const blob = data instanceof Blob ? data : new Blob([data], { type: 'image/png' });
				objectUrl = URL.createObjectURL(blob);
				setQrImageUrl(objectUrl);
			})
			.catch(() => {
				if (!cancelled) setQrImageUrl(undefined);
			})
			.finally(() => {
				if (!cancelled) setQrLoading(false);
			});

		return () => {
			cancelled = true;
			if (objectUrl) URL.revokeObjectURL(objectUrl);
		};
	}, [visible, record?.identityCode, nganHangBaoTri]);

	const renderQr = () => {
		if (qrLoading) return <Spin />;
		if (!qrImageUrl) return <EmptyState description='Chưa thể tạo mã QR' compact />;
		return <img style={{ maxWidth: '100%' }} src={qrImageUrl} alt='QR thanh toán' />;
	};

	const renderLopThuong = () => (
		<Row gutter={[12, 12]}>
			<Col span={24}>{intl.formatMessage({ id: 'taichinh.thanhtoan.nganhang.moTaChung' })}</Col>

			<Col span={24} md={{ span: 10, push: 14 }}>
				<Space direction='vertical' style={{ alignItems: 'center' }}>
					<b>
						<u>{intl.formatMessage({ id: 'taichinh.thanhtoan.nganhang.qrTitle' })}:</u>
					</b>
					{renderQr()}
					<i>{intl.formatMessage({ id: 'taichinh.thanhtoan.nganhang.qrNote' })}</i>
				</Space>
			</Col>

			<Col span={24} md={{ span: 14, pull: 10 }}>
				<b>
					<u>{intl.formatMessage({ id: 'taichinh.thanhtoan.nganhang.huongDanTitle' })}:</u>
				</b>
				<p>
					{intl.formatMessage({ id: 'taichinh.thanhtoan.nganhang.buoc1Title' })}:
					<br />
					{intl.formatMessage({ id: 'taichinh.thanhtoan.nganhang.buoc1Desc' })}
				</p>
				<p>
					{intl.formatMessage({ id: 'taichinh.thanhtoan.nganhang.buoc2Title' })}:
					<br />
					{urlHuongDanThanhToan ? (
						<>
							{intl.formatMessage({ id: 'taichinh.thanhtoan.nganhang.huongDanChiTiet' })}{' '}
							<a target='_blank' href={urlHuongDanThanhToan} rel='noreferrer'>
								{intl.formatMessage({ id: 'taichinh.thanhtoan.nganhang.here' })}
							</a>
							<br />
						</>
					) : null}
					{hinhThucFinal.loaiKenhThanhToan === ELoaiHinhThucThanhToan.CO_DINH ? (
						<>
							- {intl.formatMessage({ id: 'taichinh.thanhtoan.nganhang.nganHang' })}: {hinhThucFinal.maNganHang}
							<br />- {intl.formatMessage({ id: 'taichinh.thanhtoan.nganhang.tenTaiKhoan' })}: {unitInfo}
							<br />- {intl.formatMessage({ id: 'taichinh.thanhtoan.nganhang.soTaiKhoan' })}:{' '}
							<b>{hinhThucFinal.soTaiKhoanThanhToanCoDinh}</b>
							<br />- {intl.formatMessage({ id: 'taichinh.thanhtoan.nganhang.noiDungCK' })}: [Mã sinh viên] [Họ tên]
							[Nội dung]
							<br />- {intl.formatMessage({ id: 'taichinh.thanhtoan.nganhang.viDu' })}:{' '}
							<i>23123456P NGUYEN VAN A HocphiHK2NH20232024</i>
						</>
					) : (
						<>
							{intl.formatMessage({ id: 'taichinh.thanhtoan.nganhang.maThanhToanSV' })}: <b>{record?.identityCode}</b>
							<br />
							{intl.formatMessage({ id: 'taichinh.thanhtoan.nganhang.soTK24_7' })}:{' '}
							<b>{record?.externalIdentityCode ?? `${hinhThucFinal.tienToSTK}${record?.identityCode}`}</b>
						</>
					)}
				</p>

				<p>
					<b>
						{intl.formatMessage({ id: 'taichinh.thanhtoan.nganhang.luuY' })}:<br />
						1. {intl.formatMessage({ id: 'taichinh.thanhtoan.nganhang.luuY1' })}
						<br />
						2. {intl.formatMessage({ id: 'taichinh.thanhtoan.nganhang.luuY2' })}
						{hinhThucFinal.loaiKenhThanhToan === ELoaiHinhThucThanhToan.DONG && (
							<>
								<br />
								3. {intl.formatMessage({ id: 'taichinh.thanhtoan.nganhang.luuY3' })}
							</>
						)}
					</b>
				</p>
			</Col>
		</Row>
	);

	if (!record?._id) return <></>;
	return (
		<ModalExpandable
			open={visible}
			onCancel={() => onOk()}
			title={intl.formatMessage({ id: 'taichinh.thanhtoan.nganhang.title' })}
			footer={null}
			width={1000}
		>
			{nganHangBaoTri ? (
				<EmptyState description={intl.formatMessage({ id: 'taichinh.thanhtoan.nganhang.baotri' })} compact />
			) : (
				renderLopThuong()
			)}
		</ModalExpandable>
	);
};

export default ModalThanhToanNganHang;
