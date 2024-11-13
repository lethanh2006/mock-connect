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

	const uploadMultiPartModel = async (files: any[], scope: EFileScope = EFileScope.PUBLIC): Promise<string[]> => {
		if (formSubmiting) return Promise.reject('form submitting');
		setFormSubmiting(true);

		// Mảng lưu URL của các file đã upload thành công
		const uploadUrls: string[] = [];
		const uploadPromises = files.map(async (file: any) => {
			try {
				// Khởi tạo tải lên nhiều phần và lấy về các URL presigned cho từng phần của tệp
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

				// Lấy kích thước chunk size từ server
				const chunkSize = response.multipartPartSize;
				const totalParts = Math.ceil(file.size / chunkSize);
				const parts: TUploadCompletePart[] = [];

				// Tải lên từng phần của file
				for (let partNumber = 0; partNumber < totalParts; partNumber++) {
					const start = partNumber * chunkSize;
					const end = Math.min(start + chunkSize, file.size);
					const chunk = file.slice(start, end);
					const arrayBuffer = await chunk.arrayBuffer();

					// Tải phần lên server
					const uploadRes = await uploadFileMultiPart(response.presignedUrls[partNumber].presignedUrl, arrayBuffer);

					// Lưu lại thông tin phần đã tải lên
					parts.push({ etag: uploadRes.headers.etag, part: partNumber + 1 });

					// Cập nhật tiến trình
					setUploadProgress((progress) => ({
						totalPart: progress?.totalPart ?? totalParts,
						success: (progress?.success ?? 0) + 1,
					}));
				}

				// Hoàn thành upload nhiều phần của file
				const resComplete = await uploadFileMultiPartComplete({
					fileId: response?.fileId,
					parts,
				});
				uploadUrls.push(resComplete?.data?.data?.url);
			} catch (err) {
				console.error(err);
				throw err;
			}
		});

		// Đợi tất cả các file tải lên
		try {
			await Promise.all(uploadPromises);
			return uploadUrls;
		} catch (error) {
			return Promise.reject(error);
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
