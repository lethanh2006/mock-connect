import { CERTIFICATE_TYPE_OTHER } from '@/pages/DaoTao/ChungChi/Select';
import { ELoaiNoiSinh } from '@/services/DaoTao/SinhVien/constants';
import { buildUpLoadFileMultipart, EFileScope } from '@/services/uploadFile';
import type { TStep2Payload, TThongTinTruongCap3 } from './typing';

const toOptionalString = (value: unknown): string | undefined =>
	value === undefined || value === null || value === '' ? undefined : String(value);

const buildDiem = (values: Record<string, any>, grade: string) => ({
	diemToan: values[`diemToan_${grade}`],
	diemVan: values[`diemVan_${grade}`],
	diemTiengAnh: values[`diemTiengAnh_${grade}`],
	diemLy: values[`diemLy_${grade}`],
	diemHoa: values[`diemHoa_${grade}`],
	diemSinh: values[`diemSinh_${grade}`],
	diemTrungBinhNam: values[`diemTrungBinhNam_${grade}`],
});

const buildTruongCap3 = (
	values: Record<string, any>,
	grade: string,
	isDomestic: boolean,
	isTransferred: boolean,
): TThongTinTruongCap3 => {
	// When the student did NOT transfer schools, every grade year shares the single school identity (suffix '').
	const identitySuffix = isTransferred ? grade : '';

	return {
		tenTruong: values[`hsName${identitySuffix}`],
		tenTinh: isDomestic ? values[`tinhTpTruong${identitySuffix}`] : undefined,
		maTinh: isDomestic ? values[`maTinhTpTruong${identitySuffix}`] : undefined,
		maTruong: isDomestic ? values[`hsSchoolCode${identitySuffix}`] : undefined,
		diem: buildDiem(values, grade),
	};
};

export const buildStep2Payload = async (values: Record<string, any>): Promise<TStep2Payload> => {
	const isDomestic = values.attendedHighSchoolInVietnam === true;
	const isTransferred = values.transferredHighSchool === true;
	const isPursuingDegree = values.pursuingDegree === true;

	const urlFileMinhChung = await buildUpLoadFileMultipart(values, 'certificateAttachment', {
		scope: EFileScope.INTERNAL,
		module: 'nhap-hoc',
		returnValue: 'url',
	});

	return {
		doiTuongUuTienTuyenSinh: values.priorityCategory,
		khuVucUuTienTuyenSinh: values.priorityArea,
		xepLoaiHocTapTHPT: values.academicRanking,
		namTotNghiep: values.graduationYear,
		coBangDaiHoc: isPursuingDegree,
		thongTinDaiHoc: isPursuingDegree
			? {
				tenTruongDaiHoc: values.universityName,
				tenNganhHoc: values.universityMajor,
				trinhDoHocVan: values.universityDegreeLevel,
				tuNgay: values.universityFromDate,
				denNgay: values.universityToDate,
			}
			: undefined,
		thongTinHocTapTHPT: {
			noiHoc: isDomestic ? ELoaiNoiSinh.TRONG_NUOC : ELoaiNoiSinh.NUOC_NGOAI,
			quocGiaHoc: !isDomestic ? values.hsCountry : undefined,
			thanhPho: !isDomestic ? values.hsCity : undefined,
			tenTruongCap3: !isTransferred ? values.hsName : undefined,
			tenTinh: isDomestic && !isTransferred ? values.tinhTpTruong : undefined,
			maTinh: isDomestic && !isTransferred ? values.maTinhTpTruong : undefined,
			maTruong: isDomestic && !isTransferred ? values.hsSchoolCode : undefined,
			coDoiTruong: isTransferred,
			truongLop10: buildTruongCap3(values, '10', isDomestic, isTransferred),
			truongLop11: buildTruongCap3(values, '11', isDomestic, isTransferred),
			truongLop12: buildTruongCap3(values, '12', isDomestic, isTransferred),
		},
		thongTinChungChiTiengAnh: values.certificateType
			? {
				loaiChungChi:
					values.certificateType === CERTIFICATE_TYPE_OTHER
						? values.certificateTypeOther
						: values.certificateType,
				isChungChiKhac: values.certificateType === CERTIFICATE_TYPE_OTHER,
				diemChungChi: toOptionalString(values.certificateScore),
				diemNghe: toOptionalString(values.diemNghe),
				diemNoi: toOptionalString(values.diemNoi),
				diemDoc: toOptionalString(values.diemDoc),
				diemViet: toOptionalString(values.diemViet),
				ngayCapChungChi: values.certificateIssueDate,
				noiCapChungChi: values.certificateIssuer,
				urlFileMinhChung: urlFileMinhChung ?? undefined,
			}
			: undefined,
	};
};
