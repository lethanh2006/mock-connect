import { useEffect } from 'react';
import { useModel } from 'umi';

export default function usePageTitle(title?: string | null) {
	const { setInitialState } = useModel('@@initialState');

	useEffect(() => {
		if (!setInitialState) return;

		if (title) {
			setInitialState((prev: any) => ({ ...(prev || {}), currentPageTitle: title }));
			document.title = title;
		} else {
			setInitialState((prev: any) => ({ ...(prev || {}), currentPageTitle: undefined }));
		}
		return () => {
			setInitialState((prev: any) => ({ ...(prev || {}), currentPageTitle: undefined }));
			document.title = 'Cổng cán bộ';
		};
	}, [title, setInitialState]);
}
