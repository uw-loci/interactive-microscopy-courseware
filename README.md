# interactive-sites

Interactive, self-contained HTML teaching pages for microscopy, built by
[UW-LOCI](https://github.com/uw-loci) (Laboratory for Optical and Computational
Instrumentation, UW–Madison).

Each page is a **single offline-capable HTML file** — all images are base64-embedded, so a file
can be opened directly in a browser or served over the web. The audience is graduate biologists:
friendly explanations, clickable diagrams, and live canvas widgets.

## Pages

Live site (GitHub Pages): **https://uw-loci.github.io/interactive-sites/**

### Cleared-Tissue Light-Sheet (CTLSM)
- [Interactive microscope — light-sheet overview](https://uw-loci.github.io/interactive-sites/CTLSM_Microscope_Demo.html) — clickable photo map of the light-sheet beam path. ([`CTLSM_Microscope_Demo.html`](CTLSM_Microscope_Demo.html))
- [Interactive companion](https://uw-loci.github.io/interactive-sites/CTLSM_Interactive.html) — the core light-sheet concept widgets. ([`CTLSM_Interactive.html`](CTLSM_Interactive.html))
- [Place the beam in the chamber](https://uw-loci.github.io/interactive-sites/CTLSM_BeamPlacement.html) — A–F knobs mapped to beam position. ([`CTLSM_BeamPlacement.html`](CTLSM_BeamPlacement.html))

### Polarized-Light Microscopy (PPM)
- [Seeing the Invisible — intro to PPM](https://uw-loci.github.io/interactive-sites/PPM_Intro_Interactive.html) — interactive introduction to polarized-light microscopy. ([`PPM_Intro_Interactive.html`](PPM_Intro_Interactive.html))
- [LC-PolScope — polarization states & birefringence](https://uw-loci.github.io/interactive-sites/LCPolScope_Birefringence.html) — explore polarization states and birefringence contrast. ([`LCPolScope_Birefringence.html`](LCPolScope_Birefringence.html))

## Hosting

Served by **GitHub Pages** from the root of the `main` branch: the landing page is `index.html`
and each page is reachable at `https://uw-loci.github.io/interactive-sites/<filename>.html`.
After a push, Pages rebuilds in ~1–2 min; hard-refresh (Ctrl+Shift+R) to bypass browser cache.

## Adding a page

Drop the new self-contained `.html` file in the repo root and add a matching card to `index.html`
and a bullet to this README. Keep files self-contained (images embedded as `data:` URIs) so they
work both offline and when served.
