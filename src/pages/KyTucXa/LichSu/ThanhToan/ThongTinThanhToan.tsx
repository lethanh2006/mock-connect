import { Descriptions, Tag } from "antd";
import { useIntl, useModel } from "umi";
import dayjs from '@/utils/dayjs';
import { EMaTrangThaiThanhToan } from '@/services/TaiChinh/constant';

const ThongTinThanhToanKTX = () => {
    const intl = useIntl();
    const { record: bill } = useModel('taichinh.hoadon');
    const { danhSach: billItems } = useModel('taichinh.hoadonchitiet');

    const discountAmount = billItems?.reduce((acc, item) => acc + (item.amountDiscount || 0), 0) ?? 0;
    const paidAmount = billItems?.reduce((acc, item) => acc + (item.amountPaid || 0), 0) ?? 0;
    const remainingAmount = billItems?.reduce((acc, item) => acc + (item.amountRemaining || 0), 0) ?? 0;
    
    return (
        <>
            <Descriptions column={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 2 }} bordered size="small" labelStyle={{ width: '200px', fontWeight: 500, background: '#fafafa' }} contentStyle={{ background: '#fff' }}>
                <Descriptions.Item label={intl.formatMessage({ id: 'kytucxa.payment.phase' })}>
                    <span>{bill?.name || (bill?.dotThu as any)?.ten || '---'}</span>
                </Descriptions.Item>
                <Descriptions.Item label={intl.formatMessage({ id: 'kytucxa.payment.time' })}>
                    <span>{(bill as any)?.createdAt ? dayjs((bill as any).createdAt).format('DD/MM/YYYY HH:mm') : '---'}</span>
                </Descriptions.Item>
                <Descriptions.Item label={intl.formatMessage({ id: 'kytucxa.payment.status' })}>
                    <Tag color={bill?.status === EMaTrangThaiThanhToan.DA_THANH_TOAN_DU ? 'success' : 'warning'}>
                        {bill?.status === EMaTrangThaiThanhToan.DA_THANH_TOAN_DU ? 'Đã thanh toán' : 'Chưa thanh toán'}
                    </Tag>
                </Descriptions.Item>
                <Descriptions.Item label={intl.formatMessage({ id: 'kytucxa.payment.payer' })}>
                     <span>{bill?.userFullname || '---'}</span>
                </Descriptions.Item>
                <Descriptions.Item label={intl.formatMessage({ id: 'kytucxa.payment.totalAmount' })}>
                    <span>{bill?.soTienThue?.toLocaleString('vi-VN') || 0} VND</span>
                </Descriptions.Item>
                <Descriptions.Item label={intl.formatMessage({ id: 'kytucxa.payment.discountAmount' })}>
                    <span>{discountAmount?.toLocaleString('vi-VN') || 0} VND</span>
                </Descriptions.Item>
                <Descriptions.Item label={intl.formatMessage({ id: 'kytucxa.payment.paidAmount' })}>
                    <span>{paidAmount?.toLocaleString('vi-VN') || 0} VND</span>
                </Descriptions.Item>
                <Descriptions.Item label={intl.formatMessage({ id: 'kytucxa.payment.remainingAmount' })}>
                    <span>{remainingAmount?.toLocaleString('vi-VN') || 0} VND</span>
                </Descriptions.Item>
            </Descriptions>
        </>
    );
};

export default ThongTinThanhToanKTX;