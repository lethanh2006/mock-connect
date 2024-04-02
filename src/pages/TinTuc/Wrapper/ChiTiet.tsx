import ChiTietTinTucPage from '../ChiTietTinTuc';
import ChiTietTinTucWpPage from '../Wordpress/ChiTietTinTuc';

const ChiTietTinTucWrapper = () => {
	if (APP_CONFIG_TIN_TUC_WP) return <ChiTietTinTucWpPage />;
	else return <ChiTietTinTucPage />;
};

export default ChiTietTinTucWrapper;
