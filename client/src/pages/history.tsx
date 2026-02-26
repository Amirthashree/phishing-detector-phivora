import { useState } from "react";
import { Layout } from "@/components/layout";
import { useHistory } from "@/hooks/use-phishing-api";
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from "recharts";
import { 
  Activity, ShieldAlert, ShieldCheck, RefreshCw, 
  ChevronDown, ChevronUp, AlertCircle, Clock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { ScanResponse } from "@/types/api";

const COLORS = {
  phishing: "hsl(var(--destructive))",
  legitimate: "hsl(var(--primary))",
};

export default function History() {
  const { data, isLoading, isError, error, refetch, isRefetching } = useHistory(50);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        </div>
      </Layout>
    );
  }

  if (isError) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto mt-20 p-8 glass-card border-destructive/30 rounded-3xl text-center">
          <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Connection Failure</h2>
          <p className="text-muted-foreground mb-6">{error?.message || "Failed to load history data."}</p>
          <button 
            onClick={() => refetch()} 
            className="px-6 py-3 bg-secondary hover:bg-secondary/80 text-white rounded-xl transition-colors font-medium"
          >
            Retry Connection
          </button>
        </div>
      </Layout>
    );
  }

  const stats = data || { total: 0, phishing: 0, legitimate: 0, scans: [] };
  const pieData = [
    { name: "Phishing", value: stats.phishing, color: COLORS.phishing },
    { name: "Legitimate", value: stats.legitimate, color: COLORS.legitimate },
  ];

  return (
    <Layout>
      <div className="space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
              <Activity className="text-primary w-8 h-8" /> 
              System Intelligence
            </h1>
            <p className="text-muted-foreground mt-1">Real-time metrics and historical scan logs</p>
          </div>
          <button 
            onClick={() => refetch()}
            disabled={isRefetching}
            className="flex items-center gap-2 px-4 py-2 bg-secondary/50 hover:bg-secondary border border-white/5 rounded-lg text-sm font-medium text-white transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${isRefetching ? 'animate-spin' : ''}`} />
            Refresh Data
          </button>
        </div>

        {/* Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard title="Total Scans" value={stats.total} />
          <StatCard title="Phishing Detected" value={stats.phishing} color="text-destructive" icon={<ShieldAlert className="w-5 h-5 text-destructive/50" />} />
          <StatCard title="Legitimate Found" value={stats.legitimate} color="text-primary" icon={<ShieldCheck className="w-5 h-5 text-primary/50" />} />
          
          <div className="glass-card rounded-2xl p-6 border-white/5 flex items-center justify-center relative overflow-hidden h-32">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={45}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#161b22', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <span className="text-xs font-bold text-white/50">SPLIT</span>
            </div>
          </div>
        </div>

        {/* Scan History Table */}
        <div className="glass-card rounded-3xl border-white/5 overflow-hidden">
          <div className="p-6 border-b border-white/5">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-muted-foreground" />
              Recent Operations
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-secondary/30 text-muted-foreground text-sm uppercase tracking-wider">
                  <th className="p-4 font-semibold">Timestamp</th>
                  <th className="p-4 font-semibold">Input Target</th>
                  <th className="p-4 font-semibold">Type</th>
                  <th className="p-4 font-semibold">Verdict</th>
                  <th className="p-4 font-semibold text-right">Confidence</th>
                  <th className="p-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {stats.scans.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-muted-foreground">
                      No scan history available.
                    </td>
                  </tr>
                ) : (
                  stats.scans.map((scan) => <ExpandableRow key={scan.scan_id} scan={scan} />)
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </Layout>
  );
}

function StatCard({ title, value, color = "text-white", icon = null }: any) {
  return (
    <div className="glass-card rounded-2xl p-6 border-white/5 relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-50 group-hover:opacity-100 transition-opacity">
        {icon}
      </div>
      <p className="text-sm font-medium text-muted-foreground mb-2">{title}</p>
      <p className={`text-4xl font-black ${color} tracking-tight`}>{value}</p>
    </div>
  );
}

function ExpandableRow({ scan }: { scan: ScanResponse }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isPhishing = scan.verdict === "PHISHING";
  
  const formattedDate = new Date(scan.timestamp).toLocaleString(undefined, {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  const previewTarget = scan.input.url || scan.input.text?.substring(0, 40) + '...' || 'N/A';

  const modelData = [
    { name: "XGB", score: scan.model_scores.xgboost * 100 },
    { name: "RF", score: scan.model_scores.random_forest * 100 },
    { name: "SGD", score: scan.model_scores.sgd * 100 },
    { name: "NB", score: scan.model_scores.naive_bayes * 100 },
  ];

  return (
    <>
      <tr 
        onClick={() => setIsExpanded(!isExpanded)}
        className={`hover:bg-white/5 cursor-pointer transition-colors group ${isExpanded ? 'bg-white/5' : ''}`}
      >
        <td className="p-4 text-sm text-white/60 font-mono whitespace-nowrap">{formattedDate}</td>
        <td className="p-4 text-sm text-white font-mono truncate max-w-[200px] sm:max-w-[300px]">
          {previewTarget}
        </td>
        <td className="p-4">
          <span className="px-2 py-1 bg-secondary/50 rounded text-xs text-white/80 font-medium">
            {scan.data_type}
          </span>
        </td>
        <td className="p-4">
          <span className={`px-2 py-1 rounded text-xs font-bold ${isPhishing ? 'bg-destructive/20 text-destructive' : 'bg-primary/20 text-primary'}`}>
            {scan.verdict}
          </span>
        </td>
        <td className="p-4 text-right font-mono text-sm text-white/80">
          {(scan.confidence * 100).toFixed(1)}%
        </td>
        <td className="p-4 text-right">
          <button className="text-muted-foreground group-hover:text-white transition-colors">
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </td>
      </tr>
      
      <AnimatePresence>
        {isExpanded && (
          <tr className="bg-black/20">
            <td colSpan={6} className="p-0">
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-white/5">
                  <div>
                    <h4 className="text-xs font-bold text-muted-foreground uppercase mb-3 tracking-wider">Detection Matrix</h4>
                    <div className="h-32">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={modelData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} />
                          <YAxis hide />
                          <RechartsTooltip 
                            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                            contentStyle={{ backgroundColor: '#161b22', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '4px', padding: '4px 8px' }}
                            formatter={(value: number) => [`${value.toFixed(1)}%`, 'Score']}
                          />
                          <Bar dataKey="score" radius={[4, 4, 0, 0]} barSize={24}>
                            {modelData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={isPhishing ? "hsl(var(--destructive))" : "hsl(var(--primary))"} fillOpacity={0.6 + (entry.score/200)} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-xs font-bold text-muted-foreground uppercase mb-3 tracking-wider">Payload Details</h4>
                    <div className="bg-background/50 rounded-lg p-3 border border-white/5 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-xs text-white/50">Severity Rating:</span>
                        <span className="text-xs font-bold text-white">{scan.severity}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-white/50">Internal Scan ID:</span>
                        <span className="text-xs font-mono text-white/80">{scan.scan_id}</span>
                      </div>
                      {scan.input.url && (
                        <div className="mt-2 pt-2 border-t border-white/5">
                          <span className="text-xs text-white/50 block mb-1">Full URL:</span>
                          <span className="text-xs font-mono text-white/80 break-all">{scan.input.url}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </td>
          </tr>
        )}
      </AnimatePresence>
    </>
  );
}
