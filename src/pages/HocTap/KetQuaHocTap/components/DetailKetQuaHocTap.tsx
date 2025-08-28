import DiemThiHocKy from '@/pages/KhaoThi/KyThi/DiemThiHocKy';
import { ETrangThaiThi } from '@/services/HocTap/constant';
import { ColorDiemChu } from '@/services/HocTap/LopHocPhan/constant';
import { type LopHocPhan } from '@/services/HocTap/LopHocPhan/typings';
import { ETrangThaiDuThi, trangThaiDuThi } from '@/services/KhaoThi/SinhVienThi/constant';
import { ArrowRightOutlined } from '@ant-design/icons';
import { Button, Descriptions, Divider, Empty, Space, Spin, Tabs, Tag, Tooltip } from 'antd';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

const DetailKetQuaHocTap = (props: {
	lopHocPhanId?: string;
	diemHpSvHk?: LopHocPhan.IDiemHpSvHk;
	toDanhGiaGiangVien?: () => void;
}) => {
	const { lopHocPhanId, diemHpSvHk, toDanhGiaGiangVien } = props;
	const { danhSach: danhSachDauDiem, getModel } = useModel('daotao.daudiemhocphan');
	const { sinhVienGetDiemLHPModel, record: recSinhVienLhp, loading } = useModel('lophocphan.sinhvienlophocphan');
	const [hienThiDiemThi, setHienThiDiemThi] = useState<boolean>(false);
	const recDiem = diemHpSvHk ?? recSinhVienLhp?.diemHpSvHk;

	const hasTrongSo = !!recDiem?.trongSo1 || !!recDiem?.trongSo2 || !!recDiem?.trongSo3;
	// Đầu điểm học phần theo đề cương
	const dauDiemCoTrongSo = danhSachDauDiem.filter(
		(item) =>
			!hasTrongSo || // Đề cương học phần học kỳ này ko có trọng số
			recDiem?.[`trongSo${item.field}` as keyof LopHocPhan.IDiemHpSvHk],
	);

	const hasTrongTrongSoThi = !!recDiem?.trongSoThi1 || !!recDiem?.trongSoThi2 || !!recDiem?.trongSoThi3;
	const trongSoThanhPhan = _.range(1, 11).reduce((pre, cur) => {
		const trongSo = +(recDiem?.[`trongSo${cur}` as keyof LopHocPhan.IDiemHpSvHk] ?? 0);
		return pre + trongSo;
	}, 0);

	useEffect(() => {
		setHienThiDiemThi(false);
	}, [recDiem?._id]);

	useEffect(() => {
		if (!danhSachDauDiem.length) getModel();
	}, []);

	useEffect(() => {
		if (lopHocPhanId && !diemHpSvHk) sinhVienGetDiemLHPModel(lopHocPhanId);
	}, [lopHocPhanId]);

	const renderDiem = (diem?: any) => (
		<div>
			<b>{diem ?? '--'}</b>
		</div>
	);

	const renderDiemCloThanhPhan = () => {
		if (!recDiem?.danhSachDiemChuanDauRaThanhPhan?.length) return null;
		const gClos = _.groupBy(
			_.sortBy(recDiem.danhSachDiemChuanDauRaThanhPhan, (i) => i.maClo),
			(i) => i.field,
		);

		return (
			<>
				<Divider>Đánh giá quá trình</Divider>
				<Descriptions bordered>
					{Object.keys(gClos).map((field, index) => {
						const cdrs = gClos[field];
						return (
							<Descriptions.Item label={`Bài đánh giá ${index + 1}`} key={field}>
								{cdrs.map((cdr) => (
									<div key={cdr.maClo}>
										{cdr.maClo}: <b>{cdr.diem ?? '--'}</b> <small>({cdr.trongSo}%)</small>
									</div>
								))}
							</Descriptions.Item>
						);
					})}
				</Descriptions>
			</>
		);
	};

	const renderDiemCloKthp = () => {
		if (!recDiem?.danhSachDiemChuanDauRaThi?.length) return null;
		const diemThiClos = _.sortBy(
			recDiem.danhSachDiemChuanDauRaThi.filter((i) => i.field.includes('diemThi')),
			(i) => i.maClo,
		);
		const gClosThiLan1 = _.groupBy(
			diemThiClos.filter((i) => i.field.includes('diemThi1')),
			(i) => i.field,
		);
		const gClosThiLan2 = _.groupBy(
			diemThiClos.filter((i) => i.field.includes('diemThi2')),
			(i) => i.field,
		);

		const render = (gClos: _.Dictionary<LopHocPhan.TChiTietDiemCdr[]>) => {
			return (
				<Descriptions bordered>
					{Object.keys(gClos).map((field, index) => {
						const cdrs = gClos[field];
						return (
							<Descriptions.Item label={`Bài đánh giá ${index + 1}`} key={field}>
								{cdrs.map((cdr) => (
									<div key={cdr.maClo}>
										{cdr.maClo}: <b>{cdr.diem ?? '--'}</b> <small>({cdr.trongSo}%)</small>
									</div>
								))}
							</Descriptions.Item>
						);
					})}
				</Descriptions>
			);
		};

		// TODO: Hiển thị điểm chuẩn đầu ra thi cuối

		return (
			<>
				{!!Object.keys(gClosThiLan1).length && (
					<>
						<Divider>Đánh giá KTHP</Divider>
						{render(gClosThiLan1)}
					</>
				)}

				{!!Object.keys(gClosThiLan2).length && (
					<>
						<Divider>Đánh giá KTHP (thi lần 2)</Divider>
						{render(gClosThiLan2)}
					</>
				)}
			</>
		);
	};

	const renderTrungBinhClo = () => {
		if (!recDiem?.danhSachDiemMucTieuDauRa?.length) return null;
		const trungBinhClos = _.sortBy(recDiem.danhSachDiemMucTieuDauRa, (i) => i.maClo);

		return (
			<>
				<Divider>Điểm trung bình</Divider>
				<Descriptions bordered>
					{trungBinhClos.map((cdr) => (
						<Descriptions.Item label={cdr.maClo} key={cdr.maClo}>
							<Space wrap>
								<span className={cdr.pass ? 'text-success' : 'text-error'}>{renderDiem(cdr.diem)}</span>
								{cdr.diemToiThieu ? <small>/{cdr.diemToiThieu}</small> : null}
							</Space>
						</Descriptions.Item>
					))}
				</Descriptions>
			</>
		);
	};

	return (
		<Spin spinning={loading}>
			{recDiem ? (
				recDiem.daDanhGiaGiangVien !== false ? (
					<Tabs type='card' defaultActiveKey='1'>
						<Tabs.TabPane
							tab={
								<>
									Điểm GPA
									{recDiem?.dat !== undefined && (
										<Tag color={recDiem.dat ? 'green' : 'red'} style={{ marginLeft: 8 }}>
											{recDiem.dat ? 'Đạt' : 'Không đạt'}
										</Tag>
									)}
								</>
							}
							key='1'
						>
							<Divider>Điểm thành phần & ĐKDT</Divider>
							<Descriptions bordered>
								{dauDiemCoTrongSo?.map((item) => (
									<Descriptions.Item
										label={`${item.ten}${
											hasTrongSo ? ` (${recDiem?.[`trongSo${item.field}` as keyof LopHocPhan.IDiemHpSvHk]}%)` : ''
										}`}
										key={item._id}
									>
										{renderDiem(recDiem?.[`diemThanhPhan${item.field}` as keyof LopHocPhan.IDiemHpSvHk])}
									</Descriptions.Item>
								))}
								<Descriptions.Item label='Điều kiện dự thi'>
									<span style={{ color: recDiem?.trangThaiThi === ETrangThaiThi.CAM_THI ? 'red' : undefined }}>
										{recDiem?.trangThaiThi ?? '--'}
									</span>
								</Descriptions.Item>
							</Descriptions>

							<Divider>Điểm thi kết thúc học phần</Divider>
							<Descriptions bordered>
								{hasTrongTrongSoThi && (
									<Descriptions.Item label='Trọng số'>
										<div>{hasTrongTrongSoThi ? recDiem.trongSoThi1 : 100 - trongSoThanhPhan}%</div>
									</Descriptions.Item>
								)}
								<Descriptions.Item label='Thi lần 1'>{renderDiem(recDiem?.diemThi1)}</Descriptions.Item>
								<Descriptions.Item label='Thi lần 2'>{renderDiem(recDiem?.diemThi2)}</Descriptions.Item>

								{_.range(2, 6).map((i) =>
									recDiem?.[`trongSoThi${i}` as keyof LopHocPhan.IDiemHpSvHk] ? (
										<>
											<Descriptions.Item label={`Trọng số đầu điểm ${i}`}>
												<div>{recDiem?.[`trongSoThi${i}` as keyof LopHocPhan.IDiemHpSvHk]}%</div>
											</Descriptions.Item>
											<Descriptions.Item label='Thi lần 1'>
												{renderDiem(recDiem?.[`diemThi1${i}` as keyof LopHocPhan.IDiemHpSvHk])}
											</Descriptions.Item>
											<Descriptions.Item label='Thi lần 2'>
												{renderDiem(recDiem?.[`diemThi2${i}` as keyof LopHocPhan.IDiemHpSvHk])}
											</Descriptions.Item>
										</>
									) : null,
								)}

								<Descriptions.Item label={`Điểm cuối (${100 - trongSoThanhPhan}%)`}>
									{recDiem?.trangThaiDuThi && recDiem.trangThaiDuThi !== ETrangThaiDuThi.OK ? (
										<span title={trangThaiDuThi[recDiem.trangThaiDuThi]}>{recDiem?.trangThaiDuThi}</span>
									) : (
										renderDiem(recDiem?.diemKthp)
									)}
								</Descriptions.Item>
							</Descriptions>

							{recDiem && recDiem.diemKthp !== undefined && recDiem.diemKthp !== null && (
								<div style={{ marginTop: 8 }}>
									{!hienThiDiemThi ? (
										<a
											onClick={(e) => {
												e.preventDefault();
												setHienThiDiemThi(true);
											}}
										>
											Xem chi tiết lịch sử thi
										</a>
									) : (
										<DiemThiHocKy maHocKy={recDiem?.maHocKy} maHocPhan={recDiem?.maHocPhan} />
									)}
								</div>
							)}

							<Divider>Điểm tổng kết</Divider>
							<Descriptions bordered>
								<Descriptions.Item label='Điểm hệ 10'>{renderDiem(recDiem?.diemTongKet)}</Descriptions.Item>
								<Descriptions.Item label='Điểm hệ 4'>{renderDiem(recDiem?.diemThang4)}</Descriptions.Item>
								<Descriptions.Item label='Điểm chữ'>
									{recDiem?.diemChu ? <Tag color={ColorDiemChu[recDiem.diemChu]}>{recDiem.diemChu}</Tag> : '--'}{' '}
									{recDiem?.isCongNhanQuyDoiDiem && (
										<Tooltip title='Điểm quy đổi'>(R{recDiem.coTichLuyQuyDoi ? ' - Tích lũy' : ''})</Tooltip>
									)}
								</Descriptions.Item>
							</Descriptions>
						</Tabs.TabPane>

						{recDiem?.danhSachDiemChuanDauRaThanhPhan?.length ||
						recDiem?.danhSachDiemChuanDauRaThi?.length ||
						recDiem?.danhSachDiemMucTieuDauRa?.length ? (
							<Tabs.TabPane
								tab={
									<>
										Điểm CLO
										{!!recDiem.danhSachDiemMucTieuDauRa?.length && (
											<Tag
												color={recDiem?.danhSachDiemMucTieuDauRa?.every((i) => i.pass) ? 'green' : 'red'}
												style={{ marginLeft: 8 }}
											>
												{recDiem?.danhSachDiemMucTieuDauRa?.filter((i) => i.pass)?.length}/
												{recDiem.danhSachDiemMucTieuDauRa?.length}
											</Tag>
										)}
									</>
								}
								key='2'
							>
								{!!recDiem?.danhSachDiemChuanDauRaThanhPhan?.length && renderDiemCloThanhPhan()}

								{!!recDiem?.danhSachDiemChuanDauRaThi?.length && renderDiemCloKthp()}

								{!!recDiem?.danhSachDiemMucTieuDauRa?.length && renderTrungBinhClo()}
							</Tabs.TabPane>
						) : null}
					</Tabs>
				) : (
					<Empty
						description={
							<>
								Vui lòng Đánh giá giảng viên trước khi xem điểm học phần
								{toDanhGiaGiangVien ? (
									<div style={{ marginTop: 12 }}>
										<Button type='link' onClick={() => toDanhGiaGiangVien()}>
											Đánh giá ngay <ArrowRightOutlined />
										</Button>
									</div>
								) : null}
							</>
						}
						style={{ margin: '18px 0' }}
					/>
				)
			) : (
				<Empty description='Chưa có kết quả học tập' style={{ margin: '18px 0' }} />
			)}
		</Spin>
	);
};

export default DetailKetQuaHocTap;
