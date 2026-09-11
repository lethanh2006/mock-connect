import {
	IconCalendar,
	IconShieldCheck,
	IconXmarkCircle,
	IconPencil01,
	IconShorttext,
	IconShieldInfo,
	IconPeople,
	IconShippingbox,
	Icon4SquareGrid,
	Icon3Dot3Line,
} from '@/components/Icons';
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
		icon: <IconShieldCheck />,
		primary: true,
	},
	{
		action: EKetQuaThamDinh.YEU_CAU_CHINH_SUA,
		labelId: 'syllabus.list.yeuCauChinhSua',
		icon: <IconPencil01 />,
	},
	{
		action: EKetQuaThamDinh.TU_CHOI,
		labelId: 'syllabus.list.reject',
		icon: <IconXmarkCircle />,
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
		icon: <Icon4SquareGrid />,
	},
	{
		tieuDe: 'Course Overview',
		loai: LoaiNoiDungGiaoAn.COURSE,
		icon: <IconShieldInfo />,
	},
	{
		tieuDe: 'Faculty and Teaching Assistant Information',
		loai: LoaiNoiDungGiaoAn.PROVIDER,
		icon: <IconShorttext />,
	},
	{
		tieuDe: 'Learning Framework',
		loai: LoaiNoiDungGiaoAn.PLO_CLO,
		icon: <Icon3Dot3Line />,
	},
	{
		tieuDe: 'Essential Logistics',
		icon: <IconShippingbox />,
	},
	{
		tieuDe: 'Course Schedule',
		icon: <IconCalendar />,
	},
	{
		tieuDe: 'Assessment',
		icon: <IconShieldCheck />,
	},
	{
		tieuDe: 'Course Expectations',
		icon: <IconPeople />,
	},
	{
		tieuDe: 'Institutional Policies',
		icon: <IconShieldCheck />,
	},
].map((item) => ({
	...item,
	loai: isTemplateSavedAsDefaultLoai(item.tieuDe) ? LoaiNoiDungGiaoAn.DEFAULT : LoaiNoiDungGiaoAn.DEFAULT,
}));
