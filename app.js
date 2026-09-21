/**
 * RESQ LINK — Emergency Response System
 * Long-range radio alert dashboard with agency notification and live tracking.
 */

const STAGES = ["DISPATCHED", "EN ROUTE", "ON SCENE", "RESOLVED"];
const CONTROL_RADIUS_M = 15000; // 15 km response coverage range

const AUTHORITIES = [
  { key: "police", code: "PD", cls: "ag-pd", labelKey: "authPolice" },
  { key: "ambulance", code: "EMS", cls: "ag-ems", labelKey: "authAmbulance" },
  { key: "fire", code: "FIRE", cls: "ag-fire", labelKey: "authFire" },
  { key: "rescue", code: "SAR", cls: "ag-sar", labelKey: "authRescue" },
  { key: "flood", code: "FLOOD", cls: "ag-flood", labelKey: "authFlood" }
];

// ---- Translation dictionary (English / Hindi) ----
const translations = {
  en: {
    brandTagline: "Emergency Response System",
    navOverview: "Overview", navAlerts: "Alerts", navDevices: "Devices",
    navBroadcast: "Send Message", navHistory: "Activity Log", navAbout: "How It Works",
    receiverOffline: "Receiver Offline", receiverConnected: "Receiver Connected",
    connectReceiver: "Connect Receiver", disconnectReceiver: "Disconnect Receiver",
    connectHint: "WEB SERIAL · 115200 BAUD",
    topbarSubtitle: "Live alerts and quick response coordination for your area.",
    demoBtn: "Run demo", demoSm: "Demo", clearDataBtn: "Clear data",
    radioStandby: "Radio standby", radioLive: "Receiver connected",
    titleOverview: "Overview", titleAlerts: "All Alerts", titleDevices: "Devices",
    titleBroadcast: "Send Message", titleHistory: "Activity Log", titleAbout: "How It Works",
    statActiveLabel: "Active Alerts", statActiveSub: "Not yet closed",
    statDevicesLabel: "Registered Devices", statDevicesSub: "Field units on record",
    statTodayLabel: "Alerts Today", statTodaySub: "Past 24 hours",
    statSignalLabel: "Last Signal", statSignalSub: "Most recent update",
    mapTitle: "Live Map", liveTag: "Live", centerBtn: "Center map",
    legendTitle: "Response Center", legendRange: "15 km coverage range",
    alertsCardTitle: "Alerts", activeSuffix: " active",
    alertsPageTitle: "All Alerts", alertsPageDesc: "See every alert, its status and where it is coming from.",
    clearAlertsBtn: "Clear alerts",
    devicesPageTitle: "Devices", devicesPageDesc: "Add and manage the field devices sending you alerts.",
    addDeviceBtn: "Add device",
    broadcastTitle: "Send Message", broadcastDesc: "Send a message to every connected field device.",
    qStandby: "Standby", qEnRoute: "Team is on the way", qHighGround: "Move to high ground", qAllClear: "All clear",
    broadcastPlaceholder: "Type your message here (max 160 characters)",
    sendBroadcastBtn: "Send to all devices",
    sirenTitle: "Emergency Siren Alert", sirenDesc: "Turns on a loud alarm sound on every connected device.",
    sirenOnBtn: "Turn on siren", sirenOffBtn: "Turn off siren",
    testTitle: "Test Connection", testDesc: "Check whether devices can receive your messages.", testBtn: "Send test message",
    historyTitle: "Activity Log", historyDesc: "A record of past alerts, messages and status changes.",
    clearLogBtn: "Clear log",
    emptyClearTitle: "All clear", emptyClearDesc: "No active alerts right now.",
    emptyNoAlertsTitle: "No alerts yet", emptyNoAlertsDesc: "Run the demo above to see how alerts appear.",
    emptyNoDevicesTitle: "No devices yet", emptyNoDevicesDesc: "Use \"Add device\" above or run the demo.",
    emptyNoHistoryTitle: "Log is empty", emptyNoHistoryDesc: "No activity recorded yet.",
    emptyNoTimeline: "No activity logged yet for this device.",
    btnDetails: "Details", btnLocate: "Locate", noGpsFix: "No GPS fix", pingsSuffix: " signals",
    drawerStatusLabel: "Status", drawerLiveLocation: "Live Location", drawerInfoLabel: "Details",
    drawerDeviceInfoLabel: "Device Info", drawerAssignedLabel: "Assigned To", drawerActionsLabel: "Actions",
    drawerSendLabel: "Send Alert To", drawerTimelineLabel: "Timeline",
    teleDistance: "Distance", teleEta: "Time to reach", teleSignal: "Signal", teleBattery: "Battery",
    teleReported: "Reported at", telePings: "Signals received",
    teleDeviceId: "Device ID", teleLocationName: "Location name", teleGps: "GPS coordinates",
    btnDirections: "Get directions", btnEnRoute: "On the way", btnOnScene: "Reached", btnMarkClosed: "Mark as closed",
    btnClosed: "Closed",
    authPolice: "Police", authAmbulance: "Ambulance", authFire: "Fire Brigade", authRescue: "Rescue Team", authFlood: "Flood Rescue",
    statusDispatched: "Dispatched", statusEnRoute: "On The Way", statusOnScene: "Reached", statusClosed: "Closed",
    addDeviceModalTitle: "Add new device", addDeviceModalDesc: "Give this device a name so you can find it later.",
    fieldDeviceId: "Device ID", fieldOwnerName: "Owner / location name", cancelBtn: "Cancel",
    toastSentTo: "Alert sent to", toastDeviceAdded: "Device added.", toastMarkedOnWay: "Marked as on the way.",
    toastMarkedReached: "Marked as reached.", toastClosed: "Alert closed.", toastConnectFirst: "Connect the receiver first.",
    toastCopied: "Copied to clipboard.", toastNoGps: "No GPS location for this device.",
    demoToast: "5 sample alerts added to try the system.", clearedAlerts: "All alerts cleared.", clearedLog: "Log cleared.",
    resetDone: "All data cleared. Ready to start fresh.",
    confirmClose: "Mark this alert as closed?", confirmClearAlerts: "Clear all alerts?", confirmClearLog: "Clear the activity log?",
    confirmReset: "Clear all alerts, devices and log?"
  },
  hi: {
    brandTagline: "आपातकालीन सहायता प्रणाली",
    navOverview: "अवलोकन", navAlerts: "अलर्ट", navDevices: "डिवाइस",
    navBroadcast: "संदेश भेजें", navHistory: "गतिविधि लॉग", navAbout: "यह कैसे काम करता है",
    receiverOffline: "रिसीवर बंद है", receiverConnected: "रिसीवर जुड़ा है",
    connectReceiver: "रिसीवर जोड़ें", disconnectReceiver: "रिसीवर हटाएँ",
    connectHint: "वेब सीरियल · 115200 बॉड",
    topbarSubtitle: "आपके क्षेत्र के लिए लाइव अलर्ट और तुरंत सहायता।",
    demoBtn: "डेमो चलाएँ", demoSm: "डेमो", clearDataBtn: "डेटा हटाएँ",
    radioStandby: "रेडियो तैयार है", radioLive: "रिसीवर जुड़ा है",
    titleOverview: "अवलोकन", titleAlerts: "सभी अलर्ट", titleDevices: "डिवाइस",
    titleBroadcast: "संदेश भेजें", titleHistory: "गतिविधि लॉग", titleAbout: "यह कैसे काम करता है",
    statActiveLabel: "सक्रिय अलर्ट", statActiveSub: "अभी बंद नहीं हुए",
    statDevicesLabel: "पंजीकृत डिवाइस", statDevicesSub: "दर्ज फील्ड डिवाइस",
    statTodayLabel: "आज के अलर्ट", statTodaySub: "पिछले 24 घंटे में",
    statSignalLabel: "आखिरी सिग्नल", statSignalSub: "सबसे हाल का अपडेट",
    mapTitle: "लाइव मैप", liveTag: "लाइव", centerBtn: "मैप बीच में लाएँ",
    legendTitle: "रिस्पॉन्स सेंटर", legendRange: "15 किमी सीमा क्षेत्र",
    alertsCardTitle: "अलर्ट", activeSuffix: " सक्रिय",
    alertsPageTitle: "सभी अलर्ट", alertsPageDesc: "हर अलर्ट, उसकी स्थिति और स्थान यहाँ देखें।",
    clearAlertsBtn: "अलर्ट हटाएँ",
    devicesPageTitle: "डिवाइस", devicesPageDesc: "अलर्ट भेजने वाले डिवाइस जोड़ें और देखें।",
    addDeviceBtn: "डिवाइस जोड़ें",
    broadcastTitle: "संदेश भेजें", broadcastDesc: "सभी जुड़े डिवाइस को संदेश भेजें।",
    qStandby: "तैयार रहें", qEnRoute: "टीम रास्ते में है", qHighGround: "ऊँची जगह जाएँ", qAllClear: "सब ठीक है",
    broadcastPlaceholder: "यहाँ अपना संदेश लिखें (अधिकतम 160 अक्षर)",
    sendBroadcastBtn: "सभी डिवाइस को भेजें",
    sirenTitle: "आपातकालीन सायरन", sirenDesc: "सभी जुड़े डिवाइस पर तेज़ अलार्म बजाता है।",
    sirenOnBtn: "सायरन चालू करें", sirenOffBtn: "सायरन बंद करें",
    testTitle: "कनेक्शन जांचें", testDesc: "जांचें कि डिवाइस संदेश पा रहे हैं या नहीं।", testBtn: "टेस्ट संदेश भेजें",
    historyTitle: "गतिविधि लॉग", historyDesc: "पुराने अलर्ट, संदेश और स्थिति बदलाव का रिकॉर्ड।",
    clearLogBtn: "लॉग हटाएँ",
    emptyClearTitle: "सब सुरक्षित है", emptyClearDesc: "अभी कोई सक्रिय अलर्ट नहीं है।",
    emptyNoAlertsTitle: "अभी कोई अलर्ट नहीं", emptyNoAlertsDesc: "देखने के लिए ऊपर डेमो चलाएँ।",
    emptyNoDevicesTitle: "अभी कोई डिवाइस नहीं", emptyNoDevicesDesc: "ऊपर \"डिवाइस जोड़ें\" दबाएँ या डेमो चलाएँ।",
    emptyNoHistoryTitle: "लॉग खाली है", emptyNoHistoryDesc: "अभी कोई गतिविधि दर्ज नहीं हुई।",
    emptyNoTimeline: "इस डिवाइस के लिए अभी कोई गतिविधि दर्ज नहीं हुई।",
    btnDetails: "विवरण", btnLocate: "स्थान देखें", noGpsFix: "जीपीएस उपलब्ध नहीं", pingsSuffix: " सिग्नल",
    drawerStatusLabel: "स्थिति", drawerLiveLocation: "लाइव लोकेशन", drawerInfoLabel: "विवरण",
    drawerDeviceInfoLabel: "डिवाइस जानकारी", drawerAssignedLabel: "किसे भेजा गया", drawerActionsLabel: "कार्य",
    drawerSendLabel: "अलर्ट भेजें", drawerTimelineLabel: "समयरेखा",
    teleDistance: "दूरी", teleEta: "पहुँचने का समय", teleSignal: "सिग्नल", teleBattery: "बैटरी",
    teleReported: "रिपोर्ट का समय", telePings: "मिले सिग्नल",
    teleDeviceId: "डिवाइस आईडी", teleLocationName: "जगह का नाम", teleGps: "जीपीएस कोऑर्डिनेट",
    btnDirections: "रास्ता दिखाएँ", btnEnRoute: "रास्ते में", btnOnScene: "पहुँच गए", btnMarkClosed: "बंद करें",
    btnClosed: "बंद",
    authPolice: "पुलिस", authAmbulance: "एम्बुलेंस", authFire: "दमकल", authRescue: "बचाव दल", authFlood: "बाढ़ बचाव दल",
    statusDispatched: "भेजा गया", statusEnRoute: "रास्ते में", statusOnScene: "पहुँच गए", statusClosed: "बंद",
    addDeviceModalTitle: "नया डिवाइस जोड़ें", addDeviceModalDesc: "डिवाइस को नाम दें ताकि आप बाद में पहचान सकें।",
    fieldDeviceId: "डिवाइस आईडी", fieldOwnerName: "मालिक / जगह का नाम", cancelBtn: "रद्द करें",
    toastSentTo: "अलर्ट भेजा गया:", toastDeviceAdded: "डिवाइस जोड़ा गया।", toastMarkedOnWay: "रास्ते में दर्ज किया गया।",
    toastMarkedReached: "पहुँचना दर्ज किया गया।", toastClosed: "अलर्ट बंद किया गया।", toastConnectFirst: "पहले रिसीवर जोड़ें।",
    toastCopied: "क्लिपबोर्ड पर कॉपी हुआ।", toastNoGps: "इस डिवाइस का जीपीएस उपलब्ध नहीं है।",
    demoToast: "जांचने के लिए 5 नमूना अलर्ट जोड़े गए।", clearedAlerts: "सभी अलर्ट हटाए गए।", clearedLog: "लॉग हटाया गया।",
    resetDone: "सारा डेटा हटाया गया। फिर से शुरू करने के लिए तैयार।",
    confirmClose: "इस अलर्ट को बंद करें?", confirmClearAlerts: "सभी अलर्ट हटाएँ?", confirmClearLog: "गतिविधि लॉग हटाएँ?",
    confirmReset: "सभी अलर्ट, डिवाइस और लॉग हटाएँ?"
  }
};

