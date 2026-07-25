import type { SinhVien } from '@/services/DaoTao/SinhVien/typings';
import type { TFamilyMember } from './typing';

/**
 * Inverse of `buildStep3Payload` — maps saved family & consent info back into step 3 form field names.
 */
export const buildStep3InitialValues = (sinhVien?: SinhVien.IRecord): Record<string, any> => {
	if (!sinhVien) return {};

	const hoSo = sinhVien.hoSoNhapHoc;
	const svAny = sinhVien as any;

	const rawFamily = sinhVien.thanhVienGiaDinh ?? svAny.thanhVienGiaDinh ?? hoSo?.thanhVienGiaDinh ?? [];

	const thanhVienGiaDinh: TFamilyMember[] = (rawFamily as any[]).map((item, index) => {
		const fullName = item.fullName || [item.hoDem, item.ten].filter(Boolean).join(' ');
		return {
			key: index,
			...item,
			fullName,
		};
	});

	const consentShareWithGuardian =
		svAny.dongYNhanThongBao ?? hoSo?.dongYNhanThongBao ?? (rawFamily.length > 0 ? true : undefined);
	const agreeDeclaration = svAny.dongYDieuKhoan ?? hoSo?.dongYDieuKhoan;

	return {
		thanhVienGiaDinh,
		consentShareWithGuardian,
		agreeDeclaration,
	};
};
