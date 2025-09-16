'use client';

import { useMemo, useState } from 'react';

export interface CalculatorInputs {
    numberOfForklifts: number;
    shiftsPerDay: number;
    daysPerWeek: number;
    weeksPerYear: number;
    leadAcidBatteryCost: number;
    lithiumBatteryCost: number;
    electricityRate: number;
    laborCost: number;
    forkliftPowerConsumption: number;
}

interface CalculatorResults {
    leadAcidInitialInvestment: number;
    lithiumInitialInvestment: number;
    leadAcidReplacementCost: number;
    lithiumReplacementCost: number;
    leadAcidEnergyCost: number;
    lithiumEnergyCost: number;
    leadAcidMaintenanceCost: number;
    lithiumMaintenanceCost: number;
    leadAcidLaborCost: number;
    lithiumLaborCost: number;
    totalLeadAcidCost: number;
    totalLithiumCost: number;
    totalSavings: number;
}

export default function CalculatorClient({
    initialInputs,
}: {
    initialInputs: CalculatorInputs;
}) {
    const [inputs, setInputs] = useState<CalculatorInputs>(initialInputs);

    const results: CalculatorResults = useMemo(() => {
        const {
            numberOfForklifts,
            shiftsPerDay,
            daysPerWeek,
            weeksPerYear,
            leadAcidBatteryCost,
            lithiumBatteryCost,
            electricityRate,
            laborCost,
            forkliftPowerConsumption,
        } = inputs;

        const workingDaysPerYear = daysPerWeek * weeksPerYear;

        const leadAcidInitialInvestment =
            numberOfForklifts * 2 * leadAcidBatteryCost;
        const lithiumInitialInvestment =
            numberOfForklifts * 1 * lithiumBatteryCost;

        const leadAcidReplacementCost =
            numberOfForklifts * leadAcidBatteryCost * 0.5;
        const lithiumReplacementCost = 0;

        const leadAcidEfficiency = 0.75;
        const lithiumEfficiency = 0.95;

        const leadAcidAnnualKwh =
            (numberOfForklifts *
                shiftsPerDay *
                forkliftPowerConsumption *
                workingDaysPerYear) /
            leadAcidEfficiency;
        const lithiumAnnualKwh =
            (numberOfForklifts *
                shiftsPerDay *
                forkliftPowerConsumption *
                workingDaysPerYear) /
            lithiumEfficiency;

        const leadAcidEnergyCost = leadAcidAnnualKwh * electricityRate * 5;
        const lithiumEnergyCost = lithiumAnnualKwh * electricityRate * 5;

        const leadAcidMaintenanceCost = numberOfForklifts * 2 * 200 * 5;
        const lithiumMaintenanceCost = 0;

        const batterySwapsPerYear =
            numberOfForklifts * shiftsPerDay * workingDaysPerYear;
        const swapTimeMinutes = 15;
        const swapTimeHours = (batterySwapsPerYear * swapTimeMinutes) / 60;

        const leadAcidLaborCost = swapTimeHours * laborCost * 5;
        const lithiumLaborCost = 0;

        const totalLeadAcidCost =
            leadAcidInitialInvestment +
            leadAcidReplacementCost +
            leadAcidEnergyCost +
            leadAcidMaintenanceCost +
            leadAcidLaborCost;

        const totalLithiumCost =
            lithiumInitialInvestment +
            lithiumReplacementCost +
            lithiumEnergyCost +
            lithiumMaintenanceCost +
            lithiumLaborCost;

        const totalSavings = totalLeadAcidCost - totalLithiumCost;

        return {
            leadAcidInitialInvestment,
            lithiumInitialInvestment,
            leadAcidReplacementCost,
            lithiumReplacementCost,
            leadAcidEnergyCost,
            lithiumEnergyCost,
            leadAcidMaintenanceCost,
            lithiumMaintenanceCost,
            leadAcidLaborCost,
            lithiumLaborCost,
            totalLeadAcidCost,
            totalLithiumCost,
            totalSavings,
        };
    }, [inputs]);

    const handleInputChange = (
        field: keyof CalculatorInputs,
        value: number
    ) => {
        setInputs(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <>
            <div className="mb-8">
                <h2 className="mb-6 text-2xl font-semibold text-neutral-800">
                    Input Variables/Assumptions (Adjust based on your own
                    numbers)
                </h2>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-neutral-700">
                                Number of Forklifts
                            </label>
                            <input
                                type="number"
                                value={inputs.numberOfForklifts}
                                onChange={e =>
                                    handleInputChange(
                                        'numberOfForklifts',
                                        Number(e.target.value)
                                    )
                                }
                                className="w-24 rounded-md border border-neutral-300 px-2 py-1 text-sm focus:border-transparent focus:ring-2 focus:ring-teal-500 focus:outline-none"
                                min={1}
                            />
                        </div>
                        <p className="text-xs text-neutral-500">
                            Medium sized 51.2 kWh batteries
                        </p>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-neutral-700">
                                Shifts per Day
                            </label>
                            <input
                                type="number"
                                value={inputs.shiftsPerDay}
                                onChange={e =>
                                    handleInputChange(
                                        'shiftsPerDay',
                                        Number(e.target.value)
                                    )
                                }
                                className="w-24 rounded-md border border-neutral-300 px-2 py-1 text-sm focus:border-transparent focus:ring-2 focus:ring-teal-500 focus:outline-none"
                                min={1}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-neutral-700">
                                Days per Week
                            </label>
                            <input
                                type="number"
                                value={inputs.daysPerWeek}
                                onChange={e =>
                                    handleInputChange(
                                        'daysPerWeek',
                                        Number(e.target.value)
                                    )
                                }
                                className="w-24 rounded-md border border-neutral-300 px-2 py-1 text-sm focus:border-transparent focus:ring-2 focus:ring-teal-500 focus:outline-none"
                                min={1}
                                max={7}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-neutral-700">
                                Weeks per Year
                            </label>
                            <input
                                type="number"
                                value={inputs.weeksPerYear}
                                onChange={e =>
                                    handleInputChange(
                                        'weeksPerYear',
                                        Number(e.target.value)
                                    )
                                }
                                className="w-24 rounded-md border border-neutral-300 px-2 py-1 text-sm focus:border-transparent focus:ring-2 focus:ring-teal-500 focus:outline-none"
                                min={1}
                                max={52}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-neutral-700">
                                Lead-Acid Battery Cost
                            </label>
                            <div className="relative">
                                <span className="absolute top-1 left-2 text-sm text-neutral-500">
                                    $
                                </span>
                                <input
                                    type="number"
                                    value={inputs.leadAcidBatteryCost}
                                    onChange={e =>
                                        handleInputChange(
                                            'leadAcidBatteryCost',
                                            Number(e.target.value)
                                        )
                                    }
                                    className="w-24 rounded-md border border-neutral-300 py-1 pr-2 pl-6 text-sm focus:border-transparent focus:ring-2 focus:ring-teal-500 focus:outline-none"
                                    min={0}
                                />
                            </div>
                        </div>
                        <p className="text-xs text-neutral-500">
                            Per battery (including core exchange)
                        </p>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-neutral-700">
                                Lithium (LFP) Battery Cost
                            </label>
                            <div className="relative">
                                <span className="absolute top-1 left-2 text-sm text-neutral-500">
                                    $
                                </span>
                                <input
                                    type="number"
                                    value={inputs.lithiumBatteryCost}
                                    onChange={e =>
                                        handleInputChange(
                                            'lithiumBatteryCost',
                                            Number(e.target.value)
                                        )
                                    }
                                    className="w-24 rounded-md border border-neutral-300 py-1 pr-2 pl-6 text-sm focus:border-transparent focus:ring-2 focus:ring-teal-500 focus:outline-none"
                                    min={0}
                                />
                            </div>
                        </div>
                        <p className="text-xs text-neutral-500">
                            Includes specialized charger
                        </p>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-neutral-700">
                                Electricity Rate
                            </label>
                            <div className="relative">
                                <span className="absolute top-1 left-2 text-sm text-neutral-500">
                                    $
                                </span>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={inputs.electricityRate}
                                    onChange={e =>
                                        handleInputChange(
                                            'electricityRate',
                                            Number(e.target.value)
                                        )
                                    }
                                    className="w-24 rounded-md border border-neutral-300 py-1 pr-2 pl-6 text-sm focus:border-transparent focus:ring-2 focus:ring-teal-500 focus:outline-none"
                                    min={0}
                                />
                            </div>
                        </div>
                        <p className="text-xs text-neutral-500">Per kWh</p>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-neutral-700">
                                Labor Cost
                            </label>
                            <div className="relative">
                                <span className="absolute top-1 left-2 text-sm text-neutral-500">
                                    $
                                </span>
                                <input
                                    type="number"
                                    value={inputs.laborCost}
                                    onChange={e =>
                                        handleInputChange(
                                            'laborCost',
                                            Number(e.target.value)
                                        )
                                    }
                                    className="w-24 rounded-md border border-neutral-300 py-1 pr-2 pl-6 text-sm focus:border-transparent focus:ring-2 focus:ring-teal-500 focus:outline-none"
                                    min={0}
                                />
                            </div>
                        </div>
                        <p className="text-xs text-neutral-500">
                            Per hour (including benefits & overhead)
                        </p>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-neutral-700">
                                Forklift Power Consumption
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    value={inputs.forkliftPowerConsumption}
                                    onChange={e =>
                                        handleInputChange(
                                            'forkliftPowerConsumption',
                                            Number(e.target.value)
                                        )
                                    }
                                    className="w-24 rounded-md border border-neutral-300 px-2 py-1 pr-8 text-sm focus:border-transparent focus:ring-2 focus:ring-teal-500 focus:outline-none"
                                    min={0}
                                />
                                <span className="absolute top-1 right-2 text-sm text-neutral-500">
                                    kWh
                                </span>
                            </div>
                        </div>
                        <p className="text-xs text-neutral-500">
                            Per shift (avg for 3,000-4,000 lb capacity)
                        </p>
                    </div>
                </div>
            </div>

            <div className="mb-8">
                <h2 className="mb-6 text-2xl font-semibold text-neutral-800">
                    5 Year Total Cost of Ownership (TCO) Breakdown
                </h2>

                <div className="mb-6 rounded-lg bg-neutral-50 p-6">
                    <h3 className="mb-4 text-xl font-semibold text-neutral-800">
                        1. Upfront Capital Investment (Year 0)
                    </h3>
                    <div className="space-y-3">
                        <p className="text-neutral-700">
                            <strong>Lead-Acid:</strong> You will need 2
                            batteries per forklift to operate 2 shifts (one
                            charging while the other is in use).
                        </p>
                        <p className="ml-4 text-neutral-700">
                            {inputs.numberOfForklifts} forklifts × 2
                            batteries/forklift ×{' '}
                            {formatCurrency(inputs.leadAcidBatteryCost)}/battery
                            ={' '}
                            <strong>
                                {formatCurrency(
                                    results.leadAcidInitialInvestment
                                )}
                            </strong>
                        </p>
                        <p className="text-neutral-700">
                            <strong>Lithium:</strong> You only need 1 battery
                            per forklift as it charges during breaks and between
                            shifts.
                        </p>
                        <p className="ml-4 text-neutral-700">
                            {inputs.numberOfForklifts} forklifts × 1
                            battery/forklift ×{' '}
                            {formatCurrency(inputs.lithiumBatteryCost)}/battery
                            ={' '}
                            <strong>
                                {formatCurrency(
                                    results.lithiumInitialInvestment
                                )}
                            </strong>
                        </p>
                        <p className="text-lg font-semibold text-green-600">
                            Difference: Lithium saves you{' '}
                            {formatCurrency(
                                results.leadAcidInitialInvestment -
                                    results.lithiumInitialInvestment
                            )}{' '}
                            in upfront costs
                        </p>
                    </div>
                </div>

                <div className="mb-6 rounded-lg bg-neutral-50 p-6">
                    <h3 className="mb-4 text-xl font-semibold text-neutral-800">
                        2. Battery Replacement Costs
                    </h3>
                    <div className="space-y-3">
                        <p className="text-neutral-700">
                            <strong>Lead-Acid:</strong> Lifespan is ~5 years or
                            1,500 cycles. In our 2-shift model, they are cycled
                            heavily and will likely need replacement once during
                            this 5-year period. Let's say 50% of them need
                            replacement.
                        </p>
                        <p className="ml-4 text-neutral-700">
                            Replacement Cost = {inputs.numberOfForklifts}{' '}
                            batteries ×{' '}
                            {formatCurrency(inputs.leadAcidBatteryCost)}/battery
                            ={' '}
                            <strong>
                                {formatCurrency(
                                    results.leadAcidReplacementCost
                                )}
                            </strong>{' '}
                            (incurred around year 3)
                        </p>
                        <p className="text-neutral-700">
                            <strong>Lithium:</strong> Lifespan is ~5,000 cycles.
                            It will easily last the entire 5-year period without
                            replacement.
                        </p>
                        <p className="ml-4 text-neutral-700">
                            Replacement Cost ={' '}
                            <strong>
                                {formatCurrency(results.lithiumReplacementCost)}
                            </strong>
                        </p>
                        <p className="text-lg font-semibold text-green-600">
                            Difference: Lithium saves{' '}
                            {formatCurrency(results.leadAcidReplacementCost)} in
                            replacement costs.
                        </p>
                    </div>
                </div>

                <div className="mb-6 rounded-lg bg-neutral-50 p-6">
                    <h3 className="mb-4 text-xl font-semibold text-neutral-800">
                        3. Energy & Electricity Costs
                    </h3>
                    <div className="space-y-3">
                        <p className="text-neutral-700">
                            <strong>Lead-Acid:</strong> ~75% efficient. It uses
                            more electricity to charge due to heat and gas
                            generation.
                        </p>
                        <p className="ml-4 text-neutral-700">
                            Annual kWh Usage = ({inputs.numberOfForklifts}{' '}
                            forklifts × {inputs.shiftsPerDay} shifts ×{' '}
                            {inputs.forkliftPowerConsumption} kWh/shift ×{' '}
                            {inputs.daysPerWeek * inputs.weeksPerYear} days) ÷
                            0.75 efficiency ={' '}
                            {(
                                (inputs.numberOfForklifts *
                                    inputs.shiftsPerDay *
                                    inputs.forkliftPowerConsumption *
                                    inputs.daysPerWeek *
                                    inputs.weeksPerYear) /
                                0.75
                            ).toLocaleString()}{' '}
                            kWh
                        </p>
                        <p className="ml-4 text-neutral-700">
                            5-Year Energy Cost ={' '}
                            {(
                                (inputs.numberOfForklifts *
                                    inputs.shiftsPerDay *
                                    inputs.forkliftPowerConsumption *
                                    inputs.daysPerWeek *
                                    inputs.weeksPerYear) /
                                0.75
                            ).toLocaleString()}{' '}
                            kWh/year × {formatCurrency(inputs.electricityRate)}
                            /kWh × 5 years ={' '}
                            <strong>
                                {formatCurrency(results.leadAcidEnergyCost)}
                            </strong>
                        </p>
                        <p className="text-neutral-700">
                            <strong>Lithium:</strong> More than 95% efficient,
                            up to 99%
                        </p>
                        <p className="ml-4 text-neutral-700">
                            Annual kWh Usage = ({inputs.numberOfForklifts}{' '}
                            forklifts × {inputs.shiftsPerDay} shifts ×{' '}
                            {inputs.forkliftPowerConsumption} kWh/shift ×{' '}
                            {inputs.daysPerWeek * inputs.weeksPerYear} days) ÷
                            0.95 efficiency ={' '}
                            {(
                                (inputs.numberOfForklifts *
                                    inputs.shiftsPerDay *
                                    inputs.forkliftPowerConsumption *
                                    inputs.daysPerWeek *
                                    inputs.weeksPerYear) /
                                0.95
                            ).toLocaleString()}{' '}
                            kWh
                        </p>
                        <p className="ml-4 text-neutral-700">
                            5-Year Energy Cost ={' '}
                            {(
                                (inputs.numberOfForklifts *
                                    inputs.shiftsPerDay *
                                    inputs.forkliftPowerConsumption *
                                    inputs.daysPerWeek *
                                    inputs.weeksPerYear) /
                                0.95
                            ).toLocaleString()}{' '}
                            kWh/year × {formatCurrency(inputs.electricityRate)}
                            /kWh × 5 years ={' '}
                            <strong>
                                {formatCurrency(results.lithiumEnergyCost)}
                            </strong>
                        </p>
                        <p className="text-lg font-semibold text-green-600">
                            Difference: Lithium LFP saves{' '}
                            {formatCurrency(
                                results.leadAcidEnergyCost -
                                    results.lithiumEnergyCost
                            )}{' '}
                            in energy costs over 5 years.
                        </p>
                    </div>
                </div>

                <div className="mb-6 rounded-lg bg-neutral-50 p-6">
                    <h3 className="mb-4 text-xl font-semibold text-neutral-800">
                        4. Maintenance & Watering Costs
                    </h3>
                    <div className="space-y-3">
                        <p className="text-neutral-700">
                            <strong>Lead-Acid:</strong> Requires regular
                            watering and cleaning. Estimate ~$200 per battery
                            per year in maintenance labour, and additives.
                        </p>
                        <p className="ml-4 text-neutral-700">
                            {inputs.numberOfForklifts * 2} batteries ×
                            $200/battery/year × 5 years ={' '}
                            <strong>
                                {formatCurrency(
                                    results.leadAcidMaintenanceCost
                                )}
                            </strong>
                        </p>
                        <p className="text-neutral-700">
                            <strong>Lithium:</strong> Effectively zero
                            maintenance (normal conditions)
                        </p>
                        <p className="ml-4 text-neutral-700">
                            5-Year Maintenance Cost ={' '}
                            <strong>
                                {formatCurrency(results.lithiumMaintenanceCost)}
                            </strong>
                        </p>
                        <p className="text-lg font-semibold text-green-600">
                            Difference: Lithium saves{' '}
                            {formatCurrency(results.leadAcidMaintenanceCost)} in
                            maintenance costs.
                        </p>
                    </div>
                </div>

                <div className="mb-6 rounded-lg bg-neutral-50 p-6">
                    <h3 className="mb-4 text-xl font-semibold text-neutral-800">
                        5. Labour Cost for Battery Swapping
                    </h3>
                    <div className="space-y-3">
                        <p className="text-neutral-700">
                            This is a major often hidden, cost.
                        </p>
                        <p className="text-neutral-700">
                            <strong>Lead-Acid:</strong> Each battery swap takes
                            ~15 minutes (including travel to/from the charging
                            room). 2 swaps per forklift per day.
                        </p>
                        <p className="ml-4 text-neutral-700">
                            Annual Labour Hours ={' '}
                            {(
                                (inputs.numberOfForklifts *
                                    inputs.shiftsPerDay *
                                    inputs.daysPerWeek *
                                    inputs.weeksPerYear *
                                    15) /
                                60
                            ).toLocaleString()}{' '}
                            hours
                        </p>
                        <p className="ml-4 text-neutral-700">
                            5-Year Hidden Labour Cost ={' '}
                            {(
                                (inputs.numberOfForklifts *
                                    inputs.shiftsPerDay *
                                    inputs.daysPerWeek *
                                    inputs.weeksPerYear *
                                    15) /
                                60
                            ).toLocaleString()}{' '}
                            hours/year × {formatCurrency(inputs.laborCost)}/hour
                            × 5 years ={' '}
                            <strong>
                                {formatCurrency(results.leadAcidLaborCost)}
                            </strong>
                        </p>
                        <p className="text-neutral-700">
                            <strong>Lithium:</strong> No battery swapping. The
                            operator plugs in the truck themselves during a
                            break (opportunity charging).
                        </p>
                        <p className="ml-4 text-neutral-700">
                            5-Year Labour Cost ={' '}
                            <strong>
                                {formatCurrency(results.lithiumLaborCost)}
                            </strong>
                        </p>
                        <p className="text-lg font-semibold text-green-600">
                            Difference: Lithium saves{' '}
                            {formatCurrency(results.leadAcidLaborCost)} in
                            swapping labor costs
                        </p>
                    </div>
                </div>

                <div className="mb-8">
                    <h3 className="mb-4 text-xl font-semibold text-neutral-800">
                        The 5-Year Cost Estimate Summary for{' '}
                        {inputs.numberOfForklifts} Forklifts: Lithium vs.
                        Lead-Acid
                    </h3>

                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-neutral-300">
                            <thead>
                                <tr className="bg-neutral-100">
                                    <th className="border border-neutral-300 px-4 py-2 text-left font-semibold">
                                        Cost Category
                                    </th>
                                    <th className="border border-neutral-300 px-4 py-2 text-right font-semibold">
                                        Lead-Acid
                                    </th>
                                    <th className="border border-neutral-300 px-4 py-2 text-right font-semibold">
                                        Lithium (LFP)
                                    </th>
                                    <th className="border border-neutral-300 px-4 py-2 text-right font-semibold">
                                        Savings with Lithium
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="border border-neutral-300 px-4 py-2 font-medium">
                                        1. Initial Investment
                                    </td>
                                    <td className="border border-neutral-300 px-4 py-2 text-right">
                                        {formatCurrency(
                                            results.leadAcidInitialInvestment
                                        )}
                                    </td>
                                    <td className="border border-neutral-300 px-4 py-2 text-right">
                                        {formatCurrency(
                                            results.lithiumInitialInvestment
                                        )}
                                    </td>
                                    <td className="border border-neutral-300 px-4 py-2 text-right text-green-600">
                                        {formatCurrency(
                                            results.leadAcidInitialInvestment -
                                                results.lithiumInitialInvestment
                                        )}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="border border-neutral-300 px-4 py-2 font-medium">
                                        2. Battery Replacement
                                    </td>
                                    <td className="border border-neutral-300 px-4 py-2 text-right">
                                        {formatCurrency(
                                            results.leadAcidReplacementCost
                                        )}
                                    </td>
                                    <td className="border border-neutral-300 px-4 py-2 text-right">
                                        {formatCurrency(
                                            results.lithiumReplacementCost
                                        )}
                                    </td>
                                    <td className="border border-neutral-300 px-4 py-2 text-right text-green-600">
                                        +
                                        {formatCurrency(
                                            results.leadAcidReplacementCost
                                        )}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="border border-neutral-300 px-4 py-2 font-medium">
                                        3. Energy Cost
                                    </td>
                                    <td className="border border-neutral-300 px-4 py-2 text-right">
                                        {formatCurrency(
                                            results.leadAcidEnergyCost
                                        )}
                                    </td>
                                    <td className="border border-neutral-300 px-4 py-2 text-right">
                                        {formatCurrency(
                                            results.lithiumEnergyCost
                                        )}
                                    </td>
                                    <td className="border border-neutral-300 px-4 py-2 text-right text-green-600">
                                        +
                                        {formatCurrency(
                                            results.leadAcidEnergyCost -
                                                results.lithiumEnergyCost
                                        )}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="border border-neutral-300 px-4 py-2 font-medium">
                                        4. Maintenance
                                    </td>
                                    <td className="border border-neutral-300 px-4 py-2 text-right">
                                        {formatCurrency(
                                            results.leadAcidMaintenanceCost
                                        )}
                                    </td>
                                    <td className="border border-neutral-300 px-4 py-2 text-right">
                                        {formatCurrency(
                                            results.lithiumMaintenanceCost
                                        )}
                                    </td>
                                    <td className="border border-neutral-300 px-4 py-2 text-right text-green-600">
                                        +
                                        {formatCurrency(
                                            results.leadAcidMaintenanceCost
                                        )}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="border border-neutral-300 px-4 py-2 font-medium">
                                        5. Labour (swapping)
                                    </td>
                                    <td className="border border-neutral-300 px-4 py-2 text-right">
                                        {formatCurrency(
                                            results.leadAcidLaborCost
                                        )}
                                    </td>
                                    <td className="border border-neutral-300 px-4 py-2 text-right">
                                        {formatCurrency(
                                            results.lithiumLaborCost
                                        )}
                                    </td>
                                    <td className="border border-neutral-300 px-4 py-2 text-right text-green-600">
                                        +
                                        {formatCurrency(
                                            results.leadAcidLaborCost
                                        )}
                                    </td>
                                </tr>
                                <tr className="bg-neutral-100 font-bold">
                                    <td className="border border-neutral-300 px-4 py-2 font-bold">
                                        Total 5-Year Cost
                                    </td>
                                    <td className="border border-neutral-300 px-4 py-2 text-right">
                                        {formatCurrency(
                                            results.totalLeadAcidCost
                                        )}
                                    </td>
                                    <td className="border border-neutral-300 px-4 py-2 text-right">
                                        {formatCurrency(
                                            results.totalLithiumCost
                                        )}
                                    </td>
                                    <td className="border border-neutral-300 px-4 py-2 text-right font-bold text-green-600">
                                        +{formatCurrency(results.totalSavings)}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-6">
                    <h3 className="mb-4 text-xl font-semibold text-green-800">
                        Net 5-Year Savings with Lithium LFP
                    </h3>
                    <p className="mb-4 text-2xl font-bold text-green-600">
                        {formatCurrency(results.totalSavings)} for{' '}
                        {inputs.numberOfForklifts} forklifts
                    </p>
                    <p className="text-green-700">
                        The net additional investment is{' '}
                        {formatCurrency(
                            results.lithiumInitialInvestment -
                                results.leadAcidInitialInvestment
                        )}{' '}
                        and is paid back in about a month. The ongoing savings
                        are pure profit to invest in other areas of your
                        business.
                    </p>
                </div>

                <div className="space-y-4">
                    <div className="rounded-lg border border-blue-200 bg-gray-50 p-4">
                        <h4 className="mb-2 font-semibold">
                            Charging Room Cost Elimination
                        </h4>
                        <p className="text-sm">
                            Lead acid batteries require a dedicated room because
                            the chemical reaction from charging and discharging
                            lead acid batteries releases hydrogen gas from the
                            electrolysis of distilled water. Sulfuric acid
                            electrolyte requires careful handling due to
                            corrosive and toxic nature. Lithium LFP batteries do
                            not require this dedicated room and you can reclaim
                            this valuable real-estate for storage or production.
                            This could be an extra 1000s of square feet.
                        </p>
                    </div>

                    <div className="rounded-lg border border-purple-200 bg-gray-50 p-4">
                        <h4 className="mb-2 font-semibold">
                            Productivity Gains
                        </h4>
                        <p className="text-sm">
                            This is a hidden opportunity cost that is often
                            missed by business planners. With lead acid
                            batteries, a forklift is taken out of service for
                            15-20 minutes per shift for swapping. With lithium,
                            it's a 15-second plug-in. This means more uptime and
                            productivity. Potential savings of{' '}
                            {(
                                (inputs.numberOfForklifts *
                                    inputs.shiftsPerDay *
                                    inputs.daysPerWeek *
                                    inputs.weeksPerYear *
                                    15) /
                                60
                            ).toLocaleString()}{' '}
                            hour swap time saved over 5 years ={' '}
                            {(
                                (inputs.numberOfForklifts *
                                    inputs.shiftsPerDay *
                                    inputs.daysPerWeek *
                                    inputs.weeksPerYear *
                                    15) /
                                60
                            ).toLocaleString()}{' '}
                            hours of forklift operation time. What is the value
                            of that extra productivity for your business?
                        </p>
                    </div>

                    <div className="rounded-lg border border-orange-200 bg-gray-50 p-4">
                        <h4 className="mb-2 font-semibold">Improved Safety</h4>
                        <p className="text-sm">
                            Reduced risk of injury from heavy battery swapping,
                            acid spills, and hydrogen explosions. This can lower
                            insurance premiums and costly accident lawsuits.
                        </p>
                    </div>

                    <div className="rounded-lg border bg-gray-50 p-4">
                        <h4 className="mb-2 font-semibold text-teal-800">
                            Consistent Power
                        </h4>
                        <p className="text-sm text-teal-700">
                            Lithium provides full power until it's nearly empty,
                            unlike lead-acid which steadily declines, leading to
                            slower operation towards the end of the shift.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
