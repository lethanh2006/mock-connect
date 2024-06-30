import { EOperatorType } from '@/components/Table/constant';
import useInitModel from '@/hooks/useInitModel';
import type { KhoaNganh } from '@/services/DaoTao/KhoaNganh/typing';
import {
	getMyKhoaNganh,
	getThongTinSinhVien,
	getThongTinSinhVienBySsoId,
	putLyLichMe,
} from '@/services/DaoTao/SinhVien';
import { type SinhVien } from '@/services/DaoTao/SinhVien/typings';
import { ipDaoTao } from '@/utils/ip';
import { message } from 'antd';
import type { AxiosResponse } from 'axios';
import _ from 'lodash';
import { useState } from 'react';

export default () => {
	const objInit = useInitModel<SinhVien.IRecord>('sinh-vien', undefined, undefined, ipDaoTao);
	const { setLoading, setRecord, getService, setDanhSach } = objInit;
	const [khoaNganhMe, setKhoaNganhMe] = useState<KhoaNganh.TMyKhoaNganh>();
	const [maKhoaNganh, setMaKhoaNganh] = useState<string>();
	const [danhSachAllSinhVien, setDanhSachAllSinhVien] = useState<SinhVien.IRecord[]>([]);

	const getThongTinSinhVienBySsoIdModel = async (ssoId: string): Promise<SinhVien.IRecord | undefined> => {
		if (!ssoId) return;
		setLoading(true);
		try {
			const response = await getThongTinSinhVienBySsoId(ssoId);
			setRecord(response?.data?.data ?? null);
			return response?.data?.data;
		} catch (er) {
			return Promise.reject(er);
		} finally {
			setLoading(false);
		}
	};

	const getThongTinCuaToiModel = async (): Promise<SinhVien.IRecord> => {
		setLoading(true);
		try {
			const response = await getThongTinSinhVien();
			setRecord(response?.data?.data ?? null);
			return response?.data?.data;
		} catch (er) {
			return Promise.reject(er);
		} finally {
			setLoading(false);
		}
	};

	const putLyLichMeModel = async (payload: any, getData?: any) => {
		setLoading(true);
		await putLyLichMe(payload);
		message.success('Cập nhật thành công');
		if (getData) getData();
		setLoading(false);
	};

	const getKhoaNganhMeModel = async (): Promise<KhoaNganh.TMyKhoaNganh> => {
		setLoading(true);
		try {
			const response = await getMyKhoaNganh();
			setKhoaNganhMe(response?.data?.data ?? null);
			setMaKhoaNganh(response?.data?.data?.khoaNganhChinh?.ma);
			return response?.data?.data;
		} catch (er) {
			return Promise.reject(er);
		} finally {
			setLoading(false);
		}
	};

	const searchSinhVienModel = async (keyword: string): Promise<SinhVien.IRecord[]> => {
		setLoading(true);
		try {
			const payloads = [
				{
					page: 1,
					limit: 20,
					filters: [{ active: true, field: 'ma', values: [keyword], operator: EOperatorType.CONTAIN }],
				},
				{
					page: 1,
					limit: 20,
					filters: [{ active: true, field: 'ten', values: [keyword], operator: EOperatorType.CONTAIN }],
				},
			];
			const responses = await Promise.allSettled(payloads.map((payload) => getService(payload, 'page')));
			const data = (
				responses.filter((item) => item.status === 'fulfilled') as PromiseFulfilledResult<AxiosResponse<any>>[]
			).map((item) => item.value.data?.data?.result);
			const flatData: SinhVien.IRecord[] = data.flat();
			const uniqData = _.uniqBy(flatData, (item) => item.ssoId);
			setDanhSach(uniqData);

			return uniqData;
		} catch (er) {
			return Promise.reject(er);
		} finally {
			setLoading(false);
		}
	};

	return {
		danhSachAllSinhVien,
		setDanhSachAllSinhVien,
		searchSinhVienModel,
		getThongTinSinhVienBySsoIdModel,
		getThongTinCuaToiModel,
		khoaNganhMe,
		getKhoaNganhMeModel,
		maKhoaNganh,
		setMaKhoaNganh,
		putLyLichMeModel,
		...objInit,
	};
};
