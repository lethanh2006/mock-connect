import ButtonExtend from '@/components/Table/ButtonExtend';
import { resetFieldsForm } from '@/utils/utils';
import { DeleteOutlined, EditOutlined, MoreOutlined, PlusOutlined } from '@ant-design/icons';
import { Card, Dropdown, type FormInstance, Input, List, Menu, message, Modal, Spin, Typography } from 'antd';
import classNames from 'classnames';
import _ from 'lodash';
import { useModel } from 'umi';

const TheardsPage = (props: { form: FormInstance }) => {
	const { form } = props;
	const {
		recordUser,
		getThreadUserModel,
		dsThread,
		threadId,
		setThreadId,
		loadingThreads,
		updateTitleThreadModel,
		deleteThreadModel,
		getChiTietThreadModel,
	} = useModel('tienich.chatbotv2');

	return (
		<Card
			title='Thắc mắc Amin'
			bordered={false}
			style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
			extra={
				<ButtonExtend
					tooltip='Thêm mới'
					type='primary'
					icon={<PlusOutlined />}
					size='small'
					onClick={() => {
						setThreadId(null);
						resetFieldsForm(form);
					}}
				/>
			}
			bodyStyle={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
		>
			<div style={{ flex: 1, overflowY: 'auto' }}>
				<Spin spinning={loadingThreads} style={{ flex: 1 }}>
					<List
						dataSource={_.orderBy(dsThread, 'id') ?? []}
						renderItem={(conv) => (
							<List.Item
								key={conv.id}
								onClick={() => {
									setThreadId(conv.id);
									getChiTietThreadModel(conv.id);
								}}
								style={{
									cursor: 'pointer',
									padding: '12px',
									borderRadius: '8px',
									backgroundColor: threadId === conv.id ? '#f0f5ff' : 'transparent',
								}}
								className={classNames('thread-item', { active: threadId === conv.id })}
								actions={[
									<Dropdown
										key='actions'
										overlay={
											<Menu>
												<Menu.Item
													key='edit'
													icon={<EditOutlined />}
													onClick={(e) => {
														e.domEvent.stopPropagation();
														Modal.confirm({
															title: 'Đổi tiêu đề hội thoại',
															content: (
																<Input defaultValue={conv.title} onChange={(val) => (conv.title = val.target.value)} />
															),
															onOk: async () => {
																await updateTitleThreadModel({ thread_id: threadId, title: conv.title } as any, () =>
																	getThreadUserModel(recordUser?.id ?? 0),
																).then(() => {
																	message.success('Cập nhật thành công');
																});
															},
														});
													}}
												>
													Sửa tiêu đề
												</Menu.Item>
												<Menu.Item
													key='delete'
													icon={<DeleteOutlined />}
													onClick={(e) => {
														e.domEvent.stopPropagation();
														Modal.confirm({
															title: 'Xóa hội thoại',
															content: 'Bạn có chắc muốn xóa hội thoại này?',
															okText: 'Xóa',
															okButtonProps: { danger: true },
															onOk: async () => {
																await deleteThreadModel(conv.id, () => getThreadUserModel(recordUser?.id ?? 0)).then(
																	() => {
																		message.success('Đã xóa hội thoại');
																		setThreadId(null);
																	},
																);
															},
														});
													}}
												>
													Xóa
												</Menu.Item>
											</Menu>
										}
										trigger={['click']}
									>
										<MoreOutlined onClick={(e) => e.stopPropagation()} />
									</Dropdown>,
								]}
							>
								<List.Item.Meta
									title={
										<Typography.Text strong={threadId === conv.id} ellipsis>
											{conv.title}
										</Typography.Text>
									}
									// description={
									// 	<Typography.Text type='secondary' style={{ fontSize: 12 }}>
									// 		{moment(conv.updated_at).fromNow()}
									// 	</Typography.Text>
									// }
								/>
							</List.Item>
						)}
					/>
				</Spin>
			</div>
		</Card>
	);
};

export default TheardsPage;
