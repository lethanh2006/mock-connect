import useInitModel from '@/hooks/useInitModel';
import { KenhThanhToan } from '@/services/TaiChinh/KenhThanhToan/typing';
import { ipTaiChinh } from '@/utils/ip';


export default () => {
    const objInit = useInitModel<KenhThanhToan.IRecord>('kenh-thanh-toan', undefined, undefined, ipTaiChinh);

    return {
        ...objInit
    }
}