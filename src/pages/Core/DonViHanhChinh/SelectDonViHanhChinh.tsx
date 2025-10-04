import { getPhuongXa } from '@/services/Core/DonViHanhChinh';
import { type DonViHanhChinh } from '@/services/Core/DonViHanhChinh/typing';
import rules from '@/utils/rules';
import { Col, Form, Input, Row, Select, type FormInstance } from 'antd';
import { useEffect, useState } from 'react';

const SelectDonViHanhChinh = (props: {
	form: FormInstance<any>;
	suffix?: 'NoiSinh' | 'ThuongTru' | 'QueQuan' | 'KhaiBao' | 'NguoiThan';
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
	initialValue?: DonViHanhChinh.IDataInit;
	hasLabel?: boolean;
	keyValue?: keyof DonViHanhChinh.IRecord;
}) => {
	const {
		form,
		suffix,
		listTinh,
		hasSoNha,
		hideTinh,
		// hideQuanHuyen,
		hideXaPhuong,
		hasLabel,
		keyValue = 'tenDonVi',
	} = props;
	const [idTinh, setIdTinh] = useState<string | undefined>(props?.initialValue?.tinhTp);
	// const [idHuyen, setIdHuyen] = useState<string | undefined>(props?.initialValue?.quanHuyen);
	// const [listHuyen, setListHuyen] = useState<DonViHanhChinh.IRecord[]>([]);
	const [listXa, setListXa] = useState<DonViHanhChinh.IRecord[]>([]);

	const onchangeTinhThanhPho = (e: string) => {
		setIdTinh(e);
		form.setFieldsValue({
			[suffix ? 'quanHuyen' + suffix : 'quanHuyen']: undefined,
			[suffix ? 'xaPhuong' + suffix : 'xaPhuong']: undefined,

			[suffix ? 'maTinhTp' + suffix : 'maTinhTp']: e,
		});
	};

	const onchangePhuongXa = (e: string) => {
		form.setFieldsValue({
			[suffix ? 'maXaPhuong' + suffix : 'maXaPhuong']: e,
		});
	};

	// const onchangeQuanHuyen = (e: string) => {
	// 	setIdHuyen(e);
	// 	form.setFieldsValue({ [suffix ? 'xaPhuong' + suffix : 'xaPhuong']: undefined });
	// };

	// useEffect(() => {
	// 	if (idTinh)
	// 		getQuanHuyen(idTinh).then((data) => {
	// 			setListHuyen(data.data.data);
	// 		});
	// }, [idTinh]);

	useEffect(() => {
		if (idTinh)
			getPhuongXa(idTinh).then((data) => {
				setListXa(data.data.data);
			});
	}, [idTinh]);

	return (
		<Row gutter={[12, 0]}>
			{!hideTinh && (
				<Col span={12}>
					<Form.Item
						name={suffix ? 'tinhTp' + suffix : 'tinhTp'}
						label={hasLabel ? 'Tỉnh/Thành phố' : undefined}
						initialValue={props.initialValue?.tinhTp}
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

					<Form.Item name={suffix ? 'maTinhTp' + suffix : 'maTinhTp'} />
				</Col>
			)}
			{/* {!hideQuanHuyen && (
				<Col span={8}>
					<Form.Item
						initialValue={props.initialValue?.quanHuyen}
						name={suffix ? 'quanHuyen' + suffix : 'quanHuyen'}
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
			)} */}

			{!hideXaPhuong && (
				<Col span={12}>
					<Form.Item
						initialValue={props.initialValue?.xaPhuong}
						name={suffix ? 'xaPhuong' + suffix : 'xaPhuong'}
						rules={props.notRequiredXaPhuong === true ? [] : [...rules.required]}
						label={hasLabel ? 'Xã/Phường/Đặc khu' : undefined}
					>
						<Select
							placeholder='Chọn phường/xã/đặc khu'
							allowClear
							showSearch
							options={(listXa ?? []).map((item) => ({
								key: item.ma,
								value: item[keyValue],
								label: item.tenDonVi,
							}))}
							optionFilterProp='label'
							onChange={(val, opt: any) => onchangePhuongXa(opt?.key)}
						/>
					</Form.Item>

					<Form.Item name={suffix ? 'maXaPhuong' + suffix : 'maXaPhuong'} />
				</Col>
			)}
			{hasSoNha ? (
				<Col span={24}>
					<Form.Item
						name={suffix ? 'soNhaTenDuong' + suffix : 'soNhaTenDuong'}
						initialValue={props.initialValue?.soNhaTenDuong}
						rules={[...(props.notRequiredDiaChiCuThe ? [] : rules.required), ...rules.text, ...rules.length(250)]}
						label={hasLabel ? 'Số nhà, đường phố' : undefined}
					>
						<Input placeholder='Nhập số nhà/tên đường' />
					</Form.Item>
				</Col>
			) : null}
		</Row>
	);
};

export default SelectDonViHanhChinh;
