import ExpandText from '@/components/ExpandText';
import { getAdvisorSlots, listAdvisors } from '@/services/Advising';
import { ADVISING_TYPE_LABEL_KEY, ADVISING_TYPE_OPTIONS, AdvisingType } from '@/services/Advising/constant';
import { Advising } from '@/services/Advising/typing';
import dayjs from '@/utils/dayjs';
import { formatDate, formatTimeRange } from '@/utils/formatDate';
import { CheckOutlined, EnvironmentOutlined, InfoCircleOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { Button, DatePicker, Empty, Segmented, Select, Space, Spin, Tag, Tooltip, Typography } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useIntl } from 'umi';
import { ADVISING_MODE_TAG_COLOR } from '../advisingTagColor';
import BookingModal from './BookingModal';
import styles from './BookSessionPanel.less';

const { RangePicker } = DatePicker;

const DEFAULT_RANGE_DAYS = 30;

const STEP_TITLE_KEYS = ['advisorAppointment.step.chooseAdvisor', 'advisorAppointment.step.chooseSlot'];
const LAST_STEP = STEP_TITLE_KEYS.length - 1;

type BookSessionPanelProps = {
	onBooked?: () => void;
	onClose?: () => void;
};

const TAG_LINE_HEIGHT = 20;

const BookSessionPanel: React.FC<BookSessionPanelProps> = ({ onBooked, onClose }) => {
	const intl = useIntl();

	const [currentStep, setCurrentStep] = useState(0);

	const [advisingType, setAdvisingType] = useState<AdvisingType>(AdvisingType.ACADEMIC);
	const [advisors, setAdvisors] = useState<Advising.IAdvisorSummary[]>([]);
	const [loadingAdvisors, setLoadingAdvisors] = useState(false);
	const [selectedAdvisor, setSelectedAdvisor] = useState<Advising.IAdvisorSummary>();

	const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
		dayjs(),
		dayjs().add(DEFAULT_RANGE_DAYS, 'day'),
	]);
	const [slots, setSlots] = useState<Advising.ISlot[]>([]);
	const [loadingSlots, setLoadingSlots] = useState(false);

	const [bookingSlot, setBookingSlot] = useState<Advising.ISlot>();
	const [modalOpen, setModalOpen] = useState(false);

	useEffect(() => {
		setSelectedAdvisor(undefined);
		setSlots([]);
		setLoadingAdvisors(true);
		listAdvisors(advisingType)
			.then((res) => setAdvisors(res?.data?.data ?? []))
			.catch(() => setAdvisors([]))
			.finally(() => setLoadingAdvisors(false));
	}, [advisingType]);

	const fetchSlots = () => {
		if (!selectedAdvisor) return;
		setLoadingSlots(true);
		getAdvisorSlots(selectedAdvisor.advisorSsoId, {
			from: dateRange[0].startOf('day').toISOString(),
			to: dateRange[1].endOf('day').toISOString(),
		})
			.then((res) => setSlots(res?.data?.data ?? []))
			.catch(() => setSlots([]))
			.finally(() => setLoadingSlots(false));
	};

	useEffect(() => {
		fetchSlots();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedAdvisor, dateRange]);

	const slotsByDate = useMemo(() => {
		const groups = new Map<string, Advising.ISlot[]>();
		[...slots]
			.sort((a, b) => dayjs(a.startAt).valueOf() - dayjs(b.startAt).valueOf())
			.forEach((slot) => {
				const key = dayjs(slot.startAt).format('YYYY-MM-DD');
				if (!groups.has(key)) groups.set(key, []);
				groups.get(key)!.push(slot);
			});
		return Array.from(groups.entries());
	}, [slots]);

	const isSlotBookable = (slot: Advising.ISlot) =>
		!slot.isBooked &&
		slot.status === 'OPEN' &&
		slot.bookedCount < slot.capacity &&
		dayjs(slot.startAt).isAfter(dayjs());

	const handleSlotClick = (slot: Advising.ISlot) => {
		if (!isSlotBookable(slot)) return;
		setBookingSlot(slot);
		setModalOpen(true);
	};

	return (
		<div>
			<div className={styles.stepper}>
				{STEP_TITLE_KEYS.map((titleKey, index) => {
					const isDone = index <= currentStep;
					// Chỉ cho nhảy lùi (tiến phải qua nút Tiếp theo để còn kiểm tra đã chọn cố vấn chưa).
					const canJump = index < currentStep;
					return (
						<div
							key={titleKey}
							className={`${styles.stepperItem} ${isDone ? styles.completed : ''}`}
							style={canJump ? undefined : { cursor: 'default' }}
							onClick={() => canJump && setCurrentStep(index)}
						>
							<div className={`${styles.stepperCircle} ${isDone ? styles.active : ''}`}>
								{isDone ? <CheckOutlined /> : index + 1}
							</div>
							<div className={`${styles.stepperLabel} ${isDone ? styles.active : ''}`}>
								{intl.formatMessage({ id: titleKey })}
							</div>
						</div>
					);
				})}
			</div>

			<div style={{ display: currentStep === 0 ? 'flex' : 'none', flexDirection: 'column', gap: 20 }}>
				<div>
					<Typography.Text type='secondary'>
						{intl.formatMessage({ id: 'advisorAppointment.section.advisingType' })}
					</Typography.Text>
					<div style={{ marginTop: 8 }}>
						<Segmented
							value={advisingType}
							onChange={(val) => setAdvisingType(val as AdvisingType)}
							options={ADVISING_TYPE_OPTIONS.map((type) => ({
								label: intl.formatMessage({ id: ADVISING_TYPE_LABEL_KEY[type] }),
								value: type,
							}))}
						/>
					</div>
				</div>

				<div>
					<Typography.Text type='secondary'>
						{intl.formatMessage({ id: 'advisorAppointment.section.advisor' })}
					</Typography.Text>
					<div style={{ marginTop: 8 }}>
						<Select
							style={{ width: '100%', maxWidth: 360 }}
							showSearch
							optionFilterProp='label'
							loading={loadingAdvisors}
							value={selectedAdvisor?.advisorSsoId}
							placeholder={intl.formatMessage({ id: 'advisorAppointment.advisor.placeholder' })}
							onChange={(val) => setSelectedAdvisor(advisors.find((advisor) => advisor.advisorSsoId === val))}
							notFoundContent={
								loadingAdvisors ? (
									<Spin
										spinning
										tip={intl.formatMessage({ id: 'advisorAppointment.advisor.loading' })}
										style={{ width: '100%', margin: 10 }}
									/>
								) : (
									<Empty
										image={Empty.PRESENTED_IMAGE_SIMPLE}
										description={intl.formatMessage({ id: 'advisorAppointment.advisor.empty' })}
									/>
								)
							}
							options={advisors.map((advisor) => ({ value: advisor.advisorSsoId, label: advisor.advisorName }))}
						/>
					</div>
				</div>
			</div>

			<div style={{ display: currentStep === LAST_STEP ? 'block' : 'none' }}>
				<Space direction='vertical' size={4} style={{ marginBottom: 16 }}>
					<Typography.Text type='secondary'>
						{intl.formatMessage({ id: 'advisorAppointment.slot.rangeLabel' })}
					</Typography.Text>
					<RangePicker
						value={dateRange}
						allowClear={false}
						onChange={(vals) => {
							if (vals && vals[0] && vals[1]) setDateRange([vals[0], vals[1]]);
						}}
					/>
				</Space>

				{loadingSlots ? (
					<Spin tip={intl.formatMessage({ id: 'advisorAppointment.slot.loading' })} />
				) : slotsByDate.length === 0 ? (
					<Empty description={intl.formatMessage({ id: 'advisorAppointment.slot.empty' })} />
				) : (
					<div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
						{slotsByDate.map(([date, daySlots]) => (
							<div key={date}>
								<Typography.Text strong>{formatDate(date)}</Typography.Text>
								<div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 8 }}>
									{daySlots.map((slot) => {
										const bookable = isSlotBookable(slot);
										const isFull = slot.bookedCount >= slot.capacity;

										return (
											<div
												key={slot._id}
												onClick={() => handleSlotClick(slot)}
												style={{
													flex: '0 1 240px',
													minWidth: 0,
													padding: '10px 14px',
													borderRadius: 8,
													border: '1px solid #f0f0f0',
													background: bookable ? '#fff' : '#f5f5f5',
													cursor: bookable ? 'pointer' : 'not-allowed',
													opacity: bookable ? 1 : 0.6,
												}}
											>
												<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
													<strong>
														{formatTimeRange(slot.startAt, slot.endAt)}
														{slot.isBooked && (
															<Tag icon={<CheckOutlined />} color='success' style={{ marginInlineStart: 6 }}>
																{intl.formatMessage({ id: 'advisorAppointment.slot.booked' })}
															</Tag>
														)}
													</strong>
													{slot.note && (
														<Tooltip
															title={intl.formatMessage(
																{ id: 'advisorAppointment.slot.noteTooltip' },
																{ note: slot.note },
															)}
														>
															<InfoCircleOutlined style={{ color: '#8c8c8c' }} />
														</Tooltip>
													)}
												</div>
												<div style={{ marginTop: 6, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
													<Tag
														icon={
															slot.mode === 'ONLINE' ? (
																<VideoCameraOutlined style={{ height: TAG_LINE_HEIGHT }} />
															) : (
																<EnvironmentOutlined style={{ height: TAG_LINE_HEIGHT }} />
															)
														}
														color={ADVISING_MODE_TAG_COLOR[slot.mode]}
														style={{
															display: 'inline-flex',
															alignItems: 'flex-start',
															maxWidth: '100%',
															minWidth: 0,
															marginInlineEnd: 0,
															whiteSpace: 'normal',
															overflowWrap: 'anywhere',
														}}
													>
														{/* Thẻ slot có onClick để đặt lịch — chặn nổi bọt để bấm "xem tiếp" không mở luôn modal đặt. */}
														<span onClick={(e) => e.stopPropagation()} style={{ minWidth: 0 }}>
															<ExpandText style={{ marginBottom: 0 }} ellipsis={{ rows: 2 }}>
																{slot.location || slot.meetingLink || '—'}
															</ExpandText>
														</span>
													</Tag>
												</div>
												<div style={{ marginTop: 6 }}>
													<Typography.Text type='secondary' style={{ fontSize: 12 }}>
														{intl.formatMessage(
															{ id: 'advisorAppointment.slot.capacity' },
															{ booked: slot.bookedCount, capacity: slot.capacity },
														)}
													</Typography.Text>
													{!bookable && !slot.isBooked && (
														<Tag style={{ marginInlineStart: 6 }} color='default'>
															{intl.formatMessage({
																id: isFull ? 'advisorAppointment.slot.full' : 'advisorAppointment.slot.passed',
															})}
														</Tag>
													)}
												</div>
											</div>
										);
									})}
								</div>
							</div>
						))}
					</div>
				)}
			</div>

			<div className={styles.footer}>
				{currentStep > 0 && (
					<Button
						className={`${styles.prevButton} ${styles.backButton}`}
						htmlType='button'
						onClick={() => setCurrentStep((step) => step - 1)}
					>
						{intl.formatMessage({ id: 'advisorAppointment.button.previous' })}
					</Button>
				)}
				<Button className={styles.prevButton} htmlType='button' onClick={onClose}>
					{intl.formatMessage({ id: 'advisorAppointment.button.close' })}
				</Button>
				{currentStep < LAST_STEP && (
					<Button
						className={styles.nextButton}
						htmlType='button'
						type='primary'
						disabled={!selectedAdvisor}
						onClick={() => setCurrentStep((step) => Math.min(step + 1, LAST_STEP))}
					>
						{intl.formatMessage({ id: 'advisorAppointment.button.next' })}
					</Button>
				)}
			</div>

			<BookingModal
				open={modalOpen}
				slot={bookingSlot}
				advisingType={advisingType}
				onClose={() => setModalOpen(false)}
				onSuccess={() => {
					fetchSlots();
					onBooked?.();
				}}
			/>
		</div>
	);
};

export default BookSessionPanel;
