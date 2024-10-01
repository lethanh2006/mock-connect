import type { CommonTopicType, EPhamViChuDe } from './constant';

declare module TinTuc {
	export interface IRecord {
		hinhThucDaoTaoId: number;
		danhSachVaiTro: string[];
		doiTuong: 'Tất cả' | 'Vai trò';
		_id: string;
		tieuDe: string;
		idTopic: string;
		moTa: string;
		urlAnhDaiDien: string;
		noiDung: string;
		ngayDang: string;
		nguoiDang: {
			email?: string; // 'admin@administrator.com';
			hoTen: string; // 'Administrator';
			systemRole: string; // 'Admin';
			username: string; // 'admin';
			_id: string; // '649a63c2e42a64cb859874d7';
		};

		chuDe: IChuDe;
	}

	export interface IChuDe {
		phamVi: EPhamViChuDe;
		_id: string;
		name: string;
		type: CommonTopicType;
		order: number;
		hinhThucDaoTaoId: number;

		isTinTucWP: boolean;
		linkWP: string;
		idCategoryWp: number;
	}
}

declare module TinTucWP {
	export interface IRecord {
		id: number;
		date: string;
		slug: string;
		type: string;
		link: string;
		title?: {
			rendered: string;
		};
		excerpt?: {
			rendered: string;
		};
		content?: {
			rendered: string;
		};
		author: 1;
		featured_media: 2928;
		acf: [];
		_embedded?: {
			'wp:featuredmedia'?: [
				{
					id: 2928;
					date: string;
					slug: string;
					type: string;
					link: string;
					title: {
						rendered: string;
					};
					author: 1;
					acf: [];
					caption: {
						rendered: string;
					};
					alt_text: string;
					media_type: string;
					mime_type: string;
					media_details?: {
						width: 995;
						height: 990;
						file: string;
						filesize: 129793;
						sizes?: {
							medium?: {
								file: string;
								width: 300;
								height: 298;
								filesize: 16966;
								mime_type: string;
								source_url: string;
							};
							large?: {
								file: string;
								width: 1024;
								height: 1005;
								filesize: 97080;
								mime_type: string;
								source_url: string;
							};
							thumbnail?: {
								file: string;
								width: 150;
								height: 150;
								filesize: 6536;
								mime_type: string;
								source_url: string;
							};
							medium_large?: {
								file: string;
								width: 768;
								height: 764;
								filesize: 63500;
								mime_type: string;
								source_url: string;
							};
							full?: {
								file: string;
								width: 995;
								height: 990;
								mime_type: string;
								source_url: string;
							};
						};
						image_meta?: {
							aperture: string;
							credit: string;
							camera: string;
							caption: string;
							created_timestamp: string;
							copyright: string;
							focal_length: string;
							iso: string;
							shutter_speed: string;
							title: string;
							orientation: string;
							keywords: [];
						};
					};
					source_url: string;
					_links: {
						self: [
							{
								href: string;
							},
						];
						collection: [
							{
								href: string;
							},
						];
						about: [
							{
								href: string;
							},
						];
						author: [
							{
								embeddable: true;
								href: string;
							},
						];
						replies: [
							{
								embeddable: true;
								href: string;
							},
						];
					};
				},
			];
		};
	}
}
