import MyDatePicker from '@/components/MyDatePicker';
import { AdvisingMode } from '@/services/TuVan/constant';
import type { TuVan } from '@/services/TuVan/typing';
import dayjs from '@/utils/dayjs';
import { getDateTimeFormat } from '@/utils/formatDate';
import rules from '@/utils/rules';
import { range, resetFieldsForm } from '@/utils/utils';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Col, Form, Input, InputNumber, Row, Segmented, Typography } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import './SlotFormContent.less';

const VN_TZ = 'Asia/Ho_Chi_Minh';
/** Format trung gian dùng để truyền qua lại giữa MyDatePicker và form state — không mang ý nghĩa múi giờ. */
const WALL_CLOCK_FORMAT = 'YYYY-MM-DDTHH:mm:ss';

/** Ghép chuỗi giờ VN người dùng chọn thành ISO UTC — BE xử lý thuần UTC+0, không tự quy đổi. */
const toUtcIso = (wallClock?: string) =>
	wallClock ? dayjs.tz(wallClock, WALL_CLOCK_FORMAT, VN_TZ).toISOString() : undefined;

/** Chuyển ISO UTC lưu trong form state thành chuỗi giờ VN để MyDatePicker hiển thị đúng. */
const fromUtcIso = (isoUtc?: string) => (isoUtc ? dayjs(isoUtc).tz(VN_TZ).format(WALL_CLOCK_FORMAT) : undefined);

/** "Bây giờ" theo giờ VN, ở dạng Dayjs local — cùng hệ quy chiếu với giá trị hiển thị trong MyDatePicker. */
const nowVnWallClock = () => dayjs(dayjs().tz(VN_TZ).format(WALL_CLOCK_FORMAT), WALL_CLOCK_FORMAT);

/** Chặn chọn ngày đã trôi qua (ca tư vấn trong quá khứ là vô nghĩa). */
const disabledPastDate = (current?: any) => !!current && dayjs(current).isBefore(nowVnWallClock(), 'day');

/** Với ngày hôm nay: chặn luôn giờ/phút đã trôi qua; ngày khác không giới hạn. */
const disabledPastTime = (current?: any) => {
	const now = nowVnWallClock();
	if (!current || !dayjs(current).isSame(now, 'day')) return {};
	return {
		disabledHours: () => range(0, now.hour()),
		disabledMinutes: (selectedHour: number) => (selectedHour === now.hour() ? range(0, now.minute()) : []),
	};
};

const getDurationMinutes = (startAt?: string, endAt?: string): number | null => {
	if (!startAt || !endAt) return null;
	const minutes = dayjs(endAt).diff(dayjs(startAt), 'minute');
	return minutes > 0 ? minutes : null;
};

type FieldNameProps = {
	form: ReturnType<typeof Form.useForm>[0];
	startAtName: string | (string | number)[];
	endAtName: string | (string | number)[];
};

/** Caption nhỏ hiển thị thời lượng tính từ 2 field ngày-giờ, không phải input, không chiếm chỗ label riêng. */
const DurationCaption: React.FC<FieldNameProps> = ({ form, startAtName, endAtName }) => {
	const intl = useIntl();

	return (
		<Form.Item shouldUpdate noStyle>
			{() => {
				const minutes = getDurationMinutes(form.getFieldValue(startAtName), form.getFieldValue(endAtName));
				return (
					<Typography.Text type='secondary' style={{ fontSize: 12 }}>
						{intl.formatMessage({ id: 'tuvan.form.durationLabel' })}:{' '}
						{minutes != null ? intl.formatMessage({ id: 'tuvan.form.minutesValue' }, { value: minutes }) : '—'}
					</Typography.Text>
				);
			}}
		</Form.Item>
	);
};

type SlotCellFieldsProps = {
	form: ReturnType<typeof Form.useForm>[0];
	namePrefix?: number;
	endAtRule: (startAtName: string | (string | number)[]) => { validator: (_: any, value?: string) => Promise<void> };
};

/** Path tương đối — dùng cho `name`/`dependencies` của Form.Item, antd tự cộng path của Form.List chứa nó. */
const withPrefix = (namePrefix: number | undefined, field: string) =>
	namePrefix != null ? [namePrefix, field] : field;

/** Path tuyệt đối từ root form — bắt buộc phải dùng khi gọi `form.getFieldValue()` trực tiếp, vì hàm này
 * không tự biết đang đứng trong `Form.List name='items'` như JSX prop `name` làm được. */
