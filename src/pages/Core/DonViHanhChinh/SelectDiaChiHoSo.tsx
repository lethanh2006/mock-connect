import { getPhuongXa, getQuanHuyen } from '@/services/Core/DonViHanhChinh';
import { type DonViHanhChinh } from '@/services/Core/DonViHanhChinh/typing';
import { SinhVien } from '@/services/DaoTao/SinhVien/typings';
import rules from '@/utils/rules';
import { Col, Form, Input, Select, Row } from 'antd';
import { useEffect, useState } from 'react';

/** Seclect Đơn vị hành chính cho Thông tin gia đình của hồ sơ sinh viên */
const SelectDiaChiHoSoFormItem = (props: {
	value?: SinhVien.TDiaChi;
	onChange?: (val?: Partial<SinhVien.TDiaChi>) => void;
	listTinh?: DonViHanhChinh.IRecord[];
	hasSoNha?: boolean;
	required?: boolean;
}) => {
	const { value, onChange, listTinh, hasSoNha,required } = props;
	const [listHuyen, setListHuyen] = useState<DonViHanhChinh.IRecord[]>([]);
	const [listXa, setListXa] = useState<DonViHanhChinh.IRecord[]>([]);

	const onChangeTinhThanhPho = (maTP?: string, tenTP?: string) => {
		if (onChange) onChange({ ...(value ?? {}), maTP, tenTP, maQH: undefined, maXaPhuong: undefined });
	};

	const onChangeQuanHuyen = (maQH?: string, tenQH?: string) => {
		if (onChange) onChange({ ...(value ?? {}), maQH, tenQH, maXaPhuong: undefined });
	};

	const onChangeXaPhuong = (maXaPhuong?: string, tenXaPhuong?: string) => {
		if (onChange) onChange({ ...(value ?? {}), maXaPhuong, tenXaPhuong });
	};

	const onChangeDiaChi = (diaChi?: string) => {
		if (onChange) onChange({ ...(value ?? {}), diaChi });
	};

	useEffect(() => {
		if (value?.maTP)
			getQuanHuyen(value?.maTP).then((data) => {
				setListHuyen(data.data.data);
			});
	}, [value?.maTP]);

	useEffect(() => {
		if (value?.maQH)
			getPhuongXa(value?.maQH).then((data) => {
				setListXa(data.data.data);
			});
	}, [value?.maQH]);

	return (
		<Row gutter={[12, 0]}>
			<Col span={12} md={hasSoNha ? 6 : 8}>
				<Form.Item label='Tỉnh/Thành phố' rules={required?[...rules.required]:[]}>
					<Select
						placeholder='Chọn tỉnh/thành phố'
						options={listTinh?.map((item) => ({
							key: item.ma,
							value: item.ma,
							label: item.tenDonVi,
						}))}
						value={value?.maTP}
						allowClear
						showSearch
						onChange={(val, opt: any) => onChangeTinhThanhPho(opt.value, opt.label)}
						optionFilterProp='label'
					/>
				</Form.Item>
			</Col>
			<Col span={12} md={hasSoNha ? 6 : 8}>
				<Form.Item label='Quận/Huyện' rules={required?[...rules.required]:[]}>
					<Select
						placeholder='Chọn quận/huyện'
						options={(listHuyen ?? []).map((item) => ({
							key: item.ma,
							value: item.ma,
							label: item.tenDonVi,
						}))}
						notFoundContent={!value?.maTP ? 'Chọn tỉnh/thành phố trước' : undefined}
						value={value?.maQH}
						allowClear
						showSearch
						onChange={(val, opt: any) => onChangeQuanHuyen(opt.value, opt.label)}
						optionFilterProp='label'
					/>
				</Form.Item>
			</Col>
			<Col span={12} md={hasSoNha ? 6 : 8}>
				<Form.Item label='Phường/Xã' rules={required?[...rules.required]:[]}>
					<Select
						placeholder='Chọn phường/xã'
						allowClear
						showSearch
						options={(listXa ?? []).map((item) => ({
							key: item.ma,
							value: item.ma,
							label: item.tenDonVi,
						}))}
						notFoundContent={!value?.maQH ? 'Chọn quận/huyện phố trước' : undefined}
						value={value?.maXaPhuong}
						onChange={(val, opt: any) => onChangeXaPhuong(opt.value, opt.label)}
						optionFilterProp='label'
					/>
				</Form.Item>
			</Col>
			{hasSoNha ? (
				<Col span={12} md={6}>
					<Form.Item label='Số nhà/Tên đường' rules={[...rules.text, ...rules.length(250)]}>
						<Input
							placeholder='Nhập số nhà/tên đường'
							value={value?.diaChi}
							onChange={(e) => onChangeDiaChi(e.target.value)}
						/>
					</Form.Item>
				</Col>
			) : null}
		</Row>
	);
};

export default SelectDiaChiHoSoFormItem;
