import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
    title: 'Lead-Acid to Lithium (LFP) Battery Upgrade',
    description:
        'Upgrade from lead-acid to lithium (LFP) batteries: reduce TCO by half, eliminate maintenance costs, and achieve 100% fleet availability. Get your quote today.',
    openGraph: {
        title: 'Lead-Acid → Lithium (LFP) Upgrade',
        description:
            'Switch to Lithium (LFP) and reduce total cost of ownership by half while achieving 100% fleet availability.',
    },
};

type PageParams = {
    params: Promise<{ slug: string }>;
};

const content = {
    h1Title: 'Lead-Acid to Lithium (LFP) Battery Upgrade',
    subHeading:
        'Upgrade your forklift fleet and reduce total cost of ownership by half. Lithium LFP batteries deliver 100% fleet availability, eliminate maintenance costs, and provide 2-2.5x more recharge cycles than lead-acid batteries.',
};

export default async function LeadAcidToLithiumUpgradePage({
    params,
}: PageParams) {
    const { slug } = await params;
    if (!slug.includes('jetspower-batteries')) {
        return notFound?.() ?? null;
    }

    return (
        <main className="mx-auto w-full max-w-6xl px-4 py-10 md:py-14">
            <nav className="mb-6 text-sm text-neutral-600">
                <Link
                    href={`/manufacturers/${slug}`}
                    className="hover:underline"
                >
                    Back to Jetspower Batteries
                </Link>
            </nav>

            <section className="mb-12 rounded-lg border border-neutral-200 bg-white p-6 md:p-10">
                <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
                    {content.h1Title}
                </h1>
                <p className="mt-4 max-w-3xl text-neutral-700">
                    {content.subHeading}
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                    <a
                        href="#cta"
                        className="inline-flex items-center rounded-md bg-black px-5 py-3 text-white hover:opacity-90"
                    >
                        Get a Quote
                    </a>
                    <a
                        href="#benefits"
                        className="inline-flex items-center rounded-md border px-5 py-3 hover:bg-neutral-50"
                    >
                        See Benefits
                    </a>
                </div>
            </section>

            <section className="mb-12 rounded-lg border bg-neutral-50 p-6">
                <h2 className="mb-4 text-2xl font-semibold">
                    Lithium LFP Reduces Total Cost of Ownership (TCO) by Half
                </h2>
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="rounded-lg bg-white p-4">
                        <h3 className="mb-2 text-lg font-medium text-green-700">
                            Fleet Savings
                        </h3>
                        <p className="text-sm text-neutral-700">
                            For a fleet of 15 forklift trucks, total savings can
                            reach <strong>$215,000 over 4 years</strong>{' '}
                            compared to lead-acid batteries.
                        </p>
                    </div>
                    <div className="rounded-lg bg-white p-4">
                        <h3 className="mb-2 text-lg font-medium text-green-700">
                            Per Forklift Savings
                        </h3>
                        <p className="text-sm text-neutral-700">
                            <strong>$3,583 per forklift per year</strong> -
                            approximately 35% less cost than lead-acid
                            batteries.
                        </p>
                    </div>
                </div>
            </section>

            <section className="mb-12 rounded-lg border p-6">
                <h2 className="mb-4 text-xl font-semibold">
                    How to Calculate Your ROI and Cost Savings
                </h2>
                <p className="mb-6 text-sm text-neutral-700">
                    Use this 5-year cost analysis to understand your potential
                    savings. Based on a fleet of 10 medium-sized forklifts
                    operating 2 shifts per day.
                </p>

                <div className="mb-6 overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-neutral-50">
                                <th className="p-3 text-left font-medium">
                                    Cost Category
                                </th>
                                <th className="p-3 text-left font-medium">
                                    Lead-Acid (5 Years)
                                </th>
                                <th className="p-3 text-left font-medium">
                                    Lithium LFP (5 Years)
                                </th>
                                <th className="p-3 text-left font-medium text-green-700">
                                    Savings with Lithium
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b">
                                <td className="p-3 font-medium">
                                    Initial Investment
                                </td>
                                <td className="p-3">$80,000</td>
                                <td className="p-3">$75,000</td>
                                <td className="p-3 text-green-700">$5,000</td>
                            </tr>
                            <tr className="border-b">
                                <td className="p-3 font-medium">
                                    Battery Replacement
                                </td>
                                <td className="p-3">$40,000</td>
                                <td className="p-3">$0</td>
                                <td className="p-3 text-green-700">$40,000</td>
                            </tr>
                            <tr className="border-b">
                                <td className="p-3 font-medium">
                                    Energy Costs
                                </td>
                                <td className="p-3">$24,960</td>
                                <td className="p-3">$19,705</td>
                                <td className="p-3 text-green-700">$5,255</td>
                            </tr>
                            <tr className="border-b">
                                <td className="p-3 font-medium">
                                    Maintenance & Watering
                                </td>
                                <td className="p-3">$20,000</td>
                                <td className="p-3">$0</td>
                                <td className="p-3 text-green-700">$20,000</td>
                            </tr>
                            <tr className="border-b bg-green-50">
                                <td className="p-3 font-medium">
                                    Labour (Battery Swapping)
                                </td>
                                <td className="p-3">$162,500</td>
                                <td className="p-3">$0</td>
                                <td className="p-3 font-semibold text-green-700">
                                    $162,500
                                </td>
                            </tr>
                            <tr className="border-b bg-neutral-50">
                                <td className="p-3 font-semibold">
                                    Total 5-Year Cost
                                </td>
                                <td className="p-3 font-semibold">$327,460</td>
                                <td className="p-3 font-semibold">$94,705</td>
                                <td className="p-3 text-lg font-bold text-green-700">
                                    $232,755
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <div className="rounded-lg border p-4">
                        <h3 className="mb-3 text-lg font-medium text-green-700">
                            Key Assumptions
                        </h3>
                        <ul className="space-y-2 text-sm text-neutral-700">
                            <li>
                                • 10 forklifts, 2 shifts per day, 5 days/week
                            </li>
                            <li>
                                • Lead-acid: $4,000/battery, Lithium:
                                $7,500/battery
                            </li>
                            <li>• Electricity: $0.12/kWh</li>
                            <li>• Labour: $25/hour for battery swapping</li>
                            <li>• Lead-acid efficiency: 75%, Lithium: 95%</li>
                        </ul>
                    </div>
                    <div className="rounded-lg border p-4">
                        <h3 className="mb-3 text-lg font-medium text-green-700">
                            Hidden Costs Eliminated
                        </h3>
                        <ul className="space-y-2 text-sm text-neutral-700">
                            <li>
                                • No battery swapping labour (1,300 hours saved)
                            </li>
                            <li>
                                • No maintenance personnel or watering costs
                            </li>
                            <li>• No dedicated charging room required</li>
                            <li>• No hydrogen gas explosion risks</li>
                            <li>• Consistent power output throughout shift</li>
                        </ul>
                    </div>
                </div>

                <div className="mt-6 rounded-lg bg-green-50 p-4">
                    <h3 className="mb-2 text-lg font-medium text-green-800">
                        ROI Summary
                    </h3>
                    <p className="text-sm text-green-800">
                        <strong>Net additional investment: $5,000</strong> (paid
                        back in about 1 month). The ongoing savings of $232,755
                        over 5 years are pure profit that can be invested in
                        other areas of your business.
                    </p>
                </div>
            </section>

            <section id="benefits" className="mb-12 grid gap-6 md:grid-cols-3">
                {[
                    {
                        title: '100% Fleet Availability',
                        desc: 'Eliminate work interruptions with opportunity charging during 1-2 hour breaks. Keep working through 24-hour non-stop 2-3 shift schedules.',
                    },
                    {
                        title: 'No Maintenance Costs',
                        desc: 'Eliminate in-house or outsourced maintenance personnel. No watering, equalization, or specialized charging rooms required.',
                    },
                    {
                        title: '2-2.5x More Cycles',
                        desc: 'Over 3,000 cycles vs just 1,500 for lead-acid. No need to buy replacement batteries during normal service life.',
                    },
                    {
                        title: '15% Energy Savings',
                        desc: '95-99% efficiency vs 70-80% for lead-acid. For every $100 of electricity, save $20-30 that was wasted as heat.',
                    },
                    {
                        title: 'Instant Charging',
                        desc: 'No cooling period needed after charging. Go from charge to discharge and back instantly with no downtime.',
                    },
                    {
                        title: 'Safe Charging Anywhere',
                        desc: 'No hydrogen gas explosion risks. Charge anywhere without specialized ventilation requirements.',
                    },
                ].map(item => (
                    <div key={item.title} className="rounded-lg border p-5">
                        <h3 className="text-lg font-medium">{item.title}</h3>
                        <p className="mt-2 text-sm text-neutral-700">
                            {item.desc}
                        </p>
                    </div>
                ))}
            </section>

            <section className="mb-12 rounded-lg border p-6">
                <h2 className="text-xl font-semibold">
                    Active Battery Management System
                </h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b">
                                <th className="p-2 text-left font-medium">
                                    Solution
                                </th>
                                <th className="p-2 text-left font-medium">
                                    Function
                                </th>
                                <th className="p-2 text-left font-medium">
                                    Effect
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b">
                                <td className="p-2 font-medium">
                                    Battery Equalizer System
                                </td>
                                <td className="p-2">
                                    Actively transfer power between cells,
                                    equalizes voltage
                                </td>
                                <td className="p-2">
                                    Increases available capacity without
                                    increasing battery cost, reduces full charge
                                    time to 1.5 hours
                                </td>
                            </tr>
                            <tr className="border-b">
                                <td className="p-2 font-medium">
                                    Virtual Cell Effect
                                </td>
                                <td className="p-2">
                                    Supports weak or fully discharged cell using
                                    other cells
                                </td>
                                <td className="p-2">
                                    Assures battery function even if some cells
                                    have malfunctioned
                                </td>
                            </tr>
                            <tr className="border-b">
                                <td className="p-2 font-medium">
                                    Energy Saving Mode
                                </td>
                                <td className="p-2">
                                    Minimized power consumption during battery
                                    downtime
                                </td>
                                <td className="p-2">
                                    Self-discharge no more than 3% per month
                                    during storage
                                </td>
                            </tr>
                            <tr>
                                <td className="p-2 font-medium">
                                    Solid State Contractor
                                </td>
                                <td className="p-2">
                                    Disconnect current flow under maximum load
                                    up to 1 million times
                                </td>
                                <td className="p-2">
                                    Ability to use existing chargers, complete
                                    battery protection
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <p className="mt-4 text-sm text-neutral-700">
                    With Active Battery Equalizer system, cells are always
                    balanced, all battery capacity is available for charging,
                    and battery power is available for equipment operation.
                </p>
            </section>

            <section className="mb-12 grid items-start gap-8 md:grid-cols-2">
                <div className="rounded-lg border p-6">
                    <h2 className="text-xl font-semibold">
                        Recommended LFP Options
                    </h2>
                    <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-neutral-700">
                        <li>12V, 24V, and 48V packs with integrated BMS</li>
                        <li>
                            Drop-in replacements for Group 31 and standard rack
                            sizes
                        </li>
                        <li>
                            Parallel/series configurations for scalable capacity
                        </li>
                        <li>
                            Communication options: CAN/RS485/BT
                            (model-dependent)
                        </li>
                    </ul>
                </div>
                <div className="rounded-lg border p-6">
                    <h2 className="text-xl font-semibold">
                        Compatibility & Upgrade Checklist
                    </h2>
                    <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-neutral-700">
                        <li>
                            Verify charger profile supports LFP
                            (Bulk/Absorption/Float)
                        </li>
                        <li>
                            Confirm alternator protection or DC-DC charging for
                            vehicles
                        </li>
                        <li>
                            Check inverter/charger low-voltage cutoffs and
                            charge limits
                        </li>
                        <li>
                            Size cabling and fusing for higher charge/discharge
                            rates
                        </li>
                    </ul>
                </div>
            </section>

            <section className="mb-12 rounded-lg border p-6">
                <h2 className="text-xl font-semibold">Basic Specifications</h2>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <dl className="grid grid-cols-2 gap-2 text-sm">
                        <dt className="text-neutral-600">Chemistry</dt>
                        <dd className="text-neutral-900">LiFePO4 (LFP)</dd>
                        <dt className="text-neutral-600">Cycle Life</dt>
                        <dd className="text-neutral-900">
                            Over 3,000 cycles @ 80% DoD
                        </dd>
                        <dt className="text-neutral-600">Charge Rate</dt>
                        <dd className="text-neutral-900">
                            Up to 0.5–1C (model-dependent)
                        </dd>
                        <dt className="text-neutral-600">Operating Temp</dt>
                        <dd className="text-neutral-900">
                            -20°C to 60°C (with BMS limits)
                        </dd>
                        <dt className="text-neutral-600">Charging Time</dt>
                        <dd className="text-neutral-900">
                            1.5 hours with Active Battery Equalizer
                        </dd>
                        <dt className="text-neutral-600">Efficiency</dt>
                        <dd className="text-neutral-900">
                            95-99% vs 70-80% for lead-acid
                        </dd>
                    </dl>
                    <div className="text-sm text-neutral-700">
                        Specifications are representative and vary by
                        manufacturer and model. Final specs provided at quoting
                        stage based on your application and environment.
                    </div>
                </div>
            </section>

            <section className="mb-12 rounded-lg border p-6">
                <h2 className="text-xl font-semibold">
                    Frequently Asked Questions
                </h2>
                <div className="mt-4 space-y-4">
                    {[
                        {
                            q: 'How much can I save with lithium LFP batteries?',
                            a: 'Total cost of ownership can be reduced by half. For a fleet of 15 forklifts, savings can reach $215,000 over 4 years. Per forklift savings average $3,583 annually.',
                        },
                        {
                            q: 'Do I need a new charger?',
                            a: 'Chargers must support LFP voltage profiles. Many inverter/chargers can be configured; otherwise, we will recommend a compatible unit.',
                        },
                        {
                            q: 'How long will the batteries last?',
                            a: 'Expect over 3,000 cycles—2-2.5x more than lead-acid batteries. No need to buy replacement batteries during normal service life.',
                        },
                        {
                            q: 'Can I charge during short breaks?',
                            a: 'Yes! Lithium LFP batteries support opportunity charging during 1-2 hour breaks, enabling 100% fleet availability and 24-hour non-stop operations.',
                        },
                    ].map(f => (
                        <details key={f.q} className="rounded-md border p-4">
                            <summary className="cursor-pointer font-medium">
                                {f.q}
                            </summary>
                            <p className="mt-2 text-sm text-neutral-700">
                                {f.a}
                            </p>
                        </details>
                    ))}
                </div>
            </section>

            <section
                id="cta"
                className="mb-4 rounded-lg border bg-neutral-50 p-6"
            >
                <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <h2 className="text-xl font-semibold">
                            Get a tailored LFP upgrade quote
                        </h2>
                        <p className="mt-2 max-w-xl text-sm text-neutral-700">
                            Share your current system details and usage. We'll
                            calculate your potential savings, size the battery
                            bank, confirm charger compatibility, and propose the
                            best-fit lithium solution to reduce your TCO by
                            half.
                        </p>
                    </div>
                    <a
                        href={`/manufacturers/${slug}/chat-7171`}
                        className="inline-flex items-center rounded-md bg-black px-5 py-3 text-white hover:opacity-90"
                    >
                        Discuss Your Upgrade
                    </a>
                </div>
            </section>
        </main>
    );
}
