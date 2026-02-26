import { motion } from "framer-motion";
import { AlertTriangle, ShieldCheck, Activity, Link as LinkIcon, MessageSquare } from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell
} from "recharts";
import type { ScanResponse } from "@/types/api";

export function ScanResult({ result }: { result: ScanResponse }) {
  const isPhishing = result.verdict === "PHISHING";
  
  // Format data for chart
  const modelData = [
    { name: "XGBoost", score: result.model_scores.xgboost * 100 },
    { name: "Random Forest", score: result.model_scores.random_forest * 100 },
    { name: "SGD", score: result.model_scores.sgd * 100 },
    { name: "Naive Bayes", score: result.model_scores.naive_bayes * 100 },
  ];

  const themeColor = isPhishing ? "hsl(var(--destructive))" : "hsl(var(--primary))";
  const bgSoft = isPhishing ? "bg-destructive/10" : "bg-primary/10";
  const borderSoft = isPhishing ? "border-destructive/20" : "border-primary/20";
  
  const getSeverityBadge = () => {
    switch (result.severity) {
      case "HIGH": return "bg-red-500/20 text-red-500 border-red-500/30";
      case "MEDIUM": return "bg-orange-500/20 text-orange-500 border-orange-500/30";
      case "LOW": return "bg-yellow-500/20 text-yellow-500 border-yellow-500/30";
      case "SAFE": return "bg-green-500/20 text-green-500 border-green-500/30";
      default: return "bg-gray-500/20 text-gray-500 border-gray-500/30";
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass-card rounded-2xl overflow-hidden ${isPhishing ? 'neon-glow-danger border-destructive/30' : 'neon-glow border-primary/30'}`}
    >
      {/* Header Banner */}
      <div className={`${bgSoft} border-b ${borderSoft} p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4`}>
        <div className="flex items-center gap-4">
          <div className={`p-4 rounded-xl ${isPhishing ? 'bg-destructive/20 text-destructive' : 'bg-primary/20 text-primary'}`}>
            {isPhishing ? <AlertTriangle className="w-8 h-8" /> : <ShieldCheck className="w-8 h-8" />}
          </div>
          <div>
            <h2 className={`text-4xl font-black ${isPhishing ? 'text-glow-danger text-destructive' : 'text-glow text-primary'} uppercase tracking-wider`}>
              {result.verdict}
            </h2>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-muted-foreground font-mono text-sm">ID: {result.scan_id.substring(0, 8)}...</span>
              <span className={`px-2 py-0.5 rounded text-xs font-bold border ${getSeverityBadge()}`}>
                {result.severity} RISK
              </span>
            </div>
          </div>
        </div>

        <div className="w-full md:w-48 text-right">
          <div className="flex justify-between items-end mb-2">
            <span className="text-sm text-white/60 font-medium">Confidence</span>
            <span className="text-xl font-bold text-white font-mono">{(result.confidence * 100).toFixed(1)}%</span>
          </div>
          <div className="h-2.5 bg-background rounded-full overflow-hidden border border-white/5">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${result.confidence * 100}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={`h-full ${isPhishing ? 'bg-destructive' : 'bg-primary'}`}
            />
          </div>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Input Details */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Analyzed Payload
            </h3>
            
            <div className="space-y-4">
              {result.input.url && (
                <div className="bg-background/50 rounded-xl p-4 border border-white/5">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <LinkIcon className="w-4 h-4" /> URL Target
                  </div>
                  <p className="text-white font-mono text-sm break-all">{result.input.url}</p>
                </div>
              )}
              
              {result.input.text && (
                <div className="bg-background/50 rounded-xl p-4 border border-white/5">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <MessageSquare className="w-4 h-4" /> Text Content
                  </div>
                  <p className="text-white/80 text-sm whitespace-pre-wrap">{result.input.text}</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-secondary/30 rounded-xl p-4 border border-white/5 inline-block">
            <span className="text-sm text-muted-foreground">Detected Type: </span>
            <span className="text-white font-bold ml-2">{result.data_type}</span>
          </div>
        </div>

        {/* Model Scores Chart */}
        <div>
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-primary" />
            Detection Matrix
          </h3>
          <div className="h-[250px] bg-background/30 rounded-xl p-4 border border-white/5">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={modelData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: '#161b22', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                  formatter={(value: number) => [`${value.toFixed(1)}%`, 'Score']}
                />
                <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={20}>
                  {modelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={themeColor} fillOpacity={0.8 + (entry.score/500)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
