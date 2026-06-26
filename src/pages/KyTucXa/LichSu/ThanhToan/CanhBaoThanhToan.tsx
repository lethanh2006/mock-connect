import { Alert } from 'antd';
import { useIntl } from 'umi';

const CanhBaoThanhToanKTX = () => {
    const intl = useIntl();

    const NoteMessage = (
        <div>
            <ul style={{ margin: 0, paddingLeft: 20 }}>
                <li><b className='text-error'>{intl.formatMessage({ id: 'kytucxa.payment.history.notCancel' })}</b> <b>{intl.formatMessage({ id: 'kytucxa.payment.history.note1' })}</b></li>
                <li><b>{intl.formatMessage({ id: 'kytucxa.payment.history.note2' })}</b></li>
                <li><b>{intl.formatMessage({ id: 'kytucxa.payment.history.note3' })}</b></li>
            </ul>
        </div>
    );

    return (
        <Alert
            message="Note:"
            description={NoteMessage}
            type="info"
            showIcon={false}
            style={{ backgroundColor: '#fafafa', border: '1px solid #f0f0f0' }}
        />
    );
};

export default CanhBaoThanhToanKTX;