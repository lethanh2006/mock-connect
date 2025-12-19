import ButtonExtend from '@/components/Table/ButtonExtend';
import { MenuOutlined } from '@ant-design/icons';
import { Col, Collapse, Empty, Row, Space } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import './style.less';

const LichTrinhCuTheList = () => {
	const intl = useIntl();
	const { getAllModel, danhSach } = useModel('hocphan.tientrinhhp');
	const { record: recDeCuong } = useModel('hocphan.decuonghocphan');
	const [activeKeys, setActiveKeys] = useState<string[]>();

	const getData = async () => recDeCuong?._id && getAllModel(false, { tuanBatDau: 1 }, { deCuongId: recDeCuong._id });

	useEffect(() => {
		getData();
	}, [recDeCuong?._id]);

	const onExpandAll = () => {
		const weeks = danhSach.map((item) => item._id);
		setActiveKeys(weeks);
	};

	return (
		<Row gutter={[12, 12]}>
			<Col span={24}>
				<Space wrap>
					<ButtonExtend icon={<MenuOutlined />} disabled={!danhSach.length} onClick={onExpandAll}>
						{intl.formatMessage({ id: 'lophocphan.id.decuong.lichthi.xemdaydu' })}
					</ButtonExtend>
				</Space>
			</Col>

			<Col span={24}>
				{danhSach.length ? (
					<Collapse activeKey={activeKeys} onChange={(key) => setActiveKeys(typeof key !== 'string' ? key : [key])}>
						{danhSach.map((rec) => (
							<Collapse.Panel
								header={
									<span className='fw500'>
										{intl.formatMessage({ id: 'lophocphan.id.decuong.lichthi.tuan' })} {rec.tuanBatDau}-
										{rec.tuanKetThuc}: {rec.noiDung}
									</span>
								}
								key={rec._id}
							>
								<ol className='noi-dung'>
									<li>
										<span className='fw500'>{intl.formatMessage({ id: 'lophocphan.id.decuong.lichthi.noidung' })}</span>
										<p>{rec.noiDungChinh}</p>
									</li>
									<li>
										<span className='fw500'>{intl.formatMessage({ id: 'lophocphan.id.decuong.lichthi.yeucau' })}</span>
										<p>{rec.yeuCauSinhVien}</p>
									</li>
									<li>
										<span className='fw500'>
											{intl.formatMessage({ id: 'lophocphan.id.decuong.lichthi.hinhthuc' })}
										</span>
										<p>
											<ul>
												{rec.ndTienTrinhList?.map((nd) =>
													nd.soTiet ? (
														<li key={nd._id}>
															{nd.loaiToChucDayHoc} ({nd.soTiet}{' '}
															{intl.formatMessage({ id: 'lophocphan.id.decuong.lichthi.tiet' })})
														</li>
													) : null,
												)}
											</ul>
										</p>
									</li>
									<li>
										<span className='fw500'>{intl.formatMessage({ id: 'lophocphan.id.decuong.lichthi.ghichu' })}</span>
										<p>{rec.ghiChu}</p>
									</li>
								</ol>
							</Collapse.Panel>
						))}
					</Collapse>
				) : (
					<Empty
						description={intl.formatMessage({ id: 'lophocphan.id.decuong.lichthi.empty' })}
						style={{ marginTop: 32, marginBottom: 32 }}
					/>
				)}
			</Col>
		</Row>
	);
};

export default LichTrinhCuTheList;
