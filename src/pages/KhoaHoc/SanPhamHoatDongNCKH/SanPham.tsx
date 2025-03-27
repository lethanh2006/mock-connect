import { Card, Col, Row, Tabs, Tooltip } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import TableSanPhamNCKH from './components/TableSanPhamNCKH';
import { ELoaiLoaiHinh } from '@/services/QuyTrinh/LoaiHinh/constants';
import { ETrangThaiSanPham } from '@/services/KhoaHoc/SanPhamNCKH/constants';

interface IProps {
	select?: boolean;
	handleSelect?: (data: any) => void;
}
const SanPhamNCKH = (props: IProps) => {
	// const { initialState } = useModel('@@initialState');
	const { danhSach, getAllModel, setRecord, record, setDanhSach } = useModel('khoahoc.loaihinhnckh');
	const { getAllModel: getAllDanhMucChung } = useModel('khoahoc.danhmuc.chung');
	const { getAllModel: getAllDanhMucVaiTro } = useModel('khoahoc.danhmuc.vaitro');

	useEffect(() => {
		getAllModel(false, { createdAt: -1 }, { loai: ELoaiLoaiHinh.SP });
		getAllDanhMucChung();
		getAllDanhMucVaiTro();

		return () => {
			setDanhSach([]);
			setRecord(undefined);
		};
	}, []);

	useEffect(() => {
		if (danhSach.length) setRecord(danhSach?.sort((a, b) => (a.ten > b.ten ? 1 : -1))?.[0]);
	}, [danhSach.length]);

	return (
		<Card bodyStyle={{ paddingLeft: 0 }} title={props?.select ? '' : 'Sản phẩm'} bordered={!props?.select}>
			<Row gutter={[4, 0]}>
				<Col xs={24} sm={24} md={6} xl={5} xxl={5}>
					<Tabs
						activeKey={record?._id}
						tabBarGutter={0}
						style={{ display: 'block', maxHeight: 500, overflowY: 'scroll' }}
						tabPosition='left'
						onChange={(val) => {
							setRecord(danhSach.find((item) => item._id === val));
						}}
					>
						{danhSach
							?.sort((a, b) => (a.ten > b.ten ? 1 : -1))
							?.map((item, index) => (
								<Tabs.TabPane
									tab={
										<div
											className='p-ellipsis'
											style={{
												textAlign: 'left',
												whiteSpace: 'break-spaces',
											}}
										>
											<Tooltip placement='right' title={item.ten}>
												{index + 1}. {item.ten}
											</Tooltip>
										</div>
									}
									tabKey={item._id}
									key={item._id}
								/>
							))}
					</Tabs>
				</Col>
				<Col xs={24} sm={24} md={18} xl={19} xxl={19}>
					{record?._id && (
						<TableSanPhamNCKH
							paramCondition={{
								trangThaiSanPham: { $nin: [ETrangThaiSanPham.DANG_THUC_HIEN] },
							}}
							// hasCreate
							// hideFilterDonVi
							mode='sanpham'
							role='cbgv'
							// paramCondition={{
							// 	'danhSachThanhVien.ssoId': initialState?.currentUser?.ssoId,
							// }}
							select={props?.select}
							handleSelect={props?.handleSelect}
						/>
					)}
				</Col>
			</Row>
		</Card>
	);
};

export default SanPhamNCKH;
