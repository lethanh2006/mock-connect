import { Form, FormInstance } from 'antd';
import DOMPurify from 'dompurify';
import React, { useMemo } from 'react';
import { useModel } from 'umi';
import { buildAssessmentHtml } from '../constants/defaultSectionHtml';

export interface AssessmentEditorSectionProps {
	fieldName: number;
	formMain: FormInstance;
	section: Syllabus.INoiDung;
}

const AssessmentEditorSection: React.FC<AssessmentEditorSectionProps> = ({ fieldName, formMain, section }) => {
	const deCuong = Form.useWatch('deCuong', formMain);
	const footerNoiDung = Form.useWatch(['noiDung', fieldName, 'noiDung'], formMain) as string | undefined;
	const { record } = useModel('daotao.cdrmuctieuhp');

	const gradingSchemeData = (deCuong as any)?.thangDiemTuyChinh?.thangDiem || deCuong?.quyDoiDiemList || [];
	const cloData = ((Array.isArray(record) ? record[0]?.danhSachMucTieuHocPhan : record?.danhSachMucTieuHocPhan) ??
		[]) as any[];

	const cdrHinhThucData =
		(deCuong as any)?.cdrHinhThuc ?? (deCuong as any)?.danhSachCdrHinhThuc ?? ([] as any[]);

	const assessmentDataSignature = JSON.stringify({
		_id: deCuong?._id,
		thongTinTrongSo: deCuong?.thongTinTrongSo,
		thongTinTrongSoThi: deCuong?.thongTinTrongSoThi,
		isTinhDiem: (deCuong as any)?.isTinhDiem,
		coCheTinhDiem: (deCuong as any)?.coCheTinhDiem,
		thangDiemTuyChinh: (deCuong as any)?.thangDiemTuyChinh,
		cloMas: (cloData ?? []).map((c: any) => c?.ma),
		grading: JSON.stringify(gradingSchemeData),
		cdr: JSON.stringify(cdrHinhThucData ?? []),
	});

	const fullHtmlForReadonly = useMemo(
		() =>
			buildAssessmentHtml(deCuong, cloData, gradingSchemeData, footerNoiDung ?? section.noiDung, cdrHinhThucData),
		[deCuong, cloData, gradingSchemeData, footerNoiDung, section.noiDung, cdrHinhThucData, assessmentDataSignature],
	);

	return <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(fullHtmlForReadonly) }} />;
};

export default AssessmentEditorSection;
