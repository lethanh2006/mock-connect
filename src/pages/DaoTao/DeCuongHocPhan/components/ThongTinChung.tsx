import { Collapse, Descriptions } from 'antd';
import { useModel } from 'umi';
import TrongSoHocPhanPage from '../TrongSoHocPhan';

const ThongTinChungPage = () => {
	const { record } = useModel('hocphan.decuonghocphan');
	const { record: recLopHocPhan } = useModel('lophocphan.lophocphan');

	return (
		<>
			<Descriptions
				style={{ marginBottom: '15px', marginTop: '5px' }}
				size='small'
				title='Thông tin học phần'
				column={{ xxl: 2, xl: 2, lg: 2, md: 2, sm: 2, xs: 1 }}
			>
				<Descriptions.Item label='Tên học phần'>
					{record?.hocPhan?.ten ?? recLopHocPhan?.hocPhan?.ten ?? <i>Chưa cập nhật</i>}
				</Descriptions.Item>
				<Descriptions.Item label='Tên học phần (tiếng Anh)'>
					{record?.hocPhan?.tenTiengAnh ?? recLopHocPhan?.hocPhan?.tenTiengAnh ?? <i>Chưa cập nhật</i>}
				</Descriptions.Item>
				<Descriptions.Item label='Mã học phần'>
					{record?.hocPhan?.ma ?? recLopHocPhan?.hocPhan?.ma ?? <i>Chưa cập nhật</i>}
				</Descriptions.Item>
				<Descriptions.Item label='Số tín chỉ'>
					{record?.hocPhan?.soTinChi ? record.hocPhan.soTinChi + ' tín chỉ' : <i>Chưa cập nhật</i>}
				</Descriptions.Item>
			</Descriptions>

			<Descriptions
				style={{ marginBottom: '15px', marginTop: '5px' }}
				size='small'
				title='Thông tin đề cương'
				bordered={false}
				column={{ xxl: 2, xl: 2, lg: 2, md: 2, sm: 2, xs: 1 }}
			>
				<Descriptions.Item label='Thời điểm ban hành'>
					{record?.thoiDiemApDung ?? <i>Chưa cập nhật</i>}
				</Descriptions.Item>
				<Descriptions.Item label='Quyết định ban hành đề cương'>
					{record?.canCu?.ten ?? <i>Chưa cập nhật</i>}
				</Descriptions.Item>
				<Descriptions.Item label='Đề cương chi tiết đính kèm'>
					{record?.url ? (
						<a href={record.url} target='_blank' rel='noreferrer'>
							Xem chi tiết
						</a>
					) : (
						<i>Chưa cập nhật</i>
					)}
				</Descriptions.Item>
			</Descriptions>

			<TrongSoHocPhanPage />

			<Collapse>
				<Collapse.Panel header='Mục tiêu học phần' key='1'>
					<div dangerouslySetInnerHTML={{ __html: record?.mucTieuHocPhan ?? '--' }} />
				</Collapse.Panel>
				<Collapse.Panel header='Chuẩn đầu ra' key='2'>
					<div dangerouslySetInnerHTML={{ __html: record?.chuanDauRa ?? '--' }} />
				</Collapse.Panel>
				{/* <Collapse.Panel header='Nội dung tóm tắt' key='2'>
					<div dangerouslySetInnerHTML={{ __html: record?.noiDungTomTat ?? '--' }} />
				</Collapse.Panel>
				<Collapse.Panel header='Nội dung chi tiết' key='3'>
					<div dangerouslySetInnerHTML={{ __html: record?.noiDungChiTiet ?? '--' }} />
				</Collapse.Panel> */}
			</Collapse>
		</>
	);
};

export default ThongTinChungPage;
