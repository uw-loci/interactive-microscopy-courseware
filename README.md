# interactive-microscopy-courseware

Interactive, self-contained HTML teaching pages for microscopy, built by
[UW-LOCI](https://github.com/uw-loci) (Laboratory for Optical and Computational
Instrumentation, UW–Madison).

Each page is a **single offline-capable HTML file** — all images are base64-embedded, so a file
can be opened directly in a browser or served over the web. The audience is graduate biologists:
friendly explanations, clickable diagrams, and live canvas widgets.

## Pages

Live site (GitHub Pages): **https://uw-loci.github.io/interactive-microscopy-courseware/**

### Cleared-Tissue Light-Sheet (CTLSM)
- [Learn about Cleared Tissue Light Sheet 1 - Low Res](https://uw-loci.github.io/interactive-microscopy-courseware/CTLSM_Microscope_Demo.html) — clickable photo map of the light-sheet beam path. ([`CTLSM_Microscope_Demo.html`](CTLSM_Microscope_Demo.html))
- [Learn about Cleared Tissue Light Sheet 2 - High Res](https://uw-loci.github.io/interactive-microscopy-courseware/CTLSM2_Microscope_Demo.html) — high-resolution photo tour, from the full bench into each detailed view (in progress). ([`CTLSM2_Microscope_Demo.html`](CTLSM2_Microscope_Demo.html))
- [Light Sheet Concepts - Interactive](https://uw-loci.github.io/interactive-microscopy-courseware/CTLSM_Interactive.html) — the core light-sheet concept widgets. ([`CTLSM_Interactive.html`](CTLSM_Interactive.html))
- [Light Sheet Alignment Simulation](https://uw-loci.github.io/interactive-microscopy-courseware/CTLSM_BeamPlacement.html) — A–F knobs mapped to beam position; a simplified teaching simulation (real alignment is more involved). ([`CTLSM_BeamPlacement.html`](CTLSM_BeamPlacement.html))
- [Literature review](https://uw-loci.github.io/interactive-microscopy-courseware/CTLSM_Literature_Review.html) — a concise review: principles, tissue clearing, whole-organ imaging, and key references. ([`CTLSM_Literature_Review.html`](CTLSM_Literature_Review.html))

### Polarized-Light Microscopy (PPM)
- [Seeing the Invisible — intro to PPM](https://uw-loci.github.io/interactive-microscopy-courseware/PPM_Intro_Interactive.html) — interactive introduction to polarized-light microscopy. ([`PPM_Intro_Interactive.html`](PPM_Intro_Interactive.html))
- [LC-PolScope — polarization states & birefringence](https://uw-loci.github.io/interactive-microscopy-courseware/LCPolScope_Birefringence.html) — explore polarization states and birefringence contrast. ([`LCPolScope_Birefringence.html`](LCPolScope_Birefringence.html))
- [LC-PolScope — concept interactives](https://uw-loci.github.io/interactive-microscopy-courseware/LCPolScope_Concepts.html) — reading birefringence with polarized light, six core ideas as small interactives. ([`LCPolScope_Concepts.html`](LCPolScope_Concepts.html))
- [LC-PolScope-simulator and usage guide](https://uw-loci.github.io/interactive-microscopy-courseware/lc-polscope/)

## Hosting

Served by **GitHub Pages** from the root of the `main` branch: the landing page is `index.html`
and each page is reachable at `https://uw-loci.github.io/interactive-microscopy-courseware/<filename>.html`.
After a push, Pages rebuilds in ~1–2 min; hard-refresh (Ctrl+Shift+R) to bypass browser cache.

## Adding a page

Drop the new self-contained `.html` file in the repo root and add a matching card to `index.html`
and a bullet to this README. Keep files self-contained (images embedded as `data:` URIs) so they
work both offline and when served.
