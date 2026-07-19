import { Upload } from 'antd';
import type { RcFile } from 'antd/es/upload';

export type UploadFileItem = {
	remote?: boolean;
	name?: string;
	type?: string;
	originFileObj?: Blob;
};

/** Preset extension — dùng khi biết loại file cố định */
export const FILE_EXTENSIONS = {
	word: ['doc', 'docx'],
	excel: ['xls', 'xlsx'],
	pdf: ['pdf'],
	image: ['png', 'jpg', 'jpeg', 'gif', 'webp'],
} as const;

/** docx/xlsx = ZIP (PK), doc/xls = OLE */
const OFFICE_BUFFER_TYPE: Record<string, 'zip' | 'ole'> = {
	docx: 'zip',
	xlsx: 'zip',
	doc: 'ole',
	xls: 'ole',
};

const EXTENSION_MIME_MAP: Record<string, string[]> = {
	doc: ['application/msword'],
	docx: ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
	xls: ['application/vnd.ms-excel'],
	xlsx: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
	pdf: ['application/pdf'],
	png: ['image/png'],
	jpg: ['image/jpeg'],
	jpeg: ['image/jpeg'],
	gif: ['image/gif'],
	webp: ['image/webp'],
};

export const getFileExtension = (fileName: string): string => fileName.split('.').pop()?.toLowerCase() ?? '';

/** Parse chuỗi accept HTML (vd: `image/*, .pdf, .docx`) thành danh sách extension */
export const parseAcceptString = (accept: string): string[] => {
	const extensions: string[] = [];

	accept.split(',').forEach((part) => {
		const trimmed = part.trim().toLowerCase();
		if (!trimmed) return;
		if (trimmed === 'image/*' || trimmed === 'image') {
			extensions.push(...FILE_EXTENSIONS.image);
			return;
		}
		if (trimmed.startsWith('.')) {
			extensions.push(trimmed.slice(1));
			return;
		}
		if (!trimmed.includes('/')) {
			extensions.push(trimmed);
		}
	});

	return [...new Set(extensions)];
};

const isZipOfficeBuffer = (bytes: Uint8Array): boolean => bytes[0] === 0x50 && bytes[1] === 0x4b;
const isOleOfficeBuffer = (bytes: Uint8Array): boolean =>
	bytes[0] === 0xd0 && bytes[1] === 0xcf && bytes[2] === 0x11 && bytes[3] === 0xe0;

const isValidOfficeBuffer = (buffer: ArrayBuffer, extension?: string): boolean => {
	const bytes = new Uint8Array(buffer, 0, 8);
	const isZip = isZipOfficeBuffer(bytes);
	const isOle = isOleOfficeBuffer(bytes);
	const bufferType = extension ? OFFICE_BUFFER_TYPE[extension] : undefined;

	if (bufferType === 'zip') return isZip;
	if (bufferType === 'ole') return isOle;
	return isZip || isOle;
};

const isValidPdfBuffer = (bytes: Uint8Array): boolean =>
	bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46;

const isValidImageBuffer = (bytes: Uint8Array, extension?: string): boolean => {
	const isPng = bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47;
	const isJpeg = bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
	const isGif = bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x38;
	const isWebp =
		bytes.length >= 12 &&
		bytes[0] === 0x52 &&
		bytes[1] === 0x49 &&
		bytes[2] === 0x46 &&
		bytes[3] === 0x46 &&
		bytes[8] === 0x57 &&
		bytes[9] === 0x45 &&
		bytes[10] === 0x42 &&
		bytes[11] === 0x50;

	if (extension === 'png') return isPng;
	if (extension === 'jpg' || extension === 'jpeg') return isJpeg;
	if (extension === 'gif') return isGif;
	if (extension === 'webp') return isWebp;
	return isPng || isJpeg || isGif || isWebp;
};

/** Kiểm tra magic bytes theo extension */
export const isValidFileBuffer = (buffer: ArrayBuffer, extension: string): boolean => {
	const ext = extension.toLowerCase();
	const bytes = new Uint8Array(buffer, 0, 12);

	if (FILE_EXTENSIONS.word.includes(ext as (typeof FILE_EXTENSIONS.word)[number]))
		return isValidOfficeBuffer(buffer, ext);
	if (FILE_EXTENSIONS.excel.includes(ext as (typeof FILE_EXTENSIONS.excel)[number]))
		return isValidOfficeBuffer(buffer, ext);
	if (ext === 'pdf') return isValidPdfBuffer(bytes);
	if ((FILE_EXTENSIONS.image as readonly string[]).includes(ext)) return isValidImageBuffer(bytes, ext);
	return false;
};

export const isAllowedFile = (
	file: { name?: string; type?: string },
	allowedExtensions: readonly string[],
): boolean => {
	const ext = getFileExtension(file?.name ?? '');
	if (!allowedExtensions.includes(ext)) return false;
	if (!file?.type) return true;

	const allowedMimeTypes = allowedExtensions.flatMap((item) => EXTENSION_MIME_MAP[item] ?? []);
	if (allowedMimeTypes.includes(file.type)) return true;
	if (file.type === 'application/octet-stream') return true;
	return false;
};

export const validateFileBlob = async (blob: Blob, fileName?: string): Promise<boolean> => {
	try {
		const ext = fileName ? getFileExtension(fileName) : '';
		if (!ext) return false;
		const buffer = await blob.arrayBuffer();
		return isValidFileBuffer(buffer, ext);
	} catch {
		return false;
	}
};

export const validateUploadFileList = async (
	fileList: UploadFileItem[],
	allowedExtensions: readonly string[],
): Promise<boolean> => {
	for (const file of fileList) {
		if (file?.remote) continue;
		if (!isAllowedFile(file, allowedExtensions)) return false;
		if (!file.originFileObj) return false;
		if (!(await validateFileBlob(file.originFileObj, file.name))) return false;
	}
	return true;
};

/** Factory — thay cho các preset isAllowedX / validateX riêng lẻ */
export const createUploadValidator = (extensions: readonly string[]) => ({
	extensions,
	isAllowed: (file: { name?: string; type?: string }) => isAllowedFile(file, extensions),
	validateBlob: (blob: Blob, fileName?: string) => validateFileBlob(blob, fileName),
	validateFileList: (fileList: UploadFileItem[]) => validateUploadFileList(fileList, extensions),
});

export const createBeforeUploadValidator =
	(accept: string, onError?: () => void) =>
	async (file: RcFile): Promise<boolean | string> => {
		const { isAllowed, validateBlob } = createUploadValidator(parseAcceptString(accept));
		if (!parseAcceptString(accept).length) return false;

		if (!isAllowed(file)) {
			onError?.();
			return Upload.LIST_IGNORE;
		}
		if (!(await validateBlob(file, file.name))) {
			onError?.();
			return Upload.LIST_IGNORE;
		}
		return false;
	};
