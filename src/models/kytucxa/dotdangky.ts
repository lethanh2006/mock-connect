import useInitModel from '@/hooks/useInitModel';
import { ipCsvc } from '@/utils/ip';
import { KyTucXa } from '@/services/KyTucXa/typings';

export default () => {
    const objInit = useInitModel<KyTucXa.IDotDangKy>('dot-dang-ky-ky-tuc-xa/me', undefined, undefined, ipCsvc);

    return {
        ...objInit,
    };
};
