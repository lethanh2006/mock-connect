import useInitModel from '@/hooks/useInitModel';
import type { SettingLich } from '@/services/TienIch/SettingLich/typing';
import { message } from 'antd';
import { useState } from 'react';

const SETTING_LICH_STORAGE_KEY = 'setting-lich';

const getSettingLichStorage = () => {
	try {
		return JSON.parse(localStorage.getItem(SETTING_LICH_STORAGE_KEY) || 'null') as SettingLich.IRecord | undefined;
	} catch {
		return undefined;
	}
};

export default () => {
	const objInit = useInitModel<SettingLich.IRecord>('setting-lich');
	const { record, setRecord, formSubmiting, setFormSubmiting, setVisibleForm } = objInit;
	const [recSettingLocal, setRecSettingLocal] = useState<SettingLich.IRecord | undefined>(getSettingLichStorage);

	const setRecordSettingLich = (rec?: SettingLich.IRecord) => {
		setRecord(rec);
		setRecSettingLocal(rec);

		if (rec?.danhSachSettingLich) {
			localStorage.setItem(SETTING_LICH_STORAGE_KEY, JSON.stringify(rec));
		} else {
			localStorage.removeItem(SETTING_LICH_STORAGE_KEY);
		}
	};

	const getSettingLich = () => {
		// Không gọi API, chỉ lấy cấu hình màu lịch đã lưu ở localStorage.
		setRecordSettingLich(getSettingLichStorage() ?? recSettingLocal);
	};

	const postMeSettingLichModel = async (
		payload: { danhSachSettingLich: SettingLich.TDanhSachSettingLich[] },
		getData?: () => void,
	) => {
		if (formSubmiting) return Promise.reject('Form submiting');
		setFormSubmiting(true);

		try {
			// const res = await postMeSettingLich(payload);
			message.success('Lưu thành công');
			setRecordSettingLich({
				...(record ?? recSettingLocal),
				// ...(res.data?.data ?? {}),
				...payload,
			} as SettingLich.IRecord);

			if (getData) getData();
			else getSettingLich();

			setVisibleForm(false);
			// return res.data?.data;
		} catch (err) {
			return Promise.reject(err);
		} finally {
			setFormSubmiting(false);
		}
	};

	const putMeSettingLichModel = async (
		id: string,
		payload: { danhSachSettingLich: SettingLich.TDanhSachSettingLich[] },
		getData?: () => void,
	) => {
		if (formSubmiting) return Promise.reject('Form submiting');
		setFormSubmiting(true);

		try {
			// const res = await putMeSettingLich(id, payload);
			message.success('Lưu thành công');
			setRecordSettingLich({
				...(record ?? recSettingLocal),
				...payload,
			} as SettingLich.IRecord);

			if (getData) getData();
			else getSettingLich();

			setVisibleForm(false);
			// return res.data?.data;
		} catch (err) {
			return Promise.reject(err);
		} finally {
			setFormSubmiting(false);
		}
	};

	return {
		...objInit,
		record: record ?? recSettingLocal,
		setRecord: setRecordSettingLich,
		recSettingLocal,
		setRecSettingLocal: setRecordSettingLich,
		getSettingLich,
		postMeSettingLichModel,
		putMeSettingLichModel,
	};
};