let currentLang = localStorage.getItem("resqLang") || "en";
function t(key) { return (translations[currentLang] && translations[currentLang][key]) || translations.en[key] || key; }

const state = {
  serialPort: null,
  reader: null,
  keepReading: false,
  isReading: false,
  buffer: "",
  alerts: [],
  devices: [],
  history: [],
  map: null,
  markers: {},
  drawerMap: null,
  drawerLayers: { marker: null, trail: null, control: null, controlRing: null },
  lastToastTime: {},
  selectedAlertId: null,
  baseStation: { lat: 21.1643834, lon: 81.6582069 }
};

const $ = id => document.getElementById(id);

function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  }[c]));
}

function formatTimeAgo(isoString) {
  if (!isoString) return "--";
  const diffSec = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);
  if (diffSec < 5) return "Just now";
  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  return new Date(isoString).toLocaleDateString();
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  if (![lat1, lon1, lat2, lon2].every(Number.isFinite)) return null;
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function calculateEta(distKm) {
  if (!distKm || distKm <= 0) return "~5 min";
  const min = Math.max(3, Math.round((distKm / 45) * 60 + 2));
  return `~${min} min`;
}

// ---- Agency routing (text-coded, no emoji) ----
function getAgencyForAlert(alert) {
  const t = String(alert.TYPE || "").toUpperCase();
  if (t.includes("FIRE")) return { name: "Fire Brigade", code: "FIRE", class: "ag-fire", tag: "FIRE", unit: "Fire Unit 04", directives: "Send fire crew. Check for hazards and structure safety." };
  if (t.includes("MED")) return { name: "Ambulance / EMS", code: "EMS", class: "ag-ems", tag: "EMS", unit: "Medic Unit 02", directives: "Send ambulance. Prepare first aid and oxygen support." };
  if (t.includes("POLICE")) return { name: "Police", code: "PD", class: "ag-pd", tag: "PD", unit: "Patrol Unit 09", directives: "Send patrol team. Secure the area." };
  if (t.includes("EVAC") || t.includes("FLOOD")) return { name: "Flood Rescue Team", code: "FLOOD", class: "ag-flood", tag: "FLOOD", unit: "Rescue Boat 01", directives: "Send rescue boat and life jackets. Move people to safe ground." };
  return { name: "Search & Rescue Team", code: "SAR", class: "ag-sar", tag: "SAR", unit: "SAR Squad Alpha", directives: "Send search team with first-aid and rescue gear." };
}

