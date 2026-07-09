import { type DataChartType } from '.';
import ColumnChart from './ColumnChart';

const LineChart = (props: DataChartType) => {
	return (
		<ColumnChart
			{...props}
			type='line'
			otherOptions={{
				stroke: {
					curve: props.otherOptions?.stroke?.curve ?? 'monotoneCubic',
					width: props.otherOptions?.stroke?.width ?? 5,
				},
				markers: {
					size: props.otherOptions?.markers?.size ?? 5,
					strokeWidth: props.otherOptions?.markers?.strokeWidth ?? 1,
					strokeColors: props.otherOptions?.markers?.strokeColors ?? [],
					hover: { size: props.otherOptions?.markers?.hover?.size ?? 6 },
				},
				...props.otherOptions,
			}}
		/>
	);
};

export default LineChart;
