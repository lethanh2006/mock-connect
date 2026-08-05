import { getPhienTraGop } from '@/services/TaiChinh/TraGop';
import { EMauTrangThaiPhienTraGop, ETrangThaiPhienTraGop } from '@/services/TaiChinh/TraGop/constant';
import type { TraGop } from '@/services/TaiChinh/TraGop/typing';
import type { HoaDon } from '@/services/TaiChinh/HoaDon/typing';
import { inputFormat } from '@/utils/utils';
import { CheckOutlined, ExclamationOutlined } from '@ant-design/icons';
import { Button, Empty, Modal, Spin, Tag } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import { useIntl } from 'umi';
import './style.less';

interface ModalTienDoTraGopProps {
	visible: boolean;
	bill?: HoaDon.IRecord;
	onClose: () => void;
	/** Bấm "Thanh toán ngay" ở kỳ chưa thanh toán gần nhất, amount là số tiền còn lại của kỳ đó */
	onPayNow?: (phien: TraGop.IPhienTraGop, amount: number) => void;
}

const ModalTienDoTraGop: React.FC<ModalTienDoTraGopProps> = ({ visible, bill, onClose, onPayNow }) => {
	const intl = useIntl();
	const [loading, setLoading] = useState(false);
	const [danhSach, setDanhSach] = useState<TraGop.IPhienTraGop[]>([]);

	useEffect(() => {
		if (!visible || !bill?._id) {
			setDanhSach([]);
			return;
		}

		setLoading(true);
		getPhienTraGop(bill._id)
			.then((res) => setDanhSach(res?.data?.data ?? []))
			.catch(() => setDanhSach([]))
			.finally(() => setLoading(false));
	}, [visible, bill?._id]);

	const sortedDanhSach = useMemo(
		() => [...danhSach].sort((a, b) => a.lanTraGop - b.lanTraGop),
		[danhSach],
	);

	const nextUnpaidId = useMemo(() => {
		const unpaid = danhSach
			.filter((item) => item.trangThai !== ETrangThaiPhienTraGop.PAID)
			.sort((a, b) => dayjs(a.ngayHetHan).valueOf() - dayjs(b.ngayHetHan).valueOf());
		return unpaid[0]?._id;
	}, [danhSach]);

	const soDaHoanThanh = danhSach.filter((item) => item.trangThai === ETrangThaiPhienTraGop.PAID).length;

	const getStatusLabel = (trangThai: ETrangThaiPhienTraGop) =>
		intl.formatMessage({ id: `taichinh.tragop.phien.status.${trangThai}` });

	return (
		<Modal
			open={visible}
			onCancel={onClose}
			footer={null}
			width={640}
			destroyOnClose
			title={intl.formatMessage({ id: 'taichinh.tragop.tiendo.title' }, { identityCode: bill?.identityCode ?? '' })}
		>
			<Spin spinning={loading}>
				{!loading && !danhSach.length ? (
					<Empty description={intl.formatMessage({ id: 'global.table.index.empty' })} />
				) : (
					<>
						<div className='tragop-progress__summary'>
							<span className='tragop-progress__summary-title'>
								{intl.formatMessage({ id: 'taichinh.tragop.tiendo.summary.label' })}
							</span>
							<span className='tragop-progress__summary-count'>
								{intl.formatMessage(
									{ id: 'taichinh.tragop.tiendo.summary.count' },
									{ paid: soDaHoanThanh, total: danhSach.length },
								)}
							</span>
						</div>

						<div className='tragop-timeline'>
							{sortedDanhSach.map((phien) => {
								const isPaid = phien.trangThai === ETrangThaiPhienTraGop.PAID;
								const isOverdue = phien.trangThai === ETrangThaiPhienTraGop.OVERDUE;
								const isNext = phien._id === nextUnpaidId;
								const conLai = Math.max((phien.soTien ?? 0) - (phien.soTienDaNop ?? 0), 0);

								return (
									<div
										key={phien._id}
										className={[
											'tragop-timeline-item',
											isPaid ? 'is-paid' : '',
											isNext ? 'is-next' : '',
											isOverdue ? 'is-overdue' : '',
										]
											.filter(Boolean)
											.join(' ')}
									>
										<div className='tragop-timeline-item__marker'>
											{isPaid ? <CheckOutlined /> : isOverdue ? <ExclamationOutlined /> : phien.lanTraGop}
										</div>
										<div className='tragop-timeline-item__body'>
											<div className='tragop-timeline-item__row'>
												<span className='tragop-timeline-item__title'>
													{intl.formatMessage({ id: 'taichinh.tragop.tiendo.col.lan' })} {phien.lanTraGop}
												</span>
												<Tag color={EMauTrangThaiPhienTraGop[phien.trangThai]}>{getStatusLabel(phien.trangThai)}</Tag>
												{isNext && (
													<Tag color='blue'>{intl.formatMessage({ id: 'taichinh.tragop.tiendo.nextBadge' })}</Tag>
												)}
											</div>
											<div className='tragop-timeline-item__meta'>
												{intl.formatMessage({ id: 'taichinh.tragop.tiendo.col.hannop' })}:{' '}
												{phien.ngayHetHan ? dayjs(phien.ngayHetHan).format('DD/MM/YYYY') : ''}
											</div>
											<div className='tragop-timeline-item__amount-row'>
												<div>
													<div className='tragop-timeline-item__amount'>{inputFormat(phien.soTien ?? 0)} VND</div>
													{(phien.soTienDaNop ?? 0) > 0 && (
														<div className='tragop-timeline-item__amount-paid'>
															{intl.formatMessage({ id: 'taichinh.tragop.tiendo.col.sotiendanop' })}:{' '}
															{inputFormat(phien.soTienDaNop ?? 0)} VND
														</div>
													)}
												</div>
												{isNext && onPayNow && (
													<Button type='primary' size='small' onClick={() => onPayNow(phien, conLai)}>
														{intl.formatMessage({ id: 'taichinh.tragop.tiendo.paynow' })}
													</Button>
												)}
											</div>
										</div>
									</div>
								);
							})}
						</div>
					</>
				)}
			</Spin>
		</Modal>
	);
};

export default ModalTienDoTraGop;