function statusLabel(status) {
  switch (status) {
    case "EN ROUTE": return t("statusEnRoute");
    case "ON SCENE": return t("statusOnScene");
    case "RESOLVED": return t("statusClosed");
    default: return t("statusDispatched");
  }
}
function statusClass(status) {
  switch (status) {
    case "EN ROUTE": return "status-enroute";
    case "ON SCENE": return "status-onscene";
    case "RESOLVED": return "status-resolved";
    default: return "status-dispatched";
  }
}

function save() {
  localStorage.setItem("rescueAlerts", JSON.stringify(state.alerts));
  localStorage.setItem("rescueDevices", JSON.stringify(state.devices));
  localStorage.setItem("rescueHistory", JSON.stringify(state.history));
}

function initStorage() {
  const isReset = localStorage.getItem("rescueResetDone_v6");
  if (!isReset) {
    localStorage.removeItem("rescueAlerts");
    localStorage.removeItem("rescueDevices");
    localStorage.removeItem("rescueHistory");
    localStorage.setItem("rescueResetDone_v6", "true");
    state.alerts = []; state.devices = []; state.history = [];
    save();
    return;
  }
  state.alerts = JSON.parse(localStorage.getItem("rescueAlerts") || "[]");
  state.devices = JSON.parse(localStorage.getItem("rescueDevices") || "[]");
  state.history = JSON.parse(localStorage.getItem("rescueHistory") || "[]");
  state.alerts.forEach(a => {
    if (!Array.isArray(a.positions)) {
      a.positions = (a.LAT && a.LON) ? [{ lat: Number(a.LAT), lon: Number(a.LON), t: a.lastSeen || a.time }] : [];
    }
  });
}

function resetAllData(promptUser = true) {
  if (promptUser && !confirm(t("confirmReset"))) return;
  state.alerts = []; state.devices = []; state.history = [];
  if (state.map) Object.values(state.markers).forEach(m => state.map.removeLayer(m));
  state.markers = {};
  save();
  renderAll();
  closeDrawer();
  toast(t("resetDone"), "success");
}

function toast(msg, type = "info") {
  const el = $("toast");
  if (!el) return;
  el.textContent = msg;
  el.className = `toast show ${type === "emergency" ? "toast-emergency" : type === "success" ? "toast-success" : ""}`;
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => el.classList.remove("show"), 3200);
}

function playEmergencySound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.35);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
    osc.connect(gain); gain.connect(ctx.destination);
    osc.start(); osc.stop(ctx.currentTime + 0.4);
  } catch (e) {}
}

function addHistory(type, message) {
  state.history.unshift({ type, message, time: new Date().toISOString() });
  state.history = state.history.slice(0, 100);
  save();
  renderHistory();
}

