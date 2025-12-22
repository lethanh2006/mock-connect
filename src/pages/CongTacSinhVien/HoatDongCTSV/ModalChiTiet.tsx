import dayjs from '@/utils/dayjs';
import { Descriptions, Modal } from 'antd';
import { useIntl, useModel } from 'umi';

const ModalChiTiet = () => {
	const intl = useIntl();
	const { record, visibleForm, setVisibleForm } = useModel('sukien.sinhvienhoatdongctsv');
	const { danhSach: danhSachHocKy } = useModel('daotao.hocky');

	return (
		<Modal
			title={intl.formatMessage({ id: 'xemsau.chitiet.title' })}
			open={visibleForm}
			onCancel={() => setVisibleForm(false)}
			footer={null}
		>
			<Descriptions column={1}>
				<Descriptions.Item label={intl.formatMessage({ id: 'xemsau.chitiet.tenhoatdong' })}>
					{record?.hoatDongCtsv?.ten ?? '--'}
				</Descriptions.Item>
				<Descriptions.Item label={intl.formatMessage({ id: 'xemsau.chitiet.loai' })}>
					{record?.hoatDongCtsv?.loai ?? '--'}
				</Descriptions.Item>
				<Descriptions.Item label={intl.formatMessage({ id: 'xemsau.chitiet.hocky' })}>
					{danhSachHocKy?.find((item) => item?.ma === record?.hoatDongCtsv?.maHocKy)?.ten ?? '--'}
				</Descriptions.Item>
				<Descriptions.Item label={intl.formatMessage({ id: 'xemsau.chitiet.slthamgia' })}>
					{record?.hoatDongCtsv?.soLuongThamGia}
				</Descriptions.Item>
				<Descriptions.Item label={intl.formatMessage({ id: 'xemsau.chitiet.tgbt' })}>
					{record?.hoatDongCtsv?.thoiGianBatDau
						? dayjs(record?.hoatDongCtsv?.thoiGianBatDau).format('HH:mm DD/MM/YYYY')
						: '--'}
				</Descriptions.Item>
				<Descriptions.Item label={intl.formatMessage({ id: 'xemsau.chitiet.tgkt' })}>
					{record?.hoatDongCtsv?.thoiGianKetThuc
						? dayjs(record?.hoatDongCtsv?.thoiGianKetThuc).format('HH:mm DD/MM/YYYY')
						: '--'}
				</Descriptions.Item>
				<Descriptions.Item label={intl.formatMessage({ id: 'xemsau.chitiet.diadiem' })}>
					{record?.hoatDongCtsv?.diaDiem ?? '--'}
				</Descriptions.Item>
			</Descriptions>
		</Modal>
	);
};

export default ModalChiTiet;
