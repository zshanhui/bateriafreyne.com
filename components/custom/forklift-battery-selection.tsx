'use client';

import type { FormEvent, ReactNode } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';

type BrandOption = {
    id: string;
    label: string;
};

const brandOptions: BrandOption[] = [
    { id: 'toyota', label: 'Toyota' },
    { id: 'cat', label: 'CAT' },
    { id: 'linde', label: 'Linde' },
];

const modelOptions: Record<string, string[]> = {
    toyota: ['TOY-E200', 'TOY-E300', 'TOY-E400'],
    cat: ['CAT-E200', 'CAT-E300', 'CAT-E400'],
    linde: ['LINDE-E200', 'LINDE-E300', 'LINDE-E400'],
};

const batteryCapacitySizes = [
    '25.6V 150Ah',
    '25.6V 230Ah',
    '25.6V 550Ah',
    '51.2V 315Ah',
    '51.2V 440Ah',
    '51.2V 525Ah',
    '51.2V 660Ah',
    '83.2V 440Ah',
    '83.2V 735Ah',
    '83.2V 945Ah',
];

const batteryCapacityOptions: Record<string, string[]> = {
    'TOY-E200': [...batteryCapacitySizes],
    'TOY-E300': [...batteryCapacitySizes],
    'TOY-E400': [...batteryCapacitySizes],
    'CAT-E200': [...batteryCapacitySizes],
    'CAT-E300': [...batteryCapacitySizes],
    'CAT-E400': [...batteryCapacitySizes],
    'LINDE-E200': [...batteryCapacitySizes],
    'LINDE-E300': [...batteryCapacitySizes],
    'LINDE-E400': [...batteryCapacitySizes],
};

const customerFields = [
    {
        key: 'full_name',
        label: 'Full Name (required)',
        type: String,
        required: true,
    },
    {
        key: 'email',
        label: 'Business Email (required)',
        type: String,
        required: true,
    },
    {
        key: 'company_name',
        label: 'Business Name (optional)',
        type: String,
        required: false,
    },
    {
        key: 'phone_whatsapp_number',
        label: 'Phone / WhatsApp Number (recommended)',
        type: String,
        required: false,
    },
    {
        key: 'country_region',
        label: 'Country / Region (required)',
        type: String,
        required: true,
    },
    {
        key: 'city',
        label: 'City (required)',
        type: String,
        required: true,
    },
    {
        key: 'comments_requests',
        label: 'Additional Comments / Requests (optional)',
        type: String,
        required: false,
    },
];

type CustomerField = (typeof customerFields)[number];
type CustomerFieldKey = CustomerField['key'];
type CustomerDetails = Record<CustomerFieldKey, string>;

function createInitialCustomerDetails(): CustomerDetails {
    return customerFields.reduce<CustomerDetails>((accumulator, field) => {
        accumulator[field.key as CustomerFieldKey] = '';
        return accumulator;
    }, {} as CustomerDetails);
}

type StepConfig = {
    id: string;
    getTitle: () => string;
    isComplete: () => boolean;
    render: () => ReactNode;
    isVisible?: () => boolean;
};

