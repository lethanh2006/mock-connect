import { textColors } from '@/services/base/constant';
import { DownOutlined } from '@ant-design/icons';
import { Select } from 'antd';
import { useEffect, type CSSProperties } from 'react';
import { useIntl, useModel } from 'umi';

/**
 * Select lớp học phần dạng breadcrumb (borderless + hiện tên học phần)
 */
const SelectLopHocPhanBreadcrumb = (props: {
	value?: string;
	onChange?: (lopHocPhanId: string) => void;
	style?: CSSProperties;
}) => {
	const { value, onChange, style } = props;
	const intl = useIntl();
	const { danhSach, sinhVienGetModel, record } = useModel('lophocphan.lophocphan');
	const { record: recHocKy } = useModel('daotao.hocky');

	useEffect(() => {
		if (recHocKy?.ma) {
			sinhVienGetModel({ maHocKy: recHocKy.ma });
		}
	}, [recHocKy?.ma]);

	const selected = danhSach.find((item) => item._id === value) ?? record;
	const selectedLabel = selected?.hocPhan?.ten || selected?.ten || undefined;

	return (
		<Select
			className='lhp-breadcrumb-select'
			variant='borderless'
			value={value}
			onChange={onChange}
			suffixIcon={<DownOutlined style={{ fontSize: 10, color: textColors.text400 }} />}
			options={danhSach.map((item) => ({
				key: item._id,
				value: item._id,
				label: item.hocPhan?.ten || item.ten,
				classCode: item.ten,
			}))}
			optionRender={(option) => (
				<div>
					<div>{option.data.label}</div>
					{option.data.classCode ? <div style={{ fontSize: 12, color: '#999' }}>{option.data.classCode}</div> : null}
				</div>
			)}
			labelRender={() => selectedLabel || intl.formatMessage({ id: 'lophocphan.chonLopTinChi' })}
			showSearch
			optionFilterProp='label'
			popupMatchSelectWidth={false}
			style={{ minWidth: 120, maxWidth: 320, ...style }}
			dropdownStyle={{ minWidth: 280 }}
			size='small'
		/>
	);
};

export default SelectLopHocPhanBreadcrumb;
