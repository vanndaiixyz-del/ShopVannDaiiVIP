const express = require("express");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const app = express();
app.set("trust proxy", 1);
const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || "0.0.0.0";
const DATA = path.join(__dirname, "orders.json");
const PUBLIC_DIR = path.join(__dirname, "public");
const ROOT_INDEX = path.join(__dirname, "index.html");
const ROOT_ADMIN = path.join(__dirname, "admin.html");
const ADMIN_PASSWORD = String(process.env.ADMIN_PASSWORD || "");
const BUILD_ID = "SHOPVANNDAIIVIP-AUTH-ORDERS-V5";
const ADMIN_SESSION_COOKIE = "vdvip_admin_session";

const USERS_DATA = path.join(__dirname, "users.json");
const SESSIONS_DATA = path.join(__dirname, "sessions.json");
const SESSION_COOKIE = "vdvip_session";

function loadJsonArray(file) {
  try {
    if (!fs.existsSync(file)) fs.writeFileSync(file, "[]", "utf8");
    const v = JSON.parse(fs.readFileSync(file, "utf8"));
    return Array.isArray(v) ? v : [];
  } catch (err) {
    console.error("JSON read failed:", file, err.message);
    try { fs.writeFileSync(file, "[]", "utf8"); } catch (e) { console.error("JSON reset failed:", file, e.message); }
    return [];
  }
}
function saveJsonArray(file, value) {
  const tmp = file + ".tmp";
  fs.writeFileSync(tmp, JSON.stringify(value, null, 2), "utf8");
  fs.renameSync(tmp, file);
}
function parseCookies(req) {
  const raw=req.headers.cookie||"";
  const out={};
  raw.split(";").forEach(part=>{const i=part.indexOf("="); if(i>0) out[part.slice(0,i).trim()]=decodeURIComponent(part.slice(i+1).trim());});
  return out;
}
function currentUser(req) {
  const sid=parseCookies(req)[SESSION_COOKIE];
  if(!sid) return null;
  const sessions=loadJsonArray(SESSIONS_DATA);
  const session=sessions.find(x=>x.id===sid && (!x.expiresAt || Date.parse(x.expiresAt)>Date.now()));
  if(!session) return null;
  const users=loadJsonArray(USERS_DATA);
  return users.find(u=>u.id===session.userId) || null;
}
function setSessionCookie(req, res, sid) {
  const secure = Boolean(req.secure || req.headers["x-forwarded-proto"] === "https") ? "; Secure" : "";
  res.setHeader("Set-Cookie", `${SESSION_COOKIE}=${encodeURIComponent(sid)}; Path=/; HttpOnly${secure}; SameSite=Lax; Max-Age=2592000`);
}
function clearSessionCookie(req, res) {
  const secure = Boolean(req.secure || req.headers["x-forwarded-proto"] === "https") ? "; Secure" : "";
  res.setHeader("Set-Cookie", `${SESSION_COOKIE}=; Path=/; HttpOnly${secure}; SameSite=Lax; Max-Age=0`);
}
function hashPassword(password, salt=crypto.randomBytes(16).toString("hex")) {
  const hash=crypto.scryptSync(String(password), salt, 64).toString("hex");
  return {salt, hash};
}
function verifyPassword(password, salt, expected) {
  try {
    if (!salt || !expected || typeof expected !== "string" || expected.length !== 128) return false;
    const actual=crypto.scryptSync(String(password), String(salt), 64).toString("hex");
    const a=Buffer.from(actual,"hex"), b=Buffer.from(expected,"hex");
    return a.length === b.length && crypto.timingSafeEqual(a,b);
  } catch (err) {
    console.error("Password verification failed:", err.message);
    return false;
  }
}
function formatVN(iso) {
  if(!iso) return {date:"-", time:"-"};
  const d=new Date(iso);
  return {date:new Intl.DateTimeFormat("vi-VN",{timeZone:"Asia/Ho_Chi_Minh",year:"numeric",month:"2-digit",day:"2-digit"}).format(d),
          time:new Intl.DateTimeFormat("vi-VN",{timeZone:"Asia/Ho_Chi_Minh",hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:false}).format(d)};
}
function requireUser(req,res) { const u=currentUser(req); if(!u){res.status(401).json({error:"Vui lòng đăng nhập."}); return null;} return u; }

