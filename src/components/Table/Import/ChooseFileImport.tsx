import UploadFile from '@/components/Upload/UploadFile';
import rules from '@/utils/rules';
import {
	FILE_EXTENSIONS,
	getFileExtension,
	isAllowedFile,
	isValidFileBuffer,
	validateFileBlob,
} from '@/utils/fileValidation';
import { ArrowRightOutlined, CloseOutlined, DownloadOutlined } from '@ant-design/icons';
import { Button, Col, Form, InputNumber, Row, Select, Space, message } from 'antd';
import fileDownload from 'js-file-download';
import { pick } from 'lodash';
import { useState } from 'react';
import { useIntl, useModel } from 'umi';
import * as XLSX from 'xlsx';

const MAX_IMPORT_FILE_SIZE_MB = 5;
const MAX_SHEET_COUNT = 50;
const MAX_IMPORT_ROWS = 10000;
const MAX_IMPORT_COLS = 256;

const getSheetDimensions = (ws: XLSX.WorkSheet): { rows: number; cols: number } => {
	if (!ws?.['!ref']) return { rows: 0, cols: 0 };
	const range = XLSX.utils.decode_range(ws['!ref']);
	return {
		rows: range.e.r - range.s.r + 1,
		cols: range.e.c - range.s.c + 1,
	};
};

