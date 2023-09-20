import { ELoaiDanhMucChungMappingToTitle, type ELoaiDanhMucChung } from '@/services/DiemRenLuyen/DanhMuc/constant';
import { type DanhMucDiemRenLuyen } from '@/services/DiemRenLuyen/DanhMuc/typing';
import { Select } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

export const SelectDanhMucDiemRenLuyen = (props: {
	value?: string;
	onChange?: (val: string) => void;
	multiple?: boolean;
	condition?: any;
	allowClear?: boolean;
	disabled?: boolean;
	readOnly?: boolean;
	loaiDanhMuc: ELoaiDanhMucChung;
	idKyTucXa?: string;
}) => {
	const { value, onChange, multiple, condition, allowClear, disabled, readOnly, loaiDanhMuc, idKyTucXa: idCha } = props;
	const { getAllModel, visibleForm } = useModel('diemrenluyen.danhmuc');

	const [state, setState] = useState<DanhMucDiemRenLuyen.IRecord[]>([]);

	useEffect(() => {
		if (visibleForm) {
			getAllModel(false, undefined, { ...condition, loai: loaiDanhMuc, idCha }, undefined, undefined, false).then(
				setState,
			);
		}
	}, [visibleForm, condition, loaiDanhMuc]);

	return (
		<Select
			mode={multiple ? 'multiple' : undefined}
			value={value}
			onChange={onChange}
			disabled={disabled}
			options={state.map((item) => ({
				key: item._id,
				value: item._id,
				label: item.ten,
			}))}
			removeIcon={readOnly ? null : undefined}
			showSearch
			optionFilterProp='label'
			placeholder={ELoaiDanhMucChungMappingToTitle[loaiDanhMuc]}
			allowClear={allowClear ?? false}
			style={{ width: '100%', pointerEvents: readOnly ? 'none' : undefined }}
		/>
	);
};
