import ExpandText from '@/components/ExpandText';
import dayjs from '@/utils/dayjs';
import { formatDate, getDateFormat } from '@/utils/formatDate';
import { Button, Checkbox, IconArrowLeft, IconQuestionCircle } from '@vinuni/ui';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import TableStaticData from '../TableStaticData';
import './style.less';
import type { IColumn, TImportHeader } from '../typing';

const PreviewDataImport = (props: {
	onChange: () => void;
	onBack: any;
	importHeaders: TImportHeader[];
	extendData?: Record<string, string | number | boolean | null | undefined>;
}) => {
	const intl = useIntl();
	const { onChange, onBack, importHeaders, extendData } = props;
	const { matchedColumns, fileData, setDataImport, dataImport, startLine } = useModel('import');
	const [invalidRows, setInvalidRows] = useState<Set<number>>();
	const [loading, setLoading] = useState(false);
	const invalidText = intl.formatMessage({ id: 'global.table.import.preview.table.invalidText' });

	const columns: IColumn<any>[] = [
		{
			dataIndex: 'row',
			title: intl.formatMessage({ id: 'global.table.import.preview.table.tthang' }),
			width: 80,
			align: 'center',
			onCell: (row) => ({ className: row.invalid ? 'import-preview-invalid-cell' : undefined }),
		},
		...importHeaders?.map((item) => ({
			dataIndex: item.field,
			title: item.label,
			width: item.type === 'String' ? 140 : 90,
			align: (item.type === 'String' ? 'left' : 'center') as any,
			render: (val: any) =>
				val === invalidText ? (
					<i className='import-preview-error-text'>{val}</i>
				) : item.type === 'Boolean' ? (
					<Checkbox checked={!!val} disabled />
				) : item.type === 'Date' && val ? (
					formatDate(val)
				) : item.type === 'String' ? (
					<ExpandText>{val}</ExpandText>
				) : (
					val
				),
			onCell: (row: any) => ({ className: row.invalid ? 'import-preview-invalid-cell' : undefined }),
		})),
	];

	const getData = () => {
		if (matchedColumns) {
			setLoading(true);
			const tempData: any = [];
			let tmp;
			const invalids: Set<number> = new Set<number>();

			fileData?.forEach((row, index) => {
				const temp: any = { ...(extendData ?? {}), row: index + startLine };
				let valid = true;

				importHeaders?.every((col) => {
					const content = row[matchedColumns[col.field]]?.toString()?.trim();
					// if (col.required && !content) {
					//   valid = false;
					//   return false;
					// }

					if (content) {
						try {
							switch (col.type) {
								case 'Boolean':
									temp[col.field] = content === 'Có' || content === '1' || content === 'x';
									break;
								case 'Number':
									tmp = content ? Number.parseFloat(content.replace(',', '.')) : null;
									if (Number.isNaN(tmp)) {
										temp[col.field] = invalidText;
										valid = false;
									}
									// Với kiểu số thì làm tròn đến 2 chữ số thập phân ???
									else temp[col.field] = tmp === null ? tmp : Math.round(tmp * 100) / 100;
									break;
								case 'Date':
									let parsedDate: string;

									if (dayjs(content, getDateFormat(), true).isValid()) {
										parsedDate = dayjs(content, getDateFormat()).toISOString();
									} else if (dayjs(content, 'D/M/YYYY', true).isValid()) {
										parsedDate = dayjs(content, 'D/M/YYYY').toISOString();
									} else if (!isNaN(Number(content))) {
										// Excel serial date → Unix timestamp
										parsedDate = dayjs.unix((Number(content) - 25569) * 86400).toISOString();
									} else if (dayjs(content).isValid()) {
										parsedDate = dayjs(content).toISOString();
									} else {
										parsedDate = invalidText;
									}

									temp[col.field] = parsedDate;
									valid = parsedDate !== invalidText;
									break;

								default:
									temp[col.field] = content?.toString();
									break;
							}
						} catch {
							temp[col.field] = invalidText;
							valid = false;
						}
					}
					return true;
				});

				tempData.push(temp);
				if (!valid) {
					temp.invalid = true;
					invalids.add(temp.row);
				}
			});
			setDataImport(tempData);
			setInvalidRows(invalids);
			setLoading(false);
		}
	};

	useEffect(() => {
		getData();
	}, [JSON.stringify(matchedColumns)]);

	return (
		<div className='import-preview-wrapper'>
			<div>
				<div className='fw500'>{intl.formatMessage({ id: 'global.table.import.preview.danhsacdulieu' })}</div>
				{invalidRows?.size ? (
					<i className='import-preview-error-text'>
						{intl.formatMessage(
							{ id: 'global.table.import.preview.invalidRows' },
							{ rows: Array.from(invalidRows).join(', ') },
						)}
					</i>
				) : null}
			</div>

			<TableStaticData
				columns={columns}
				data={dataImport ?? []}
				loading={loading}
				size='small'
				otherProps={{ bordered: true, rowKey: (rec: any) => rec.row }}
				hasTotal
			/>

			<div className='import-preview-footer'>
				<Button variant='outline' onClick={() => onBack()} icon={<IconArrowLeft />} type='button'>
					{intl.formatMessage({ id: 'global.table.import.preview.button.quaylai' })}
				</Button>
				<Button
					type='button'
					variant='default'
					onClick={() => onChange()}
					icon={<IconQuestionCircle />}
					disabled={!dataImport?.length || !!invalidRows?.size}
				>
					{intl.formatMessage({ id: 'global.table.import.preview.button.kiemtra' })}
				</Button>
			</div>
		</div>
	);
};

export default PreviewDataImport;
