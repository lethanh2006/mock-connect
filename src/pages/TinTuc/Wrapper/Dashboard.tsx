import TinTucDashboard from '../TinTucDashboard';
import TinTucWpDashboard from '../Wordpress/TinTucDashboard';

const TinTucDashboardWrapper = () => {
	if (APP_CONFIG_TIN_TUC_WP) return <TinTucWpDashboard />;
	else return <TinTucDashboard />;
};

export default TinTucDashboardWrapper;
