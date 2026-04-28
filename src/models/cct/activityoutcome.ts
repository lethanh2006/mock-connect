import useInitModel from '@/hooks/useInitModel';
import {
	deleteActivity,
	getAnalyticsStudent,
	postActivityOutCome,
	thongKeActivityType,
	thongKeAttributes,
	thongKeLevels,
} from '@/services/CCT/ActivityOutcome';
import { ActivityOutCome } from '@/services/CCT/ActivityOutcome/typing';
import { EActivityCategory } from '@/services/CCT/constant';
import { ipCCT } from '@/utils/ip';
import { message } from 'antd';
import { useState } from 'react';

export default () => {
	const objInit = useInitModel<ActivityOutCome.IRecord>('activity-outcome', undefined, undefined, ipCCT);
	const { formSubmiting, setFormSubmiting } = objInit;
	const [loadingThongKe, setLoadingThongKe] = useState<boolean>(false);
	const [dataThongKe, setDataThongKe] = useState<ActivityOutCome.IAnalyticsStudent>();

	const [loadingLevels, setLoadingLevels] = useState<boolean>(false);
	const [dataThongKeLevels, setDataThongKeLevels] = useState<ActivityOutCome.IThongKeLevels[]>([]);
	const [loadingAttributes, setLoadingAttributes] = useState<boolean>(false);
	const [dataThongKeAttributes, setDataThongKeAttributes] = useState<ActivityOutCome.IThongKeAttributes[]>([]);
	const [loadingActivityType, setLoadingActivityType] = useState<boolean>(false);
	const [dataThongKeActivityType, setDataThongKeActivityType] = useState<ActivityOutCome.IThongKeAttributes[]>([]);

	const postActivityOutComeModel = async (
		idActivity: string,
		payLoad: {
			rolesId: string;
			levelsId: string;
			// answerId: string | null;
			reflection: string;
			evidenceFile: {
				name: string;
				file?: string[];
			}[];
			submitted: boolean;
		},
		getData?: () => void,
		messageText?: string,
	): Promise<ActivityOutCome.IRecord> => {
		if (formSubmiting) return Promise.reject('Form submiting');
		setFormSubmiting(true);
		try {
			const res = await postActivityOutCome(idActivity, payLoad);
			message.success(messageText ?? 'Lưu thành công');

			if (getData) getData();
			return res.data;
		} catch (er) {
			return Promise.reject(er);
		} finally {
			setFormSubmiting(false);
		}
	};

	const deleteActivityModel = async (
		idActivityOutCome: string,
		getData?: () => void,
		messageText?: string,
	): Promise<ActivityOutCome.IRecord> => {
		if (formSubmiting) return Promise.reject('Form submiting');
		setFormSubmiting(true);
		try {
			const res = await deleteActivity(idActivityOutCome);
			message.success(messageText ?? 'Xóa thành công');

			if (getData) getData();
			return res.data;
		} catch (er) {
			return Promise.reject(er);
		} finally {
			setFormSubmiting(false);
		}
	};

	const getAnalyticsStudentModel = async (
		activityCategory: EActivityCategory,
	): Promise<ActivityOutCome.IAnalyticsStudent> => {
		setLoadingThongKe(true);
		try {
			const res = await getAnalyticsStudent(activityCategory);
			setDataThongKe(res.data?.data);
			return res.data?.data;
		} catch (err) {
			return Promise.reject(err);
		} finally {
			setLoadingThongKe(false);
		}
	};

	const thongKeLevelsModel = async (): Promise<ActivityOutCome.IThongKeLevels> => {
		setLoadingLevels(true);
		try {
			const res = await thongKeLevels();
			setDataThongKeLevels(res.data?.data?.levels);
			return res.data?.data?.levels;
		} catch (err) {
			return Promise.reject(err);
		} finally {
			setLoadingLevels(false);
		}
	};

	const thongKeAttributesModel = async (): Promise<ActivityOutCome.IThongKeAttributes> => {
		setLoadingAttributes(true);
		try {
			const res = await thongKeAttributes();
			setDataThongKeAttributes(res.data?.data?.attributes);
			return res.data?.data?.levels;
		} catch (err) {
			return Promise.reject(err);
		} finally {
			setLoadingAttributes(false);
		}
	};

	const thongKeActivityTypeModel = async (): Promise<ActivityOutCome.IThongKeAttributes> => {
		setLoadingActivityType(true);
		try {
			const res = await thongKeActivityType();
			setDataThongKeActivityType(res.data?.data?.activityTypes);
			return res.data?.data?.levels;
		} catch (err) {
			return Promise.reject(err);
		} finally {
			setLoadingActivityType(false);
		}
	};

	return {
		...objInit,
		loadingThongKe,
		dataThongKe,
		postActivityOutComeModel,
		deleteActivityModel,
		getAnalyticsStudentModel,
		loadingLevels,
		dataThongKeLevels,
		thongKeLevelsModel,
		loadingAttributes,
		dataThongKeAttributes,
		thongKeAttributesModel,
		loadingActivityType,
		dataThongKeActivityType,
		thongKeActivityTypeModel,
	};
};
