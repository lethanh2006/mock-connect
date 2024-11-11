import SelectHocKy from '@/pages/DaoTao/HocKy/SelectHocKy';
import { Space } from 'antd';
import { useModel } from 'umi';
import SelectKyThi from './Select';

const FilterKyThi = () => {
	const { record: recordKyThi, setRecord: setRecordKyThi, danhSach: danhSachKyThi } = useModel('khaothi.kythi');
	const { record: recordHocKy, setRecord: setRecordHocKy, danhSach: danhSachHocKy } = useModel('daotao.hocky');

	return (
		<Space>
			<SelectHocKy
				isSetRecord
				selectMa
				value={recordHocKy?.ma}
				onChange={(val) => {
					setRecordHocKy(danhSachHocKy.find((item) => item.ma === val));
					setRecordKyThi(undefined);
				}}
				style={{ width: 250 }}
			/>
			{recordHocKy?._id ? (
				<SelectKyThi
					isSetRecord
					value={recordKyThi?._id}
					placeHolder='Lọc theo đợt thi'
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
