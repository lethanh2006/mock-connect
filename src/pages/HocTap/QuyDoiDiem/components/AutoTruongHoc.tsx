import type { ETrinhDoMinhChungQuyDoiDiem } from '@/services/HocTap/constant';
import { AutoComplete } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const AutoTruongHocQuyDoi = (props: {
	value?: string;
	onChange?: (val: string) => void;
	onSelect?: (val: string) => void;
	trinhDoDaoTao?: ETrinhDoMinhChungQuyDoiDiem;
}) => {
	const { selectTruongHocDebounceModel, dataAuto } = useModel('daotao.quydoidiem.sinhvienquydoidiem');
	const { value, onSelect, onChange, trinhDoDaoTao } = props;

	useEffect(() => {
		if (trinhDoDaoTao) selectTruongHocDebounceModel('tenTruong', { trinhDoDaoTao });
	}, [trinhDoDaoTao]);

	return (
		<AutoComplete
			filterOption={(inputValue, option) =>
				(option!.value as string).toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
			}
			value={value}
			onSelect={onSelect}
			onChange={onChange}
			placeholder='Nhập tên trường'
			options={dataAuto?.tenTruong
				?.filter((item) => item !== null)
				?.map((item) => ({
					key: item,
					value: item,
					label: item,
				}))}
			allowClear
		/>
	);
};

export default AutoTruongHocQuyDoi;
