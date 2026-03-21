// Demo user credentials
const DEMO_USER = {
  email: "admin@bank.com",
  password: "bank1234",
  name: "Alex Morgan",
};

const KNOWN_DEVICE_ID = "DEVICE-XK7-2024";

export interface TraderData {
  name: string;
  verified: boolean;
  pan?: string;
  aadhaar?: string;
  bankAccount?: string;
  ifsc?: string;
}

// Trader database
const DEFAULT_TRADERS: Record<string, TraderData> = {
  T1: { name: "Global Payments Corp", verified: true, pan: "ABCDE1234F", aadhaar: "123456789012", bankAccount: "1234567890", ifsc: "SBIN0001234" },
  T2: { name: "QuickCash Ltd", verified: false },
  T3: { name: "SecureTrade Inc", verified: true, pan: "XYZAB5678C", aadhaar: "987654321098", bankAccount: "0987654321", ifsc: "HDFC0005678" },
  T4: { name: "OffshoreX Partners", verified: false },
  T5: { name: "National Bank Services", verified: true, pan: "MNOPQ9012D", aadhaar: "456789012345", bankAccount: "5678901234", ifsc: "ICIC0009012" },
};

function loadTraders(): Record<string, TraderData> {
  const stored = localStorage.getItem("traders_db");
  if (stored) return JSON.parse(stored);
  return { ...DEFAULT_TRADERS };
}

function saveTraders(traders: Record<string, TraderData>) {
  localStorage.setItem("traders_db", JSON.stringify(traders));
}

export function getTraders(): Record<string, TraderData> {
  return loadTraders();
}

// PAN: 5 letters, 4 digits, 1 letter
function isValidPAN(pan: string): boolean {
  return /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(pan.toUpperCase());
}

// Aadhaar: 12 digits
function isValidAadhaar(aadhaar: string): boolean {
  return /^\d{12}$/.test(aadhaar);
}

// Bank account: 9-18 digits
function isValidBankAccount(acc: string): boolean {
  return /^\d{9,18}$/.test(acc);
}

// IFSC: 4 letters, 0, 6 alphanumeric
function isValidIFSC(ifsc: string): boolean {
  return /^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc.toUpperCase());
}

export interface RegisterTraderResult {
  success: boolean;
  message: string;
  traderId?: string;
  errors?: string[];
}

export function registerTrader(
  name: string,
  pan: string,
  aadhaar: string,
  bankAccount: string,
  ifsc: string
): RegisterTraderResult {
  const errors: string[] = [];

  if (!name.trim()) errors.push("Trader name is required");
  if (!isValidPAN(pan)) errors.push("Invalid PAN format (e.g. ABCDE1234F)");
  if (!isValidAadhaar(aadhaar)) errors.push("Invalid Aadhaar (must be 12 digits)");
  if (!isValidBankAccount(bankAccount)) errors.push("Invalid bank account (9-18 digits)");
  if (!isValidIFSC(ifsc)) errors.push("Invalid IFSC code (e.g. SBIN0001234)");

  if (errors.length > 0) {
    return { success: false, message: "Validation failed. Trader is NOT verified.", errors };
  }

  const traders = loadTraders();
  const nextId = `T${Object.keys(traders).length + 1}`;

  traders[nextId] = {
    name: name.trim(),
    verified: true,
    pan: pan.toUpperCase(),
    aadhaar,
    bankAccount,
    ifsc: ifsc.toUpperCase(),
  };

  saveTraders(traders);

  return {
    success: true,
    message: `✅ Trader "${name}" registered & verified as ${nextId}`,
    traderId: nextId,
  };
}

export type RiskLevel = "low" | "medium" | "high";

export interface RiskResult {
  level: RiskLevel;
  score: number;
  factors: string[];
}

export function initDemoUser() {
  if (!localStorage.getItem("demo_user")) {
    localStorage.setItem("demo_user", JSON.stringify(DEMO_USER));
  }
  if (!localStorage.getItem("device_id")) {
    localStorage.setItem("device_id", KNOWN_DEVICE_ID);
  }
}

export function login(email: string, password: string, deviceId: string): { success: boolean; message: string } {
  const stored = JSON.parse(localStorage.getItem("demo_user") || "{}");

  if (email !== stored.email || password !== stored.password) {
    return { success: false, message: "Invalid email or password." };
  }

  const knownDevice = localStorage.getItem("device_id");
  if (deviceId !== knownDevice) {
    return { success: false, message: "⚠ Unrecognized device detected! Login blocked for security." };
  }

  localStorage.setItem("logged_in", "true");
  return { success: true, message: `Welcome back, ${stored.name}!` };
}

export function logout() {
  localStorage.removeItem("logged_in");
}

export function isLoggedIn(): boolean {
  return localStorage.getItem("logged_in") === "true";
}

export function checkTrader(traderId: string): { found: boolean; verified: boolean; name: string } {
  const id = traderId.toUpperCase();
  const trader = TRADERS[id];
  if (!trader) return { found: false, verified: false, name: "" };
  return { found: true, verified: trader.verified, name: trader.name };
}

export function calculateRisk(amount: number, traderId: string): RiskResult {
  let score = 0;
  const factors: string[] = [];

  const trader = checkTrader(traderId);

  if (!trader.found) {
    score += 40;
    factors.push("Unknown trader ID");
  } else if (!trader.verified) {
    score += 35;
    factors.push("Unverified trader");
  }

  if (amount > 10000) {
    score += 30;
    factors.push("Very high transaction amount (>$10,000)");
  } else if (amount > 5000) {
    score += 20;
    factors.push("High transaction amount (>$5,000)");
  } else if (amount > 2000) {
    score += 10;
    factors.push("Moderate transaction amount (>$2,000)");
  }

  if (amount > 5000 && !trader.verified) {
    score += 15;
    factors.push("High amount to unverified trader");
  }

  const level: RiskLevel = score >= 50 ? "high" : score >= 25 ? "medium" : "low";
  return { level, score: Math.min(score, 100), factors };
}

export function sendMoney(amount: number, traderId: string): { success: boolean; message: string; risk: RiskResult } {
  const risk = calculateRisk(amount, traderId);

  if (risk.level === "high") {
    return { success: false, message: "🚫 Transaction BLOCKED — Risk level too high.", risk };
  }

  if (risk.level === "medium") {
    return { success: true, message: "⚠ Transaction processed with WARNING. Manual review recommended.", risk };
  }

  return { success: true, message: "✅ Transaction processed successfully.", risk };
}
