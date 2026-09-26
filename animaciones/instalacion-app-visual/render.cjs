/* ============================================================
   Pasa index.html a video: abre la página con ?render en un Chromium
   sin ventana, la lleva a cada instante con window.render(t), le saca
   una captura por cuadro y se las da a ffmpeg.

     node render.cjs                      → instalacion-app-visual.mp4
     node render.cjs --fps 60 --out x.mp4

   Hace falta Playwright (npm i -g playwright) y un ffmpeg con libx264:
   el del sistema, o el que indique la variable FFMPEG.
   ============================================================ */

const path = require("path");
const { spawn, execSync } = require("child_process");

function cargarPlaywright() {
  try {
    return require("playwright");
  } catch {
    const global = execSync("npm root -g").toString().trim();
    return require(path.join(global, "playwright"));
  }
}

const args = process.argv.slice(2);
const opcion = (nombre, porDefecto) => {
  const i = args.indexOf(`--${nombre}`);
  return i >= 0 ? args[i + 1] : porDefecto;
};
const FPS = Number(opcion("fps", 30));
const SALIDA = path.resolve(__dirname, opcion("out", "instalacion-app-visual.mp4"));
const FFMPEG = process.env.FFMPEG || "ffmpeg";

(async () => {
  const { chromium } = cargarPlaywright();
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1080 } });
  await page.goto("file://" + path.join(__dirname, "index.html") + "?render");
  await page.evaluate(async () => {
    await document.fonts.load('500 80px "DM Sans"');
    await document.fonts.ready;
  });

  const duracion = await page.evaluate(() => window.DURACION);
  const cuadros = Math.round(duracion * FPS);

  const ff = spawn(FFMPEG, [
    "-y", "-loglevel", "error",
    "-f", "image2pipe", "-framerate", String(FPS), "-i", "-",
    "-c:v", "libx264", "-preset", "slow", "-crf", "18",
    "-pix_fmt", "yuv420p", "-movflags", "+faststart",
    SALIDA,
  ], { stdio: ["pipe", "inherit", "inherit"] });
  const termino = new Promise((ok, mal) =>
    ff.on("close", code => (code === 0 ? ok() : mal(new Error(`ffmpeg salió con ${code}`)))));

  for (let i = 0; i < cuadros; i++) {
    await page.evaluate(t => window.render(t), i / FPS);
    const png = await page.screenshot({ type: "png" });
    if (!ff.stdin.write(png)) await new Promise(r => ff.stdin.once("drain", r));
    if (i % FPS === 0) process.stdout.write(`\r${i}/${cuadros} cuadros`);
  }
  ff.stdin.end();
  await termino;
  await browser.close();
  console.log(`\r${cuadros}/${cuadros} cuadros → ${path.relative(process.cwd(), SALIDA)}`);
})().catch(err => {
  console.error(err);
  process.exit(1);
});
