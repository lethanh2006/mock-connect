import { Select } from 'antd';
import React, { useEffect } from 'react';
import { useModel } from 'umi';

/**
 * Secect Căn cứ pháp lý để cho vào FormItem
 */
const SelectHocKy = (props: {
	value?: string;
	onChange?: (id: string) => void;
	multiple?: boolean;
	disabled?: boolean;
	allowClear?: boolean;
	style?: React.CSSProperties;
	isSetRecord?: boolean;
	selectMa?: boolean;
	/** Nếu căn cứ từ lớp hành chính thì chỉ lọc những HK có `sinh viên học kỳ`, còn ko mặc định sẽ lấy toàn bộ học kỳ theo `Khóa ngành` */
	fromLhc?: boolean;
}) => {
	const { value, onChange, multiple, allowClear, style, isSetRecord, selectMa, disabled, fromLhc = false } = props;
	const { danhSach, getAllModel, loading, setRecord, record, danhSachHkLhc, setDanhSach, setDanhSachHkLhc } =
		useModel('daotao.hocky');
	const danhSachHienThi = fromLhc ? danhSachHkLhc : danhSach;

	useEffect(() => {
		// Đảm bảo chỉ get học kỳ 1 lần
		if (!danhSachHienThi.length) {
			getAllModel(
				!!isSetRecord,
				{ ma: -1 },
				undefined,
				undefined,
				fromLhc ? 'lop-hanh-chinh/sinh-vien/me' : 'sinh-vien/me',
				false,
			).then((res) => {
				if (fromLhc) setDanhSachHkLhc(res);
				else setDanhSach(res);

				if (isSetRecord) {
					// Nếu record._id không tồn tại hoặc không nằm trong danh sách
					const exist = record?._id && res.some((i) => i._id === record._id);
					if (!exist) {
						const hocKy = res.find((i) => i.kyHienTai) ?? res?.[0];
						setRecord(hocKy);
					}
				}
			});
		} else {
			// Set lại record nếu record hiện tại ko có trong danh sách
			if (isSetRecord) {
				const exist = record?._id && danhSachHienThi.some((i) => i._id === record._id);
				if (!exist) {
					const hocKy = danhSachHienThi.find((i) => i.kyHienTai) ?? danhSachHienThi?.[0];
					setRecord(hocKy);
				}
			}
		}
	}, [fromLhc]);

	return (
		<Select
			mode={multiple ? 'multiple' : undefined}
			disabled={disabled}
			value={value}
			onChange={onChange}
			options={danhSachHienThi.map((item) => ({
				key: item._id,
				value: selectMa ? item.ma : item._id,
				label: `${item.ten}`,
			}))}
			showSearch
			optionFilterProp='label'
			placeholder='Chọn học kỳ'
			allowClear={allowClear ?? false}
			style={{ width: '100%', ...style }}
			loading={loading}
		/>
	);
};

export default SelectHocKy;
