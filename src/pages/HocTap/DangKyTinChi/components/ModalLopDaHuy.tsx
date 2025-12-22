import ExpandText from '@/components/ExpandText';
import ButtonExtend from '@/components/Table/ButtonExtend';
import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import type { DangKyTinChi } from '@/services/DaoTao/DangKyTinChi/typing';
import { ELoaiLopHocPhan } from '@/services/HocTap/LopHocPhan/constant';
import { inputFormat } from '@/utils/utils';
import { RedoOutlined } from '@ant-design/icons';
import { Button, Modal, Popconfirm } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import RenderLichHoc from './RenderLichHoc';

const ModalLopDaHuy = (props: { visible: boolean; setVisible: (val: boolean) => void }) => {
	const intl = useIntl();

	const { visible, setVisible } = props;
	const { phieuDangKy, getLopDaHuyDangKyTinChiModel, danhSachLopDaHuy, loading, revertLopDangKyTinDaHuyModel } =
		useModel('daotao.dotdangkytinchi');
	const { tinhHocPhi } = useModel('taichinh.mucthuhocphi');
	const { record: recHocKy } = useModel('daotao.hocky');
	const { getLopDangKyModel } = useModel('daotao.dotdangkytinchi');

	const getDataDangKy = () => {
		if (recHocKy?.ma) {
			getLopDangKyModel(recHocKy.ma);
		}
	};

	const getDataHuy = () => {
		if (phieuDangKy?._id) {
			getLopDaHuyDangKyTinChiModel(phieuDangKy._id);
		}
	};

	useEffect(() => {
		if (visible) {
			getDataHuy();
		}
	}, [phieuDangKy?._id, visible]);

	// const tongHocPhi = _.sumBy(danhSachLopDaHuy, (lop) =>
	// 	tinhHocPhi(lop?.lopHocPhan?.hocPhan?.soTinChi, lop.lopHocPhan.loai, lop?.lopHocPhan?.maNganh),
	// );

	const columnsLopHuy: IColumn<DangKyTinChi.AuditLog>[] = [
		{
			title: intl.formatMessage({ id: 'dangkytinchi.modallophuy.columntable.mahp' }),
			align: 'center',
			dataIndex: ['response', 'data'],
			width: 80,
			render: (val: DangKyTinChi.ILopDangKy) => {
				return val?.lopHocPhan?.maHocPhan;
			},
		},
		{
			title: intl.formatMessage({ id: 'dangkytinchi.modallophuy.columntable.tenhocphan' }),
			dataIndex: ['response', 'data'],
			width: 170,
			render: (val: DangKyTinChi.ILopDangKy) => val?.lopHocPhan?.hocPhan?.ten,
		},
		{
			title: intl.formatMessage({ id: 'dangkytinchi.modallophuy.columntable.ttlop' }),
			width: 80,
			dataIndex: ['response', 'data'],
			align: 'center',
			render: (val: DangKyTinChi.ILopDangKy) =>
				`${val?.lopHocPhan?.soThuTuLop}${
					val?.lopHocPhan?.soThuTuNhom ? ` (nhóm TH ${val?.lopHocPhan?.soThuTuNhom})` : ''
				}`,
		},
		{
			title: intl.formatMessage({ id: 'dangkytinchi.modallophuy.columntable.sotinchi' }),
			width: 60,
			dataIndex: ['response', 'data'],
			align: 'center',
			sortable: true,
			render: (val: DangKyTinChi.ILopDangKy) => (
				<>
					{val?.lopHocPhan?.hocPhan?.soTinChi}{' '}
					{val?.lopHocPhan?.hocPhan?.loaiHocPhan?.isTinhSoTinChiDangKy === false ? (
						<i>{intl.formatMessage({ id: 'dangkytinchi.modallophuy.columntable.label.khongtinh' })}</i>
					) : null}
				</>
			),
		},
		{
			title: intl.formatMessage({ id: 'dangkytinchi.modallophuy.columntable.giangvien' }),
			dataIndex: ['response', 'data'],
			width: 160,
			render: (val: DangKyTinChi.ILopDangKy) => (
				<ExpandText>
					{val?.lopHocPhan?.nhanSuList
						?.map((item) =>
							item.nhanSu?.ten ? `${item.nhanSu?.hoDem ?? ''} ${item.nhanSu?.ten ?? ''}` : item.tenNhanSu,
						)
						.join(', ')}
				</ExpandText>
			),
		},
		{
			title: intl.formatMessage({ id: 'dangkytinchi.modallophuy.columntable.thongtinchitiet' }),
			dataIndex: ['response', 'data'],
			width: 250,
			render: (val: DangKyTinChi.ILopDangKy) => (
				<RenderLichHoc lopHocPhan={{ ...val?.lopHocPhan, loai: ELoaiLopHocPhan.CHINH } as any} />
			),
		},

		{
			title: intl.formatMessage({ id: 'dangkytinchi.modallophuy.columntable.hocphidukien' }),
			dataIndex: ['response', 'data'],
			align: 'right',
			width: 120,
			render: (val: DangKyTinChi.ILopDangKy) => {
				const due = tinhHocPhi(val?.lopHocPhan?.hocPhan?.soTinChi, val?.loai, null);
				if (due) {
					return `${inputFormat(due)} VND`;
				}
				return null;
			},
		},
		{
			title: intl.formatMessage({ id: 'dangkytinchi.modallophuy.columntable.thaotac' }),
			width: 60,
			dataIndex: ['response', 'data'],
			fixed: 'right',
			align: 'center',
			render: (val: DangKyTinChi.ILopDangKy, rec) => (
				<Popconfirm
					title={intl.formatMessage({ id: 'dangkytinchi.modallophuy.columntable.tooltip.banmuondangkylai' })}
					placement='topRight'
					onConfirm={() =>
						revertLopDangKyTinDaHuyModel(rec?._id, () => {
							getDataDangKy();
							getDataHuy();
						})
					}
				>
					<ButtonExtend
						icon={<RedoOutlined />}
						type='link'
						tooltip={intl.formatMessage({ id: 'dangkytinchi.modallophuy.columntable.btn.tooltip.hoantac' })}
					/>
				</Popconfirm>
			),
		},
	];

	return (
		<Modal
			title={intl.formatMessage({ id: 'dangkytinchi.modallophuy.title' })}
			open={visible}
			onCancel={() => setVisible(false)}
			width={1100}
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
				{/* <Space wrap>
					<ButtonExtend icon={<ReloadOutlined />} onClick={getDataHuy}>
						Tải lại
					</ButtonExtend>
				</Space> */}
			</TableStaticData>

			<div className='form-footer'>
				<Button onClick={() => setVisible(false)}>{intl.formatMessage({ id: 'dangkytinchi.action.dong' })}</Button>
			</div>
		</Modal>
	);
};

export default ModalLopDaHuy;
