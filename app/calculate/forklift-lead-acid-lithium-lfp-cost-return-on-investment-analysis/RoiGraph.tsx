import { commonRoiChartFunc } from 'src/trigger/report-tasks';

function createGraphWrapper(
    leadAcidCost: number[],
    lithiumCost: number[],
    totalSavings: number
) {
    const chart = commonRoiChartFunc({
        totalSavings: totalSavings,
        lineOne: leadAcidCost,
        lineTwo: lithiumCost,
        companyName: 'Jetspower Batteries',
        chartType: 'line',
    });
    return chart;
}

function RoiGraph({
    leadAcidCost,
    lithiumCost,
    totalSavings,
}: {
    leadAcidCost: number[];
    lithiumCost: number[];
    totalSavings: number;
}) {
    const { svgString } = createGraphWrapper(
        leadAcidCost,
        lithiumCost,
        totalSavings
    );
    return (
        <div className="overflow-auto rounded-lg border border-gray-200 bg-white p-2">
            <div
                className="mx-auto max-w-full"
                aria-label="ROI Chart"
                dangerouslySetInnerHTML={{ __html: svgString }}
            />
        </div>
    );
}

export default RoiGraph;
