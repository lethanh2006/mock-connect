import { getPhuongXa, getQuanHuyen } from '@/services/Core/DonViHanhChinh';
import { type DonViHanhChinh } from '@/services/Core/DonViHanhChinh/typing';
import rules from '@/utils/rules';
import { Col, Form, Input, Row, Select, type FormInstance } from 'antd';
import { useEffect, useState } from 'react';

const SelectDonViHanhChinhTheoTen = (props: {
	form: FormInstance<any>;
	prefix: string[];
	listTinh?: DonViHanhChinh.IRecord[];
	hasSoNha?: boolean;
	disabled?: boolean;
	hideTinh?: boolean;
	hideQuanHuyen?: boolean;
	hideXaPhuong?: boolean;
	notRequiredTinh?: boolean;
	notRequiredQuanHuyen?: boolean;
	notRequiredXaPhuong?: boolean;
	notRequiredDiaChiCuThe?: boolean;
	hasLabel?: boolean;
	keyValue?: keyof DonViHanhChinh.IRecord;
}) => {
	const {
		form,
		prefix,
		listTinh,
		hasSoNha,
		hideTinh,
		hideQuanHuyen,
		hideXaPhuong,
		hasLabel,
		keyValue = 'tenDonVi',
	} = props;
	const [idTinh, setIdTinh] = useState<string | undefined>();
	const [idHuyen, setIdHuyen] = useState<string | undefined>();
	const [listHuyen, setListHuyen] = useState<DonViHanhChinh.IRecord[]>([]);
	const [listXa, setListXa] = useState<DonViHanhChinh.IRecord[]>([]);

	// const phanLoai = useWatch([prefix.join('.'), 'tenTinh'], form);

	const onchangeTinhThanhPho = (e: string) => {
		setIdTinh(e);
		form.setFieldsValue({
			[prefix.join('.')]: {
				tenPhuongXa: null,
				tenQuanHuyen: null,
			},
		});
	};

	const onchangeQuanHuyen = (e: string) => {
		setIdHuyen(e);
		form.setFieldsValue({
			[prefix.join('.')]: {
				tenPhuongXa: null,
			},
		});
	};

	useEffect(() => {
		if (idTinh)
			getQuanHuyen(idTinh).then((data) => {
				setListHuyen(data.data.data);
			});
	}, [idTinh]);

	useEffect(() => {
		if (idHuyen)
			getPhuongXa(idHuyen).then((data) => {
				setListXa(data.data.data);
			});
	}, [idHuyen]);

	return (
		<Row gutter={[12, 0]}>
			{!hideTinh && (
				<Col span={8}>
					<Form.Item
						name={[...prefix, 'tenTinh']}
						label={hasLabel ? 'Tỉnh/Thành phố' : undefined}
						rules={props.notRequiredTinh === true ? [] : [...rules.required]}
					>
						<Select
							placeholder='Chọn tỉnh/thành phố'
							options={listTinh?.map((item) => ({
								key: item.ma,
								value: item[keyValue],
								label: item.tenDonVi,
							}))}
							allowClear
							showSearch
							onChange={(val, opt: any) => onchangeTinhThanhPho(opt?.key)}
							optionFilterProp='label'
						/>
					</Form.Item>
				</Col>
			)}
			{!hideQuanHuyen && (
				<Col span={8}>
					<Form.Item
						name={[...prefix, 'tenQuanHuyen']}
						rules={props.notRequiredQuanHuyen === true ? [] : [...rules.required]}
						label={hasLabel ? 'Quận/Huyện' : undefined}
					>
						<Select
							placeholder='Chọn quận/huyện'
							options={(listHuyen ?? []).map((item) => ({
								key: item.ma,
								value: item[keyValue],
								label: item.tenDonVi,
							}))}
							allowClear
							showSearch
							onChange={(val, opt: any) => onchangeQuanHuyen(opt?.key)}
							optionFilterProp='label'
						/>
					</Form.Item>
				</Col>
			)}

			{!hideXaPhuong && (
				<Col span={8}>
					<Form.Item
						name={[...prefix, 'tenPhuongXa']}
						rules={props.notRequiredXaPhuong === true ? [] : [...rules.required]}
						label={hasLabel ? 'Phường/Xã' : undefined}
					>
						<Select
							placeholder='Chọn phường/xã'
							allowClear
							showSearch
							options={(listXa ?? []).map((item) => ({
								key: item.ma,
								value: item[keyValue],
								label: item.tenDonVi,
							}))}
							optionFilterProp='label'
						/>
					</Form.Item>
				</Col>
			)}
			{hasSoNha ? (
				<Col span={24}>
					<Form.Item
						name={[...prefix, 'soNhaTenDuong']}
						rules={[...(props.notRequiredDiaChiCuThe ? [] : rules.required), ...rules.text, ...rules.length(250)]}
						label={hasLabel ? 'Số nhà, đường phố' : undefined}
					>
						<Input.TextArea placeholder='Nhập số nhà/tên đường' />
					</Form.Item>
				</Col>
			) : null}
		</Row>
	);
};

export default SelectDonViHanhChinhTheoTen;