// =========================================================================
// DEMO SIMULATION
// =========================================================================
function generateDemoSimulation() {
  if (state.map) Object.values(state.markers).forEach(m => state.map.removeLayer(m));
  state.markers = {};

  const baseLat = state.baseStation.lat;
  const baseLon = state.baseStation.lon;
  const mk = (lat, lon, minsAgo) => ({ lat: Number(lat.toFixed(6)), lon: Number(lon.toFixed(6)), t: new Date(Date.now() - minsAgo * 60000).toISOString() });

  const demoNodes = [
    { id: "ALT-DEMO-101", DEVICE: "DEV-101", TYPE: "SOS", OWNER: "Trekker Alpha (Checkpost 4)",
      LAT: (baseLat + 0.0324).toFixed(6), LON: baseLon.toFixed(6), RSSI: "-68", BAT: "87%",
      time: new Date(Date.now() - 2 * 60000).toISOString(), lastSeen: new Date().toISOString(), repeatCount: 4, status: "DISPATCHED" },
    { id: "ALT-DEMO-102", DEVICE: "DEV-102", TYPE: "MEDICAL", OWNER: "Dispensary Outpost B",
      LAT: baseLat.toFixed(6), LON: (baseLon + 0.0392).toFixed(6), RSSI: "-74", BAT: "92%",
      time: new Date(Date.now() - 6 * 60000).toISOString(), lastSeen: new Date().toISOString(), repeatCount: 2, status: "EN ROUTE" },
    { id: "ALT-DEMO-103", DEVICE: "DEV-103", TYPE: "FIRE", OWNER: "South Forest Watchtower",
      LAT: (baseLat - 0.0345).toFixed(6), LON: baseLon.toFixed(6), RSSI: "-81", BAT: "74%",
      time: new Date(Date.now() - 9 * 60000).toISOString(), lastSeen: new Date().toISOString(), repeatCount: 5, status: "ON SCENE" },
    { id: "ALT-DEMO-104", DEVICE: "DEV-104", TYPE: "POLICE", OWNER: "Highway Security Barrier 7",
      LAT: baseLat.toFixed(6), LON: (baseLon - 0.0415).toFixed(6), RSSI: "-70", BAT: "96%",
      time: new Date(Date.now() - 14 * 60000).toISOString(), lastSeen: new Date().toISOString(), repeatCount: 1, status: "DISPATCHED" },
    { id: "ALT-DEMO-105", DEVICE: "DEV-105", TYPE: "EVACUATE", OWNER: "River Flood Level Sensor 03",
      LAT: (baseLat + 0.0270).toFixed(6), LON: (baseLon + 0.0260).toFixed(6), RSSI: "-64", BAT: "89%",
      time: new Date(Date.now() - 1 * 60000).toISOString(), lastSeen: new Date().toISOString(), repeatCount: 3, status: "DISPATCHED" }
  ];

  demoNodes.forEach(n => {
    const agency = getAgencyForAlert(n);
    n.assignedAgency = agency.name;
    n.assignedAgencyTag = agency.tag;
    n.agencyClass = agency.class;
    n.agencyCode = agency.code;
    n.unitCallsign = agency.unit;
    n.directives = agency.directives;
    n.positions = [
      mk(Number(n.LAT) - 0.01, Number(n.LON) - 0.008, 20),
      mk(Number(n.LAT) - 0.004, Number(n.LON) - 0.003, 10),
      mk(Number(n.LAT), Number(n.LON), 0)
    ];
  });

  state.alerts = demoNodes;
  state.devices = demoNodes.map(n => ({ id: n.DEVICE, owner: n.OWNER, lastSeen: n.lastSeen }));

  save();
  renderAll();

  if (state.map) {
    demoNodes.forEach(n => addOrUpdateMarker(n));
    const markerList = Object.values(state.markers);
    if (markerList.length > 0) state.map.fitBounds(L.featureGroup(markerList).getBounds().pad(0.3));
  }

  toast(t("demoToast"), "success");
  addHistory("SIMULATION", "Added 5 sample alerts for testing");
}

// =========================================================================
// PACKET PARSER — normalized dedupe (no duplicate alerts)
// =========================================================================
function parsePacket(line) {
  line = (line || "").trim();
  if (!line) return;
  const p = {};

  if (line.includes("|") || line.includes("=")) {
    line.split("|").forEach(part => {
      const i = part.indexOf("=");
      if (i > 0) p[part.slice(0, i).trim().toUpperCase()] = part.slice(i + 1).trim();
    });
  } else if (line.includes(",")) {
    const parts = line.split(",");
    const first = parts[0].trim().toUpperCase();
    if (["SOS", "FIRE", "MEDICAL", "POLICE", "ASSIST", "EVACUATE"].some(k => first.includes(k))) p.TYPE = first;
    parts.slice(1).forEach(part => {
      const colonIdx = part.indexOf(":");
      const eqIdx = part.indexOf("=");
      const idx = colonIdx > 0 ? colonIdx : eqIdx;
      if (idx > 0) p[part.slice(0, idx).trim().toUpperCase()] = part.slice(idx + 1).trim();
    });
  }

  if (!p.DEVICE && p.DEV) p.DEVICE = p.DEV;
  if (!p.TYPE && p.EMERGENCY) p.TYPE = p.EMERGENCY;
  if (p.DEVICE) p.DEVICE = p.DEVICE.trim().toUpperCase();
  if (p.TYPE) p.TYPE = p.TYPE.trim().toUpperCase();
  if (!p.TYPE || !p.DEVICE) return;

  const now = Date.now();
  const dedupeKey = `${p.DEVICE}_${p.TYPE}`;

  // One open alert per device+type — no duplicates until it's closed.
  const existing = state.alerts.find(a => a.DEVICE === p.DEVICE && a.TYPE === p.TYPE && a.status !== "RESOLVED");

  if (existing) {
    existing.repeatCount = (existing.repeatCount || 1) + 1;
    existing.lastSeen = new Date().toISOString();
    if (p.LAT && p.LON) {
      existing.LAT = p.LAT; existing.LON = p.LON;
      if (!Array.isArray(existing.positions)) existing.positions = [];
      existing.positions.push({ lat: Number(p.LAT), lon: Number(p.LON), t: existing.lastSeen });
      existing.positions = existing.positions.slice(-50);
    }
    if (p.RSSI) existing.RSSI = p.RSSI;
    if (p.BAT) existing.BAT = p.BAT;

    const d = state.devices.find(x => x.id === p.DEVICE);
    if (d) d.lastSeen = existing.lastSeen;
    if (existing.LAT && existing.LON) addOrUpdateMarker(existing);

    const lastToast = state.lastToastTime[dedupeKey] || 0;
    if (now - lastToast > 12000) {
      toast(`${p.TYPE} — ${p.DEVICE} (${existing.repeatCount})`, "info");
      state.lastToastTime[dedupeKey] = now;
    }
    save();
    renderAll();
    refreshDrawerIfOpen(existing.id);
    return;
  }

  const agency = getAgencyForAlert(p);
  const newAlert = {
    id: "ALT-" + now + "-" + Math.floor(Math.random() * 1000),
    ...p,
    time: new Date().toISOString(),
    lastSeen: new Date().toISOString(),
    repeatCount: 1,
    status: "DISPATCHED",
    assignedAgency: agency.name,
    assignedAgencyTag: agency.tag,
    agencyClass: agency.class,
    agencyCode: agency.code,
    unitCallsign: agency.unit,
    directives: agency.directives,
    positions: (p.LAT && p.LON) ? [{ lat: Number(p.LAT), lon: Number(p.LON), t: new Date().toISOString() }] : []
  };

  state.alerts.unshift(newAlert);
  state.alerts = state.alerts.slice(0, 100);

  const d = state.devices.find(x => x.id === p.DEVICE);
  if (d) { d.lastSeen = newAlert.time; if (p.OWNER && d.owner === "UNKNOWN") d.owner = p.OWNER; }
  else state.devices.push({ id: p.DEVICE, owner: p.OWNER || "UNKNOWN", lastSeen: newAlert.time });

  if (p.LAT && p.LON) addOrUpdateMarker(newAlert);

  toast(`${newAlert.TYPE} — ${newAlert.DEVICE}`, "emergency");
  state.lastToastTime[dedupeKey] = now;
  playEmergencySound();
  addHistory("ALERT", `New ${p.TYPE} alert from ${p.DEVICE}`);
  save();
  renderAll();
}

