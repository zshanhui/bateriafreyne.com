import type { CalculatorInputs } from './calculator-client';
import CalculatorClient from './calculator-client';

const DEFAULT_NUMBER_OF_FORKLIFTS = 10;
const DEFAULT_SHIFTS_PER_DAY = 1;
const DEFAULT_DAYS_PER_WEEK = 5;
const DEFAULT_WEEKS_PER_YEAR = 52;
const DEFAULT_LEAD_ACID_BATTERY_COST = 3500;
const DEFAULT_LITHIUM_BATTERY_COST = 8800;
const DEFAULT_ELECTRICITY_RATE = 0.12;
const DEFAULT_LABOR_COST = 25.0;
const DEFAULT_FORKLIFT_POWER_CONSUMPTION = 6;

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
                : DEFAULT_NUMBER_OF_FORKLIFTS,
        shiftsPerDay: DEFAULT_SHIFTS_PER_DAY,
        daysPerWeek: DEFAULT_DAYS_PER_WEEK,
        weeksPerYear: DEFAULT_WEEKS_PER_YEAR,
        leadAcidBatteryCost: DEFAULT_LEAD_ACID_BATTERY_COST,
        lithiumBatteryCost: DEFAULT_LITHIUM_BATTERY_COST,
        electricityRate:
            electricityRateFromUrl && !isNaN(parseFloat(electricityRateFromUrl))
                ? Math.max(0, parseFloat(electricityRateFromUrl))
                : DEFAULT_ELECTRICITY_RATE,
        laborCost: DEFAULT_LABOR_COST,
        forkliftPowerConsumption: DEFAULT_FORKLIFT_POWER_CONSUMPTION,
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
