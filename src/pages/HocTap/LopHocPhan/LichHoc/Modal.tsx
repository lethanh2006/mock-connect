import { Descriptions, Empty, Modal, Tabs } from 'antd';
import moment from 'moment';
import { useState } from 'react';
import { useModel } from 'umi';
import DanhGiaTietHocPage from '../DanhGiaTietHoc';
import ThongTinBuoiHoc from './ThongTinBuoiHoc';

const ModalThoiKhoaBieu = () => {
	const { record: recThoiKhoaBieu, visibleForm, setVisibleForm } = useModel('daotao.thoikhoabieu');
	const [activeKey, setActiveKey] = useState<string>('noidung');
	const chuaKetThuc = moment().isBefore(recThoiKhoaBieu?.thoiGianKetThuc);

	return (
		<Modal
			width={800}
			title='Thông tin buổi học'
			visible={visibleForm}
			onCancel={() => setVisibleForm(false)}
			okButtonProps={{ hidden: true }}
			cancelText='Đóng'
		>
			<ThongTinBuoiHoc buoiHoc={recThoiKhoaBieu} />

			<Tabs activeKey={activeKey} onChange={(tab) => setActiveKey(tab)}>
				<Tabs.TabPane tab='Nội dung bài học' key='noidung'>
					<Descriptions column={1} title='' style={{ marginTop: 12 }}>
						<Descriptions.Item label='Tiêu đề bài học'>{recThoiKhoaBieu?.tieuDeBaiHoc ?? '--'}</Descriptions.Item>
						<Descriptions.Item label='Nội dung'>
							<div dangerouslySetInnerHTML={{ __html: recThoiKhoaBieu?.noiDungBaiHoc ?? '--' }} />
						</Descriptions.Item>
						<Descriptions.Item label='Tệp đính kèm'>
							{recThoiKhoaBieu?.urlBaiHoc ? (
								<a href={recThoiKhoaBieu.urlBaiHoc} target='_blank' rel='noreferrer'>
									Xem chi tiết
								</a>
							) : (
								'--'
							)}
						</Descriptions.Item>
					</Descriptions>
				</Tabs.TabPane>

				<Tabs.TabPane tab='Đánh giá buổi học' key='danhgia'>
					{chuaKetThuc ? (
						<Empty style={{ marginTop: 32, marginBottom: 32 }} description='Buổi học chưa kết thúc' />
					) : (
						<DanhGiaTietHocPage />
					)}
				</Tabs.TabPane>
			</Tabs>
		</Modal>
	);
};

export default ModalThoiKhoaBieu;
