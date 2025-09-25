import { logger, task, wait } from '@trigger.dev/sdk/v3';
import * as echarts from 'echarts';

export const helloWorldTask = task({
    id: 'hello-world',
    // Set an optional maxDuration to prevent tasks from running indefinitely
    maxDuration: 30, // Stop executing after 300 secs (5 mins) of compute
    queue: {
        concurrencyLimit: 1,
    },
    run: async (payload: any, { ctx }) => {
        logger.log('Hello, world!', { payload, ctx });

        await wait.for({ seconds: 5 });

        return {
            message: 'Hello, Earth!',
            timestamp: new Date().toISOString(),
        };
    },
});

function getBreakEvenPoint(a1: number, a2: number, b1: number, b2: number) {
    const breakEvenPoint = {
        year: 0,
        cost: 0,
        months: 0,
    };

    const slope = (b2 - a2) / (b1 - a1);
    const intercept = a2 - slope * a1;
    const breakEvenYear = intercept / slope;
    const breakEvenCost = slope * breakEvenYear + intercept;
    const breakEvenMonths = breakEvenYear * 12;
    breakEvenPoint.year = breakEvenYear;
    breakEvenPoint.cost = breakEvenCost;
    breakEvenPoint.months = breakEvenMonths;
    return breakEvenPoint;
}

export const createRoiChartTask = task({
    id: 'create-roi-chart',
    maxDuration: 30,
    run: async (payload: any, { ctx }) => {
        logger.info('Creating ROI chart...', { payload, ctx });

        // await wait.for({ seconds: 2 });

        const chart = commonRoiChartFunc({
            totalSavings: 12345678,
            lineOne: [1000000, 2000000, 3000000, 4000000, 5000000],
            lineTwo: [2000000, 2500000, 3000000, 3500000, 4500000],
            companyName: 'Test Company',
            chartType: 'line',
        });

        logger.info('ROI chart created!');
        console.log(chart);

        return {
            message: 'ROI chart created!',
            chart,
            timestamp: new Date().toISOString(),
        };
    },
});

