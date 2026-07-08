import { primaryColor } from '@/services/base/constant';
import { MapKeyColorTrangThaiDeTaiQuanLyKhoaHoc } from '@/services/KhoaHoc/DeTaiKHCN/constants';
import { DeTaiKHCN } from '@/services/KhoaHoc/DeTaiKHCN/typings';
import { getSafeHref } from '@/utils/security';
import { Descriptions, Tag } from 'antd';
import { useIntl } from 'umi';

const ViewHoSoSauXetDuyetThuyetMinh = (props: { rec: DeTaiKHCN.IRecord }) => {
	const intl = useIntl();
	const { deCuongKhcn } = props.rec;

	const fileLink = (url: unknown) => {
		const href = getSafeHref(url);
		if (!href) return <>--</>;
		return (
			<a href={href} target='_blank' rel='noreferrer'>
				<Tag color={primaryColor}>{intl.formatMessage({ id: 'diemrenluyen.minhchung.xemtaptin' })}</Tag>
			</a>
		);
	};

	return (
		<>
			<Descriptions column={{ xs: 2, sm: 2, md: 4, lg: 6, xl: 6, xxl: 6 }}>
				<Descriptions.Item span={3} label={intl.formatMessage({ id: 'khoahoc.detaikhcn.trangthainop' })}>
					<Tag color={props?.rec?.lockSauXetDuyetDeCuong ? '#28a745' : '#dc3545'}>
						{props.rec?.lockSauXetDuyetDeCuong
							? intl.formatMessage({ id: 'khoahoc.detaikhcn.danop' })
							: intl.formatMessage({ id: 'khoahoc.detaikhcn.chuanop' })}
					</Tag>
				</Descriptions.Item>
				<Descriptions.Item span={3} label={intl.formatMessage({ id: 'khoahoc.detaikhcn.trangthaixuly' })}>
					<Tag color={MapKeyColorTrangThaiDeTaiQuanLyKhoaHoc[props.rec?.trangThaiSauXetDuyetDeCuong]}>
						{props.rec?.trangThaiSauXetDuyetDeCuong}
					</Tag>
				</Descriptions.Item>
				<Descriptions.Item span={6} label={intl.formatMessage({ id: 'khoahoc.detaikhcn.ghichu.qlkh' })}>
					<span style={{ color: primaryColor }}>{props.rec?.commentSauXetDuyetDeCuong ?? ''}</span>
				</Descriptions.Item>

				<Descriptions.Item
					span={3}
					label={intl.formatMessage({ id: 'khoahoc.detaikhcn.hososauxetduyet.thuyetminhchinhsua' })}
				>
					{fileLink(deCuongKhcn?.deCuongUrlChinhSua?.[0])}
				</Descriptions.Item>

				<Descriptions.Item
					span={3}
					label={intl.formatMessage({ id: 'khoahoc.detaikhcn.hososauxetduyet.bangiaitrinh' })}
				>
					{fileLink(deCuongKhcn?.banGiaiTrinhUrl?.[0])}
				</Descriptions.Item>
				<Descriptions.Item
					span={3}
					label={intl.formatMessage({ id: 'khoahoc.detaikhcn.hososauxetduyet.dutoankinhphi' })}
				>
					{fileLink(deCuongKhcn?.duToanUrl?.[0])}
				</Descriptions.Item>
			</Descriptions>
		</>
	);
};

export default ViewHoSoSauXetDuyetThuyetMinh;
