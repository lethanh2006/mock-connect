import { currencyFormat } from '@/utils/utils';
import { Descriptions } from 'antd';
import { useModel } from 'umi';

export interface ThongTinThanhToanProps {
  isCongNo?: boolean;
  trangThaiThanhToan: string;
}

const ThongTinThanhToan = (props: ThongTinThanhToanProps) => {
  const { record } = useModel('dvmc.thanhtoan');

  return (
    <>
      <p>
        Trạng thái:{' '}
        <b
          style={{
            color:
              props?.trangThaiThanhToan === 'Đã thanh toán đủ' ||
              props?.trangThaiThanhToan === 'Thanh toán thừa'
                ? 'green'
                : 'red',
          }}
        >
          {props?.trangThaiThanhToan === 'Đã thanh toán đủ' ||
          props?.trangThaiThanhToan === 'Thanh toán thừa'
            ? 'Bạn đã hoàn thành nộp Lệ phí'
            : 'Bạn chưa nộp đủ Lệ phí'}
        </b>
      </p>

      {record?.metadata?.loai === 'DVMC' && (
        <p>{`Số lượng: ${record?.items?.[0]?.quantity ?? 0} ${
          record?.items?.[0]?.unitLabel ?? ''
        }. Mức lệ phí: ${currencyFormat(record?.items?.[0]?.unitAmount ?? 0)} đ/${
          record?.items?.[0]?.unitLabel ?? ''
        }`}</p>
      )}
      <Descriptions column={1} bordered>
        <Descriptions.Item label="Số tiền phải nộp">
          {currencyFormat(record?.amountDue ?? 0)} đ
        </Descriptions.Item>

        <Descriptions.Item label="Số tiền đã nộp">
          {currencyFormat(record?.amountPaid ?? 0)} đ
        </Descriptions.Item>

        <Descriptions.Item label="Số tiền còn lại phải nộp">
          {currencyFormat(record?.amountRemaining ?? 0)} đ
        </Descriptions.Item>
        <Descriptions.Item label="Số tiền thanh toán thừa">
          {currencyFormat(record?.amountRefund ?? 0)} đ
        </Descriptions.Item>
      </Descriptions>
    </>
  );
};

export default ThongTinThanhToan;
