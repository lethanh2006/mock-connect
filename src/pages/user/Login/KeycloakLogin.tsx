import { useAuthActions } from '@/hooks/useAuthActions';
import { tenTruongVietTatTiengAnh } from '@/services/base/constant';
import { Button, IconTrash } from '@/components/Icons';
import { useAuth } from 'react-oidc-context';

const LoginWithKeycloak = () => {
	const auth = useAuth();
	const { isLoading, dangNhap } = useAuthActions();

	const onClearCache = () => {
		localStorage.clear();
		sessionStorage.clear();
		auth?.removeUser();
		window.location.href = '/';
		// window.location.reload();
	};

	if (isLoading) {
		return <div>Đang chuyển tới trang đăng nhập...</div>;
	}

	if (auth?.error) {
		return (
			<div>
				Có lỗi xảy ra... <pre>{auth.error.message}</pre>
				<Button icon={<IconTrash />} onClick={onClearCache} variant='link'>
					Xóa bộ nhớ đệm
				</Button>
			</div>
		);
	}

	return (
		<>
			<Button
				onClick={dangNhap}
				variant='default'
				style={{
					marginTop: 8,
					width: '100%',
				}}
				size='lg'
			>
				Đăng nhập bằng {tenTruongVietTatTiengAnh.toUpperCase()} Connect
			</Button>
		</>
	);
};

export default LoginWithKeycloak;
