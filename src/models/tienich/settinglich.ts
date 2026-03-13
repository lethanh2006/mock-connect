import useInitModel from '@/hooks/useInitModel';
import { postMeSettingLich, putMeSettingLich } from '@/services/TienIch/SettingLich';
import type { SettingLich } from '@/services/TienIch/SettingLich/typing';
import { message } from 'antd';

export default () => {
	const objInit = useInitModel<SettingLich.IRecord>('setting-lich');
	const { getModel, setRecord, formSubmiting, setFormSubmiting, setVisibleForm } = objInit;

	const getSettingLich = () => {
		getModel(undefined, undefined, undefined, undefined, undefined, 'me')?.then((rec) => setRecord(rec[0] ?? {}));
	};

	const postMeSettingLichModel = async (
		payload: { danhSachSettingLich: SettingLich.TDanhSachSettingLich[] },
		getData?: () => void,
	) => {
		if (formSubmiting) return Promise.reject('Form submiting');
		setFormSubmiting(true);

		try {
			const res = await postMeSettingLich(payload);
			message.success('Lưu thành công');

			if (getData) getData();
			else getSettingLich();

			setVisibleForm(false);
			return res.data?.data;
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
			const res = await putMeSettingLich(id, payload);
			message.success('Lưu thành công');

			if (getData) getData();
			else getSettingLich();

			setVisibleForm(false);
			return res.data?.data;
		} catch (err) {
			return Promise.reject(err);
		} finally {
			setFormSubmiting(false);
		}
	};

	return {
		...objInit,
		getSettingLich,
		postMeSettingLichModel,
		putMeSettingLichModel,
	};
};