const blindBagFiles = ["aimbot head ff normal(1).zip","AimBody 200k Vanndaiixyz(1).zip","AIM Drag FFTH+FFM Vanndaiixyz (1).zip","AIM Cổ FFTH 200K Vanndaiixyz (1).zip","Aim Cổ 100% Vanndaiixyz (1).zip","Aim Cổ Siêu Bá Vanndaiixyz (1).zip","Aim Body 100% Antiban.zip","AIM DRAG 6.0 Vanndaiixyz (1).zip","Aim Ngực 100% Vanndaiixyz(1).zip","AIM DRAG V3 Vanndaiixyz(1).zip","AIMDRAG-Vanndaiixyz.zip","AIM BODY 100k (2).zip","HEADLOCK V3 Vanndaiixyz(1).zip"];

const products = {
  "aim-lock": { name: "AIMLOCK VIP", price: 250000 },
  "fliza-aimlock-supper": { name: "AIMLOCK SUPPER", price: 250000, type:"FFTH", category:"AIM FLIZA" },
  "aim-drag": { name: "AIM DRAG", price: 350000 },
  "aim-body": { name: "AIM BODY", price: 100000 },
  "aim-neck": { name: "AIM NECK", price: 350000 },
  "3105-lock": { name: "AIMLOCK VIP", price: 250000, type:"FFTH", category:"AIM 3105" },
  "3105-neck": { name: "AIM NECK", price: 350000, type:"FFTH", category:"AIM 3105" },
  "3105-body": { name: "AIM BODY 3105", price: 100000, type:"FFTH", category:"AIM 3105" },
  "3105-drag": { name: "AIM DRAG", price: 350000, type:"FFTH", category:"AIM 3105" },
  "3105-head": { name: "AIM HEAD", price: 400000, type:"FFTH", category:"AIM 3105" },
  "3105-drag-vip-v1": { name: "DRAG VIP V1", price: 400000, type:"FFTH", category:"AIM 3105" },
  "3105-drag-new": { name: "AIM DRAG NEW", price: 350000, type:"FFTH", category:"AIM 3105" },
  "3105-neck-new": { name: "AIM NECK NEW", price: 350000, type:"FFTH", category:"AIM 3105" },
  "3105-magic": { name: "AIM MAGIC", price: 150000, type:"FFTH", category:"AIM 3105" },
  "adr-aimlock": { name: "AIMLOCK", price: 350000, category:"AIM-ADR" },
  "blind-bag": { name: "TÚI MÙ", price: 50000, category:"TÚI MÙ" }
};

