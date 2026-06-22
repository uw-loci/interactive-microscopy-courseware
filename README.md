# interactive-sites

Interactive, self-contained HTML teaching pages for microscopy, built by
[UW-LOCI](https://github.com/uw-loci) (Laboratory for Optical and Computational
Instrumentation, UW–Madison).

Each page is a **single offline-capable HTML file** — all images are base64-embedded, so a file
can be opened directly in a browser or served over the web. The audience is graduate biologists:
friendly explanations, clickable diagrams, and live canvas widgets.

## Pages

### Cleared-Tissue Light-Sheet (CTLSM)
- [`CTLSM_Microscope_Demo.html`](CTLSM_Microscope_Demo.html) — Interactive microscope: clickable photo map of the light-sheet beam path.
- [`CTLSM_Interactive.html`](CTLSM_Interactive.html) — Interactive companion with the core light-sheet concept widgets.
- [`CTLSM_BeamPlacement.html`](CTLSM_BeamPlacement.html) — Place the beam in the chamber: A–F knobs mapped to beam position.

### Polarized-Light Microscopy (PPM)
- [`PPM_Intro_Interactive.html`](PPM_Intro_Interactive.html) — Seeing the Invisible: interactive intro to PPM.
- [`LCPolScope_Birefringence.html`](LCPolScope_Birefringence.html) — LC-PolScope: polarization states & birefringence.

## Hosting

When GitHub Pages is enabled (serving from the default branch root), the landing page is
`index.html` and each page is reachable at `…/<filename>.html`.

## Adding a page

Drop the new self-contained `.html` file in the repo root and add a matching card to `index.html`
and a bullet to this README. Keep files self-contained (images embedded as `data:` URIs) so they
work both offline and when served.
