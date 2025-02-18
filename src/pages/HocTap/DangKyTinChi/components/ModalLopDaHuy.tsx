import ExpandText from '@/components/ExpandText';
import ButtonExtend from '@/components/Table/ButtonExtend';
import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import type { DangKyTinChi } from '@/services/DaoTao/DangKyTinChi/typing';
import { ELoaiLopHocPhan } from '@/services/HocTap/LopHocPhan/constant';
import { inputFormat } from '@/utils/utils';
import { ReloadOutlined, RetweetOutlined } from '@ant-design/icons';
import { Button, Modal, Popconfirm, Space } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import RenderLichHoc from './RenderLichHoc';

const ModalLopDaHuy = (props: { visible: boolean; setVisible: (val: boolean) => void }) => {
	const { visible, setVisible } = props;
	const { phieuDangKy, getLopDaHuyDangKyTinChiModel, danhSachLopDaHuy, loading, revertLopDangKyTinDaHuyModel } =
		useModel('daotao.dotdangkytinchi');
	const { tinhHocPhi } = useModel('taichinh.mucthuhocphi');

	const getData = () => phieuDangKy?._id && getLopDaHuyDangKyTinChiModel(phieuDangKy?._id);

	useEffect(() => {
		if (visible) getData();
	}, [phieuDangKy?._id, visible]);

	// const tongHocPhi = _.sumBy(danhSachLopDaHuy, (lop) =>
	// 	tinhHocPhi(lop?.lopHocPhan?.hocPhan?.soTinChi, lop.lopHocPhan.loai, lop?.lopHocPhan?.maNganh),
	// );

	const columnsLopHuy: IColumn<DangKyTinChi.AuditLog>[] = [
		{
			title: 'Mã HP',
			align: 'center',
			width: 80,
			render: (val, rec) => rec?.lopHpSv?.lopHocPhan?.maHocPhan,
		},
		{
			title: 'Tên học phần',
			width: 170,
			render: (val, rec) => rec?.lopHpSv?.lopHocPhan?.hocPhan?.ten,
		},
		{
			title: 'TT lớp',
			width: 80,
			align: 'center',
			render: (val, rec) =>
				`${rec?.lopHpSv?.lopHocPhan?.soThuTuLop}${
					rec.lopHpSv?.lopHocPhan?.soThuTuNhom ? ` (nhóm TH ${rec.lopHpSv?.lopHocPhan?.soThuTuNhom})` : ''
				}`,
		},
		{
			title: 'STC',
			width: 60,
			align: 'center',
			sortable: true,
			render: (val, rec) => (
				<>
					{rec?.lopHpSv?.lopHocPhan?.hocPhan?.soTinChi}{' '}
					{rec.lopHpSv?.lopHocPhan?.hocPhan?.loaiHocPhan?.isTinhSoTinChiDangKy === false ? <i>(không tính)</i> : null}
				</>
			),
		},
		{
			title: 'Giảng viên',
			width: 160,
			render: (val, rec) => (
				<ExpandText>
					{rec.lopHpSv?.lopHocPhan?.nhanSuList
						?.map((item) =>
							item.nhanSu?.ten ? `${item.nhanSu?.hoDem ?? ''} ${item.nhanSu?.ten ?? ''}` : item.tenNhanSu,
						)
						.join(', ')}
				</ExpandText>
			),
		},
		{
			title: 'Thông tin chi tiết',
			width: 250,
			render: (val, rec) => (
				<RenderLichHoc lopHocPhan={{ ...rec?.lopHpSv?.lopHocPhan, loai: ELoaiLopHocPhan.CHINH } as any} />
			),
		},

		{
			title: 'Học phí (dự kiến)',
			align: 'right',
			width: 120,
			render: (val, rec) => {
				const due = tinhHocPhi(rec.lopHpSv?.lopHocPhan?.hocPhan?.soTinChi, rec.lopHpSv?.loai, '');
				if (due) return `${inputFormat(due)} VND`;
				return null;
			},
		},
		{
			title: 'Hủy',
			width: 60,
			fixed: 'right',
			align: 'center',
			render: (val, rec) => (
				<Popconfirm
					title='Bạn có chắc chắn muốn hoàn lại đăng ký lớp tín chỉ này?'
					placement='topRight'
					onConfirm={() =>
						revertLopDangKyTinDaHuyModel(rec?._id, () => {
							getData();
						})
					}
				>
					<ButtonExtend icon={<RetweetOutlined />} danger type='link' tooltip='Hoàn tác' />
				</Popconfirm>
			),
		},
	];

	return (
		<Modal
			title='Danh sách lớp đã hủy đăng ký'
			visible={visible}
			onCancel={() => setVisible(false)}
			width={800}
			footer={null}
		>
			<TableStaticData
				columns={columnsLopHuy}
				data={danhSachLopDaHuy ?? []}
				addStt
				loading={loading}
				hasTotal
				otherProps={{ pagination: false, scroll: { y: 600 } }}
			>
				<Space wrap>
					<ButtonExtend icon={<ReloadOutlined />} onClick={getData}>
						Tải lại
					</ButtonExtend>
				</Space>
			</TableStaticData>

			<div className='form-footer'>
				<Button onClick={() => setVisible(false)}>Đóng</Button>
			</div>
		</Modal>
	);
};

export default ModalLopDaHuy;
