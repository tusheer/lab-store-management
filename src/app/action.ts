'use server';
import { checkPermission, RoleActions, roleBasedRedirect } from '@/lib/permissions';
import prisma from '@/lib/prisma';
import { getSubdomain } from '@/lib/utils';
import { getServerSession } from 'next-auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { authOptions } from './api/auth/[...nextauth]/authOption';

const institutionMap = new Map();

export const getServerSubdomain = async () => {
    const _headers = headers();
    const host = _headers.get('host');
    const subdomain = process.env.NODE_ENV == 'development' ? 'cpi' : getSubdomain(host || '');
    return subdomain;
};

export const getActiveFinancialYear = async () => {
    const subdomain = await getServerSubdomain();
    const activeFinancialYear = await prisma.financialYear.findFirst({
        where: {
            isActive: true,
            institution: {
                subdomain: subdomain,
            },
        },
    });

    if (!activeFinancialYear) {
        return null;
    }

    return {
        name: activeFinancialYear.name,
        id: activeFinancialYear.id,
    };
};

export const getInstitution = async () => {
    const subdomain = await getServerSubdomain();
    if (institutionMap.has(subdomain)) {
        return institutionMap.get(subdomain);
    }

    const institution = await prisma.institution.findFirst({
        where: {
            subdomain,
        },
        select: {
            logo: true,
            name: true,
            subdomain: true,
            id: true,
            meta: true,
        },
    });

    if (!institution) {
        return null;
    }

    institutionMap.set(subdomain, institution);

    return institution;
};

export const redirectIfNotAllow = async (action: RoleActions) => {
    const user = await getServerSession(authOptions);
    const permission = await checkPermission(user?.user.role, action);
    if (!permission) {
        const redirectUrl = roleBasedRedirect(user?.user.role);
        return redirect(redirectUrl);
    }
};
