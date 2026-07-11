import { useMemo } from 'react';
import { useModel } from 'umi';
import { getLegacyPermissionScopes, hasAccessCode, hasAllAccessCodes, hasAnyAccessCode } from '@/utils/keycloakRoles';

/**
 * Hook để kiểm tra quyền truy cập - Tích hợp trực tiếp không cần file riêng
 * Tái sử dụng được, đơn giản và hiệu quả cho React 19
 */
export const usePermissionCheck = () => {
    const { initialState } = useModel('@@initialState');

    return useMemo(() => {
        const isLoading = initialState?.permissionLoading;
        const permissions = initialState?.authorizedPermissions;
        const scopes = getLegacyPermissionScopes(initialState);
        const roles = initialState?.authorizedRoles ?? [];
        const isReady = !isLoading && (!!permissions || !!roles.length);
        return {
            /** Trạng thái loading permission */
            isLoading,
            /** Permission đã sẵn sàng chưa */
            isReady,
            /** Danh sách scopes hiện tại */
            scopes,
            roles,
            /** Danh sách permissions đầy đủ */
            permissions,

            /**
             * Kiểm tra có quyền với một mã chức năng
             */
            hasPermission: (permission: string) => {
                if (!isReady) return false;
                return hasAccessCode(initialState, permission);
            },

            /**
             * Kiểm tra có ít nhất một quyền trong danh sách
             */
            hasAnyPermission: (permissionList: string[]) => {
                if (!isReady) return false;
                return hasAnyAccessCode(initialState, permissionList);
            },

            /**
             * Kiểm tra có tất cả quyền trong danh sách
             */
            hasAllPermissions: (permissionList: string[]) => {
                if (!isReady) return false;
                return hasAllAccessCodes(initialState, permissionList);
            },

            /**
             * Kiểm tra quyền với route (tương thích với accessFilter)
             */
            checkRouteAccess: (route: { maChucNang?: string; listChucNang?: string[] }) => {
                if (!isReady) return false;

                if (route.maChucNang) {
                    return hasAccessCode(initialState, route.maChucNang);
                }

                if (route.listChucNang) {
                    return hasAnyAccessCode(initialState, route.listChucNang);
                }

                return false;
            }
        };
    }, [initialState?.permissionLoading, initialState?.authorizedPermissions, initialState?.authorizedRoles]);
};

export default usePermissionCheck;
