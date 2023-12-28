import Container from '@/components/ui/Container';
import PageHeading from '@/components/ui/PageHeading';
import prisma from '@/lib/prisma';
import FinancialYearCreateDialog from '../general-store/components/FinancialYearCreateDialog';
import FinancialYearTable from '../general-store/components/FinancialYearTable';

async function getFinancialYearDate() {
    const finalcialYear = await prisma.financialYear.findMany();
    return finalcialYear;
}

export type FinancialYear = Awaited<ReturnType<typeof getFinancialYearDate>>;

const FinancialYearPage = async () => {
    const finalcialYear = await getFinancialYearDate();

    const activeFinancialYear = await prisma.financialYear.findFirst({
        where: {
            isActive: true,
        },
    });

    return (
        <Container>
            <div className="flex items-center justify-between space-y-2">
                <PageHeading title="Financial year" description="View all Finalcial year" />
                {!activeFinancialYear && <FinancialYearCreateDialog />}
            </div>
            <FinancialYearTable data={finalcialYear} />
        </Container>
    );
};

export default FinancialYearPage;
