import { QuyTrinh } from '@/services/FormDong/QuyTrinh/typing';
import { Button, Select } from 'antd';
import { useModel } from 'umi';

const SelectMauDon = (props: {
	value?: string | null;
	onChange?: (val: string | null) => void;
	onChangeGetAllData?: (val: QuyTrinh.IMauDon) => void;
	multiple?: boolean;
	hasCreate?: boolean;
}) => {
	const { value, onChange, multiple, hasCreate, onChangeGetAllData } = props;
	const { record } = useModel('formdong.formdong');
	const { setRecord: setRecordLoaiHinh, setVisiblePreview } = useModel('quytrinh.loaihinh');
	return (
		<div style={{ display: 'flex', gap: 8 }}>
			<div className={hasCreate !== false ? 'width-select-custom' : 'fullWidth'}>
				<Select
					allowClear
					mode={multiple ? 'multiple' : undefined}
					value={value}
					onChange={(val) => {
						// eslint-disable-next-line @typescript-eslint/no-unused-expressions
						onChange && onChange(val);

						// eslint-disable-next-line @typescript-eslint/no-unused-expressions
						onChangeGetAllData &&
							onChangeGetAllData(
								record?.danhSachFormKhaiBao?.find((item) => {
									return item?.ma === val;
								}) as QuyTrinh.IMauDon,
							);
					}}
					options={record?.danhSachFormKhaiBao?.map((item) => ({
						key: item.ma,
						value: item.ma,
						label: (
							<span>
								{`${item.ten} (${item.ma})`} (
								<Button
									onClick={() => {
										const loaiHinh: any = item;
										setVisiblePreview(true);
										setRecordLoaiHinh(loaiHinh);
									}}
									style={{ padding: 0 }}
									type='link'
									size='small'
								>
									Chi tiết
								</Button>
								)
							</span>
						),
					}))}
					showSearch
					optionFilterProp='label'
					placeholder='Chọn mẫu đơn'
				/>
			</div>
		</div>
	);
};

export default SelectMauDon;