export function commonRoiChartFunc(payload: {
    totalSavings: number;
    lineOne: number[];
    lineTwo: number[];
    companyName?: string;
    chartType?: 'line' | 'bar';
}) {
    const chart = echarts.init(null, null, {
        ssr: true,
        renderer: 'svg',
        width: 1000,
        height: 600,
    });

    // Prepare series data against numeric year axis
    const leadY1 = payload.lineOne[0] || 0;
    const leadY5 = payload.lineOne[1] || 0;
    const lithiumY1 = payload.lineTwo[0] || 0;
    const lithiumY5 = payload.lineTwo[1] || 0;

    // Compute intersection (break-even) point between the two lines
    const slopeLead = (leadY5 - leadY1) / 4;
    const slopeLithium = (lithiumY5 - lithiumY1) / 4;
    const bLead = leadY1 - slopeLead * 1;
    const bLithium = lithiumY1 - slopeLithium * 1;

    let breakEvenSeries: echarts.SeriesOption[] = [];
    let savingsTriangleSeries: echarts.SeriesOption[] = [];
    const denom = slopeLead - slopeLithium;
    if (Math.abs(denom) > 1e-6) {
        const xIntersect = (bLithium - bLead) / denom;
        const yIntersect = slopeLead * xIntersect + bLead;
        if (Number.isFinite(xIntersect) && xIntersect >= 1 && xIntersect <= 5) {
            breakEvenSeries = [
                {
                    name: '',
                    type: 'scatter',
                    data: [[xIntersect, yIntersect]],
                    symbol: 'circle',
                    symbolSize: 2,
                    itemStyle: {
                        color: '#FF0000',
                        borderColor: '#FFFFFF',
                        borderWidth: 2,
                    },
                    label: {
                        show: true,
                        position: 'top',
                        offset: [0, -20],
                        formatter: `Break-Even\nYear ${xIntersect.toFixed(2)}\n$${yIntersect.toLocaleString()}`,
                        fontSize: 14,
                        color: '#16A34A',
                        fontWeight: 'bold',
                    },
                    tooltip: {
                        formatter: () => {
                            return `Break-Even Point<br>Year: ${xIntersect.toFixed(2)}<br>Cost: $${yIntersect.toLocaleString()}`;
                        },
                    },
                    z: 10,
                } as echarts.ScatterSeriesOption,
                {
                    name: '',
                    type: 'line',
                    data: [
                        [xIntersect, 0],
                        [xIntersect, yIntersect],
                    ],
                    symbol: 'none',
                    lineStyle: {
                        color: '#16A34A',
                        width: 2,
                        type: 'dashed',
                    },
                    emphasis: { disabled: true },
                    tooltip: { show: false },
                    z: 5,
                } as echarts.LineSeriesOption,
                {
                    name: '',
                    type: 'line',
                    data: [
                        [0, yIntersect],
                        [xIntersect, yIntersect],
                    ],
                    symbol: 'none',
                    lineStyle: {
                        color: '#16A34A',
                        width: 2,
                        type: 'dashed',
                    },
                    emphasis: { disabled: true },
                    tooltip: { show: false },
                    z: 5,
                } as echarts.LineSeriesOption,
            ];

            // Light-green shaded triangle showing savings area between break-even and year-5 points
            savingsTriangleSeries = [
                {
                    name: '',
                    type: 'custom',
                    coordinateSystem: 'cartesian2d',
                    renderItem: (params, api) => {
                        const p0 = api.coord([api.value(0), api.value(1)]);
                        const p1 = api.coord([api.value(2), api.value(3)]);
                        const p2 = api.coord([api.value(4), api.value(5)]);
                        return {
                            type: 'polygon',
                            shape: {
                                points: [p0, p1, p2],
                            },
                            style: api.style({
                                fill: 'rgba(34,197,94,0.15)', // tailwind emerald-500 @ 15%
                                stroke: '#16A34A',
                                lineWidth: 1,
                            }),
                        } as any;
                    },
                    data: [[xIntersect, yIntersect, 5, leadY5, 5, lithiumY5]],
                    silent: true,
                    tooltip: { show: false },
                    z: 1,
                } as echarts.CustomSeriesOption,
            ];
        }
    }

    const tooltip: echarts.TooltipComponentOption = {
        trigger: 'axis',
        formatter: (params: any) => {
            const arr = Array.isArray(params) ? params : [params];
            if (arr.length === 0) return '';
            const header = `Year ${arr[0].axisValue}`;
            const lines = arr
                .map((p: any) => {
                    const v = Array.isArray(p.value) ? p.value[1] : p.value;
                    return `${p.marker} ${p.seriesName}: $${Number(v).toLocaleString()}`;
                })
                .join('<br>');
            return `${header}<br>${lines}`;
        },
    };

    const options: echarts.EChartsOption = {
        title: {
            text: `Battery replacement ROI analysis`,
            subtext: `Total Savings: $${payload.totalSavings.toLocaleString()}`,
            left: 'center',
        },
        legend: {
            right: 32,
        },
        tooltip,
        xAxis: {
            type: 'value',
            name: 'Year',
            axisLabel: { formatter: 'Year {value}' },
            min: 0,
            max: 6,
            interval: 1,
        },
        yAxis: {
            type: 'value',
            name: 'Savings ($)',
            axisLabel: { formatter: '${value}' },
        },
        series: [
            ...savingsTriangleSeries,
            {
                name: 'Lead-Acid',
                type: 'line',
                data: [
                    [1, leadY1],
                    [2, leadY1 + (leadY5 - leadY1) * 0.25],
                    [3, leadY1 + (leadY5 - leadY1) * 0.5],
                    [4, leadY1 + (leadY5 - leadY1) * 0.75],
                    [5, leadY5],
                ],
                smooth: true,
                lineStyle: { width: 3, color: '#2E8B57' },
                itemStyle: { color: '#2E8B57' },
            } as echarts.LineSeriesOption,
            {
                name: 'Lithium',
                type: 'line',
                data: [
                    [1, lithiumY1],
                    [2, lithiumY1 + (lithiumY5 - lithiumY1) * 0.25],
                    [3, lithiumY1 + (lithiumY5 - lithiumY1) * 0.5],
                    [4, lithiumY1 + (lithiumY5 - lithiumY1) * 0.75],
                    [5, lithiumY5],
                ],
                smooth: true,
                lineStyle: { width: 3, color: '#1E90FF' },
                itemStyle: { color: '#1E90FF' },
            } as echarts.LineSeriesOption,
            // Dotted connector at Year 5 between the two lines, with label
            {
                name: 'Year 5 Savings',
                type: 'line',
                data: (() => {
                    const yLow = Math.min(leadY5, lithiumY5);
                    const yHigh = Math.max(leadY5, lithiumY5);
                    return [
                        [5, yLow],
                        [5, yHigh],
                    ];
                })(),
                symbol: 'none',
                lineStyle: {
                    color: '#6B7280',
                    width: 2,
                    type: 'dashed',
                },
                emphasis: { disabled: true },
                tooltip: {
                    formatter: () => {
                        const savings = Math.abs(leadY5 - lithiumY5);
                        return `Savings at Year 5: $${savings.toLocaleString()}`;
                    },
                },
                z: 6,
            } as echarts.LineSeriesOption,
            {
                name: '',
                type: 'scatter',
                data: (() => {
                    const yLow = Math.min(leadY5, lithiumY5);
                    const yHigh = Math.max(leadY5, lithiumY5);
                    const mid = (yLow + yHigh) / 2;
                    return [[5, mid]];
                })(),
                symbol: 'circle',
                symbolSize: 1,
                itemStyle: { color: 'transparent' },
                label: {
                    show: true,
                    position: 'right',
                    offset: [8, 0],
                    formatter: `Savings from Lithium batteries\n$${Math.max(0, leadY5 - lithiumY5).toLocaleString()}`,
                    color: '#374151',
                    fontSize: 15,
                    backgroundColor: 'rgba(255,255,255,0.8)',
                    padding: [4, 6],
                    borderRadius: 4,
                },
                tooltip: { show: false },
                z: 7,
                // Hide from legend
                legendHoverLink: false,
                showInLegend: false,
            } as echarts.ScatterSeriesOption,
            ...breakEvenSeries,
        ],
    };

    chart.setOption(options);

    const svgString = chart.renderToSVGString();
    const pngDataUrl = chart.getDataURL({});

    chart.dispose();
    return {
        success: true,
        svgString,
        pngDataUrl,
    };
}

export const puppeteerTask = task({
    id: 'puppeteer-task',
    maxDuration: 30,
    run: async (payload: any, { ctx }) => {
        logger.info('Puppeteer task started...', { payload, ctx });

        await wait.for({ seconds: 2 });

        return {
            message: 'Puppeteer task completed!',
            timestamp: new Date().toISOString(),
        };
    },
});
