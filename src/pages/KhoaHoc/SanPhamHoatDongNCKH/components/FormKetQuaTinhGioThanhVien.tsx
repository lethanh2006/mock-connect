import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import type { SanPhamNCKH } from '@/services/KhoaHoc/SanPhamNCKH/typings';
import rules from '@/utils/rules';
import { EditOutlined, DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Button, Card, Form, Modal, Popconfirm, Select, Space, Tooltip, message } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useModel } from 'umi';
import FormThongTinGio from './FormThongTinGio';

const FormKetQuaTinhGioThanhVien = (props: {
	onCancel: any;
	mode: 'handle' | 'view';
	fieldName: 'danhSachKetQuaQuyDoiGio' | 'danhSachKetQuaQuyDoiDiem';
	namHocId: string;
}) => {
	const [form] = Form.useForm();
	const {
		editKetQuaTinhGioThanhVien,
		setQuyDoiGio,
		quyDoiGio,
		setQuyDoiDiem,
		quyDoiDiem,
		record: recordSanPham,
		recordKetQuaTinhGioThanhVien,
		loading,
		setRecordThongTinGio,
		setEditThongTinGio,
		setRecordKetQuaTinhGioThanhVien,
	} = useModel('khoahoc.sanphamnckh');

	const [visibleThongTinGio, setVisibleThongTinGio] = useState<boolean>(false);

	useEffect(() => {
		form.setFieldsValue(
			recordKetQuaTinhGioThanhVien?.ssoId && editKetQuaTinhGioThanhVien ? recordKetQuaTinhGioThanhVien : form,
		);
	}, [recordKetQuaTinhGioThanhVien?.ssoId]);

	const onCancelFormThongTinGio = () => {
		setVisibleThongTinGio(false);
	};

	const isGio = props.fieldName === 'danhSachKetQuaQuyDoiGio';

	const columns: IColumn<SanPhamNCKH.ThongTinGio>[] = [
		// {
		// 	title: 'Số giờ cơ bản',
		// 	dataIndex: 'soGio',
		// 	align: 'center',
		// 	width: 100,
		// },
		// {
		// 	title: 'Hệ số',
		// 	dataIndex: 'heSo',
		// 	width: 120,
		// 	align: 'center',
		// },
		{
			title: `Số ${isGio ? 'giờ' : 'điểm'} quy đổi được`,
			align: 'center',
			dataIndex: 'tongGio',
			width: 150,
		},
		{
			title: 'Mô tả',
			align: 'center',
			dataIndex: 'moTa',
			width: 200,
		},
		{
			title: 'Ghi chú',
			align: 'center',
			dataIndex: 'ghiChu',
			width: 200,
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 60,
			hide: props.mode == 'view',
			fixed: 'right',
			render: (rec: SanPhamNCKH.ThongTinGio) => (
				<>
					<Tooltip title='Chỉnh sửa'>
						<Button
							onClick={() => {
								setVisibleThongTinGio(true);
								setRecordThongTinGio(rec);
								setEditThongTinGio(true);
							}}
							type='link'
							icon={<EditOutlined />}
						/>
					</Tooltip>

					<Tooltip title='Xóa'>
						<Popconfirm
							onConfirm={() => {
								if (recordKetQuaTinhGioThanhVien) {
									setRecordKetQuaTinhGioThanhVien({
										...recordKetQuaTinhGioThanhVien,
										danhSachThongTinGio: recordKetQuaTinhGioThanhVien?.danhSachThongTinGio
											?.map((item, index) => ({ ...item, index: index + 1 }))
											?.filter((item) => item.index !== rec.index),
									});
								}
							}}
							title='Bạn có chắc chắn muốn xóa ?'
							placement='topRight'
						>
							<Button danger type='link' icon={<DeleteOutlined />} />
						</Popconfirm>
					</Tooltip>
				</>
			),
		},
	];

	const tongGio = useMemo(() => {
		const tong = recordKetQuaTinhGioThanhVien?.danhSachThongTinGio?.reduce(
			(preVal, curVal) => preVal + curVal.tongGio,
			0,
		);
		return tong;
	}, [
		recordKetQuaTinhGioThanhVien?.ssoId,
		recordKetQuaTinhGioThanhVien?.danhSachThongTinGio?.map((item) => item.tongGio),
	]);

	return (
		<Card
			title={(editKetQuaTinhGioThanhVien ? 'Chỉnh sửa ' : 'Thêm mới ') + `tính ${isGio ? 'giờ' : 'điểm'} thành viên`}
		>
			<Form
				labelCol={{ span: 24 }}
				form={form}
				onFinish={(values) => {
					const quyDoiFinal = isGio ? quyDoiGio : quyDoiDiem;
					const listSsoId = editKetQuaTinhGioThanhVien
						? quyDoiFinal?.[props.namHocId].filter((item) => item.ssoId !== recordKetQuaTinhGioThanhVien?.ssoId)
						: quyDoiFinal?.[props.namHocId];

					if (listSsoId?.map((item) => item.ssoId)?.includes(values?.ssoId)) {
						message.error(`Thành viên đã tồn tại kết quả tính ${isGio ? 'giờ' : 'điểm'}`);
						return;
					}
					const payload = {
						...recordKetQuaTinhGioThanhVien,
						...values,
						tongGio: tongGio || 0,
					};
					if (editKetQuaTinhGioThanhVien && recordKetQuaTinhGioThanhVien) {
						const index = quyDoiFinal?.[props.namHocId]
							.map((item) => item.ssoId)
							.indexOf(recordKetQuaTinhGioThanhVien.ssoId);
						const quyDoiGioTemp = [...quyDoiFinal?.[props.namHocId]];
						quyDoiGioTemp.splice(index, 1, payload);
						if (isGio) setQuyDoiGio({ ...quyDoiGio, [props.namHocId]: quyDoiGioTemp });
						else setQuyDoiDiem({ ...quyDoiDiem, [props.namHocId]: quyDoiGioTemp });
					} else {
						if (isGio) setQuyDoiGio({ ...quyDoiGio, [props.namHocId]: [payload] });
						else setQuyDoiDiem({ ...quyDoiDiem, [props.namHocId]: [payload] });
					}
					message.success(editKetQuaTinhGioThanhVien ? 'Sửa thành công' : 'Thêm thành công');
					props.onCancel();
					// props.onChangeModeText('bấm "Lưu lại" để lưu lại các thay đổi mới nhất');
				}}
			>
				<Form.Item rules={[...rules.required]} label='Thành viên' name='ssoId'>
					<Select
						placeholder='Chọn thành viên'
						options={recordSanPham?.danhSachThanhVien?.map((item) => ({
							value: item.ssoId,
							label: `${item.hoVaTen} (${item.danhSachVaiTro.join(', ')})`,
						}))}
					/>
				</Form.Item>

				<div className='ant-descriptions-title' style={{ marginTop: 12, marginBottom: 12 }}>
					Danh sách thông tin tính {isGio ? 'giờ' : 'điểm'}
				</div>
				<TableStaticData
					otherProps={{ pagination: false }}
					totalComponent={
						<div className='total'>
							Tổng {isGio ? 'giờ' : 'điểm'}:<span>{tongGio || 0}</span>
						</div>
					}
					hasTotal
					size='small'
					columns={columns}
					data={
						recordKetQuaTinhGioThanhVien?.danhSachThongTinGio?.map((item, index) => ({ ...item, index: index + 1 })) ??
						[]
					}
					addStt
					loading={loading}
				>
					{props.mode === 'handle' && (
						<Space wrap>
							<Button
								size='small'
								type='primary'
								icon={<PlusCircleOutlined />}
								onClick={() => {
									setEditThongTinGio(false);
									setVisibleThongTinGio(true);
									setRecordThongTinGio(undefined);
								}}
							>
								Thêm mới
							</Button>
						</Space>
					)}
				</TableStaticData>

				<Modal
					width={700}
					visible={visibleThongTinGio}
					destroyOnClose
					footer={false}
					bodyStyle={{ padding: 0 }}
					onCancel={onCancelFormThongTinGio}
				>
					<FormThongTinGio fieldName={props.fieldName} onCancel={onCancelFormThongTinGio} />
				</Modal>

				<div className='form-footer'>
					{props.mode === 'handle' && (
						<Button htmlType='submit' type='primary'>
							{!editKetQuaTinhGioThanhVien ? 'Thêm mới' : 'Lưu lại'}
						</Button>
					)}

					<Button onClick={() => props.onCancel()}>Hủy</Button>
				</div>
			</Form>
		</Card>
	);
};

export default FormKetQuaTinhGioThanhVien;
