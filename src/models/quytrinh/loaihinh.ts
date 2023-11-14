
import { useState } from 'react';

export default () => {
	const [visiblePreview, setVisiblePreview] = useState<boolean>(false);
	const [record, setRecord] = useState<any>();
	return {
		record,
		setRecord,
		visiblePreview,
		setVisiblePreview,
	};
};
