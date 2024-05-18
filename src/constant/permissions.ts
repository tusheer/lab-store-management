export const permissions = {
    SUPER_ADMIN: {
        canViewGeneralStore: true,
        canViewDepartment: true,
        canViewSubStore: true,
    },
    GENERAL_STORE_MANAGER: {
        canViewGeneralStore: true,
        canViewDepartment: false,
        canViewSubStore: false,
    },
    DEPARTMENT_MANAGER: {
        canViewGeneralStore: false,
        canViewDepartment: true,
        canViewSubStore: false,
    },
    SUB_STORE_MANAGER: {
        canViewGeneralStore: false,
        canViewDepartment: false,
        canViewSubStore: true,
    },
    DEPARTMENT_AND_STORE_MANAGER: {
        canViewGeneralStore: false,
        canViewDepartment: true,
        canViewSubStore: true,
    },
} as const;
