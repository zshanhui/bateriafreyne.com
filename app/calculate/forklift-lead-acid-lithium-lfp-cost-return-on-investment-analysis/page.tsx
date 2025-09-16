import type { CalculatorInputs } from './CalculatorClient';
import CalculatorClient from './CalculatorClient';

export default async function Page(props: {
    searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
    const sp = await props.searchParams;
    const forkliftsFromUrl = sp['forklifts'];
    const electricityRateFromUrl = sp['electric-rate'];

    const initialInputs: CalculatorInputs = {
        numberOfForklifts:
            forkliftsFromUrl && !isNaN(parseInt(forkliftsFromUrl, 10))
                ? Math.max(1, parseInt(forkliftsFromUrl, 10))
                : 10,
        shiftsPerDay: 2,
        daysPerWeek: 5,
        weeksPerYear: 52,
        leadAcidBatteryCost: 4000,
        lithiumBatteryCost: 8500,
        electricityRate:
            electricityRateFromUrl && !isNaN(parseFloat(electricityRateFromUrl))
                ? Math.max(0, parseFloat(electricityRateFromUrl))
                : 0.12,
        laborCost: 25.0,
        forkliftPowerConsumption: 6,
    };

    return (
        <div
            className="min-h-screen bg-neutral-50 px-4 py-8"
            style={{
                backgroundImage: `
                linear-gradient(to right, rgb(191 219 254) 1px, transparent 1px),
                linear-gradient(to bottom, rgb(191 219 254) 1px, transparent 1px)
            `,
                backgroundSize: '20px 20px',
            }}
        >
            <div className="mx-auto max-w-6xl">
                <div className="rounded-lg bg-white p-8 shadow-lg">
                    <h1 className="mb-8 text-center text-3xl font-bold text-neutral-900">
                        Calculate Cost Savings & Return on Investment When
                        Switching to Lithium Forklift Batteries
                    </h1>

                    <CalculatorClient initialInputs={initialInputs} />
                </div>
            </div>
        </div>
    );
}
