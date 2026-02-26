export interface ModelScores {
  xgboost: number;
  random_forest: number;
  sgd: number;
  naive_bayes: number;
}

export interface ScanInput {
  url?: string;
  text?: string;
}

export interface ScanResponse {
  scan_id: string;
  label: number;
  verdict: 'PHISHING' | 'LEGITIMATE';
  confidence: number;
  severity: 'HIGH' | 'MEDIUM' | 'LOW' | 'SAFE';
  data_type: 'URL' | 'TEXT' | 'BOTH';
  model_scores: ModelScores;
  timestamp: string;
  input: ScanInput;
}

export interface HistoryResponse {
  total: number;
  phishing: number;
  legitimate: number;
  scans: ScanResponse[];
}
