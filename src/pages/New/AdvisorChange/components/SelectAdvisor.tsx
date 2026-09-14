import { getAdvisorsOfMajor } from '@/services/AdvisorChange';
import { EAdvisorType } from '@/services/AdvisorChange/constant';
import { AdvisorChange } from '@/services/AdvisorChange/typing';
import { Empty, Select, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl } from 'umi';

type SelectAdvisorProps = {
	maNganh?: string;
	condition?: Record<string, any>;
	value?: string;
	onChange?: (val: string | null, option?: { rawData?: AdvisorChange.IAdvisorOfMajor }) => void;
	disabled?: boolean;
	allowClear?: boolean;
	placeholder?: string;
	style?: React.CSSProperties;
};

const SelectAdvisor: React.FC<SelectAdvisorProps> = ({
	maNganh,
	condition,
	value,
	onChange,
	disabled,
	allowClear,
	placeholder,
	style,
}) => {
	const intl = useIntl();
	const [advisors, setAdvisors] = useState<AdvisorChange.IAdvisorOfMajor[]>([]);
	const [loading, setLoading] = useState(false);
	const conditionKey = JSON.stringify(condition ?? { type: EAdvisorType.FACULTY_ADVISOR });

	useEffect(() => {
		if (!maNganh) {
			setAdvisors([]);
			return;
		}

		setLoading(true);
		getAdvisorsOfMajor(maNganh, { condition: JSON.parse(conditionKey) })
			.then((res) => setAdvisors(res?.data?.data ?? []))
			.catch(() => setAdvisors([]))
			.finally(() => setLoading(false));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [maNganh, conditionKey]);

	return (
		<Select
			value={value}
			onChange={onChange as any}
			loading={loading}
			disabled={disabled}
			allowClear={allowClear}
			showSearch
			optionFilterProp='label'
			placeholder={placeholder ?? intl.formatMessage({ id: 'idp.advisorChange.form.advisorPlaceholder' })}
			style={{ width: '100%', ...style }}
			notFoundContent={
				loading ? (
					<Spin
						spinning
						tip={intl.formatMessage({ id: 'idp.advisorChange.form.advisorLoading' })}
						style={{ width: '100%', margin: 10 }}
					/>
				) : (
					<Empty
						image={Empty.PRESENTED_IMAGE_SIMPLE}
						description={intl.formatMessage({ id: 'idp.advisorChange.form.advisorEmpty' })}
					/>
				)
			}
			options={advisors.map((advisor) => ({
				key: advisor.advisorSsoId,
				value: advisor.advisorSsoId,
				label: advisor.advisorName,
				rawData: advisor,
			}))}
		/>
	);
};

export default SelectAdvisor;
