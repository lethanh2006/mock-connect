import type { LoaiHinh } from '@/services/FormDong/LoaiHinh/typing';
import { useState } from 'react';

export default () => {
	const [visiblePreview, setVisiblePreview] = useState<boolean>(false);
	const [record, setRecord] = useState<LoaiHinh.IRecord>();
	return {
		record,
		setRecord,
		visiblePreview,
		setVisiblePreview,
	};
};
