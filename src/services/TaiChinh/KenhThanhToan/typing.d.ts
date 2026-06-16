import { ELoaiHinhThucThanhToan } from "@/services/TaiChinh/HinhThucThanhToan/constant";

declare module KenhThanhToan {
    export interface IRecord {
        _id: string;
        tenNganHang: string;
        maNganHang: string;
        maNganHangVNPay: string;
        soTaiKhoanThanhToanCoDinh: string;
        linkQR: string;
        huongDanThanhToan: string;
        tienToSTK: string;
        isMacDinh: boolean;

        loaiKenhThanhToan: ELoaiHinhThucThanhToan;
        phuongThucThanhToan: 'ONEPAY' | 'NGAN_HANG';
        trangThai: string;

        active: boolean;
        activeLePhiThanhToan: boolean;
        loaiLePhiThanhToanMacDinh: 'PHAN_TRAM' | 'TIEN';
        giaTriLePhiThanhToanMacDinh: number;
        moTaLePhiThanhToan: string;
        code: string;
        icon?: string;
        kyHieuBank: string;
        serviceProfileBidv: string;
        signaturePublicKey: string;
        apiUrl: string;
        namePrefix: string;
        clientId: string;
        shbConsumerKey: string;
        shbPartnerTaxNo: string;
        shbSourceAccountNo: string;
        shbSaleTypeCd: string;
        shbProvinceCd: string;
        username: string;
        mbChannel: string;
        mbLoaiGiaoDich: string;
        appId: string;
        vcbServiceCode: string;
        urlBankAuth: string;
        urlBankTransInquest: string;
        urlBankInvoice: string;
        productCode: string;
        onepayPaymentUrl: string;
        onepayQueryUrl: string;
        onepayVersion: string;
        onepayCurrency: string;
        onepayLocale: string;
        onepayBinVnMerchant: string;
        onepayBinVnAccessCode: string;
        onepayBinForeignMerchant: string;
        onepayBinForeignAccessCode: string;

        createdAt: string;
        updatedAt: string;
    }
}