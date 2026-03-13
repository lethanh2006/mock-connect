import type { TheChat } from '@/services/TienIch/TheChat/typing';
import { Button, Descriptions, Image, Modal } from 'antd';
import { useIntl } from 'umi';

interface IProps {
	visible: boolean;
	setVisible: (val: boolean) => void;
	data: TheChat.IMetaData;
}

const ViewMetaData = ({ visible, setVisible, data }: IProps) => {
	const intl = useIntl();

	return (
		<Modal
			title={intl.formatMessage({ id: 'hoctapkhac.thechatsinhvien.ketquadanhgia.thongtinchitiet.title' })}
			open={visible}
			onCancel={() => setVisible(false)}
			footer={null}
			width={700}
		>
			<Descriptions bordered column={2} size='middle' labelStyle={{ fontWeight: 600, width: 180 }}>
				<Descriptions.Item
					label={intl.formatMessage({ id: 'hoctapkhac.thechatsinhvien.ketquadanhgia.masinhvien.title' })}
				>
					{data?.STUDENT_CODE ?? '--'}
				</Descriptions.Item>

				<Descriptions.Item
					label={intl.formatMessage({ id: 'hoctapkhac.thechatsinhvien.ketquadanhgia.mabaithi.title' })}
				>
					{data?.EXAM_ID ?? '--'}
				</Descriptions.Item>

				<Descriptions.Item label={intl.formatMessage({ id: 'hoctapkhac.thechatsinhvien.ketquadanhgia.thietbi.title' })}>
					{data?.DEVICE_ID ?? '--'}
				</Descriptions.Item>

				<Descriptions.Item
					label={intl.formatMessage({ id: 'hoctapkhac.thechatsinhvien.ketquadanhgia.khoangcach.title' })}
				>
					{data?.STUDENT_DISTANCE ?? '--'} m
				</Descriptions.Item>

				<Descriptions.Item
					label={intl.formatMessage({ id: 'hoctapkhac.thechatsinhvien.ketquadanhgia.thoigianlam.title' })}
				>
					{data?.STUDENT_MINS ?? '--'} phút
				</Descriptions.Item>

				<Descriptions.Item label={intl.formatMessage({ id: 'hoctapkhac.thechatsinhvien.ketquadanhgia.diemso.title' })}>
					{data?.STUDENT_SCORE ?? '--'}
				</Descriptions.Item>

				<Descriptions.Item
					label={intl.formatMessage({ id: 'hoctapkhac.thechatsinhvien.ketquadanhgia.nhiptimbatdau.title' })}
				>
					{data?.STUDENT_HEART_START ?? '--'}
				</Descriptions.Item>

				<Descriptions.Item
					label={intl.formatMessage({ id: 'hoctapkhac.thechatsinhvien.ketquadanhgia.nhiptimketthuc.title' })}
				>
					{data?.STUDENT_HEART_END ?? '--'}
				</Descriptions.Item>

				<Descriptions.Item
					label={intl.formatMessage({ id: 'hoctapkhac.thechatsinhvien.ketquadanhgia.googlemap.title' })}
					span={2}
				>
					{data?.STUDENT_MAP ? (
						<Image
							src={`data:image/png;base64,${data?.STUDENT_MAP}`}
							alt='map'
							width={'100%'}
							style={{ borderRadius: 6 }}
						/>
					) : (
						`${intl.formatMessage({ id: 'hoctapkhac.thechatsinhvien.ketquadanhgia.khongcodulieumap.title' })}`
					)}
				</Descriptions.Item>
			</Descriptions>

			<div className='form-footer'>
				<Button onClick={() => setVisible(false)}>{intl.formatMessage({ id: 'global.button.dong' })}</Button>
			</div>
		</Modal>
	);
};

export default ViewMetaData;
