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
    /** Số tiền muốn thanh toán ban đầu (VD: thanh toán 1 đợt trả góp), mặc định là số tiền còn lại của hóa đơn */
    initialAmount?: number;
    /** Không cho sửa số tiền thanh toán (VD: thanh toán 1 đợt trả góp thì số tiền phải cố định) */
    lockAmount?: boolean;
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
    initialAmount?: number;
    lockAmount?: boolean;
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
