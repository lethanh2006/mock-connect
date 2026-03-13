import PreviewFile from '@/components/PreviewFile';
import ModalExpandable from '@/components/Table/ModalExpandable';
import dayjs from '@/utils/dayjs';
import { Button, Carousel, Descriptions, Empty, Tabs } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import DanhGiaTietHocPage from '../DanhGiaTietHoc';
import ThongTinBuoiHoc from './ThongTinBuoiHoc';

const ModalThoiKhoaBieu = () => {
	const intl = useIntl();
	const { record: recThoiKhoaBieu, visibleForm, setVisibleForm } = useModel('daotao.thoikhoabieu');
	const [activeKey, setActiveKey] = useState<string>('noidung');
	const chuaKetThuc = dayjs().isBefore(dayjs(recThoiKhoaBieu?.thoiGianKetThuc));
	const [visibleFormFile, setVisibleFormFile] = useState<boolean>(false);

	useEffect(() => {
		if (!chuaKetThuc) setActiveKey('danhgia');
		else setActiveKey('noidung');
	}, [chuaKetThuc]);

	return (
		<ModalExpandable
			width={800}
			title={intl.formatMessage({ id: 'lophocphan.id.lichhoc.tkb.title' })}
			open={visibleForm}
			onCancel={() => setVisibleForm(false)}
			okButtonProps={{ hidden: true }}
			cancelText={intl.formatMessage({ id: 'global.button.dong' })}
		>
			<ThongTinBuoiHoc buoiHoc={recThoiKhoaBieu} hideCard column={2} />

			<Tabs activeKey={activeKey} onChange={(tab) => setActiveKey(tab)}>
				<Tabs.TabPane tab={intl.formatMessage({ id: 'lophocphan.id.lichhoc.tkb.baihoc' })} key='noidung'>
					<Descriptions column={1} title='' style={{ marginTop: 12 }}>
						<Descriptions.Item label={intl.formatMessage({ id: 'lophocphan.id.lichhoc.tkb.hocphan' })}>
							{recThoiKhoaBieu?.noiDungHp?.ten ?? '--'}
						</Descriptions.Item>
						<Descriptions.Item label={intl.formatMessage({ id: 'lophocphan.id.lichhoc.tkb.tieude' })}>
							{recThoiKhoaBieu?.tieuDeBaiHoc ?? '--'}
						</Descriptions.Item>
						<Descriptions.Item label={intl.formatMessage({ id: 'lophocphan.id.lichhoc.tkb.noidung' })}>
							<div dangerouslySetInnerHTML={{ __html: recThoiKhoaBieu?.noiDungBaiHoc ?? '--' }} />
						</Descriptions.Item>
						<Descriptions.Item label={intl.formatMessage({ id: 'lophocphan.id.lichhoc.tkb.hoclieu' })}>
							{recThoiKhoaBieu?.hocLieuList?.filter((item) => item?.url)?.length ? (
								<a
									onClick={() => {
										setVisibleFormFile(true);
									}}
								>
									{intl.formatMessage({ id: 'lophocphan.id.lichhoc.tkb.xemchitiet' })}
								</a>
							) : (
								'--'
							)}
						</Descriptions.Item>
					</Descriptions>
				</Tabs.TabPane>

				<Tabs.TabPane tab={intl.formatMessage({ id: 'lophocphan.id.lichhoc.tkb.danhgia' })} key='danhgia'>
					{chuaKetThuc ? (
						<Empty
							style={{ marginTop: 32, marginBottom: 32 }}
							description={intl.formatMessage({ id: 'lophocphan.id.lichhoc.tkb.ketthuc' })}
						/>
					) : (
						<DanhGiaTietHocPage />
					)}
				</Tabs.TabPane>
			</Tabs>

			<ModalExpandable
				title={intl.formatMessage({ id: 'lophocphan.id.lichhoc.tkb.chitiethoclieu' })}
				width={1000}
				open={visibleFormFile}
				footer={null}
				onCancel={() => setVisibleFormFile(false)}
			>
				<Carousel autoplay pauseOnDotsHover>
					{recThoiKhoaBieu?.hocLieuList?.map((item) => (
						// eslint-disable-next-line react/jsx-key
						<PreviewFile file={item.url ?? ''} tenFile={item?.ten} />
					))}
				</Carousel>

				<div className='form-footer'>
					<Button onClick={() => setVisibleFormFile(false)}>{intl.formatMessage({ id: 'global.button.dong' })}</Button>
				</div>
			</ModalExpandable>
		</ModalExpandable>
	);
};

export default ModalThoiKhoaBieu;
