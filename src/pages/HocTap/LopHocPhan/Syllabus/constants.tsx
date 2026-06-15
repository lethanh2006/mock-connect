import {
	AuditOutlined,
	CalendarOutlined,
	CheckCircleOutlined,
	CloseCircleOutlined,
	EditOutlined,
	FileTextOutlined,
	InboxOutlined,
	InfoCircleFilled,
	LayoutOutlined,
	OrderedListOutlined,
	SafetyCertificateOutlined,
	TeamOutlined,
} from '@ant-design/icons';
import type { ReactNode } from 'react';

import { EKetQuaThamDinh, LoaiNoiDungGiaoAn } from '@/services/DanhMucHeThong/Syllabus/constant';

export interface IThamDinhAction {
	action: EKetQuaThamDinh;
	labelId: string;
	icon: ReactNode;
	danger?: boolean;
	primary?: boolean;
}

export const THAM_DINH_ACTIONS: IThamDinhAction[] = [
	{
		action: EKetQuaThamDinh.DUYET,
		labelId: 'syllabus.assessment.chotThamDinh',
		icon: <CheckCircleOutlined />,
		primary: true,
	},
	{
		action: EKetQuaThamDinh.YEU_CAU_CHINH_SUA,
		labelId: 'syllabus.list.yeuCauChinhSua',
		icon: <EditOutlined />,
	},
	{
		action: EKetQuaThamDinh.TU_CHOI,
		labelId: 'syllabus.list.reject',
		icon: <CloseCircleOutlined />,
		danger: true,
	},
];

export const TEMPLATE_TITLES_SAVED_AS_DEFAULT_LOAI = [
	'Essential Logistics',
	'Course Schedule',
	'Assessment',
	'Course Expectations',
	'Institutional Policies',
];

export const isTemplateSavedAsDefaultLoai = (title: string) => TEMPLATE_TITLES_SAVED_AS_DEFAULT_LOAI.includes(title);

export const AVAILABLE_SECTION_TYPES = [
	{
		tieuDe: 'Header',
		loai: LoaiNoiDungGiaoAn.TITLE,
		icon: <LayoutOutlined />,
	},
	{
		tieuDe: 'Course Overview',
		loai: LoaiNoiDungGiaoAn.COURSE,
		icon: <InfoCircleFilled />,
	},
	{
		tieuDe: 'Faculty and Teaching Assistant Information',
		loai: LoaiNoiDungGiaoAn.PROVIDER,
		icon: <FileTextOutlined />,
	},
	{
		tieuDe: 'Learning Framework',
		loai: LoaiNoiDungGiaoAn.PLO_CLO,
		icon: <OrderedListOutlined />,
	},
	{
		tieuDe: 'Essential Logistics',
		icon: <InboxOutlined />,
	},
	{
		tieuDe: 'Course Schedule',
		icon: <CalendarOutlined />,
	},
	{
		tieuDe: 'Assessment',
		icon: <AuditOutlined />,
	},
	{
		tieuDe: 'Course Expectations',
		icon: <TeamOutlined />,
	},
	{
		tieuDe: 'Institutional Policies',
		icon: <SafetyCertificateOutlined />,
	},
].map((item) => ({
	...item,
	loai: isTemplateSavedAsDefaultLoai(item.tieuDe) ? LoaiNoiDungGiaoAn.DEFAULT : LoaiNoiDungGiaoAn.DEFAULT,
}));
