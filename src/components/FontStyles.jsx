import { PALETTE } from '../theme.js';


function FontStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,800;1,9..144,400;1,9..144,600&family=Manrope:wght@300;400;500;600;700;800&family=Heebo:wght@300;400;500;600;700;800&family=Noto+Serif+Hebrew:wght@400;600;800&display=swap');

      .f-display { font-family: 'Fraunces', 'Noto Serif Hebrew', Georgia, serif; font-optical-sizing: auto; font-variation-settings: 'opsz' 144; letter-spacing: -0.02em; }
      .f-italic { font-family: 'Fraunces', 'Noto Serif Hebrew', Georgia, serif; font-style: italic; font-variation-settings: 'opsz' 144; letter-spacing: -0.01em; }
      .f-body { font-family: 'Manrope', 'Heebo', system-ui, sans-serif; }
      .f-mono { font-family: 'Manrope', 'Heebo', system-ui, sans-serif; font-feature-settings: 'tnum' 1; letter-spacing: 0.04em; }

      [dir="rtl"] .f-display, [dir="rtl"] .f-italic { font-family: 'Noto Serif Hebrew', 'Fraunces', Georgia, serif; }
      [dir="rtl"] .f-body, [dir="rtl"] .f-mono { font-family: 'Heebo', 'Manrope', system-ui, sans-serif; }

      .grain::before {
        content: '';
        position: absolute; inset: 0;
        background-image: radial-gradient(rgba(27,27,25,0.18) 1px, transparent 1px);
        background-size: 3px 3px;
        opacity: 0.18;
        pointer-events: none;
        mix-blend-mode: multiply;
      }

      .underline-hover { background-image: linear-gradient(currentColor, currentColor); background-size: 0 1px; background-repeat: no-repeat; background-position: 0 100%; transition: background-size .35s ease; }
      .underline-hover:hover { background-size: 100% 1px; }

      .card-tilt { transition: transform .4s cubic-bezier(.2,.8,.2,1), box-shadow .4s ease; }
      .card-tilt:hover { transform: translateY(-4px); }

      @keyframes rise {
        from { opacity: 0; transform: translateY(14px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .rise { animation: rise .7s cubic-bezier(.2,.8,.2,1) both; }

      @keyframes flash {
        0% { opacity: 0.3; }
        100% { opacity: 1; }
      }
      .meal-flash { animation: flash .35s ease-out; }

      /* Make the YouTube IFrame-API player fill its 16:9 container */
      .vid-embed iframe { position: absolute; inset: 0; width: 100% !important; height: 100% !important; border: 0; }

      .ticker-line { background: repeating-linear-gradient(90deg, ${PALETTE.ink} 0 6px, transparent 6px 12px); height: 1px; }

      .meal-row { transition: background-color .25s ease; cursor: pointer; }
      .meal-row:hover { background-color: rgba(242,235,221,0.06); }
      .meal-row .swap-icon { opacity: 0.3; transition: opacity .25s ease, transform .35s ease; }
      .meal-row:hover .swap-icon { opacity: 1; transform: rotate(-90deg); }

      .num-input {
        font-family: 'Fraunces', 'Noto Serif Hebrew', Georgia, serif;
        font-variation-settings: 'opsz' 144;
        letter-spacing: -0.03em;
        background: transparent; border: none; outline: none;
        width: 100%; font-weight: 700; line-height: 1;
        color: ${PALETTE.ink};
      }
      .num-input::placeholder { color: ${PALETTE.ink}; opacity: 0.25; }
      .num-input::-webkit-outer-spin-button, .num-input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
      .num-input[type=number] { -moz-appearance: textfield; }

      .icon-btn {
        display: inline-flex; align-items: center; justify-content: center;
        width: 28px; height: 28px;
        border-radius: 50%;
        border: 1px solid currentColor;
        opacity: 0.55;
        transition: opacity .2s ease, transform .2s ease, background-color .2s ease;
        flex-shrink: 0;
        cursor: pointer;
      }
      .icon-btn:hover { opacity: 1; transform: scale(1.05); }

      .complete-circle {
        display: inline-flex; align-items: center; justify-content: center;
        width: 22px; height: 22px;
        border-radius: 50%;
        border: 1.5px solid currentColor;
        opacity: 0.5;
        transition: opacity .2s ease, background-color .2s ease;
        flex-shrink: 0;
        cursor: pointer;
        background: transparent;
      }
      .complete-circle:hover { opacity: 1; }
      .complete-circle.is-done { opacity: 1; background: ${PALETTE.sage}; border-color: ${PALETTE.sage}; }

      .ex-done .ex-name { text-decoration: line-through; opacity: 0.55; }

      @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
      }
      .timer-pulse { animation: pulse 1s ease-in-out infinite; }

      /* Rest timer duration slider */
      .rest-slider {
        -webkit-appearance: none;
        appearance: none;
        width: 100%;
        height: 4px;
        background: rgba(242,235,221,0.18);
        border-radius: 999px;
        outline: none;
        cursor: pointer;
        margin: 0;
      }
      .rest-slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 18px; height: 18px;
        background: ${PALETTE.sage};
        border: 2px solid ${PALETTE.cream};
        border-radius: 50%;
        cursor: pointer;
        transition: transform .15s ease;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      }
      .rest-slider::-webkit-slider-thumb:hover { transform: scale(1.18); }
      .rest-slider::-moz-range-thumb {
        width: 18px; height: 18px;
        background: ${PALETTE.sage};
        border: 2px solid ${PALETTE.cream};
        border-radius: 50%;
        cursor: pointer;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      }

      /* Print: clean PDF-ready output */
      @media print {
        @page { margin: 16mm; }
        html, body { background: white !important; }
        body * { box-shadow: none !important; }
        .no-print { display: none !important; }
        .grain::before { display: none !important; }
        .card-tilt { transform: none !important; }
        .rise { animation: none !important; }
        section, header, footer { page-break-inside: avoid; }
        .day-card { page-break-inside: avoid; }
        .ticker-line { background: none !important; border-top: 1px solid #1B1B19; height: 0 !important; }
        a { color: inherit !important; text-decoration: none !important; }
      }
    `}</style>
  );
}

export { FontStyles };
