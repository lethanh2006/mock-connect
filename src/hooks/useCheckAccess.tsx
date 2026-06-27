import { useModel } from 'umi';
import { hasAccessCode } from '@/utils/keycloakRoles';

const useCheckAccess = (code: string): boolean => {
	const { initialState } = useModel('@@initialState');

	return hasAccessCode(initialState, code);
};

export default useCheckAccess;
