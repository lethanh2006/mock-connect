import PageCard from '@/components/PageCard';
import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Card, Col, Popconfirm, Row, Tooltip } from 'antd';
import { useModel } from 'umi';
import { formatDateTime } from '@/utils/formatDate';
import Form from './components/Form';

const ChucVuPage = () => {
	const { getModel, page, limit, deleteModel, handleEdit } = useModel('danhmuc.chucvu');

	const columns: IColumn<ChucVu.IRecord>[] = [
		{
			title: 'Mã',
			dataIndex: 'ma',
			width: 80,
			filterType: 'select',
			filterData: ['M01', 'M02', 'M03'],
			sortable: true,
			resizable: true,
		},
		{
			title: 'Tên chức vụ',
			dataIndex: 'ten',
			width: 250,
			minWidth: 150,
			maxWidth: 600,
			filterType: 'string',
			sortable: true,
			resizable: true,
		},
		{
			title: 'Ngày tạo',
			dataIndex: 'createdAt',
			align: 'center',
			width: 120,
			filterType: 'datetime',
			sortable: true,
			render: (val) => formatDateTime(val),
			resizable: true,
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (record: ChucVu.IRecord) => (
				<>
					<Tooltip title='Chỉnh sửa'>
						<Button onClick={() => handleEdit(record)} type='link' icon={<EditOutlined />} />
					</Tooltip>
					<Tooltip title='Xóa'>
						<Popconfirm
							onConfirm={() => deleteModel(record._id, getModel)}
							title='Bạn có chắc chắn muốn xóa chức vụ này?'
							placement='topLeft'
						>
							<Button danger type='link' icon={<DeleteOutlined />} />
						</Popconfirm>
					</Tooltip>
				</>
			),
		},
	];

	return (
		<div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
			{/* LEVEL 1: PageCard - The standard main page table wrapping */}
			<TableBase
				columns={columns}
				dependencies={[page, limit]}
				modelName='danhmuc.chucvu'
				title='Thử nghiệm PageCard Cấp 1'
				Form={Form}
				buttons={{ import: true, export: true }}
				level={1}
			/>

			{/* Grid display for Level 2 and Level 3 patterns */}
			<Row gutter={[24, 24]}>
				<Col span={8}>
					{/* LEVEL 2: PageCard Level 2 (Highlight) with Extra Button */}
					<PageCard
						title='Cấp 2 - Highlight'
						level={2}
            bordered
						extra={<Button type='primary' size='small'>Hành động</Button>}
					>
						<p>Sử dụng <strong>level=2</strong> mang lại giao diện có dấu tam giác nhỏ và tiêu đề 16px.</p>
						<p>Phù hợp cho các bảng dữ liệuliệu phụ.</p>
					</PageCard>
				</Col>

				<Col span={8}>
					{/* LEVEL 2: PageCard Level 2 (Highlight) with Bordered Mode */}
					<PageCard title='Cấp 2 - Có viền (Border)' level={2} bordered>
						<p>Sử dụng <code>bordered</code> để tạo khối nội dung phía trong có đường viền.</p>
						<p>Phù hợp cho các bảng dữ liệu mô phỏng hoặc form nhập liệu phụ.</p>
					</PageCard>
				</Col>

				<Col span={8}>
					{/* LEVEL 3: PageCard Level 3 (Normal Card) */}
					<PageCard title='Cấp 3 - Bình thường' level={3}>
						<p>Sử dụng <strong>level=3</strong> để có giao diện Card tiêu chuẩn không có tam giác.</p>
						{/* <p>Giúp đồng bộ việc sử dụng duy nhất một component <code>PageCard</code> cho cả project.</p> */}
					</PageCard>
				</Col>
			</Row>

			{/* Advanced: PageCard with hideInnerCard for complete layout freedom */}
			<Row gutter={[24, 24]}>
				<Col span={24}>
					<PageCard title='Ví dụ Level 1 với hideInnerCard={true}' level={1} hideInnerCard>
						<Row gutter={24}>
							<Col span={16}>
								<div style={{ padding: 24, background: '#fff', border: '1px solid #d9d9d9', borderRadius: 8 }}>
									<h3>Tự do thiết kế nội dung</h3>
									<p>Bằng cách bật <code>hideInnerCard</code>, nội dung sẽ không còn bị bọc bởi lớp Card phụ phía trong.</p>
									<p>Bạn có thể thoải mái chia Grid, Column hoặc đặt các component khác trực tiếp tại đây.</p>
								</div>
							</Col>
							<Col span={8}>
								<Card style={{ height: '100%' }} title="Widget đi kèm">
									Đây là một Card bình thường được đặt bên trong PageCard đã bật hideInnerCard.
								</Card>
							</Col>
						</Row>
					</PageCard>
				</Col>
			</Row>
		</div>
	);
};

export default ChucVuPage;
