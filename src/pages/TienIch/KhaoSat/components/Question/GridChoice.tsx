import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';
import { type BieuMau } from '@/services/TienIch/KhaoSat/BieuMau/typing';
import { Checkbox, Form } from 'antd';
import { useState } from 'react';

const GridChoice = (props: {
	question: BieuMau.CauHoi;
	indexKhoi: number;
	indexCauHoi: number;
	listLuaChonBang: BieuMau.LuaChonBangRecord[][];
	setListLuaChonBang: any;
	setErr?: any;
	traLoi?: any;
}) => {
	const [isSubmit, setIsSubmit] = useState<boolean>(false);
	const fieldName = props.indexKhoi || props.indexCauHoi;

	const handleCheckDapAn = (idCot: string, idHang: string): boolean => {
		let check = false;
		props?.traLoi?.listLuaChonBang?.forEach((val: { idHang: string; idCot: string }) => {
			if (val?.idHang === idHang && val?.idCot === idCot) {
				check = true;
			}
		});
		return check;
	};

	const onChange = (e: any, idHang: string, idCot: string) => {
		const listTemp =
			props?.question?.loai === 'GridSingleChoice'
				? props.listLuaChonBang?.[fieldName]?.filter(
						(item: { idHang: string; idCot: string }) => item?.idHang !== idHang,
				  ) ?? []
				: props.listLuaChonBang?.[fieldName] ?? [];
		const check = e.target.checked;
		const record = { ...props.listLuaChonBang };
		if (check) {
			listTemp.push({ idHang, idCot });
			record[fieldName] = listTemp;
			props.setListLuaChonBang(record);
		} else {
			record[fieldName] =
				props?.question?.loai === 'GridSingleChoice'
					? listTemp
					: listTemp?.filter((item: { idCot: string; idHang: string }) => item.idCot !== idCot);
			props.setListLuaChonBang(record);
		}
		// console.log('fieldName', fieldName);
		// console.log('idCot', idCot);
		// console.log('idHang', idHang);
		// console.log('record cc', record);
		// console.log('listTemp', listTemp);
		// console.log(
		// 	'listTemp FF',
		// 	listTemp?.filter((item: { idCot: string; idHang: string }) => item.idCot !== idCot),
		// );
		if (!props.setErr) return;
		if (props.question.batBuoc && record[fieldName].length !== props.question.luaChonHang.length) {
			props?.setErr(true);
		} else {
			props?.setErr(false);
		}
	};

	const columns: IColumn<any>[] = [
		{
			title: 'Nội dung',
			dataIndex: 'tieuChi',
			width: 250,
			fixed: 'left',
		},
	];

	props?.question?.luaChonCot?.forEach((item) => {
		columns.push({
			key: item._id,
			title: item.noiDung,
			dataIndex: 'idHang',
			align: 'center',
			width: 80,
			render: (val: string) => {
				const luaChon = props?.listLuaChonBang?.[fieldName]?.find(
					(ele) => ele.idHang === val && ele.idCot === item._id,
				);
				return props?.question?.loai === 'GridSingleChoice' ? (
					<Checkbox
						checked={!!luaChon?.idHang || handleCheckDapAn(item?._id, val)}
						onChange={(e) => onChange(e, val, item._id)}
					/>
				) : (
					<Checkbox checked={handleCheckDapAn(item?._id, val)} onChange={(e) => onChange(e, val, item._id)} />
				);
			},
		});
	});

	const data = props?.question?.luaChonHang?.map((hang) => ({
		tieuChi: hang.noiDung,
		idHang: hang._id,
	}));

	const isRequired = !props.listLuaChonBang?.[fieldName] || props.listLuaChonBang?.[fieldName]?.length === 0;
	// props.listLuaChonBang?.[fieldName]?.length !== props.question.luaChonHang.length;

	return (
		<Form.Item
			extra={
				props.question.batBuoc && isSubmit && isRequired ? (
					<span style={{ color: '#FF4D4F' }}>Bắt buộc</span>
				) : undefined
			}
			rules={
				props.question.batBuoc
					? [
							{
								validator: (_: any, value, callback) => {
									if (isRequired) {
										callback('');
										setIsSubmit(true);
									} else {
										setIsSubmit(false);
									}
									callback();
								},
							},
					  ]
					: []
			}
			name={fieldName}
		>
			<TableStaticData otherProps={{ pagination: false }} data={data} columns={columns} hasTotal />
		</Form.Item>
	);
};

export default GridChoice;
