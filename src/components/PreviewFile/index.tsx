import EmptyState from '@/components/EmptyState';
import { Button, IconChervolLeft, IconChervolRight, IconDownload, IconMagnifyingglass } from '@/components/Icons';
import { EDinhDangFile } from '@/services/base/constant';
import type { IFileInfo } from '@/services/base/typing';
import { getFileContent, getFileInfo, getFileRouteBase } from '@/services/uploadFile';
import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';
import { getSafeHref, openSafeUrl } from '@/utils/security';
import { toast } from '@/utils/toast';
import { getFileType, getNameFile } from '@/utils/utils';
import { Spin } from 'antd';
import fileDownload from 'js-file-download';
import { useEffect, useState } from 'react';
import { useIntl } from 'umi';
import AuthImage from '../Image/AuthImage';
import PDFViewerV2 from '../PDFViewerV2';
import type { TPreviewFileProps } from '../PreviewFile/typing';
import ButtonExtend from '../Table/ButtonExtend';
import './style.less';

type TFrameProps = {
	url: string;
	type: EDinhDangFile;
	name?: string;
	src?: string;
	data?: ArrayBuffer;
};

/** File vừa chọn ở máy, chưa upload lên server */
const isLocalObjectUrl = (url?: string) => !!url && (url.startsWith('blob:') || url.startsWith('data:'));

