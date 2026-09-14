import { ETrangThaiMinhChung } from '@/services/KyTucXa/MienKyTucXa/constants';
import { formatDateTime } from '@/utils/formatDate';
import { Tag } from 'antd';
import { useIntl } from 'umi';

interface ExemptionBannerProps {
	recDot?: DotDangKyKTX.IRecord;
	coThongTinPheDuyet?: boolean;
}

const ExemptionBanner = ({ recDot, coThongTinPheDuyet }: ExemptionBannerProps) => {
	const intl = useIntl();
	const trangThai = recDot?.trangThaiMinhChungMien;

	if (!recDot?.isMienKyTucXa || !trangThai) return null;

	const isDaDuyet = trangThai === ETrangThaiMinhChung.DA_DUYET;
	const isTuChoi = trangThai === ETrangThaiMinhChung.TU_CHOI;

	const statusConfig = isDaDuyet
		? { tagColor: 'success', label: intl.formatMessage({ id: 'kytucxa.dangky.exempt.approved' }), borderColor: '#b7eb8f', bg: '#f6ffed' }
		: isTuChoi
		? { tagColor: 'error', label: intl.formatMessage({ id: 'kytucxa.dangky.exempt.rejected' }), borderColor: '#ffa39e', bg: '#fff1f0' }
		: { tagColor: 'warning', label: intl.formatMessage({ id: 'kytucxa.dangky.exempt.pending' }), borderColor: '#ffe58f', bg: '#fffbe6' };

	const actionAlertId = isDaDuyet
		? 'kytucxa.dangky.exempt.approvedAlert'
		: isTuChoi
		? 'kytucxa.dangky.exempt.rejectedAlert'
		: 'kytucxa.dangky.exempt.pendingAlert';

	const actionMessageId = isDaDuyet
		? 'kytucxa.dangky.exempt.approvedMessage'
		: isTuChoi
		? 'kytucxa.dangky.exempt.rejectedMessage'
		: 'kytucxa.dangky.exempt.pendingMessage';

	return (
		<div
			className='exemption-banner'
			style={{ borderColor: statusConfig.borderColor, background: statusConfig.bg }}
		>
			<div className='exemption-banner__main'>
				<Tag color={statusConfig.tagColor} className='exemption-banner__tag'>
					{statusConfig.label}
				</Tag>

				<div className='exemption-banner__meta'>
					<div className='exemption-banner__meta-item'>
						<span className='exemption-banner__meta-label'>
							{intl.formatMessage({ id: 'kytucxa.dangky.exempt.submittedAt' })}:
						</span>
						<span className='exemption-banner__meta-value'>
							{recDot.ngayTaoDonMien ? formatDateTime(recDot.ngayTaoDonMien) : '--'}
						</span>
					</div>

					{coThongTinPheDuyet && (
						<div className='exemption-banner__meta-item'>
							<span className='exemption-banner__meta-label'>
								{intl.formatMessage({ id: 'kytucxa.dangky.exempt.reviewedAt' })}:
							</span>
							<span className='exemption-banner__meta-value'>
								{recDot.ngayDuyetMien ? formatDateTime(recDot.ngayDuyetMien) : '--'}
							</span>
						</div>
					)}

					{coThongTinPheDuyet && (
						<div className='exemption-banner__meta-item'>
							<span className='exemption-banner__meta-label'>
								{intl.formatMessage({ id: 'kytucxa.dangky.exempt.approverLabel' })}:
							</span>
							<span className='exemption-banner__meta-value'>
								{recDot.nguoiDuyetMien || '--'}
							</span>
						</div>
					)}
				</div>
			</div>

			{isTuChoi && recDot.ghiChuDuyetMien && (
				<div className='exemption-banner__rejection'>
					<span className='exemption-banner__meta-label'>
						{intl.formatMessage({ id: 'kytucxa.dangky.exempt.rejectionReason' })}:
					</span>
					<span className='exemption-banner__meta-value'>{recDot.ghiChuDuyetMien}</span>
				</div>
			)}

			<div className='exemption-banner__action-message'>
				{intl.formatMessage({ id: actionAlertId })} {intl.formatMessage({ id: actionMessageId })}
			</div>
		</div>
	);
};

export default ExemptionBanner;
