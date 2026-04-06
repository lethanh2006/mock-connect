import useInitModel from '@/hooks/useInitModel';
import {
	getPhieuDkCtdtMe,
	getPhieuDkCtdtMeByDot,
	getPhieuMeDotHienTaiInit,
	putPhieuDkCtdtMe,
	submitPhieuDkCtdt
} from '@/services/DaoTao/PhieuDkyCTDT';
import { PhieuDkCtdt } from '@/services/DaoTao/PhieuDkyCTDT/typing';
import { ipDaoTao } from '@/utils/ip';
import { message } from 'antd';
import { useState } from 'react';
import { getIntl } from 'umi';

export default () => {
	const objInit = useInitModel<PhieuDkCtdt.UpdatePhieuDkCtdtMeDto>('phieu-dk-ctdt', undefined, undefined, ipDaoTao);
	const { setRecord, setLoading, setFormSubmiting } = objInit;
	const [phieuDangKyTheoDot, setPhieuDangKyTheoDot] = useState<PhieuDkCtdt.UpdatePhieuDkCtdtMeDto | null>(null);
	const fetchPhieuDangKyHienTai = async (dotId: string) => {
		setLoading(true);
		try {
			const response = await getPhieuMeDotHienTaiInit(dotId);
			const data = response?.data?.data;
			setRecord(data ?? null);
			return data;
		} catch (error) {
			return Promise.reject(error);
		} finally {
			setLoading(false);
		}
	};

	const fetchPhieuDangKyTheoDot = async (dotId: string) => {
		setLoading(true);
		try {
			const response = await getPhieuDkCtdtMeByDot(dotId);
			const data = response?.data?.data;
			setPhieuDangKyTheoDot(data);
			return data;
		} catch (error) {
			return Promise.reject(error);
		} finally {
			setLoading(false);
		}
	};

	const fetchChiTietPhieuDangKy = async (phieuId: string) => {
		setLoading(true);
		try {
			const response = await getPhieuDkCtdtMe(phieuId);
			const data = response?.data?.data;
			setRecord(data);
			return data;
		} catch (error) {
			return Promise.reject(error);
		} finally {
			setLoading(false);
		}
	};

	const updatePhieuDangKy = async (phieuId: string, body?: Partial<PhieuDkCtdt.UpdatePhieuDkCtdtMeDto>) => {
		const intl = getIntl();
		setLoading(true);
		try {
			const res = await putPhieuDkCtdtMe(phieuId, body);
			setRecord(res?.data?.data ?? null);
			message.success(intl.formatMessage({ id: 'global.message.capnhatthanhcong' }));
			return res;
		} catch (error) {
			message.error(intl.formatMessage({ id: 'global.message.capnhatthatbai' }));
			return Promise.reject(error);
		} finally {
			setLoading(false);
		}
	};

	const submitPhieuDangKy = async (
		phieuId: string,
		body?: Partial<PhieuDkCtdt.UpdatePhieuDkCtdtMeDto>,
		onSuccess?: () => void,
	) => {
		const intl = getIntl();
		setFormSubmiting(true);
		try {
			await submitPhieuDkCtdt(phieuId, body);
			message.success(intl.formatMessage({ id: 'minor.button.submitSuccess' }));
			onSuccess?.();
		} catch (error: any) {
			const errorMessage =
				error?.response?.data?.message ||
				error?.message ||
				intl.formatMessage({ id: 'minor.button.submitError' });
			message.error(errorMessage);
			return Promise.reject(error);
		} finally {
			setFormSubmiting(false);
		}
	};

	return {
		...objInit,
		phieuDangKyTheoDot,
		fetchPhieuDangKyHienTai,
		fetchPhieuDangKyTheoDot,
		fetchChiTietPhieuDangKy,
		updatePhieuDangKy,
		submitPhieuDangKy,
	};
};
