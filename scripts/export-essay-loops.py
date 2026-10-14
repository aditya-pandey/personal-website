"""
Render the visual-essay scenes to MP4 + GIF loops, frame by frame.

Each scene is a pure function of time, exposed on window.__essayTimelines,
so frames are exact rather than screen recordings.

Usage (with the site running locally, e.g. `npm run dev`):
    pip install playwright && python3 scripts/export-essay-loops.py [base_url] [out_dir]
Requires ffmpeg on PATH.
"""
import asyncio, os, shutil, subprocess, sys
from playwright.async_api import async_playwright

BASE = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:3000"
OUT = sys.argv[2] if len(sys.argv) > 2 else "essay-loops"
URL = f"{BASE}/thoughts/trying-to-make-a-point"
FPS = 24
HOLD = 1.5  # seconds to rest on the final frame
SCENES = [
    ("01-point-to-line", "point-line"),
    ("02-line-to-square", "line-square"),
    ("03-square-to-cube", "square-cube"),
    ("04-sphere-through-flatland", "sphere-plane"),
    ("05-cube-to-tesseract", "tesseract"),
]


async def render():
    os.makedirs(OUT, exist_ok=True)
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={"width": 1280, "height": 1400}, device_scale_factor=1.25)
        await page.goto(URL, wait_until="networkidle")
        await page.wait_for_timeout(800)
        for name, sid in SCENES:
            frames = os.path.join(OUT, f".frames-{name}")
            shutil.rmtree(frames, ignore_errors=True)
            os.makedirs(frames)
            await page.evaluate(
                "id => { const s = document.querySelector(`svg[data-stage='${id}']`); window.scrollTo(0, s.getBoundingClientRect().top + scrollY - 200); }",
                sid,
            )
            await page.wait_for_timeout(700)
            duration = await page.evaluate("id => window.__essayTimelines[id].duration", sid)
            stage = page.locator(f"svg[data-stage='{sid}']")
            n = int(round(duration * FPS))
            for i in range(n + 1):
                await page.evaluate("([id, t]) => window.__essayTimelines[id].seek(t)", [sid, min(duration, i / FPS)])
                await page.evaluate("() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)))")
                await stage.screenshot(path=os.path.join(frames, f"{i:05d}.png"))
            print(f"{name}: {n + 1} frames")
        await browser.close()


def encode():
    for name, _ in SCENES:
        frames = os.path.join(OUT, f".frames-{name}")
        src = ["-framerate", str(FPS), "-i", os.path.join(frames, "%05d.png")]
        hold = f"tpad=stop_mode=clone:stop_duration={HOLD}"
        subprocess.run(
            ["ffmpeg", "-v", "error", "-y", *src, "-vf", f"{hold},scale=1280:-2:flags=lanczos,format=yuv420p",
             "-c:v", "libx264", "-preset", "slow", "-crf", "20", "-movflags", "+faststart", os.path.join(OUT, f"{name}.mp4")],
            check=True,
        )
        subprocess.run(
            ["ffmpeg", "-v", "error", "-y", *src, "-vf",
             f"{hold},fps=15,scale=640:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=64:stats_mode=diff[p];[b][p]paletteuse=dither=bayer:bayer_scale=4:diff_mode=rectangle",
             "-loop", "0", os.path.join(OUT, f"{name}.gif")],
            check=True,
        )
        shutil.rmtree(frames, ignore_errors=True)
        print("encoded", name)


if __name__ == "__main__":
    asyncio.run(render())
    encode()