const ChooseFileImport = (props: { onChange: () => void; onCancel: any; getTemplate: any; fileName?: string }) => {
	const intl = useIntl();
	const { onChange, onCancel, getTemplate } = props;
	const { setHeadLine, setFileData, setStartLine } = useModel('import');
	const [workbook, setWorkbook] = useState<XLSX.WorkBook>();
	const [sheetNames, setSheetNames] = useState<string[]>();
	const [form] = Form.useForm();

	const indexToExcelColumn = (num: number) => {
		let letters = '';
		while (num >= 0) {
			letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[num % 26] + letters;
			// eslint-disable-next-line no-param-reassign
			num = Math.floor(num / 26) - 1;
		}
		return letters;
	};

	const resetWorkbookState = () => {
		setWorkbook(undefined);
		setSheetNames(undefined);
		form.setFieldsValue({ sheet: undefined, line: undefined });
	};

	const getWorksheets = (data: ArrayBuffer, extension?: string) => {
		if (!isValidFileBuffer(data, extension ?? '')) {
			resetWorkbookState();
			message.error(intl.formatMessage({ id: 'global.uploadfile.error.format' }));
			return;
		}

		try {
			const wb = XLSX.read(data, { type: 'array', cellDates: false });
			const sheets = wb.SheetNames;
			if (!sheets?.length || sheets.length > MAX_SHEET_COUNT) {
				resetWorkbookState();
				message.error(intl.formatMessage({ id: 'global.table.import.choose.message2' }));
				return;
			}
			setWorkbook(wb);
			setSheetNames(sheets);
			form.setFieldsValue({ sheet: sheets[0], line: 1 });
		} catch {
			resetWorkbookState();
			message.error(intl.formatMessage({ id: 'global.table.import.choose.message2' }));
		}
	};

	const onChangeUpload = async (value: { fileList: any[] | null }) => {
		const file = value.fileList?.[0]?.originFileObj;
		if (!file) {
			resetWorkbookState();
			return;
		}
		if (!isAllowedFile(file, FILE_EXTENSIONS.excel)) {
			resetWorkbookState();
			message.error(intl.formatMessage({ id: 'global.uploadfile.error.format' }));
			return;
		}
		if (!(await validateFileBlob(file, file.name))) {
			resetWorkbookState();
			message.error(intl.formatMessage({ id: 'global.uploadfile.error.format' }));
			return;
		}
		if (typeof FileReader !== 'undefined') {
			const reader = new FileReader();
			const extension = getFileExtension(file.name ?? '');
			reader.onload = (e) => {
				const result = e.target?.result;
				if (result instanceof ArrayBuffer) getWorksheets(result, extension);
				else {
					resetWorkbookState();
					message.error(intl.formatMessage({ id: 'global.table.import.choose.message2' }));
				}
			};
			reader.onerror = () => {
				resetWorkbookState();
				message.error(intl.formatMessage({ id: 'global.table.import.choose.message2' }));
			};
			reader.readAsArrayBuffer(file);
		} else {
			message.error(intl.formatMessage({ id: 'global.table.import.choose.message1' }));
			if (onCancel) onCancel();
		}
	};

	const onFinish = (values: any) => {
		const { sheet, line } = values;
		const ws = workbook?.Sheets[sheet];
		if (ws) {
			const { rows: sheetRows, cols: sheetCols } = getSheetDimensions(ws);
			if (sheetRows > MAX_IMPORT_ROWS || sheetCols > MAX_IMPORT_COLS) {
				message.error(intl.formatMessage({ id: 'global.table.import.choose.message2' }));
				return;
			}

			// Lấy hàng tiêu đề trong excel
			const headRow = XLSX.utils.sheet_to_json(ws, {
				header: 1,
				range: `A${line}:ZZ${line}`,
				defval: '',
			});
			const header = Object.values(headRow[0] as any) as string[];
			// Map Excel column - column title: A: "Mã"
			let hline: Record<string, string> = {};
			header.forEach((item, index) => {
				if (!!item) hline = { ...hline, [indexToExcelColumn(index)]: item };
			});

			const cols = Object.values(hline); // Những tên cột thực tế, bỏ các cột trống
			// Lấy toàn bộ data trong file
			const sheetData = XLSX.utils.sheet_to_json(ws, { header, rawNumbers: false }) as any[];
			const data = sheetData.filter((item) => item.__rowNum__ >= line).map((item) => pick(item, cols)); // Chỉ lấy từ data những trường cần lấy

			if (data.length > 0 && cols.length > 0) {
				setStartLine(line + 1);
				setHeadLine(hline);
				setFileData(data);
				onChange();
				return;
			}
		}
		message.error(intl.formatMessage({ id: 'global.table.import.choose.message2' }));
	};

	const onDownloadTemplate = () => {
		try {
			getTemplate().then((blob: any) => fileDownload(blob, props.fileName ?? 'File biểu mẫu.xlsx'));
		} catch (er) {
			console.log('🚀 er:', er);
		}
	};

	return (
		<Form layout='vertical' onFinish={onFinish} form={form}>
			<Row gutter={[12, 0]}>
				<Col span={24}>
					<Form.Item
						name='file'
						label={intl.formatMessage({ id: 'global.table.import.choose.taptin' })}
						rules={[...rules.fileRequired]}
					>
						<UploadFile
							onChange={onChangeUpload}
							accept='.xls,.xlsx'
							maxFileSize={MAX_IMPORT_FILE_SIZE_MB}
							drag
							buttonDescription={intl.formatMessage({ id: 'global.table.import.choose.des' })}
						/>
					</Form.Item>
				</Col>

				<Col span={24} md={12}>
					<Form.Item
						name='sheet'
						label={intl.formatMessage({ id: 'global.table.import.choose.trangtinh' })}
						rules={[...rules.required]}
					>
						<Select
							style={{ width: '100%' }}
							placeholder={intl.formatMessage({ id: 'global.table.import.choose.trangtinh.placeholder' })}
							options={sheetNames?.map((item) => ({
								key: item,
								value: item,
								label: item,
							}))}
							optionFilterProp='label'
						/>
					</Form.Item>
				</Col>
				<Col span={24} md={12}>
					<Form.Item
						name='line'
						label={intl.formatMessage({ id: 'global.table.import.choose.tieude' })}
						rules={[...rules.required]}
					>
						<InputNumber
							placeholder={intl.formatMessage({ id: 'global.table.import.choose.tieude.placeholder' })}
							style={{ width: '100%' }}
						/>
					</Form.Item>
				</Col>

				{getTemplate ? (
					<Col span={24} style={{ textAlign: 'center', marginTop: 8 }}>
						<i>{intl.formatMessage({ id: 'global.table.import.choose.sudungtapdulieu' })}</i>
						<br />
						<Button icon={<DownloadOutlined />} type='link' onClick={onDownloadTemplate}>
							{intl.formatMessage({ id: 'global.table.import.choose.button.taitaptin' })}
						</Button>
					</Col>
				) : null}

				<Col span={24}>
					<Space style={{ marginTop: 12, justifyContent: 'space-between', width: '100%' }}>
						<Button onClick={() => onCancel()} icon={<CloseOutlined />}>
							{intl.formatMessage({ id: 'global.table.import.choose.button.huy' })}
						</Button>
						<Button htmlType='submit' type='primary'>
							{intl.formatMessage({ id: 'global.table.import.choose.button.tieptheo' })} <ArrowRightOutlined />
						</Button>
					</Space>
				</Col>
			</Row>
		</Form>
	);
};

export default ChooseFileImport;
