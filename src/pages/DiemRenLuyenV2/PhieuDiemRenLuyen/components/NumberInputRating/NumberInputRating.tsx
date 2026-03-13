import { InputNumber, type InputNumberProps } from 'antd';
import './styles.less';
import classNames from 'classnames';

const NumberInputRating = (props: Omit<InputNumberProps, 'control'>) => {
	return <InputNumber {...props} className={classNames('NumberInputRating', props.className)} controls={false} />;
};

export default NumberInputRating;
