import { Button, Form, Modal, Space, Steps, message } from 'antd';
import { FilePdfOutlined } from '@ant-design/icons';
import { useIntl, useModel } from 'umi';
import { useMemo, useEffect, useState } from 'react';
import { KyTucXa } from '@/services/KyTucXa/typings';
import FormStep1Content from '../../DangKy/components/Form/FormStep1Content';
import FormStep2Content from '../../DangKy/components/Form/FormStep2Content';
import CheckinPrepContent from '../../DangKy/components/CheckinPrepContent';
import NoiDungThanhToan from '../ThanhToan/NoiDungThanhToan';
import axios from '@/utils/axios';
import { ipCsvc } from '@/utils/ip';
import '../../DangKy/components/style.less';

interface ModalChiTietLichSuKTXProps {
    open: boolean;
    onClose: () => void;
}

const NoiDungStep1 = ({ record }: { record: KyTucXa.IThongTinDangKy }) => {
    const formDon = record?.formDon;
    const [form] = Form.useForm();

    useEffect(() => {
        if (formDon) {
            form.setFieldsValue(formDon);
        }
    }, [formDon, form]);

    return (
        <div>
            <Form form={form} layout="vertical" className="ktx-register-form">
                <FormStep1Content disabled={true} showCheckbox={false} />
            </Form>
        </div>
    );
};

const NoiDungStep2 = ({ record }: { record: KyTucXa.IThongTinDangKy }) => {
    const formDon = record?.formDon;
    const [form] = Form.useForm();

    useEffect(() => {
        if (formDon) {
            form.setFieldsValue({
                ...formDon,
                signatureUrl: formDon.signatureUrl,
            });
        }
    }, [formDon, form]);

    return (
        <Form form={form} layout="vertical" className="ktx-register-form">
            <FormStep2Content showCheckbox={false} />
        </Form>
    );
};

const NoiDungStep3 = ({ record }: { record: KyTucXa.IThongTinDangKy }) => {
    const { danhSach: danhSachDot } = useModel('kytucxa.dotdangky');

    const dotDangKy = useMemo(() => {
        if (!record?.maDotId || !danhSachDot) return undefined;
        return (danhSachDot as KyTucXa.IDotDangKy[]).find((d) => d._id === record.maDotId);
    }, [danhSachDot, record?.maDotId]);

    return <CheckinPrepContent phong={record?.phong} dotDangKy={dotDangKy} />;
};

const NoiDungStep4 = () => {
    return <NoiDungThanhToan />;
};

const ModalChiTietLichSuKTX: React.FC<ModalChiTietLichSuKTXProps> = ({ open, onClose }) => {
    const intl = useIntl();
    const { record } = useModel('kytucxa.dangky');
    const [currentStep, setCurrentStep] = useState(0);
    const [exporting, setExporting] = useState(false);

    const handleExportPdf = async () => {
        if (!record?._id) return;
        setExporting(true);
        try {
            const response = await axios.get(`${ipCsvc}/dang-ky-ky-tuc-xa/${record._id}/export`, {
                responseType: 'blob',
            });
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = `Don_Dang_Ky_KTX_${record._id}.pdf`;
            link.click();
            window.URL.revokeObjectURL(link.href);
            message.success('Tải tệp PDF thành công');
        } catch (err) {
            console.error('Lỗi khi xuất PDF:', err);
            message.error('Không thể xuất tệp PDF, vui lòng thử lại sau');
        } finally {
            setExporting(false);
        }
    };

    useEffect(() => {
        if (open) {
            setCurrentStep(0);
        }
    }, [open]);

    const steps = useMemo(() => [
        {
            title: intl.formatMessage({ id: 'kytucxa.dangky.form.step.generalInfo' }),
            content: record ? <NoiDungStep1 record={record as KyTucXa.IThongTinDangKy} /> : null,
        },
        {
            title: intl.formatMessage({ id: 'kytucxa.dangky.form.step.waiver' }),
            content: record ? <NoiDungStep2 record={record as KyTucXa.IThongTinDangKy} /> : null,
        },
        {
            title: intl.formatMessage({ id: 'kytucxa.lichsu.detail.tab.checkinPrep' }),
            content: record ? <NoiDungStep3 record={record as KyTucXa.IThongTinDangKy} /> : null,
        },
        {
            title: intl.formatMessage({ id: 'kytucxa.lichsu.detail.tab.payment' }),
            content: record ? <NoiDungStep4 /> : null,
        },
    ], [intl, record]);

    const footer = (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Space>
                <Button 
                    icon={<FilePdfOutlined />} 
                    size="large" 
                    title={intl.formatMessage({ id: 'kytucxa.dangky.success.exportPdf' })}
                    onClick={handleExportPdf}
                    loading={exporting}
                />
                <Button size="large" onClick={onClose} className="ktx-register-btn-outline">
                    {intl.formatMessage({ id: 'kytucxa.dangky.form.close' })}
                </Button>
                {currentStep > 0 && (
                    <Button size="large" onClick={() => setCurrentStep(currentStep - 1)} className="ktx-register-btn-outline">
                        {intl.formatMessage({ id: 'kytucxa.dangky.form.previous' })}
                    </Button>
                )}
                {currentStep < steps.length - 1 && (
                    <Button type="primary" size="large" onClick={() => setCurrentStep(currentStep + 1)} className="ktx-register-btn-primary">
                        {intl.formatMessage({ id: 'kytucxa.dangky.form.next' })}
                    </Button>
                )}
            </Space>
        </div>
    );

    return (
        <Modal
            open={open}
            onCancel={onClose}
            footer={footer}
            width={1000}
            destroyOnClose
            className="ktx-register-modal"
            title={
                <span style={{ fontSize: 17, fontWeight: 700, color: '#1d3a6b' }}>
                    {intl.formatMessage({ id: 'kytucxa.lichsu.detail.title' })}
                </span>
            }
        >
            <div className="ktx-modal__content">
                <Steps
                    current={currentStep}
                    className={`ktx-register-steps ${currentStep > 0 ? 'step2-active' : ''}`}
                    size="small"
                    items={steps.map((item, index) => ({ 
                        title: item.title,
                        status: index <= currentStep ? 'finish' : 'wait' as const
                    }))}
                    style={{ marginBottom: 24 }}
                />
                
                <div style={{ padding: '0 4px' }}>
                    {steps[currentStep].content}
                </div>
            </div>
        </Modal>
    );
};

export default ModalChiTietLichSuKTX;