// =========================================================================
// MAP (no fixed base-station marker — just live alert locations)
// =========================================================================
function setupMap() {
  if (!window.L) {
    $("map").innerHTML = "<div class='empty' style='color:#8892a0'>Map failed to load. Check your internet connection.</div>";
    return;
  }
  state.map = L.map("map", { zoomControl: true }).setView([state.baseStation.lat, state.baseStation.lon], 12);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(state.map);
  const tilePane = document.querySelector("#map .leaflet-tile-pane");
  if (tilePane) tilePane.classList.add("osm-dark-tiles");

  drawControlPoint(state.map);
  updateLegendText();

  state.alerts.forEach(a => { if (a.LAT && a.LON && a.status !== "RESOLVED") addOrUpdateMarker(a); });
}

// Draws the fixed response-center marker and its coverage range circle.
function drawControlPoint(map, small) {
  const { lat, lon } = state.baseStation;
  const circle = L.circle([lat, lon], {
    radius: CONTROL_RADIUS_M, color: "#e8ab3f", weight: small ? 1 : 1.3, opacity: 0.55,
    fillColor: "#e8ab3f", fillOpacity: 0.04, dashArray: "5 6"
  }).addTo(map);

  const size = small ? 20 : 26;
  const icon = L.divIcon({
    html: `<div class="base-marker" style="width:${size}px;height:${size}px"><svg class="icon" style="width:${size * 0.5}px;height:${size * 0.5}px"><use href="#i-pin"></use></svg></div>`,
    className: "", iconSize: [size, size], iconAnchor: [size / 2, size / 2]
  });
  const marker = L.marker([lat, lon], { icon, zIndexOffset: 1000 }).addTo(map);
  if (!small) marker.bindPopup(`<div class="rl-popup"><div class="rl-popup-title">${esc(t("legendTitle"))}</div><div class="rl-popup-row">${lat.toFixed(6)}, ${lon.toFixed(6)}</div><div class="rl-popup-row">${esc(t("legendRange"))}</div></div>`);
  return { marker, circle };
}

function updateLegendText() {
  const legend = $("mapLegend");
  if (!legend) return;
  legend.innerHTML = `
    <div><b>${esc(t("legendTitle"))}</b></div>
    <div>${state.baseStation.lat.toFixed(6)}, ${state.baseStation.lon.toFixed(6)}</div>
    <div>${esc(t("legendRange"))}</div>`;
}

function markerPopup(a) {
  const lat = Number(a.LAT), lon = Number(a.LON);
  const dist = calculateDistance(state.baseStation.lat, state.baseStation.lon, lat, lon);
  const distStr = dist ? `${dist.toFixed(2)} km` : "--";
  const etaStr = dist ? calculateEta(dist) : "--";
  return `
    <div class="rl-popup">
      <div class="rl-popup-title">${esc(a.TYPE)} — ${esc(a.DEVICE)}</div>
      <div class="rl-popup-row"><b>${esc(a.OWNER || "Unassigned")}</b></div>
      <div class="rl-popup-row">${distStr} · ${etaStr}</div>
      <div class="rl-popup-row">${esc(a.assignedAgency || "")}</div>
      <div class="rl-popup-row">${esc(statusLabel(a.status))} · ${formatTimeAgo(a.lastSeen || a.time)}</div>
      <div class="rl-popup-actions">
        <button class="sm-btn tone-dark" onclick="window.openIncidentDrawer('${a.id}')">${esc(t("btnDetails"))}</button>
      </div>
    </div>`;
}

function addOrUpdateMarker(a) {
  if (!state.map) return;
  const lat = Number(a.LAT), lon = Number(a.LON);
  if (!Number.isFinite(lat) || !Number.isFinite(lon) || !lat || !lon) return;

  const deviceId = a.DEVICE || a.id;
  const toneClass = a.status === "RESOLVED" ? " tone-resolved" : "";
  const pulseIcon = L.divIcon({
    html: `<div class="pulse-marker${toneClass}"><div class="ring"></div><div class="dot-center"></div></div>`,
    className: "", iconSize: [24, 24], iconAnchor: [12, 12]
  });

  if (state.markers[deviceId]) {
    const m = state.markers[deviceId];
    m.setLatLng([lat, lon]);
    m.setIcon(pulseIcon);
    m.setPopupContent(markerPopup(a));
  } else {
    const marker = L.marker([lat, lon], { icon: pulseIcon }).addTo(state.map);
    marker.bindPopup(markerPopup(a));
    state.markers[deviceId] = marker;
  }
}

function recenterMap() {
  if (!state.map) return;
  const markerList = Object.values(state.markers);
  if (markerList.length === 0) { state.map.setView([state.baseStation.lat, state.baseStation.lon], 11); return; }
  state.map.fitBounds(L.featureGroup(markerList).getBounds().pad(0.3));
}

window.locateAlert = function (alertId) {
  const a = state.alerts.find(x => x.id === alertId);
  if (!a) return;
  showPage("overview");
  if (!a.LAT || !a.LON) { toast(t("toastNoGps")); return; }
  const lat = Number(a.LAT), lon = Number(a.LON);
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return;
  if (state.map) {
    state.map.setView([lat, lon], 15);
    const marker = state.markers[a.DEVICE || a.id];
    if (marker) marker.openPopup();
  }
};

// =========================================================================
// INCIDENT DETAIL DRAWER — live tracking, details, send-to-authority
// =========================================================================
window.openIncidentDrawer = function (alertId) {
  const a = state.alerts.find(x => x.id === alertId);
  if (!a) return;
  state.selectedAlertId = alertId;
  renderDrawer(a);
  $("drawerOverlay").classList.add("open");
  $("incidentDrawer").classList.add("open");
  setTimeout(() => { if (state.drawerMap) state.drawerMap.invalidateSize(); }, 260);
};

function refreshDrawerIfOpen(alertId) {
  if (state.selectedAlertId !== alertId) return;
  if (!$("incidentDrawer").classList.contains("open")) return;
  const a = state.alerts.find(x => x.id === alertId);
  if (a) renderDrawer(a);
}

function closeDrawer() {
  $("drawerOverlay").classList.remove("open");
  $("incidentDrawer").classList.remove("open");
  state.selectedAlertId = null;
}

