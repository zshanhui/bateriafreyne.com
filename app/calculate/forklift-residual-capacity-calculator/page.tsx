'use client';

import { useState } from 'react';

type Inputs = {
    Q: number | '';
    C: number | '';
    X: number | '';
    S: number | '';
    M: number | '';
    HCG: number | '';
    ET: number | '';
    L: number | '';
};

const defaults: Inputs = {
    Q: 3000,
    C: 500,
    X: 523,
    S: 45,
    M: 1650,
    HCG: 368,
    ET: 211,
    L: 1000,
};

const texts = {
    title: 'Cálculo de capacidad residual',
    explanation: {
        en: {
            title: 'Understanding Forklift Residual Capacity: A Critical Safety and Efficiency Calculation',
            content: `Forklift residual capacity calculation is a fundamental engineering principle that determines the maximum safe load a forklift can carry when equipped with attachments. This calculation is crucial for workplace safety, operational efficiency, and compliance with industrial standards. When you add attachments like clamps, rotators, or side shifters to a forklift, the machine's load capacity decreases due to the additional weight and altered center of gravity. The residual capacity formula (Cn = (Q·(X+S+C) − M·(X+HCG)) ÷ (X+ET+L)) accounts for the forklift's rated capacity (Q), attachment weight (M), load center distances, and moment balance around the front axle. Understanding this calculation helps operators avoid dangerous overload situations, prevents equipment damage, and ensures optimal productivity while maintaining safety margins. This tool provides accurate calculations based on established engineering principles used in material handling operations worldwide.`,
        },
        es: {
            title: 'Comprensión de la Capacidad Residual del Montacargas: Un Cálculo Crítico de Seguridad y Eficiencia',
            content: `El cálculo de capacidad residual del montacargas es un principio fundamental de ingeniería que determina la carga máxima segura que puede transportar un montacargas cuando está equipado con accesorios. Este cálculo es crucial para la seguridad en el lugar de trabajo, la eficiencia operacional y el cumplimiento de estándares industriales. Cuando se agregan accesorios como pinzas, rotadores o desplazadores laterales a un montacargas, la capacidad de carga de la máquina disminuye debido al peso adicional y al centro de gravedad alterado. La fórmula de capacidad residual (Cn = (Q·(X+S+C) − M·(X+HCG)) ÷ (X+ET+L)) considera la capacidad nominal del montacargas (Q), el peso del accesorio (M), las distancias del centro de carga y el equilibrio de momentos alrededor del eje delantero. Comprender este cálculo ayuda a los operadores a evitar situaciones peligrosas de sobrecarga, previene daños al equipo y asegura una productividad óptima manteniendo márgenes de seguridad. Esta herramienta proporciona cálculos precisos basados en principios de ingeniería establecidos utilizados en operaciones de manejo de materiales en todo el mundo.`,
        },
    },
    labels: {
        Q: 'Capacidad de carga de la carretilla (Q)',
        X: 'Distancia horizontal desde el centro de la rueda delantera hasta la punta de la horquilla (X)',
        M: 'Peso del accesorio (M)',
        ET: 'Distancia horizontal desde el extremo delantero del bastidor de la horquilla hasta el extremo trasero de la carga (ET)',
        C: 'Centro de carga (C)',
        S: 'Espesor de la horquilla (S)',
        HCG: 'Distancia horizontal desde el extremo delantero del bastidor de la horquilla hasta el centro de gravedad del accesorio (HCG)',
        L: 'Distancia horizontal desde el extremo trasero de la carga hasta el centro de la carga (L)',
    },
    buttonCalculate: 'Calcular',
    calculating: 'Calculando...',
    results: {
        heading: 'Capacidad de carga combinada carretilla/accesorios (Cn)',
        formula:
            'Basado en el equilibrio de momentos: Cn = (Q·(X+S+C) − M·(X+HCG)) ÷ (X+ET+L)',
    },
};

