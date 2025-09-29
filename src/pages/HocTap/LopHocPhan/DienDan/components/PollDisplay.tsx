import { useState, useEffect, useMemo, useCallback } from 'react';
import {
	Button,
	Radio,
	Checkbox,
	Form,
	Progress,
	Space,
	Tag,
	Card,
	Typography,
	Avatar,
	Popover,
	message,
	Col,
	Row,
} from 'antd';
import moment from 'moment';
import { useModel } from '@@/plugin-model/useModel';
import type { BaiDang } from '@/services/HocTap/DienDan/BaiDang/typing';
import { exportPollData, votePoll } from '@/services/HocTap/DienDan/BaiDang/index';
import { ClockCircleOutlined, ExportOutlined } from '@ant-design/icons';
import fileDownload from 'js-file-download';
import groupBy from 'lodash/groupBy';
import '../style.less';

const { Text, Title } = Typography;

interface Props {
	baiDang: BaiDang.IRecord;
	getDataPost?: () => void;
}

const PollDisplay = ({ baiDang, getDataPost }: Props) => {
	const { initialState } = useModel('@@initialState');
	const [form] = Form.useForm();
	const currentUserSsoId = initialState?.currentUser?.ssoId;

	const [hasVoted, setHasVoted] = useState(false);
	const [isEditingVote, setIsEditingVote] = useState(false);
	const [userChoices, setUserChoices] = useState<string[]>([]);
	const [pollExpired, setPollExpired] = useState(false);

	const deriveUserChoices = useCallback(
		() =>
			baiDang?.isBinhChon && currentUserSsoId
				? baiDang.danhSachBinhChon?.filter((v) => v.ssoId === currentUserSsoId).map((v) => v.luaChonId) || []
				: [],
		[baiDang, currentUserSsoId],
	);

	useEffect(() => {
		if (!baiDang?.isBinhChon) {
			setHasVoted(false);
			setUserChoices([]);
			setPollExpired(false);
			setIsEditingVote(false);
			return;
		}
		const choices = deriveUserChoices();
		setHasVoted(choices.length > 0);
		setUserChoices(choices);
		setPollExpired(moment(baiDang.ngayKetThucBinhChon).isBefore(moment()));
		setIsEditingVote(false);
	}, [baiDang, deriveUserChoices]);

	useEffect(() => {
		if (isEditingVote && userChoices.length) {
			form.setFieldsValue({
				luaChon: baiDang.isChonNhieu ?? false ? userChoices : userChoices[0],
			});
		} else if (!hasVoted && !pollExpired) {
			form.resetFields();
		}
	}, [isEditingVote, userChoices, baiDang.isChonNhieu, hasVoted, pollExpired, form]);

	const handleVote = async (values: { luaChon: string | string[] }) => {
		const selected = Array.isArray(values.luaChon) ? values.luaChon : [values.luaChon];
		const res = await votePoll(baiDang._id, selected);
		if (res) {
			message.success('Bình chọn thành công!');
			setIsEditingVote(false);
			getDataPost?.();
		} else {
			message.error('Bình chọn thất bại!');
		}
	};

	const votesPerOption = useMemo(() => {
		const grouped = groupBy(baiDang?.danhSachBinhChon, 'luaChonId');
		const optionVotes =
			baiDang?.danhSachLuaChon?.map((o) => {
				const voters = grouped[o._id] || [];
				return { ...o, count: voters.length, voters };
			}) || [];
		const maxVotes = Math.max(...optionVotes.map((o) => o.count), 0);
		return optionVotes
			.map((o) => ({ ...o, percentage: maxVotes ? (o.count / maxVotes) * 100 : 0 }))
			.sort((a, b) => b.count - a.count);
	}, [baiDang]);

	const ChuaBinhChonText = ({ count }: { count: number | undefined }) => (
		<Text style={{ marginTop: 8 }}>
			Chưa bình chọn: <Text strong>{count}</Text>
		</Text>
	);

	const renderUserAvatars = (users: any[]) =>
		users?.length ? (
			<Popover
				content={
					<div className='poll-display-userlist'>
						{users.map((u) => (
							<div key={u.ssoId} className='user-item'>
								<Avatar size='small' src={u.avatar}>
									{!u.avatar && u.hoTen?.[0]}
								</Avatar>
								<Text className='user-name'>{u.hoTen}</Text>
							</div>
						))}
					</div>
				}
				trigger='click'
				placement='topLeft'
			>
				<Space style={{ cursor: 'pointer' }}>
					<Avatar.Group maxCount={3} size='small'>
						{users.map((u) => (
							<Avatar key={u.ssoId} src={u.avatar}>
								{!u.avatar && u.hoTen?.[0]}
							</Avatar>
						))}
					</Avatar.Group>
					<Text type='secondary'>{users.length} người</Text>
				</Space>
			</Popover>
		) : (
			<Text type='secondary'>0 người</Text>
		);

	const handleExportData = async () => {
		try {
			const res = await exportPollData(baiDang._id);
			fileDownload(res.data, `Kết quả bình chọn ${baiDang.tieuDe}.xlsx`);
		} catch {
			message.error('Xuất dữ liệu thất bại');
		}
	};

	const renderChoices = (isMultiple: boolean) =>
		isMultiple ? (
			<Checkbox.Group style={{ width: '100%' }}>
				<Space direction='vertical' style={{ width: '100%' }}>
					{votesPerOption.map((o) => (
						<Checkbox key={o._id} value={o._id}>
							<Space>
								<Text>{o.noiDung}</Text>
								{!baiDang.anDanh ? renderUserAvatars(o.voters) : <Text type='secondary'>{o.count} người</Text>}
							</Space>
						</Checkbox>
					))}
				</Space>
			</Checkbox.Group>
		) : (
			<Radio.Group style={{ width: '100%' }}>
				<Space direction='vertical' style={{ width: '100%' }}>
					{votesPerOption.map((o) => (
						<Radio key={o._id} value={o._id}>
							<Space>
								<Text>{o.noiDung}</Text>
								{!baiDang.anDanh ? renderUserAvatars(o.voters) : <Text type='secondary'>{o.count} người</Text>}
							</Space>
						</Radio>
					))}
				</Space>
			</Radio.Group>
		);

	return (
		<Card
			size='small'
			className='poll-display-card'
			title={<Title level={5}>Bình chọn</Title>}
			extra={
				<Space size='small' wrap>
					<ClockCircleOutlined style={{ fontSize: 12 }} />
					<Text type='secondary'>Kết thúc: {moment(baiDang.ngayKetThucBinhChon).format('HH:mm DD/MM/YYYY')}</Text>
					{pollExpired && <Tag color='error'>Đã kết thúc</Tag>}
				</Space>
			}
		>
			{(!hasVoted || isEditingVote) && !pollExpired ? (
				<Form form={form} size='small' onFinish={handleVote}>
					<Form.Item name='luaChon'>{renderChoices(baiDang.isChonNhieu ?? false)}</Form.Item>
					<Space align='center' style={{ marginTop: 8 }}>
						<Button type='primary' htmlType='submit' size='small'>
							{hasVoted ? 'Cập nhật' : 'Bình chọn'}
						</Button>
						<ChuaBinhChonText count={baiDang.soNguoiChuaBinhChon} />
					</Space>
				</Form>
			) : (
				<Space direction='vertical' style={{ width: '100%' }}>
					{votesPerOption.map((o) => (
						<div key={o._id}>
							<Space style={{ justifyContent: 'space-between', width: '100%' }}>
								<Text>{o.noiDung}</Text>
								{!baiDang.anDanh ? renderUserAvatars(o.voters) : <Text type='secondary'>{o.count} người</Text>}
							</Space>
							<Progress percent={+o.percentage.toFixed(1)} size='small' />
						</div>
					))}
					<ChuaBinhChonText count={baiDang.soNguoiChuaBinhChon} />
					<Row gutter={8}>
						{!pollExpired && (
							<Col>
								<Button
									type='primary'
									size='small'
									onClick={() => {
										setIsEditingVote(true);
										form.setFieldsValue({
											luaChon: userChoices.length
												? baiDang.isChonNhieu ?? false
													? userChoices
													: userChoices[0]
												: undefined,
										});
									}}
								>
									Thay đổi
								</Button>
							</Col>
						)}
						<Col>
							<Button type='default' size='small' onClick={handleExportData} icon={<ExportOutlined />}>
								Xuất dữ liệu
							</Button>
						</Col>
					</Row>
				</Space>
			)}
		</Card>
	);
};

export default PollDisplay;
