import SelectHocKy from '@/pages/DaoTao/HocKy/SelectHocKy';
import { Space } from 'antd';
import { useIntl, useModel } from 'umi';
import SelectKyThi from './Select';

const FilterKyThi = () => {
	const intl = useIntl();
	const { record: recordKyThi, setRecord: setRecordKyThi, danhSach: danhSachKyThi } = useModel('khaothi.kythi');
	const { record: recordHocKy, setRecord: setRecordHocKy, danhSach: danhSachHocKy } = useModel('daotao.hocky');

	return (
		<Space className='filter-bar'>
			<SelectHocKy
				isSetRecord
				selectMa
				value={recordHocKy?.ma}
				onChange={(val) => {
					setRecordHocKy(danhSachHocKy.find((item) => item.ma === val));
					setRecordKyThi(undefined);
				}}
				className='field-w-250'
			/>
			{recordHocKy?._id ? (
				<SelectKyThi
					isSetRecord
					value={recordKyThi?._id}
					placeHolder={intl.formatMessage({ id: 'baithi.select.filterKyThi.placeholder' })}
					onChange={(val) => setRecordKyThi(danhSachKyThi.find((item) => item._id === val))}
					maHocKy={recordHocKy?.ma}
					style={{ width: 300 }}
					key={'kythi'}
				/>
			) : null}
		</Space>
	);
};

export default FilterKyThi;
