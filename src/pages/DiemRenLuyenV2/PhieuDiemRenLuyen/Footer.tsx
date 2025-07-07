import { ETrangThaiDuyetBienBanHopDiemRenLuyen } from '@/services/DiemRenLuyenV2/BienBanHop/constant';
import type { ENguoiTraLoi, ETrangThaiDanhGia } from '@/services/DiemRenLuyenV2/PhieuDiemRenLuyen/constants';
import { QuestionCircleOutlined, SaveOutlined, SendOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useModel } from 'umi';

interface Props {
	onLuuVaGuiSau?: () => void;
	onGuiNgay?: () => void;
	onKetThuc?: () => void;
	formSubmiting?: boolean;
	nguoiTraLoi?: ENguoiTraLoi;
	trangThaiDanhGia?: ETrangThaiDanhGia;
	isView?: boolean;
	dangGuiNgay?: boolean;
	currentSteps?: number;
	disableKetThuc?: boolean;
	disabled?: boolean;
}

export const Footer = ({ onGuiNgay, onLuuVaGuiSau, formSubmiting, dangGuiNgay, disabled }: Props) => {
	const { record: recBienBanHop } = useModel('diemrenluyenv2.bienbanhop');
	const { setVisibleFormGuiKhieuNai, record: recPhieuDiem } = useModel('diemrenluyenv2.phieudiemrenluyen');

	const renderButtonGuiNgay = () => {
		return (
			<Button
				onClick={onGuiNgay}
				disabled={(formSubmiting && !dangGuiNgay) || disabled}
				loading={formSubmiting && dangGuiNgay}
				type='primary'
			>
				Gửi <SendOutlined style={{ transform: 'translate(1px, -1px) rotate(-45deg)' }} />
			</Button>
		);
	};

	const renderButtonLuuVaGuiSau = () => {
		return (
			<Button
				onClick={onLuuVaGuiSau}
				loading={formSubmiting && !dangGuiNgay}
				disabled={(formSubmiting && dangGuiNgay) || disabled}
			>
				Lưu & Gửi sau <SaveOutlined />
			</Button>
		);
	};

	return (
		<div className='form-footer'>
			{renderButtonGuiNgay()}
			{renderButtonLuuVaGuiSau()}
			{
				// recBienBanHop?._id &&
				// 	recBienBanHop.trangThaiDuyet === ETrangThaiDuyetBienBanHopDiemRenLuyen.DA_DUYET &&
				!recPhieuDiem?.trangThaiXuLyKhieuNai && (
					<Button
						onClick={() => {
							setVisibleFormGuiKhieuNai(true);
						}}
						type='primary'
					>
						Gửi khiếu nại
						<QuestionCircleOutlined />
					</Button>
				)
			}
		</div>
	);
};
