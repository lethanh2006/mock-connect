import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';
import { type BieuMau } from '@/services/TienIch/KhaoSat/BieuMau/typing';
import { ELoaiCauHoi } from '@/services/TienIch/KhaoSat/constants';
import { Checkbox, Form, type FormInstance } from 'antd';

const GridChoice = (props: { question: BieuMau.CauHoi; form: FormInstance; disabled?: boolean }) => {
	const { question, form } = props;

	const handleCheckboxChange = (idHang: string, checkboxId: string, checked: boolean) => {
		if (question.loai === ELoaiCauHoi.GRID_SINGLE_CHOICE) {
			const updatedCheckedValues: Record<string, any> = {};
			question.luaChonCot.forEach((recCot) => {
				updatedCheckedValues[recCot._id] = recCot._id === checkboxId ? checked : undefined;
			});
			form.setFieldsValue({ [question._id]: { [idHang]: updatedCheckedValues } });
		}
	};

	const columns: IColumn<BieuMau.TGridItem>[] = [
		{
			title: 'Nội dung',
			dataIndex: 'noiDung',
			width: 250,
		},
	];

	question?.luaChonCot?.forEach((recCot) => {
		columns.push({
			key: recCot._id,
			title: recCot.noiDung,
			align: 'center',
			width: 120,
			render: (val, recHang) => (
				<Form.Item
					name={[question?._id, recHang._id, recCot._id]}
					initialValue={false}
					valuePropName='checked'
					rules={[
						{
							validator: async (_, value) => {
								const rowValues = form.getFieldValue([question?._id, recHang._id]);
								const selectedCheckboxes = Object.values(rowValues).filter((vals) => vals === true);

								if (question.batBuoc && !selectedCheckboxes.length) {
									return Promise.reject('Bắt buộc');
								} else {
									return Promise.resolve();
								}
							},
						},
					]}
				>
					<Checkbox
						disabled={props.disabled}
						onChange={(e) => handleCheckboxChange(recHang._id ?? '', recCot._id, e.target.checked)}
					/>
				</Form.Item>
			),
		});
	});

	return (
		<TableStaticData
			otherProps={{ pagination: false }}
			data={props?.question?.luaChonHang}
			columns={columns}
			addStt
			size='small'
		/>
	);
};

export default GridChoice;
