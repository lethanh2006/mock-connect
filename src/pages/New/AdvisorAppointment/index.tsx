import PageCard from '@/components/PageCard';
import { useIntl } from 'umi';
import MyBookingsPanel from './components/MyBookingsPanel';

const AdvisorAppointment = () => {
	const intl = useIntl();

	return (
		<PageCard title={intl.formatMessage({ id: 'advisorAppointment.title' })}>
			<MyBookingsPanel />
		</PageCard>
	);
};

export default AdvisorAppointment;
