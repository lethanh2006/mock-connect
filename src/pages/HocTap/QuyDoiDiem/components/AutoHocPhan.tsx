import { EOperatorType } from '@/components/Table/constant';
import type { TFilter } from '@/components/Table/typing';
import type { QuyDoiDiem } from '@/services/HocTap/QuyDoiDiem/typing';
import { ETrangThaiHocPhanQuyDoi, type ETrinhDoMinhChungQuyDoiDiem } from '@/services/HocTap/constant';
import { AutoComplete, Spin } from 'antd';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

const AutoHocPhanQuyDoi = (props: {
	value?: string;
	onChange?: (val: string) => void;
	onSelect?: (val?: QuyDoiDiem.IQuyDoiDiemSinhVien) => void;
	trinhDoDaoTao?: ETrinhDoMinhChungQuyDoiDiem;
	tenTruong?: string;
}) => {
	const { getService: getAllSvQuyDoi } = useModel('daotao.quydoidiem.sinhvienquydoidiem');
	const [danhSachSVQuyDoi, setDanhSachSVQuyDoi] = useState<QuyDoiDiem.IQuyDoiDiemSinhVien[]>([]);
	const [filters, setFilters] = useState<TFilter<QuyDoiDiem.IQuyDoiDiemSinhVien>[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const { value, onSelect, onChange, trinhDoDaoTao, tenTruong } = props;

	const getHocPhan = (val?: ETrinhDoMinhChungQuyDoiDiem) => {
		setLoading(true);
		const payload = {
			condition: { trinhDoDaoTao, tenTruong, trangThai: ETrangThaiHocPhanQuyDoi.DA_RA_QUYET_DINH },
			filters,
			page: 1,
			limit: 20,
		};
		getAllSvQuyDoi(payload, 'page')
			.then((res) => {
				setDanhSachSVQuyDoi(res?.data?.data?.result ?? []);
			})
			.finally(() => setLoading(false));
	};

	useEffect(() => {
		getHocPhan();
	}, [filters, trinhDoDaoTao, tenTruong]);

	// TODO: Check search debounce
	const searchDebounceTenHocPhan = _.debounce((val) => {
		setFilters([{ active: true, field: 'tenHocPhan', values: [val], operator: EOperatorType.CONTAIN }]);
	}, 800);

	const onSelectTenHocPhan = (val: string) => {
		const temp = danhSachSVQuyDoi.find((item) => item.tenHocPhan === val);
		if (onSelect) onSelect(temp);
	};

	return (
		<AutoComplete
			value={value}
			onChange={onChange}
			notFoundContent={loading ? <Spin spinning={true} /> : undefined}
			onSearch={(val) => searchDebounceTenHocPhan(val)}
			onSelect={(val) => onSelectTenHocPhan(val)}
			placeholder='Nhập tên học phần'
			options={_.uniqBy(danhSachSVQuyDoi, (item) => item.tenHocPhan).map((item) => ({
				key: item._id,
				value: item.tenHocPhan,
				label: item.tenHocPhan,
			}))}
			allowClear
		/>
	);
};

export default AutoHocPhanQuyDoi;
