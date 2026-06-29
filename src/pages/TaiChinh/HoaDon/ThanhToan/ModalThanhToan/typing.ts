import type { HoaDon } from '@/services/TaiChinh/HoaDon/typing';
import { KenhThanhToan } from '@/services/TaiChinh/KenhThanhToan/typing';

/** Payload redirect sau khi chon phuong thuc thanh toan */
export interface IPaymentPayload {
    invoiceId: string;
    orderId: string;
    transactionId: string;
    amount: number;
    paymentMethodCode: string;
    paymentMethodName: string;
}

/** Props cho ModalThanhToan */
export interface ModalThanhToanProps {
    visible: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    mode?: 'single' | 'multi';
    bills?: HoaDon.IRecord[];
}

/** Props cho PaymentMethodList */
export interface PaymentMethodListProps {
    methods: KenhThanhToan.IRecord[];
    selectedMethod: KenhThanhToan.IRecord | null;
    onChange: (method: KenhThanhToan.IRecord) => void;
    loading?: boolean;
}

/** Props cho PaymentDetail */
export interface PaymentDetailProps {
    bill?: HoaDon.IRecord;
    method: KenhThanhToan.IRecord;
    transactions: HoaDon.ITransaction[];
    invoiceCode: string;
    totalAmount: number;
    transactionFee?: number;
    loading?: boolean;
    mode: 'single' | 'multi';
    bills?: HoaDon.IRecord[];
}

/** Props cho InvoiceForm */
export interface InvoiceFormProps {
    userFullname: string;
    userCode: string;
    visible: boolean;
    form: any; // FormInstance<ThongTinHoaDon>
}

