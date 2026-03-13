import { ESettingKey, unitName } from '@/services/base/constant';
import { ELoaiHinhThucThanhToan } from '@/services/TaiChinh/HinhThucThanhToan/constant';
import dayjs from '@/utils/dayjs';
import { ipTaiChinh } from '@/utils/ip';
import { removeVietnameseTones } from '@/utils/utils';
import { Col, Empty, Modal, Row, Space } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const ModalThanhToanNganHang = (props: { visible: boolean; onOk: () => void }) => {
	const intl = useIntl();
	const { visible, onOk } = props;
	const { record } = useModel('taichinh.giaodich');
	const { record: recDotThu } = useModel('taichinh.dotthu');
	const { getByKeyModel, settings } = useModel('tienich.caidat');
	const { getAllModel: getHinhThuc, defaultHinhThuc } = useModel('taichinh.hinhthucthanhtoan');
	const { initialState } = useModel('@@initialState');
	// thông tin người nộp tiền
	const userFullname =
		record?.userFullname ??
		(initialState?.currentUser?.family_name
			? `${initialState.currentUser.family_name} ${initialState.currentUser?.given_name ?? ''}`
			: initialState?.currentUser?.name);
	const userCode = record?.userCode ?? initialState?.currentUser?.preferred_username ?? '';
	/** Nội dung chuyển khoản */
	const addInfo = removeVietnameseTones(
		`${userCode ?? ''} ${userFullname ?? ''} ${record?.name ?? 'Nộp tiền'}`,
	).toUpperCase();

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
		getByKeyModel(ESettingKey.THONG_TIN_THANH_TOAN, ipTaiChinh)
			.then()
			.catch((er) => console.log(er));

		// Chỉ get 1 lần
		if (!defaultHinhThuc) getHinhThuc();
	}, []);

	const renderLopThuong = () => (
		<Row gutter={[12, 12]}>
			<Col span={24}>{intl.formatMessage({ id: 'taichinh.thanhtoan.nganhang.moTaChung' })}</Col>

			<Col span={24} md={{ span: 10, push: 14 }}>
				<Space direction='vertical' style={{ alignItems: 'center' }}>
					<b>
						<u>{intl.formatMessage({ id: 'taichinh.thanhtoan.nganhang.qrTitle' })}:</u>
					</b>
					{hinhThucFinal.loaiKenhThanhToan === ELoaiHinhThucThanhToan.CO_DINH &&
					hinhThucFinal.maNganHangVNPay &&
					hinhThucFinal.soTaiKhoanThanhToanCoDinh ? (
						<img
							style={{ maxWidth: '100%' }}
							src={`https://img.vietqr.io/image/${hinhThucFinal.maNganHangVNPay}-${hinhThucFinal.soTaiKhoanThanhToanCoDinh}-compact2.png?amount=${record?.amount}&addInfo=${addInfo}&accountName=${unitInfo}`}
						/>
					) : hinhThucFinal.maNganHangVNPay && hinhThucFinal.tienToSTK ? (
						<img
							style={{ maxWidth: '100%' }}
							src={`https://img.vietqr.io/image/${hinhThucFinal.maNganHangVNPay}-${hinhThucFinal.tienToSTK}${record?.identityCode}-compact2.png?amount=${record?.amount}&addInfo=${addInfo}&accountName=${unitInfo}`}
						/>
					) : null}
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
							<b>
								{hinhThucFinal.tienToSTK}
								{record?.identityCode}
							</b>
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
		<Modal
			open={visible}
			onCancel={() => onOk()}
			title={intl.formatMessage({ id: 'taichinh.thanhtoan.nganhang.title' })}
			okButtonProps={{ hidden: true }}
			width={1000}
		>
			{nganHangBaoTri ? (
				<Empty description={intl.formatMessage({ id: 'taichinh.thanhtoan.nganhang.baotri' })} />
			) : (
				renderLopThuong()
			)}
		</Modal>
	);
};

export default ModalThanhToanNganHang;
