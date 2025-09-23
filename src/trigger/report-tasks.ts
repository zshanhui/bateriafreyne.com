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

export const createRoiChartTask = task({
    id: 'create-roi-chart',
    maxDuration: 30,
    run: async (payload: any, { ctx }) => {
        logger.info('Creating ROI chart...', { payload, ctx });

        // await wait.for({ seconds: 2 });

        const chart = commonRoiChartFunc({
            totalSavings: 12345678,
            yearData: [1000000, 2000000, 3000000, 4000000, 5000000],
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

function commonRoiChartFunc(payload: {
    totalSavings: number;
    yearData: number[];
    companyName?: string;
    chartType?: 'line' | 'bar';
}) {
    const chart = echarts.init(null, null, {
        ssr: true,
        renderer: 'svg',
        width: 800,
        height: 600,
    });

    const options: echarts.EChartsOption = {
        title: {
            text: `Battery replacement ROI analysis`,
            subtext: `Total Savings: $payload.totalSavings`,
            left: 'center',
        },
        tooltip: {
            trigger: 'axis',
            formatter: (params: any) =>
                `Year ${params[0].axisValue}<br>Savings: $${params[0].value.toLocaleString()}`,
        },
        xAxis: {
            type: 'category',
            data: ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'],
        },
        yAxis: {
            type: 'value',
            name: 'Savings ($)',
            axisLabel: { formatter: '${value}' },
        },
        series: [
            {
                name: 'Cumulative Savings',
                type: 'line',
                data: payload.yearData,
                smooth: true,
                lineStyle: { width: 3, color: '#2E8B57' },
                itemStyle: { color: '#2E8B57' },
            },
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
