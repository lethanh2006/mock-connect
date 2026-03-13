import { useIntl } from 'umi';
import KhaiBaoQuyTrinhPage from '.';

const DichVuHanhChinh = () => {
	const intl = useIntl();

	return (
		<KhaiBaoQuyTrinhPage
			title={intl.formatMessage({ id: 'dichvuhanhchinh.lichsu.title' })}
			hasColumnTenQuyTrinh
			hasFilterHoatDong
			linhVuc='Dịch vụ hành chính'
		/>
	);
};

export default DichVuHanhChinh;
