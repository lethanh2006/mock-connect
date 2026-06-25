import axios from '@/utils/axios';
import { ipTaiChinh } from '@/utils/ip';

export async function getExportBillUrl(identityCode: string) {
	const res = await axios.get(`${ipTaiChinh}/bill/export/${identityCode}`, {
		responseType: 'arraybuffer',
	});
	const blob = new Blob([res?.data], { type: 'application/pdf' });
	return URL.createObjectURL(blob);
}
