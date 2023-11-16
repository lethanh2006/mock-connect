import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';
import {LoaiDefaultValue} from "@/services/QuyTrinh/MauDon/constants";

export async function getDataDefault(loaiDefaultValue: LoaiDefaultValue) {
	return axios.get(`${ip3}/form-dong/default-value/${loaiDefaultValue}`);
}
