import { useModel } from '@umijs/max';
import { Form, List, Space, Typography } from 'antd';
import React, { useEffect, useMemo } from 'react';
import { buildCloPloMatrixTableHtml, buildCloTargetsTableHtml } from '../constants/defaultSectionHtml';

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

const { Title, Text } = Typography;

const CloContent: React.FC<Props> = ({ readonly, isLopTinChi, index }) => {
	const form = Form.useFormInstance();
	const { getOneChuongTrinh, record } = useModel('daotao.cdrmuctieuhp');

	useEffect(() => {
		const deCuongId = form?.getFieldValue?.('idDeCuong');
		if (!deCuongId) return;

		getOneChuongTrinh({ deCuongId });
	}, []);

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

	const cloPloMatrixTableEl = (
		<div
			className='syllabus-clo-plo-matrix-table'
			style={{ width: '100%' }}
			dangerouslySetInnerHTML={{ __html: cloPloMatrixTableHtml }}
		/>
	);

	let matrixContent: React.ReactNode = null;

	if (showMatrixTable) {
		matrixContent = cloPloMatrixTableEl;
	} else {
		matrixContent = (
			<Text italic type='secondary' style={{ fontSize: 12 }}>
				{!readonly ? '(No CLO–PLO matrix data)' : ''}
			</Text>
		);
	}

	return (
		<Space direction='vertical' size='small' style={{ width: '100%' }}>
			<Title level={4}>PLO/CLO Matrix</Title>

			<List
				size='small'
				split={false}
				dataSource={[
					{
						label: 'Introduced (I)',
						desc: 'The knowledge/skills related to the Program Learning Outcomes (PLOs) are presented in the course. This typically occurs in foundational or lower-level courses in your program.',
					},
					{
						label: 'Reinforced/Practiced (R)',
						desc: 'The knowledge/skills related to the Program Learning Outcomes (PLOs) are being worked on at a level above the introductory stage and/or the knowledge/skills are being developed at a deeper level.',
					},
					{
						label: 'Mastery (M)',
						desc: 'You should have developed a sufficient level of competency in the knowledge/skills related to the Program Learning Outcomes (PLOs). This is where the assessment of the program learning outcome is done (or the artifact for analysis is collected).',
					},
				]}
				renderItem={(item) => (
					<List.Item>
						<Text>
							<Text strong>{item.label}:</Text> {item.desc}
						</Text>
					</List.Item>
				)}
			/>

			<div
				className='syllabus-clo-targets-table'
				style={{ marginTop: 8, width: '100%' }}
				dangerouslySetInnerHTML={{ __html: cloTargetsTableHtml }}
			/>

			<Space direction='vertical' size={8} style={{ width: '100%' }}>
				<div style={{ width: '100%' }}>{matrixContent}</div>
			</Space>
		</Space>
	);
};

export default CloContent;
