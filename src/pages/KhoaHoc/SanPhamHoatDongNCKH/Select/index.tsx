import { Button, Card } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import TableSanPhamNCKHStatic from './components/TableSanPhamNCKH';
interface IProps {
	select?: boolean;
	handleSelect?: (data: any) => void;
	loaiHinhActive: any;
}
const SelectSanPhamNCKH = (props: IProps) => {
	const { initialState } = useModel('@@initialState');
	const [dataSelect, setDataSelect] = useState<any>();
	const { danhSach, getAllModel, setRecordStatic, recordStatic } = useModel('khoahoc.loaihinhnckh');
	const { getAllModel: getAllDanhMucChung } = useModel('khoahoc.danhmuc.chung');
	const { getAllModel: getAllDanhMucVaiTro } = useModel('khoahoc.danhmuc.vaitro');
	const { getAllModel: getAllDanhMucNamHoc } = useModel('khoahoc.danhmuc.namhoc');
	useEffect(() => {
		getAllModel(true, { createdAt: -1 });
		getAllDanhMucChung();
		getAllDanhMucVaiTro();
		getAllDanhMucNamHoc();
	}, []);
	useEffect(() => {
		if (props?.loaiHinhActive) {
			const obj = danhSach.find((item) => item._id === props?.loaiHinhActive);
			setRecordStatic(obj);
		}
	}, [props?.loaiHinhActive]);
	return (
		<Card bodyStyle={{ paddingTop: 4 }} title={props?.select ? '' : 'Giao nộp sản phẩm NCKH'} bordered={!props?.select}>
			{recordStatic?._id && (
				<TableSanPhamNCKHStatic
					hasCreate
					hideFilterDonVi
					mode='sanpham'
					role='cbgv'
					paramCondition={{
						'danhSachThanhVien.ssoId': initialState?.currentUser?.ssoId,
					}}
					select={props?.select}
					handleSelect={(data) => {
						setDataSelect(data);
					}}
				/>
			)}
			<div style={{ display: 'flex', justifyContent: 'center' }}>
				<Button
					type={'primary'}
					onClick={() => {
						const arr = dataSelect?.map((val: any) => {
							return val?.thongTinKhaiBao;
						});
						// eslint-disable-next-line @typescript-eslint/no-unused-expressions
						props?.handleSelect && props?.handleSelect(arr);
					}}
				>
					Xác nhận
				</Button>
			</div>
		</Card>
	);
};

export default SelectSanPhamNCKH;
