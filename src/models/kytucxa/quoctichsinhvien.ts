import useInitModel from '@/hooks/useInitModel';
import { ipCore } from '@/utils/ip';
import { DangKyKyTucXa } from '@/services/KyTucXa/typings';

export default () => {
    const objInit = useInitModel<DangKyKyTucXa.IQuocTich>('dm-quoc-tich', undefined, undefined, ipCore);

    return {
        ...objInit,
    };
};