export default function Page() {
    const [inputs, setInputs] = useState<Inputs>(defaults);
    const [result, setResult] = useState<number | null>(null);
    const [isCalculating, setIsCalculating] = useState(false);

    // Engineering assumption: Balance forward moments around the front axle.
    // Rated forward moment the truck can safely resist at standard spec:
    //   M_rated = Q * (X + S + C)
    // Effective available moment after fitting an attachment of mass M with CG at (X + HCG):
    //   M_available = M_rated - M * (X + HCG)
    // With the actual load, load center is at distance (X + ET + L) from the axle, so:
    //   Cn = M_available / (X + ET + L)
    // This yields the residual capacity Cn in kg.
    const computeResidual = async () => {
        setIsCalculating(true);

        // Simulate loading for 1 second
        await new Promise(resolve => setTimeout(resolve, 1000));

        const n = (v: number | '') =>
            typeof v === 'number' && Number.isFinite(v) ? v : 0;
        const { Q, C, X, S, M, HCG, ET, L } = inputs;

        const ratedMoment = n(Q) * (n(X) + n(S) + n(C));
        const attachmentMoment = n(M) * (n(X) + n(HCG));
        const availableMoment = ratedMoment - attachmentMoment;
        const distanceToLoadCenter = n(X) + n(ET) + n(L);
        if (distanceToLoadCenter <= 0) {
            setResult(0);
            setIsCalculating(false);
            return;
        }
        const Cn = availableMoment / distanceToLoadCenter;
        setResult(Math.max(0, Math.round(Cn)));
        setIsCalculating(false);
    };

    const set = (field: keyof Inputs) => (value: string) =>
        setInputs(prev => ({
            ...prev,
            [field]: value === '' ? '' : Number(value),
        }));

    const Input = ({
        label,
        field,
        unit,
    }: {
        label: string;
        field: keyof Inputs;
        unit: 'kg' | 'mm';
    }) => (
        <div className="mb-6">
            <div className="flex items-center justify-between gap-4">
                <label className="text-sm text-neutral-700">{label}</label>
                <div className="relative w-40">
                    <input
                        type="number"
                        className="w-full appearance-none rounded-md border border-neutral-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-teal-500 focus:outline-none"
                        defaultValue={inputs[field] as number | 1}
                        onBlur={e => set(field)(e.target.value)}
                    />
                    <span className="pointer-events-none absolute top-2 right-3 text-sm text-neutral-500">
                        {unit}
                    </span>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-neutral-50 px-4 py-8">
            <div className="mx-auto max-w-6xl">
                <h1 className="mb-10 text-center text-4xl font-semibold text-neutral-900">
                    {texts.title}
                </h1>

                {/* English Explanation */}
                <div className="mb-8 rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
                    <h2 className="mb-4 text-xl font-semibold text-neutral-800">
                        {texts.explanation.en.title}
                    </h2>
                    <p className="leading-relaxed text-neutral-700">
                        {texts.explanation.en.content}
                    </p>
                </div>

                {/* Spanish Explanation */}
                <div className="mb-8 rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
                    <h2 className="mb-4 text-xl font-semibold text-neutral-800">
                        {texts.explanation.es.title}
                    </h2>
                    <p className="leading-relaxed text-neutral-700">
                        {texts.explanation.es.content}
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
                    <div>
                        <Input label={texts.labels.Q} field="Q" unit="kg" />
                        <Input label={texts.labels.X} field="X" unit="mm" />
                        <Input label={texts.labels.M} field="M" unit="kg" />
                        <Input label={texts.labels.ET} field="ET" unit="mm" />
                    </div>
                    <div>
                        <Input label={texts.labels.C} field="C" unit="mm" />
                        <Input label={texts.labels.S} field="S" unit="mm" />
                        <Input label={texts.labels.HCG} field="HCG" unit="mm" />
                        <Input label={texts.labels.L} field="L" unit="mm" />
                    </div>
                </div>

                <div className="mt-10 grid grid-cols-1 items-center gap-6 rounded-xl bg-white p-6 shadow md:grid-cols-2">
                    <div className="order-1 md:order-none">
                        <button
                            className="rounded-full bg-teal-600 px-6 py-3 text-white shadow hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
                            onClick={computeResidual}
                            disabled={isCalculating}
                        >
                            {isCalculating ? (
                                <div className="flex items-center gap-2">
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                    <span>{texts.calculating}</span>
                                </div>
                            ) : (
                                texts.buttonCalculate
                            )}
                        </button>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-neutral-500">
                            {texts.results.heading}
                        </p>
                        <p className="text-3xl font-bold text-teal-700">
                            {result !== null
                                ? `${result.toLocaleString()} kg`
                                : '—'}
                        </p>
                        <p className="mt-2 text-xs text-neutral-500">
                            {texts.results.formula}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
