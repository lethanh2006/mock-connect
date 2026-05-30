import useInitModel from '@/hooks/useInitModel';
import type { DangKyKyTucXa } from '@/services/KyTucXa/typings';
import { ipCsvc } from '@/utils/ip';

export default () => {
    const objInit = useInitModel<DangKyKyTucXa.IKhoanThuKTX>('tai-chinh-csvc', undefined, undefined, ipCsvc);

    return {
        ...objInit,
    };
};
