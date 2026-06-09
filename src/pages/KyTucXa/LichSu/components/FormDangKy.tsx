import { Card, Form, Input, Row, Col, Typography, Avatar, Space, Divider, Tag, Button, Badge } from 'antd';
import { useIntl, useModel } from 'umi';
import { formatDate } from '@/utils/formatDate';
import { UserOutlined, IdcardOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { ETrangThaiDuyet } from '@/services/KyTucXa/constant';
import { useEffect, useMemo } from 'react';
import { KyTucXa } from '@/services/KyTucXa/typings';

const { Text, Title } = Typography;

const FormLichSuDk = () => {
    const intl = useIntl();
    const { record, setVisibleForm } = useModel('kytucxa.dangky');
    const { danhSach: danhSachToa, getAllModel: getAllToa } = useModel('kytucxa.toanha');
    
    useEffect(() => {
        if (!danhSachToa || danhSachToa.length === 0) getAllToa();
    }, []);

    const getStatusDisplay = (val?: string) => {
        let color = 'default';
        let label = val || intl.formatMessage({ id: 'kytucxa.lichsu.detail.unknownStatus' });

        if ([ETrangThaiDuyet.DA_THANH_TOAN].includes(val as ETrangThaiDuyet)) {
            color = 'success';
            label = intl.formatMessage({ id: 'kytucxa.lichsu.table.status.success' });
        } else if ([ETrangThaiDuyet.CHO_THANH_TOAN].includes(val as ETrangThaiDuyet)) {
            color = 'processing';
            label = intl.formatMessage({ id: 'kytucxa.lichsu.table.status.processing' });
        } else if ([ETrangThaiDuyet.HUY].includes(val as ETrangThaiDuyet)) {
            color = 'error';
            label = intl.formatMessage({ id: 'kytucxa.lichsu.table.status.expired' });
        }

        return { color, label };
    };

    const tenToaNha = useMemo(() => {
        if (!danhSachToa || !record?.phong?.maToaNha) return record?.phong?.maToaNha;
        const toa = danhSachToa.find((t: KyTucXa.IToa) => t.ma === record?.phong?.maToaNha);
        return toa?.ten || record?.phong?.maToaNha;
    }, [danhSachToa, record?.phong?.maToaNha]);

    return (
        <Card title={intl.formatMessage({ id: 'kytucxa.lichsu.detail.title' })} bordered={false} className="shadow-md">
            <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                padding: '16px 20px',
                background: '#f0f5ff',
                borderRadius: 8,
                marginBottom: 24
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <Avatar size={64} icon={<UserOutlined />} style={{ backgroundColor: '#1d3a6b' }} />
                    <div>
                        <Title level={4} style={{ margin: 0, color: '#1d3a6b' }}>{record?.formDon?.fullName}</Title>
                        <Space split={<Divider type="vertical" />} style={{ marginTop: 8, flexWrap: 'wrap' }}>
                            <Text type="secondary"><IdcardOutlined /> {record?.formDon?.studentId}</Text>
                            <Text type="secondary">{record?.formDon?.gender}</Text>
                            <Text type="secondary">{intl.formatMessage({ id: 'kytucxa.lichsu.detail.dob' })}: {formatDate(record?.formDon?.dateOfBirth)}</Text>
                        </Space>
                    </div>
                </div>
                <div>
                    {(() => {
                        const { color, label } = getStatusDisplay(record?.trangThaiDuyet);
                        return (
                            <Tag 
                                color={color} 
                                style={{ margin: 0, padding: '4px 12px', fontSize: 13, fontWeight: 500, borderRadius: 6 }}
                            >
                                {label}
                            </Tag>
                        );
                    })()}
                </div>
            </div>

            <Form layout="vertical">
                <Title level={5} style={{ color: '#1d3a6b', marginTop: 0 }}>{intl.formatMessage({ id: 'kytucxa.lichsu.detail.section.registerInfo' })}</Title>
                <Row gutter={16}>
                    <Col xs={24} md={12}>
                        <Form.Item label={intl.formatMessage({ id: 'kytucxa.lichsu.detail.field.room' })}>
                            <Input readOnly variant="filled" value={record?.phong?.ten} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item label={intl.formatMessage({ id: 'kytucxa.lichsu.detail.field.building' })}>
                            <Input readOnly variant="filled" value={tenToaNha} />
                        </Form.Item>
                    </Col>
                </Row>

                <Divider style={{ margin: '6px 0 9px' }} />

                <Title level={5} style={{ color: '#1d3a6b' }}>{intl.formatMessage({ id: 'kytucxa.lichsu.detail.section.identityInfo' })}</Title>
                <Row gutter={16}>
                    <Col xs={24} md={8}>
                        <Form.Item label={intl.formatMessage({ id: 'kytucxa.lichsu.detail.field.identityNumber' })}>
                            <Input readOnly variant="filled" value={record?.formDon?.identityNumber} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                        <Form.Item label={intl.formatMessage({ id: 'kytucxa.lichsu.detail.field.dateOfIssue' })}>
                            <Input readOnly variant="filled" value={formatDate(record?.formDon?.dateOfIssue)} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                        <Form.Item label={intl.formatMessage({ id: 'kytucxa.lichsu.detail.field.placeOfIssue' })}>
                            <Input readOnly variant="filled" value={record?.formDon?.placeOfIssue} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                        <Form.Item label={intl.formatMessage({ id: 'kytucxa.lichsu.detail.field.nationality' })}>
                            <Input readOnly variant="filled" value={record?.formDon?.nationality} />
                        </Form.Item>
                    </Col>
                </Row>

                <Divider style={{ margin: '6px 0 9px' }} />

                <Title level={5} style={{ color: '#1d3a6b' }}>{intl.formatMessage({ id: 'kytucxa.lichsu.detail.section.contactInfo' })}</Title>
                <Row gutter={16}>
                    <Col xs={24} md={12}>
                        <Form.Item label={intl.formatMessage({ id: 'kytucxa.lichsu.detail.field.phoneNumber' })}>
                            <Input readOnly variant="filled" value={record?.formDon?.phoneNumber} prefix={<PhoneOutlined />} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item label={intl.formatMessage({ id: 'kytucxa.lichsu.detail.field.email' })}>
                            <Input readOnly variant="filled" value={record?.formDon?.email} prefix={<MailOutlined />} />
                        </Form.Item>
                    </Col>
                    <Col xs={24}>
                        <Form.Item label={intl.formatMessage({ id: 'kytucxa.lichsu.detail.field.permanentHomeAddress' })}>
                            <Input readOnly variant="filled" value={record?.formDon?.permanentHomeAddress} />
                        </Form.Item>
                    </Col>
                </Row>

                <Divider style={{ margin: '6px 0 9px' }} />

                <Title level={5} style={{ color: '#1d3a6b' }}>{intl.formatMessage({ id: 'kytucxa.lichsu.detail.section.educationInfo' })}</Title>
                <Row gutter={16}>
                    <Col xs={24} md={8}>
                        <Form.Item label={intl.formatMessage({ id: 'kytucxa.lichsu.detail.field.college' })}>
                            <Input readOnly variant="filled" value={record?.formDon?.college} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={16}>
                        <Form.Item label={intl.formatMessage({ id: 'kytucxa.lichsu.detail.field.program' })}>
                            <Input readOnly variant="filled" value={record?.formDon?.program} />
                        </Form.Item>
                    </Col>
                </Row>

                <Divider style={{ margin: '6px 0 9px' }} />

                <Title level={5} style={{ color: '#1d3a6b' }}>{intl.formatMessage({ id: 'kytucxa.lichsu.detail.section.emergencyContact' })}</Title>
                <Space direction="vertical" size={12} style={{ width: '100%' }}>
                    {(record?.formDon?.emergencyContacts ?? []).length === 0 ? (
                        <Typography.Text type="secondary" italic>Không có thông tin liên hệ khẩn cấp.</Typography.Text>
                    ) : (
                        (record?.formDon?.emergencyContacts ?? []).map((contact, index) => (
                            <Badge.Ribbon
                                key={contact.emergencyContactName + index}
                                text={`#${index + 1}`}
                                color="#1d3a6b"
                            >
                                <Card
                                    size="small"
                                    bordered
                                    style={{ borderRadius: 8, background: '#fafbff', borderColor: '#d6e4ff' }}
                                >
                                    <Row gutter={[12, 0]}>
                                        <Col xs={24} md={8}>
                                            <Form.Item label={intl.formatMessage({ id: 'kytucxa.lichsu.detail.field.emergencyContactName' })} style={{ marginBottom: 8 }}>
                                                <Input readOnly variant="filled" value={contact.emergencyContactName} />
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} md={8}>
                                            <Form.Item label={intl.formatMessage({ id: 'kytucxa.lichsu.detail.field.emergencyRelationship' })} style={{ marginBottom: 8 }}>
                                                <Input readOnly variant="filled" value={contact.emergencyRelationship} />
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} md={8}>
                                            <Form.Item label={intl.formatMessage({ id: 'kytucxa.lichsu.detail.field.emergencyContactNumber' })} style={{ marginBottom: 8 }}>
                                                <Input readOnly variant="filled" value={contact.emergencyContactNumber} prefix={<PhoneOutlined />} />
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} md={8}>
                                            <Form.Item label={intl.formatMessage({ id: 'kytucxa.lichsu.detail.field.secondaryContactNumber' })} style={{ marginBottom: 8 }}>
                                                <Input readOnly variant="filled" value={contact.secondaryContactNumber || '-'} prefix={<PhoneOutlined />} />
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} md={8}>
                                            <Form.Item label={intl.formatMessage({ id: 'kytucxa.lichsu.detail.field.email' })} style={{ marginBottom: 8 }}>
                                                <Input readOnly variant="filled" value={contact.emergencyEmail || '-'} prefix={<MailOutlined />} />
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} md={16}>
                                            <Form.Item label={intl.formatMessage({ id: 'kytucxa.lichsu.detail.field.address' })} style={{ marginBottom: 8 }}>
                                                <Input readOnly variant="filled" value={contact.address} />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Card>
                            </Badge.Ribbon>
                        ))
                    )}
                </Space>
            </Form>
            
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 32 }}>
                <Button 
                    type="primary" 
                    ghost
                    onClick={() => setVisibleForm(false)} 
                    size="large"
                    style={{ minWidth: 120, borderRadius: 8, fontWeight: 500 }}
                >
                    {intl.formatMessage({ id: 'global.button.dong' })}
                </Button>
            </div>
        </Card>
    );
};

export default FormLichSuDk;