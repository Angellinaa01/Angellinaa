const DOC = "https://firestore.googleapis.com/v1/projects/angellinaa-1b01b/databases/(default)/documents/settings/shop?key=AIzaSyDcXv_-61vZZw3ot19BTawHi-qbbj5CNlQ";
const esc = s => String(s).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;");

export default async (req, context) => {
  const res = await context.next();
  if (!(res.headers.get("content-type") || "").includes("text/html")) return res;
  let html = await res.text();
  try {
    const r = await fetch(DOC);
    if (r.ok) {
      const d = await r.json(), f = d.fields || {};
      const g = k => (f[k] && f[k].stringValue) || "";
      const name = g("name"), desc = g("desc"), logo = g("favicon");
      if (name) {
        html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(name)}</title>`)
          .replace(/(property="og:title" content=")[^"]*/, `$1${esc(name)}`)
          .replace(/(property="og:site_name" content=")[^"]*/, `$1${esc(name)}`)
          .replace(/(property="og:image:alt" content=")[^"]*/, `$1${esc(name)}`);
      }
      if (desc) {
        html = html.replace(/(name="description" content=")[^"]*/, `$1${esc(desc)}`)
          .replace(/(property="og:description" content=")[^"]*/, `$1${esc(desc)}`);
      }
      if (logo) {
        const img = new URL("/og-image.png", req.url).href + "?t=" + encodeURIComponent(d.updateTime || "");
        html = html.replace(/(property="og:image" content=")[^"]*/, `$1${img}`)
          .replace(/(name="twitter:image" content=")[^"]*/, `$1${img}`);
      }
    }
  } catch (e) {}
  const h = new Headers(res.headers);
  h.delete("content-length");
  h.set("cache-control", "public, max-age=0, must-revalidate");
  return new Response(html, { status: res.status, headers: h });
};

export const config = { path: ["/", "/index.html"] };
