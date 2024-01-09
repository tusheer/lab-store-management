import { getActiveFinancialYear } from '@/app/action';
import Container from '@/components/ui/Container';
import PageHeading from '@/components/ui/PageHeading';
import { getFinancialYears } from './action';
import FinancialYearCreateDialog from './components/FinancialYearCreateDialog';
import FinancialYearTable from './components/FinancialYearTable';

export type FinancialYear = Awaited<ReturnType<typeof getFinancialYears>>;

const FinancialYearPage = async () => {
    const [finalcialYear, activeFinancialYear] = await Promise.all([getFinancialYears(), getActiveFinancialYear()]);

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
