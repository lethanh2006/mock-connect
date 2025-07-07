import { SaveOutlined, SendOutlined } from '@ant-design/icons';
import { Button, Col, Row, Space } from 'antd';
import { ENguoiTraLoiDrl, ETrangThaiDanhGia } from '@/services/DiemRenLuyenV2/PhieuDiemRenLuyen/constants';

interface Props {
	onLuuVaGuiSau?: () => void;
	onGuiNgay?: () => void;
	linkTaiPhieu?: string;
	formSubmiting?: boolean;
	nguoiTraLoi?: ENguoiTraLoiDrl;
	trangThaiDanhGia?: ETrangThaiDanhGia;
	isView?: boolean;
	variant: 'DanhGiaCanBo' | 'DanhGiaTongHop';
	dangGuiNgay?: boolean;
	disabled?: boolean;
}

export const Header = ({
	formSubmiting,
	linkTaiPhieu,
	nguoiTraLoi,
	trangThaiDanhGia,
	isView,
	onGuiNgay,
	onLuuVaGuiSau,
	variant,
	dangGuiNgay,
	disabled,
}: Props) => {
	const canBoKhongTheSuaDanhGia =
		nguoiTraLoi === ENguoiTraLoiDrl.SINH_VIEN &&
		trangThaiDanhGia !== ETrangThaiDanhGia.CHUA_DANH_GIA &&
		trangThaiDanhGia !== ETrangThaiDanhGia.DA_DANH_GIA_CHUA_GUI;
	const lanhDaoKhongTheSuaDanhGia =
		trangThaiDanhGia === ETrangThaiDanhGia.DON_VI_DANH_GIA_DA_GUI && nguoiTraLoi === ENguoiTraLoiDrl.CO_VAN_HOC_TAP;

	const renderButtonGuiNgay = () => {
		if (
			(nguoiTraLoi === ENguoiTraLoiDrl.SINH_VIEN && canBoKhongTheSuaDanhGia) ||
			(nguoiTraLoi === ENguoiTraLoiDrl.CO_VAN_HOC_TAP && lanhDaoKhongTheSuaDanhGia) ||
			isView
		) {
			return null;
		}
		return (
			<Button
				onClick={onGuiNgay}
				loading={formSubmiting && dangGuiNgay}
				disabled={(formSubmiting && !dangGuiNgay) || disabled}
				type='primary'
			>
				Gửi phòng TCHC <SendOutlined style={{ transform: 'translate(1px, -1px) rotate(-45deg)' }} />
			</Button>
		);
	};

	const renderButtonLuuVaGuiSau = () => {
		if (
			(nguoiTraLoi === ENguoiTraLoiDrl.SINH_VIEN && canBoKhongTheSuaDanhGia) ||
			(nguoiTraLoi === ENguoiTraLoiDrl.CO_VAN_HOC_TAP && lanhDaoKhongTheSuaDanhGia) ||
			isView
		) {
			return null;
		}
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

	const renderRight = () => {
		if (variant === 'DanhGiaCanBo') {
			return null;
			// return (
			// 	<Typography.Text type='secondary' italic>
			// 		{moment().format('[Cập nhật ngày] DD [tháng] MM [năm] YYYY')}
			// 	</Typography.Text>
			// );
		}
		// return <SelectDonVi disabled placeholder='Chọn đơn vị' value={recordThongTinNhanSu?.donViChinhId ?? undefined} />;
		return;
	};

	const ButtonGuiNgay = renderButtonGuiNgay();
	const ButtonLuuVaGuiSau = renderButtonLuuVaGuiSau();
	const Right = renderRight();

	if (ButtonGuiNgay || ButtonLuuVaGuiSau || Right) {
		return (
			<Row gutter={[12, 12]} align='middle'>
				<Col span={24} md={14}>
					<Space style={{ width: '100%' }}>
						{renderButtonGuiNgay()}
						{renderButtonLuuVaGuiSau()}
						{/* <Button download target='_blank' href={linkTaiPhieu} htmlType='button'>
              Tải phiếu <DownloadOutlined />
            </Button> */}
					</Space>
				</Col>
				<Col span={24} md={10} style={{ display: 'flex', justifyContent: 'flex-end' }}>
					{Right}
				</Col>
			</Row>
		);
	}

	return null;
};
