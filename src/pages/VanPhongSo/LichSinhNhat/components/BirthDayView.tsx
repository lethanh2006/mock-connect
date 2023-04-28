import logo from '@/assets/logo.png';
import { Avatar, Divider, List } from 'antd';
import moment from 'moment';
import { useModel } from 'umi';

const BirthDayView = (props: { dataTheoNgay: LichSinhNhat.Record[] }) => {
  const { setRecord, setVisibleModal } = useModel('lichsinhnhat');
  const { dataTheoNgay } = props;
  const year = moment().get('year');
  const today = moment(dataTheoNgay[0].ngaySinh, 'YYYY-MM-DD').set('year', year);

  return (
    <div>
      <h4 style={{ marginBottom: 16, fontSize: 16, fontWeight: 500 }}>{`${today.format(
        'dddd',
      )}, ngày ${today.format(' DD/MM')}`}</h4>

      <List
        dataSource={dataTheoNgay}
        grid={{ gutter: 16, xs: 1, sm: 2, md: 4, lg: 4, xl: 4, xxl: 5 }}
        renderItem={(item) => (
          <List.Item style={{ marginBottom: 12 }}>
            <List.Item.Meta
              avatar={
                <Avatar src={<img style={{ objectFit: 'cover' }} src={logo} />} alt="avatar" />
              }
              title={
                <span
                  onClick={() => {
                    setRecord(item);
                    setVisibleModal(true);
                  }}
                  style={{ fontWeight: 500, padding: 0, cursor: 'pointer', color: '#007EB9' }}
                >
                  {item.hoTen} ({moment(item.ngaySinh).format('DD/MM/YYYY')})
                </span>
              }
              description={
                <span>
                  {item.chucVu ? item.chucVu : 'Chưa xác định'} -{' '}
                  {item.donVi ? item.donVi : 'Chưa xác định'}
                </span>
              }
            />
          </List.Item>
        )}
      />
      <Divider />
    </div>
  );
};

export default BirthDayView;
