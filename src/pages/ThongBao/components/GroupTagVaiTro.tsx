import { TenVaiTroKhaoSat, EVaiTroKhaoSat } from '@/services/ThongBao/constant';
import { Chip, ChipGroup } from '@/components/Icons';
import _ from 'lodash';

const GroupTagVaiTro = (props: {
	value?: EVaiTroKhaoSat[];
	onChange?: (arr: EVaiTroKhaoSat[]) => void;
	listVaiTro?: EVaiTroKhaoSat[];
	disabled?: boolean;
}) => {
	const { value, onChange, disabled } = props;
	const listVaiTro = props.listVaiTro ?? Object.values(EVaiTroKhaoSat);

	const handleChange = (val: EVaiTroKhaoSat, checked: boolean) => {
		if (disabled) {
			return;
		}
		if (!checked) {
			const newVal = value?.filter((i) => i !== val) ?? [];
			if (onChange) onChange(newVal);
		} else {
			const find = value?.find((i) => i === val);
			if (!find && onChange) {
				const newVal = [...(value ?? []), val];
				onChange(newVal);
			}
		}
	};

	return (
		<ChipGroup className='lich-tuan-list'>
			{listVaiTro.map((item) => {
				const isSelected = value?.includes(item) || false;
				return (
					<Chip
						key={item}
						selected={isSelected}
						disabled={disabled}
						onClick={() => handleChange(item, !isSelected)}
					>
						{TenVaiTroKhaoSat[item]}
					</Chip>
				);
			})}
		</ChipGroup>
	);
};

export default GroupTagVaiTro;
