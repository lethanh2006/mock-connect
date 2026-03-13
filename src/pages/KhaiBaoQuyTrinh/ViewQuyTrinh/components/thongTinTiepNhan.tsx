import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import ThongTinThanhToan from '@/pages/TaiChinh/HoaDon/ThanhToan/ThongTinThanhToan';
import { PhuongThucPhanCong } from '@/services/QuyTrinh/constant';
import { MapColorTrangThaiTiepNhanDon, TrangThaiTiepNhanDon } from '@/services/QuyTrinh/KhaiBao/constants';
import type { KhaiBaoQuyTrinh } from '@/services/QuyTrinh/KhaiBao/typings';
import type { QuyTrinh } from '@/services/QuyTrinh/typing';
import {
	EMauTrangThaiThanhToanTable,
	ETrangThaiThanhToan,
	type EMaTrangThaiThanhToan,
} from '@/services/TaiChinh/constant';
import { ETrangThaiChinhSuaNhanSu } from '@/services/ToChucNhanSu/constant';
import { useModel } from '@umijs/max';
import { Button, Collapse, Descriptions, Modal, Tag } from 'antd';
import { useState } from 'react';
import ViewFromCauHinh from './ViewFormCauHinh';

const ThongTinTiepNhan = (props: { data: KhaiBaoQuyTrinh.IBuocXuLy; modelName: any; isBuocNgoaiHeThong?: boolean }) => {
	const { data, modelName } = props;
	const model = useModel(modelName);
	const { dataQuyTrinh }: any = model;
	const [visibleModal, setVisibleModal] = useState<boolean>(false);
	const { getOneModel } = useModel('taichinh.hoadon');
	const { getAllModel: getAllNhanSu } = useModel('tochucnhansu.nhansu');
	const buocHienTai = dataQuyTrinh?.quyTrinh?.danhSachBuocXuLy?.find((item: { ma: string }) => item?.ma === data?.ma);
	const [recordBoPhanXuLy, setRecordBoPhanXuLy] = useState<QuyTrinh.IBoPhanXuLy>();
	const [visibleDanhSachCanBoXuLy, setVisibleDanhSachCanBoXuLy] = useState<boolean>(false);
	const [visibleThongTinDuyet, setVisibleThongTinDuyet] = useState<boolean>(false);
	const maFormTiepNhan = buocHienTai?.maFormTiepNhan;
	const cauHinhFormTiepNhan = dataQuyTrinh?.quyTrinh?.danhSachFormTiepNhan?.find(
		(item: { ma: string }) => item?.ma === maFormTiepNhan,
	)?.cauHinhLoaiHinh;
	const dataFormTiepNhan = dataQuyTrinh?.danhSachBuocXuLy?.find(
		(item: { ma: string }) => item.ma === buocHienTai?.ma,
	)?.thongTinTiepNhan;

	const columnCanBo: IColumn<QuyTrinh.IThanhVienXuLy>[] = [
		{
			title: 'Mã định danh',
			dataIndex: 'ma',
			width: 100,
			align: 'center',
		},
		{
			title: 'Họ và tên',
			dataIndex: 'ten',
			width: 150,
			align: 'center',
			filterType: 'string',
		},
		{
			title: 'Đơn vị',
			dataIndex: 'donVi',
			width: 150,
			align: 'center',
		},
	];

	return (
		<>
			<Collapse defaultActiveKey={['thongtinchung']} ghost>
				<Collapse.Panel style={{ padding: 0 }} key={'thongtinchung'} header={<b>Thông tin chung</b>}>
					<Descriptions column={2} bordered>
						{buocHienTai?.moTa || buocHienTai?.danhSachVanBanLuuTru?.length ? (
							<Descriptions.Item span={24} label='Mô tả'>
								<div
									dangerouslySetInnerHTML={{
										__html: buocHienTai?.moTa ?? '',
									}}
								/>
								{buocHienTai?.danhSachVanBanLuuTru?.length ? (
									<div>
										Biểu mẫu kèm theo:
										{buocHienTai.danhSachVanBanLuuTru.map((item: { url: string; tenFile: string }, index: number) => (
											<div key={item.url}>
												<a href={item.url} target='_blank' rel='noreferrer'>
													{index + 1}. {item.tenFile}
												</a>
											</div>
										))}
									</div>
								) : null}
							</Descriptions.Item>
						) : null}
						<Descriptions.Item label='Bộ phận xử lý'>
							{
								dataQuyTrinh?.quyTrinh?.danhSachBoPhanXuLy?.find(
									(item: { ma: string }) => item?.ma === data?.maBoPhanXuLy,
								)?.ten
							}{' '}
							(
							{dataQuyTrinh?.quyTrinh?.danhSachBoPhanXuLy?.find(
								(item: { ma: string }) => item?.ma === data?.maBoPhanXuLy,
							)?.danhSachThanhVienXuLy?.length ? (
								<a
									onClick={() => {
										setRecordBoPhanXuLy(
											dataQuyTrinh?.quyTrinh?.danhSachBoPhanXuLy?.find(
												(item: { ma: string }) => item?.ma === data?.maBoPhanXuLy,
											),
										);
										setVisibleDanhSachCanBoXuLy(true);
									}}
								>{`${
									dataQuyTrinh?.quyTrinh?.danhSachBoPhanXuLy?.find(
										(item: { ma: string }) => item?.ma === data?.maBoPhanXuLy,
									).danhSachThanhVienXuLy.length
								} cán bộ`}</a>
							) : dataQuyTrinh?.quyTrinh?.danhSachBoPhanXuLy?.find(
									(item: { ma: string }) => item?.ma === data?.maBoPhanXuLy,
							  )?.phuongThucPhanCong === PhuongThucPhanCong.CO_VAN_HOC_TAP ? (
								<a
									onClick={async () => {
										let dataNhanSu = [];
										await getAllNhanSu(undefined, undefined, {
											trangThaiChinhSua: ETrangThaiChinhSuaNhanSu.DUYET_DANG_AP_DUNG,
										}).then((res) => {
											dataNhanSu = res?.filter((item) =>
												data?.danhSachThanhVienXuLy?.map((val) => val?.ssoId)?.includes(item?.ssoId),
											);

											setRecordBoPhanXuLy({
												danhSachThanhVienXuLy: dataNhanSu?.map((item2) => ({
													ten: item2?.hoTen,
													ma: item2?.maCanBo,
													donVi: item2?.donViChinh?.ten,
												})),
											});
											setVisibleDanhSachCanBoXuLy(true);
										});
									}}
								>
									{data?.danhSachThanhVienXuLy?.length} cố vấn
								</a>
							) : (
								'Tất cả cán bộ trong đơn vị'
							)}
							)
						</Descriptions.Item>
						{!props.isBuocNgoaiHeThong && data?.coKhaiBao && (
							<>
								<Descriptions.Item label='Trạng thái xử lý'>
									<Tag
										color={MapColorTrangThaiTiepNhanDon?.[data?.trangThaiTiepNhan as TrangThaiTiepNhanDon] ?? 'yellow'}
									>
										{data?.trangThaiTiepNhan}
									</Tag>
									{data?.trangThaiTiepNhan === TrangThaiTiepNhanDon.DUYET && maFormTiepNhan ? (
										<Button
											onClick={() => {
												setVisibleThongTinDuyet(true);
											}}
											type='link'
											size='small'
										>
											(Xem chi tiết)
										</Button>
									) : (
										''
									)}
								</Descriptions.Item>

								{dataQuyTrinh?.trangThaiThanhToan && (
									<Descriptions.Item label='Trạng thái thanh toán'>
										<Tag
											color={
												EMauTrangThaiThanhToanTable?.[dataQuyTrinh?.trangThaiThanhToan as EMaTrangThaiThanhToan] ??
												'gray'
											}
										>
											{dataQuyTrinh?.trangThaiThanhToan
												? ETrangThaiThanhToan[dataQuyTrinh.trangThaiThanhToan]
												: 'Dịch vụ không tính phí'}
										</Tag>{' '}
										{dataQuyTrinh?.identityCode ? (
											<Button
												onClick={() => {
													getOneModel({ identityCode: dataQuyTrinh.identityCode });
													setVisibleModal(true);
												}}
												type='link'
												size='small'
											>
												(Xem chi tiết)
											</Button>
										) : (
											''
										)}
									</Descriptions.Item>
								)}
								{data?.ghiChu && (
									<Descriptions.Item span={24} label='Ghi chú của bộ phận xử lý'>
										<div dangerouslySetInnerHTML={{ __html: data?.ghiChu }} />
									</Descriptions.Item>
								)}
								{data?.vanBan?.url && (
									<Descriptions.Item span={24} label='Văn bản kèm theo của bộ phận xử lý'>
										<a href={data?.vanBan?.url} target='_blank' rel='noreferrer'>
											{data?.vanBan?.ten}
										</a>
									</Descriptions.Item>
								)}
							</>
						)}
					</Descriptions>
				</Collapse.Panel>
			</Collapse>

			<Modal
				visible={visibleModal}
				onCancel={() => setVisibleModal(false)}
				footer={null}
				bodyStyle={{ padding: 0 }}
				width={1000}
				destroyOnClose
			>
				<ThongTinThanhToan setVisible={setVisibleModal} getData={() => {}} />
			</Modal>
			<Modal
				footer={
					<Button type='primary' onClick={() => setVisibleDanhSachCanBoXuLy(false)}>
						OK
					</Button>
				}
				width={800}
				title='Danh sách cán bộ có thẩm quyền xử lý'
				visible={visibleDanhSachCanBoXuLy}
				onCancel={() => setVisibleDanhSachCanBoXuLy(false)}
			>
				<TableStaticData
					hasTotal
					otherProps={{ pagination: false }}
					addStt
					data={recordBoPhanXuLy?.danhSachThanhVienXuLy ?? []}
					columns={columnCanBo}
				/>
			</Modal>
			<Modal
				title='Thông tin xử lý'
				visible={visibleThongTinDuyet}
				onCancel={() => setVisibleThongTinDuyet(false)}
				footer={null}
				width={1000}
				destroyOnClose
			>
				<ViewFromCauHinh cauHinhLoaiHinh={cauHinhFormTiepNhan} thongTinKhaiBao={dataFormTiepNhan} />
			</Modal>
		</>
	);
};
export default ThongTinTiepNhan;
