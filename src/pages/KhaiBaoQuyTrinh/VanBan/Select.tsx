import { PlusOutlined } from '@ant-design/icons';
import { Button, Modal, Select, Spin } from 'antd';
import { CSSProperties, useEffect } from 'react';
import { useModel } from 'umi';
import FormVanBan from '@/pages/KhaiBaoQuyTrinh/VanBan/components/Form';

/**
 * Secect Căn cứ pháp lý để cho vào FormItem
 */
const SelectVanBan = (props: {
	value?: string;
	onChange?: any;
	multiple?: boolean;
	disabled?: boolean;
	loadData?: boolean;
	allowClear?: boolean;
	placeholder?: string;
	hienThiMaQuocTich?: boolean;
	hasCreate?: boolean;
	dataState?: string;
	style?: CSSProperties;
}) => {
	const { value, onChange, multiple, loadData, allowClear, placeholder, disabled, style, dataState, hasCreate } = props;
	const { danhSach, getAllModel, loading, setRecord, setEdit, setVisibleForm, visibleForm } = useModel(
		'quytrinh.vanban',
	);

	useEffect(() => {
		if (loadData !== false) getAllModel();
	}, []);
	const onAddNew = () => {
		setRecord(undefined);
		setEdit(false);
		setVisibleForm(true);
	};
	return (
		<>
			<div style={{ display: 'flex', gap: 8 }}>
				<Select
					notFoundContent={loading ? <Spin spinning={true} /> : undefined}
					mode={multiple ? 'multiple' : undefined}
					value={value}
					disabled={disabled}
					allowClear={allowClear}
					onChange={onChange}
					options={danhSach.map((item) => ({
						key: item._id,
						value: dataState ? item?.[dataState] : item._id,
						label: `${item?.ten}`,
					}))}
					style={style}
					showSearch
					optionFilterProp='label'
					placeholder={placeholder ?? 'Chọn văn bản'}
				/>
				{hasCreate ? (
					<>
						<Button icon={<PlusOutlined />} onClick={onAddNew} />
						<Modal
							destroyOnClose
							visible={visibleForm}
							bodyStyle={{ padding: 0 }}
							footer={null}
							onCancel={() => setVisibleForm(false)}
						>
							<FormVanBan />
						</Modal>
					</>
				) : null}
			</div>
		</>
	);
};

export default SelectVanBan;
