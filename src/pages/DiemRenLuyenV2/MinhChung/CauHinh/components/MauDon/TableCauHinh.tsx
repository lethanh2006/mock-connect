import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import type { LoaiHinh } from '@/services/FormDong/LoaiHinh/typing';
import type { QuyTrinh } from '@/services/FormDong/QuyTrinh/typing';
import { DeleteOutlined, EditOutlined, EyeOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Button, Modal, Popconfirm, Space, Tooltip } from 'antd';
import type { FormInstance } from 'antd/es/form/Form';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import FormCauHinh from './FormCauHinh';

const TableCauHinh = (props: { form: FormInstance; formValues: any; dataState?: string; dataSetState?: string }) => {
	const model = useModel('formdong.formdong');
	// @ts-ignore
	const recordMauDon = model?.[`${props?.dataState ?? 'recordMauDon'}`];
	// @ts-ignore
	const setRecordMauDon = model?.[`${props?.dataSetState ?? 'setRecordMauDon'}`];
	const { loading, setEditCauHinh, setRecordCauHinh } = useModel('formdong.formdong');

	const { setVisiblePreview, setRecord } = useModel('formdong.loaihinh');

	const [visibleCauHinh, setVisibleCauHinh] = useState<boolean>(false);

	const onCancelFormCauHinh = () => {
		setVisibleCauHinh(false);
	};

	const onSortEndCauHinh = (recordTemp: LoaiHinh.TruongThongTin, newIndex: number): void => {
		if (!recordMauDon) return;
		const cauHinhLoaiHinh =
			recordMauDon?.cauHinhLoaiHinh?.filter((item: { ma: string }) => item.ma !== recordTemp.ma) ?? [];
		cauHinhLoaiHinh?.splice(newIndex, 0, recordTemp);
		setRecordMauDon({ ...recordMauDon, cauHinhLoaiHinh });
	};

	const columns: IColumn<LoaiHinh.TruongThongTin>[] = [
		{
			title: 'Mã',
			dataIndex: 'ma',
			align: 'center',
			width: 100,
			filterType: 'string',
		},
		{
			title: 'Tên',
			dataIndex: 'ten',
			width: 170,
			filterType: 'string',
		},
		{
			title: 'Kiểu dữ liệu',
			align: 'center',
			dataIndex: 'kieuDuLieu',
			width: 100,
		},

		{
			title: 'Thao tác',
			align: 'center',
			width: 60,
			fixed: 'right',
			render: (rec: LoaiHinh.TruongThongTin) => (
				<>
					<Tooltip title='Chỉnh sửa'>
						<Button
							onClick={() => {
								setVisibleCauHinh(true);
								setRecordCauHinh(rec);
								setEditCauHinh(true);
							}}
							type='link'
							icon={<EditOutlined />}
						/>
					</Tooltip>

					<Tooltip title='Xóa'>
						<Popconfirm
							onConfirm={() => {
								if (recordMauDon) {
									setRecordMauDon({
										...recordMauDon,
										cauHinhLoaiHinh: recordMauDon?.cauHinhLoaiHinh?.filter((item) => item.ma !== rec.ma),
									});
									props.form.setFieldsValue({
										danhSachCotHienThi: props.formValues?.danhSachCotHienThi?.filter((item: string) => item !== rec.ma),
									});
								}
							}}
							title='Bạn có chắc chắn muốn xóa?'
							placement='topRight'
						>
							<Button danger type='link' icon={<DeleteOutlined />} />
						</Popconfirm>
					</Tooltip>
				</>
			),
		},
	];

	useEffect(() => {
		if (!recordMauDon) {
			// @ts-ignore
			setRecordMauDon({
				cauHinhLoaiHinh: [],
			} as QuyTrinh.IMauDon);
		}
	}, []);

	return (
		<div>
			<div className='ant-descriptions-title' style={{ marginTop: 12, marginBottom: 12 }}>
				Danh sách các trường thông tin
			</div>
			<TableStaticData
				otherProps={{ pagination: false }}
				onSortEnd={onSortEndCauHinh}
				rowSortable
				size='small'
				columns={columns}
				data={recordMauDon?.cauHinhLoaiHinh ?? []}
				addStt
				hasTotal
				loading={loading}
			>
				<Space wrap>
					<Button
						size='small'
						type='primary'
						icon={<PlusCircleOutlined />}
						onClick={() => {
							setRecordCauHinh(undefined);
							setEditCauHinh(false);
							setVisibleCauHinh(true);
						}}
					>
						Thêm mới
					</Button>
					<Button
						icon={<EyeOutlined />}
						size='small'
						onClick={() => {
							const record: any = recordMauDon;
							setVisiblePreview(true);
							setRecord(record);
						}}
					>
						Xem trước
					</Button>
				</Space>
			</TableStaticData>
			<Modal
				// zIndex={300}
				destroyOnClose
				width={700}
				footer={false}
				bodyStyle={{ padding: 0 }}
				visible={visibleCauHinh}
				onCancel={onCancelFormCauHinh}
			>
				<FormCauHinh onCancel={onCancelFormCauHinh} dataSetState={props?.dataSetState} dataState={props?.dataState} />
			</Modal>
		</div>
	);
};

export default TableCauHinh;
