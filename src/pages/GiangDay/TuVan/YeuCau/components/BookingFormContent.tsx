import SelectSinhVienDebounce from '@/pages/SinhVien/components/Select';
import type { IdpCoVan } from '@/services/IdpCoVan/typing';
import {
	ADVISING_MODE_LABEL_KEY,
	ADVISING_TYPE_LABEL_KEY,
	AdvisingMode,
	AdvisingSlotStatus,
	AdvisingType,
} from '@/services/TuVan/constant';
import type { TuVan } from '@/services/TuVan/typing';
import dayjs from '@/utils/dayjs';
import { formatDate, formatDateTime, formatTimeRange } from '@/utils/formatDate';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Descriptions, Form, Input, Segmented, Select, Space, Switch, Typography } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useIntl, useModel } from 'umi';
import BookingDetailContent from './BookingDetailContent';

const TOPIC_MAX_LENGTH = 1000;

type CreateFormValues = {
	studentSsoId: string;
	slotId: string;
	advisingType: TuVan.IBooking['advisingType'];
	topic: string;
};

type EditFormValues = {
	topic: string;
};

const buildSlotLabel = (intl: ReturnType<typeof useIntl>, slot: TuVan.ISlot) => {
	const remaining = slot.capacity - slot.bookedCount;
	const dateLabel = dayjs(slot.startAt).isSame(slot.endAt, 'day')
		? `${formatDate(slot.startAt)} (${formatTimeRange(slot.startAt, slot.endAt)})`
		: `${formatDate(slot.startAt)} - ${formatDate(slot.endAt)}`;
	const place = slot.mode === AdvisingMode.ONLINE ? slot.meetingLink : slot.location;

	return [
		dateLabel,
		intl.formatMessage({ id: ADVISING_MODE_LABEL_KEY[slot.mode] }),
		place,
		intl.formatMessage({ id: 'tuvan.form.slotRemaining' }, { value: remaining, total: slot.capacity }),
	]
		.filter(Boolean)
		.join(' · ');
};

/**
 * Form tạo/sửa 1 lịch tư vấn cho sinh viên (cố vấn tự đặt hộ, không qua luồng sinh viên tự đặt).
 * `isView` → tái dùng `BookingDetailContent` (chỉ xem). Tạo mới chọn đủ SV/ca/loại/nội dung — BE chỉ cho
 * sửa `topic` (`PUT advising/bookings/advisor/:id`) nên form sửa chỉ hiện lại thông tin cũ để đối chiếu.
 */
