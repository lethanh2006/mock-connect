import background from '@/assets/cct/background.png';
import EllipsisText from '@/pages/CCT/components/EllipsisText';
import { IconClock, IconHourglass, IconPinLocation } from '@/components/Icons';
import AuthImage from '@/components/Image/AuthImage';
import { EApprovalStatus, mapNameApprovalStatus } from '@/services/CCT/constant';
import { type ReactNode } from 'react';
import { useIntl } from 'umi';
import '../../TrangChuV2/styles.less';

export type ActivityCardAttribute = {
	id: string;
	letter: string;
	active?: boolean;
};

export type ActivityCardProps = {
	title: string;
	banner?: string;
	isNew?: boolean;
	attributes?: ActivityCardAttribute[];
	startDate?: string;
	endDate?: string;
	location?: string;
	registerBefore?: string;
	approvalStatus?: EApprovalStatus;
	deadline?: ReactNode;
	deadlineIcon?: ReactNode;
	extraTags?: ReactNode;
	action?: ReactNode;
	onClick?: () => void;
};

/** Asset local / CDN công khai — không đi qua axios auth */
const isDirectImage = (src?: string) => {
	if (!src) return false;
	if (/^(data:|blob:)/.test(src)) return true;
	if (src.includes('/static/') || src.startsWith('/static')) return true;
	return /picsum\.photos|placehold\.co|unsplash\.com/.test(src);
};

const ActivityCard = ({
	title,
	banner,
	isNew,
	attributes = [],
	startDate,
	endDate,
	location,
	registerBefore,
	approvalStatus,
	deadline,
	deadlineIcon,
	extraTags,
	action,
	onClick,
}: ActivityCardProps) => {
	const intl = useIntl();
	const statusLabel = approvalStatus ? mapNameApprovalStatus[approvalStatus] : undefined;
	const imageSrc = banner || background;

	return (
		<article className='activity-figma-card' onClick={onClick}>
			<div className='activity-figma-card__cover'>
				{isDirectImage(imageSrc) ? (
					<img className='activity-figma-card__image' src={imageSrc} alt={title} />
				) : (
					<AuthImage className='activity-figma-card__image' src={imageSrc} fallback={background} alt={title} />
				)}
				{isNew && <span className='activity-figma-card__new'>{intl.formatMessage({ id: 'activity.card.new' })}</span>}
			</div>

			<div className='activity-figma-card__body'>
				<div className='activity-figma-card__heading'>
					<EllipsisText as='h4' className='activity-figma-card__title'>
						{title}
					</EllipsisText>

					{(attributes.length > 0 || statusLabel || extraTags) && (
						<div className='activity-figma-card__badge-row'>
							{attributes.length > 0 && (
								<div className='activity-figma-card__levels'>
									{attributes.map((item) => (
										<span key={item.id} className={`activity-figma-card__level ${item.active ? 'is-active' : ''}`}>
											{item.letter}
										</span>
									))}
								</div>
							)}
							{(statusLabel || extraTags) && (
								<div className='activity-figma-card__tags'>
									{statusLabel && (
										<span className={`activity-figma-card__status activity-figma-card__status--${approvalStatus}`}>
											{statusLabel}
										</span>
									)}
									{extraTags}
								</div>
							)}
						</div>
					)}
				</div>

				<ul className='activity-figma-card__meta'>
					<li>
						<IconClock className='activity-figma-card__icon' />
						<EllipsisText>
							{startDate || '--'} - {endDate || '--'}
						</EllipsisText>
					</li>
					<li>
						<IconPinLocation className='activity-figma-card__icon' />
						<EllipsisText>{location || '--'}</EllipsisText>
					</li>
					<li>
						{deadlineIcon ?? <IconHourglass className='activity-figma-card__icon' />}
						<EllipsisText>
							{deadline ?? (
								<>
									{intl.formatMessage({ id: 'activity.card.dangky' })} {registerBefore || '--'}
								</>
							)}
						</EllipsisText>
					</li>
				</ul>

				{action && (
					<div
						className='activity-figma-card__action'
						onClick={(event) => event.stopPropagation()}
						onMouseDown={(event) => event.stopPropagation()}
					>
						{action}
					</div>
				)}
			</div>
		</article>
	);
};

export default ActivityCard;