function loadOrders() {
  if (!fs.existsSync(DATA)) fs.writeFileSync(DATA, "[]", "utf8");
  try {
    const value = JSON.parse(fs.readFileSync(DATA, "utf8"));
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function saveOrders(orders) {
  fs.writeFileSync(DATA, JSON.stringify(orders, null, 2), "utf8");
}

function adminSessionId(req) { return parseCookies(req)[ADMIN_SESSION_COOKIE] || ""; }
function adminAuthorized(req) {
  if (!ADMIN_PASSWORD) return false;
  const sid = adminSessionId(req);
  if (!sid) return false;
  const sessions = loadJsonArray(SESSIONS_DATA);
  return sessions.some(x => x.type === "admin" && x.id === sid && (!x.expiresAt || Date.parse(x.expiresAt) > Date.now()));
}
function setAdminSessionCookie(req, res, sid) {
  const secure = Boolean(req.secure || req.headers["x-forwarded-proto"] === "https") ? "; Secure" : "";
  res.setHeader("Set-Cookie", `${ADMIN_SESSION_COOKIE}=${encodeURIComponent(sid)}; Path=/; HttpOnly${secure}; SameSite=Lax; Max-Age=28800`);
}
function clearAdminSessionCookie(req, res) {
  const secure = Boolean(req.secure || req.headers["x-forwarded-proto"] === "https") ? "; Secure" : "";
  res.setHeader("Set-Cookie", `${ADMIN_SESSION_COOKIE}=; Path=/; HttpOnly${secure}; SameSite=Lax; Max-Age=0`);
}
function requireAdmin(req, res) {
  if (!adminAuthorized(req)) { res.status(401).json({ error: "Phiên Admin không hợp lệ hoặc đã hết hạn." }); return false; }
  return true;
}

function fileFor(order) {
  if (order.product === "aim-lock") return order.edition === "max" ? "AIMLOCK-FreeFireMAX.zip" : "AIMLOCK-FreeFire.zip";
  if (order.product === "fliza-aimlock-v1") return order.edition === "ffm" ? "AIMLOCK_V1_FFM.zip" : order.edition === "ffth" ? "AIMLOCK_V1_FFTH.zip" : null;
  if (order.product === "fliza-aimlock-supper") return "AIMLOCK_SUPPER.zip";
  return {
    "aim-drag":"AIM-DRAG.zip", "aim-body":"AIM-BODY.zip", "aim-neck":"AIM-NECK.zip",
    "3105-lock":"AIMLOCK-3105.zip", "3105-neck":"AIMNECK-3105.zip",
    "3105-body":"AIMBODY-3105.zip", "3105-drag":"AIMDRAG-3105.zip",
    "3105-head":"AIM HEAD.zip", "3105-drag-vip-v1":"DRAG VIP V1.zip",
    "3105-drag-new":"AIM DRAG NEW.zip", "3105-neck-new":"AIM NECK NEW.zip",
    "3105-magic":"AIM MAGIC.zip", "adr-aimlock":"AIMLOCK VIP ADR.zip"
  }[order.product];
}

function findProductFile(filename) {
  const roots = [__dirname, path.join(__dirname, "private_files"), path.join(__dirname, "storage"), path.join(__dirname, "files")];
  const seen = new Set();
  const maxDepth = 4;
  function walk(dir, depth) {
    if (depth > maxDepth || seen.has(dir)) return null;
    seen.add(dir);
    let entries;
    try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return null; }
    for (const entry of entries) {
      if (entry.name === "node_modules" || entry.name === ".git") continue;
      const full = path.join(dir, entry.name);
      if (entry.isFile() && entry.name === filename) return full;
      if (entry.isDirectory()) {
        const hit = walk(full, depth + 1);
        if (hit) return hit;
      }
    }
    return null;
  }
  for (const r of roots) { const hit = walk(r, 0); if (hit) return hit; }
  return null;
}

app.set("trust proxy", 1);
app.use(express.json({ limit: "100kb" }));

app.get("/health", (req, res) => res.json({ ok: true, service: "ShopVannĐaiiVIP", build: BUILD_ID, adminConfigured: Boolean(ADMIN_PASSWORD) }));
app.get("/api/version", (req, res) => res.json({ ok: true, build: BUILD_ID, adminPasswordMode: "fixed" }));
app.get("/", (req, res) => {
  const index = path.join(PUBLIC_DIR, "index.html");
  if (fs.existsSync(index)) return res.sendFile(index);
  if (fs.existsSync(ROOT_INDEX)) return res.sendFile(ROOT_INDEX);
  return res.status(500).send("index.html không tồn tại trên server.");
});
app.get(["/admin", "/admin/", "/admin.html"], (req, res) => {
  const admin = path.join(PUBLIC_DIR, "admin.html");
  if (fs.existsSync(admin)) return res.sendFile(admin);
  if (fs.existsSync(ROOT_ADMIN)) return res.sendFile(ROOT_ADMIN);
  return res.status(500).send("admin.html không tồn tại trên server.");
});

app.get(["/account", "/account/", "/account.html"], (req,res)=>{
  const account=path.join(PUBLIC_DIR,"account.html");
  const rootAccount=path.join(__dirname,"account.html");
  if(fs.existsSync(account)) return res.sendFile(account);
  if(fs.existsSync(rootAccount)) return res.sendFile(rootAccount);
  return res.status(404).send("account.html không tồn tại trên server.");
});

app.post("/api/auth/register", (req,res)=>{
  try {
    const email=String(req.body?.email||"").trim().toLowerCase();
    const password=String(req.body?.password||"");
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({error:"Email không hợp lệ."});
    if(password.length<6) return res.status(400).json({error:"Mật khẩu tối thiểu 6 ký tự."});
    const users=loadJsonArray(USERS_DATA);
    if(users.some(u=>u.email===email)) return res.status(409).json({error:"Email đã được đăng ký. Hãy đăng nhập."});
    const {salt,hash}=hashPassword(password);
    const user={id:"U"+Date.now().toString(36).toUpperCase()+crypto.randomBytes(3).toString("hex"),email,passwordHash:hash,passwordSalt:salt,createdAt:new Date().toISOString()};
    users.push(user); saveJsonArray(USERS_DATA,users);
    const sid=crypto.randomBytes(32).toString("hex");
    const sessions=loadJsonArray(SESSIONS_DATA).filter(x=>!x.expiresAt || Date.parse(x.expiresAt)>Date.now());
    sessions.push({id:sid,userId:user.id,createdAt:new Date().toISOString(),expiresAt:new Date(Date.now()+2592000000).toISOString()});
    saveJsonArray(SESSIONS_DATA,sessions); setSessionCookie(req,res,sid);
    res.status(201).json({ok:true,message:"Đăng ký thành công.",email:user.email});
  } catch (err) {
    console.error("REGISTER_ERROR", err);
    res.status(500).json({error:"Máy chủ không thể lưu tài khoản. Hãy thử lại."});
  }
});

app.post("/api/auth/login",(req,res)=>{
  try {
    const email=String(req.body?.email||"").trim().toLowerCase();
    const password=String(req.body?.password||"");
    if(!email || !password) return res.status(400).json({error:"Vui lòng nhập email và mật khẩu."});
    const user=loadJsonArray(USERS_DATA).find(u=>u.email===email);
    if(!user || !verifyPassword(password,user.passwordSalt,user.passwordHash)) return res.status(401).json({error:"Email hoặc mật khẩu không đúng."});
    const sid=crypto.randomBytes(32).toString("hex");
    const sessions=loadJsonArray(SESSIONS_DATA).filter(x=>!x.expiresAt || Date.parse(x.expiresAt)>Date.now());
    sessions.push({id:sid,userId:user.id,createdAt:new Date().toISOString(),expiresAt:new Date(Date.now()+2592000000).toISOString()});
    saveJsonArray(SESSIONS_DATA,sessions); setSessionCookie(req,res,sid);
    res.json({ok:true,email:user.email});
  } catch (err) {
    console.error("LOGIN_ERROR", err);
    res.status(500).json({error:"Máy chủ đăng nhập đang gặp lỗi. Hãy thử lại."});
  }
});
app.post("/api/auth/logout",(req,res)=>{ const sid=parseCookies(req)[SESSION_COOKIE]; const sessions=loadJsonArray(SESSIONS_DATA).filter(x=>x.id!==sid); saveJsonArray(SESSIONS_DATA,sessions); clearSessionCookie(req,res); res.json({ok:true}); });
app.get("/api/auth/me",(req,res)=>{const u=currentUser(req); res.json({authenticated:Boolean(u),user:u?{id:u.id,email:u.email}:null});});
app.get("/api/account/orders",(req,res)=>{
  const u=requireUser(req,res); if(!u) return;
  const orders=loadOrders().filter(o=>o.userId===u.id).sort((a,b)=>String(b.createdAt||"").localeCompare(String(a.createdAt||"")));
  res.set("Cache-Control","no-store");
  res.json({orders:orders.map(o=>{const c=formatVN(o.createdAt); const p=formatVN(o.paidAt); return {orderId:o.id,productName:products[o.product]?.name||o.product,price:products[o.product]?.price||o.amount,amount:o.amount,purchaseDate:c.date,purchaseTime:c.time,status:(o.paid?"Đã duyệt":"Đang chờ"),paidAt:o.paidAt?`${p.date} ${p.time}`:null,downloadUrl:o.paid?`/api/orders/${encodeURIComponent(o.id)}/download`:null};})});
});

// Serve the optimized shop logo explicitly so image loading is reliable on Render.
app.get("/assets/aimlock-logo.jpg", (req, res) => {
  const file = path.join(PUBLIC_DIR, "assets", "aimlock-logo.jpg");
  if (fs.existsSync(file)) {
    res.set("Cache-Control", "public, max-age=31536000, immutable");
    return res.sendFile(file);
  }
  return res.status(404).send("aimlock-logo.jpg không tồn tại.");
});
// Serve the shop logo explicitly so /assets/shop-logo.png works reliably on Render.
app.get("/assets/shop-logo.png", (req, res) => {
  const file = path.join(PUBLIC_DIR, "assets", "shop-logo.png");
  if (fs.existsSync(file)) return res.sendFile(file);
  return res.status(404).send("shop-logo.png không tồn tại.");
});

app.get("/payment-qr.png", (req, res) => {
  const file = path.join(PUBLIC_DIR, "payment-qr.png");
  const rootFile = path.join(__dirname, "payment-qr.png");
  if (fs.existsSync(file)) return res.sendFile(file);
  if (fs.existsSync(rootFile)) return res.sendFile(rootFile);
  return res.status(404).send("payment-qr.png không tồn tại.");
});
app.use(express.static(PUBLIC_DIR));

app.get("/api/products", (req, res) => res.json(products));

app.post("/api/orders", (req, res) => {
  const user = currentUser(req);
  if (!user) return res.status(401).json({ error: "Vui lòng đăng nhập trước khi mua." });

  const { product, edition } = req.body || {};
  if (!products[product]) return res.status(400).json({ error: "Sản phẩm không hợp lệ" });
  if (product === "aim-lock" && !["normal", "max"].includes(edition)) {
    return res.status(400).json({ error: "Vui lòng chọn Free Fire thường hoặc Free Fire MAX" });
  }
  if (product === "fliza-aimlock-v1" && !["ffth", "ffm"].includes(edition)) {
    return res.status(400).json({ error: "Vui lòng chọn FFTH hoặc FFM" });
  }

  const order = {
    userId: user.id,
    id: "SV" + Date.now().toString(36).toUpperCase() + crypto.randomBytes(3).toString("hex").toUpperCase(),
    product,
    edition: edition || null,
    amount: products[product].price,
    paid: false,
    status: "PENDING",
    createdAt: new Date().toISOString(),
    paidAt: null
  };

  const orders = loadOrders();
  orders.push(order);
  saveOrders(orders);
  res.json({ orderId: order.id, amount: order.amount, shop: "ShopVannĐaiiVIP" });
});

app.get("/api/orders/:id", (req, res) => {
  const user = currentUser(req);
  if (!user) return res.status(401).json({ error: "Vui lòng đăng nhập." });
  const order = loadOrders().find(x => x.id === req.params.id);
  if (!order) return res.status(404).json({ error: "Không tìm thấy đơn" });
  if (order.userId !== user.id) return res.status(403).json({ error: "Bạn không có quyền xem đơn này." });
  res.json({
    id: order.id,
    product: products[order.product]?.name || order.product,
    edition: order.edition,
    amount: order.amount,
    paid: Boolean(order.paid),
    status: order.status || (order.paid ? "PAID" : "PENDING")
  });
});

// ===== ADMIN AUTH =====
app.post("/admin/api/login", (req, res) => {
  if (!ADMIN_PASSWORD) return res.status(503).json({ error: "Admin chưa được cấu hình mật khẩu trên Render." });
  const supplied = String(req.body?.password || "");
  if (!supplied || supplied !== ADMIN_PASSWORD) return res.status(401).json({ error: "Mật khẩu không đúng." });
  const sid = crypto.randomBytes(32).toString("hex");
  const sessions = loadJsonArray(SESSIONS_DATA).filter(x => !x.expiresAt || Date.parse(x.expiresAt) > Date.now());
  sessions.push({ id:sid, type:"admin", createdAt:new Date().toISOString(), expiresAt:new Date(Date.now()+28800000).toISOString() });
  saveJsonArray(SESSIONS_DATA, sessions);
  setAdminSessionCookie(req, res, sid);
  res.json({ ok:true });
});
app.post("/admin/api/logout", (req, res) => {
  const sid = adminSessionId(req);
  const sessions = loadJsonArray(SESSIONS_DATA).filter(x => x.id !== sid);
  saveJsonArray(SESSIONS_DATA, sessions);
  clearAdminSessionCookie(req, res);
  res.json({ ok:true });
});
app.get("/admin/api/me", (req, res) => res.json({ authenticated: adminAuthorized(req) }));

// ===== ADMIN =====
app.post("/admin/api/test-order", (req, res) => {
  if (!requireAdmin(req, res)) return;
  const { product, edition } = req.body || {};
  if (!products[product]) return res.status(400).json({ error: "Sản phẩm không hợp lệ" });
  const now = new Date().toISOString();
  const order = { id:"TEST"+Date.now().toString(36).toUpperCase(), product, edition:edition||null, amount:0, paid:true, status:"PAID_TEST", createdAt:now, paidAt:now };
  const orders = loadOrders(); orders.push(order); saveOrders(orders);
  res.json({ ok:true, orderId:order.id, amount:0, status:order.status });
});

app.get("/admin/api/orders", (req, res) => {
  if (!requireAdmin(req, res)) return;
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.set("Pragma", "no-cache");
  res.set("Expires", "0");
  const orders = loadOrders().sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")));
  res.json(orders.map(o => ({
    orderId: o.id,
    product: products[o.product]?.name || o.product,
    edition: o.edition || null,
    amount: o.amount,
    status: o.status || (o.paid ? "PAID" : "PENDING"),
    createdAt: o.createdAt || null,
    paidAt: o.paidAt || null,
    purchaseDate: formatVN(o.createdAt).date,
    purchaseTime: formatVN(o.createdAt).time,
    confirmedDate: o.paidAt ? formatVN(o.paidAt).date : null,
    confirmedTime: o.paidAt ? formatVN(o.paidAt).time : null
  })));
});

app.post("/admin/api/orders/:orderId/confirm", (req, res) => {
  if (!requireAdmin(req, res)) return;

  const orders = loadOrders();
  const order = orders.find(o => o.id === req.params.orderId);
  if (!order) return res.status(404).json({ error: "Không tìm thấy đơn" });
  if (order.paid) return res.json({ ok: true, orderId: order.id, status: "PAID" });

  order.paid = true;
  order.status = "PAID";
  order.paidAt = new Date().toISOString();
  saveOrders(orders);

  res.json({ ok: true, orderId: order.id, status: order.status });
});

function sendOrderFile(req, res) {
  const user = currentUser(req);
  if (!user) return res.status(401).send("Vui lòng đăng nhập.");
  const order = loadOrders().find(x => x.id === req.params.id);
  if (!order) return res.status(404).send("Không tìm thấy đơn.");
  if (order.userId !== user.id) return res.status(403).send("Bạn không có quyền tải đơn này.");
  if (!order.paid) return res.status(403).send("Thanh toán chưa được xác nhận.");

  if (order.product === "adr-aimlock") return res.redirect("https://www.mediafire.com/file/hfg7ibdd8ujtddn/AIMLOCK+VIP+ADR.zip/file");
  const file = order.product === "blind-bag" ? order.blindFile : fileFor(order);
  if (!file) return res.status(404).send("Sản phẩm chưa được gắn file hoặc chưa random.");

  const full = findProductFile(file);
  if (!full) return res.status(404).send(`File sản phẩm không tồn tại trên máy chủ: ${file}`);

  res.download(full, file);
}

app.post("/api/orders/:id/randomize", (req, res) => {
  const user = currentUser(req);
  if (!user) return res.status(401).json({ error: "Vui lòng đăng nhập." });
  const orders = loadOrders();
  const order = orders.find(x => x.id === req.params.id);
  if (!order) return res.status(404).json({ error: "Không tìm thấy đơn" });
  if (order.userId !== user.id) return res.status(403).json({ error: "Bạn không có quyền thao tác đơn này." });
  if (order.product !== "blind-bag") return res.status(400).json({ error: "Đơn này không phải túi mù" });
  if (!order.paid) return res.status(403).json({ error: "Thanh toán chưa được xác nhận" });
  if (!order.blindFile) {
    const available = blindBagFiles.filter(name => findProductFile(name));
    if (!available.length) return res.status(404).json({ error: "Không có file để random" });
    order.blindFile = available[Math.floor(Math.random() * available.length)];
    saveOrders(orders);
  }
  res.json({ ok:true, orderId:order.id, file:order.blindFile });
});

app.get("/download/:id", sendOrderFile);
app.get("/api/orders/:id/download", sendOrderFile);

app.get("/api/orders/:id/file-status", (req, res) => {
  const order = loadOrders().find(x => x.id === req.params.id);
  if (!order) return res.status(404).json({ error: "Không tìm thấy đơn" });
  const file = fileFor(order);
  const full = file ? findProductFile(file) : null;
  res.json({ orderId: order.id, paid: Boolean(order.paid), file, exists: Boolean(full) });
});

app.use((err, req, res, next) => {
  console.error("EXPRESS_ERROR", err);
  if (res.headersSent) return next(err);
  res.status(500).json({ error: "Máy chủ gặp lỗi nội bộ.", build: BUILD_ID });
});

const server = app.listen(PORT, HOST, () => {
  console.log(`ShopVannĐaiiVIP listening on ${HOST}:${PORT}`);
  console.log(`Health check: http://${HOST}:${PORT}/health`);
});

server.on("error", (err) => {
  console.error("Server failed to start:", err);
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  console.error("Unhandled promise rejection:", err);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught exception:", err);
  process.exit(1);
});
