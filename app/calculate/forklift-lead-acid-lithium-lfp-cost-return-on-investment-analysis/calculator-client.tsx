'use client';

import { useMemo, useState } from 'react';
import RoiGraph from './roi-graph';

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

const texts = {
    inputs: {
        title: 'Variables de entrada/Supuestos (Ajuste según sus propios números)',
        labels: {
            numberOfForklifts: 'Número de montacargas',
            shiftsPerDay: 'Turnos por día',
            daysPerWeek: 'Días por semana',
            weeksPerYear: 'Semanas por año',
            leadAcidBatteryCost: 'Costo de batería de plomo-ácido',
            lithiumBatteryCost: 'Costo de batería de litio (LFP)',
            electricityRate: 'Tarifa de electricidad',
            laborCost: 'Costo de mano de obra',
            forkliftPowerConsumption: 'Consumo de energía del montacargas',
        },
        helpers: {
            perBatteryNote: 'Por batería (incluye intercambio de núcleo)',
            includesCharger: 'Incluye cargador especializado',
            perKwh: 'Por kWh',
            perShiftNote:
                'Por turno (promedio para capacidad de 3,000-4,000 lb)',
        },
    },
    tco: {
        title: 'Desglose del costo total de propiedad (TCO) a 5 años',
        tableHeaders: {
            costCategory: 'Categoría de costo',
            leadAcid: 'Plomo-ácido',
            lithium: 'Litio (LFP)',
            savings: 'Ahorros con Litio',
        },
        rowLabels: {
            initialInvestment: '1. Inversión inicial',
            batteryReplacement: '2. Reemplazo de baterías',
            energyCost: '3. Costo de energía',
            maintenance: '4. Mantenimiento',
            labor: '5. Mano de obra (cambio)',
            total5YearCost: 'Costo total a 5 años',
        },
    },
    netSavings: {
        title: 'Ahorro neto a 5 años con Litio LFP',
        forForklifts: 'para',
        forklifts: 'montacargas',
    },
    difference: {
        zero: (category: string) =>
            `Diferencia: No hay diferencia de costo en ${category}`,
        negative: (amount: string, category: string) =>
            `El litio cuesta $${amount} más en ${category}`,
        positive: (amount: string, category: string) =>
            `Diferencia: El litio le ahorra $${amount} en ${category}`,
    },
};

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
            numberOfForklifts * shiftsPerDay * leadAcidBatteryCost;
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
        let nextValue = value;
        if (field === 'shiftsPerDay') {
            nextValue = Math.max(1, Math.min(3, value));
        }

        setInputs(prev => ({
            ...prev,
            [field]: nextValue,
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
                    {texts.inputs.title}
                </h2>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-neutral-700">
                                {texts.inputs.labels.numberOfForklifts}
                            </label>
                            <input
                                type="number"
                                defaultValue={inputs.numberOfForklifts}
                                onBlur={e =>
                                    handleInputChange(
                                        'numberOfForklifts',
                                        Number(e.target.value)
                                    )
                                }
                                className="w-24 appearance-none rounded-md border border-neutral-300 px-2 py-1 text-sm focus:border-transparent focus:ring-2 focus:ring-teal-500 focus:outline-none"
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
                                {texts.inputs.labels.shiftsPerDay}
                            </label>
                            <input
                                type="number"
                                defaultValue={inputs.shiftsPerDay}
                                onBlur={e =>
                                    handleInputChange(
                                        'shiftsPerDay',
                                        Number(e.target.value)
                                    )
                                }
                                className="w-24 appearance-none rounded-md border border-neutral-300 px-2 py-1 text-sm focus:border-transparent focus:ring-2 focus:ring-teal-500 focus:outline-none"
                                min={1}
                                max={3}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-neutral-700">
                                {texts.inputs.labels.daysPerWeek}
                            </label>
                            <input
                                type="number"
                                defaultValue={inputs.daysPerWeek}
                                onBlur={e =>
                                    handleInputChange(
                                        'daysPerWeek',
                                        Number(e.target.value)
                                    )
                                }
                                className="w-24 appearance-none rounded-md border border-neutral-300 px-2 py-1 text-sm focus:border-transparent focus:ring-2 focus:ring-teal-500 focus:outline-none"
                                min={1}
                                max={7}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-neutral-700">
                                {texts.inputs.labels.weeksPerYear}
                            </label>
                            <input
                                type="number"
                                defaultValue={inputs.weeksPerYear}
                                onBlur={e =>
                                    handleInputChange(
                                        'weeksPerYear',
                                        Number(e.target.value)
                                    )
                                }
                                className="w-24 appearance-none rounded-md border border-neutral-300 px-2 py-1 text-sm focus:border-transparent focus:ring-2 focus:ring-teal-500 focus:outline-none"
                                min={1}
                                max={52}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-neutral-700">
                                {texts.inputs.labels.leadAcidBatteryCost}
                            </label>
                            <div className="relative">
                                <span className="absolute top-1 left-2 text-sm text-neutral-500">
                                    $
                                </span>
                                <input
                                    type="number"
                                    defaultValue={inputs.leadAcidBatteryCost}
                                    onBlur={e =>
                                        handleInputChange(
                                            'leadAcidBatteryCost',
                                            Number(e.target.value)
                                        )
                                    }
                                    className="w-24 appearance-none rounded-md border border-neutral-300 py-1 pr-2 pl-6 text-sm focus:border-transparent focus:ring-2 focus:ring-teal-500 focus:outline-none"
                                    min={0}
                                />
                            </div>
                        </div>
                        <p className="text-xs text-neutral-500">
                            {texts.inputs.helpers.perBatteryNote}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-neutral-700">
                                {texts.inputs.labels.lithiumBatteryCost}
                            </label>
                            <div className="relative">
                                <span className="absolute top-1 left-2 text-sm text-neutral-500">
                                    $
                                </span>
                                <input
                                    type="number"
                                    defaultValue={inputs.lithiumBatteryCost}
                                    onBlur={e =>
                                        handleInputChange(
                                            'lithiumBatteryCost',
                                            Number(e.target.value)
                                        )
                                    }
                                    className="w-24 appearance-none rounded-md border border-neutral-300 py-1 pr-2 pl-6 text-sm focus:border-transparent focus:ring-2 focus:ring-teal-500 focus:outline-none"
                                    min={0}
                                />
                            </div>
                        </div>
                        <p className="text-xs text-neutral-500">
                            {texts.inputs.helpers.includesCharger}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-neutral-700">
                                {texts.inputs.labels.electricityRate}
                            </label>
                            <div className="relative">
                                <span className="absolute top-1 left-2 text-sm text-neutral-500">
                                    $
                                </span>
                                <input
                                    type="number"
                                    step="0.01"
                                    defaultValue={inputs.electricityRate}
                                    onBlur={e =>
                                        handleInputChange(
                                            'electricityRate',
                                            Number(e.target.value)
                                        )
                                    }
                                    className="w-24 appearance-none rounded-md border border-neutral-300 py-1 pr-2 pl-6 text-sm focus:border-transparent focus:ring-2 focus:ring-teal-500 focus:outline-none"
                                    min={0}
                                />
                            </div>
                        </div>
                        <p className="text-xs text-neutral-500">
                            {texts.inputs.helpers.perKwh}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-neutral-700">
                                {texts.inputs.labels.laborCost}
                            </label>
                            <div className="relative">
                                <span className="absolute top-1 left-2 text-sm text-neutral-500">
                                    $
                                </span>
                                <input
                                    type="number"
                                    defaultValue={inputs.laborCost}
                                    onBlur={e =>
                                        handleInputChange(
                                            'laborCost',
                                            Number(e.target.value)
                                        )
                                    }
                                    className="w-24 appearance-none rounded-md border border-neutral-300 py-1 pr-2 pl-6 text-sm focus:border-transparent focus:ring-2 focus:ring-teal-500 focus:outline-none"
                                    min={0}
                                />
                            </div>
                        </div>
                        <p className="text-xs text-neutral-500">
                            Por hora (incluye prestaciones y gastos generales)
                        </p>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-neutral-700">
                                {texts.inputs.labels.forkliftPowerConsumption}
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    defaultValue={
                                        inputs.forkliftPowerConsumption
                                    }
                                    onBlur={e =>
                                        handleInputChange(
                                            'forkliftPowerConsumption',
                                            Number(e.target.value)
                                        )
                                    }
                                    className="w-24 appearance-none rounded-md border border-neutral-300 px-2 py-1 pr-8 text-sm focus:border-transparent focus:ring-2 focus:ring-teal-500 focus:outline-none"
                                    min={0}
                                />
                                <span className="absolute top-1 right-2 text-sm text-neutral-500">
                                    kWh
                                </span>
                            </div>
                        </div>
                        <p className="text-xs text-neutral-500">
                            {texts.inputs.helpers.perShiftNote}
                        </p>
                    </div>
                </div>
            </div>

            <div className="mb-8">
                <h2 className="mb-6 text-2xl font-semibold text-neutral-800">
                    {texts.tco.title}
                </h2>

                <div className="mb-6 rounded-lg bg-neutral-50 p-6">
                    <h3 className="mb-4 text-xl font-semibold text-neutral-800">
                        1. Inversión de capital inicial (Año 0)
                    </h3>
                    <div className="space-y-3">
                        <p className="text-neutral-700">
                            <strong>Plomo-ácido:</strong> Necesitará{' '}
                            {inputs.shiftsPerDay} baterías por montacargas para
                            operar {inputs.shiftsPerDay} turnos (rotación
                            mientras se cargan).
                        </p>
                        <p className="ml-4 text-neutral-700">
                            {inputs.numberOfForklifts} montacargas ×{' '}
                            {inputs.shiftsPerDay} baterías/montacargas ×{' '}
                            {formatCurrency(inputs.leadAcidBatteryCost)}/batería
                            ={' '}
                            <strong>
                                {formatCurrency(
                                    results.leadAcidInitialInvestment
                                )}
                            </strong>
                        </p>
                        <p className="text-neutral-700">
                            <strong>Litio:</strong> Solo necesita 1 batería por
                            montacargas ya que se carga durante los descansos y
                            entre turnos.
                        </p>
                        <p className="ml-4 text-neutral-700">
                            {inputs.numberOfForklifts} montacargas × 1
                            batería/montacargas ×{' '}
                            {formatCurrency(inputs.lithiumBatteryCost)}/batería
                            ={' '}
                            <strong>
                                {formatCurrency(
                                    results.lithiumInitialInvestment
                                )}
                            </strong>
                        </p>
                        <DifferenceDisplay
                            leadAcidCost={results.leadAcidInitialInvestment}
                            lithiumCost={results.lithiumInitialInvestment}
                            category="costos iniciales"
                        />
                    </div>
                </div>

                <div className="mb-6 rounded-lg bg-neutral-50 p-6">
                    <h3 className="mb-4 text-xl font-semibold text-neutral-800">
                        2. Costos de reemplazo de baterías
                    </h3>
                    <div className="space-y-3">
                        <p className="text-neutral-700">
                            <strong>Plomo-ácido:</strong> Vida útil ~5 años o
                            1,500 ciclos. En nuestro modelo de 2 turnos, se
                            ciclan con frecuencia y probablemente necesiten un
                            reemplazo durante este periodo de 5 años. Supongamos
                            que el 50% requiere reemplazo.
                        </p>
                        <p className="ml-4 text-neutral-700">
                            Costo de reemplazo = {inputs.numberOfForklifts}{' '}
                            baterías × 50% ×{' '}
                            {formatCurrency(inputs.leadAcidBatteryCost)}/batería
                            ={' '}
                            <strong>
                                {formatCurrency(
                                    results.leadAcidReplacementCost
                                )}
                            </strong>{' '}
                            (ocurre aproximadamente en el año 3)
                        </p>
                        <p className="text-neutral-700">
                            <strong>Litio:</strong> Vida útil ~5,000 ciclos.
                            Durará fácilmente todo el período de 5 años sin
                            reemplazo.
                        </p>
                        <p className="ml-4 text-neutral-700">
                            Replacement Cost ={' '}
                            <strong>
                                {formatCurrency(results.lithiumReplacementCost)}
                            </strong>
                        </p>
                        <DifferenceDisplay
                            leadAcidCost={results.leadAcidReplacementCost}
                            lithiumCost={results.lithiumReplacementCost}
                            category="costos de reemplazo"
                        />
                    </div>
                </div>

                <div className="mb-6 rounded-lg bg-neutral-50 p-6">
                    <h3 className="mb-4 text-xl font-semibold text-neutral-800">
                        3. Costos de energía y electricidad
                    </h3>
                    <div className="space-y-3">
                        <p className="text-neutral-700">
                            <strong>Plomo-ácido:</strong> ~75% de eficiencia.
                            Consume más electricidad al cargar por calor y
                            generación de gas.
                        </p>
                        <p className="ml-4 text-neutral-700">
                            Consumo anual (kWh) = ({inputs.numberOfForklifts}{' '}
                            montacargas × {inputs.shiftsPerDay} turnos ×{' '}
                            {inputs.forkliftPowerConsumption} kWh/turno ×{' '}
                            {inputs.daysPerWeek * inputs.weeksPerYear} días) ÷
                            0.75 de eficiencia ={' '}
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
                            kWh/año × {formatCurrency(inputs.electricityRate)}
                            /kWh × 5 años ={' '}
                            <strong>
                                {formatCurrency(results.leadAcidEnergyCost)}
                            </strong>
                        </p>
                        <p className="text-neutral-700">
                            <strong>Litio:</strong> Más del 95% de eficiencia,
                            hasta el 99%
                        </p>
                        <p className="ml-4 text-neutral-700">
                            Consumo anual (kWh) = ({inputs.numberOfForklifts}{' '}
                            montacargas × {inputs.shiftsPerDay} turnos ×{' '}
                            {inputs.forkliftPowerConsumption} kWh/turno ×{' '}
                            {inputs.daysPerWeek * inputs.weeksPerYear} días) ÷
                            0.95 de eficiencia ={' '}
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
                            kWh/año × {formatCurrency(inputs.electricityRate)}
                            /kWh × 5 años ={' '}
                            <strong>
                                {formatCurrency(results.lithiumEnergyCost)}
                            </strong>
                        </p>
                        <DifferenceDisplay
                            leadAcidCost={results.leadAcidEnergyCost}
                            lithiumCost={results.lithiumEnergyCost}
                            category="costos de energía en 5 años"
                        />
                    </div>
                </div>

                <div className="mb-6 rounded-lg bg-neutral-50 p-6">
                    <h3 className="mb-4 text-xl font-semibold text-neutral-800">
                        4. Costos de mantenimiento y riego
                    </h3>
                    <div className="space-y-3">
                        <p className="text-neutral-700">
                            <strong>Plomo-ácido:</strong> Requiere riego y
                            limpieza regular. Estime ~$200 por batería al año en
                            mano de obra de mantenimiento y aditivos.
                        </p>
                        <p className="ml-4 text-neutral-700">
                            {inputs.numberOfForklifts * 2} baterías ×
                            $200/batería/año × 5 años ={' '}
                            <strong>
                                {formatCurrency(
                                    results.leadAcidMaintenanceCost
                                )}
                            </strong>
                        </p>
                        <p className="text-neutral-700">
                            <strong>Litio:</strong> Efectivamente cero
                            mantenimiento (condiciones normales)
                        </p>
                        <p className="ml-4 text-neutral-700">
                            5-Year Maintenance Cost ={' '}
                            <strong>
                                {formatCurrency(results.lithiumMaintenanceCost)}
                            </strong>
                        </p>
                        <DifferenceDisplay
                            leadAcidCost={results.leadAcidMaintenanceCost}
                            lithiumCost={results.lithiumMaintenanceCost}
                            category="costos de mantenimiento"
                        />
                    </div>
                </div>

                <div className="mb-6 rounded-lg bg-neutral-50 p-6">
                    <h3 className="mb-4 text-xl font-semibold text-neutral-800">
                        5. Costo de mano de obra por cambio de baterías
                    </h3>
                    <div className="space-y-3">
                        <p className="text-neutral-700">
                            Este es un costo importante y a menudo oculto.
                        </p>
                        <p className="text-neutral-700">
                            <strong>Plomo-ácido:</strong> Cada cambio toma ~15
                            minutos (incluido el traslado hacia/desde la sala de
                            carga). 2 cambios por montacargas por día.
                        </p>
                        <p className="ml-4 text-neutral-700">
                            Horas de mano de obra anuales ={' '}
                            {(
                                (inputs.numberOfForklifts *
                                    inputs.shiftsPerDay *
                                    inputs.daysPerWeek *
                                    inputs.weeksPerYear *
                                    15) /
                                60
                            ).toLocaleString()}{' '}
                            horas
                        </p>
                        <p className="ml-4 text-neutral-700">
                            Costo oculto de mano de obra a 5 años ={' '}
                            {(
                                (inputs.numberOfForklifts *
                                    inputs.shiftsPerDay *
                                    inputs.daysPerWeek *
                                    inputs.weeksPerYear *
                                    15) /
                                60
                            ).toLocaleString()}{' '}
                            horas/año × {formatCurrency(inputs.laborCost)}/hora
                            × 5 años ={' '}
                            <strong>
                                {formatCurrency(results.leadAcidLaborCost)}
                            </strong>
                        </p>
                        <p className="text-neutral-700">
                            <strong>Litio:</strong> Sin cambio de baterías. El
                            operador conecta el montacargas durante la pausa
                            (carga de oportunidad).
                        </p>
                        <p className="ml-4 text-neutral-700">
                            Costo de mano de obra a 5 años ={' '}
                            <strong>
                                {formatCurrency(results.lithiumLaborCost)}
                            </strong>
                        </p>
                        <DifferenceDisplay
                            leadAcidCost={results.leadAcidLaborCost}
                            lithiumCost={results.lithiumLaborCost}
                            category="costos de mano de obra por cambios"
                        />
                    </div>
                </div>

                <div className="mb-8">
                    <h3 className="mb-4 text-xl font-semibold text-neutral-800">
                        Resumen de costos a 5 años para{' '}
                        {inputs.numberOfForklifts} montacargas: Litio vs.
                        Plomo-ácido
                    </h3>

                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-neutral-300">
                            <thead>
                                <tr className="bg-neutral-100">
                                    <th className="border border-neutral-300 px-4 py-2 text-left font-semibold">
                                        {texts.tco.tableHeaders.costCategory}
                                    </th>
                                    <th className="border border-neutral-300 px-4 py-2 text-right font-semibold">
                                        {texts.tco.tableHeaders.leadAcid}
                                    </th>
                                    <th className="border border-neutral-300 px-4 py-2 text-right font-semibold">
                                        {texts.tco.tableHeaders.lithium}
                                    </th>
                                    <th className="border border-neutral-300 px-4 py-2 text-right font-semibold">
                                        {texts.tco.tableHeaders.savings}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="border border-neutral-300 px-4 py-2 font-medium">
                                        {texts.tco.rowLabels.initialInvestment}
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
                                    <td
                                        className={
                                            'border border-neutral-300 px-4 py-2 text-right ' +
                                            (results.leadAcidInitialInvestment -
                                                results.lithiumInitialInvestment <
                                            0
                                                ? 'text-red-800'
                                                : 'text-green-600')
                                        }
                                    >
                                        {formatCurrency(
                                            results.leadAcidInitialInvestment -
                                                results.lithiumInitialInvestment
                                        )}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="border border-neutral-300 px-4 py-2 font-medium">
                                        {texts.tco.rowLabels.batteryReplacement}
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
                                        {texts.tco.rowLabels.energyCost}
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
                                        {texts.tco.rowLabels.maintenance}
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
                                        {texts.tco.rowLabels.labor}
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
                                        {texts.tco.rowLabels.total5YearCost}
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

                <RoiGraph
                    leadAcidCost={[
                        results.leadAcidInitialInvestment,
                        results.totalLeadAcidCost,
                    ]}
                    lithiumCost={[
                        results.lithiumInitialInvestment,
                        results.totalLithiumCost,
                    ]}
                    totalSavings={results.totalSavings}
                />

                <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-6">
                    <h3 className="mb-4 text-xl font-semibold text-green-800">
                        {texts.netSavings.title}
                    </h3>
                    <p className="mb-4 text-2xl font-bold text-green-600">
                        {formatCurrency(results.totalSavings)}{' '}
                        {texts.netSavings.forForklifts}{' '}
                        {inputs.numberOfForklifts} {texts.netSavings.forklifts}
                    </p>
                    <p className="text-green-700">
                        La inversión neta adicional es{' '}
                        {formatCurrency(
                            results.lithiumInitialInvestment -
                                results.leadAcidInitialInvestment
                        )}{' '}
                        y se recupera en aproximadamente un mes. Los ahorros
                        continuos son ganancia pura para invertir en otras áreas
                        de su negocio.
                    </p>
                </div>

                <div className="space-y-4">
                    <div className="rounded-lg border border-blue-200 bg-gray-50 p-4">
                        <h4 className="mb-2 font-semibold">
                            Eliminación del costo de la sala de carga
                        </h4>
                        <p className="text-sm">
                            Las baterías de plomo-ácido requieren una sala
                            dedicada porque la reacción química al cargar y
                            descargar libera hidrógeno por la electrólisis del
                            agua destilada. El electrolito de ácido sulfúrico
                            requiere un manejo cuidadoso por su naturaleza
                            corrosiva y tóxica. Las baterías de litio LFP no
                            requieren esta sala dedicada y puede recuperar ese
                            valioso espacio para almacenamiento o producción.
                            Esto podría significar miles de pies cuadrados
                            extra.
                        </p>
                    </div>

                    <div className="rounded-lg border border-purple-200 bg-gray-50 p-4">
                        <h4 className="mb-2 font-semibold">
                            Aumento de productividad
                        </h4>
                        <p className="text-sm">
                            Este es un costo de oportunidad oculto que a menudo
                            pasan por alto los planificadores. Con baterías de
                            plomo-ácido, un montacargas sale de servicio 15-20
                            minutos por turno para el cambio. Con litio, es una
                            conexión de 15 segundos. Esto significa más tiempo
                            activo y productividad. Ahorros potenciales de{' '}
                            {(
                                (inputs.numberOfForklifts *
                                    inputs.shiftsPerDay *
                                    inputs.daysPerWeek *
                                    inputs.weeksPerYear *
                                    15) /
                                60
                            ).toLocaleString()}{' '}
                            horas de tiempo de cambio ahorradas en 5 años ={' '}
                            {(
                                (inputs.numberOfForklifts *
                                    inputs.shiftsPerDay *
                                    inputs.daysPerWeek *
                                    inputs.weeksPerYear *
                                    15) /
                                60
                            ).toLocaleString()}{' '}
                            horas de operación de montacargas. ¿Cuál es el valor
                            de esa productividad extra para su negocio?
                        </p>
                    </div>

                    <div className="rounded-lg border border-orange-200 bg-gray-50 p-4">
                        <h4 className="mb-2 font-semibold">
                            Seguridad mejorada
                        </h4>
                        <p className="text-sm">
                            Menor riesgo de lesiones por cambio de baterías
                            pesadas, derrames de ácido y explosiones de
                            hidrógeno. Esto puede reducir las primas de seguro y
                            costosas demandas por accidentes.
                        </p>
                    </div>

                    <div className="rounded-lg border bg-gray-50 p-4">
                        <h4 className="mb-2 font-semibold text-teal-800">
                            Potencia consistente
                        </h4>
                        <p className="text-sm text-teal-700">
                            El litio entrega potencia total hasta casi vaciarse,
                            a diferencia del plomo-ácido que disminuye
                            gradualmente, provocando una operación más lenta al
                            final del turno.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}

interface DifferenceDisplayProps {
    leadAcidCost: number;
    lithiumCost: number;
    category: string;
    className?: string;
}

function DifferenceDisplay({
    leadAcidCost,
    lithiumCost,
    category,
    className = '',
}: DifferenceDisplayProps) {
    const difference = leadAcidCost - lithiumCost;
    const isPositive = difference > 0;
    const isNegative = difference < 0;
    const isZero = difference === 0;

    const getTextColor = () => {
        if (isNegative) return 'text-red-800';
        if (isPositive) return 'text-green-600';
        return 'text-neutral-600';
    };

    const getMessage = () => {
        if (isZero) {
            return texts.difference.zero(category);
        }

        if (isNegative) {
            return texts.difference.negative(
                Math.abs(difference).toLocaleString(),
                category
            );
        }

        return texts.difference.positive(difference.toLocaleString(), category);
    };

    return (
        <p className={`text-lg font-semibold ${getTextColor()} ${className}`}>
            {getMessage()}
        </p>
    );
}
