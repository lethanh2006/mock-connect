import { Button, Form, Modal, Space, Steps, Typography } from 'antd';
import { FilePdfOutlined } from '@ant-design/icons';
import { useIntl, useModel } from 'umi';
import { useMemo, useEffect, useRef, useState } from 'react';
import { KyTucXa } from '@/services/KyTucXa/typings';
import FormStep1Content from '../../DangKy/components/Form/FormStep1Content';
import FormStep2Content from '../../DangKy/components/Form/FormStep2Content';
import CheckinPrepContent from '../../DangKy/components/CheckinPrepContent';
import { useReactToPrint } from 'react-to-print';
import PrintTemplate from '@/components/PrintTemplate';
import '../../DangKy/components/style.less';

interface ModalDetailDangKyProps {
    open: boolean;
    onClose: () => void;
}

const Tab1Content = ({ record }: { record: KyTucXa.IThongTinDangKy }) => {
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

const Tab2Content = () => {
    return <FormStep2Content showCheckbox={false} />;
};

const Tab3Content = ({ record }: { record: KyTucXa.IThongTinDangKy }) => {
    const { danhSach: danhSachDot } = useModel('kytucxa.dotdangky');

    const dotDangKy = useMemo(() => {
        if (!record?.maDotId || !danhSachDot) return undefined;
        return (danhSachDot as KyTucXa.IDotDangKy[]).find((d) => d._id === record.maDotId);
    }, [danhSachDot, record?.maDotId]);

    return <CheckinPrepContent phong={record?.phong} dotDangKy={dotDangKy} />;
};

const Tab4Content = () => {
    const intl = useIntl();
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 200,
            color: '#aaa',
            fontSize: 14,
            gap: 8,
        }}>
            <Typography.Text type="secondary" style={{ fontSize: 15 }}>
                {intl.formatMessage({ id: 'kytucxa.lichsu.detail.tab.payment.empty' })}
            </Typography.Text>
        </div>
    );
};

const ModalDetailDangKy: React.FC<ModalDetailDangKyProps> = ({ open, onClose }) => {
    const intl = useIntl();
    const { record } = useModel('kytucxa.dangky');
    const [currentStep, setCurrentStep] = useState(0);
    const contentRef = useRef<HTMLDivElement>(null);

    const handlePrint = useReactToPrint({
        contentRef: contentRef,
        documentTitle: intl.formatMessage({ id: 'kytucxa.lichsu.detail.title' }),
    });

    useEffect(() => {
        if (open) {
            setCurrentStep(0);
        }
    }, [open]);

    const steps = useMemo(() => [
        {
            title: intl.formatMessage({ id: 'kytucxa.dangky.form.step.generalInfo' }),
            content: record ? <Tab1Content record={record as KyTucXa.IThongTinDangKy} /> : null,
        },
        {
            title: intl.formatMessage({ id: 'kytucxa.dangky.form.step.waiver' }),
            content: <Tab2Content />,
        },
        {
            title: intl.formatMessage({ id: 'kytucxa.lichsu.detail.tab.checkinPrep' }),
            content: record ? <Tab3Content record={record as KyTucXa.IThongTinDangKy} /> : null,
        },
        {
            title: intl.formatMessage({ id: 'kytucxa.lichsu.detail.tab.payment' }),
            content: <Tab4Content />,
        },
    ], [intl, record]);

    const footer = (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Space>
                <Button 
                    icon={<FilePdfOutlined />} 
                    size="large" 
                    title={intl.formatMessage({ id: 'kytucxa.dangky.success.exportPdf' })}
                    onClick={() => handlePrint()}
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
                    className="ktx-register-steps"
                    size="small"
                    items={steps.map(item => ({ title: item.title }))}
                    style={{ marginBottom: 24 }}
                />
                
                <PrintTemplate ref={contentRef} title={intl.formatMessage({ id: 'kytucxa.lichsu.detail.title' })}>
                    <div style={{ padding: '0 4px' }}>
                        {steps[currentStep].content}
                    </div>
                </PrintTemplate>
            </div>
        </Modal>
    );
};

export default ModalDetailDangKy;
