export enum EDKDTCongNo {
	DU = 'Đủ',
	CHUA_DU = 'Chưa đủ',
	MIEN = 'Miễn',
}

export const colorDKDTCongNo: Record<EDKDTCongNo, string> = {
	[EDKDTCongNo.DU]: 'green',
	[EDKDTCongNo.CHUA_DU]: 'orange',
	[EDKDTCongNo.MIEN]: 'purple',
};

export enum EDKDTKetQuaHocTap {
	CHUA_DUYET = 'Chưa duyệt',
	DAT = 'Đạt',
	KHONG_DAT = 'Không đạt',
}

export const colorDKDTKetQuaHocTap: Record<EDKDTKetQuaHocTap, string> = {
	[EDKDTKetQuaHocTap.CHUA_DUYET]: 'orange',
	[EDKDTKetQuaHocTap.DAT]: 'green',
	[EDKDTKetQuaHocTap.KHONG_DAT]: 'red',
};

export enum ETrangThaiThi {
	CHUA_DUYET = 'Chưa duyệt',
	DU_DIEU_KIEN = 'Đủ điều kiện',
	KHONG_DU = 'Không đủ điều kiện',
	HOAN_THI = 'Hoãn thi',
}

export const colorTrangThaiThi: Record<ETrangThaiThi, string> = {
	[ETrangThaiThi.CHUA_DUYET]: 'default',
	[ETrangThaiThi.DU_DIEU_KIEN]: 'green',
	[ETrangThaiThi.KHONG_DU]: 'red',
	[ETrangThaiThi.HOAN_THI]: 'orange',
};

export enum EDinhDangBaiThi {
	HTML = 'text/html',
	CSS = 'text/css',
	TEXT_PLAIN = 'text/plain',
	TEXT_CSV = 'text/csv',
	JSON = 'application/json',
	JS = 'application/javascript',
	XML = 'application/xml',
	PDF = 'application/pdf',
	ZIP = 'application/zip',
	GZIP = 'application/gzip',
	JPEG = 'image/jpeg',
	PNG = 'image/png',
	GIF = 'image/gif',
	WEBP = 'image/webp',
	AUDIO_MPEG = 'audio/mpeg',
	AUDIO_WAV = 'audio/wav',
	VIDEO_MP4 = 'video/mp4',
	VIDEO_MPEG = 'video/mpeg',
	OGG = 'application/ogg',
	FORM_DATA = 'multipart/form-data',
}

export const mapNameDinhDangBaiThi: Record<EDinhDangBaiThi, string> = {
	[EDinhDangBaiThi.HTML]: 'HTML',
	[EDinhDangBaiThi.CSS]: 'CSS',
	[EDinhDangBaiThi.TEXT_PLAIN]: 'Văn bản thuần',
	[EDinhDangBaiThi.TEXT_CSV]: 'CSV',
	[EDinhDangBaiThi.JSON]: 'JSON',
	[EDinhDangBaiThi.JS]: 'JavaScript',
	[EDinhDangBaiThi.XML]: 'XML',
	[EDinhDangBaiThi.PDF]: 'PDF',
	[EDinhDangBaiThi.JPEG]: 'JPEG',
	[EDinhDangBaiThi.PNG]: 'PNG',
	[EDinhDangBaiThi.GIF]: 'GIF',
	[EDinhDangBaiThi.WEBP]: 'WEBP',
	[EDinhDangBaiThi.AUDIO_MPEG]: 'MPEG âm thanh',
	[EDinhDangBaiThi.AUDIO_WAV]: 'WAV âm thanh',
	[EDinhDangBaiThi.VIDEO_MP4]: 'MP4 Video',
	[EDinhDangBaiThi.VIDEO_MPEG]: 'MPEG Video',
	[EDinhDangBaiThi.ZIP]: 'ZIP tệp nén',
	[EDinhDangBaiThi.GZIP]: 'GZIP tệp nén',
	[EDinhDangBaiThi.OGG]: 'OGG',
	[EDinhDangBaiThi.FORM_DATA]: 'Dữ liệu biểu mẫu',
};
