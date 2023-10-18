import { useState } from 'react';
import SelectHocKy from './SelectHocKy';
import { useModel } from 'umi';
import { Button, Space, Tooltip } from 'antd';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import SelectNamHoc from '../NamHoc/Select';

const FilterHocKy = (props: { width?: number; isSetHocKy?: boolean; allowClear?: boolean }) => {
	const { record: recHocKy, danhSach: danhSachHocKy, setRecord: setHocKy } = useModel('daotao.hocky');
	const [namHocId, setNamHocId] = useState<string>();
	const [visibleOption, setVisibleOption] = useState(false);
	const width = props.width ?? 250;

	return (
		<Space wrap>
			{visibleOption ? (
				<>
					<Tooltip title='Ẩn bộ lọc'>
						<Button icon={<MinusOutlined />} onClick={() => setVisibleOption(false)} type='dashed' />
					</Tooltip>
					<SelectNamHoc style={{ width }} allowClear value={namHocId} onChange={(val) => setNamHocId(val)} />
				</>
			) : (
				<Tooltip title='Mở rộng bộ lọc'>
					<Button icon={<PlusOutlined />} onClick={() => setVisibleOption(true)} type='dashed' />
				</Tooltip>
			)}

			<SelectHocKy
				style={{ width }}
				allowClear={props.allowClear}
				condition={{ namHocId, active: true }}
				value={recHocKy?._id}
				onChange={(val) => setHocKy(danhSachHocKy.find((item) => item._id === val))}
				isSetRecord={props.isSetHocKy && (!!namHocId || !recHocKy?._id)}
			/>
		</Space>
	);
};

export default FilterHocKy;
