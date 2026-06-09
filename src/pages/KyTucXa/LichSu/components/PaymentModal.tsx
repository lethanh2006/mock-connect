import React, { useState, useEffect } from 'react';
import { Modal, Button, Row, Col, Tag, Result } from 'antd';
import { useModel } from 'umi';
import { ETrangThaiDuyet } from '@/services/KyTucXa/constant';
import { KyTucXa } from '@/services/KyTucXa/typings';
import { QrcodeOutlined } from '@ant-design/icons';

interface IPaymentModalProps {
    visible: boolean;
    onClose: () => void;
}

const PaymentModal: React.FC<IPaymentModalProps> = ({ visible, onClose }) => {
    const { record } = useModel('kytucxa.dangky');
    const { danhSach: danhSachKhoanThu } = useModel('kytucxa.khoanthu');
    const [step, setStep] = useState<'info' | 'qr'>('info');
    const [isGeneratingQR, setIsGeneratingQR] = useState(false);

    useEffect(() => {
        if (visible) {
            setStep('info');
            setIsGeneratingQR(false);
        }
    }, [visible]);

    if (!record) return null;

    const getPriceNumber = (maKhoanThu?: string) => {
        if (!maKhoanThu) return 0;
        const khoanThu = (danhSachKhoanThu as KyTucXa.IKhoanThu[])?.find(
            (item) => item.maMucThu === maKhoanThu
        );
        return khoanThu?.unitAmount || 0;
    };
    
    const getCurrency = (maKhoanThu?: string) => {
        if (!maKhoanThu) return 'VNĐ';
        const khoanThu = (danhSachKhoanThu as KyTucXa.IKhoanThu[])?.find(
            (item) => item.maMucThu === maKhoanThu
        );
        return khoanThu?.currency || 'VNĐ';
    };

    const pricePhong = getPriceNumber(record.phong?.maKhoanThuPhong);
    const priceCoc = getPriceNumber(record.phong?.maKhoanThuCoc);
    const currency = getCurrency(record.phong?.maKhoanThuPhong);

    const tongTienPhong = pricePhong > 0 ? `${pricePhong.toLocaleString('vi-VN')} ${currency}` : '-';
    const tongTienCoc = priceCoc > 0 ? `${priceCoc.toLocaleString('vi-VN')} ${currency}` : '-';
    const tongThanhTien = pricePhong + priceCoc;
    const tongThanhTienStr = tongThanhTien > 0 ? `${tongThanhTien.toLocaleString('vi-VN')} ${currency}` : '-';

    // Mock VietQR info
    const BANK_ID = 'MB'; 
    const ACCOUNT_NO = '9704229206854440175';
    const ACCOUNT_NAME = 'PHAM MINH DUC';
    
    const addInfo = encodeURIComponent(`Dorm payment ${record.nguoiTaoMa || record.nguoiTaoHoTen || 'SV'}`);

    const qrUrl = tongThanhTien > 0 
        ? `https://img.vietqr.io/image/${BANK_ID}-${ACCOUNT_NO}-compact2.png?amount=${tongThanhTien}&addInfo=${addInfo}&accountName=${encodeURIComponent(ACCOUNT_NAME)}`
        : '';

    // Mock Đợt và thời gian thu phí KTX
    const dotThu = "[UDU_D24] Dormitory fee collection for semester 2, academic year 2025-2026";
    const thoiGianThu = "01/02/2026 00:00 - 27/02/2026 23:45";
    
    let tagColor = 'default';
    let trangThaiDisplay = record.trangThaiDuyet;
    if (record.trangThaiDuyet === ETrangThaiDuyet.DA_THANH_TOAN) {
        tagColor = 'success';
        trangThaiDisplay = 'Renting';
    } else if (record.trangThaiDuyet === ETrangThaiDuyet.CHO_THANH_TOAN) {
        tagColor = 'processing';
        trangThaiDisplay = 'Pending';
    } else if (record.trangThaiDuyet === ETrangThaiDuyet.HUY) {
        tagColor = 'error';
        trangThaiDisplay = 'Expired';
    }

    const handlePayNow = () => {
        setIsGeneratingQR(true);
        setTimeout(() => {
            setIsGeneratingQR(false);
            setStep('qr');
        }, 1500);
    };

    const renderInfoGrid = () => (
        <div style={{ border: '1px solid #f0f0f0', borderRadius: 8, overflow: 'hidden', marginTop: 12 }}>
            <Row style={{ borderBottom: '1px solid #f0f0f0' }}>
                <Col span={5} style={{ padding: '16px 20px', background: '#fafafa', borderRight: '1px solid #f0f0f0', fontWeight: 500, display: 'flex', alignItems: 'center' }}>
                    Collection Batch
                </Col>
                <Col span={7} style={{ padding: '16px 20px', borderRight: '1px solid #f0f0f0', display: 'flex', alignItems: 'center' }}>
                    {dotThu}
                </Col>
                <Col span={5} style={{ padding: '16px 20px', background: '#fafafa', borderRight: '1px solid #f0f0f0', fontWeight: 500, display: 'flex', alignItems: 'center' }}>
                    Collection Time
                </Col>
                <Col span={7} style={{ padding: '16px 20px', color: '#ff4d4f', display: 'flex', alignItems: 'center' }}>
                    {thoiGianThu}
                </Col>
            </Row>
            
            <Row style={{ borderBottom: '1px solid #f0f0f0' }}>
                <Col span={5} style={{ padding: '16px 20px', background: '#fafafa', borderRight: '1px solid #f0f0f0', fontWeight: 500, display: 'flex', alignItems: 'center' }}>
                    Status
                </Col>
                <Col span={7} style={{ padding: '16px 20px', borderRight: '1px solid #f0f0f0', display: 'flex', alignItems: 'center' }}>
                    <Tag color={tagColor}>{trangThaiDisplay || ''}</Tag>
                </Col>
                <Col span={5} style={{ padding: '16px 20px', background: '#fafafa', borderRight: '1px solid #f0f0f0', fontWeight: 500, display: 'flex', alignItems: 'center' }}>
                    Payer
                </Col>
                <Col span={7} style={{ padding: '16px 20px', display: 'flex', alignItems: 'center' }}>
                    {`${record.nguoiTaoHoTen} - ${record.nguoiTaoMa}` || '-'}
                </Col>
            </Row>

            <Row style={{ borderBottom: '1px solid #f0f0f0' }}>
                <Col span={5} style={{ padding: '16px 20px', background: '#fafafa', borderRight: '1px solid #f0f0f0', fontWeight: 500, display: 'flex', alignItems: 'center' }}>
                    Total Room Fee
                </Col>
                <Col span={7} style={{ padding: '16px 20px', borderRight: '1px solid #f0f0f0', display: 'flex', alignItems: 'center' }}>
                    {tongTienPhong}
                </Col>
                <Col span={5} style={{ padding: '16px 20px', background: '#fafafa', borderRight: '1px solid #f0f0f0', fontWeight: 500, display: 'flex', alignItems: 'center' }}>
                    Total Deposit Fee
                </Col>
                <Col span={7} style={{ padding: '16px 20px', display: 'flex', alignItems: 'center' }}>
                    {tongTienCoc}
                </Col>
            </Row>

            <Row style={{ borderBottom: '1px solid #f0f0f0', backgroundColor: '#e6f4ff' }}>
                <Col span={5} style={{ padding: '16px 20px', borderRight: '1px solid #f0f0f0', fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                    Total Amount
                </Col>
                <Col span={19} style={{ padding: '16px 20px', fontWeight: 'bold', fontSize: 16, color: '#1677ff', display: 'flex', alignItems: 'center' }}>
                    {tongThanhTienStr}
                </Col>
            </Row>

            <Row>
                <Col span={5} style={{ padding: '16px 20px', background: '#fafafa', borderRight: '1px solid #f0f0f0', fontWeight: 500, display: 'flex', alignItems: 'center' }}>
                    Paid Amount
                </Col>
                <Col span={7} style={{ padding: '16px 20px', borderRight: '1px solid #f0f0f0', display: 'flex', alignItems: 'center' }}>
                    0 VNĐ
                </Col>
                <Col span={5} style={{ padding: '16px 20px', background: '#fafafa', borderRight: '1px solid #f0f0f0', fontWeight: 500, display: 'flex', alignItems: 'center' }}>
                    Remaining Amount to Pay
                </Col>
                <Col span={7} style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', color: '#ff4d4f', fontWeight: 600 }}>
                    {record.trangThaiDuyet === ETrangThaiDuyet.CHO_THANH_TOAN ? tongThanhTienStr : '0 VNĐ'}
                </Col>
            </Row>
        </div>
    );

    const renderQR = () => {
        if (step !== 'qr') return null;

        return (
            <div style={{ textAlign: 'center', padding: '24px 0 10px 0', borderTop: '1px dashed #d9d9d9', marginTop: 24 }}>
                {qrUrl ? (
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
                        <img 
                            src={qrUrl} 
                            alt="VietQR" 
                            style={{ width: 270, height: 'auto', objectFit: 'contain', borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }} 
                        />
                    </div>
                ) : (
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
                        <QrcodeOutlined style={{ fontSize: 100, color: '#1677ff' }} />
                    </div>
                )}
                
                <Result
                    icon={null}
                    status="success"
                    title={qrUrl ? "Scan QR code to pay" : "Cannot generate QR code"}
                    subTitle={
                        <div style={{ marginTop: 8 }}>
                            {qrUrl ? (
                                <p style={{ fontSize: 16, marginBottom: 8 }}>Please use your banking app to scan the VietQR code above.</p>
                            ) : (
                                <p style={{ fontSize: 16, marginBottom: 8, color: '#ff4d4f' }}>Invalid payment amount.</p>
                            )}
                            <p style={{ fontSize: 14, color: '#888' }}>
                                Payer: <strong>{record.nguoiTaoHoTen || '-'}</strong>
                                {qrUrl && <span style={{ margin: '0 8px' }}>|</span>}
                                {qrUrl && <>Amount: <strong style={{ color: '#ff4d4f' }}>{tongThanhTienStr}</strong></>}
                            </p>
                        </div>
                    }
                    style={{ padding: 0 }}
                />
            </div>
        );
    };

    return (
        <Modal
            title={<span style={{ fontSize: 18, fontWeight: 600 }}>Payment Information</span>}
            open={visible}
            onCancel={onClose}
            width={1100}
            footer={
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: step === 'info' ? 24 : 0 }}>
                    <Button onClick={onClose} disabled={isGeneratingQR}>Close</Button>
                    {step === 'info' ? (
                        <Button type="primary" onClick={handlePayNow} loading={isGeneratingQR}>
                            {isGeneratingQR ? 'Processing...' : 'Pay Now'}
                        </Button>
                    ) : (
                        <Button type="primary" onClick={onClose}>
                            Done
                        </Button>
                    )}
                </div>
            }
            centered
        >
            {renderInfoGrid()}
            {renderQR()}
        </Modal>
    );
};

export default PaymentModal;
