import type { TFamilyMember, TStep3Payload } from './typing';

const splitFullName = (fullName?: string) => {
	const parts = (fullName ?? '').trim().split(/\s+/).filter(Boolean);
	if (parts.length === 0) return { hoDem: undefined, ten: undefined };
	if (parts.length === 1) return { hoDem: undefined, ten: parts[0] };
	return { hoDem: parts.slice(0, -1).join(' '), ten: parts[parts.length - 1] };
};

export const buildStep3Payload = (values: Record<string, any>): TStep3Payload => {
	const thanhVienGiaDinh = ((values.thanhVienGiaDinh ?? []) as TFamilyMember[]).map((member) => {
		const { key: _key, fullName, ...rest } = member;
		return { ...rest, ...splitFullName(fullName) };
	});

	return {
		thanhVienGiaDinh,
		dongYNhanThongBao: Boolean(values.consentShareWithGuardian),
		dongYDieuKhoan: Boolean(values.agreeDeclaration),
	};
};