function renderDrawer(a) {
  const lat = Number(a.LAT) || state.baseStation.lat;
  const lon = Number(a.LON) || state.baseStation.lon;
  const hasGps = Boolean(a.LAT && a.LON);
  const dist = hasGps ? calculateDistance(state.baseStation.lat, state.baseStation.lon, lat, lon) : null;

  $("drawerIncidentId").textContent = a.id;
  $("drawerIncidentTitle").textContent = `${a.TYPE} — ${a.DEVICE}`;

  const stageIdx = STAGES.indexOf(a.status);
  $("drawerStatusTrack").innerHTML = STAGES.map((s, i) => {
    let cls = "";
    if (i < stageIdx || a.status === "RESOLVED") cls = "done";
    if (i === stageIdx) cls = "current";
    return `<div class="status-track-step ${cls}">${esc(statusLabel(s))}</div>`;
  }).join("");

  $("drawerDistance").textContent = dist ? `${dist.toFixed(2)} km` : t("noGpsFix");
  $("drawerEta").textContent = dist ? calculateEta(dist) : "--";
  $("drawerSignal").textContent = `${a.RSSI || "--"} dBm`;
  $("drawerBattery").textContent = a.BAT || "--";
  $("drawerReported").textContent = a.time ? new Date(a.time).toLocaleString() : "--";
  $("drawerPings").textContent = `${a.repeatCount || 1}`;

  $("drawerDeviceId").textContent = a.DEVICE || "--";
  $("drawerOwner").textContent = a.OWNER || "--";
  $("drawerGps").textContent = hasGps ? `${lat.toFixed(6)}, ${lon.toFixed(6)}` : t("noGpsFix");

  $("drawerAgency").textContent = a.assignedAgency || "--";
  $("drawerDirectives").textContent = a.directives || "";

  $("drawerNavBtn").href = hasGps ? `https://maps.google.com/?q=${lat.toFixed(6)},${lon.toFixed(6)}` : "#";

  const closed = a.status === "RESOLVED";
  $("drawerEnRoute").disabled = closed;
  $("drawerOnScene").disabled = closed;
  $("drawerComplete").disabled = closed;
  $("drawerComplete").textContent = closed ? t("btnClosed") : t("btnMarkClosed");

  $("drawerAuthorityGrid").innerHTML = AUTHORITIES.map(auth => `
    <button class="btn btn-outline" onclick="window.sendToAuthority('${a.id}','${auth.key}')">${esc(t(auth.labelKey))}</button>
  `).join("");

  const related = state.history.filter(h => h.message.includes(a.DEVICE)).slice(0, 8);
  $("drawerTimeline").innerHTML = related.length ? related.map(h => `
    <div class="timeline-mini-item"><b>${esc(h.message)}</b><span>${new Date(h.time).toLocaleString()}</span></div>
  `).join("") : `<div class="timeline-mini-item">${esc(t("emptyNoTimeline"))}</div>`;

  renderDrawerMap(a, lat, lon, hasGps);
}

function renderDrawerMap(a, lat, lon, hasGps) {
  if (!window.L) return;
  if (!state.drawerMap) {
    state.drawerMap = L.map("drawerMap", { zoomControl: false, attributionControl: false });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19 }).addTo(state.drawerMap);
    const pane = document.querySelector("#drawerMap .leaflet-tile-pane");
    if (pane) pane.classList.add("osm-dark-tiles");
  }
  const map = state.drawerMap;
  Object.values(state.drawerLayers).forEach(layer => { if (layer) map.removeLayer(layer); });

  const control = drawControlPoint(map, true);
  state.drawerLayers.control = control.marker;
  state.drawerLayers.controlRing = control.circle;

  if (!hasGps) { map.setView([lat, lon], 10); return; }

  const pulseIcon = L.divIcon({
    html: `<div class="pulse-marker"><div class="ring"></div><div class="dot-center"></div></div>`,
    className: "", iconSize: [22, 22], iconAnchor: [11, 11]
  });
  state.drawerLayers.marker = L.marker([lat, lon], { icon: pulseIcon }).addTo(map);

  const bounds = [[lat, lon], [state.baseStation.lat, state.baseStation.lon]];
  const trail = Array.isArray(a.positions) ? a.positions : [];
  if (trail.length > 1) {
    const latlngs = trail.map(p => [p.lat, p.lon]);
    state.drawerLayers.trail = L.polyline(latlngs, { color: "#e8ab3f", weight: 2, opacity: 0.85, dashArray: "3 5" }).addTo(map);
    latlngs.forEach(ll => bounds.push(ll));
  }

  setTimeout(() => {
    map.invalidateSize();
    if (bounds.length > 1) map.fitBounds(bounds, { padding: [30, 30] });
    else map.setView(bounds[0], 14);
  }, 50);
}

window.sendToAuthority = async function (alertId, authorityKey) {
  const a = state.alerts.find(x => x.id === alertId);
  const auth = AUTHORITIES.find(x => x.key === authorityKey);
  if (!a || !auth) return;
  const label = t(auth.labelKey);
  const cmd = `SEND_TO:${auth.code}|${a.DEVICE}|TYPE:${a.TYPE}|LAT:${a.LAT || "0"},LON:${a.LON || "0"}`;
  await sendSerial(cmd); // best-effort over LoRa if a receiver is connected
  toast(`${t("toastSentTo")} ${label}`, "success");
  addHistory("AUTHORITY_ALERT", `Sent ${a.TYPE} alert (${a.DEVICE}) to ${label}`);
  refreshDrawerIfOpen(alertId);
};

function setupDrawerEvents() {
  $("drawerClose").addEventListener("click", closeDrawer);
  $("drawerOverlay").addEventListener("click", closeDrawer);

  $("drawerEnRoute").addEventListener("click", () => {
    const a = state.alerts.find(x => x.id === state.selectedAlertId);
    if (!a) return;
    a.status = "EN ROUTE";
    save(); renderAll(); renderDrawer(a);
    toast(t("toastMarkedOnWay"), "info");
    addHistory("STATUS", `${a.DEVICE} marked on the way`);
  });

  $("drawerOnScene").addEventListener("click", () => {
    const a = state.alerts.find(x => x.id === state.selectedAlertId);
    if (!a) return;
    a.status = "ON SCENE";
    save(); renderAll(); renderDrawer(a);
    toast(t("toastMarkedReached"), "success");
    addHistory("STATUS", `${a.DEVICE} marked reached`);
  });

  $("drawerComplete").addEventListener("click", () => {
    const a = state.alerts.find(x => x.id === state.selectedAlertId);
    if (!a || a.status === "RESOLVED") return;
    if (!confirm(t("confirmClose"))) return;
    a.status = "RESOLVED";
    if (state.markers[a.DEVICE]) { state.map.removeLayer(state.markers[a.DEVICE]); delete state.markers[a.DEVICE]; }
    save(); renderAll(); renderDrawer(a);
    toast(t("toastClosed"), "success");
    addHistory("STATUS", `${a.DEVICE} alert closed`);
  });
}

