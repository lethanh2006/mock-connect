import ButtonExtend from '@/components/Table/ButtonExtend';
import { type DangKyTinChi } from '@/services/DaoTao/DangKyTinChi/typing';
import { IconCalendar } from '@/components/Icons';
import { Flex, Space } from 'antd';
import { useIntl } from 'umi';
import BtnDangKyTinChi from './BtnDangKyTinChi';

type CreditRegistrationBarProps = {
	showFixedBar: boolean;
	fixedBarRect?: { left: number; width: number };
	danhSachLopHienThi: DangKyTinChi.ILopDangKy[];
	soTinChiToiThieu: number;
	soTinChiToiDa: number;
	tongHocPhanDangKy: number;
	tongTinChi: number;
	onViewSchedule: () => void;
	disabledViewSchedule: boolean;
};

const CreditRegistrationBar = ({
	showFixedBar,
	fixedBarRect,
	danhSachLopHienThi,
	soTinChiToiThieu,
	soTinChiToiDa,
	tongHocPhanDangKy,
	tongTinChi,
	onViewSchedule,
	disabledViewSchedule,
}: CreditRegistrationBarProps) => {
	const intl = useIntl();
	const trangThaiTinChi =
		tongTinChi < soTinChiToiThieu
			? intl.formatMessage({ id: 'dangkytinchi.fixedbar.chuadusotinchi' })
			: intl.formatMessage({ id: 'dangkytinchi.fixedbar.dusotinchi' });
	const xemTruocLichHocTooltip = disabledViewSchedule
		? intl.formatMessage({ id: 'dangkytinchi.phieudangky.table.tooltip.alert.khongcolopchuadangky' })
		: intl.formatMessage({ id: 'dangkytinchi.phieudangky.table.btn.xemtruoclichhoc' });

	return (
		<div
			className={`credit-registration-bar ${showFixedBar ? 'is-visible' : ''}`}
			style={fixedBarRect ? { left: fixedBarRect.left, width: fixedBarRect.width } : undefined}
		>
			<Flex align='center' justify='space-between' gap={16} wrap='wrap'>
				<Space size={28} wrap>
					<div className='credit-registration-bar__item'>
						<span>{intl.formatMessage({ id: 'dangkytinchi.fixedbar.duocphepdangky' })}</span>
						<b>
							{soTinChiToiThieu} - {soTinChiToiDa} {intl.formatMessage({ id: 'dangkytinchi.phieudangky.tinchi.title' })}
						</b>
					</div>
					<div className='credit-registration-bar__item'>
						<span>{intl.formatMessage({ id: 'dangkytinchi.trangthaidangky.dadangky' })}</span>
						<b>
							{tongHocPhanDangKy} {intl.formatMessage({ id: 'dangkytinchi.fixedbar.courses' })} ({tongTinChi}{' '}
							{intl.formatMessage({ id: 'dangkytinchi.phieudangky.tinchi.title' })})
						</b>
					</div>
					<span
						className={
							tongTinChi < soTinChiToiThieu
								? 'credit-registration-bar__status credit-registration-bar__status--warning'
								: 'credit-registration-bar__status'
						}
					>
						{trangThaiTinChi}
					</span>
				</Space>

				<Space wrap>
					<ButtonExtend
						aria-label={intl.formatMessage({ id: 'dangkytinchi.phieudangky.table.btn.xemtruoclichhoc' })}
						icon={<IconCalendar />}
						onClick={onViewSchedule}
						disabled={disabledViewSchedule}
						tooltip={xemTruocLichHocTooltip}
					>
						{intl.formatMessage({ id: 'dangkytinchi.phieudangky.table.btn.xemtruoclichhoc' })}
					</ButtonExtend>
					<BtnDangKyTinChi
						danhSachLopHienThi={danhSachLopHienThi}
						tongTinChi={tongTinChi}
						soTinChiToiDa={soTinChiToiDa}
						soTinChiToiThieu={soTinChiToiThieu}
					/>
				</Space>
			</Flex>
		</div>
	);
};

export default CreditRegistrationBar;
