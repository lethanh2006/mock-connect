import { KiemTraSucKhoe } from '@/services/KiemTraSucKhoe/typing';
import { useModel } from 'umi';

export interface IPersonalInfo {
	recordSinhVien: any;
	isVN: boolean;
	studentFullName?: string;
	studentCode?: string;
	studentNgaySinh?: string;
	studentCccd?: string;
	studentNationality?: string;
	studentGioiTinh?: string;
	studentKhoa?: string;
	studentNganh?: string;
	studentMaKhoa?: string;
	studentMaNganh?: string;
	studentPhone?: string;
	studentEmail?: string;
	isPersonalFieldDisabled: (value?: unknown) => boolean;
}

/** Thông tin cá nhân sinh viên dùng chung cho các form đăng ký/khai báo kiểm tra sức khỏe */
export const usePersonalInfo = (
	studentRegistration?: KiemTraSucKhoe.IStudentRegistration,
	isView?: boolean,
): IPersonalInfo => {
	const { record: recordSinhVien } = useModel('sinhvien.sinhvien');

	const normalized = (studentRegistration?.nationality ?? recordSinhVien?.quocTich ?? '').toLowerCase().trim();
	const isVN = !normalized || normalized.includes('viet') || normalized.includes('việt');

	// Thông tin đã có sẵn từ hệ thống thì khóa lại, chỉ cho nhập khi còn thiếu
	const isPersonalFieldDisabled = (value?: unknown) => !!isView || !!value;

	return {
		recordSinhVien,
		isVN,
		studentFullName: studentRegistration?.fullName ?? recordSinhVien?.ten,
		studentCode: studentRegistration?.studentCode ?? recordSinhVien?.ma,
		studentNgaySinh: studentRegistration?.ngaySinh ?? recordSinhVien?.ngaySinh,
		studentCccd: studentRegistration?.cccd ?? recordSinhVien?.cccd,
		studentNationality: studentRegistration?.nationality ?? recordSinhVien?.quocTich,
		studentGioiTinh: studentRegistration?.gioiTinh ?? recordSinhVien?.gioiTinh,
		studentKhoa: recordSinhVien?.khoaSinhVien?.ten ?? studentRegistration?.khoa,
		studentNganh: recordSinhVien?.nganh?.ten ?? studentRegistration?.nganh,
		studentMaKhoa: recordSinhVien?.maKhoaSinhVien ?? studentRegistration?.maKhoa,
		studentMaNganh: recordSinhVien?.maNganh ?? studentRegistration?.maNganh,
		studentPhone: studentRegistration?.phone ?? recordSinhVien?.soDienThoai,
		studentEmail: studentRegistration?.email ?? recordSinhVien?.email,
		isPersonalFieldDisabled,
	};
};
