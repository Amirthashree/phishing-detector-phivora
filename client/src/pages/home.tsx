import { useState } from "react";
import { Link as LinkIcon, FileText, Scan, AlertCircle } from "lucide-react";
import { useScan } from "@/hooks/use-phishing-api";
import { ScanResult } from "@/components/scan-result";
import { Layout } from "@/components/layout";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [url, setUrl] = useState("");
  const [text, setText] = useState("");
  const scanMutation = useScan();

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() && !text.trim()) return;
    scanMutation.mutate({ 
      url: url.trim() || undefined, 
      text: text.trim() || undefined 
    });
  };

  const isScanning = scanMutation.isPending;
  const isSubmitDisabled = (!url.trim() && !text.trim()) || isScanning;

  return (
    <Layout>
      <div className="space-y-12">
        {/* Header section */}
        <div className="text-center max-w-3xl mx-auto pt-8">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
            Advanced Threat <span className="text-primary text-glow">Detection</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Enter a suspicious URL or paste message contents. Our multi-model AI ensemble will analyze the payload for phishing signatures instantly.
          </p>
        </div>

        {/* Input Form */}
        <motion.div 
          className="glass-card rounded-3xl p-6 md:p-8 max-w-4xl mx-auto border-white/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <form onSubmit={handleScan} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* URL Input */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-semibold text-white/90">
                  <LinkIcon className="w-4 h-4 text-primary" />
                  Target URL
                </label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://suspicious-link.com"
                  className="w-full bg-background/50 border-2 border-white/5 focus:border-primary/50 rounded-xl py-3 px-4 text-white font-mono placeholder:text-white/20 transition-all focus:bg-primary/5 outline-none"
                  disabled={isScanning}
                />
              </div>

              {/* Text Input */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-semibold text-white/90">
                  <FileText className="w-4 h-4 text-primary" />
                  Email / SMS Content
                </label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Paste suspicious message text here..."
                  className="w-full bg-background/50 border-2 border-white/5 focus:border-primary/50 rounded-xl py-3 px-4 text-white placeholder:text-white/20 transition-all focus:bg-primary/5 outline-none resize-none h-[52px] md:h-[120px]"
                  disabled={isScanning}
                />
              </div>
            </div>

            {scanMutation.isError && (
              <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive flex items-center gap-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm">{scanMutation.error.message}</p>
              </div>
            )}

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitDisabled}
                className={`
                  relative overflow-hidden px-8 py-4 rounded-xl font-bold text-background text-lg flex items-center gap-3 transition-all duration-300
                  ${isSubmitDisabled ? 'bg-secondary text-white/30 cursor-not-allowed' : 'bg-primary hover:bg-[#00ffd4] shadow-[0_0_20px_rgba(0,229,176,0.3)] hover:shadow-[0_0_30px_rgba(0,229,176,0.5)] transform hover:-translate-y-1'}
                `}
              >
                {isScanning ? (
                  <>
                    <div className="w-5 h-5 border-2 border-background/20 border-t-background rounded-full animate-spin" />
                    ANALYZING PAYLOAD...
                  </>
                ) : (
                  <>
                    <Scan className="w-5 h-5" />
                    INITIATE SCAN
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>

        {/* Results Area */}
        <AnimatePresence mode="wait">
          {scanMutation.isSuccess && scanMutation.data && (
            <div className="max-w-4xl mx-auto pt-8">
              <ScanResult result={scanMutation.data} />
            </div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
}
