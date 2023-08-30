import { Descriptions, Modal } from 'antd';
import { useModel } from 'umi';
import ThongTinBuoiHoc from './ThongTinBuoiHoc';

const ModalThoiKhoaBieu = () => {
	const { record: recThoiKhoaBieu, visibleForm, setVisibleForm } = useModel('daotao.thoikhoabieu');

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

			<Descriptions column={1} title='Nội dung bài học' style={{ marginTop: 12 }}>
				<Descriptions.Item label='Tiêu đề bài học'>{recThoiKhoaBieu?.tieuDeBaiHoc ?? '--'}</Descriptions.Item>
				<Descriptions.Item label='Nội dung'>
					<div dangerouslySetInnerHTML={{ __html: recThoiKhoaBieu?.noiDungBaiHoc ?? '--' }} />
				</Descriptions.Item>
				<Descriptions.Item label='File đính kèm'>
					{recThoiKhoaBieu?.urlBaiHoc ? (
						<a href={recThoiKhoaBieu.urlBaiHoc} target='_blank' rel='noreferrer'>
							Xem chi tiết
						</a>
					) : (
						'--'
					)}
				</Descriptions.Item>
			</Descriptions>
		</Modal>
	);
};

export default ModalThoiKhoaBieu;
