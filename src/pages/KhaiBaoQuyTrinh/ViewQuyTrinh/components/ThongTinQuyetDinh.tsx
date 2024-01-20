import { Collapse } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import QuanLyQuyetDinhGiao from '../../QuyetDinh';

const ThongTinQuyetDinh = (props: { maBuoc?: string; dotQuyTrinhId?: string }) => {
	const { maBuoc, dotQuyTrinhId } = props;
	const { danhSach, getModel } = useModel('quytrinh.quyetdinh');
	useEffect(() => {
		getModel({ dotQuyTrinhDongId: dotQuyTrinhId, maBuoc });
	}, [maBuoc, dotQuyTrinhId]);
	return danhSach.length ? (
		<Collapse ghost defaultActiveKey={'quyetdinh'}>
			<Collapse.Panel key={'quyetdinh'} header={<b>Thông tin quyết định</b>}>
				<QuanLyQuyetDinhGiao viewTheoBuoc />
			</Collapse.Panel>
		</Collapse>
	) : null;
};

export default ThongTinQuyetDinh;
