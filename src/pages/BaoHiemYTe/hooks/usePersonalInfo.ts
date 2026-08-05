import { EBhytNationality } from '@/services/BaoHiemYTe/constant';
import { BaoHiemYTe } from '@/services/BaoHiemYTe/typing';
import { Form, type FormInstance } from 'antd';
import { useModel } from 'umi';

export interface IPersonalInfo {
	recordSinhVien: any;
	isVN: boolean;
	hasNationalityData: boolean;
	passportImageFileId?: string;
	visaImageFileId?: string;
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

/** Thông tin cá nhân sinh viên dùng chung cho các form đăng ký/khai báo BHYT */
export const usePersonalInfo = (
	studentRegistration?: BaoHiemYTe.IStudentRegistration,
	isView?: boolean,
	form?: FormInstance<any>,
): IPersonalInfo => {
	const { record: recordSinhVien } = useModel('sinhvien.sinhvien');

	const normalized = (studentRegistration?.nationality ?? recordSinhVien?.quocTich ?? '').toLowerCase().trim();
	const hasNationalityData = !!normalized;
	const isVNFromData = normalized.includes('viet') || normalized.includes('việt');

	// Đã biết quốc tịch thì khóa theo dữ liệu có sẵn; chưa biết thì để sinh viên tự chọn, không tự gán mặc định
	const nationalityWatch = Form.useWatch('nationality', form as FormInstance<any>);
	const isVN = hasNationalityData ? isVNFromData : nationalityWatch === EBhytNationality.VIETNAM;

	// Thông tin đã có sẵn từ hệ thống thì khóa lại, chỉ cho nhập khi còn thiếu
	const isPersonalFieldDisabled = (value?: unknown) => !!isView || !!value;

	return {
		recordSinhVien,
		isVN,
		hasNationalityData,
		passportImageFileId: studentRegistration?.passportImageFileId ?? (recordSinhVien as any)?.passportImageFileId,
		visaImageFileId: studentRegistration?.visaImageFileId ?? (recordSinhVien as any)?.visaImageFileId,
		studentFullName: studentRegistration?.fullName ?? recordSinhVien?.ten,
		studentCode: studentRegistration?.studentCode ?? recordSinhVien?.ma,
		studentNgaySinh: studentRegistration?.ngaySinh ?? recordSinhVien?.ngaySinh,
		studentCccd: studentRegistration?.cccd ?? recordSinhVien?.cccd,
		studentNationality: hasNationalityData ? (isVN ? EBhytNationality.VIETNAM : EBhytNationality.FOREIGN) : undefined,
		studentGioiTinh: studentRegistration?.gioiTinh ?? recordSinhVien?.gioiTinh,
		studentKhoa: recordSinhVien?.khoaSinhVien?.ten ?? studentRegistration?.khoa,
		studentNganh: recordSinhVien?.nganh?.ten ?? studentRegistration?.nganh,
		studentMaKhoa: recordSinhVien?.khoaSinhVien?.ma ?? studentRegistration?.maKhoa,
		studentMaNganh: recordSinhVien?.nganh?.ma ?? studentRegistration?.maNganh,
		studentPhone: studentRegistration?.phone ?? recordSinhVien?.soDienThoai,
		studentEmail: studentRegistration?.email ?? recordSinhVien?.email,
		isPersonalFieldDisabled,
	};
};
