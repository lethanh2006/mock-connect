import { IconTrash, IconPencil01, IconPlus, IconDownload } from '@/components/Icons';
import { Button, Card, Collapse, Empty, Modal, Popconfirm, Spin, Tooltip } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import Form from '../QuyTrinhDong/QuanLyQuyTrinh/ThongKe/components/Form';
import ViewThongKe from '../QuyTrinhDong/QuanLyQuyTrinh/ThongKe/components/ViewThongKe';

const ThongKeBaoCao = () => {
	const {
		getAllModel,
		setEdit,
		setRecord: setRecordThongKe,
		setVisibleForm,
		visibleForm,
		danhSach: danhSachThongKe,
		handleEdit,
		deleteModel,
		getDataThongKeExcelModel,
		getDataThongKeDocxModel,
		loading,
	} = useModel('chedochinhsach.thongke');

	const getData = () => {
		getAllModel(false);
	};

	useEffect(() => {
		getData();
	}, []);

	return (
		<Card title='Thống kê'>
			<div style={{ marginBottom: 8 }}>
				<Button
					onClick={() => {
						setEdit(false);
						setRecordThongKe(undefined);
						setVisibleForm(true);
					}}
					style={{ marginLeft: 8 }}
					type='primary'
					icon={<IconPlus />}
				>
					Thêm mới
				</Button>
			</div>
			<Spin spinning={loading}>
				{danhSachThongKe?.length > 0 ? (
					<Collapse style={{ border: 'none' }}>
						{danhSachThongKe.map((item) => {
							return (
								<Collapse.Panel
									style={{ border: 'none', backgroundColor: '#f2f2f2', marginBottom: 8, borderRadius: 10 }}
									extra={
										<div style={{ display: 'flex', width: 100, justifyContent: 'space-between' }}>
											<Tooltip title='Xuất dữ liệu'>
												<Button
													loading={loading}
													onClick={(e) => {
														e.stopPropagation();
														if (item.fileId) getDataThongKeDocxModel(item.ten, item._id, { filters: [] });
														else getDataThongKeExcelModel(item.ten, item._id, { filters: [] });
													}}
													size='small'
													icon={<IconDownload />}
													type='link'
												/>
											</Tooltip>
											<Tooltip title='Chỉnh sửa'>
												<Button
													onClick={(e) => {
														e.stopPropagation();
														handleEdit(item);
													}}
													size='small'
													icon={<IconPencil01 />}
													type='link'
												/>
											</Tooltip>
											<Tooltip placement='bottom' title='Xóa'>
												<Popconfirm
													title='Bạn có chắc chắn muốn xóa?'
													onConfirm={() => {
														deleteModel(item._id, getData);
													}}
												>
													<Button
														onClick={(e) => {
															e.stopPropagation();
														}}
														size='small'
														icon={<IconTrash />}
														danger
														type='link'
													/>
												</Popconfirm>
											</Tooltip>
										</div>
									}
									header={item.ten}
									key={item._id}
								>
									<ViewThongKe type='CheDoChinhSach' idThongKe={item._id} />
								</Collapse.Panel>
							);
						})}
					</Collapse>
				) : (
					<>
						<Empty />
					</>
				)}
			</Spin>
			<Modal
				onCancel={() => setVisibleForm(false)}
				width={700}
				footer={false}
				styles={{ body: { padding: 0 } }}
				open={visibleForm}
			>
				<Form modelName={'chedochinhsach.thongke'} />
			</Modal>
		</Card>
	);
};

export default ThongKeBaoCao;
