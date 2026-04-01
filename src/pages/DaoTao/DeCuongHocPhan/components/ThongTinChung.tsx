import PreviewFile from '@/components/PreviewFile';
import ModalExpandable from '@/components/Table/ModalExpandable';
import { getNameFile } from '@/utils/utils';
import { Button, Collapse, Descriptions } from 'antd';
import { useState } from 'react';
import { useIntl, useModel } from 'umi';
import TrongSoHocPhanPage from '../TrongSoHocPhan';

const ThongTinChungPage = () => {
	const intl = useIntl();
	const { record } = useModel('hocphan.decuonghocphan');
	const { record: recLopHocPhan } = useModel('lophocphan.lophocphan');
	const [visibleFormFile, setVisibleFormFile] = useState<boolean>(false);

	return (
		<>
			<Descriptions
				style={{ marginBottom: '15px', marginTop: '5px' }}
				size='small'
				title={intl.formatMessage({ id: 'lophocphan.id.decuong.thongtinchung.title' })}
				column={{ xxl: 2, xl: 2, lg: 2, md: 2, sm: 2, xs: 1 }}
			>
				<Descriptions.Item label={intl.formatMessage({ id: 'lophocphan.id.decuong.thongtinchung.tenhp' })}>
					{record?.hocPhan?.ten ?? recLopHocPhan?.hocPhan?.ten ?? <i>Chưa cập nhật</i>}
				</Descriptions.Item>
				<Descriptions.Item label={intl.formatMessage({ id: 'lophocphan.id.decuong.thongtinchung.tenhpta' })}>
					{record?.hocPhan?.tenTiengAnh ?? recLopHocPhan?.hocPhan?.tenTiengAnh ?? <i>Chưa cập nhật</i>}
				</Descriptions.Item>
				<Descriptions.Item label={intl.formatMessage({ id: 'lophocphan.id.decuong.thongtinchung.mahp' })}>
					{record?.hocPhan?.ma ?? recLopHocPhan?.hocPhan?.ma ?? <i>Chưa cập nhật</i>}
				</Descriptions.Item>
				<Descriptions.Item label={intl.formatMessage({ id: 'lophocphan.id.decuong.thongtinchung.stc' })}>
					{record?.hocPhan?.soTinChi ? record.hocPhan.soTinChi + ' tín chỉ' : <i>Chưa cập nhật</i>}
				</Descriptions.Item>
			</Descriptions>

			<Descriptions
				style={{ marginBottom: '15px', marginTop: '5px' }}
				size='small'
				title={intl.formatMessage({ id: 'lophocphan.id.decuong.thongtinchung.decuong' })}
				bordered={false}
				column={{ xxl: 2, xl: 2, lg: 2, md: 2, sm: 2, xs: 1 }}
			>
				<Descriptions.Item label={intl.formatMessage({ id: 'lophocphan.id.decuong.thongtinchung.phienban' })}>
					{record?.ma ?? <i>Chưa cập nhật</i>}
				</Descriptions.Item>
				<Descriptions.Item label={intl.formatMessage({ id: 'lophocphan.id.decuong.thongtinchung.banhanh' })}>
					{record?.thoiDiemApDung ?? <i>Chưa cập nhật</i>}
				</Descriptions.Item>
				<Descriptions.Item label={intl.formatMessage({ id: 'lophocphan.id.decuong.thongtinchung.quyetdinh' })}>
					{record?.canCu?.ten ?? <i>Chưa cập nhật</i>}
				</Descriptions.Item>
				<Descriptions.Item label={intl.formatMessage({ id: 'lophocphan.id.decuong.thongtinchung.dinhkem' })}>
					{record?.url ? (
						<a onClick={() => setVisibleFormFile(true)}>{getNameFile(record.url)}</a>
					) : (
						<i>Chưa cập nhật</i>
					)}
				</Descriptions.Item>
			</Descriptions>

			<TrongSoHocPhanPage />

			<Collapse style={{ marginTop: 12 }}>
				<Collapse.Panel header={intl.formatMessage({ id: 'lophocphan.id.decuong.thongtinchung.muctieu' })} key='1'>
					<div dangerouslySetInnerHTML={{ __html: record?.mucTieuHocPhan ?? '--' }} />
				</Collapse.Panel>
				<Collapse.Panel header={intl.formatMessage({ id: 'lophocphan.id.decuong.thongtinchung.cdr' })} key='2'>
					<div dangerouslySetInnerHTML={{ __html: record?.chuanDauRa ?? '--' }} />
				</Collapse.Panel>
				{/* <Collapse.Panel header='Nội dung tóm tắt' key='2'>
					<div dangerouslySetInnerHTML={{ __html: record?.noiDungTomTat ?? '--' }} />
				</Collapse.Panel>
				<Collapse.Panel header='Nội dung chi tiết' key='3'>
					<div dangerouslySetInnerHTML={{ __html: record?.noiDungChiTiet ?? '--' }} />
				</Collapse.Panel> */}
			</Collapse>

			<ModalExpandable
				title={intl.formatMessage({ id: 'lophocphan.id.decuong.thongtinchung.chitiet' })}
				width={1000}
				open={visibleFormFile}
				footer={null}
				onCancel={() => setVisibleFormFile(false)}
			>
				<PreviewFile file={record?.url ?? ''} />

				<div className='form-footer'>
					<Button onClick={() => setVisibleFormFile(false)}>{intl.formatMessage({ id: 'global.button.dong' })}</Button>
				</div>
			</ModalExpandable>
		</>
	);
};

export default ThongTinChungPage;
