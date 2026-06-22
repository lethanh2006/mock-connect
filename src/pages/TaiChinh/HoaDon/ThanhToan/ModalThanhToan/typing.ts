import type { HoaDon } from '@/services/TaiChinh/HoaDon/typing';
import { KenhThanhToan } from '@/services/TaiChinh/KenhThanhToan/typing';

/** Payload redirect sau khi chọn phương thức thanh toán */
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
    bill?: HoaDon.IRecord
    method: KenhThanhToan.IRecord;
    transactions: HoaDon.ITransaction[];
    invoiceCode: string;
    totalAmount: number;
    transactionFee?: number;
    loading?: boolean;
}