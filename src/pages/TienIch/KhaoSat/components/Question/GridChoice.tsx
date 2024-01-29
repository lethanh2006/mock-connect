import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';
import { type BieuMau } from '@/services/TienIch/KhaoSat/BieuMau/typing';
import { ELoaiCauHoi } from '@/services/TienIch/KhaoSat/constants';
import rules from '@/utils/rules';
import { Checkbox, Form, type FormInstance } from 'antd';
import { useEffect } from 'react';

const GridChoice = (props: { question: BieuMau.CauHoi; form: FormInstance; traLoi?: BieuMau.TraLoiRecord }) => {
	const { question, form, traLoi } = props;

	useEffect(() => {
		if (traLoi?.listLuaChonBang?.length) {
			const initialValues: Record<string, Record<string, boolean>> = {};
			traLoi?.listLuaChonBang?.forEach((item) => {
				const idHang = item.idHang;
				const idCot = item.idCot;
				if (!initialValues[idHang]) {
					initialValues[idHang] = {};
				}
				initialValues[idHang][idCot] = true;
			});

			form.setFieldsValue({ [question._id]: initialValues });
		} else {
		}
	}, [traLoi?.listLuaChonBang]);

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
					valuePropName='checked'
					rules={props.question.batBuoc ? [...rules.required] : []}
				>
					<Checkbox onChange={(e) => handleCheckboxChange(recHang._id ?? '', recCot._id, e.target.checked)} />
				</Form.Item>
			),
		});
	});

	// const isRequired = !props.listLuaChonBang?.[fieldName] || props.listLuaChonBang?.[fieldName]?.length === 0;

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
