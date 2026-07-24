import type { SinhVien } from '@/services/DaoTao/SinhVien/typings';
import { buildUpLoadFile } from '@/services/uploadFile';
import type { TStep1Payload } from './typing';
import type { DotNhapHoc } from '@/services/DaoTao/DotNhapHoc/typings';

const buildDiaChi = (values: Record<string, any>, suffix: string): SinhVien.TDiaChi => ({
	maTP: values[`maTinhTp${suffix}`],
	tenTP: values[`tinhTp${suffix}`],
	maQH: '',
	tenQH: '',
	maXaPhuong: values[`maXaPhuong${suffix}`],
	tenXaPhuong: values[`xaPhuong${suffix}`],
	diaChi: values[`soNhaTenDuong${suffix}`] ?? '',
});

export const buildStep1Payload = async (
	values: Record<string, any>,
	documentRows: DotNhapHoc.IGiayToCanNopNhapHoc[] = [],
): Promise<TStep1Payload> => {
	const [urlMatTruocCccd, urlMatSauCccd, urlDinhKemVanDeSucKhoe, urlPassportAttachment] = await Promise.all([
		buildUpLoadFile(values, 'frontIdCard'),
		buildUpLoadFile(values, 'backIdCard'),
		values.hasHealthProblem === true ? buildUpLoadFile(values, 'healthProblemAttachment') : Promise.resolve(undefined),
		buildUpLoadFile(values, 'passportAttachment'),
	]);
	// The mockup has a single "Passport Attachment" upload covering both the passport page and the visa stamp,
	// so the same file URL is sent for both urlDinhKemHoChieu and visa.urlDinhKemVisa.
	const urlDinhKemHoChieu = urlPassportAttachment;
	const urlDinhKemVisa = urlPassportAttachment;

	const danhSachGiayToNhapHoc = (
		await Promise.all(
			documentRows
				.filter((row) => row.id)
				.map(async (row) => ({
					id: row.id as string,
					urlFile: (await buildUpLoadFile(values, `document_${row.id}`)) ?? undefined,
				})),
		)
	).filter((item) => item.urlFile);

	const hasVisa = Boolean(values.passportNumber || values.visaType);

	return {
		firstName: values.firstName,
		middleName: values.middleName,
		lastName: values.lastName,
		ngaySinh: values.dob,
		gioiTinh: values.gender,
		soDienThoai: values.phoneNumber,
		maVungDienThoai: values.phoneCountryCode,
		cccd: values.nationalIdNumber,
		ngayCapCccd: values.issueDate,
		noiCapCccd: values.placeOfIssue,
		email: values.vinuniAccount,
		quocTich: values.nationality,
		maQuocTich: values.maQuocTich,
		danToc: values.ethnicity,
		tonGiao: values.religion,
		tinhTpNoiSinh: values.tinhTpNoiSinh,
		maTinhTpNoiSinh: values.maTinhTpNoiSinh,
		noiOHienTai: buildDiaChi(values, 'KhaiBao'),
		hoKhauThuongTru: buildDiaChi(values, 'ThuongTru'),
		tenNganHang: values.bank,
		soTaiKhoanNganHang: values.bankAccountNumber,
		chiNhanhNganHang: values.bankBranch,
		chieuCao: values.height,
		canNang: values.weight,
		maLoaiKhuyetTat: values.disabilityType,
		ghiChuYTe: values.medicalNotes,
		maBuuChinh: values.postalCode,
		urlMatTruocCccd: urlMatTruocCccd ?? '',
		urlMatSauCccd: urlMatSauCccd ?? '',
		chuTaiKhoanNganHang: values.accountHolderName,
		nhomMau: values.bloodType,
		coVanDeSucKhoe: values.hasHealthProblem,
		urlDinhKemVanDeSucKhoe: urlDinhKemVanDeSucKhoe ?? undefined,
		isRegisterFreeDormitory: values.hasHealthProblem === true ? Boolean(values.isRegisterFreeDormitory) : undefined,
		soHoChieu: values.passportNumber,
		urlDinhKemHoChieu: urlDinhKemHoChieu ?? undefined,
		visa: hasVisa
			? {
				loaiVisa: values.visaType,
				ngayCap: values.visaIssueDate,
				ngayHetHan: values.visaExpiryDate,
				coQuanCap: values.visaIssuingAuthority,
				noiCap: values.visaPlaceOfIssue,
				urlDinhKemVisa: urlDinhKemVisa ?? undefined,
			}
			: undefined,
		danhSachGiayToNhapHoc,
		firstGenStudent: values.firstGenStudent,
		adjustmentNeeds: values.adjustmentNeeds,
		adjustmentOthersText: values.adjustmentNeeds?.includes('others') ? values.adjustmentOthersText : undefined,
	};
};