export function ForkliftBatterySelection() {
    const [stepIndex, setStepIndex] = useState(0);
    const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
    const [selectedModel, setSelectedModel] = useState<string | null>(null);
    const [selectedBatteryCapacity, setSelectedBatteryCapacity] = useState<
        string | null
    >(null);
    const [forkliftCount, setForkliftCount] = useState<number | null>(null);
    const [dailyShifts, setDailyShifts] = useState<number | null>(null);
    const [usageEnvironment, setUsageEnvironment] = useState<
        'indoors' | 'outdoors' | null
    >(null);
    const [highHumidity, setHighHumidity] = useState<boolean | null>(null);
    const [customerDetails, setCustomerDetails] = useState<CustomerDetails>(
        () => createInitialCustomerDetails()
    );

    const requiredCustomerFieldKeys = useMemo<CustomerFieldKey[]>(() => {
        return customerFields
            .filter(field => field.required)
            .map(field => field.key as CustomerFieldKey);
    }, []);

    const areRequiredCustomerFieldsComplete = useMemo(() => {
        return requiredCustomerFieldKeys.every(key => {
            const value = customerDetails[key] ?? '';
            return value.trim().length > 0;
        });
    }, [customerDetails, requiredCustomerFieldKeys]);

    const selectedBrandLabel = useMemo(() => {
        if (!selectedBrand) {
            return null;
        }

        return (
            brandOptions.find(option => option.id === selectedBrand)?.label ??
            null
        );
    }, [selectedBrand]);

    const handleBrandChange = useCallback((brandId: string) => {
        setSelectedBrand(brandId);
        setSelectedModel(null);
        setSelectedBatteryCapacity(null);
        setForkliftCount(null);
        setDailyShifts(null);
        setUsageEnvironment(null);
        setHighHumidity(null);
    }, []);

    const handleModelChange = useCallback((modelId: string) => {
        setSelectedModel(modelId);
        setSelectedBatteryCapacity(null);
        setForkliftCount(null);
        setDailyShifts(null);
        setUsageEnvironment(null);
        setHighHumidity(null);
    }, []);

    const handleBatteryCapacityChange = useCallback((capacity: string) => {
        setSelectedBatteryCapacity(capacity);
        setForkliftCount(null);
        setDailyShifts(null);
        setUsageEnvironment(null);
        setHighHumidity(null);
    }, []);

    const handleEnvironmentChange = useCallback(
        (environment: 'indoors' | 'outdoors') => {
            setUsageEnvironment(environment);

            if (environment !== 'outdoors') {
                setHighHumidity(null);
            }
        },
        []
    );

    const handleHumidityChange = useCallback((isHighHumidity: boolean) => {
        setHighHumidity(isHighHumidity);
    }, []);

    const handleCustomerFieldChange = useCallback(
        (key: CustomerFieldKey, value: string) => {
            setCustomerDetails(previous => ({
                ...previous,
                [key]: value,
            }));
        },
        []
    );

    const submitQuoteRequestForm = useCallback(() => {
        const submissionPayload = {
            selections: {
                brand: selectedBrand,
                brandLabel: selectedBrandLabel,
                model: selectedModel,
                batteryCapacity: selectedBatteryCapacity,
                forkliftCount,
                dailyShifts,
                usageEnvironment,
                highHumidity,
            },
            customer: customerDetails,
        };

        console.log('Quote Request Submission', submissionPayload);
    }, [
        customerDetails,
        dailyShifts,
        forkliftCount,
        highHumidity,
        selectedBatteryCapacity,
        selectedBrand,
        selectedBrandLabel,
        selectedModel,
        usageEnvironment,
    ]);

    const steps = useMemo<StepConfig[]>(() => {
        return [
            {
                id: 'brand',
                getTitle: () => 'Select Forklift Brand',
                isComplete: () => selectedBrand !== null,
                render: () => (
                    <SelectionGrid
                        description="Choose the make of the forklift that currently operates in your fleet."
                        options={brandOptions.map(option => ({
                            key: option.id,
                            label: option.label,
                        }))}
                        selectedKey={selectedBrand}
                        onSelect={handleBrandChange}
                        emptyState="No brands available."
                    />
                ),
            },
            {
                id: 'model',
                getTitle: () =>
                    selectedBrandLabel
                        ? `Select ${selectedBrandLabel} Model`
                        : 'Select Forklift Model',
                isComplete: () => selectedModel !== null,
                isVisible: () => selectedBrand !== null,
                render: () => (
                    <SelectionGrid
                        description="Choose the specific forklift model to refine your battery selection."
                        options={(modelOptions[selectedBrand ?? ''] ?? []).map(
                            model => ({
                                key: model,
                                label: model,
                            })
                        )}
                        selectedKey={selectedModel}
                        onSelect={handleModelChange}
                        emptyState="Select a brand in the previous step to see the available models."
                    />
                ),
            },
            {
                id: 'battery',
                getTitle: () => 'Select Battery Capacity',
                isComplete: () => selectedBatteryCapacity !== null,
                isVisible: () => selectedModel !== null,
                render: () => (
                    <SelectionGrid
                        description="Choose the battery capacity that best matches your operational requirements."
                        options={(
                            batteryCapacityOptions[selectedModel ?? ''] ?? []
                        ).map(capacity => ({
                            key: capacity,
                            label: capacity,
                        }))}
                        selectedKey={selectedBatteryCapacity}
                        onSelect={handleBatteryCapacityChange}
                        emptyState="Select a model in the previous step to see the available battery capacities."
                    />
                ),
            },
            {
                id: 'quantity',
                getTitle: () => 'Forklift Quantity',
                isComplete: () => forkliftCount !== null,
                render: () => (
                    <NumericInputStep
                        label="How many forklifts do you need batteries for? (max 20)"
                        min={1}
                        max={20}
                        value={forkliftCount}
                        onChange={setForkliftCount}
                    />
                ),
            },
            {
                id: 'shifts',
                getTitle: () => 'Daily Shift Usage',
                isComplete: () => dailyShifts !== null,
                render: () => (
                    <NumericInputStep
                        label="How many shifts do you expect to use the forklift for each day?"
                        min={1}
                        max={3}
                        value={dailyShifts}
                        onChange={setDailyShifts}
                        placeholder="1-3"
                    />
                ),
            },
            {
                id: 'environment',
                getTitle: () => 'Operating Environment',
                isComplete: () => usageEnvironment !== null,
                render: () => (
                    <SelectionGrid
                        description="Will the forklift be mainly used outdoors or indoors?"
                        options={[
                            { key: 'indoors', label: 'indoors' },
                            { key: 'outdoors', label: 'outdoors' },
                        ]}
                        selectedKey={usageEnvironment}
                        onSelect={value =>
                            handleEnvironmentChange(
                                value as 'indoors' | 'outdoors'
                            )
                        }
                        emptyState="No environment options available."
                        columnsClass="sm:grid-cols-2"
                        formatLabel={label =>
                            label.charAt(0).toUpperCase() + label.slice(1)
                        }
                    />
                ),
            },
            {
                id: 'humidity',
                getTitle: () => 'Outdoor Humidity Conditions',
                isComplete: () => highHumidity !== null,
                isVisible: () => usageEnvironment === 'outdoors',
                render: () => (
                    <SelectionGrid
                        description="Is the outdoor environment high humidity?"
                        options={[
                            { key: 'true', label: 'Yes' },
                            { key: 'false', label: 'No' },
                        ]}
                        selectedKey={
                            highHumidity === null
                                ? null
                                : highHumidity
                                  ? 'true'
                                  : 'false'
                        }
                        onSelect={value =>
                            handleHumidityChange(value === 'true')
                        }
                        emptyState="No humidity options available."
                        columnsClass="sm:grid-cols-2"
                    />
                ),
            },
            {
                id: 'customer-details',
                getTitle: () => 'Provide Contact Details',
                isComplete: () => areRequiredCustomerFieldsComplete,
                render: () => (
                    <CustomerDetailsStep
                        fields={customerFields}
                        fieldValues={customerDetails}
                        onFieldChange={handleCustomerFieldChange}
                        onSubmit={submitQuoteRequestForm}
                        isSubmitDisabled={!areRequiredCustomerFieldsComplete}
                    />
                ),
            },
        ];
    }, [
        handleBrandChange,
        handleBatteryCapacityChange,
        handleEnvironmentChange,
        handleHumidityChange,
        handleModelChange,
        highHumidity,
        selectedBatteryCapacity,
        selectedBrand,
        selectedBrandLabel,
        selectedModel,
        usageEnvironment,
        forkliftCount,
        dailyShifts,
        areRequiredCustomerFieldsComplete,
        customerDetails,
        handleCustomerFieldChange,
        submitQuoteRequestForm,
    ]);

    const visibleSteps = useMemo(() => {
        return steps.filter(step => (step.isVisible ? step.isVisible() : true));
    }, [steps]);

    const totalSteps = visibleSteps.length;
    const currentStep = visibleSteps[stepIndex] ?? null;
    const stepTitle = currentStep?.getTitle() ?? '';

    const canGoPrev = stepIndex > 0;
    const canGoNext = stepIndex < totalSteps - 1;
    const isNextDisabled = !currentStep?.isComplete();

    useEffect(() => {
        if (stepIndex >= totalSteps) {
            setStepIndex(Math.max(0, totalSteps - 1));
        }
    }, [stepIndex, totalSteps]);

    const handlePrev = () => {
        if (!canGoPrev) {
            return;
        }

        setStepIndex(current => Math.max(0, current - 1));
    };

    const handleNext = () => {
        if (!canGoNext || isNextDisabled) {
            return;
        }

        setStepIndex(current => Math.min(totalSteps - 1, current + 1));
    };

    return (
        <section className="mx-4 my-8 flex h-full flex-col rounded-xl border border-slate-200 bg-white shadow-lg sm:mx-6 lg:mx-auto lg:my-10 lg:max-w-4xl">
            <header className="rounded-t-xl border-b border-slate-200 bg-slate-50 px-6 py-4">
                <h2 className="text-lg font-semibold text-slate-900">
                    {stepTitle}
                </h2>
            </header>

            <div className="flex-1 px-6 py-6">{currentStep?.render()}</div>

            <footer className="rounded-b-xl border-t border-slate-200 bg-slate-50 px-6 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        {canGoPrev && (
                            <button
                                type="button"
                                className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                                onClick={handlePrev}
                            >
                                Prev
                            </button>
                        )}
                    </div>
                    <div>
                        {canGoNext && (
                            <button
                                type="button"
                                className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
                                onClick={handleNext}
                                disabled={isNextDisabled}
                            >
                                Next
                            </button>
                        )}
                    </div>
                </div>
            </footer>
        </section>
    );
}

