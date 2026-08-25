import { CERTIFICATE_TYPE_OTHER } from '@/pages/DaoTao/ChungChi/Select';
import { ELoaiNoiSinh } from '@/services/DaoTao/SinhVien/constants';
import type { SinhVien } from '@/services/DaoTao/SinhVien/typings';

const GRADE_KEYS = ['diemToan', 'diemVan', 'diemTiengAnh', 'diemLy', 'diemHoa', 'diemSinh', 'diemTrungBinhNam'] as const;

/**
 * Inverse of `buildStep2Payload` — maps saved academic information back into step 2 form field names.
 */
export const buildStep2InitialValues = (sinhVien?: SinhVien.IRecord): Record<string, any> => {
	if (!sinhVien) return {};

	const hoSo = sinhVien.hoSoNhapHoc;
	const svAny = sinhVien as any;

	const thongTinTHPT = svAny.thongTinHocTapTHPT ?? hoSo?.thongTinHocTapTHPT;
	const thongTinDaiHoc = svAny.thongTinDaiHoc ?? hoSo?.thongTinDaiHoc;
	const tiengAnh = svAny.thongTinChungChiTiengAnh ?? hoSo?.thongTinChungChiTiengAnh;

	const coBangDaiHoc = svAny.coBangDaiHoc ?? hoSo?.coBangDaiHoc ?? (thongTinDaiHoc ? true : undefined);
	const isDomestic = thongTinTHPT?.noiHoc ? thongTinTHPT.noiHoc === ELoaiNoiSinh.TRONG_NUOC : undefined;
	const isTransferred = thongTinTHPT?.coDoiTruong;

	const grade10 = thongTinTHPT?.truongLop10;
	const grade11 = thongTinTHPT?.truongLop11;
	const grade12 = thongTinTHPT?.truongLop12;

	const buildGradeFields = (grade: '10' | '11' | '12', data?: any) => {
		if (!data?.diem) return {};
		const result: Record<string, any> = {};
		GRADE_KEYS.forEach((key) => {
			if (data.diem[key] !== undefined) {
				result[`${key}_${grade}`] = data.diem[key];
			}
		});
		return result;
	};

	const highSchoolIdentityFields = (): Record<string, any> => {
		if (!isTransferred) {
			// Single high school identity (suffix '')
			if (isDomestic) {
				return {
					tinhTpTruong: thongTinTHPT?.tenTinh ?? grade10?.tenTinh,
					maTinhTpTruong: thongTinTHPT?.maTinh ?? grade10?.maTinh,
					hsName: thongTinTHPT?.tenTruongCap3 ?? grade10?.tenTruong,
					hsSchoolCode: thongTinTHPT?.maTruong ?? grade10?.maTruong,
				};
			}
			return {
				hsCountry: thongTinTHPT?.quocGiaHoc,
				hsCity: thongTinTHPT?.thanhPho,
				hsName: thongTinTHPT?.tenTruongCap3 ?? grade10?.tenTruong,
			};
		}

		// Transferred high school identity per grade year (suffix '10', '11', '12')
		if (isDomestic) {
			return {
				tinhTpTruong10: grade10?.tenTinh,
				maTinhTpTruong10: grade10?.maTinh,
				hsName10: grade10?.tenTruong,
				hsSchoolCode10: grade10?.maTruong,

				tinhTpTruong11: grade11?.tenTinh,
				maTinhTpTruong11: grade11?.maTinh,
				hsName11: grade11?.tenTruong,
				hsSchoolCode11: grade11?.maTruong,

				tinhTpTruong12: grade12?.tenTinh,
				maTinhTpTruong12: grade12?.maTinh,
				hsName12: grade12?.tenTruong,
				hsSchoolCode12: grade12?.maTruong,
			};
		}

		return {
			hsCountry10: grade10?.quocGiaHoc ?? thongTinTHPT?.quocGiaHoc,
			hsCity10: grade10?.thanhPho ?? thongTinTHPT?.thanhPho,
			hsName10: grade10?.tenTruong,

			hsCountry11: grade11?.quocGiaHoc ?? thongTinTHPT?.quocGiaHoc,
			hsCity11: grade11?.thanhPho ?? thongTinTHPT?.thanhPho,
			hsName11: grade11?.tenTruong,

			hsCountry12: grade12?.quocGiaHoc ?? thongTinTHPT?.quocGiaHoc,
			hsCity12: grade12?.thanhPho ?? thongTinTHPT?.thanhPho,
			hsName12: grade12?.tenTruong,
		};
	};

	return {
		pursuingDegree: coBangDaiHoc,
		universityName: thongTinDaiHoc?.tenTruongDaiHoc,
		universityMajor: thongTinDaiHoc?.tenNganhHoc,
		universityDegreeLevel: thongTinDaiHoc?.trinhDoHocVan,
		universityFromDate: thongTinDaiHoc?.tuNgay,
		universityToDate: thongTinDaiHoc?.denNgay,

		attendedHighSchoolInVietnam: isDomestic,
		transferredHighSchool: isTransferred,

		...highSchoolIdentityFields(),

		priorityCategory: svAny.doiTuongUuTienTuyenSinh ?? hoSo?.doiTuongUuTienTuyenSinh,
		priorityArea: svAny.khuVucUuTienTuyenSinh ?? hoSo?.khuVucUuTienTuyenSinh,
		graduationYear: svAny.namTotNghiep ?? hoSo?.namTotNghiep,
		academicRanking: svAny.xepLoaiHocTapTHPT ?? hoSo?.xepLoaiHocTapTHPT,

		...buildGradeFields('10', grade10),
		...buildGradeFields('11', grade11),
		...buildGradeFields('12', grade12),

		certificateType: tiengAnh?.isChungChiKhac ? CERTIFICATE_TYPE_OTHER : tiengAnh?.loaiChungChi,
		certificateTypeOther: tiengAnh?.isChungChiKhac ? tiengAnh?.loaiChungChi : undefined,
		isChungChiKhac: !!tiengAnh?.isChungChiKhac,
		certificateScore: tiengAnh?.diemChungChi,
		diemNghe: tiengAnh?.diemNghe,
		diemNoi: tiengAnh?.diemNoi,
		diemDoc: tiengAnh?.diemDoc,
		diemViet: tiengAnh?.diemViet,
		certificateIssueDate: tiengAnh?.ngayCapChungChi,
		certificateIssuer: tiengAnh?.noiCapChungChi,
		certificateAttachment: tiengAnh?.urlFileMinhChung,
	};
};