// =========================================================================
// WEB SERIAL
// =========================================================================
async function connectSerial() {
  if (!("serial" in navigator)) { toast("Web Serial needs Chrome or Edge on a computer."); return; }
  try {
    state.serialPort = await navigator.serial.requestPort();
    await state.serialPort.open({ baudRate: 115200 });
    state.keepReading = true;
    $("serialDot").className = "dot online";
    $("serialText").textContent = t("receiverConnected");
    $("connectBtn").textContent = t("disconnectReceiver");
    $("connectBtn").classList.add("connected");
    $("stationDot").className = "dot live";
    $("stationStatusText").textContent = t("radioLive");
    addHistory("SERIAL", "Receiver connected");
    readSerial();
  } catch (e) {
    console.error(e);
  }
}

async function disconnectSerial() {
  state.keepReading = false;
  try { if (state.reader) await state.reader.cancel(); } catch (e) {}
  try { if (state.serialPort) await state.serialPort.close(); } catch (e) {}
  state.reader = null; state.serialPort = null; state.isReading = false;
  $("serialDot").className = "dot offline";
  $("serialText").textContent = t("receiverOffline");
  $("connectBtn").textContent = t("connectReceiver");
  $("connectBtn").classList.remove("connected");
  $("stationDot").className = "dot offline";
  $("stationStatusText").textContent = t("radioStandby");
  addHistory("SERIAL", "Receiver disconnected");
}

async function readSerial() {
  if (state.isReading) return;
  state.isReading = true;
  const decoder = new TextDecoder();
  try {
    while (state.keepReading && state.serialPort && state.serialPort.readable) {
      state.reader = state.serialPort.readable.getReader();
      try {
        while (state.keepReading) {
          const { value, done } = await state.reader.read();
          if (done) break;
          if (value) {
            state.buffer += decoder.decode(value, { stream: true });
            const lines = state.buffer.split(/\r?\n/);
            state.buffer = lines.pop() || "";
            lines.forEach(line => parsePacket(line));
          }
        }
      } finally {
        if (state.reader) { state.reader.releaseLock(); state.reader = null; }
      }
    }
  } catch (e) {
    console.error("Serial stream error:", e);
    await disconnectSerial();
  } finally {
    state.isReading = false;
  }
}

async function sendSerial(command) {
  if (!state.serialPort || !state.serialPort.writable) return false;
  try {
    const writer = state.serialPort.writable.getWriter();
    await writer.write(new TextEncoder().encode(command + "\n"));
    writer.releaseLock();
    return true;
  } catch (e) {
    console.error("Serial write error:", e);
    return false;
  }
}

async function broadcast() {
  const msg = $("broadcastMessage").value.trim();
  if (!msg) return;
  const sent = await sendSerial("BROADCAST=" + msg);
  toast(sent ? t("sendBroadcastBtn") : t("toastConnectFirst"), sent ? "success" : "info");
  if (sent) { addHistory("BROADCAST", msg); $("broadcastMessage").value = ""; updateCharCount(); }
}

async function highAlert() {
  const msg = $("highAlertMessage").value.trim() || "EVACUATE NOW - HIGH ALERT";
  if (!confirm(t("sirenTitle") + "?")) return;
  const sent = await sendSerial("HIGH_ALERT=" + msg);
  if (sent) { toast(t("sirenOnBtn"), "emergency"); addHistory("SIREN", "High alert triggered"); }
  else toast(t("toastConnectFirst"));
}

async function stopAlert() {
  const sent = await sendSerial("STOP_ALERT=1");
  if (sent) addHistory("SIREN", "Sirens silenced");
  else toast(t("toastConnectFirst"));
}

async function stationTest() {
  const sent = await sendSerial("BROADCAST=SYSTEM TEST");
  if (!sent) toast(t("toastConnectFirst"));
}

// =========================================================================
// RENDERERS
// =========================================================================
function renderStats() {
  const activeCount = state.alerts.filter(a => a.status !== "RESOLVED").length;
  $("activeAlerts").textContent = activeCount;
  $("deviceCount").textContent = state.devices.length;

  const today = new Date().toDateString();
  $("todayAlerts").textContent = state.alerts.filter(a => new Date(a.time).toDateString() === today).length;

  const lastAlert = state.alerts[0];
  $("lastSignal").textContent = lastAlert ? formatTimeAgo(lastAlert.lastSeen || lastAlert.time) : "--";

  const navBadge = $("navAlertBadge");
  navBadge.textContent = activeCount;
  navBadge.className = `nav-badge ${activeCount > 0 ? "active" : ""}`;
  $("alertCountBadge").textContent = `${activeCount}${t("activeSuffix")}`;
}

function incidentRow(a) {
  const hasGps = Boolean(a.LAT && a.LON);
  const dist = hasGps ? calculateDistance(state.baseStation.lat, state.baseStation.lon, Number(a.LAT), Number(a.LON)) : null;
  const isResolved = a.status === "RESOLVED";
  return `
    <div class="incident-row${isResolved ? " is-resolved" : ""}" onclick="window.openIncidentDrawer('${a.id}')">
      <div class="incident-row-top">
        <span class="incident-type">${esc(a.TYPE)} · ${esc(a.DEVICE)}</span>
        <div style="display:flex;align-items:center;gap:7px">
          <span class="agency-tag ${a.agencyClass || "ag-sar"}">${esc(a.assignedAgencyTag || a.agencyCode || "SAR")}</span>
          <span class="status-pill ${statusClass(a.status)}">${esc(statusLabel(a.status))}</span>
        </div>
      </div>
      <div class="incident-meta">
        <span class="incident-tag">${esc(a.OWNER || "--")}</span>
        ${dist ? `<span class="incident-tag dist">${dist.toFixed(1)} km · ${calculateEta(dist)}</span>` : `<span class="incident-tag">${esc(t("noGpsFix"))}</span>`}
        ${(a.repeatCount || 1) > 1 ? `<span class="incident-tag">${a.repeatCount}${esc(t("pingsSuffix"))}</span>` : ""}
        <span class="incident-time">${formatTimeAgo(a.lastSeen || a.time)}</span>
      </div>
      <div class="emergency-actions" style="display:flex;gap:6px;flex-wrap:wrap;padding-top:9px;margin-top:8px;border-top:1px dashed var(--border)">
        <button class="sm-btn tone-dark" onclick="event.stopPropagation();window.openIncidentDrawer('${a.id}')">${esc(t("btnDetails"))}</button>
        ${hasGps ? `<button class="sm-btn" onclick="event.stopPropagation();window.locateAlert('${a.id}')">${esc(t("btnLocate"))}</button>` : ""}
      </div>
    </div>`;
}

function renderLatest() {
  const active = state.alerts.filter(a => a.status !== "RESOLVED").slice(0, 8);
  $("latestAlerts").innerHTML = active.length ? active.map(incidentRow).join("") : `
    <div class="empty">
      <div class="empty-title">${esc(t("emptyClearTitle"))}</div>
      <div class="empty-desc">${esc(t("emptyClearDesc"))}</div>
    </div>`;
}

