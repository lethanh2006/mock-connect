import ButtonExtend from '@/components/Table/ButtonExtend';
import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';
import { PhieuDangKyKTX } from '@/services/KyTucXa/PhieuDangKy/typing';
import { IconPencil01 } from '@/components/Icons';
import { Modal } from 'antd';
import { useIntl, useModel } from 'umi';
import Form from './Form';

export const SO_LIEN_HE_KHAN_CAP_MAC_DINH = 2;

export const normalizeThongTinLienHe = (value?: string) => value?.trim().toLowerCase();

export const normalizeSoDienThoaiLienHe = (value?: string) => normalizeThongTinLienHe(value)?.replace(/\s+/g, '');

export const FIELD_KIEM_TRA_TRUNG_LIEN_HE_KHAN_CAP = [
	{ key: 'emergencyContactName', normalize: normalizeThongTinLienHe },
	{ key: 'emergencyRelationship', normalize: normalizeThongTinLienHe },
	{ key: 'emergencyEmail', normalize: normalizeThongTinLienHe },
];

export const FIELD_SO_DIEN_THOAI_LIEN_HE_KHAN_CAP = ['emergencyContactNumber', 'secondaryContactNumber'];

const hasValue = (value?: string) => !!value?.trim();

export const isDuThongTinLienHeKhanCap = (rec?: PhieuDangKyKTX.INguoiThan) =>
	hasValue(rec?.emergencyContactName) &&
	hasValue(rec?.emergencyRelationship) &&
	hasValue(rec?.emergencyContactNumber) &&
	hasValue(rec?.address);

export const chuanHoaDanhSachLienHeKhanCap = (value?: PhieuDangKyKTX.INguoiThan[]) => {
	const danhSach = (value ?? []).map((item, index) => ({
		...item,
		index: item.index ?? index + 1,
	}));

	while (danhSach.length < SO_LIEN_HE_KHAN_CAP_MAC_DINH) {
		danhSach.push({
			khoiLienHeDefault: true,
			index: danhSach.length + 1,
		} as any);
	}

	return danhSach;
};

export const coThongTinLienHeBiTrung = (danhSach: PhieuDangKyKTX.INguoiThan[]) =>
	FIELD_KIEM_TRA_TRUNG_LIEN_HE_KHAN_CAP.some(({ key, normalize }) => {
		const values = danhSach.map((item: any) => normalize(item?.[key])).filter(Boolean);
		return new Set(values).size !== values.length;
	}) ||
	(() => {
		const soDienThoai = danhSach
			.flatMap((item: any) =>
				FIELD_SO_DIEN_THOAI_LIEN_HE_KHAN_CAP.map((field) => normalizeSoDienThoaiLienHe(item?.[field])),
			)
			.filter(Boolean);

		return new Set(soDienThoai).size !== soDienThoai.length;
	})();

