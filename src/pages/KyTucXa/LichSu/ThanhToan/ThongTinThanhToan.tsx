import { Descriptions, Tag } from "antd";
import { useIntl } from "umi";

const ThongTinThanhToanKTX = () => {
    const intl = useIntl();
    
    return (
        <>
            <Descriptions column={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 2 }} bordered size="small" labelStyle={{ width: '200px', fontWeight: 500, background: '#fafafa' }} contentStyle={{ background: '#fff' }}>
                <Descriptions.Item label={intl.formatMessage({ id: 'kytucxa.payment.phase' })}>
                    <span></span>
                </Descriptions.Item>
                <Descriptions.Item label={intl.formatMessage({ id: 'kytucxa.payment.time' })}>
                    <span></span>
                </Descriptions.Item>
                <Descriptions.Item label={intl.formatMessage({ id: 'kytucxa.payment.status' })}>
                    <Tag></Tag>
                </Descriptions.Item>
                <Descriptions.Item label={intl.formatMessage({ id: 'kytucxa.payment.payer' })}>
                     <span></span>
                </Descriptions.Item>
                <Descriptions.Item label={intl.formatMessage({ id: 'kytucxa.payment.totalAmount' })}>
                    <span></span>
                </Descriptions.Item>
                <Descriptions.Item label={intl.formatMessage({ id: 'kytucxa.payment.discountAmount' })}>
                    <span></span>
                </Descriptions.Item>
                <Descriptions.Item label={intl.formatMessage({ id: 'kytucxa.payment.paidAmount' })}>
                    <span></span>
                </Descriptions.Item>
                <Descriptions.Item label={intl.formatMessage({ id: 'kytucxa.payment.remainingAmount' })}>
                    <span></span>
                </Descriptions.Item>
            </Descriptions>
        </>
    );
};

export default ThongTinThanhToanKTX;