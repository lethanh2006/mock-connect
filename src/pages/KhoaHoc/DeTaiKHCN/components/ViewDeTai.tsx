import { EPhaseDeTaiKHCN, MapKeyNamePhaseDeTaiKHCN } from '@/services/KhoaHoc/DeTaiKHCN/constants';
import { Modal, Tabs, Button } from 'antd';
import ViewDangKyDeXuat from './ViewDangKyDeXuat';
import { useModel } from 'umi';
import ViewThuyetMinh from './ViewThuyetMinh';
import ViewThucHienDeTai from './ViewThucHienDeTai';
import ViewHoSoNghiemThu from './ViewHoSoNghiemThu';
import ViewHoSoSauNghiemThu from './ViewHoSoSauNghiemThu';

const ViewDeTai = (props: { phaseDeTai: EPhaseDeTaiKHCN }) => {
	const { record, visibleViewDetail, setVisibleViewDetail } = useModel('khoahoc.detaikhcn');
	const handleCancel = () => {
		setVisibleViewDetail(false);
	};
	const ViewPhase = (phase: EPhaseDeTaiKHCN) => {
		if (!record) return null;
		if (phase === EPhaseDeTaiKHCN.DANG_KY)
			return (
				<ViewDangKyDeXuat fieldNameTrangThai='trangThaiDangKy' fieldNameLock='lock' mode='DangKyDeXuat' rec={record} />
			);
		if (phase === EPhaseDeTaiKHCN.XET_DUYET_DANG_KY)
			return (
				<ViewDangKyDeXuat
					fieldNameLock='lockXetDuyet'
					fieldNameTrangThai='trangThaiXetDuyetDangKy'
					mode='HoiDongXetChonDeXuat'
					rec={record}
				/>
			);
		if (phase === EPhaseDeTaiKHCN.NOP_DE_CUONG)
			return (
				<ViewThuyetMinh
					mode='NopThuyetMinh'
					fieldNameLock='lockNopDeCuong'
					fieldNameTrangThai='trangThaiNopDeCuong'
					rec={record}
				/>
			);
		if (phase === EPhaseDeTaiKHCN.XET_DUYET_DE_CUONG)
			return (
				<ViewThuyetMinh
					mode='HoiDongXetDuyetThuyetMinh'
					fieldNameLock='lockDeCuong'
					fieldNameTrangThai='trangThaiXetDuyetDeCuong'
					rec={record}
				/>
			);
		if (phase === EPhaseDeTaiKHCN.THUC_HIEN) return <ViewThucHienDeTai rec={record} />;
		if (phase === EPhaseDeTaiKHCN.NOP_NGHIEM_THU)
			return (
				<ViewHoSoNghiemThu
					mode='NopHoSoNghiemThu'
					rec={record}
					fieldNameLock='lockNopNghiemThu'
					fieldNameTrangThai='trangThaiNopNghiemThu'
				/>
			);
		if (phase === EPhaseDeTaiKHCN.NGHIEM_THU)
			return (
				<ViewHoSoNghiemThu
					mode='HoiDongXetDuyetHoSoNghiemThu'
					rec={record}
					fieldNameLock='lockNghiemThu'
					fieldNameTrangThai='trangThaiNghiemThu'
				/>
			);
		if (phase === EPhaseDeTaiKHCN.SAU_NGHIEM_THU) return <ViewHoSoSauNghiemThu rec={record} />;
		return null;
	};
	return (
		<Modal
			bodyStyle={{ paddingTop: 4 }}
			width={1000}
			footer={
				<Button type='primary' onClick={handleCancel}>
					OK
				</Button>
			}
			title='Thông tin chi tiết đề tài KHCN'
			visible={visibleViewDetail}
			onCancel={handleCancel}
		>
			<Tabs defaultActiveKey={props.phaseDeTai}>
				{Object.values(EPhaseDeTaiKHCN).map((item) => (
					<Tabs.TabPane tab={MapKeyNamePhaseDeTaiKHCN[item]} key={item} tabKey={item}>
						{ViewPhase(item)}
					</Tabs.TabPane>
				))}
			</Tabs>
		</Modal>
	);
};

export default ViewDeTai;
