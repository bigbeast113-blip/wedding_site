"""
One-shot refresh of the engagement gallery from the private Google Drive folder.

Run:  python refresh_engagement.py

What it does (and why it's built this way):
  - gdown can't bulk-download this folder (Windows rejects the ':' in the app's
    "Name • 2026-03-25 21:34" folder names, and Drive rate-limits folder pulls).
    BUT gdown still PRINTS the full file listing (ids + names) before it errors,
    and Google's *thumbnail* endpoint serves the images WITHOUT throttling.
  - So we: (1) enumerate via gdown to capture every file id, (2) download each
    image through the thumbnail CDN at high res, (3) optimize to WebP, (4) embed
    videos via Drive's player, (5) regenerate content/guestbook.ts + the zip.

Notes: photos + videos + per-person submission date/time are captured. The
.txt notes are best-effort (Drive throttles that endpoint).
"""
import os, re, sys, json, time, zipfile, subprocess
from datetime import datetime
import requests
from PIL import Image, ImageOps

ROOT = r"c:\Users\TWK463\Documents\WeddingSite"
FOLDER_ID = "1QkbRCnbXH96YpgzthRv5GkTfTT62fcVf"
URL = f"https://drive.google.com/drive/folders/{FOLDER_ID}"
ALBUM = os.path.join(ROOT, "_album")
GAL = os.path.join(ROOT, "public", "photos", "gallery")
TS = os.path.join(ROOT, "content", "guestbook.ts")

# 1 — enumerate the folder (gdown prints the tree, then errors; we only need the print)
print("Enumerating Drive folder...")
proc = subprocess.run(
    [sys.executable, "-m", "gdown", "--folder", URL, "-O", os.path.join(ALBUM, "_tmp")],
    capture_output=True, text=True, encoding="utf-8", errors="replace",
)
log = (proc.stdout or "") + "\n" + (proc.stderr or "")

folder_re = re.compile(r"Retrieving folder (\S+) (.+)")
file_re = re.compile(r"Processing file (\S+) (.+)")
date_re = re.compile(r"(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2})")

groups, order, current = {}, [], None
for line in log.splitlines():
    m = folder_re.search(line)
    if m:
        current = m.group(1)
        if current not in groups:
            groups[current] = {"raw": m.group(2).strip(), "files": []}
            order.append(current)
        continue
    m = file_re.search(line)
    if m and current:
        groups[current]["files"].append((m.group(1), m.group(2).strip()))

if not order:
    print("!! Could not enumerate the folder. Is it shared 'Anyone with the link'?")
    print(log[-1500:])
    sys.exit(1)

def label_of(raw):
    return re.split(r"\s*[•�]\s*|\s+\d{4}-\d{2}-\d{2}", raw)[0].strip() or "Guest"

def stamp_of(raw):
    d = date_re.search(raw)
    if not d:
        return None
    y, mo, da, hh, mm = map(int, d.groups())
    return datetime(y, mo, da, hh, mm)

def fmt(dt):
    if not dt:
        return ""
    h = dt.hour % 12 or 12
    ap = "AM" if dt.hour < 12 else "PM"
    return dt.strftime("%B ") + str(dt.day) + dt.strftime(", %Y") + f" · {h}:{dt.minute:02d} {ap}"

def slug(s, i):
    return (re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-") or "guest") + f"-{i}"

# 2/3 — download images via thumbnail CDN, optimize to WebP; collect videos + notes
sess = requests.Session()
entries = []
for i, fid in enumerate(order):
    g = groups[fid]
    label, dt = label_of(g["raw"]), stamp_of(g["raw"])
    sl = slug(label, i)
    dest = os.path.join(GAL, sl)
    photos, videos, note = [], [], ""
    for fileid, name in g["files"]:
        low = name.lower()
        if low.endswith((".jpg", ".jpeg", ".png")):
            try:
                r = sess.get(f"https://drive.google.com/thumbnail?id={fileid}&sz=w2000", timeout=40)
                if r.status_code == 200 and r.content[:3] == b"\xff\xd8\xff":
                    os.makedirs(dest, exist_ok=True)
                    im = ImageOps.exif_transpose(Image.open(__import__("io").BytesIO(r.content))).convert("RGB")
                    im.thumbnail((1600, 1600))
                    stem = os.path.splitext(name)[0]
                    im.save(os.path.join(dest, stem + ".webp"), "WEBP", quality=82, method=6)
                    photos.append(f"/photos/gallery/{sl}/{stem}.webp")
            except Exception as ex:
                print("  photo err", name, ex)
            time.sleep(0.12)
        elif low.endswith((".mp4", ".mov", ".webm")):
            videos.append(fileid)
        elif low.endswith(".txt"):
            # .txt comes back as application/octet-stream; accept it and pull the
            # "Message:" field out of the app's Guest/Date/Message format.
            for host in (f"https://drive.usercontent.google.com/download?id={fileid}&export=download",
                         f"https://drive.google.com/uc?export=download&id={fileid}"):
                try:
                    r = sess.get(host, timeout=25)
                    if r.status_code == 200 and len(r.content) < 20000 and b"<html" not in r.content[:200].lower():
                        mm = re.search(r"Message:\s*(.*)", r.text, re.S)
                        note = (mm.group(1).strip() if mm else r.text.strip())
                        break
                except Exception:
                    pass
    if photos or videos:
        entries.append({"name": label, "date": fmt(dt),
                        "stamp": dt.strftime("%Y·%m·%d %H:%M") if dt else "",
                        "note": note, "photos": photos, "videos": videos})
    print(f"{label:22s} photos={len(photos)} videos={len(videos)} note={'Y' if note else '-'}")

# 4 — zip all photos (unique per-person folders)
zip_path = os.path.join(GAL, "engagement-photos.zip")
with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as z:
    for i, e in enumerate(entries):
        for p in e["photos"]:
            fp = os.path.join(ROOT, "public", p.lstrip("/").replace("/", os.sep))
            if os.path.exists(fp):
                z.write(fp, arcname=f"{i+1:02d}-{e['name']}/{os.path.basename(fp)}")

# 5 — regenerate content/guestbook.ts
ts = (
    "// Auto-generated by refresh_engagement.py from the Drive album.\n"
    "export type GuestbookEntry = {\n  name: string;\n  date: string;\n  stamp: string;\n"
    "  note: string;\n  photos: string[];\n  videos: string[];\n};\n\n"
    "export const guestbook: GuestbookEntry[] = " + json.dumps(entries, indent=2) + ";\n\n"
    'export const guestbookZip = "/photos/gallery/engagement-photos.zip";\n'
)
open(TS, "w", encoding="utf-8").write(ts)
print(f"\nDONE — {len(entries)} entries, "
      f"{sum(len(e['photos']) for e in entries)} photos, "
      f"{sum(len(e['videos']) for e in entries)} videos, zip {round(os.path.getsize(zip_path)/1024)}KB")
