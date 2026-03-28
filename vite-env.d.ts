/// <reference types="vite/client" />

interface Window {
  JSZip?: any;
  jspdf?: {
    jsPDF: any;
  };
  html2canvas?: any;
}

interface ImportMetaEnv {
  readonly VITE_GEMINI_API_KEY: string;
}