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

/** PayCollect response từ API tạo thanh toán */
export interface IPaymentCollect {
    provider: string;
    type: string;
    invoiceId: string;
    invoiceReference: string;
    userReference: string;
    accountNumber: string;
    bankName: string;
    swiftCode: string;
    qrData: string;
    qrImage: string;
    amount: number;
    feeAmount: number;
    totalAmount: number;
    status: string;
    expiredAt: string;
}

/** Response từ postTransactionMePayment */
export interface IPaymentResponse {
    transactionPayments: Array<{ identityCode: string; status: string }>;
    amount: number;
    soTienLePhiThanhToan: number;
    tongTienThucTra: number;
    paymentCollect?: IPaymentCollect;
    payUrl?: string;
}

