import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';
import { type ThanhToan } from '@/services/DVMC/ThanhToan/typings';
import { TrangThaiThanhToan } from '@/services/DVMC/constant';
import { currencyFormat } from '@/utils/utils';
import { Divider, Empty, Table, Tabs } from 'antd';
import moment from 'moment';
import { useEffect } from 'react';
import { useModel } from 'umi';
import ChiTietDichVu from './ChiTietDichVu';
import ThongTinThanhToan from './ThongTinThanhToan';

const ThanhToanPage = (props: { identityCode: string; trangThaiThanhToan?: string; isCongNo?: boolean }) => {
	const { getInvoiceByIdentityCodeModel, record } = useModel('dvmc.thanhtoan');

	useEffect(() => {
		getInvoiceByIdentityCodeModel(props?.identityCode);
	}, [props?.identityCode]);

	const columnsItem: IColumn<ThanhToan.Item>[] = [
		{
			title: 'Danh mục',
			dataIndex: 'productName',
			width: 200,
		},
		{
			title: 'Số tiền',
			width: 120,
			align: 'center',
			render: (val, rec) => <div>{currencyFormat(rec?.quantity * rec?.unitAmount)}đ</div>,
		},
	];

	const columnsHistory: IColumn<ThanhToan.PaidHistory>[] = [
		{
			title: 'Số tiền',
			width: 100,
			align: 'center',
			dataIndex: 'amountPaid',
			render: (val: number) => <div>{currencyFormat(val)}đ</div>,
		},
		{
			title: 'Thời gian',
			width: 120,
			dataIndex: 'transactionDate',
			align: 'center',
			render: (val) => val && moment(val).format('HH:mm DD/MM/YYYY'),
		},
		{
			title: 'Người thực hiện',
			dataIndex: ['nguoiThucHien', 'hoTen'],
			width: 120,
		},
		{
			title: 'Hình thức',
			dataIndex: 'paymentType',
			width: 120,
			render: (val) => (val === 'manual' ? 'Chuyên viên cập nhật' : 'Thanh toán bằng mã định danh'),
		},
	];

	return (
		<>
			<ThongTinThanhToan
				isCongNo={props?.isCongNo ?? false}
				trangThaiThanhToan={
					props?.trangThaiThanhToan
						? props.trangThaiThanhToan
						: record?.status
						? TrangThaiThanhToan?.[record.status] ?? ''
						: ''
				}
			/>
			{record?.metadata?.loai !== 'DVMC' && record?.metadata?.thongTinChiTiet?.length ? (
				<>
					<Divider>Thông tin chi tiết</Divider>
					<ChiTietDichVu thongTinChiTiet={record?.metadata?.thongTinChiTiet ?? []} />
				</>
			) : null}

			<Tabs style={{ marginTop: 8 }}>
				<Tabs.TabPane tab='Chi tiết' key='chitiet'>
					<TableStaticData
						otherProps={{
							pagination: false,
							summary: (data: ThanhToan.Item[]) => {
								let sum = 0;
								data.forEach(({ quantity, unitAmount }) => (sum += (quantity ?? 0) * (unitAmount ?? 0)));
								return (
									<Table.Summary fixed>
										<Table.Summary.Row>
											<Table.Summary.Cell index={0} colSpan={2} align='center'>
												<b>Tổng cộng</b>
											</Table.Summary.Cell>
											<Table.Summary.Cell index={1} align='center'>
												<b>{currencyFormat(sum)}đ</b>
											</Table.Summary.Cell>
										</Table.Summary.Row>
									</Table.Summary>
								);
							},
						}}
						data={record?.items ?? []}
						columns={columnsItem}
						addStt
						size='small'
					/>
				</Tabs.TabPane>
				<Tabs.TabPane tab='Lịch sử thanh toán' key='lichsu'>
					{record?.paidHistory?.length ? (
						<TableStaticData
							otherProps={{ pagination: false }}
							data={record?.paidHistory ?? []}
							columns={columnsHistory}
							addStt
							size='small'
						/>
					) : (
						<Empty description='Không có lịch sử thanh toán' />
					)}
				</Tabs.TabPane>
			</Tabs>

			<br />
			<Divider>Hướng dẫn thanh toán</Divider>
			<p>
				- Nếu sinh viên sử dụng tài khoản BIDV thì mã thanh toán là: <b>{record?.identityCode}</b> <br />- Nếu sinh viên
				sử dụng tài khoản Ngân hàng khác thì mã thanh toán là:{' '}
				<b>
					{/* {initialState?.currentUser?.ma_thanh_toan_bidv ?? ''} */}
					{record?.identityCode}
				</b>
				<br />- Sinh viên có thể tham khảo hướng dẫn thanh toán chi tiết{' '}
				<a
					target='_blank'
					// href={initialState?.currentUser?.url_huong_dan_thanh_toan ?? ''}
					rel='noreferrer'
				>
					tại đây
				</a>
			</p>
			<div style={{ color: 'orange' }}>
				Lưu ý: Sinh viên vui lòng thanh toán chính xác số tiền yêu cầu (không làm tròn) để hệ thống ghi nhận giao dịch
				là hợp lệ.
			</div>
		</>
	);
};

export default ThanhToanPage;
