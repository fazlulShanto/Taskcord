import { Label, Pie, PieChart } from 'recharts';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@ui/chart';
import { FC } from 'react';

const chartData = [
  { taskLabel: 'todo', taskCount: 0, fill: 'var(--color-completed)' },
  { taskLabel: 'completed', taskCount: 0, fill: 'var(--color-todo)' },
  { taskLabel: 'progress', taskCount: 0, fill: 'var(--color-progress)' },
];

const chartConfig = {
  taskCount: {
    label: 'Task Count',
  },
  todo: {
    label: 'Todo',
    color: 'hsl(var(--chart-2))',
  },
  completed: {
    label: 'Completed',
    color: 'hsl(var(--chart-3))',
  },
  progress: {
    label: 'In Progress',
    color: 'hsl(var(--chart-4))',
  },
} satisfies ChartConfig;
type ChardDataKeys = keyof typeof chartConfig;
type TaskPieChartProps = {
  data: Record<Exclude<ChardDataKeys, 'taskCount'>, number>;
  total?: number;
};

export const TaskPieChart: FC<TaskPieChartProps> = ({ data = {}, total = 0 }) => {
  const finalChartData = Object.entries(data).map(([key, value]) => {
    return {
      ...chartData.find((item) => item.taskLabel === key),
      taskCount: value,
    };
  });

  const totalTask =
    total || Object.values(data as TaskPieChartProps['data']).reduce((acc, curr) => acc + curr, 0);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-xl">Task Completion overview</CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px] [&_.recharts-text]:fill-background"
        >
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={finalChartData}
              dataKey="taskCount"
              nameKey="taskLabel"
              innerRadius={60}
              outerRadius={90}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalTask}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Total Task
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
            <ChartLegend
              content={<ChartLegendContent nameKey="taskLabel" />}
              className="-translate-y-2 gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