const absolutePath = (namePrefix: number | undefined, field: string) =>
	namePrefix != null ? ['items', namePrefix, field] : field;

/** Bộ field của 1 ca tư vấn (dùng chung cho edit 1 ca, và cho từng card khi tạo hàng loạt). */
const SlotCellFields: React.FC<SlotCellFieldsProps> = ({ form, namePrefix, endAtRule }) => {
	const intl = useIntl();
	const modeName = withPrefix(namePrefix, 'mode');
	// Form.useWatch cũng là API mệnh lệnh như getFieldValue — cần path tuyệt đối, không tự cộng path Form.List.
	const mode = Form.useWatch(absolutePath(namePrefix, 'mode'), form) ?? AdvisingMode.OFFLINE;
	const startAtName = withPrefix(namePrefix, 'startAt');
	const endAtName = withPrefix(namePrefix, 'endAt');
	const startAtAbsolute = absolutePath(namePrefix, 'startAt');
	const endAtAbsolute = absolutePath(namePrefix, 'endAt');

	return (
		<Row gutter={[12, 0]}>
			<Col span={24} md={10}>
				<Form.Item
					name={modeName}
					label={intl.formatMessage({ id: 'tuvan.form.mode' })}
					rules={rules.required}
					initialValue={AdvisingMode.OFFLINE}
				>
					<Segmented
						block
						options={Object.values(AdvisingMode).map((item) => ({
							label: intl.formatMessage({ id: `tuvan.mode.${item}` }),
							value: item,
						}))}
					/>
				</Form.Item>
			</Col>
			<Col span={24} md={6}>
				<Form.Item
					name={withPrefix(namePrefix, 'capacity')}
					label={intl.formatMessage({ id: 'tuvan.form.capacity' })}
					rules={rules.required}
					initialValue={1}
				>
					<InputNumber min={1} max={100} style={{ width: '100%' }} />
				</Form.Item>
			</Col>
			<Col span={24} md={8}>
				{/* 1 field UI duy nhất, đổi tên/nhãn theo mode — khi submit map ra đúng field BE cần:
				    OFFLINE gửi `location`, ONLINE gửi `meetingLink`, không gửi cả 2 (xem onFinish). */}
				<Form.Item
					name={withPrefix(namePrefix, 'locationOrLink')}
					label={intl.formatMessage({
						id: mode === AdvisingMode.ONLINE ? 'tuvan.form.locationOnline' : 'tuvan.form.locationOffline',
					})}
					rules={mode === AdvisingMode.ONLINE ? [...rules.required, ...rules.httpLink] : rules.required}
				>
					<Input
						placeholder={intl.formatMessage({
							id:
								mode === AdvisingMode.ONLINE
									? 'tuvan.form.locationOnlinePlaceholder'
									: 'tuvan.form.locationOfflinePlaceholder',
						})}
					/>
				</Form.Item>
			</Col>

			<Col span={24} md={12}>
				<Form.Item
					name={startAtName}
					label={intl.formatMessage({ id: 'tuvan.form.startAt' })}
					rules={rules.required}
					normalize={toUtcIso}
					getValueProps={(val?: string) => ({ value: fromUtcIso(val) })}
					style={{ marginBottom: 4 }}
				>
					<MyDatePicker
						showTime
						saveFormat={WALL_CLOCK_FORMAT}
						format={getDateTimeFormat()}
						disabledDate={disabledPastDate}
						disabledTime={disabledPastTime}
					/>
				</Form.Item>
			</Col>
			<Col span={24} md={12}>
				<Form.Item
					name={endAtName}
					label={intl.formatMessage({ id: 'tuvan.form.endAt' })}
					dependencies={[startAtName]}
					rules={[...rules.required, endAtRule(startAtAbsolute)]}
					normalize={toUtcIso}
					getValueProps={(val?: string) => ({ value: fromUtcIso(val) })}
					style={{ marginBottom: 4 }}
				>
					<MyDatePicker
						showTime
						saveFormat={WALL_CLOCK_FORMAT}
						format={getDateTimeFormat()}
						disabledDate={disabledPastDate}
						disabledTime={disabledPastTime}
					/>
				</Form.Item>
			</Col>
			<Col span={24}>
				<DurationCaption form={form} startAtName={startAtAbsolute} endAtName={endAtAbsolute} />
			</Col>

			<Col span={24} style={{ marginTop: 10, marginBottom: 10 }}>
				<Form.Item name={withPrefix(namePrefix, 'note')} noStyle>
					<Input.TextArea
						autoSize={{ minRows: 1, maxRows: 3 }}
						maxLength={500}
						placeholder={intl.formatMessage({ id: 'tuvan.form.note' })}
					/>
				</Form.Item>
			</Col>
		</Row>
	);
};

