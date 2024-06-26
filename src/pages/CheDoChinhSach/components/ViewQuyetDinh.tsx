import ViewRender from '@/pages/KhaiBaoQuyTrinh/MauDon/ViewRender';
import { EKieuDuLieu, ETextDisplay } from '@/services/QuyTrinh/LoaiHinh/constants';
import { Col, Row } from 'antd';
import moment from 'moment';
import { useModel } from 'umi';

const ViewQuyetDinh = () => {
	const { record } = useModel('chedochinhsach.chedochinhsach');
	const { record: recordQuyetDinh } = useModel('chedochinhsach.quyetdinhchedosinhvien');

	const buildItem = (label: string, value: any) => (
		<div
			style={{
				display: 'flex',
			}}
		>
			<div style={{ marginRight: 4 }}>
				<b>{label}: </b>
			</div>
			<div>{value}</div>
		</div>
	);

	return (
		<Row gutter={[0, 10]}>
			<Col sm={12} md={8}>
				{buildItem('Họ và tên', recordQuyetDinh?.hoVaTen)}
			</Col>
			<Col sm={12} md={8}>
				{buildItem('Mã SV', recordQuyetDinh?.maSinhVien)}
			</Col>
			<Col sm={12} md={8}>
				{buildItem('Lớp', recordQuyetDinh?.lop.ten)}
			</Col>
			<Col sm={12} md={8}>
				{buildItem('Ngành', recordQuyetDinh?.nganh.ten)}
			</Col>
			<Col sm={12} md={8}>
				{buildItem('Ngày sinh', recordQuyetDinh?.ngaySinh ? moment(recordQuyetDinh.ngaySinh).format('DD/MM/YYYY') : '')}
			</Col>
			<Col sm={12} md={8}>
				{buildItem('Giới tính', recordQuyetDinh?.gioiTinh)}
			</Col>
			<Col sm={12} md={8}>
				{buildItem('Dân tộc', recordQuyetDinh?.danToc)}
			</Col>
			{record?.danhSachCauHinhThongTin.map((item) => {
				if (
					!item?.truongThongTinLienQuan ||
					(item?.truongThongTinLienQuan &&
						(recordQuyetDinh?.thongTinQuyetDinh?.[item?.truongThongTinLienQuan]?.value === item?.giaTriLienQuan ||
							(item.giaTriLienQuan.includes &&
								item?.giaTriLienQuan?.includes(
									recordQuyetDinh?.thongTinQuyetDinh?.[item?.truongThongTinLienQuan]?.value,
								))))
				) {
					const isTable = item.kieuDuLieu === EKieuDuLieu.TABLE || item.kieuDuLieu === EKieuDuLieu.DANHSACH;
					const isHtml = item.kieuDuLieu === EKieuDuLieu.TEXT && item.textDisplay === ETextDisplay.TEXT_EDITOR;
					const isDoanVanBan = item.kieuDuLieu === EKieuDuLieu.DOAN_VAN_BAN;

					return (
						<Col key={item.ma} xs={24} sm={24} md={item.colspan || 24} lg={item.colspan || 24}>
							<div
								style={{
									display: 'flex',
									flexDirection: isHtml || isTable ? 'column' : 'row',
								}}
							>
								<div style={{ marginRight: 4 }}>
									<b>{item.ten}: </b>
								</div>
								<div>
									{isDoanVanBan ? (
										item.ten
									) : (
										<ViewRender
											cauHinh={item}
											recordSanPham={{
												thongTinKhaiBao: recordQuyetDinh?.thongTinQuyetDinh,
											}}
										/>
									)}
								</div>
							</div>
						</Col>
					);
				} else return null;
			})}
		</Row>
	);
};

export default ViewQuyetDinh;
