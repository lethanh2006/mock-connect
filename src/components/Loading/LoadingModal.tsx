import { Modal } from '@/components/Table/ModalExpandable';
import { primaryColor } from '@/services/base/constant';
import { Progress } from 'antd';
import { useSyncExternalStore } from 'react';
import { getIntl } from 'umi';
import { loadingModalStore } from './loadingModalStore';

/** Component thật đứng sau FormWaiting/hideFormWaiting — mount đúng 1 lần ở gốc app (app.tsx),
 * đọc trạng thái qua loadingModalStore bằng useSyncExternalStore.
 * Dùng getIntl() thay vì useIntl() vì component này là anh em của {container} trong rootContainer
 * (giống Toaster), nằm NGOÀI <IntlProvider> mà umi tự bọc quanh {container} — useIntl() sẽ
 * throw "Could not find required intl object" ở vị trí này (đúng lý do ConfigBounder.tsx cũng
 * dùng getIntl() thay vì useIntl()). */
const LoadingModal = () => {
	const intl = getIntl();
	const { visible, message } = useSyncExternalStore(loadingModalStore.subscribe, loadingModalStore.getState);

	return (
		<Modal
			open={visible}
			onCancel={loadingModalStore.hide}
			maskClosable={false}
			width={360}
			title={intl.formatMessage({ id: 'global.formWaiting.dangxuly' })}
		>
			<div style={{ textAlign: 'center' }}>
				<Progress percent={100} status='active' showInfo={false} strokeColor={primaryColor} />
				<span>{message}</span>
				<br />
				<small>
					<i>({intl.formatMessage({ id: 'global.formWaiting.thongbao' })})</i>
				</small>
			</div>
		</Modal>
	);
};

export default LoadingModal;