const SlotFormContent: React.FC = () => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const { record, edit, visibleForm, setVisibleForm, formSubmiting, putModel, createSlotsModel, getMyListModel } =
		useModel('tuvan.khadung');

	useEffect(() => {
		if (!visibleForm) {
			resetFieldsForm(form);
		} else if (edit && record?._id) {
			const mode = record.mode ?? AdvisingMode.OFFLINE;
			form.setFieldsValue({
				...record,
				mode,
				locationOrLink: mode === AdvisingMode.ONLINE ? record.meetingLink : record.location,
			});
		} else {
			form.setFieldsValue({ items: [{ mode: AdvisingMode.OFFLINE, capacity: 1 }] });
		}
	}, [record?._id, visibleForm, edit]);

	const endAtRule = (startAtName: string | (string | number)[]) => ({
		validator: (_: any, value?: string) => {
			const startAt = form.getFieldValue(startAtName);
			if (!value || !startAt || dayjs(value).isAfter(dayjs(startAt))) return Promise.resolve();
			return Promise.reject(intl.formatMessage({ id: 'tuvan.form.endAtBeforeStart' }));
		},
	});

	/** `location`/`meetingLink` loại trừ nhau theo mode — OFFLINE chỉ gửi `location`, ONLINE chỉ gửi `meetingLink`. */
	const buildCell = ({ locationOrLink, ...rest }: any): TuVan.ISlotCellInput => ({
		...rest,
		location: rest.mode === AdvisingMode.ONLINE ? undefined : locationOrLink,
		meetingLink: rest.mode === AdvisingMode.ONLINE ? locationOrLink : undefined,
	});

	const onFinish = async (values: any) => {
		if (edit) {
			const { items, ...cell } = values;
			await putModel(record?._id ?? '', buildCell(cell) as TuVan.IUpdateSlotRequest, getMyListModel);
		} else {
			const items = (values.items ?? []).map(buildCell);
			await createSlotsModel({ items } as TuVan.ICreateSlotRequest);
		}
	};

	return (
		<Form form={form} layout='vertical' onFinish={onFinish} className='tuvan-slot-form'>
			<div className='tuvan-slot-scroll'>
				{edit ? (
					<SlotCellFields form={form} endAtRule={endAtRule} />
				) : (
					<Form.List name='items' initialValue={[{ mode: AdvisingMode.OFFLINE, capacity: 1 }]}>
						{(fields, { add, remove }) => (
							<>
								{fields.map((field, index) => (
									<Card
										key={field.key}
										size='small'
										className='tuvan-slot-card'
										style={{ marginBottom: 12 }}
										title={intl.formatMessage({ id: 'tuvan.form.cardTitle' }, { index: index + 1 })}
										extra={
											<Button
												danger
												type='text'
												size='small'
												title={intl.formatMessage({ id: 'tuvan.form.removeSlot' })}
												icon={<DeleteOutlined />}
												onClick={() => remove(field.name)}
												disabled={fields.length <= 1}
											/>
										}
									>
										<SlotCellFields form={form} namePrefix={field.name} endAtRule={endAtRule} />
									</Card>
								))}

								<Button block onClick={() => add({ mode: AdvisingMode.OFFLINE, capacity: 1 })} icon={<PlusOutlined />}>
									{intl.formatMessage({ id: 'tuvan.form.addSlot' })}
								</Button>
							</>
						)}
					</Form.List>
				)}
			</div>

			<div className='form-footer'>
				<Button loading={formSubmiting} htmlType='submit' type='primary'>
					{edit
						? intl.formatMessage({ id: 'global.button.luulai' })
						: intl.formatMessage({ id: 'global.button.themmoi' })}
				</Button>
				<Button onClick={() => setVisibleForm(false)} disabled={formSubmiting}>
					{intl.formatMessage({ id: 'global.button.huy' })}
				</Button>
			</div>
		</Form>
	);
};

export default SlotFormContent;
