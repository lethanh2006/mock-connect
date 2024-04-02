import TinTucPage from '..';
import TinTucWpPage from '../Wordpress';

const TinTucWrapper = () => {
	if (APP_CONFIG_TIN_TUC_WP) return <TinTucWpPage />;
	else return <TinTucPage />;
};

export default TinTucWrapper;
