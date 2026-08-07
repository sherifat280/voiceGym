import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const axisProps = {
  tickLine: false,
  axisLine: false,
  tick: { fill: "var(--muted-foreground)", fontSize: 12 },
} as const;

const tooltipStyle = {
  borderRadius: 16,
  border: "1px solid var(--border)",
  background: "var(--popover)",
  color: "var(--popover-foreground)",
  fontSize: 13,
  boxShadow: "var(--shadow-soft)",
};

export function ConfidenceChart({
  data,
}: {
  data: { label: string; confidence: number }[];
}) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ left: -20, right: 8, top: 8 }}>
          <defs>
            <linearGradient id="confidenceFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.35} />
              <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="4 6" stroke="var(--border)" vertical={false} />
          <XAxis dataKey="label" {...axisProps} />
          <YAxis domain={[40, 100]} {...axisProps} />
          <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: "var(--border)" }} />
          <Area
            type="monotone"
            dataKey="confidence"
            stroke="var(--chart-1)"
            strokeWidth={3}
            fill="url(#confidenceFill)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function MinutesChart({ data }: { data: { label: string; minutes: number }[] }) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ left: -20, right: 8, top: 8 }}>
          <CartesianGrid strokeDasharray="4 6" stroke="var(--border)" vertical={false} />
          <XAxis dataKey="label" {...axisProps} />
          <YAxis {...axisProps} />
          <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "var(--secondary)" }} />
          <Bar dataKey="minutes" fill="var(--chart-2)" radius={[12, 12, 6, 6]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function MonthlyChart({
  data,
}: {
  data: { label: string; confidence: number; sessions: number }[];
}) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ left: -20, right: 8, top: 8 }}>
          <CartesianGrid strokeDasharray="4 6" stroke="var(--border)" vertical={false} />
          <XAxis dataKey="label" {...axisProps} />
          <YAxis {...axisProps} />
          <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: "var(--border)" }} />
          <Line type="monotone" dataKey="confidence" stroke="var(--chart-1)" strokeWidth={3} dot={false} />
          <Line type="monotone" dataKey="sessions" stroke="var(--chart-3)" strokeWidth={3} dot={false} />

        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
