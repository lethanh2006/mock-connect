import { useModel } from '@umijs/max';
import { Form } from 'antd';
import React, { useEffect, useMemo } from 'react';
import {
	buildCloPloEditorBodyHtml,
	buildCloPloMatrixTableHtml,
	buildCloTargetsTableHtml,
	cloMatrixHintParagraphHtml,
} from '../constants/defaultSectionHtml';
import DOMPurify from 'dompurify';

interface Props {
	readonly?: boolean;
	index: number | (string | number)[];
	isLopTinChi?: boolean;
}

type TCloTargetRow = { _id?: string; ma?: string; ten?: string };

const collectPloCodes = (list: { maPlo?: string }[]) =>
	Array.from(
		list.reduce((acc: Set<string>, item) => {
			const code = item?.maPlo;
			if (code) acc.add(code);
			return acc;
		}, new Set<string>()),
	).sort();

const CloContent: React.FC<Props> = ({ readonly, isLopTinChi, index }) => {
	const form = Form.useFormInstance();
	const { getOneChuongTrinh, record } = useModel('daotao.cdrmuctieuhp');
	const { record: recordLopHocPhan } = useModel('lophocphan.lophocphan');

	useEffect(() => {
		const deCuongId = form?.getFieldValue?.('idDeCuong');
		if (!deCuongId || !recordLopHocPhan?.deCuong?.deCuongId) return;

		getOneChuongTrinh({ deCuongId: recordLopHocPhan?.deCuong?.deCuongId ?? '' });
	}, [recordLopHocPhan?.deCuong?.deCuongId]);

	const apiCloPloList = (Array.isArray(record) ? record[0]?.chuanDauRaMucTieu : record?.chuanDauRaMucTieu) ?? [];
	const cloTargets = ((Array.isArray(record) ? record[0]?.danhSachMucTieuHocPhan : record?.danhSachMucTieuHocPhan) ??
		[]) as TCloTargetRow[];

	const ploCodes = useMemo(() => collectPloCodes(apiCloPloList as { maPlo?: string }[]), [apiCloPloList]);
	const cloCodes: string[] = useMemo(
		() =>
			Array.from(
				apiCloPloList.reduce((acc: Set<string>, item: any) => {
					const code = item?.maClo as string | undefined;
					if (code) acc.add(code);
					return acc;
				}, new Set<string>()),
			),
		[apiCloPloList],
	);

	const hasClo = cloCodes.length > 0;

	const cloTargetsTableHtml = useMemo(() => buildCloTargetsTableHtml(cloTargets), [cloTargets]);

	const showMatrixTable = Boolean(hasClo && cloTargets.length > 0);

	const cloPloMatrixTableHtml = useMemo(
		() =>
			buildCloPloMatrixTableHtml(
				cloTargets,
				ploCodes,
				apiCloPloList as { maClo?: string; maPlo?: string; tyLeAnhHuong?: number }[],
			),
		[cloTargets, ploCodes, apiCloPloList],
	);

	const matrixBlockHtml = useMemo(() => {
		if (showMatrixTable) return cloPloMatrixTableHtml;
		if (!readonly) return cloMatrixHintParagraphHtml('(No CLO–PLO matrix data)');
		return '';
	}, [showMatrixTable, cloPloMatrixTableHtml, readonly]);

	const cloEditorBodyHtml = useMemo(
		() =>
			buildCloPloEditorBodyHtml({
				targetsTableHtml: cloTargetsTableHtml,
				matrixBlockHtml,
			}),
		[cloTargetsTableHtml, matrixBlockHtml],
	);

	return (
		<div
			className='syllabus-clo-editor-body'
			style={{ width: '100%' }}
			dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(cloEditorBodyHtml) }}
		/>
	);
};

export default CloContent;
