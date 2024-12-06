import { EKieuDuLieu, ETextDisplay } from '@/services/QuyTrinh/LoaiHinh/constants';
import type { LoaiHinh } from '@/services/QuyTrinh/LoaiHinh/typing';
import { Col, Row } from 'antd';
import ViewRender from '../../MauDon/ViewRender';

const ViewFromCauHinh = (props: { cauHinhLoaiHinh: LoaiHinh.TruongThongTin[]; thongTinKhaiBao: any }) => {
	const { cauHinhLoaiHinh = [], thongTinKhaiBao } = props;

	return (
		<Row gutter={[0, 10]}>
			{cauHinhLoaiHinh.map((item) => {
				if (
					!item?.truongThongTinLienQuan ||
					(item?.truongThongTinLienQuan &&
						(thongTinKhaiBao?.[item?.truongThongTinLienQuan]?.value === item?.giaTriLienQuan ||
							(item.giaTriLienQuan.includes &&
								item?.giaTriLienQuan?.includes(thongTinKhaiBao?.[item?.truongThongTinLienQuan]?.value))))
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
								{!isDoanVanBan && (
									<div style={{ marginRight: 4 }}>
										<b>{item.ten}: </b>
									</div>
								)}
								<div>
									{isDoanVanBan ? (
										<div>
											{item.customDefaultValue ? (
												<div dangerouslySetInnerHTML={{ __html: item.customDefaultValue }} />
											) : (
												<div>{item.ten}</div>
											)}
										</div>
									) : (
										<ViewRender
											cauHinh={item}
											recordSanPham={{
												thongTinKhaiBao: thongTinKhaiBao,
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

export default ViewFromCauHinh;
