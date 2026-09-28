import { Avatar, AvatarImage, Button, IconCalendar, IconHuman } from '@/components/Icons';
import { Col, Row } from '@/components/MyGrid';
import { Card } from '@/components/PageCard';
import { EModuleKey } from '@/services/base/constant';
import { type ESourceTypeNotification, mapModuleKey } from '@/services/ThongBao/constant';
import { type ThongBao } from '@/services/ThongBao/typing';
import { formatDate, formatDateTime } from '@/utils/formatDate';
import { currentRole } from '@/utils/ip';
import { getSafeHref } from '@/utils/security';
import { getNameFile } from '@/utils/utils';
import DOMPurify from 'dompurify';
import { history, useIntl } from 'umi';
import './style.less';

const ViewThongBao = (props: { record?: ThongBao.IRecord; afterViewDetail?: () => void; hideCard?: boolean }) => {
	const intl = useIntl();
	const { record, afterViewDetail, hideCard } = props;

	const redirectNotif = () => {
		const urlMap: Record<EModuleKey, string> = {
			[EModuleKey.CONNECT]: APP_CONFIG_URL_CONNECT,
			[EModuleKey.CONG_CAN_BO]: APP_CONFIG_URL_CAN_BO,
			[EModuleKey.QLDT]: APP_CONFIG_URL_DAO_TAO,
			[EModuleKey.CORE]: APP_CONFIG_URL_CORE,
			[EModuleKey.TCNS]: APP_CONFIG_URL_NHAN_SU,
			[EModuleKey.CTSV]: APP_CONFIG_URL_CTSV,
			[EModuleKey.VPS]: APP_CONFIG_URL_VPS,
			[EModuleKey.TC]: APP_CONFIG_URL_TAI_CHINH,
			[EModuleKey.QLKH]: APP_CONFIG_URL_QLKH,
			[EModuleKey.KT]: APP_CONFIG_URL_KHAO_THI,
			[EModuleKey.CSVC]: APP_CONFIG_URL_CSVC,
			[EModuleKey.VBCC]: APP_CONFIG_URL_VBCC,
			[EModuleKey.THU_VIEN]: APP_CONFIG_URL_THU_VIEN,
			[EModuleKey.QLND]: APP_CONFIG_URL_QLND,
		};

		const sourceType = mapModuleKey[record?.metadata?.sourceType as ESourceTypeNotification];
		const sourceModule = mapModuleKey[record?.metadata?.phanHe as ESourceTypeNotification];
		const rawPath = record?.metadata?.pathWeb?.trim();
		if (!rawPath || rawPath.startsWith('//') || /^[a-z][a-z0-9+.-]*:/i.test(rawPath)) return;
		const pathWeb = getSafeHref(`/${rawPath.replace(/^\/+/, '')}`);
		if (!pathWeb) return;

		if (sourceType === currentRole) {
			if (afterViewDetail) afterViewDetail();
			history.push(pathWeb);
		} else {
			const baseUrl = urlMap[sourceModule as EModuleKey];
			const target = baseUrl ? getSafeHref(`${baseUrl.replace(/\/+$/, '')}${pathWeb}`) : undefined;
			if (target) {
				window.location.href = target;
			}
		}
	};

	const content = (
		<div>
			<div className='notif-meta'>
				{record?.imageUrl ? (
					<Avatar size='40'>
						<AvatarImage src={record?.imageUrl} />
					</Avatar>
				) : null}
				<div className='notif-meta-body'>
					{record?.description ? <div style={{ marginBottom: 8 }}>{record.description}</div> : null}
					<div className='notif-meta-row'>
						<span className='notif-meta-item'>
							<IconHuman size={15} /> {record?.senderName || 'Hệ thống'}
						</span>
						<span className='notif-meta-divider' />
						<span className='notif-meta-item'>
							<IconCalendar size={15} /> {formatDateTime(record?.createdAt)}
						</span>
					</div>
				</div>
			</div>

			<br />
			<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(record?.content ?? '') }} className='notif-content' />

			<Row style={{ marginTop: 12 }} gutter={[12, 12]}>
				{record?.taiLieuDinhKem?.length ? (
					<>
						<Col span={24}>{intl.formatMessage({ id: 'lophanhchinh.thongtinchung.thongbao.tepdanhkem' })}: </Col>
						{record?.taiLieuDinhKem?.map((item) => {
							const href = getSafeHref(item);
							return href ? (
								<Col span={24} key={item}>
									<a href={href} target='_blank' rel='noreferrer'>
										{getNameFile(item)}
									</a>
								</Col>
							) : null;
						})}
					</>
				) : null}

				{record?.thoiGianHieuLuc ? (
					<Col span={24}>
						{intl.formatMessage({ id: 'lophanhchinh.thongtinchung.thongbao.hieuluc' })}:{' '}
						<b style={{ color: 'red' }}>{formatDate(record?.thoiGianHieuLuc)}</b>{' '}
					</Col>
				) : null}

				{record?.metadata?.pathWeb && record?.metadata?.phanHe ? (
					<Col span={24}>
						<Button variant='default' style={{ textTransform: 'none' }} onClick={() => redirectNotif()}>
							{intl.formatMessage({ id: 'lophanhchinh.thongtinchung.thongbao.xemchitiet' })}
						</Button>
					</Col>
				) : null}
			</Row>
		</div>
	);

	if (hideCard) return content;
	return <Card title={record?.title}>{content}</Card>;
};

export default ViewThongBao;
