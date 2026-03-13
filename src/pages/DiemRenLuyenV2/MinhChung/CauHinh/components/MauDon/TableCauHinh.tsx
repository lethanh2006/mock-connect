import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import type { LoaiHinh } from '@/services/FormDong/LoaiHinh/typing';
import type { QuyTrinh } from '@/services/FormDong/QuyTrinh/typing';
import { DeleteOutlined, EditOutlined, EyeOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Button, Modal, Popconfirm, Space, Tooltip } from 'antd';
import type { FormInstance } from 'antd/es/form/Form';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import FormCauHinh from './FormCauHinh';

const TableCauHinh = (props: { form: FormInstance; formValues: any; dataState?: string; dataSetState?: string }) => {
	const model = useModel('formdong.formdong');
	// @ts-ignore
	const recordMauDon = model?.[`${props?.dataState ?? 'recordMauDon'}`];
	// @ts-ignore
	const setRecordMauDon = model?.[`${props?.dataSetState ?? 'setRecordMauDon'}`];
	const { loading, setEditCauHinh, setRecordCauHinh } = useModel('formdong.formdong');
	const intl = useIntl();

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
			title: intl.formatMessage({ id: 'diemrenluyen.maudon.cot.ma' }),
			dataIndex: 'ma',
			align: 'center',
			width: 100,
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'diemrenluyen.maudon.cot.ten' }),
			dataIndex: 'ten',
			width: 170,
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'diemrenluyen.maudon.cot.kieudulieu' }),
			align: 'center',
			dataIndex: 'kieuDuLieu',
			width: 100,
		},

		{
			title: intl.formatMessage({ id: 'diemrenluyen.danhmuc.thaotac' }),
			align: 'center',
			width: 60,
			fixed: 'right',
			render: (rec: LoaiHinh.TruongThongTin) => (
				<>
					<Tooltip title={intl.formatMessage({ id: 'diemrenluyen.danhmuc.form.chinhsua' })}>
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

					<Tooltip title={intl.formatMessage({ id: 'diemrenluyen.danhmuc.xoa' })}>
						<Popconfirm
							onConfirm={() => {
								if (recordMauDon) {
									setRecordMauDon({
										...recordMauDon,
										cauHinhLoaiHinh: recordMauDon?.cauHinhLoaiHinh?.filter((item: LoaiHinh.TruongThongTin) => item.ma !== rec.ma),
									});
									props.form.setFieldsValue({
										danhSachCotHienThi: props.formValues?.danhSachCotHienThi?.filter((item: string) => item !== rec.ma),
									});
								}
							}}
							title={intl.formatMessage({ id: 'diemrenluyen.danhmuc.xacnhanxoa' })}
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
				{intl.formatMessage({ id: 'diemrenluyen.maudon.danhsachtruongthongtin' })}
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
						{intl.formatMessage({ id: 'diemrenluyen.danhmuc.form.themmoi' })}
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
						{intl.formatMessage({ id: 'diemrenluyen.maudon.xemtruoc' })}
					</Button>
				</Space>
			</TableStaticData>
			<Modal
				// zIndex={300}
				destroyOnClose
				width={700}
				footer={false}
				styles={{ body: { padding: 0 } }}
				open={visibleCauHinh}
				onCancel={onCancelFormCauHinh}
			>
				<FormCauHinh onCancel={onCancelFormCauHinh} dataSetState={props?.dataSetState} dataState={props?.dataState} />
			</Modal>
		</div>
	);
};

export default TableCauHinh;