const PreviewFile: React.FC<TPreviewFileProps> = (props) => {
	const intl = useIntl();
	const { file, style = {}, children, ip = ip3, isFileId, tenFile, isPrivate } = props;

	const isValidStringArray = (value: any): value is string[] => {
		return Array.isArray(value) && value.every((item) => typeof item === 'string');
	};
	const isValidSingleString = typeof file === 'string';

	if (file && !isValidSingleString && !isValidStringArray(file)) {
		return (
			<div className='preview-error'>
				<p style={{ color: 'red', fontWeight: 600 }}>Invalid file</p>
			</div>
		);
	}
	const [frameData, setFrameData] = useState<TFrameProps>();
	const [loading, setLoading] = useState(false);
	const [currentFileIndex, setCurrentFileIndex] = useState(0);
	const [fileList, setFileList] = useState<string[]>([]);
	const [fileNameList, setFileNameList] = useState<string[]>([]);

	useEffect(() => {
		if (Array.isArray(file)) {
			setFileList(file);
			setCurrentFileIndex(0);
		} else if (typeof file === 'string') {
			setFileList([file]);
			setCurrentFileIndex(0);
		} else {
			setFileList([]);
		}

		if (tenFile) {
			if (Array.isArray(tenFile)) {
				setFileNameList(tenFile);
			} else {
				setFileNameList([tenFile]);
			}
		} else {
			setFileNameList([]);
		}
	}, [file, tenFile]);

	const getFileExtension = (url: string) => {
		const cleanUrl = url.split('?')[0].split('#')[0];
		const arr = cleanUrl.split('.');
		return arr.length > 1 ? arr.at(-1)!.toLowerCase() : '';
	};

	const getProxiedFileUrl = (url: string) => {
		if (!url || url.startsWith('blob:') || url.startsWith('data:')) return url;
		try {
			const parsedUrl = new URL(url, window.location.origin);
			parsedUrl.searchParams.set('proxy', '1');
			return parsedUrl.toString();
		} catch {
			return url.includes('?') ? `${url}&proxy=1` : `${url}?proxy=1`;
		}
	};

	const getIframeSrc = (type: EDinhDangFile, fileUrl?: string) => {
		if (isLocalObjectUrl(fileUrl)) {
			return type === EDinhDangFile.PDF || type === EDinhDangFile.IMAGE ? fileUrl : undefined;
		}

		const safeFileUrl = getSafeHref(fileUrl);
		if (!safeFileUrl) return undefined;
		if (type === EDinhDangFile.PDF || type === EDinhDangFile.IMAGE) {
			return safeFileUrl;
		}

		const officeFileType = [EDinhDangFile.WORD, EDinhDangFile.EXCEL, EDinhDangFile.POWERPOINT];
		if (type && officeFileType.includes(type)) {
			return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(safeFileUrl)}`;
		}
		return undefined;
	};

	const getFileDataFromUrl = async (srcUrl: string) => {
		const idFile = isFileId ? srcUrl : undefined; // srcUrl.split('/').at(-2);
		const frame: TFrameProps = {
			url: srcUrl,
			type: EDinhDangFile.UNKNOWN,
		};

		setLoading(true);
		try {
			// Nếu có thông tin id file thì get thông tin chi tiết
			if (idFile) {
				const result = await getFileInfo(idFile, ip);
				const fileInfo: IFileInfo = result?.data?.data;
				const fileRouteBase = getFileRouteBase(ip);
				frame.url = getProxiedFileUrl(
					fileInfo?.url ??
						(!isFileId ? srcUrl : `${fileRouteBase}/${idFile}/${encodeURIComponent(fileInfo?.name ?? 'file')}`),
				);
				frame.name = fileInfo?.name;

				// Mapping { mimetype : "application/vnd.openxmlformats-officedocument.wordprocessingml.document"} sang EDinhDangFile
				frame.type =
					getFileType(fileInfo?.mimetype ? fileInfo.mimetype : (getFileExtension(frame.url) ?? '')) ||
					EDinhDangFile.UNKNOWN;
			} else {
				frame.url = getProxiedFileUrl(srcUrl);
				// blob:/data: không chứa phần mở rộng => phải đoán kiểu file theo tên gốc của file vừa chọn
				const localName = isLocalObjectUrl(srcUrl) ? fileNameList[currentFileIndex] : undefined;
				frame.type = getFileType(getFileExtension(localName || srcUrl) ?? '') || EDinhDangFile.UNKNOWN;
				if (localName) frame.name = localName;
			}

			// Chỉ PDF mới cần buffer (PDFViewerV2). Ảnh do AuthImage tự tải kèm token, tải ở đây sẽ gọi API 2 lần.
			// File local đã nằm sẵn trong trình duyệt, gọi lại qua axios (kèm token) chỉ gây lỗi.
			if (isPrivate && frame.type === EDinhDangFile.PDF && !isLocalObjectUrl(frame.url)) {
				// Nếu là file riêng tư thì phải lấy src có token mới xem được
				frame.data = (await getFileContent(frame.url))?.data;
			}

			// Fill other props
			if (frame.url && !frame.name) frame.name = getNameFile(frame.url);
			frame.src = getIframeSrc(frame.type, frame.url);
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
		return frame;
	};

	useEffect(() => {
		const fetchFileType = async () => {
			if (fileList.length > 0) {
				const res = await getFileDataFromUrl(fileList[currentFileIndex]);
				setFrameData(res);
			}
		};

		fetchFileType();
	}, [fileList, fileNameList, currentFileIndex]);

	/** Trình xem online chỉ phục vụ hiển thị, tải trực tiếp sẽ bị CORS chặn */
	const isViewerOnlyUrl = (url: string): boolean => {
		const blockedSources = ['view.officeapps.live.com', 'docs.google.com/document'];
		return blockedSources.some((domain) => url.includes(domain));
	};

	const handleDownloadOrView = async () => {
		if (!frameData?.url) return;

		// openSafeUrl chặn blob:/data: nên file local phải đọc thẳng từ object URL
		if (isLocalObjectUrl(frameData.url)) {
			try {
				const response = await fetch(frameData.url);
				fileDownload(await response.blob(), frameData.name || getNameFile(frameData.url));
			} catch (error) {
				console.error('Error downloading file:', error);
			}
			return;
		}

		if (isViewerOnlyUrl(frameData.url)) {
			openSafeUrl(frameData.url);
			return;
		}

		// Tải qua axios để giữ token, URL proxy của gateway không dùng được ở tab mới
		try {
			const response = await axios.get(frameData.url, {
				responseType: 'blob',
			});

			fileDownload(response.data, frameData.name || getNameFile(frameData.url));
		} catch (error) {
			console.error('Error downloading file:', error);
			openSafeUrl(frameData.url);
		}
	};

	const handleCopy = () => {
		if (frameData?.url) {
			navigator.clipboard
				.writeText(frameData?.url)
				.then(() => {
					toast.success(intl.formatMessage({ id: 'global.previewfile.message.saochep' }));
				})
				.catch((error) => {
					console.error(error);
				});
		}
	};

	const handlePrev = () => {
		if (currentFileIndex > 0) {
			setCurrentFileIndex(currentFileIndex - 1);
		}
	};

	const handleNext = () => {
		if (currentFileIndex < fileList.length - 1) {
			setCurrentFileIndex(currentFileIndex + 1);
		}
	};

	const getCurrentFileName = (): string => {
		if (fileNameList.length > 0 && fileNameList[currentFileIndex]) {
			return fileNameList[currentFileIndex];
		}
		if (typeof tenFile === 'string') {
			return tenFile;
		}
		return frameData?.name ?? '--';
	};

	// Chưa có frameData nghĩa là chưa biết kiểu file, hiển thị luôn "không hỗ trợ" sẽ nháy sai ở lần paint đầu
	const isPreparing = (Array.isArray(file) ? file.length > 0 : !!file) && !frameData;

	if (loading || isPreparing) {
		return (
			<div className='preview-loading' style={style}>
				<Spin size='large' />
			</div>
		);
	}

	if (!file) {
		return <EmptyState description='Không tồn tại dữ liệu tệp tin' />;
	}

	return (
		<div className='preview-container' style={{ ...style }}>
			<div className='preview-header'>
				<div className='preview-title'>
					<b>{getCurrentFileName()}</b>
				</div>

				<div className='preview-actions'>
					{fileList.length > 1 && (
						<div className='preview-pagination'>
							<ButtonExtend
								type='link'
								disabled={currentFileIndex === 0}
								icon={<IconChervolLeft />}
								onClick={handlePrev}
								tooltip={intl.formatMessage({
									id: 'global.previewfile.button.trentruoc',
									defaultMessage: 'File trước',
								})}
							/>
							<span>
								{currentFileIndex + 1} / {fileList.length}
							</span>
							<ButtonExtend
								type='link'
								disabled={currentFileIndex === fileList.length - 1}
								icon={<IconChervolRight />}
								onClick={handleNext}
								tooltip={intl.formatMessage({
									id: 'global.previewfile.button.tieptheo',
									defaultMessage: 'File tiếp theo',
								})}
							/>
						</div>
					)}

					<div className='preview-buttons'>
						{!!frameData?.url && (
							<>
								<ButtonExtend
									type='link'
									tooltip={intl.formatMessage({ id: 'global.previewfile.button.taixuong' })}
									icon={<IconDownload />}
									onClick={handleDownloadOrView}
								/>
								{/* <ButtonExtend
									type='link'
									tooltip={intl.formatMessage({ id: 'global.previewfile.button.saochep' })}
									icon={<Icon2SquareCopy />}
									onClick={handleCopy}
								/> */}
							</>
						)}

						{/* {!!frameData?.src && (
							<ButtonExtend
								type='link'
								tooltip={intl.formatMessage({ id: 'global.previewfile.button.morong' })}
								icon={<IconOpenrectagleToprightarrow />}
								onClick={() => window.open(frameData?.src, '_blank')}
							/>
						)} */}

						{children}
					</div>
				</div>
			</div>

			<div className='preview-content'>
				{frameData?.type === EDinhDangFile.PDF && frameData?.src ? (
					<div className='preview-pdf'>
						<PDFViewerV2
							data={frameData.data}
							url={!!frameData.data ? undefined : frameData?.src}
							{...props.viewerProps}
						/>
					</div>
				) : frameData?.type === EDinhDangFile.IMAGE && !!frameData?.src ? (
					<div className='preview-image-container'>
						<AuthImage
							isDetail
							src={frameData.src}
							alt={frameData.name}
							style={{
								maxWidth: '100%',
								maxHeight: '100%',
								objectFit: 'contain',
							}}
						/>
					</div>
				) : frameData?.type !== EDinhDangFile.UNKNOWN && !!frameData?.src ? (
					isPrivate || isLocalObjectUrl(frameData?.url) ? (
						<div className='preview-error'>
							<p>This document is protected and cannot be previewed directly via Office Online.</p>
							<Button variant='default' icon={<IconDownload />} onClick={handleDownloadOrView}>
								Download to view
							</Button>
						</div>
					) : (
						<iframe
							src={frameData.src}
							title={frameData.name || 'File preview'}
							className='preview-iframe'
							sandbox='allow-scripts allow-forms allow-popups allow-downloads'
							referrerPolicy='no-referrer'
						/>
					)
				) : (
					<div className='preview-error'>
						<p className='preview-error-message'>
							<strong>{intl.formatMessage({ id: 'global.previewfile.thongbao' })}</strong>
						</p>
						{!!frameData?.name && <p className='preview-error-url'>{frameData.name}</p>}
						{!!frameData?.url && (
							<ButtonExtend
								notHideText
								type='link'
								tooltip={intl.formatMessage({ id: 'global.previewfile.button.taixuong' })}
								icon={<IconMagnifyingglass />}
								onClick={handleDownloadOrView}
							>
								{intl.formatMessage({ id: 'global.previewfile.button.taixuong' })}
							</ButtonExtend>
						)}
					</div>
				)}
			</div>
		</div>
	);
};

export default PreviewFile;
