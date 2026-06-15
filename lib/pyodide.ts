// Loads Pyodide once and reuses it. Pyodide is Python compiled to
// WebAssembly — it runs entirely in the browser, no server needed.

let pyodideInstance: any = null;
let loadingPromise: Promise<any> | null = null;

declare global {
  interface Window {
    loadPyodide: any;
  }
}

const PYODIDE_VERSION = "0.26.4";
const PYODIDE_CDN = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;

// Inject the Pyodide loader script from the CDN, once.
function loadScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.loadPyodide) return resolve();
    const script = document.createElement("script");
    script.src = `${PYODIDE_CDN}pyodide.js`;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Pyodide script"));
    document.head.appendChild(script);
  });
}

// Returns a ready-to-use Pyodide instance, loading it only on first call.
export async function getPyodide(): Promise<any> {
  if (pyodideInstance) return pyodideInstance;
  if (loadingPromise) return loadingPromise;

  loadingPromise = (async () => {
    await loadScript();
    pyodideInstance = await window.loadPyodide({ indexURL: PYODIDE_CDN });
    return pyodideInstance;
  })();

  return loadingPromise;
}

// Runs Python source, capturing everything printed to stdout/stderr.
// Runs Python source, capturing everything printed to stdout/stderr.
// Auto-loads any packages the code imports (numpy, pandas, scikit-learn, ...).
export async function runPython(
  code: string
): Promise<{ stdout: string; error: string | null }> {
  const pyodide = await getPyodide();

  // Scan the code for imports and load matching Pyodide packages.
  try {
    await pyodide.loadPackagesFromImports(code);
  } catch {
    // If a package can't be auto-loaded, let the run proceed and surface
    // the real error from execution below.
  }

  // Redirect Python's stdout/stderr into a buffer we can read back.
  pyodide.runPython(`
import sys, io
sys.stdout = io.StringIO()
sys.stderr = io.StringIO()
`);

  let error: string | null = null;
  try {
    await pyodide.runPythonAsync(code);
  } catch (e: any) {
    error = e.message;
  }

  const stdout = pyodide.runPython("sys.stdout.getvalue()");
  const stderr = pyodide.runPython("sys.stderr.getvalue()");

  return { stdout: stdout + stderr, error };
}