const FormItemNguoiThanKTX = (props: {
	value?: PhieuDangKyKTX.INguoiThan[];
	onChange?: (data: PhieuDangKyKTX.INguoiThan[]) => void;
	disabled?: boolean;
}) => {
	const { setVisibleForm, visibleForm, record, handleEdit, setRecord, setEdit, setIsView } =
		useModel('kytucxa.nguoithan');
	const { value = [], onChange, disabled } = props;
	const intl = useIntl();

	// const onDelete = (index: number) => {
	// 	const data = [...value];
	// 	data.splice(index, 1);
	// 	if (onChange) onChange(data);
	// };

	//Check: nếu ko có thông tin người thân -> push object rỗng vào table để default 2 khối liên hệ trống
	const dataNguoiThan = chuanHoaDanhSachLienHeKhanCap(value);

	const getRelationshipLabel = (value?: string) => {
		switch (value) {
			case 'Father':
				return intl.formatMessage({ id: 'kytucxa.dangky.nguoithan.relationship.father' });
			case 'Mother':
				return intl.formatMessage({ id: 'kytucxa.dangky.nguoithan.relationship.mother' });
			case 'Guardian':
				return intl.formatMessage({ id: 'kytucxa.dangky.nguoithan.relationship.guardian' });
			case 'Sibling':
				return intl.formatMessage({ id: 'kytucxa.dangky.nguoithan.relationship.sibling' });
			case 'Child':
				return intl.formatMessage({ id: 'kytucxa.dangky.nguoithan.relationship.child' });
			case 'Spouse':
				return intl.formatMessage({ id: 'kytucxa.dangky.nguoithan.relationship.spouse' });
			case 'Other':
				return intl.formatMessage({ id: 'kytucxa.dangky.nguoithan.relationship.other' });
			default:
				return value;
		}
	};

	// Các trường bắt buộc theo isDuThongTinLienHeKhanCap: hiển thị cảnh báo rõ ràng khi thiếu,
	// tránh nhầm lẫn với các trường tùy chọn (SĐT phụ, email) cũng hiển thị "--" khi trống.
	const renderRequiredField = (val?: string) =>
		val ? (
			val
		) : (
			<span style={{ color: '#ff4d4f' }}>{intl.formatMessage({ id: 'kytucxa.dangky.card.chuaCapNhat' })}</span>
		);

	//Nếu là khối trống default -> thêm mới, nếu đã có data nhưng thiếu -> edit mode
	const onEdit = (rec: any) => {
		if (rec.khoiLienHeDefault) {
			setRecord({ index: rec.index } as PhieuDangKyKTX.INguoiThan);
			setEdit(false);
			setIsView(false);
			setVisibleForm(true);
		} else {
			handleEdit(rec);
		}
	};

	const onAdd = (rec: PhieuDangKyKTX.INguoiThan) => {
		const data = dataNguoiThan.filter((item: any) => !item.khoiLienHeDefault);
		if (!record?.index || record.index > dataNguoiThan.length) {
			data.push({ ...rec, index: data.length + 1 });
		} else {
			data.splice(record.index - 1, 1, { ...rec, index: record.index });
		}
		onChange?.(data);
		setVisibleForm(false);
	};

	const columns: IColumn<PhieuDangKyKTX.INguoiThan>[] = [
		{
			title: intl.formatMessage({ id: 'kytucxa.dangky.nguoithan.field.name' }),
			dataIndex: 'emergencyContactName',
			width: 190,
			render: (val) => renderRequiredField(val),
		},
		{
			title: intl.formatMessage({ id: 'kytucxa.dangky.nguoithan.field.relationship' }),
			dataIndex: 'emergencyRelationship',
			width: 160,
			render: (val) => renderRequiredField(getRelationshipLabel(val)),
		},
		{
			title: intl.formatMessage({ id: 'kytucxa.dangky.nguoithan.field.primaryPhone' }),
			dataIndex: 'emergencyContactNumber',
			width: 170,
			render: (val) => renderRequiredField(val),
		},
		{
			title: intl.formatMessage({ id: 'kytucxa.dangky.nguoithan.field.secondaryPhone' }),
			dataIndex: 'secondaryContactNumber',
			width: 190,
			render: (val) => val || '--',
		},
		{
			title: intl.formatMessage({ id: 'kytucxa.dangky.nguoithan.field.email' }),
			dataIndex: 'emergencyEmail',
			width: 220,
			render: (val) => val || '--',
		},
		{
			title: intl.formatMessage({ id: 'kytucxa.dangky.nguoithan.field.address' }),
			dataIndex: 'address',
			width: 260,
			render: (val) => renderRequiredField(val),
		},
		{
			title: intl.formatMessage({ id: 'kytucxa.lichsu.column.action' }),
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (_, rec) => (
				<>
					<ButtonExtend
						tooltip={intl.formatMessage({ id: 'global.button.chinhsua' })}
						type='link'
						disabled={disabled}
						// || isFilledColumn(rec)}
						onClick={() => onEdit(rec)}
						icon={<IconPencil01 />}
					/>
					{/* <Popconfirm
						onConfirm={() => onDelete(rec.index - 1)}
						title={intl.formatMessage({ id: 'quytrinhiso.hosoluu.formitem.confirm' })}
						placement='topLeft'
					>
						<ButtonExtend
							tooltip={intl.formatMessage({ id: 'global.button.xoa' })}
							danger
							type='link'
							icon={<DeleteOutlined />}
						/>
					</Popconfirm> */}
				</>
			),
		},
	];

	return (
		<>
			<TableStaticData
				data={dataNguoiThan}
				columns={columns}
				size='small'
				hasTotal
				addStt
				columnSetting={false}
				otherProps={{ pagination: false, scroll: { y: 400 } }}
			>
				{/* <Button
					icon={<PlusCircleOutlined />}
					onClick={() => {
						setRecord({} as PhieuDangKyKTX.INguoiThan);
						setEdit(false);
						setIsView(false);
						setVisibleForm(true);
					}}
					size='small'
					type='primary'
				>
					Thêm mới
				</Button> */}
			</TableStaticData>

			<Modal
				title={intl.formatMessage({ id: 'kytucxa.dangky.nguoithan.modal.title' })}
				open={visibleForm}
				width={600}
				footer={null}
				onCancel={() => setVisibleForm(false)}
			>
				<Form onOk={onAdd} danhSachNguoiThan={dataNguoiThan.filter((item: any) => !item.khoiLienHeDefault)} />
			</Modal>
		</>
	);
};

export default FormItemNguoiThanKTX;
