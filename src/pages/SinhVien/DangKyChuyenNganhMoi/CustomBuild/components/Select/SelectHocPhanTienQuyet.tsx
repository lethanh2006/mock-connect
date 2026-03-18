import { ChuongTrinhDaoTao } from '@/services/DaoTao/ChuongTrinhDaoTao/typing';
import { TreeSelect } from 'antd';
import type { DataNode } from 'rc-tree-select/lib/interface';
import { useEffect, useMemo } from 'react';
import { useIntl, useModel } from 'umi';

function buildTreeData(list: ChuongTrinhDaoTao.IKhoiHpCt[]): {
	treeData: DataNode[];
	flatOptions: ChuongTrinhDaoTao.THocPhanTuongQuan[];
} {
	const flatOptions: ChuongTrinhDaoTao.THocPhanTuongQuan[] = [];
	const treeData: DataNode[] = [];

	list.forEach((item) => {
		const programName = item.chuongTrinhDaoTao?.ten ?? '';
		const childrenList = item.dsHocPhanTienQuyet || [];

		const childrenNodes: DataNode[] = [];

		childrenList.forEach((child: any) => {
			const { ma, ten, soTinChi } = child;

			if (ma) {
				flatOptions.push({
					ma,
					ten,
					soTinChi: soTinChi ?? 0,
				});

				childrenNodes.push({
					title: `${ten ?? ''} (${ma})`,
					value: ma,
					key: child._id ?? `${item._id}_${ma}`,
					isLeaf: true,
				});
			}
		});

		if (childrenNodes.length > 0) {
			treeData.push({
				title: programName,
				value: `group_${item._id ?? item.ma}`,
				key: `group_${item._id ?? item.ma}`,
				selectable: false,
				children: childrenNodes,
			});
		}
	});

	return { treeData, flatOptions };
}

const SelectHocPhanTienQuyet = (props: {
	maHocPhan?: string;
	value?: string | string[];
	onChange?: (val: string | string[]) => void;
	multiple?: boolean;
	allowClear?: boolean;
}) => {
	const { maHocPhan, value, onChange, multiple, allowClear } = props;
	const intl = useIntl();
	const { fetchKhoiHocPhanTienQuyet, dsKhoiHocPhanTienQuyet, loadingKhoiHocPhanTienQuyet } =
		useModel('daotao.chuongtrinhdaotao');

	useEffect(() => {
		if (!maHocPhan) {
			fetchKhoiHocPhanTienQuyet('');
			return;
		}

		fetchKhoiHocPhanTienQuyet(maHocPhan);
	}, [maHocPhan]);

	const { treeData } = useMemo(() => buildTreeData(dsKhoiHocPhanTienQuyet), [dsKhoiHocPhanTienQuyet]);

	return (
		<TreeSelect
			treeData={treeData}
			value={value}
			onChange={onChange}
			multiple={multiple}
			allowClear={allowClear ?? false}
			showSearch
			treeDefaultExpandAll
			placeholder={
				maHocPhan
					? intl.formatMessage({ id: 'minor.idm.select.placeholderPrerequisite' })
					: intl.formatMessage({ id: 'minor.idm.select.placeholderSelectMainFirst' })
			}
			style={{ width: '100%' }}
			loading={loadingKhoiHocPhanTienQuyet}
			disabled={!maHocPhan}
			treeNodeFilterProp='title'
		/>
	);
};

export default SelectHocPhanTienQuyet;
