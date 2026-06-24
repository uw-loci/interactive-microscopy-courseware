// LC-PolScope Interactive Tutorial JS Engine
function runEngine() {
    // -------------------------------------------------------------
    // Tab Navigation
    // -------------------------------------------------------------
    const navItems = document.querySelectorAll(".nav-item");
    const tabPanes = document.querySelectorAll(".tab-pane");

    navItems.forEach(item => {
        item.addEventListener("click", () => {
            const tabId = item.getAttribute("data-tab");
            
            navItems.forEach(nav => nav.classList.remove("active"));
            tabPanes.forEach(pane => pane.classList.remove("active"));
            
            item.classList.add("active");
            document.getElementById(tabId).classList.add("active");
            
            // Re-render when switching to simulator tab to ensure canvases size is right
            if (tabId === "tab-simulator") {
                initSimulator();
            }
        });
    });

    // -------------------------------------------------------------
    // Slides Navigation Content
    // -------------------------------------------------------------
    const slides = [
        {
            step: "Step 1 of 8",
            title: "Optical Alignment & Monochromatization",
            body: `Before acquiring polarization data, align the microscope's optical path under brightfield illumination. 
            <ul>
                <li>Ensure the light source is centered and the field/condenser diaphragms are adjusted according to Koehler illumination.</li>
                <li>Insert the green interference filter (central wavelength \\(\\lambda = 546\\text{ nm}\\)) into the light path. LC variable retarders and quarter-wave plates are highly wavelength-sensitive; using monochromatic green light is essential for accurate retardance calibration.</li>
                <li>Ensure the objective and condenser are strain-free (no plastic components or squeezed lenses in the light path).</li>
            </ul>`,
            illustration: "alignment"
        },
        {
            step: "Step 2 of 8",
            title: "Universal Compensator Installation",
            body: `Mount the liquid crystal universal compensator and circular analyzer.
            <ul>
                <li>Insert the <strong>Universal Compensator</strong> (containing a linear polarizer at \\(45^\\circ\\) and two liquid crystal variable retarders, LC-A at \\(0^\\circ\\) and LC-B at \\(45^\\circ\\)) into the condenser slot or light path before the specimen.</li>
                <li>Insert the <strong>Circular Analyzer</strong> (containing a quarter-wave plate at \\(45^\\circ\\) and a linear polarizer at \\(135^\\circ\\)) in the light path after the specimen (e.g. in the slider slot below the binocular head).</li>
                <li>Make sure the circular analyzer is oriented correctly (right side up) so it transmits circular polarization of opposite handedness to the compensator's nominal output.</li>
            </ul>`,
            illustration: "compensator"
        },
        {
            step: "Step 3 of 8",
            title: "Calibration & Extinction (Setting 1)",
            body: `Calibrate the liquid crystals to establish the dark extinction state.
            <ul>
                <li>Move the specimen stage to a <strong>clear, specimen-free area</strong> of the slide.</li>
                <li>Using the acquisition software, initiate the calibration. The software will systematically vary the voltages of LC-A and LC-B around their nominal values (retardance of \\(\\lambda/4\\) and \\(\\lambda/2\\) respectively).</li>
                <li>The system monitors the average camera intensity in a central Region of Interest (ROI) and locks the voltages at the absolute intensity minimum. This is <strong>Setting 1 (Extinction)</strong>, where the compensator output matches the circular analyzer's blocking handedness.</li>
            </ul>`,
            illustration: "calibration"
        },
        {
            step: "Step 4 of 8",
            title: "Setting the Retardance Swing (Settings 2-5)",
            body: `Set the swing parameter to introduce elliptical polarization bias.
            <ul>
                <li>Choose a <strong>Swing Retardance</strong> (\\(\\chi\\)) value based on your sample. For low-retardance biological samples like living cells or fine collagen fibers, set the swing to \\(0.03 \\lambda\\) (\\(\\approx 16.4\\text{ nm}\\)).</li>
                <li>The system calculates the four additional retardance pairs by adding and subtracting the swing retardance from the extinction values:
                    <br>&bull; <strong>Setting 2</strong>: Extinction A \\(+\\chi\\), Extinction B
                    <br>&bull; <strong>Setting 3</strong>: Extinction A, Extinction B \\(+\\chi\\)
                    <br>&bull; <strong>Setting 4</strong>: Extinction A, Extinction B \\(-\\chi\\)
                    <br>&bull; <strong>Setting 5</strong>: Extinction A \\(-\\chi\\), Extinction B
                </li>
                <li>The software slightly adjusts these voltages so that the clear-area intensities of Settings 2-5 are exactly equal to a reference intensity (\\(I_{\\text{ref}}\\)).</li>
            </ul>`,
            illustration: "swing"
        },
        {
            step: "Step 5 of 8",
            title: "Acquiring the Background Reference Stack",
            body: `Record a background stack to eliminate lens strain and dust artifacts.
            <ul>
                <li>With the clear, specimen-free area in view, record a stack of five raw images using Settings 1–5.</li>
                <li><strong>Defocus the objective slightly</strong> (by \\(10\\text{--}20\\ \\mu\\text{m}\\)) during this step. This prevents dust particles on the slide/coverslip surfaces from appearing in the background reference stack, which would otherwise introduce artificial negative spots in the final corrected image.</li>
                <li>Use <strong>frame averaging</strong> (e.g., 4 or 8 frames) to reduce camera read noise in the background stack, ensuring a high-quality subtraction template.</li>
            </ul>`,
            illustration: "background"
        },
        {
            step: "Step 6 of 8",
            title: "Specimen Image Acquisition & Correction",
            body: `Acquire the specimen stack and run the quantitative reconstruction.
            <ul>
                <li>Move the specimen (e.g. collagen stroma or living cell) back into the field of view.</li>
                <li>Acquire five raw images (\\(I_1\\) to \\(I_5\\)) corresponding to Settings 1–5.</li>
                <li>The software calculates the raw coefficients \\(A_{\\text{raw}}\\) and \\(B_{\\text{raw}}\\) for each pixel, then <strong>subtracts the background coefficients</strong> \\(A_{\\text{bg}}\\) and \\(B_{\\text{bg}}\\) recorded in the background stack:
                    <br>&bull; \\(A_{\\text{corrected}} = A_{\\text{raw}} - A_{\\text{bg}}\\)
                    <br>&bull; \\(B_{\\text{corrected}} = B_{\\text{raw}} - B_{\\text{bg}}\\)
                </li>
                <li>Finally, the corrected retardance and slow-axis orientation maps are computed and rendered. The specimen appears bright against a uniform, dark, flat background with random azimuth noise.</li>
            </ul>`,
            illustration: "correction"
        },
        {
            step: "Step 7 of 8",
            title: "Theory: Jones Calculus Model & Mueller Matrix Link",
            body: `Understand the electromagnetic models used to describe light propagation.
            <ul>
                <li><strong>Jones Calculus Model:</strong> Operates on complex electric field amplitudes: \\(\\mathbf{E} = \\begin{pmatrix} E_x \\\\ E_y \\end{pmatrix}\\). It is used to simulate the LC-PolScope compensator because the monochromatic light is fully polarized and coherent. The specimen retarder is modeled by the Jones Matrix:
                    <br>\\(\\mathbf{J}_{\\text{spec}} = \\begin{pmatrix} \\cos\\frac{\\delta}{2} + i\\sin\\frac{\\delta}{2}\\cos 2\\phi & i\\sin\\frac{\\delta}{2}\\sin 2\\phi \\\\ i\\sin\\frac{\\delta}{2}\\sin 2\\phi & \\cos\\frac{\\delta}{2} - i\\sin\\frac{\\delta}{2}\\cos 2\\phi \\end{pmatrix}\\)
                </li>
                <li><strong>Mueller Matrix Relationship:</strong> While Jones Calculus tracks optical phase, **Mueller Calculus** maps raw intensity and handles partially polarized/depolarized light using Stokes vectors: \\(\\mathbf{S} = (I, Q, U, V)^T\\).</li>
                <li>A Jones matrix \\(\\mathbf{J}\\) can be transformed into a Mueller matrix \\(\\mathbf{M}\\) using the transformation:
                    <br>\\(\\mathbf{M} = \\mathbf{A} (\\mathbf{J} \\otimes \\mathbf{J}^*) \\mathbf{A}^{-1}\\), where \\(\\otimes\\) represents the Kronecker tensor product, and \\(\\mathbf{A}\\) is a change-of-basis matrix mapping field correlations to intensities. Jones calculus is a subset of Mueller calculus, restricted to non-depolarizing systems.
                </li>
            </ul>`,
            illustration: "jones"
        },
        {
            step: "Step 8 of 8",
            title: "Theory: 4-Frame vs. 5-Frame Algorithms Comparison",
            body: `Compare the mathematical formulations and trade-offs of the demodulation schemes.
            <ul>
                <li><strong>4-Frame Algorithm:</strong> Employs a first-order Taylor approximation assuming specimen retardance is very small (\\(R \\ll \\chi \\approx 16\\text{ nm}\\)). This introduces a severe underestimation of retardance and angle distortion for thick collagen bundles (\\(R > 20\\text{ nm}\\)).</li>
                <li><strong>Symmetric 5-Frame Algorithm:</strong> Utilizes a symmetric swing (\\(+\\chi\\) and \\(-\\chi\\) on LC-A). The symmetric difference cancels out the non-linear retardance \\(\\cos\\delta\\) terms. It is **mathematically exact** up to a retardance of \\(\\lambda/2\\) (\\(\\approx 273\\text{ nm}\\)).</li>
                <li><strong>Drift and Noise Immunity:</strong> The 5-frame algorithm cancels out linear changes in light source intensity, LCVR temperature shifts, and camera gain drifts, maintaining a much flatter and noise-free black background in the stroma.</li>
            </ul>`,
            illustration: "comparison"
        }
    ];

    let currentSlideIndex = 0;
    const slideItem = document.getElementById("slide-item");
    const btnPrevSlide = document.getElementById("btn-prev-slide");
    const btnNextSlide = document.getElementById("btn-next-slide");
    const slideProgressBar = document.getElementById("slide-progress-bar");
    const slideNumIndicator = document.getElementById("slide-number-indicator");

    function renderSlide(index) {
        const s = slides[index];
        slideItem.style.animation = 'none';
        slideItem.offsetHeight; // trigger reflow
        slideItem.style.animation = null;

        slideItem.querySelector(".slide-step-num").textContent = s.step;
        slideItem.querySelector(".slide-title").textContent = s.title;
        slideItem.querySelector(".slide-body").innerHTML = s.body;
        
        // Render slide SVG illustration
        const illustContainer = slideItem.querySelector(".slide-illustration");
        illustContainer.innerHTML = getSlideIllustration(s.illustration);

        // Update progress bar
        const progressPercent = ((index + 1) / slides.length) * 100;
        slideProgressBar.style.width = `${progressPercent}%`;
        slideNumIndicator.textContent = `Slide ${index + 1} of ${slides.length}`;

        // Disable buttons if at boundaries
        btnPrevSlide.disabled = index === 0;
        btnNextSlide.disabled = index === slides.length - 1;
        
        btnPrevSlide.style.opacity = index === 0 ? "0.3" : "1";
        btnNextSlide.style.opacity = index === slides.length - 1 ? "0.3" : "1";

        // Trigger MathJax typeset to render LaTeX formulas dynamically
        if (window.MathJax && window.MathJax.typesetPromise) {
            window.MathJax.typesetPromise([slideItem]).catch(err => console.error("MathJax typesetting failed: ", err));
        }
    }

    btnPrevSlide.addEventListener("click", () => {
        if (currentSlideIndex > 0) {
            currentSlideIndex--;
            renderSlide(currentSlideIndex);
        }
    });

    btnNextSlide.addEventListener("click", () => {
        if (currentSlideIndex < slides.length - 1) {
            currentSlideIndex++;
            renderSlide(currentSlideIndex);
        }
    });

    // Generate beautiful clean SVG animations for laboratory slides
    function getSlideIllustration(type) {
        const svgHeader = `<svg viewBox="0 0 600 120" width="100%" height="120" style="display:block;">`;
        const svgFooter = `</svg>`;
        
        if (type === "alignment") {
            return svgHeader + `
                <!-- Light source -->
                <circle cx="50" cy="60" r="15" fill="#f59e0b" filter="drop-shadow(0 0 10px rgba(245,158,11,0.6))"/>
                <text x="50" y="95" fill="#64748b" font-size="10" text-anchor="middle" font-family="sans-serif">Halogen/LED</text>
                
                <!-- Green Filter -->
                <rect x="150" y="40" width="20" height="40" rx="4" fill="#10b981" fill-opacity="0.2" stroke="#10b981" stroke-width="2"/>
                <line x1="160" y1="30" x2="160" y2="90" stroke="#10b981" stroke-dasharray="3" stroke-width="1"/>
                <text x="160" y="95" fill="#10b981" font-size="10" text-anchor="middle" font-family="sans-serif">546nm Filter</text>
                
                <!-- Light Beam -->
                <path d="M 65 60 Q 110 60 150 60" stroke="#f59e0b" stroke-width="6" fill="none" opacity="0.3"/>
                <path d="M 170 60 L 320 60" stroke="#10b981" stroke-width="6" fill="none" opacity="0.8"/>
                <path d="M 320 60 L 550 60" stroke="#10b981" stroke-width="6" stroke-dasharray="5" fill="none" opacity="0.8"/>
                
                <!-- Lenses -->
                <path d="M 320 30 Q 340 60 320 90 Q 300 60 320 30 Z" fill="#60a5fa" fill-opacity="0.3" stroke="#60a5fa" stroke-width="2"/>
                <text x="320" y="105" fill="#64748b" font-size="10" text-anchor="middle" font-family="sans-serif">Condenser Lens</text>
                
                <path d="M 450 30 Q 470 60 450 90 Q 430 60 450 30 Z" fill="#60a5fa" fill-opacity="0.3" stroke="#60a5fa" stroke-width="2"/>
                <text x="450" y="105" fill="#64748b" font-size="10" text-anchor="middle" font-family="sans-serif">Objective Lens</text>
                
                <circle cx="530" cy="60" r="10" fill="none" stroke="#64748b" stroke-width="2"/>
                <path d="M 525 60 C 525 50 535 50 535 60" stroke="#64748b" stroke-width="2" fill="none"/>
                <text x="530" y="95" fill="#64748b" font-size="10" text-anchor="middle" font-family="sans-serif">Camera</text>
            ` + svgFooter;
        } else if (type === "compensator") {
            return svgHeader + `
                <!-- Optical Path with items mounted -->
                <path d="M 30 60 L 570 60" stroke="#10b981" stroke-width="4" opacity="0.7"/>
                
                <!-- Linear Polarizer -->
                <rect x="100" y="35" width="15" height="50" rx="3" fill="#4f46e5" fill-opacity="0.2" stroke="#4f46e5" stroke-width="2"/>
                <line x1="100" y1="40" x2="115" y2="80" stroke="#4f46e5" stroke-width="2"/>
                <text x="108" y="100" fill="#6366f1" font-size="9" text-anchor="middle" font-family="sans-serif">Polarizer 45°</text>
                
                <!-- LC-A -->
                <rect x="180" y="35" width="20" height="50" rx="3" fill="#06b6d4" fill-opacity="0.2" stroke="#06b6d4" stroke-width="2"/>
                <line x1="190" y1="35" x2="190" y2="85" stroke="#06b6d4" stroke-width="2" stroke-dasharray="2"/>
                <text x="190" y="100" fill="#06b6d4" font-size="9" text-anchor="middle" font-family="sans-serif">LC-A (0°)</text>
                
                <!-- LC-B -->
                <rect x="250" y="35" width="20" height="50" rx="3" fill="#06b6d4" fill-opacity="0.2" stroke="#06b6d4" stroke-width="2"/>
                <line x1="250" y1="45" x2="270" y2="75" stroke="#06b6d4" stroke-width="2" stroke-dasharray="2"/>
                <text x="260" y="100" fill="#06b6d4" font-size="9" text-anchor="middle" font-family="sans-serif">LC-B (45°)</text>
                
                <!-- Specimen -->
                <rect x="340" y="45" width="10" height="30" fill="#f59e0b" stroke="#f59e0b" stroke-width="1"/>
                <text x="345" y="100" fill="#f59e0b" font-size="9" text-anchor="middle" font-family="sans-serif">Specimen</text>
                
                <!-- Circular Analyzer (QWP + Polarizer) -->
                <rect x="420" y="35" width="30" height="50" rx="3" fill="#d946ef" fill-opacity="0.2" stroke="#d946ef" stroke-width="2"/>
                <text x="435" y="100" fill="#d946ef" font-size="9" text-anchor="middle" font-family="sans-serif">Circular Analyzer</text>
            ` + svgFooter;
        } else if (type === "calibration") {
            return svgHeader + `
                <!-- Slider Animation -->
                <line x1="100" y1="60" x2="500" y2="60" stroke="#334155" stroke-width="4" stroke-linecap="round"/>
                <circle cx="230" cy="60" r="10" fill="#06b6d4" filter="drop-shadow(0 0 8px var(--cyan-glow))"/>
                <path d="M 230 40 L 230 80" stroke="#06b6d4" stroke-width="2"/>
                <text x="230" y="30" fill="#06b6d4" font-size="10" text-anchor="middle" font-family="sans-serif">Search LC Voltage</text>
                
                <!-- Camera view illustrating search of extinction -->
                <rect x="480" y="25" width="80" height="70" rx="6" fill="#000" stroke="#334155" stroke-width="2"/>
                <!-- Glow circle shrinking to zero to represent extinction -->
                <circle cx="520" cy="60" r="8" fill="#10b981" opacity="0.3" filter="drop-shadow(0 0 8px #10b981)"/>
                <circle cx="520" cy="60" r="2" fill="#ffffff"/>
                <text x="520" y="110" fill="#10b981" font-size="9" text-anchor="middle" font-family="sans-serif">Extinction Min</text>
            ` + svgFooter;
        } else if (type === "swing") {
            return svgHeader + `
                <!-- Circular to elliptical state transition -->
                <text x="50" y="20" fill="#64748b" font-size="9" text-anchor="middle" font-family="sans-serif">Extinction (Circular)</text>
                <circle cx="50" cy="60" r="20" fill="none" stroke="#6366f1" stroke-width="2"/>
                
                <text x="150" y="60" fill="#94a3b8" font-size="16" text-anchor="middle">&rarr;</text>
                
                <text x="250" y="20" fill="#64748b" font-size="9" text-anchor="middle" font-family="sans-serif">Setting 2 (+&chi; on A)</text>
                <ellipse cx="250" cy="60" rx="20" ry="12" fill="none" stroke="#06b6d4" stroke-width="2"/>
                <line x1="230" y1="60" x2="270" y2="60" stroke="#06b6d4" stroke-dasharray="2"/>
                
                <text x="350" y="20" fill="#64748b" font-size="9" text-anchor="middle" font-family="sans-serif">Setting 3 (+&chi; on B)</text>
                <!-- Rotated ellipse 45 deg -->
                <g transform="translate(350, 60) rotate(45)">
                    <ellipse cx="0" cy="0" rx="20" ry="12" fill="none" stroke="#06b6d4" stroke-width="2"/>
                    <line x1="-20" y1="0" x2="20" y2="0" stroke="#06b6d4" stroke-dasharray="2"/>
                </g>
                
                <text x="450" y="20" fill="#64748b" font-size="9" text-anchor="middle" font-family="sans-serif">Setting 4 (-&chi; on B)</text>
                <g transform="translate(450, 60) rotate(-45)">
                    <ellipse cx="0" cy="0" rx="20" ry="12" fill="none" stroke="#06b6d4" stroke-width="2"/>
                    <line x1="-20" y1="0" x2="20" y2="0" stroke="#06b6d4" stroke-dasharray="2"/>
                </g>
                
                <text x="550" y="20" fill="#64748b" font-size="9" text-anchor="middle" font-family="sans-serif">Setting 5 (-&chi; on A)</text>
                <g transform="translate(550, 60) rotate(90)">
                    <ellipse cx="0" cy="0" rx="20" ry="12" fill="none" stroke="#06b6d4" stroke-width="2"/>
                    <line x1="-20" y1="0" x2="20" y2="0" stroke="#06b6d4" stroke-dasharray="2"/>
                </g>
            ` + svgFooter;
        } else if (type === "background") {
            return svgHeader + `
                <!-- Focus adjustment diagram -->
                <g transform="translate(100, 0)">
                    <rect x="0" y="55" width="100" height="6" fill="#475569"/>
                    <rect x="0" y="50" width="100" height="2" fill="#94a3b8"/>
                    <text x="50" y="80" fill="#64748b" font-size="10" text-anchor="middle" font-family="sans-serif">Slide (Coverslip)</text>
                    
                    <!-- Blemish dust particles -->
                    <circle cx="30" cy="50" r="2" fill="#ef4444"/>
                    <circle cx="70" cy="50" r="1.5" fill="#ef4444"/>
                    
                    <!-- Defocused rays -->
                    <path d="M 50 10 L 30 50 L 70 50 Z" fill="#10b981" fill-opacity="0.1" stroke="#10b981" stroke-width="1" stroke-dasharray="2"/>
                    <text x="50" y="45" fill="#10b981" font-size="8" text-anchor="middle" font-family="sans-serif">Defocus plane</text>
                </g>
                
                <!-- Background Stack representation -->
                <g transform="translate(360, 20)">
                    <!-- Layers of background frames -->
                    <rect x="40" y="0" width="60" height="50" rx="4" fill="#1e293b" stroke="#475569" opacity="0.3"/>
                    <rect x="30" y="10" width="60" height="50" rx="4" fill="#1e293b" stroke="#475569" opacity="0.5"/>
                    <rect x="20" y="20" width="60" height="50" rx="4" fill="#1e293b" stroke="#475569" opacity="0.7"/>
                    <rect x="10" y="30" width="60" height="50" rx="4" fill="#1e293b" stroke="#475569" opacity="0.9"/>
                    <rect x="0" y="40" width="60" height="50" rx="4" fill="#0f172a" stroke="#06b6d4" stroke-width="1.5"/>
                    
                    <text x="30" y="70" fill="#06b6d4" font-size="9" text-anchor="middle" font-family="sans-serif">Background Reference Stack</text>
                </g>
            ` + svgFooter;
        } else if (type === "correction") {
            return svgHeader + `
                <!-- Subtraction representation -->
                <g transform="translate(80, 20)">
                    <rect x="0" y="0" width="80" height="60" rx="6" fill="#1e293b" stroke="#f59e0b"/>
                    <circle cx="40" cy="30" r="18" fill="none" stroke="#f59e0b" stroke-width="2"/>
                    <text x="40" y="33" fill="#f59e0b" font-size="8" text-anchor="middle">Sample + Strain</text>
                </g>
                
                <text x="210" y="55" fill="#94a3b8" font-size="24" font-family="sans-serif" text-anchor="middle">&minus;</text>
                
                <g transform="translate(250, 20)">
                    <rect x="0" y="0" width="80" height="60" rx="6" fill="#1e293b" stroke="#64748b"/>
                    <!-- Just background strain pattern -->
                    <path d="M 10 10 Q 40 40 70 50" stroke="#64748b" stroke-width="4" fill="none" opacity="0.5"/>
                    <text x="40" y="33" fill="#64748b" font-size="8" text-anchor="middle">Background Strain</text>
                </g>
                
                <text x="380" y="55" fill="#94a3b8" font-size="24" font-family="sans-serif" text-anchor="middle">&equals;</text>
                
                <g transform="translate(420, 20)">
                    <rect x="0" y="0" width="80" height="60" rx="6" fill="#000" stroke="#10b981" stroke-width="2"/>
                    <circle cx="40" cy="30" r="18" fill="none" stroke="#10b981" stroke-width="3" filter="drop-shadow(0 0 5px #10b981)"/>
                    <text x="40" y="33" fill="#10b981" font-size="8" text-anchor="middle">Clean Sample</text>
                </g>
            ` + svgFooter;
        } else if (type === "jones") {
            return svgHeader + `
                <!-- Jones vector input -->
                <g transform="translate(60, 20)">
                    <rect x="0" y="0" width="120" height="70" rx="6" fill="#1e293b" stroke="#6366f1" stroke-width="1.5"/>
                    <text x="65" y="20" fill="#6366f1" font-size="10" font-weight="bold" text-anchor="middle">Jones Vector</text>
                    <text x="65" y="42" fill="#f8fafc" font-size="11" text-anchor="middle" font-family="monospace">E = [Ex, Ey]ᵀ</text>
                    <text x="65" y="58" fill="#64748b" font-size="8" text-anchor="middle">Coherent, Complex Phase</text>
                </g>
                
                <!-- Tensor Mapping arrow -->
                <g transform="translate(200, 20)">
                    <line x1="0" y1="35" x2="140" y2="35" stroke="#10b981" stroke-width="2" stroke-dasharray="3"/>
                    <polygon points="140,35 132,31 132,39" fill="#10b981"/>
                    <text x="70" y="25" fill="#10b981" font-size="10" text-anchor="middle" font-family="monospace">M = A(J ⊗ J*)A⁻¹</text>
                    <text x="70" y="48" fill="#94a3b8" font-size="8" text-anchor="middle">Kronecker Tensor Map</text>
                </g>
                
                <!-- Mueller Stokes output -->
                <g transform="translate(360, 20)">
                    <rect x="0" y="0" width="135" height="70" rx="6" fill="#1e293b" stroke="#06b6d4" stroke-width="1.5"/>
                    <text x="67" y="20" fill="#06b6d4" font-size="10" font-weight="bold" text-anchor="middle">Mueller / Stokes</text>
                    <text x="67" y="42" fill="#f8fafc" font-size="11" text-anchor="middle" font-family="monospace">S = [I, Q, U, V]ᵀ</text>
                    <text x="67" y="58" fill="#64748b" font-size="8" text-anchor="middle">Intensity, Depolarizing</text>
                </g>
            ` + svgFooter;
        } else if (type === "comparison") {
            return svgHeader + `
                <!-- 4-Frame characteristics -->
                <g transform="translate(25, 15)">
                    <rect x="0" y="0" width="225" height="85" rx="6" fill="#1e293b" stroke="#ef4444" stroke-width="1.5" fill-opacity="0.5"/>
                    <text x="112" y="20" fill="#ef4444" font-size="11" font-weight="bold" text-anchor="middle">4-Frame Algorithm</text>
                    <text x="15" y="42" fill="#94a3b8" font-size="9" text-anchor="start">✗ Low retardance limit (R ≪ χ)</text>
                    <text x="15" y="57" fill="#94a3b8" font-size="9" text-anchor="start">✗ Non-linear underestimation</text>
                    <text x="15" y="72" fill="#94a3b8" font-size="9" text-anchor="start">✗ Vulnerable to noise & drift</text>
                </g>
                
                <!-- VS indicator -->
                <text x="295" y="60" fill="#64748b" font-size="14" font-weight="bold" text-anchor="middle">VS</text>
                
                <!-- 5-Frame characteristics -->
                <g transform="translate(345, 15)">
                    <rect x="0" y="0" width="230" height="85" rx="6" fill="#1e293b" stroke="#10b981" stroke-width="1.5"/>
                    <text x="115" y="20" fill="#10b981" font-size="11" font-weight="bold" text-anchor="middle">Symmetric 5-Frame</text>
                    <text x="15" y="42" fill="#f8fafc" font-size="9" text-anchor="start">✓ Mathematically exact to λ/2 (~273nm)</text>
                    <text x="15" y="57" fill="#f8fafc" font-size="9" text-anchor="start">✓ Cancels non-linear cos δ terms</text>
                    <text x="15" y="72" fill="#f8fafc" font-size="9" text-anchor="start">✓ Highly immune to intensity drifts</text>
                </g>
            ` + svgFooter;
        }
        return "";
    }

    renderSlide(0);

    // -------------------------------------------------------------
    // LC-PolScope Physics Simulator Engine
    // -------------------------------------------------------------
    const wavelength = 546.0; // in nm
    
    // Single Pixel Elements
    const sliderRet = document.getElementById("slider-ret");
    const sliderPhi = document.getElementById("slider-phi");
    const sliderSwing = document.getElementById("slider-swing");
    const sliderNoise = document.getElementById("slider-noise");
    
    const valRet = document.getElementById("val-ret");
    const valPhi = document.getElementById("val-phi");
    const valSwing = document.getElementById("val-swing");
    const valNoise = document.getElementById("val-noise");
    
    const valI1 = document.getElementById("val-i1");
    const valI2 = document.getElementById("val-i2");
    const valI3 = document.getElementById("val-i3");
    const valI4 = document.getElementById("val-i4");
    const valI5 = document.getElementById("val-i5");
    
    const valReconRet4 = document.getElementById("val-recon-ret-4");
    const valReconPhi4 = document.getElementById("val-recon-phi-4");
    const valReconRet5 = document.getElementById("val-recon-ret-5");
    const valReconPhi5 = document.getElementById("val-recon-phi-5");
    
    const needleRecon = document.getElementById("needle-recon");
    const needleActual = document.getElementById("needle-actual");
    const singlePixelMath = document.getElementById("single-pixel-math");

    // 2D Simulator Elements
    const selectSpecimenType = document.getElementById("select-specimen-type");
    const btnToggleBg = document.getElementById("btn-toggle-bg");
    const btnToggleCorrect = document.getElementById("btn-toggle-correct");
    const selectDisplayMode = document.getElementById("select-display-mode");
    const selectAlgorithm = document.getElementById("select-algorithm");
    
    const canvasSpecimen = document.getElementById("canvas-specimen");
    const canvasReconRet = document.getElementById("canvas-recon-ret");
    const canvasRecon = document.getElementById("canvas-recon");
    
    const frameCanvases = [
        document.getElementById("canvas-i1"),
        document.getElementById("canvas-i2"),
        document.getElementById("canvas-i3"),
        document.getElementById("canvas-i4"),
        document.getElementById("canvas-i5")
    ];

    const ctxSpecimen = canvasSpecimen.getContext("2d");
    const ctxReconRet = canvasReconRet.getContext("2d");
    const ctxRecon = canvasRecon.getContext("2d");
    const ctxFrames = frameCanvases.map(canvas => canvas.getContext("2d"));

    // App state flags
    let backgroundEnabled = true;
    let correctionEnabled = true;
    
    // Grid Size
    const gridSize = 100;
    const pixelScale = 3; // canvas size is 300x300

    // Grid data caches
    let specimenGrid = []; // holds {r, phi}
    let backgroundGrid = []; // holds {r_bg, phi_bg} for instrumental birefringence
    let backgroundReferenceStack = []; // holds [I1, I2, I3, I4, I5] arrays for correction
    
    // Helper: Matrix vector and matrix multiplications using custom Complex structures
    function c_exp(theta) {
        return { re: Math.cos(theta), im: Math.sin(theta) };
    }
    
    function c_mult(c1, c2) {
        return {
            re: c1.re * c2.re - c1.im * c2.im,
            im: c1.re * c2.im + c1.im * c2.re
        };
    }
    
    function c_add(c1, c2) {
        return { re: c1.re + c2.re, im: c1.im + c2.im };
    }
    
    // Electromagnetic Forward Model
    // Returns [I1, I2, I3, I4, I5] normalized to maximum intensity = 1.0
    function computeForwardModelIntensities(R_spec, phi_spec, swing_deg) {
        const delta = (2 * Math.PI * R_spec) / wavelength;
        const phi = (phi_spec * Math.PI) / 180;
        const chi = (swing_deg * Math.PI) / 180;
        
        // Specimen Jones Matrix (rotated linear retarder)
        // J_spec = [ [cos(d/2) + i*sin(d/2)*cos(2phi), i*sin(d/2)*sin(2phi)],
        //            [i*sin(d/2)*sin(2phi), cos(d/2) - i*sin(d/2)*cos(2phi)] ]
        const cosD = Math.cos(delta / 2);
        const sinD = Math.sin(delta / 2);
        const cos2p = Math.cos(2 * phi);
        const sin2p = Math.sin(2 * phi);
        
        const J_spec = [
            [{ re: cosD, im: sinD * cos2p }, { re: 0, im: sinD * sin2p }],
            [{ re: 0, im: sinD * sin2p }, { re: cosD, im: -sinD * cos2p }]
        ];
        
        // Input polarization: linear at 45 degrees
        const E_in = [
            { re: 1 / Math.sqrt(2), im: 0 },
            { re: 1 / Math.sqrt(2), im: 0 }
        ];
        
        // LCVR Matrix Generator
        function get_J_lc(ret_A, ret_B) {
            // LC-A at 0 degrees
            const expA_pos = c_exp(ret_A / 2);
            const expA_neg = c_exp(-ret_A / 2);
            const J_A = [
                [expA_pos, { re: 0, im: 0 }],
                [{ re: 0, im: 0 }, expA_neg]
            ];
            
            // LC-B at 45 degrees
            const cosB = Math.cos(ret_B / 2);
            const sinB = Math.sin(ret_B / 2);
            const J_B = [
                [{ re: cosB, im: 0 }, { re: 0, im: sinB }],
                [{ re: 0, im: sinB }, { re: cosB, im: 0 }]
            ];
            
            // Return J_B @ J_A
            return [
                [c_mult(J_B[0][0], J_A[0][0]), c_mult(J_B[0][1], J_A[1][1])],
                [c_mult(J_B[1][0], J_A[0][0]), c_mult(J_B[1][1], J_A[1][1])]
            ];
        }
        
        // Nominal extinction state settings
        const ret_A1 = Math.PI / 2;
        const ret_B1 = Math.PI;
        
        const settings = [
            [ret_A1, ret_B1],         // Setting 1 (Extinction)
            [ret_A1 + chi, ret_B1],   // Setting 2 (+swing A)
            [ret_A1, ret_B1 + chi],   // Setting 3 (+swing B)
            [ret_A1, ret_B1 - chi],   // Setting 4 (-swing B)
            [ret_A1 - chi, ret_B1]    // Setting 5 (-swing A)
        ];
        
        return settings.map(([r_A, r_B]) => {
            const J_lc = get_J_lc(r_A, r_B);
            
            // Compute J_lc @ E_in
            const E_lc = [
                c_add(c_mult(J_lc[0][0], E_in[0]), c_mult(J_lc[0][1], E_in[1])),
                c_add(c_mult(J_lc[1][0], E_in[0]), c_mult(J_lc[1][1], E_in[1]))
            ];
            
            // Compute E_field = J_spec @ E_lc
            const E_field = [
                c_add(c_mult(J_spec[0][0], E_lc[0]), c_mult(J_spec[0][1], E_lc[1])),
                c_add(c_mult(J_spec[1][0], E_lc[0]), c_mult(J_spec[1][1], E_lc[1]))
            ];
            
            // Right-circular polarizer analyzer: project onto [1, -i] / sqrt(2)
            // Projection = (E_field[0] + i * E_field[1]) / sqrt(2)
            const term1 = E_field[0];
            const term2 = { re: -E_field[1].im, im: E_field[1].re }; // E_field[1] * i
            
            const proj = {
                re: (term1.re + term2.re) / Math.sqrt(2),
                im: (term1.im + term2.im) / Math.sqrt(2)
            };
            
            // Intensity = magnitude squared
            return proj.re * proj.re + proj.im * proj.im;
        });
    }

    // Reconstructs retardance and orientation from raw intensities
    function runReconstruction(intensities, swing_deg) {
        const [I1, I2, I3, I4, I5] = intensities;
        const c = (swing_deg * Math.PI) / 180; // swing phase angle
        const tanHalfC = Math.tan(c / 2);
        
        // --- 4-Frame Algorithm ---
        let A4 = 0;
        let B4 = 0;
        let R4 = 0;
        let phi4 = 0;
        
        const denom4 = I2 + I3 - 2 * I1;
        if (Math.abs(denom4) > 1e-7) {
            A4 = ((I2 - I3) / denom4) * tanHalfC;
            B4 = ((I2 + I3 - 2 * I4) / denom4) * tanHalfC;
            
            const R4_rad = Math.atan(Math.sqrt(A4*A4 + B4*B4));
            R4 = (R4_rad * wavelength) / (2 * Math.PI); // retardance in nm
            // We rotate by 45 degrees to align with specimen coordinates
            phi4 = (0.5 * Math.atan2(A4, B4) + Math.PI/4);
            phi4 = (phi4 * 180 / Math.PI) % 180;
            if (phi4 < 0) phi4 += 180;
        }

        // --- 5-Frame (Symmetric) Algorithm ---
        let A5 = 0;
        let B5 = 0;
        let R5 = 0;
        let phi5 = 0;
        
        const denom5_A = I2 + I5 - 2 * I1;
        const denom5_B = I3 + I4 - 2 * I1;
        
        if (Math.abs(denom5_A) > 1e-7 && Math.abs(denom5_B) > 1e-7) {
            A5 = ((I2 - I5) / denom5_A) * tanHalfC;
            B5 = ((I3 - I4) / denom5_B) * tanHalfC;
            
            const R5_rad = Math.atan(Math.sqrt(A5*A5 + B5*B5));
            R5 = (R5_rad * wavelength) / (2 * Math.PI); // retardance in nm
            // Note: B5 is sin(2phi), -A5 is cos(2phi)
            phi5 = 0.5 * Math.atan2(B5, -A5);
            phi5 = (phi5 * 180 / Math.PI) % 180;
            if (phi5 < 0) phi5 += 180;
        }
        
        return {
            A4, B4, R4, phi4,
            A5, B5, R5, phi5
        };
    }

    // Helper: generates random Gaussian noise
    function gaussianRandom(mean=0, stdev=1) {
        const u = 1 - Math.random();
        const v = 1 - Math.random();
        const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
        return z * stdev + mean;
    }

    // -------------------------------------------------------------
    // Single Pixel Interactive Panel
    // -------------------------------------------------------------
    function updateSinglePixelSimulation() {
        const R_spec = parseFloat(sliderRet.value);
        const phi_spec = parseFloat(sliderPhi.value);
        const swing_deg = parseFloat(sliderSwing.value);
        const noise_level = parseFloat(sliderNoise.value) / 100;
        
        valRet.textContent = `${R_spec} nm`;
        valPhi.textContent = `${phi_spec}°`;
        valSwing.textContent = `${swing_deg}°`;
        valNoise.textContent = `${(noise_level*100).toFixed(0)}%`;
        
        // Run forward simulation
        let intensities = computeForwardModelIntensities(R_spec, phi_spec, swing_deg);
        
        // Add camera noise
        // Minimum light leakage under extinction
        const extinctionLeakage = 0.0005; // 0.05% leakage
        const maxIntensityScale = 4000;    // Simulate 12-bit camera (0 to 4095)
        
        const swing_rad = (swing_deg * Math.PI) / 180;
        const maxSignal = Math.sin(swing_rad / 2) * Math.sin(swing_rad / 2);
        
        let noisyIntensities = intensities.map(I => {
            let val = extinctionLeakage + I;
            // Add Gaussian noise relative to actual signal levels (shot noise + read noise)
            const noise = gaussianRandom(0, noise_level * (val + 0.05 * maxSignal));
            val = Math.max(0, val + noise);
            return val;
        });
        
        // Render raw frame intensity values on UI (scaled to simulated camera digital counts)
        const counts = noisyIntensities.map(I => Math.round(I * maxIntensityScale));
        valI1.textContent = `${counts[0]}`;
        valI2.textContent = `${counts[1]}`;
        valI3.textContent = `${counts[2]}`;
        valI4.textContent = `${counts[3]}`;
        valI5.textContent = `${counts[4]}`;
        
        // Run reconstruction on noisy intensities
        const recon = runReconstruction(noisyIntensities, swing_deg);
        
        valReconRet4.textContent = `${recon.R4.toFixed(2)} nm`;
        valReconPhi4.textContent = `${recon.phi4.toFixed(1)}°`;
        valReconRet5.textContent = `${recon.R5.toFixed(2)} nm`;
        valReconPhi5.textContent = `${recon.phi5.toFixed(1)}°`;
        
        // Update needle rotation on UI
        // Needle points along the slow axis angle. 
        // Need to rotate visual line. Standard angle is relative to x-axis, 
        // CSS transforms rotate clockwise, so we negate for polar standard
        needleActual.style.transform = `rotate(${-phi_spec}deg)`;
        needleRecon.style.transform = `rotate(${-recon.phi5}deg)`;
        
        // Display real-time equations and calculation steps
        const tan_val = Math.tan(swing_rad / 2).toFixed(4);
        
        const a5_num = (noisyIntensities[1] - noisyIntensities[4]).toFixed(6);
        const a5_den = (noisyIntensities[1] + noisyIntensities[4] - 2 * noisyIntensities[0]).toFixed(6);
        const b5_num = (noisyIntensities[2] - noisyIntensities[3]).toFixed(6);
        const b5_den = (noisyIntensities[2] + noisyIntensities[3] - 2 * noisyIntensities[0]).toFixed(6);
        
        singlePixelMath.innerHTML = `
<span class="math-highlight">// 1. Read Intermediate Coefficients (5-Frame)</span>
A = [ (I₂ - I₅) / (I₂ + I₅ - 2I₁) ] · tan(χ/2)
  = [ (${noisyIntensities[1].toFixed(5)} - ${noisyIntensities[4].toFixed(5)}) / (${noisyIntensities[1].toFixed(5)} + ${noisyIntensities[4].toFixed(5)} - 2·${noisyIntensities[0].toFixed(5)}) ] · ${tan_val}
  = [ ${a5_num} / ${a5_den} ] · ${tan_val} = <span class="math-highlight">${recon.A5.toFixed(5)}</span>

B = [ (I₃ - I₄) / (I₃ + I₄ - 2I₁) ] · tan(χ/2)
  = [ (${noisyIntensities[2].toFixed(5)} - ${noisyIntensities[3].toFixed(5)}) / (${noisyIntensities[2].toFixed(5)} + ${noisyIntensities[3].toFixed(5)} - 2·${noisyIntensities[0].toFixed(5)}) ] · ${tan_val}
  = [ ${b5_num} / ${b5_den} ] · ${tan_val} = <span class="math-highlight">${recon.B5.toFixed(5)}</span>

<span class="math-highlight">// 2. Compute Specimen Retardance (R)</span>
R = (λ / 2π) · arctan(√(A² + B²))
  = (546 / 2π) · arctan(√(${recon.A5.toFixed(4)}² + ${recon.B5.toFixed(4)}²))
  = 86.9 · arctan(${(Math.sqrt(recon.A5*recon.A5 + recon.B5*recon.B5)).toFixed(5)}) = <span class="math-highlight">${recon.R5.toFixed(2)} nm</span>

<span class="math-highlight">// 3. Compute Slow-Axis Orientation (φ)</span>
φ = 0.5 · atan2(B, -A)
  = 0.5 · atan2(${recon.B5.toFixed(4)}, ${(-recon.A5).toFixed(4)}) = <span class="math-highlight">${recon.phi5.toFixed(1)}°</span>
        `;
    }

    [sliderRet, sliderPhi, sliderSwing, sliderNoise].forEach(slider => {
        slider.addEventListener("input", updateSinglePixelSimulation);
    });

    // -------------------------------------------------------------
    // 2D Full-field Simulator
    // -------------------------------------------------------------
    function createSpecimenGrid(type) {
        specimenGrid = [];
        const center = gridSize / 2;
        
        if (type === "tumor_parallel" || type === "tumor_perpendicular" || type === "aster") {
            const fibers = [];
            
            // Deterministic LCG for stability across redraws
            let seed = 42;
            function deterministicRandom() {
                const x = Math.sin(seed++) * 10000;
                return x - Math.floor(x);
            }
            
            if (type === "aster") {
                // Centrosomal Microtubule Aster (Radial Pattern)
                // 16 individual thinned microtubules radiating from center to the edges, occupying most of the field of view
                const numMicrotubules = 16;
                for (let i = 0; i < numMicrotubules; i++) {
                    const angleRad = (i * 360 / numMicrotubules * Math.PI) / 180;
                    const x1 = center + 4 * Math.cos(angleRad);
                    const y1 = center + 4 * Math.sin(angleRad);
                    const x2 = center + 47 * Math.cos(angleRad);
                    const y2 = center + 47 * Math.sin(angleRad);
                    
                    fibers.push({
                        x1, y1, x2, y2,
                        r_peak: 22.0, // High retardance fiber
                        // Negate angleRad to align physical slow axis with visual screen orientation (y-axis flipped)
                        phi: (((-angleRad * 180) / Math.PI) % 180 + 180) % 180,
                        width: 1.6 // Thinned width for distinct individual fibers with gaps
                    });
                }
            } else if (type === "tumor_parallel") {
                // 1. Tangential containment fibers (TACS-2) - parallel to the boundary
                // Spaced out (6 fibers instead of 8, and length = 10 instead of 14) so they don't form a merged thick ring
                for (let i = 0; i < 6; i++) {
                    const angleRad = (i * 60 * Math.PI) / 180;
                    const r_pos = 24;
                    const xc = center + r_pos * Math.cos(angleRad);
                    const yc = center + r_pos * Math.sin(angleRad);
                    
                    // Fiber orientation is tangential: angle + 90 degrees
                    const fiberAngle = angleRad + Math.PI / 2;
                    const L = 10; // fiber length: short enough to prevent merging
                    const x1 = xc - (L / 2) * Math.cos(fiberAngle);
                    const y1 = yc - (L / 2) * Math.sin(fiberAngle);
                    const x2 = xc + (L / 2) * Math.cos(fiberAngle);
                    const y2 = yc + (L / 2) * Math.sin(fiberAngle);
                    
                    fibers.push({
                        x1, y1, x2, y2,
                        r_peak: 24.0, // High retardance fiber
                        // Negate fiberAngle to align physical slow axis with visual screen orientation (y-axis flipped)
                        phi: (((-fiberAngle * 180) / Math.PI) % 180 + 180) % 180,
                        width: 1.8 // Thinner profile for distinct individual fibers
                    });
                }
            } else if (type === "tumor_perpendicular") {
                // 2. Radial invasive fibers (TACS-3) - perpendicular, crossing the boundary
                // Spaced out. Draw 6 fibers at angles 0, 60, 120, 180, 240, 300.
                for (let i = 0; i < 6; i++) {
                    const angleRad = (i * 60 * Math.PI) / 180;
                    // Fiber starts inside (R=15) and extends outside (R=33)
                    const x1 = center + 15 * Math.cos(angleRad);
                    const y1 = center + 15 * Math.sin(angleRad);
                    const x2 = center + 33 * Math.cos(angleRad);
                    const y2 = center + 33 * Math.sin(angleRad);
                    
                    fibers.push({
                        x1, y1, x2, y2,
                        r_peak: 26.0, // High retardance fiber
                        // Negate angleRad to align physical slow axis with visual screen orientation (y-axis flipped)
                        phi: (((-angleRad * 180) / Math.PI) % 180 + 180) % 180,
                        width: 1.8 // Thinner profile for distinct individual fibers
                    });
                }
            }
            
            if (type !== "aster") {
                // 3. Disorganized internal tumor core fibers (R < 15)
                for (let i = 0; i < 8; i++) {
                    const r_pos = 5 + deterministicRandom() * 8;
                    const angleRad = deterministicRandom() * 2 * Math.PI;
                    const xc = center + r_pos * Math.cos(angleRad);
                    const yc = center + r_pos * Math.sin(angleRad);
                    const fiberAngle = deterministicRandom() * Math.PI;
                    const L = 6 + deterministicRandom() * 6;
                    const x1 = xc - (L / 2) * Math.cos(fiberAngle);
                    const y1 = yc - (L / 2) * Math.sin(fiberAngle);
                    const x2 = xc + (L / 2) * Math.cos(fiberAngle);
                    const y2 = yc + (L / 2) * Math.sin(fiberAngle);
                    
                    fibers.push({
                        x1, y1, x2, y2,
                        r_peak: 4.0 + deterministicRandom() * 4.0, // low retardance core
                        // Negate fiberAngle to align physical slow axis with visual screen orientation (y-axis flipped)
                        phi: (((-fiberAngle * 180) / Math.PI) % 180 + 180) % 180,
                        width: 1.5
                    });
                }
                
                // 4. Background stromal fibers in the stroma (R > 35)
                for (let i = 0; i < 12; i++) {
                    const r_pos = 36 + deterministicRandom() * 12;
                    const angleRad = deterministicRandom() * 2 * Math.PI;
                    const xc = center + r_pos * Math.cos(angleRad);
                    const yc = center + r_pos * Math.sin(angleRad);
                    
                    // Stromal fibers slightly aligned radially (outward alignment)
                    const fiberAngle = angleRad + (deterministicRandom() - 0.5) * 0.4;
                    const L = 10 + deterministicRandom() * 10;
                    const x1 = xc - (L / 2) * Math.cos(fiberAngle);
                    const y1 = yc - (L / 2) * Math.sin(fiberAngle);
                    const x2 = xc + (L / 2) * Math.cos(fiberAngle);
                    const y2 = yc + (L / 2) * Math.sin(fiberAngle);
                    
                    fibers.push({
                        x1, y1, x2, y2,
                        r_peak: 8.0 + deterministicRandom() * 6.0, // moderate retardance stroma
                        // Negate fiberAngle to align physical slow axis with visual screen orientation (y-axis flipped)
                        phi: (((-fiberAngle * 180) / Math.PI) % 180 + 180) % 180,
                        width: 1.8
                    });
                }
            }
            
            // Fill specimenGrid pixel-by-pixel
            for (let y = 0; y < gridSize; y++) {
                specimenGrid[y] = [];
                for (let x = 0; x < gridSize; x++) {
                    let maxR = 0;
                    let bestPhi = 0;
                    
                    for (let f = 0; f < fibers.length; f++) {
                        const fib = fibers[f];
                        const vx = fib.x2 - fib.x1;
                        const vy = fib.y2 - fib.y1;
                        const wx = x - fib.x1;
                        const wy = y - fib.y1;
                        
                        const lenSq = vx * vx + vy * vy;
                        let t = 0;
                        if (lenSq > 0) {
                            t = (wx * vx + wy * vy) / lenSq;
                            t = Math.max(0, Math.min(1, t));
                        }
                        
                        const closestX = fib.x1 + t * vx;
                        const closestY = fib.y1 + t * vy;
                        
                        const dx = x - closestX;
                        const dy = y - closestY;
                        const distSq = dx * dx + dy * dy;
                        
                        const r_val = fib.r_peak * Math.exp(-distSq / (2 * fib.width * fib.width));
                        if (r_val > maxR) {
                            maxR = r_val;
                            bestPhi = fib.phi;
                        }
                    }
                    
                    // Low baseline background retardance if no fiber is close
                    if (maxR < 0.5) {
                        maxR = 0.2;
                        bestPhi = 0;
                    }
                    
                    specimenGrid[y][x] = { r: maxR, phi: (bestPhi % 180 + 180) % 180 };
                }
            }
            return;
        }
        
        // Analytical models for aster and parallel_collagen
        for (let y = 0; y < gridSize; y++) {
            specimenGrid[y] = [];
            for (let x = 0; x < gridSize; x++) {
                let r = 0;   // Retardance in nm
                let phi = 0; // Azimuth in degrees
                
                const dx = x - center;
                const dy = y - center;
                const dist = Math.sqrt(dx*dx + dy*dy);
                
                if (type === "parallel_collagen") {
                    const offsets = [-70, -40, -10, 20, 50, 80];
                    let minD = 999;
                    for (let i = 0; i < offsets.length; i++) {
                        const d = Math.abs(y - x - offsets[i]) / Math.sqrt(2);
                        if (d < minD) {
                            minD = d;
                        }
                    }
                    const w = 3.5;
                    const fiberProfile = Math.exp(-(minD * minD) / (2 * w * w));
                    r = 20.0 * fiberProfile;
                    phi = 135.0;
                }
                
                phi = (phi % 180 + 180) % 180;
                specimenGrid[y][x] = { r, phi };
            }
        }
    }

    function createBackgroundGrid() {
        backgroundGrid = [];
        
        // Simulates instrumental birefringence background (smooth gradient representing lens strain)
        // Typically has retardance varying from 0.5 nm to 6 nm
        for (let y = 0; y < gridSize; y++) {
            backgroundGrid[y] = [];
            for (let x = 0; x < gridSize; x++) {
                // Diagonal gradient lens strain
                const r_bg = 1.0 + 6.0 * (x + y) / (2 * gridSize); // 1nm to 7nm
                const phi_bg = 120.0 - 40.0 * x / gridSize;       // 80 deg to 120 deg
                backgroundGrid[y][x] = { r: r_bg, phi: phi_bg };
            }
        }
    }

    // Capture background reference stack for subtraction
    function recordBackgroundReferenceStack() {
        backgroundReferenceStack = [];
        const swing_deg = parseFloat(sliderSwing.value);
        
        for (let y = 0; y < gridSize; y++) {
            backgroundReferenceStack[y] = [];
            for (let x = 0; x < gridSize; x++) {
                const bg = backgroundGrid[y][x];
                // Run forward model on background ONLY
                const intensities = computeForwardModelIntensities(bg.r, bg.phi, swing_deg);
                
                // Add tiny camera read noise (averaged stack has lower noise)
                const noisy = intensities.map(I => Math.max(0, I + gaussianRandom(0, 0.0005)));
                backgroundReferenceStack[y][x] = noisy;
            }
        }
    }

    // Helper: color code angle for azimuth map
    // Hue varies from 0 to 180 degrees (representing full azimuth spectrum)
    function getAzimuthColor(angleDeg, retardanceVal) {
        // Threshold: if retardance is low (below 1.8 nm), render as black background to hide noise
        if (retardanceVal < 1.8) return "rgb(0, 0, 0)";
        
        // Map 0-180 deg to 0-360 hue
        const hue = (angleDeg * 2) % 360;
        // Lightness scales with retardance to smoothly fade out near threshold and boost contrast
        const lightness = Math.min(60, (retardanceVal - 1.8) * 3.5);
        return `hsl(${hue}, 100%, ${lightness}%)`;
    }

    // Renders the full 2D simulation dashboards
    function render2DBackgroundAndSample() {
        const swing_deg = parseFloat(sliderSwing.value);
        const noise_level = parseFloat(sliderNoise.value) / 100;
        const algo = selectAlgorithm.value;
        
        // Draw Ground Truth specimen (Always retardance intensity map)
        const specimenImgData = ctxSpecimen.createImageData(gridSize * pixelScale, gridSize * pixelScale);
        
        for (let y = 0; y < gridSize; y++) {
            for (let x = 0; x < gridSize; x++) {
                const cell = specimenGrid[y][x];
                
                // Grayscale retardance: brightness corresponds to retardance
                const v = Math.min(255, Math.round(cell.r * 10)); // 25nm matches 250 brightness
                const r = v; const g = v; const b = v;
                
                // Draw scaled pixel (pixelScale x pixelScale)
                for (let py = 0; py < pixelScale; py++) {
                    for (let px = 0; px < pixelScale; px++) {
                        const idx = ((y * pixelScale + py) * gridSize * pixelScale + (x * pixelScale + px)) * 4;
                        specimenImgData.data[idx] = r;
                        specimenImgData.data[idx + 1] = g;
                        specimenImgData.data[idx + 2] = b;
                        specimenImgData.data[idx + 3] = 255;
                    }
                }
            }
        }
        ctxSpecimen.putImageData(specimenImgData, 0, 0);
        
        // Ground Truth specimen is rendered as a grayscale intensity map without needles.
        
        // -------------------------------------------------------------
        // Compute raw frames I1 - I5 under specimen + background
        // -------------------------------------------------------------
        const rawFrameData = Array.from({ length: 5 }, () => new Float32Array(gridSize * gridSize));
        
        for (let y = 0; y < gridSize; y++) {
            for (let x = 0; x < gridSize; x++) {
                const spec = specimenGrid[y][x];
                const bg = backgroundGrid[y][x];
                
                // Vector addition of birefringence coefficients
                // Adding retardance vectorially: A_tot = A_spec + A_bg, B_tot = B_spec + B_bg
                // This is a valid physical approximation for low retardance!
                const delta_spec = (2 * Math.PI * spec.r) / wavelength;
                const phi_spec = (spec.phi * Math.PI) / 180;
                const a_spec = Math.tan(delta_spec) * Math.cos(2 * phi_spec);
                const b_spec = Math.tan(delta_spec) * Math.sin(2 * phi_spec);
                
                const delta_bg = backgroundEnabled ? (2 * Math.PI * bg.r) / wavelength : 0;
                const phi_bg = backgroundEnabled ? (bg.phi * Math.PI) / 180 : 0;
                const a_bg = Math.tan(delta_bg) * Math.cos(2 * phi_bg);
                const b_bg = Math.tan(delta_bg) * Math.sin(2 * phi_bg);
                
                const a_tot = a_spec + a_bg;
                const b_tot = b_spec + b_bg;
                
                const r_tot_rad = Math.atan(Math.sqrt(a_tot*a_tot + b_tot*b_tot));
                const r_tot = (r_tot_rad * wavelength) / (2 * Math.PI);
                const phi_tot = 0.5 * Math.atan2(b_tot, a_tot) * 180 / Math.PI;
                
                // Compute physical intensities for total birefringence
                const intensities = computeForwardModelIntensities(r_tot, phi_tot, swing_deg);
                
                // Add noise and minimum leakage
                const extLeak = 0.0005;
                const chi = (swing_deg * Math.PI) / 180;
                const maxSignal = Math.sin(chi / 2) * Math.sin(chi / 2);
                for (let f = 0; f < 5; f++) {
                    let val = extLeak + intensities[f];
                    if (noise_level > 0) {
                        // Add Gaussian noise relative to actual signal levels (shot noise + read noise)
                        const noise = gaussianRandom(0, noise_level * (val + 0.05 * maxSignal));
                        val = Math.max(0, val + noise);
                    }
                    rawFrameData[f][y * gridSize + x] = val;
                }
            }
        }
        
        // Render 5 small raw frames previews (Full field of view)
        for (let f = 0; f < 5; f++) {
            const frameCtx = ctxFrames[f];
            const frameImgData = frameCtx.createImageData(60, 60); // frame canvas size 60x60
            
            for (let y = 0; y < 60; y++) {
                for (let x = 0; x < 60; x++) {
                    // Map x, y [0, 59] to entire grid
                    const gx = Math.floor(x * gridSize / 60);
                    const gy = Math.floor(y * gridSize / 60);
                    const val = rawFrameData[f][gy * gridSize + gx];
                    
                    // Boost contrast for visibility on small preview
                    const v = Math.min(255, Math.round(val * 1500));
                    
                    const idx = (y * 60 + x) * 4;
                    frameImgData.data[idx] = v;
                    frameImgData.data[idx + 1] = v;
                    frameImgData.data[idx + 2] = v;
                    frameImgData.data[idx + 3] = 255;
                }
            }
            frameCtx.putImageData(frameImgData, 0, 0);
        }
        
        // -------------------------------------------------------------
        // Reconstruction with optional Background Correction
        // -------------------------------------------------------------
        const reconImgData = ctxRecon.createImageData(gridSize * pixelScale, gridSize * pixelScale);
        const reconRetImgData = ctxReconRet.createImageData(gridSize * pixelScale, gridSize * pixelScale);
        const tanHalfC = Math.tan((swing_deg * Math.PI) / 360);
        
        for (let y = 0; y < gridSize; y++) {
            for (let x = 0; x < gridSize; x++) {
                const I1 = rawFrameData[0][y * gridSize + x];
                const I2 = rawFrameData[1][y * gridSize + x];
                const I3 = rawFrameData[2][y * gridSize + x];
                const I4 = rawFrameData[3][y * gridSize + x];
                const I5 = rawFrameData[4][y * gridSize + x];
                
                let rec_r = 0;
                let rec_phi = 0;
                
                if (algo === "5-frame") {
                    const denomA = I2 + I5 - 2 * I1;
                    const denomB = I3 + I4 - 2 * I1;
                    
                    if (Math.abs(denomA) > 1e-7 && Math.abs(denomB) > 1e-7) {
                        let A = ((I2 - I5) / denomA) * tanHalfC;
                        let B = ((I3 - I4) / denomB) * tanHalfC;
                        
                        // Background Correction (coefficient subtraction)
                        if (backgroundEnabled && correctionEnabled && backgroundReferenceStack.length > 0) {
                            const bg_I1 = backgroundReferenceStack[y][x][0];
                            const bg_I2 = backgroundReferenceStack[y][x][1];
                            const bg_I3 = backgroundReferenceStack[y][x][2];
                            const bg_I4 = backgroundReferenceStack[y][x][3];
                            const bg_I5 = backgroundReferenceStack[y][x][4];
                            
                            const bg_denomA = bg_I2 + bg_I5 - 2 * bg_I1;
                            const bg_denomB = bg_I3 + bg_I4 - 2 * bg_I1;
                            
                            if (Math.abs(bg_denomA) > 1e-7 && Math.abs(bg_denomB) > 1e-7) {
                                const bg_A = ((bg_I2 - bg_I5) / bg_denomA) * tanHalfC;
                                const bg_B = ((bg_I3 - bg_I4) / bg_denomB) * tanHalfC;
                                
                                A = A - bg_A;
                                B = B - bg_B;
                            }
                        }
                        
                        const R_rad = Math.atan(Math.sqrt(A*A + B*B));
                        rec_r = (R_rad * wavelength) / (2 * Math.PI);
                        rec_phi = 0.5 * Math.atan2(B, -A) * 180 / Math.PI;
                    }
                } else {
                    // 4-Frame Algorithm
                    const denom = I2 + I3 - 2 * I1;
                    if (Math.abs(denom) > 1e-7) {
                        let A = ((I2 - I3) / denom) * tanHalfC;
                        let B = ((I2 + I3 - 2 * I4) / denom) * tanHalfC;
                        
                        if (backgroundEnabled && correctionEnabled && backgroundReferenceStack.length > 0) {
                            const bg_I1 = backgroundReferenceStack[y][x][0];
                            const bg_I2 = backgroundReferenceStack[y][x][1];
                            const bg_I3 = backgroundReferenceStack[y][x][2];
                            const bg_I4 = backgroundReferenceStack[y][x][3];
                            
                            const bg_denom = bg_I2 + bg_I3 - 2 * bg_I1;
                            if (Math.abs(bg_denom) > 1e-7) {
                                const bg_A = ((bg_I2 - bg_I3) / bg_denom) * tanHalfC;
                                const bg_B = ((bg_I2 + bg_I3 - 2 * bg_I4) / bg_denom) * tanHalfC;
                                
                                A = A - bg_A;
                                B = B - bg_B;
                            }
                        }
                        
                        const R_rad = Math.atan(Math.sqrt(A*A + B*B));
                        rec_r = (R_rad * wavelength) / (2 * Math.PI);
                        rec_phi = (0.5 * Math.atan2(A, B) * 180 / Math.PI) + 45.0;
                    }
                }
                
                // Keep angle in 0-180
                rec_phi = (rec_phi % 180 + 180) % 180;
                
                // Render pixel (Always color-coded azimuth orientation map)
                let r, g, b;
                const colorStr = getAzimuthColor(rec_phi, rec_r);
                const tempSpan = document.createElement("span");
                tempSpan.style.color = colorStr;
                document.body.appendChild(tempSpan);
                const rgbColor = getComputedStyle(tempSpan).color;
                document.body.removeChild(tempSpan);
                
                const matches = rgbColor.match(/\d+/g);
                if (matches) {
                    r = parseInt(matches[0]);
                    g = parseInt(matches[1]);
                    b = parseInt(matches[2]);
                } else {
                    r = 0; g = 0; b = 0;
                }
                
                // Grayscale reconstructed retardance
                const v_ret = Math.min(255, Math.round(rec_r * 10));
                
                for (let py = 0; py < pixelScale; py++) {
                    for (let px = 0; px < pixelScale; px++) {
                        const idx = ((y * pixelScale + py) * gridSize * pixelScale + (x * pixelScale + px)) * 4;
                        
                        // Azimuth map (Reconstructed Slow Axis)
                        reconImgData.data[idx] = r;
                        reconImgData.data[idx + 1] = g;
                        reconImgData.data[idx + 2] = b;
                        reconImgData.data[idx + 3] = 255;
                        
                        // Retardance map (Reconstructed Retardance)
                        reconRetImgData.data[idx] = v_ret;
                        reconRetImgData.data[idx + 1] = v_ret;
                        reconRetImgData.data[idx + 2] = v_ret;
                        reconRetImgData.data[idx + 3] = 255;
                    }
                }
            }
        }
        ctxRecon.putImageData(reconImgData, 0, 0);
        ctxReconRet.putImageData(reconRetImgData, 0, 0);
        
        // Overlay needles representing orientation if in azimuth mode
        if (true) {
            ctxRecon.strokeStyle = "rgba(255,255,255,0.4)";
            ctxRecon.lineWidth = 1;
            const needleSpacing = 6;
            
            for (let y = needleSpacing/2; y < gridSize; y += needleSpacing) {
                for (let x = needleSpacing/2; x < gridSize; x += needleSpacing) {
                    // Sample reconstructed value
                    // We need to re-run reconstruction on this point
                    const gx = Math.floor(x);
                    const gy = Math.floor(y);
                    const I1 = rawFrameData[0][gy * gridSize + gx];
                    const I2 = rawFrameData[1][gy * gridSize + gx];
                    const I3 = rawFrameData[2][gy * gridSize + gx];
                    const I4 = rawFrameData[3][gy * gridSize + gx];
                    const I5 = rawFrameData[4][gy * gridSize + gx];
                    
                    let rec_r = 0;
                    let rec_phi = 0;
                    
                    if (algo === "5-frame") {
                        const denomA = I2 + I5 - 2 * I1;
                        const denomB = I3 + I4 - 2 * I1;
                        if (Math.abs(denomA) > 1e-7 && Math.abs(denomB) > 1e-7) {
                            let A = ((I2 - I5) / denomA) * tanHalfC;
                            let B = ((I3 - I4) / denomB) * tanHalfC;
                            
                            if (backgroundEnabled && correctionEnabled && backgroundReferenceStack.length > 0) {
                                const bg_I1 = backgroundReferenceStack[gy][gx][0];
                                const bg_I2 = backgroundReferenceStack[gy][gx][1];
                                const bg_I3 = backgroundReferenceStack[gy][gx][2];
                                const bg_I4 = backgroundReferenceStack[gy][gx][3];
                                const bg_I5 = backgroundReferenceStack[gy][gx][4];
                                
                                const bg_denomA = bg_I2 + bg_I5 - 2 * bg_I1;
                                const bg_denomB = bg_I3 + bg_I4 - 2 * bg_I1;
                                
                                if (Math.abs(bg_denomA) > 1e-7 && Math.abs(bg_denomB) > 1e-7) {
                                    A = A - ((bg_I2 - bg_I5) / bg_denomA) * tanHalfC;
                                    B = B - ((bg_I3 - bg_I4) / bg_denomB) * tanHalfC;
                                }
                            }
                            rec_r = (Math.atan(Math.sqrt(A*A + B*B)) * wavelength) / (2 * Math.PI);
                            rec_phi = 0.5 * Math.atan2(B, -A) * 180 / Math.PI;
                        }
                    } else {
                        const denom = I2 + I3 - 2 * I1;
                        if (Math.abs(denom) > 1e-7) {
                            let A = ((I2 - I3) / denom) * tanHalfC;
                            let B = ((I2 + I3 - 2 * I4) / denom) * tanHalfC;
                            
                            if (backgroundEnabled && correctionEnabled && backgroundReferenceStack.length > 0) {
                                const bg_I1 = backgroundReferenceStack[gy][gx][0];
                                const bg_I2 = backgroundReferenceStack[gy][gx][1];
                                const bg_I3 = backgroundReferenceStack[gy][gx][2];
                                const bg_I4 = backgroundReferenceStack[gy][gx][3];
                                
                                const bg_denom = bg_I2 + bg_I3 - 2 * bg_I1;
                                if (Math.abs(bg_denom) > 1e-7) {
                                    A = A - ((bg_I2 - bg_I3) / bg_denom) * tanHalfC;
                                    B = B - ((bg_I2 + bg_I3 - 2 * bg_I4) / bg_denom) * tanHalfC;
                                }
                            }
                            rec_r = (Math.atan(Math.sqrt(A*A + B*B)) * wavelength) / (2 * Math.PI);
                            rec_phi = (0.5 * Math.atan2(A, B) * 180 / Math.PI) + 45.0;
                        }
                    }
                    
                    rec_phi = (rec_phi % 180 + 180) % 180;
                    
                    if (rec_r > 2.0) {
                        const cx = x * pixelScale;
                        const cy = y * pixelScale;
                        const angle = (rec_phi * Math.PI) / 180;
                        
                        const dx = Math.cos(angle) * 6;
                        const dy = -Math.sin(angle) * 6;
                        
                        ctxRecon.beginPath();
                        ctxRecon.moveTo(cx - dx, cy - dy);
                        ctxRecon.lineTo(cx + dx, cy + dy);
                        ctxRecon.stroke();
                    }
                }
            }
        }
        
    }

    function initSimulator() {
        // Set up the canvases width and height
        canvasSpecimen.width = gridSize * pixelScale;
        canvasSpecimen.height = gridSize * pixelScale;
        canvasReconRet.width = gridSize * pixelScale;
        canvasReconRet.height = gridSize * pixelScale;
        canvasRecon.width = gridSize * pixelScale;
        canvasRecon.height = gridSize * pixelScale;
        
        frameCanvases.forEach(canvas => {
            canvas.width = 60;
            canvas.height = 60;
        });
        
        // Initialize grids
        createSpecimenGrid(selectSpecimenType.value);
        createBackgroundGrid();
        recordBackgroundReferenceStack();
        
        // Render 2D visuals
        render2DBackgroundAndSample();
    }

    // Connect 2D UI Controls
    selectSpecimenType.addEventListener("change", () => {
        createSpecimenGrid(selectSpecimenType.value);
        render2DBackgroundAndSample();
    });

    btnToggleBg.addEventListener("click", () => {
        backgroundEnabled = !backgroundEnabled;
        if (backgroundEnabled) {
            btnToggleBg.classList.remove("btn-secondary");
            btnToggleBg.classList.add("btn-toggle-active");
            btnToggleBg.innerHTML = `
                <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" stroke="currentColor"/></svg>
                Lens Strain: ON
            `;
        } else {
            btnToggleBg.classList.remove("btn-toggle-active");
            btnToggleBg.classList.add("btn-secondary");
            btnToggleBg.innerHTML = `
                <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" stroke="currentColor"/></svg>
                Lens Strain: OFF
            `;
        }
        render2DBackgroundAndSample();
    });

    btnToggleCorrect.addEventListener("click", () => {
        correctionEnabled = !correctionEnabled;
        if (correctionEnabled) {
            btnToggleCorrect.classList.remove("btn-secondary");
            btnToggleCorrect.classList.add("btn-toggle-active");
            btnToggleCorrect.innerHTML = `
                <svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" stroke="currentColor"/></svg>
                BG Correction: ON
            `;
        } else {
            btnToggleCorrect.classList.remove("btn-toggle-active");
            btnToggleCorrect.classList.add("btn-secondary");
            btnToggleCorrect.innerHTML = `
                <svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" stroke="currentColor"/></svg>
                BG Correction: OFF
            `;
        }
        render2DBackgroundAndSample();
    });

    selectDisplayMode.addEventListener("change", render2DBackgroundAndSample);
    selectAlgorithm.addEventListener("change", render2DBackgroundAndSample);

    // Re-run simulator rendering when single pixel sliders change because swing or noise changes affect full-field maps
    sliderSwing.addEventListener("input", () => {
        recordBackgroundReferenceStack();
        render2DBackgroundAndSample();
    });
    sliderNoise.addEventListener("input", render2DBackgroundAndSample);

    // -------------------------------------------------------------
    // Initialization
    // -------------------------------------------------------------
    try {
        updateSinglePixelSimulation();
        initSimulator();
    } catch (err) {
        console.error("Initialization failed: ", err);
        const mathPanel = document.getElementById("single-pixel-math");
        if (mathPanel) {
            mathPanel.innerHTML = `<span style="color:#ef4444; font-weight:bold;">Initialization Error:</span> ${err.message}\n\nStack Trace:\n${err.stack}`;
        }
    }
}

if (document.readyState !== "loading") {
    runEngine();
} else {
    document.addEventListener("DOMContentLoaded", runEngine);
}
