import useInitModel from '@/hooks/useInitModel';
import { ipCore } from '@/utils/ip';
import { KyTucXa } from '@/services/KyTucXa/typings';

export default () => {
    const objInit = useInitModel<KyTucXa.IQuocTich>('dm-quoc-tich', undefined, undefined, ipCore);

    return {
        ...objInit,
    };
};
