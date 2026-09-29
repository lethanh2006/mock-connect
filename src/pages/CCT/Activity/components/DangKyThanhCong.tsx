import {
	ConfirmDialog,
	ConfirmDialogAction,
	ConfirmDialogActions,
	ConfirmDialogContent,
	ConfirmDialogDescription,
	ConfirmDialogHeader,
	ConfirmDialogTitle,
	LecxeCelebrate,
} from '@/components/Icons';
import { useIntl } from 'umi';

const ModalDangKyThanhCong = (props: { visibleDangKy: boolean; setVisibleDangKy: (val: boolean) => void }) => {
	const intl = useIntl();
	const { visibleDangKy, setVisibleDangKy } = props;

	return (
		<ConfirmDialog open={visibleDangKy} onOpenChange={setVisibleDangKy}>
			<ConfirmDialogContent className='max-w-[440px]' showCloseButton>
				<ConfirmDialogHeader>
					<LecxeCelebrate alt='' style={{ width: 160, height: 160 }} />
					<ConfirmDialogTitle>{intl.formatMessage({ id: 'activity.chitiet.dangkythanhcong' })}</ConfirmDialogTitle>
					<ConfirmDialogDescription>
						{intl.formatMessage({ id: 'activity.chitiet.dangkythanhcong.desc' })}
					</ConfirmDialogDescription>
				</ConfirmDialogHeader>
				<ConfirmDialogActions>
					<ConfirmDialogAction>{intl.formatMessage({ id: 'global.button.dong' })}</ConfirmDialogAction>
				</ConfirmDialogActions>
			</ConfirmDialogContent>
		</ConfirmDialog>
	);
};

export default ModalDangKyThanhCong;
