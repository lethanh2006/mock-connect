import {
	ETrangThaiChamDiem,
	colorTagTrangThaiPhieuDiem,
	trangThaiPhieuDiem,
} from '@/services/DiemRenLuyen/DotChamDiem/constants';
import { type PhieuDiemRenLuyen } from '@/services/DiemRenLuyen/PhieuDiemRenLuyen/typing';
import { Tag } from 'antd';

const TrangThaiPhieuDiem = (props: { ketQua?: PhieuDiemRenLuyen.IKetQua }) => {
	const { ketQua } = props;

	const status = [
		ketQua?.trangThaiChamCoVan === ETrangThaiChamDiem.DA_NOP,
		ketQua?.trangThaiChamCoVan === ETrangThaiChamDiem.LUU,
		ketQua?.trangThaiChamCanSu === ETrangThaiChamDiem.DA_NOP,
		ketQua?.trangThaiChamCanSu === ETrangThaiChamDiem.LUU,
		ketQua?.trangThaiChamSinhVien === ETrangThaiChamDiem.DA_NOP,
		ketQua?.trangThaiChamSinhVien === ETrangThaiChamDiem.LUU,
		ketQua?.trangThaiChamSinhVien === ETrangThaiChamDiem.CHUA_CHAM,
	];
	const index = status.indexOf(true); // -1, 0, ....

	// at index or last item of values
	return <Tag color={colorTagTrangThaiPhieuDiem.at(index)}>{trangThaiPhieuDiem.at(index)}</Tag>;
};

export default TrangThaiPhieuDiem;
