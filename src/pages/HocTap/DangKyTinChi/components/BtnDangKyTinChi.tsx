import ButtonExtend from '@/components/Table/ButtonExtend';
import { ETrangThaiDangKyTinChi } from '@/services/DaoTao/DangKyTinChi/constant';
import { type DangKyTinChi } from '@/services/DaoTao/DangKyTinChi/typing';
import dayjs from '@/utils/dayjs';
import { SendOutlined } from '@ant-design/icons';
import { useIntl, useModel } from 'umi';

type BtnDangKyTinChiProps = {
	danhSachLopHienThi: DangKyTinChi.ILopDangKy[];
	tongTinChi: number;
	soTinChiToiDa: number;
	soTinChiToiThieu: number;
};

const BtnDangKyTinChi = ({ danhSachLopHienThi, tongTinChi, soTinChiToiDa, soTinChiToiThieu }: BtnDangKyTinChiProps) => {
	const intl = useIntl();
	const { dotDangKyHienTai, setVisibleRegister } = useModel('daotao.dotdangkytinchi');
	const { settings } = useModel('tienich.caidat');
	const dangKyNgay = !!settings?.SINH_VIEN?.dktcMultiple;
	const dangTrongThoiGian =
		dotDangKyHienTai?.thoiGianBatDau &&
		dotDangKyHienTai?.thoiGianKetThuc &&
		dayjs().isAfter(dayjs(dotDangKyHienTai?.thoiGianBatDau).subtract(1, 'second')) &&
		dayjs().isBefore(dayjs(dotDangKyHienTai?.thoiGianKetThuc).add(1, 'second'));
	const coLopChuaDangKy = danhSachLopHienThi.some((item) => item.trangThai === ETrangThaiDangKyTinChi.CHUA_DANG_KY);

	return (
		<ButtonExtend
			hidden={dangKyNgay}
			tooltip={
				!coLopChuaDangKy
					? intl.formatMessage({ id: 'dangkytinchi.phieudangky.table.tooltip.alert.khongcolopchuadangky' })
					: tongTinChi > soTinChiToiDa
						? intl.formatMessage({ id: 'dangkytinchi.phieudangky.table.tooltip.alert.dangkyquasotin' })
						: tongTinChi < soTinChiToiThieu
							? intl.formatMessage({ id: 'dangkytinchi.phieudangky.table.tooltip.alert.chuadangkydusotin' })
							: !dangTrongThoiGian
								? intl.formatMessage({
										id: 'dangkytinchi.phieudangky.table.tooltip.alert.ngoaithoigiandangkytinchi',
									})
								: intl.formatMessage({
										id: 'dangkytinchi.phieudangky.table.tooltip.alert.dangkytc',
									})
			}
			type='primary'
			icon={<SendOutlined />}
			onClick={() => setVisibleRegister(true)}
			disabled={
				!coLopChuaDangKy || tongTinChi > soTinChiToiDa || tongTinChi < soTinChiToiThieu || !dangTrongThoiGian
			}
		>
			{intl.formatMessage({ id: 'dangkytinchi.phieudangky.table.btn.dangky' })}
		</ButtonExtend>
	);
};

export default BtnDangKyTinChi;
