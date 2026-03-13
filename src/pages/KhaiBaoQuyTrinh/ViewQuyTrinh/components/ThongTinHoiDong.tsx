import { Collapse } from 'antd';
import HoiDongThamGia from '../../HoiDong';
import { useModel } from 'umi';
import { useEffect } from 'react';

const ThongTinHoiDong = (props: { maBuoc?: string; dotQuyTrinhId?: string; quyTrinhId?: string }) => {
	const { maBuoc, dotQuyTrinhId, quyTrinhId } = props;
	const { danhSach, getModel } = useModel('quytrinh.hoidong');
	useEffect(() => {
		getModel({ dotQuyTrinhId, maBuoc, quyTrinhId });
	}, [maBuoc, dotQuyTrinhId, quyTrinhId]);
	return danhSach.length ? (
		<Collapse ghost defaultActiveKey={'thongtinhoidong'}>
			<Collapse.Panel key={'thongtinhoidong'} header={<b>Thông tin hội đồng</b>}>
				<HoiDongThamGia viewTheoBuoc />
			</Collapse.Panel>
		</Collapse>
	) : null;
};

export default ThongTinHoiDong;