type SelectionGridOption = {
    key: string;
    label: string;
};

type SelectionGridProps = {
    description: string;
    options: SelectionGridOption[];
    selectedKey: string | null;
    onSelect: (key: string) => void;
    emptyState?: string;
    columnsClass?: string;
    formatLabel?: (label: string) => string;
};

function SelectionGrid({
    description,
    options,
    selectedKey,
    onSelect,
    emptyState = 'No options available.',
    columnsClass = 'sm:grid-cols-3',
    formatLabel,
}: SelectionGridProps) {
    if (options.length === 0) {
        return <EmptyState message={emptyState} />;
    }

    const columnClassName = `grid gap-4 ${columnsClass}`;

    return (
        <div className="space-y-4">
            <p className="text-sm text-slate-600">{description}</p>
            <div className={columnClassName}>
                {options.map(option => {
                    const isActive = selectedKey === option.key;
                    const displayLabel = formatLabel
                        ? formatLabel(option.label)
                        : option.label;

                    return (
                        <button
                            key={option.key}
                            type="button"
                            onClick={() => onSelect(option.key)}
                            className={`rounded-lg border px-4 py-3 text-sm font-medium transition ${
                                isActive
                                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                                    : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50'
                            }`}
                        >
                            {displayLabel}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

type EmptyStateProps = {
    message: string;
};

function EmptyState({ message }: EmptyStateProps) {
    return (
        <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white p-6 text-center">
            <p className="text-sm text-slate-500">{message}</p>
        </div>
    );
}

type NumericInputStepProps = {
    label: string;
    min: number;
    max: number;
    value: number | null;
    onChange: (value: number | null) => void;
    placeholder?: string;
};

function NumericInputStep({
    label,
    min,
    max,
    value,
    onChange,
    placeholder,
}: NumericInputStepProps) {
    const rangePlaceholder = placeholder ?? `${min}-${max}`;

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4">
                <p className="text-sm text-slate-600">{label}</p>
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                        onClick={() => {
                            const nextValue =
                                typeof value === 'number'
                                    ? Math.max(min, value - 1)
                                    : min;
                            onChange(nextValue);
                        }}
                        disabled={value !== null && value <= min}
                    >
                        -
                    </button>
                    <input
                        type="number"
                        min={min}
                        max={max}
                        value={value ?? ''}
                        onChange={event => {
                            const value = event.target.valueAsNumber;

                            if (Number.isNaN(value)) {
                                onChange(null);
                                return;
                            }

                            const clampedValue = Math.min(
                                max,
                                Math.max(min, value)
                            );
                            onChange(clampedValue);
                        }}
                        className="w-20 rounded-md border border-slate-300 px-3 py-2 text-center text-sm text-slate-700 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 focus:outline-none"
                        placeholder={rangePlaceholder}
                    />
                    <button
                        type="button"
                        className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                        onClick={() => {
                            const nextValue =
                                typeof value === 'number'
                                    ? Math.min(max, value + 1)
                                    : min;
                            onChange(nextValue);
                        }}
                        disabled={value !== null && value >= max}
                    >
                        +
                    </button>
                </div>
            </div>
        </div>
    );
}

type CustomerDetailsStepProps = {
    fields: CustomerField[];
    fieldValues: CustomerDetails;
    onFieldChange: (key: CustomerFieldKey, value: string) => void;
    onSubmit: () => void;
    isSubmitDisabled: boolean;
};

function CustomerDetailsStep({
    fields,
    fieldValues,
    onFieldChange,
    onSubmit,
    isSubmitDisabled,
}: CustomerDetailsStepProps) {
    const fieldRowGroups: CustomerFieldKey[][] = [
        ['full_name', 'company_name'],
        ['email', 'phone_whatsapp_number'],
        ['country_region', 'city'],
    ];
    const commentsKey: CustomerFieldKey = 'comments_requests';

    const renderTextInput = (key: CustomerFieldKey) => {
        const field = fields.find(option => option.key === key);

        if (!field) {
            return null;
        }

        return (
            <label key={field.key} className="flex flex-col gap-2">
                <span className="text-xs font-semibold tracking-[0.2em] text-slate-500 uppercase">
                    {field.label}
                </span>
                <input
                    type="text"
                    value={fieldValues[key] ?? ''}
                    required={field.required}
                    onChange={event => onFieldChange(key, event.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 shadow-sm transition focus:border-indigo-600 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:outline-none"
                />
            </label>
        );
    };

    const commentField = fields.find(option => option.key === commentsKey);

    return (
        <form
            className="space-y-6"
            onSubmit={(event: FormEvent<HTMLFormElement>) => {
                event.preventDefault();

                if (isSubmitDisabled) {
                    return;
                }

                onSubmit();
            }}
        >
            <p className="text-sm text-slate-600">
                Finalize your tailored quote by sharing the best way to reach
                you.
            </p>

            <div className="space-y-6">
                {fieldRowGroups.map((row, rowIndex) => {
                    const hasAnyField = row.some(key =>
                        fields.some(field => field.key === key)
                    );

                    if (!hasAnyField) {
                        return null;
                    }

                    return (
                        <div
                            key={rowIndex}
                            className="grid gap-6 md:grid-cols-2"
                        >
                            {row.map(key => renderTextInput(key))}
                        </div>
                    );
                })}
            </div>

            {commentField ? (
                <label className="flex flex-col gap-2">
                    <span className="text-xs font-semibold tracking-[0.2em] text-slate-500 uppercase">
                        {commentField.label}
                    </span>
                    <textarea
                        value={fieldValues[commentsKey] ?? ''}
                        onChange={event =>
                            onFieldChange(commentsKey, event.target.value)
                        }
                        rows={4}
                        className="w-full resize-none rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 shadow-sm transition focus:border-indigo-600 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:outline-none"
                    />
                </label>
            ) : null}

            <div className="flex justify-end">
                <button
                    type="submit"
                    className="inline-flex items-center justify-center rounded-md bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-slate-800 focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={isSubmitDisabled}
                >
                    Submit Quote Request
                </button>
            </div>
        </form>
    );
}
