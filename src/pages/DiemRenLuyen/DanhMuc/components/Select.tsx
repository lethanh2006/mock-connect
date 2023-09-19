import { type ELoaiDanhMucChung, ELoaiDanhMucChungMappingToTitle } from '@/services/DiemRenLuyen/DanhMuc/constant';
import { Select } from 'antd';
import { useEffect } from 'react';
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
	const { danhSach, getAllModel, visibleForm } = useModel('diemrenluyen.danhmuc');

	useEffect(() => {
		if (!visibleForm) {
			getAllModel(false, undefined, { ...condition, loai: loaiDanhMuc, idCha });
		}
	}, [visibleForm, condition, loaiDanhMuc]);

	return (
		<Select
			mode={multiple ? 'multiple' : undefined}
			value={value}
			onChange={onChange}
			disabled={disabled}
			options={danhSach.map((item) => ({
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
