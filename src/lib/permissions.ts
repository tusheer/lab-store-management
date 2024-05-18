import { permissions } from '@/constant/permissions';
import { Role } from '@prisma/client';

export type RoleActions = keyof (typeof permissions)[Role];

export async function checkPermission(role: Role, action: RoleActions): Promise<boolean> {
    const userPermissions = permissions[role];

    if (!userPermissions) {
        throw new Error(`Role ${role} not found`);
    }

    const permission = userPermissions[action];

    if (typeof permission === 'undefined') {
        throw new Error(`Action ${action} not found for role ${role}`);
    }

    return permission;
}

export function roleBasedRedirect(role: string) {
    switch (role) {
        case 'SUPER_ADMIN':
            return '/general-store';
        case 'GENERAL_STORE_MANAGER':
            return '/general-store';
        case 'DEPARTMENT_MANAGER':
            return '/departments';
        case 'SUB_STORE_MANAGER':
            return '/shops';
        case 'DEPARTMENT_AND_STORE_MANAGER':
            return '/departments';
        default:
            return '/';
    }
}