const BookingFormContent: React.FC = () => {
	const intl = useIntl();
	const [createForm] = Form.useForm<CreateFormValues>();
	const [editForm] = Form.useForm<EditFormValues>();
	const { record, edit, isView, visibleForm, setVisibleForm, formSubmiting, createBookingModel, updateBookingModel } =
		useModel('tuvan.yeucau');
	const { getModel: getStudents } = useModel('idp.covansinhvien');
	const { getModel: getSlots } = useModel('tuvan.khadung');

	const [students, setStudents] = useState<IdpCoVan.IStudentSummary[]>([]);
	const [slots, setSlots] = useState<TuVan.ISlot[]>([]);
	const [loadingOptions, setLoadingOptions] = useState(false);
	// true: chỉ chọn trong ds sinh viên cố vấn phụ trách (mặc định). false: chọn tự do trong toàn hệ thống.
	const [onlyMyStudents, setOnlyMyStudents] = useState(true);

	// Chỉ tải danh sách sinh viên/ca tư vấn khi tạo mới — sửa không cần, chỉ đổi được nội dung.
	useEffect(() => {
		if (!visibleForm || isView || edit) return;
		setLoadingOptions(true);
		Promise.all([
			getStudents(undefined, undefined, undefined, 1, 500, undefined, undefined, false) as Promise<
				IdpCoVan.IStudentSummary[]
			>,
			getSlots(undefined, undefined, undefined, 1, 500, 'me/page', undefined, false) as Promise<TuVan.ISlot[]>,
		])
			.then(([studentList, slotList]) => {
				setStudents(studentList ?? []);
				setSlots(slotList ?? []);
			})
			.finally(() => setLoadingOptions(false));
	}, [visibleForm, isView, edit]);

	useEffect(() => {
		if (!visibleForm) {
			resetFieldsForm(createForm);
			resetFieldsForm(editForm);
			setOnlyMyStudents(true);
		} else if (edit && record?._id) {
			editForm.setFieldsValue({ topic: record.topic });
		} else {
			createForm.setFieldsValue({ advisingType: AdvisingType.ACADEMIC });
		}
	}, [record?._id, visibleForm, edit]);

	const availableSlots = useMemo(() => {
		const now = dayjs();
		return slots.filter(
			(s) => s.status === AdvisingSlotStatus.OPEN && s.bookedCount < s.capacity && now.isBefore(s.startAt),
		);
	}, [slots]);

	const onFinishEdit = async (values: EditFormValues) => {
		if (!record?._id) return;
		await updateBookingModel(
			record._id,
			{ topic: values.topic.trim() },
			intl.formatMessage({ id: 'tuvan.updateBooking.success' }),
		);
	};

	const onFinishCreate = async (values: CreateFormValues) => {
		await createBookingModel(
			{
				slotId: values.slotId,
				studentSsoIds: [values.studentSsoId],
				advisingType: values.advisingType,
				topic: values.topic.trim(),
			},
			intl.formatMessage({ id: 'tuvan.createBooking.success' }),
		);
	};

	if (isView) return <BookingDetailContent />;

	if (edit) {
		return (
			<Form form={editForm} layout='vertical' onFinish={onFinishEdit}>
				<Descriptions bordered size='small' column={1} style={{ marginBottom: 16 }}>
					<Descriptions.Item label={intl.formatMessage({ id: 'tuvan.form.student' })}>
						{record?.studentName} ({record?.studentCode})
					</Descriptions.Item>
					<Descriptions.Item label={intl.formatMessage({ id: 'tuvan.column.date' })}>
						{record && dayjs(record.startAt).isSame(record.endAt, 'day')
							? `${formatDate(record.startAt)} (${formatTimeRange(record.startAt, record.endAt)})`
							: record ? `${formatDateTime(record.startAt)} - ${formatDateTime(record.endAt)}` : '-' }
					</Descriptions.Item>
					<Descriptions.Item label={intl.formatMessage({ id: 'tuvan.column.mode' })}>
						{record ? intl.formatMessage({ id: ADVISING_MODE_LABEL_KEY[record.mode] }) : ''}
						{record?.location ? ` · ${record.location}` : ''}
					</Descriptions.Item>
					<Descriptions.Item label={intl.formatMessage({ id: 'tuvan.detail.advisingType' })}>
						{record ? intl.formatMessage({ id: ADVISING_TYPE_LABEL_KEY[record.advisingType] }) : ''}
					</Descriptions.Item>
				</Descriptions>

				<Form.Item
					name='topic'
					label={intl.formatMessage({ id: 'tuvan.form.topic' })}
					rules={[...rules.required, ...rules.length(TOPIC_MAX_LENGTH)]}
				>
					<Input.TextArea
						rows={3}
						maxLength={TOPIC_MAX_LENGTH}
						placeholder={intl.formatMessage({ id: 'tuvan.form.topicPlaceholder' })}
					/>
				</Form.Item>

				<div className='form-footer'>
					<Button type='primary' htmlType='submit' loading={formSubmiting}>
						{intl.formatMessage({ id: 'global.button.luulai' })}
					</Button>
					<Button onClick={() => setVisibleForm(false)} disabled={formSubmiting}>
						{intl.formatMessage({ id: 'global.button.huy' })}
					</Button>
				</div>
			</Form>
		);
	}

	return (
		<Form form={createForm} layout='vertical' onFinish={onFinishCreate}>
			<Form.Item
				name='studentSsoId'
				label={
					<Space size={8} align='center'>
						<span>{intl.formatMessage({ id: 'tuvan.form.student' })}</span>
						<Switch
							size='small'
							checked={onlyMyStudents}
							onChange={(checked) => {
								setOnlyMyStudents(checked);
								createForm.setFieldValue('studentSsoId', undefined);
							}}
						/>
						<Typography.Text type='secondary' style={{ fontSize: 12, fontWeight: 400 }}>
							{intl.formatMessage({ id: 'tuvan.form.onlyMyStudents' })}
						</Typography.Text>
					</Space>
				}
				rules={rules.required}
			>
				{onlyMyStudents ? (
					<Select
						showSearch
						loading={loadingOptions}
						placeholder={intl.formatMessage({ id: 'tuvan.form.studentPlaceholder' })}
						notFoundContent={intl.formatMessage({ id: 'tuvan.form.studentEmpty' })}
						filterOption={(input, option) => `${option?.label ?? ''}`.toLowerCase().includes(input.toLowerCase())}
						options={students.map((s) => ({
							value: s.studentSsoId,
							label: `${s.studentCode} - ${s.studentName}`,
						}))}
					/>
				) : (
					<SelectSinhVienDebounce />
				)}
			</Form.Item>

			<Form.Item name='slotId' label={intl.formatMessage({ id: 'tuvan.form.slot' })} rules={rules.required}>
				<Select
					showSearch
					loading={loadingOptions}
					placeholder={intl.formatMessage({ id: 'tuvan.form.slotPlaceholder' })}
					notFoundContent={intl.formatMessage({ id: 'tuvan.form.slotEmpty' })}
					filterOption={(input, option) => `${option?.label ?? ''}`.toLowerCase().includes(input.toLowerCase())}
					options={availableSlots.map((s) => ({ value: s._id, label: buildSlotLabel(intl, s) }))}
				/>
			</Form.Item>

			<Form.Item
				name='advisingType'
				label={intl.formatMessage({ id: 'tuvan.form.advisingType' })}
				rules={rules.required}
			>
				<Segmented
					block
					options={Object.values(AdvisingType).map((item) => ({
						label: intl.formatMessage({ id: ADVISING_TYPE_LABEL_KEY[item] }),
						value: item,
					}))}
				/>
			</Form.Item>

			<Form.Item
				name='topic'
				label={intl.formatMessage({ id: 'tuvan.form.topic' })}
				rules={[...rules.required, ...rules.length(TOPIC_MAX_LENGTH)]}
			>
				<Input.TextArea
					rows={3}
					maxLength={TOPIC_MAX_LENGTH}
					placeholder={intl.formatMessage({ id: 'tuvan.form.topicPlaceholder' })}
				/>
			</Form.Item>

			<div className='form-footer'>
				<Button type='primary' htmlType='submit' loading={formSubmiting}>
					{intl.formatMessage({ id: 'global.button.themmoi' })}
				</Button>
				<Button onClick={() => setVisibleForm(false)} disabled={formSubmiting}>
					{intl.formatMessage({ id: 'global.button.huy' })}
				</Button>
			</div>
		</Form>
	);
};

export default BookingFormContent;
