import useInitModel from '@/hooks/useInitModel';
import {
	getDiemThiHocKySinhVien,
	initFileMultiPart,
	nopBaiTap,
	uploadFileMultiPart,
	uploadFileMultiPartComplete,
} from '@/services/KhaoThi/SinhVienThi';
import type { SinhVienThi } from '@/services/KhaoThi/SinhVienThi/typing';
import { EFileScope } from '@/services/uploadFile';
import { ipKhaoThi } from '@/utils/ip';
import { message } from 'antd';
import pLimit from 'p-limit';
import { extname } from 'path';
import { useState } from 'react';

type TUploadProgress = {
	totalPart: number;
	success: number;
};

type TUploadCompletePart = { etag: string; part: number };

export default () => {
	const objInit = useInitModel<SinhVienThi.IRecord>('sinh-vien-thi', undefined, undefined, ipKhaoThi);
	const [uploadProgress, setUploadProgress] = useState<TUploadProgress>();
	const { setLoading, formSubmiting, setFormSubmiting } = objInit;

	const getDiemThiHocKySinhVienModel = async (
		maHocKy: string,
		maHocPhan: string,
	): Promise<SinhVienThi.IDiemThiHocKySinhVien[]> => {
		setLoading(true);
		try {
			const response = await getDiemThiHocKySinhVien(maHocKy, maHocPhan);
			return response?.data?.data ?? [];
		} catch (er) {
			return Promise.reject(er);
		} finally {
			setLoading(false);
		}
	};

	const nopBaiTapModel = async (
		idHocPhan: string,
		payload: {
			urlBaiNop: any;
		},
		getData?: () => void,
	): Promise<SinhVienThi.IRecord> => {
		if (formSubmiting) Promise.reject('Form submiting');
		setFormSubmiting(true);
		try {
			const res = await nopBaiTap(idHocPhan, payload);
			message.success('Lưu thành công');
			if (getData) getData();

			return res.data?.data;
		} catch (err) {
			return Promise.reject(err);
		} finally {
			setFormSubmiting(false);
		}
	};

	const uploadMultiPartModel = async (file: any, scope: EFileScope = EFileScope.PUBLIC): Promise<string> => {
		if (formSubmiting) return Promise.reject('form submiting');
		setFormSubmiting(true);

		try {
			const res = await initFileMultiPart({
				filename: file?.name,
				size: file?.size,
				mimetype: file?.type,
				ext: extname(file?.name).toLowerCase(),
				scope,
			});
			const response = res.data.data as SinhVienThi.TUploadMultiPartResponse;
			if (!response.fileId) return Promise.reject('Có lỗi trong quá trình upload file');
			setUploadProgress({ totalPart: response.totalPart, success: 0 });

			const arrayBuffer = await file.arrayBuffer(); // Convert to arraybuffer
			const limit = pLimit(4); // Giới hạn tối đa upload 4 part cùng lúc
			const parts: TUploadCompletePart[] = await Promise.all(
				response.presignedUrls.map((presigned) =>
					limit(async () => {
						// Start index of current part in file
						const startIndex = presigned.partNumber * response.multipartPartSize;
						const newEnd = Math.min(startIndex + response.multipartPartSize, file?.size);
						const chunk = arrayBuffer.slice(startIndex, newEnd); // Split file into multiple `chunk`
						// Upload part hiện tại lên presigned url
						const uploadRes = await uploadFileMultiPart(presigned.presignedUrl, chunk);

						setUploadProgress((progress) => ({
							totalPart: progress?.totalPart ?? 0,
							success: (progress?.success ?? 0) + 1,
						}));
						return { etag: uploadRes.headers.etag, part: presigned.partNumber };
					}),
				),
			);

			// Call complete: Kiểm tra nếu tất cả các phần đều upload thành công thì mới complete
			const resComplete = await uploadFileMultiPartComplete({
				fileId: response?.fileId,
				parts,
			});
			return resComplete?.data?.data?.url;
		} catch (er) {
			return Promise.reject(er);
		} finally {
			setFormSubmiting(false);
		}
	};

	return {
		...objInit,
		getDiemThiHocKySinhVienModel,
		nopBaiTapModel,
		uploadMultiPartModel,
		uploadProgress,
	};
};
