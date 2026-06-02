import axios from '@/utils/axios';
import { ip3, ipFile } from '@/utils/ip';

export enum EFileScope {
	PUBLIC = 'Public',
	INTERNAL = 'Internal',
	PRIVATE = 'Private',
}

type TPresignedPart = {
	partNumber: number;
	presignedUrl: string;
};

type TMultipartInitData = {
	fileId: string;
	uploadId: string;
	multipartPartSize: number;
	totalPart: number;
	presignedUrls: TPresignedPart[];
};

type TMultipartCompletePart = {
	PartNumber: number;
	ETag: string;
};

const getFilename = (file: Blob): string => {
	return (file as File)?.name || 'upload';
};

const getFileExtension = (filename: string): string => {
	const ext = filename.split('.').pop();
	return ext && ext !== filename ? ext : '';
};

export const getFileRouteBase = (ip?: string) => {
	const base = (ip ?? ip3).replace(/\/+$/, '');
	return base.endsWith('/file') ? base : `${base}/file`;
};

const uploadMultipartParts = async (file: Blob, initData: TMultipartInitData): Promise<TMultipartCompletePart[]> => {
	const partSize = initData.multipartPartSize;
	const parts = await Promise.all(
		initData.presignedUrls.map(async ({ partNumber, presignedUrl }) => {
			const start = (partNumber - 1) * partSize;
			const end = Math.min(start + partSize, file.size);
			const response = await fetch(presignedUrl, {
				method: 'PUT',
				body: file.slice(start, end),
			});

			if (!response.ok) {
				throw new Error(`Upload part ${partNumber} failed with status ${response.status}`);
			}

			const etag = response.headers.get('ETag')?.replaceAll('"', '');
			if (!etag) {
				throw new Error(`Upload part ${partNumber} missing ETag`);
			}

			return {
				PartNumber: partNumber,
				ETag: etag,
			};
		}),
	);

	return parts.sort((a, b) => a.PartNumber - b.PartNumber);
};

export async function uploadFileManagerMultipart(
	payload: { file: Blob; scope?: EFileScope; module?: string },
	ip: string = ipFile,
) {
	const file = payload.file;
	const filename = getFilename(file);
	const fileRouteBase = getFileRouteBase(ip);
	const initResponse = await axios.post(`${fileRouteBase}/multipart/init`, {
		filename,
		size: file.size,
		mimetype: file.type || 'application/octet-stream',
		ext: getFileExtension(filename),
		scope: payload.scope ?? EFileScope.PRIVATE,
		module: payload.module ?? 'co-curriculum',
	});
	const initData: TMultipartInitData = initResponse?.data?.data;
	const parts = await uploadMultipartParts(file, initData);

	const completeResponse = await axios.post(`${fileRouteBase}/multipart/complete`, {
		fileId: initData.fileId,
		parts,
	});

	if (completeResponse?.data?.data?.file && !completeResponse.data.data._id) {
		completeResponse.data.data._id = completeResponse.data.data.file._id;
	}

	return completeResponse;
}

export const handleSingleFile = async (
	file: any,
	scope: EFileScope = EFileScope.PUBLIC,
	returnResponse?: boolean,
	ip?: string,
): Promise<string | null> => {
	if (file?.originFileObj) {
		try {
			const response = await uploadFile(
				{
					file: file?.originFileObj,
					scope,
				},
				ip,
			);
			return returnResponse ? (response as any) : response?.data?.data?.url;
		} catch (er) {
			return Promise.reject(er);
		}
	} else return file?.url || null;
};

export async function uploadFile(payload: { file: string | Blob; scope: EFileScope }, ip?: string) {
	const form = new FormData();
	form.append('file', payload?.file);
	form.append('scope', payload?.scope);
	return axios.post(getFileRouteBase(ip ?? ipFile), form);
}

/**
 * Build upload file from values in form
 * @param values: get from Form
 * @param fieldName: fieldName in Form is Upload
 * @param scope: Phạm vi của file : Public, Internal, Private
 * @returns Url of file uploaded or NULL
 */
export const buildUpLoadFile = async (
	values: any,
	fieldName: string,
	scope: EFileScope = EFileScope.PUBLIC,
	returnResponse?: boolean,
	ip?: string,
): Promise<string | null | any> => {
	// File updload chưa onChange => value vẫn là string
	if (typeof values?.[fieldName] === 'string') return values[fieldName];
	else if (values?.[fieldName]?.fileList?.[0]) {
		return handleSingleFile(values?.[fieldName]?.fileList?.[0], scope, returnResponse, ip);
	}
	return null;
};

/**
 * Build upload multiple files from values in form
 * @param values: get from Form
 * @param fieldName: fieldName in Form is Upload
 * @returns Array Url of files uploaded or NULL
 */
export const buildUpLoadMultiFile = async (
	values: any,
	fieldName: string,
	scope: EFileScope = EFileScope.PUBLIC,
): Promise<string[] | null> => {
	// File upload chưa onChange => value vẫn là sring[]
	if (Array.isArray(values?.[fieldName])) return values[fieldName];
	else if (
		values?.[fieldName]?.fileList &&
		Array.isArray(values?.[fieldName]?.fileList) &&
		values?.[fieldName]?.fileList?.length
	) {
		// Upload từng file lên
		return Promise.all(values?.[fieldName]?.fileList.map((file: any) => handleSingleFile(file, scope)));
	}
	return null;
};

export const getFileInfo = (id: string, ip?: string) => {
	return axios.get(`${getFileRouteBase(ip)}/${id}/info`, { data: { silent: true } });
};

export const getFileUrl = (id: string, ip?: string) => {
	return axios.get(`${getFileRouteBase(ip)}/${id}/url`, { data: { silent: true } });
};

export const getFileContent = (url: string) => {
	return axios.get(url, {
		responseType: 'arraybuffer',
	});
};
