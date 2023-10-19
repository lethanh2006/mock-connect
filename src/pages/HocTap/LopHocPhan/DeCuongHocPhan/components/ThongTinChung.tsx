import { Collapse, Descriptions } from 'antd';
import { useModel } from 'umi';
import moment from 'moment';
import TrongSoHocPhanPage from '../TrongSoHocPhan';

const ThongTinChungPage = () => {
	const { record } = useModel('hocphan.decuonghocphan');
	const { record: recLopHocPhan } = useModel('daotao.lophocphan');

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
					{record?.hocPhan?.soTinChi ? record.hocPhan.soTinChi + ' tín' : <i>Chưa cập nhật</i>}
				</Descriptions.Item>
			</Descriptions>
			<Descriptions
				style={{ marginBottom: '15px', marginTop: '5px' }}
				size='small'
				title='Thông tin đề cương'
				bordered={false}
				column={{ xxl: 2, xl: 2, lg: 2, md: 2, sm: 2, xs: 1 }}
			>
				<Descriptions.Item label=' Người biên soạn'>{record?.nguoiBienSoan ?? <i>Chưa cập nhật</i>}</Descriptions.Item>
				<Descriptions.Item label='Ngày áp dụng'>
					{record?.ngayApDung ? moment(record.ngayApDung).format('DD/MM/YYYY') : <i>Chưa cập nhật</i>}
				</Descriptions.Item>
				<Descriptions.Item label='Căn cứ pháp lý'>{record?.canCu?.ten ?? <i>Chưa cập nhật</i>}</Descriptions.Item>
			</Descriptions>

			<TrongSoHocPhanPage />

			<Collapse>
				<Collapse.Panel header='Mục tiêu học phần' key='1'>
					<div dangerouslySetInnerHTML={{ __html: record?.mucTieuHocPhan ?? '--' }} />
				</Collapse.Panel>
				<Collapse.Panel header='Nội dung tóm tắt' key='2'>
					<div dangerouslySetInnerHTML={{ __html: record?.noiDungTomTat ?? '--' }} />
				</Collapse.Panel>
				<Collapse.Panel header='Nội dung chi tiết' key='3'>
					<div dangerouslySetInnerHTML={{ __html: record?.noiDungChiTiet ?? '--' }} />
				</Collapse.Panel>
			</Collapse>
		</>
	);
};

export default ThongTinChungPage;