function renderAlerts() {
  $("alertsList").innerHTML = state.alerts.length ? state.alerts.map(incidentRow).join("") : `
    <div class="empty">
      <div class="empty-title">${esc(t("emptyNoAlertsTitle"))}</div>
      <div class="empty-desc">${esc(t("emptyNoAlertsDesc"))}</div>
    </div>`;
}

function renderDevices() {
  $("devicesList").innerHTML = state.devices.length ? state.devices.map(d => `
    <div class="device-item">
      <div class="device-top"><div class="device-id">${esc(d.id)}</div></div>
      <div class="device-meta">${esc(d.owner || "--")}</div>
      <small>${d.lastSeen ? new Date(d.lastSeen).toLocaleString() : "--"}</small>
    </div>`).join("") : `
    <div class="empty">
      <div class="empty-title">${esc(t("emptyNoDevicesTitle"))}</div>
      <div class="empty-desc">${esc(t("emptyNoDevicesDesc"))}</div>
    </div>`;
}

function renderHistory() {
  $("historyList").innerHTML = state.history.length ? state.history.map(h => `
    <div class="history-item">
      <div class="history-header"><span class="history-type-tag">${esc(h.type)}</span><span class="history-time">${new Date(h.time).toLocaleString()}</span></div>
      <div class="history-msg">${esc(h.message)}</div>
    </div>`).join("") : `
    <div class="empty">
      <div class="empty-title">${esc(t("emptyNoHistoryTitle"))}</div>
      <div class="empty-desc">${esc(t("emptyNoHistoryDesc"))}</div>
    </div>`;
}

function renderAll() {
  renderStats();
  renderLatest();
  renderAlerts();
  renderDevices();
  renderHistory();
  if (state.selectedAlertId) refreshDrawerIfOpen(state.selectedAlertId);
}

const PAGE_TITLE_KEYS = {
  overview: "titleOverview", alerts: "titleAlerts", devices: "titleDevices",
  broadcast: "titleBroadcast", history: "titleHistory", about: "titleAbout"
};
let currentPage = "overview";

function showPage(id) {
  currentPage = id;
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  const target = $(id);
  if (target) target.classList.add("active");
  document.querySelectorAll(".nav-btn").forEach(b => b.classList.toggle("active", b.dataset.page === id));
  $("pageTitle").textContent = t(PAGE_TITLE_KEYS[id] || "titleOverview");
  if (id === "overview" && state.map) setTimeout(() => state.map.invalidateSize(), 150);
}

function updateCharCount() {
  const el = $("broadcastMessage");
  $("charCount").textContent = `${el ? el.value.length : 0} / 160`;
}

// =========================================================================
// LANGUAGE TOGGLE
// =========================================================================
function applyLanguage() {
  document.documentElement.lang = currentLang;
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    el.textContent = t(key);
  });
  document.querySelectorAll("[data-i18n-ph]").forEach(el => {
    const key = el.getAttribute("data-i18n-ph");
    el.setAttribute("placeholder", t(key));
  });
  $("langToggleLabel").textContent = currentLang === "en" ? "हिंदी" : "English";
  $("pageTitle").textContent = t(PAGE_TITLE_KEYS[currentPage] || "titleOverview");

  const dot = $("serialDot");
  const connected = dot && dot.classList.contains("online");
  $("serialText").textContent = connected ? t("receiverConnected") : t("receiverOffline");
  $("connectBtn").textContent = connected ? t("disconnectReceiver") : t("connectReceiver");
  const stationDot = $("stationDot");
  $("stationStatusText").textContent = (stationDot && stationDot.classList.contains("live")) ? t("radioLive") : t("radioStandby");

  updateLegendText();
  renderAll();
}

function toggleLanguage() {
  currentLang = currentLang === "en" ? "hi" : "en";
  localStorage.setItem("resqLang", currentLang);
  applyLanguage();
}

// =========================================================================
// EVENTS
// =========================================================================
function setupEvents() {
  document.querySelectorAll(".nav-btn").forEach(b => b.addEventListener("click", () => showPage(b.dataset.page)));
  $("connectBtn").addEventListener("click", () => state.serialPort ? disconnectSerial() : connectSerial());
  $("broadcastBtn").addEventListener("click", broadcast);
  $("highAlertBtn").addEventListener("click", highAlert);
  $("stopAlertBtn").addEventListener("click", stopAlert);
  $("testBtn").addEventListener("click", stationTest);
  $("langToggleBtn").addEventListener("click", toggleLanguage);

  const demoTop = $("demoBtnTop"); if (demoTop) demoTop.addEventListener("click", generateDemoSimulation);
  const demoMap = $("demoBtnMap"); if (demoMap) demoMap.addEventListener("click", generateDemoSimulation);
  const resetBtn = $("resetAllBtn"); if (resetBtn) resetBtn.addEventListener("click", () => resetAllData(true));

  const bm = $("broadcastMessage"); if (bm) bm.addEventListener("input", updateCharCount);
  document.querySelectorAll(".quick-msg").forEach(btn => btn.addEventListener("click", () => {
    $("broadcastMessage").value = btn.dataset.msg; updateCharCount();
  }));

  const recenterBtn = $("recenterMapBtn"); if (recenterBtn) recenterBtn.addEventListener("click", recenterMap);

  $("clearAlerts").addEventListener("click", () => {
    if (confirm(t("confirmClearAlerts"))) {
      state.alerts = [];
      Object.values(state.markers).forEach(m => state.map && state.map.removeLayer(m));
      state.markers = {};
      save(); renderAll(); closeDrawer();
      toast(t("clearedAlerts"));
    }
  });

  const chBtn = $("clearHistoryBtn");
  if (chBtn) chBtn.addEventListener("click", () => {
    if (confirm(t("confirmClearLog"))) { state.history = []; save(); renderHistory(); toast(t("clearedLog")); }
  });

  $("registerDeviceBtn").addEventListener("click", () => { $("modal").classList.remove("hidden"); $("newDeviceId").focus(); });
  $("cancelModal").addEventListener("click", () => $("modal").classList.add("hidden"));

  $("saveDevice").addEventListener("click", () => {
    const id = $("newDeviceId").value.trim().toUpperCase();
    const owner = $("newOwnerId").value.trim();
    if (!id) return;
    if (state.devices.some(d => d.id === id)) return;
    state.devices.push({ id, owner: owner || "UNKNOWN", lastSeen: null });
    save(); renderAll();
    $("newDeviceId").value = ""; $("newOwnerId").value = "";
    $("modal").classList.add("hidden");
    toast(t("toastDeviceAdded"), "success");
    addHistory("DEVICE", `Added device ${id}`);
  });

  setupDrawerEvents();

  function updateClock() {
    $("clock").textContent = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  }
  updateClock();
  setInterval(updateClock, 1000);
}

// Initial run
initStorage();
setupEvents();
applyLanguage();
setupMap();
