import React from 'react';
import { Modal, Button } from 'antd';
import { useIntl } from 'umi';
import { KyTucXa } from '@/services/KyTucXa/typings';
import NoiDungThanhToan from './NoiDungThanhToan';

interface ModalThanhToanProps {
    open: boolean;
    onClose: () => void;
    record?: KyTucXa.IThongTinDangKy;
}

const ModalThanhToan: React.FC<ModalThanhToanProps> = ({ open, onClose, record }) => {
    const intl = useIntl();

    return (
        <Modal
            title={intl.formatMessage({ id: 'kytucxa.payment.modal.title' })}
            open={open}
            onCancel={onClose}
            footer={null}
            width={1000}
            destroyOnClose
        >
            <div style={{ padding: '0 8px' }}>
                <NoiDungThanhToan />
            </div>
            <div style={{ marginTop: 18, display: 'flex', justifyContent: 'flex-end', gap: 8, borderTop: '1px solid #f0f0f0', paddingTop: 16 }}>
                <Button onClick={onClose}>
                    {intl.formatMessage({ id: 'global.button.dong' })}
                </Button>
            </div>
        </Modal>
    );
};

export default ModalThanhToan;
