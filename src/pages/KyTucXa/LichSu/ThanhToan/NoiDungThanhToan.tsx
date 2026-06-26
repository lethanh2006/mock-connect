import { Tabs, Space, Checkbox } from 'antd';
import { useIntl } from 'umi';
import { useState } from 'react';
import { AppstoreAddOutlined } from '@ant-design/icons';
import ButtonExtend from '@/components/Table/ButtonExtend';
import ThongTinThanhToanKTX from './ThongTinThanhToan';
import TableThongTinThanhToanKTX from './TableThongTinTT';
import LichSuThanhToanKTX from './LichSuThanhToan';
import CanhBaoThanhToanKTX from './CanhBaoThanhToan';

const NoiDungThanhToanKTX = () => {
    const intl = useIntl();
    const [activeTab, setActiveTab] = useState('details');

    return (
        <Space direction="vertical" style={{ width: '100%' }} size="large">
            <ThongTinThanhToanKTX/>
            <div>
                <Tabs activeKey={activeTab} onChange={(tab) => setActiveTab(tab)}>
                    <Tabs.TabPane key="details" tab={intl.formatMessage({ id: 'kytucxa.payment.tab.details' })} />
                    <Tabs.TabPane key="history" tab={intl.formatMessage({ id: 'kytucxa.payment.tab.history' })} />
                </Tabs>

                {activeTab === 'details' ? (
                    <Space direction="vertical" style={{ width: '100%' }}>
                        <Space wrap>
                            <ButtonExtend
                                disabled={true}
                                onClick={() =>{}}
                                icon={<AppstoreAddOutlined />}
                                type='primary'
                                className='btn-success'
                                // loading={}
                                notHideText
                                tooltip={intl.formatMessage({ id: 'kytucxa.payment.tooltip' })}
                            >
                                {intl.formatMessage({ id: 'kytucxa.payment' })}
                            </ButtonExtend>

                            <Checkbox checked={false} onChange={() => {}}>
                                <b>{intl.formatMessage({ id: 'kytucxa.payment.checkbox.collapse' })}</b>
                            </Checkbox>
                        </Space>
                        <TableThongTinThanhToanKTX/>
                    </Space>
                ) : (
                    <>
                        <CanhBaoThanhToanKTX />
                        <LichSuThanhToanKTX />
                    </>
                )}
            </div>
        </Space>
    );
};

export default NoiDungThanhToanKTX;
