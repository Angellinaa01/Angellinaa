const DOC = "https://firestore.googleapis.com/v1/projects/angellinaa-1b01b/databases/(default)/documents/settings/shop?key=AIzaSyDcXv_-61vZZw3ot19BTawHi-qbbj5CNlQ";

export default async (req) => {
  try {
    const r = await fetch(DOC);
    if (r.ok) {
      const f = (await r.json()).fields || {};
      const logo = (f.favicon && f.favicon.stringValue) || "";
      const m = logo.match(/^data:(image\/[\w+.-]+);base64,(.+)$/);
      if (m) {
        const bin = atob(m[2]), buf = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i);
        return new Response(buf, { headers: { "content-type": m[1], "cache-control": "public, max-age=300" } });
      }
      if (/^https?:\/\//.test(logo)) return Response.redirect(logo, 302);
    }
  } catch (e) {}
  return new Response("no logo", { status: 404 });
};

export const config = { path: "/og-image.png" };
