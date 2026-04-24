export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div
      className="relative min-h-screen overflow-hidden p-6"
      style={{
        background: '#111D3E',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* School supplies scatter — SVG background */}
      <svg
        viewBox="0 0 800 550"
        xmlns="http://www.w3.org/2000/svg"
        className="pointer-events-none absolute inset-0 h-full w-full"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <filter id="ds1" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow
              dx="3"
              dy="5"
              stdDeviation="4"
              floodColor="#000"
              floodOpacity="0.35"
            />
          </filter>
          <filter id="ds2" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow
              dx="2"
              dy="4"
              stdDeviation="3"
              floodColor="#000"
              floodOpacity="0.3"
            />
          </filter>
          <filter id="ds3" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow
              dx="1"
              dy="2"
              stdDeviation="2"
              floodColor="#000"
              floodOpacity="0.25"
            />
          </filter>
          <filter id="stickyShadow">
            <feDropShadow
              dx="3"
              dy="5"
              stdDeviation="5"
              floodColor="#000"
              floodOpacity="0.22"
            />
          </filter>

          <linearGradient id="pencilBody" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#E8B820" />
            <stop offset="20%" stopColor="#F5C842" />
            <stop offset="50%" stopColor="#FFE066" />
            <stop offset="80%" stopColor="#F5C842" />
            <stop offset="100%" stopColor="#D4A010" />
          </linearGradient>
          <linearGradient id="pencilTip" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#C4906A" />
            <stop offset="50%" stopColor="#E8B090" />
            <stop offset="100%" stopColor="#A06040" />
          </linearGradient>
          <linearGradient id="ferrule" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#999" />
            <stop offset="30%" stopColor="#DDD" />
            <stop offset="60%" stopColor="#BBB" />
            <stop offset="100%" stopColor="#888" />
          </linearGradient>
          <linearGradient id="eraserPink" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#E8A0B8" />
            <stop offset="40%" stopColor="#F8B4C8" />
            <stop offset="100%" stopColor="#D890A8" />
          </linearGradient>

          <linearGradient id="redMarker" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#B82020" />
            <stop offset="25%" stopColor="#E03030" />
            <stop offset="50%" stopColor="#F04848" />
            <stop offset="75%" stopColor="#D03030" />
            <stop offset="100%" stopColor="#A01818" />
          </linearGradient>
          <linearGradient id="blueMarker" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#1A3A8A" />
            <stop offset="25%" stopColor="#2D5FA6" />
            <stop offset="50%" stopColor="#5080C8" />
            <stop offset="75%" stopColor="#2D5FA6" />
            <stop offset="100%" stopColor="#1A3070" />
          </linearGradient>
          <linearGradient id="greenMarker" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#178060" />
            <stop offset="25%" stopColor="#22A878" />
            <stop offset="50%" stopColor="#30C890" />
            <stop offset="75%" stopColor="#22A878" />
            <stop offset="100%" stopColor="#148058" />
          </linearGradient>
          <linearGradient id="purpleMarker" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#5A1A8A" />
            <stop offset="25%" stopColor="#7A30AA" />
            <stop offset="50%" stopColor="#9A50C8" />
            <stop offset="75%" stopColor="#7A30AA" />
            <stop offset="100%" stopColor="#501878" />
          </linearGradient>
          <linearGradient id="orangeMarker" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#B85010" />
            <stop offset="25%" stopColor="#D86820" />
            <stop offset="50%" stopColor="#F08030" />
            <stop offset="75%" stopColor="#D06018" />
            <stop offset="100%" stopColor="#A04010" />
          </linearGradient>

          <linearGradient id="rulerGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#D8EEFF" stopOpacity="0.95" />
            <stop offset="40%" stopColor="#EEF6FF" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#C0DCFA" stopOpacity="0.88" />
          </linearGradient>

          <linearGradient id="stickyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFE44A" />
            <stop offset="100%" stopColor="#FFD020" />
          </linearGradient>

          <linearGradient id="clipMetal" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#7090B8" />
            <stop offset="30%" stopColor="#B0CCE8" />
            <stop offset="55%" stopColor="#D8EAFF" />
            <stop offset="80%" stopColor="#90AACC" />
            <stop offset="100%" stopColor="#6080A8" />
          </linearGradient>

          <linearGradient id="eraserBlock" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F0C0D4" />
            <stop offset="50%" stopColor="#F8D0E0" />
            <stop offset="100%" stopColor="#E0A8BC" />
          </linearGradient>
          <linearGradient id="eraserBand" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#C090C8" />
            <stop offset="50%" stopColor="#D0A8D8" />
            <stop offset="100%" stopColor="#A870B8" />
          </linearGradient>

          <linearGradient id="scissorsMetal" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#8898A8" />
            <stop offset="40%" stopColor="#C8D8E8" />
            <stop offset="70%" stopColor="#A8B8C8" />
            <stop offset="100%" stopColor="#7888A0" />
          </linearGradient>
          <linearGradient id="scissorsHandle" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#2050A0" />
            <stop offset="40%" stopColor="#4A90D9" />
            <stop offset="100%" stopColor="#184080" />
          </linearGradient>

          <radialGradient id="pinHead" cx="40%" cy="35%" r="60%">
            <stop offset="0%" stopColor="#FF6666" />
            <stop offset="60%" stopColor="#D93030" />
            <stop offset="100%" stopColor="#8B1010" />
          </radialGradient>
          <radialGradient id="pinBlue" cx="38%" cy="32%" r="62%">
            <stop offset="0%" stopColor="#6AAAF8" />
            <stop offset="60%" stopColor="#2D5FA6" />
            <stop offset="100%" stopColor="#102060" />
          </radialGradient>
          <radialGradient id="pinRed2" cx="38%" cy="32%" r="62%">
            <stop offset="0%" stopColor="#FF7070" />
            <stop offset="60%" stopColor="#CC2020" />
            <stop offset="100%" stopColor="#7A0808" />
          </radialGradient>
        </defs>

        {/* TOP EDGE */}
        <g transform="translate(8,6) rotate(1.5)" filter="url(#ds3)">
          <rect
            x="0"
            y="0"
            width="520"
            height="26"
            rx="2"
            fill="url(#rulerGrad)"
            stroke="#9AC0E8"
            strokeWidth="1"
          />
          {Array.from({ length: 53 }).map((_, i) => (
            <line
              key={i}
              x1={i * 10 + 2}
              y1="2"
              x2={i * 10 + 2}
              y2={i % 10 === 0 ? 20 : i % 5 === 0 ? 14 : 8}
              stroke="#3A70B8"
              strokeWidth={i % 10 === 0 ? 1.2 : 0.8}
              opacity="0.6"
            />
          ))}
          {[0, 10, 20, 30, 40, 50].map((n, i) => (
            <text
              key={i}
              x={n * 10 + 5}
              y="22"
              fontSize="8"
              fill="#2A5898"
              fontFamily="sans-serif"
              opacity="0.8"
            >
              {n}
            </text>
          ))}
          <rect
            x="0"
            y="0"
            width="520"
            height="6"
            rx="2"
            fill="rgba(255,255,255,0.4)"
          />
        </g>

        <g transform="translate(30,42) rotate(-26)" filter="url(#ds1)">
          <rect
            x="0"
            y="0"
            width="16"
            height="18"
            rx="2"
            fill="url(#eraserPink)"
          />
          <rect
            x="0"
            y="0"
            width="16"
            height="5"
            rx="2"
            fill="rgba(255,255,255,0.2)"
          />
          <rect x="0" y="16" width="16" height="9" fill="url(#ferrule)" />
          <line
            x1="0"
            y1="18"
            x2="16"
            y2="18"
            stroke="rgba(0,0,0,0.15)"
            strokeWidth="0.8"
          />
          <line
            x1="0"
            y1="21"
            x2="16"
            y2="21"
            stroke="rgba(0,0,0,0.1)"
            strokeWidth="0.6"
          />
          <rect x="0" y="25" width="16" height="108" fill="url(#pencilBody)" />
          <line
            x1="5.3"
            y1="25"
            x2="5.3"
            y2="133"
            stroke="rgba(0,0,0,0.08)"
            strokeWidth="0.7"
          />
          <line
            x1="10.7"
            y1="25"
            x2="10.7"
            y2="133"
            stroke="rgba(0,0,0,0.08)"
            strokeWidth="0.7"
          />
          <rect x="1" y="133" width="14" height="14" fill="url(#pencilTip)" />
          <polygon points="0,147 16,147 8,162" fill="url(#pencilBody)" />
          <polygon points="3,153 13,153 8,162" fill="url(#pencilTip)" />
          <polygon points="5.5,157 10.5,157 8,162" fill="#444" />
          <rect
            x="1"
            y="25"
            width="3"
            height="108"
            fill="rgba(255,255,255,0.18)"
            rx="1"
          />
        </g>

        <g transform="translate(105,28) rotate(4)" filter="url(#ds2)">
          <rect
            x="0"
            y="10"
            width="52"
            height="28"
            rx="2"
            fill="#222"
            stroke="#444"
            strokeWidth="0.8"
          />
          <line
            x1="0"
            y1="17"
            x2="52"
            y2="17"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="0.8"
          />
          <line
            x1="0"
            y1="24"
            x2="52"
            y2="24"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="0.8"
          />
          <line
            x1="0"
            y1="31"
            x2="52"
            y2="31"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="0.8"
          />
          <polygon
            points="10,10 26,0 42,10"
            fill="#3A3A3A"
            stroke="#555"
            strokeWidth="0.8"
          />
          <path
            d="M12,1 C10,-4 4,-16 4,-22"
            fill="none"
            stroke="url(#clipMetal)"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M40,1 C42,-4 48,-16 48,-22"
            fill="none"
            stroke="url(#clipMetal)"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <rect
            x="2"
            y="12"
            width="48"
            height="5"
            rx="1"
            fill="rgba(255,255,255,0.06)"
          />
        </g>

        <g transform="translate(390,16)" filter="url(#ds3)">
          <circle cx="11" cy="11" r="11" fill="url(#pinHead)" />
          <circle cx="7" cy="7" r="3.5" fill="rgba(255,255,255,0.3)" />
          <line
            x1="11"
            y1="22"
            x2="11"
            y2="42"
            stroke="#C8C8CC"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <line
            x1="11"
            y1="22"
            x2="11"
            y2="42"
            stroke="url(#clipMetal)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </g>

        <g transform="translate(560,4) rotate(17)" filter="url(#ds1)">
          <rect
            x="0"
            y="0"
            width="15"
            height="30"
            rx="7"
            fill="url(#blueMarker)"
          />
          <rect
            x="1"
            y="0"
            width="4"
            height="30"
            rx="2"
            fill="rgba(255,255,255,0.12)"
          />
          <rect
            x="2"
            y="2"
            width="2"
            height="15"
            rx="1"
            fill="rgba(255,255,255,0.22)"
          />
          <rect
            x="0"
            y="30"
            width="15"
            height="80"
            rx="3"
            fill="url(#blueMarker)"
          />
          <rect
            x="1"
            y="30"
            width="4"
            height="80"
            fill="rgba(255,255,255,0.08)"
          />
          <rect x="0" y="95" width="15" height="16" rx="2" fill="#0E2860" />
          <rect x="2" y="111" width="11" height="12" rx="4" fill="#1A3A80" />
          <polygon points="3,123 12,123 7.5,136" fill="#1A3A80" />
          <polygon points="5,130 10,130 7.5,136" fill="#C07050" />
          <rect
            x="1"
            y="30"
            width="3"
            height="80"
            rx="1"
            fill="rgba(255,255,255,0.14)"
          />
        </g>

        <g transform="translate(644,8) rotate(-20)" filter="url(#ds2)">
          <rect
            x="0"
            y="0"
            width="13"
            height="14"
            rx="2"
            fill="url(#eraserPink)"
          />
          <rect x="0" y="12" width="13" height="8" fill="url(#ferrule)" />
          <rect x="0" y="20" width="13" height="88" fill="url(#pencilBody)" />
          <line
            x1="4.3"
            y1="20"
            x2="4.3"
            y2="108"
            stroke="rgba(0,0,0,0.08)"
            strokeWidth="0.6"
          />
          <line
            x1="8.7"
            y1="20"
            x2="8.7"
            y2="108"
            stroke="rgba(0,0,0,0.08)"
            strokeWidth="0.6"
          />
          <rect x="1.5" y="108" width="10" height="11" fill="url(#pencilTip)" />
          <polygon points="0,119 13,119 6.5,132" fill="url(#pencilBody)" />
          <polygon points="3,125 10,125 6.5,132" fill="url(#pencilTip)" />
          <polygon points="5,128 8,128 6.5,132" fill="#444" />
          <rect
            x="1"
            y="20"
            width="2.5"
            height="88"
            fill="rgba(255,255,255,0.15)"
            rx="1"
          />
        </g>

        <g transform="translate(714,12) rotate(13)" filter="url(#ds1)">
          <rect
            x="0"
            y="0"
            width="16"
            height="28"
            rx="8"
            fill="url(#purpleMarker)"
          />
          <rect
            x="1"
            y="0"
            width="5"
            height="28"
            rx="3"
            fill="rgba(255,255,255,0.12)"
          />
          <rect
            x="0"
            y="26"
            width="16"
            height="80"
            rx="2"
            fill="url(#purpleMarker)"
          />
          <rect
            x="1"
            y="26"
            width="4"
            height="80"
            fill="rgba(255,255,255,0.07)"
          />
          <rect x="2" y="98" width="12" height="10" rx="3" fill="#380A5A" />
          <polygon points="3,108 13,108 8,122" fill="#380A5A" />
          <polygon points="5,115 11,115 8,122" fill="#C07050" />
          <rect
            x="1"
            y="26"
            width="3"
            height="80"
            rx="1"
            fill="rgba(255,255,255,0.12)"
          />
        </g>

        <g transform="translate(758,30) rotate(18)" filter="url(#ds3)">
          <path
            d="M8,0 C4,0 0,3 0,7 L0,32 C0,38 4,42 8,42 C12,42 16,38 16,32 L16,11 C16,6 12,2 9,2 C6,2 4,5 4,9 L4,30 C4,32 5.5,34 8,34 C10.5,34 12,32 12,30 L12,14"
            fill="none"
            stroke="url(#clipMetal)"
            strokeWidth="2.8"
            strokeLinecap="round"
          />
        </g>

        {/* LEFT EDGE */}
        <g transform="translate(8,240) rotate(72)" filter="url(#ds1)">
          <rect
            x="0"
            y="0"
            width="16"
            height="28"
            rx="8"
            fill="url(#redMarker)"
          />
          <rect
            x="1"
            y="0"
            width="5"
            height="28"
            rx="3"
            fill="rgba(255,255,255,0.15)"
          />
          <rect
            x="0"
            y="26"
            width="16"
            height="82"
            rx="2"
            fill="url(#redMarker)"
          />
          <rect
            x="1"
            y="26"
            width="5"
            height="82"
            fill="rgba(255,255,255,0.08)"
          />
          <rect x="2" y="100" width="12" height="10" rx="3" fill="#7A0808" />
          <polygon points="3,110 13,110 8,124" fill="#7A0808" />
          <polygon points="5,117 11,117 8,124" fill="#C07050" />
          <rect
            x="1"
            y="26"
            width="3"
            height="82"
            rx="1"
            fill="rgba(255,255,255,0.12)"
          />
        </g>

        <g transform="translate(18,360) rotate(-12)" filter="url(#ds1)">
          <rect
            x="0"
            y="0"
            width="16"
            height="28"
            rx="8"
            fill="url(#greenMarker)"
          />
          <rect
            x="1"
            y="0"
            width="5"
            height="28"
            rx="3"
            fill="rgba(255,255,255,0.15)"
          />
          <rect
            x="0"
            y="26"
            width="16"
            height="90"
            rx="2"
            fill="url(#greenMarker)"
          />
          <rect
            x="1"
            y="26"
            width="5"
            height="90"
            fill="rgba(255,255,255,0.08)"
          />
          <rect x="2" y="108" width="12" height="10" rx="3" fill="#0A4A2A" />
          <polygon points="3,118 13,118 8,132" fill="#0A4A2A" />
          <polygon points="5,125 11,125 8,132" fill="#C07050" />
          <rect
            x="1"
            y="26"
            width="3"
            height="90"
            rx="1"
            fill="rgba(255,255,255,0.12)"
          />
        </g>

        <g transform="translate(55,295) rotate(-14)" filter="url(#ds3)">
          <path
            d="M7,0 C3.5,0 0,2.5 0,6 L0,26 C0,31 3,34 7,34 C11,34 14,31 14,26 L14,9 C14,5.5 11.5,2 8,2 C5,2 3.5,4.5 3.5,8 L3.5,24 C3.5,26 5,28 7,28 C9,28 10.5,26 10.5,24 L10.5,12"
            fill="none"
            stroke="#E88898"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </g>

        <g transform="translate(10,420) rotate(-5)" filter="url(#stickyShadow)">
          <path
            d="M0,0 L86,0 L86,88 L6,88 Q0,88 0,82 Z"
            fill="#E8C000"
            opacity="0.4"
            transform="translate(4,4)"
          />
          <rect x="0" y="0" width="86" height="88" fill="url(#stickyGrad)" />
          <line
            x1="0"
            y1="10"
            x2="86"
            y2="10"
            stroke="rgba(0,0,0,0.06)"
            strokeWidth="1"
          />
          {[22, 32, 42, 52, 62, 72].map((y) => (
            <line
              key={y}
              x1="10"
              y1={y}
              x2="76"
              y2={y}
              stroke="rgba(0,0,0,0.09)"
              strokeWidth="0.9"
            />
          ))}
          <path d="M64,88 Q86,80 86,60 L86,88 Z" fill="rgba(0,0,0,0.08)" />
          <rect
            x="0"
            y="0"
            width="86"
            height="4"
            fill="rgba(255,255,255,0.35)"
          />
        </g>

        {/* RIGHT EDGE */}
        <g transform="translate(756,95) rotate(-48)" filter="url(#ds1)">
          <rect
            x="0"
            y="0"
            width="16"
            height="28"
            rx="8"
            fill="url(#orangeMarker)"
          />
          <rect
            x="1"
            y="0"
            width="5"
            height="28"
            rx="3"
            fill="rgba(255,255,255,0.15)"
          />
          <rect
            x="0"
            y="26"
            width="16"
            height="80"
            rx="2"
            fill="url(#orangeMarker)"
          />
          <rect
            x="1"
            y="26"
            width="5"
            height="80"
            fill="rgba(255,255,255,0.08)"
          />
          <rect x="2" y="98" width="12" height="10" rx="3" fill="#6A2808" />
          <polygon points="3,108 13,108 8,122" fill="#6A2808" />
          <polygon points="5,115 11,115 8,122" fill="#C07050" />
          <rect
            x="1"
            y="26"
            width="3"
            height="80"
            rx="1"
            fill="rgba(255,255,255,0.12)"
          />
        </g>

        <g transform="translate(748,198) rotate(24)" filter="url(#ds2)">
          <path
            d="M10,0 C5,0 0,4 0,9 L0,40 C0,48 5,53 10,53 C16,53 20,48 20,40 L20,15 C20,8.5 16,3 11,3 C6.5,3 4,7 4,12 L4,38 C4,42 6,44 10,44 C14,44 16,42 16,38 L16,18"
            fill="none"
            stroke="url(#clipMetal)"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
        </g>

        <g transform="translate(736,320) rotate(-22)" filter="url(#ds2)">
          <ellipse
            cx="10"
            cy="10"
            rx="9.5"
            ry="12"
            fill="none"
            stroke="url(#scissorsHandle)"
            strokeWidth="2.5"
          />
          <ellipse
            cx="28"
            cy="10"
            rx="9.5"
            ry="12"
            fill="none"
            stroke="url(#scissorsHandle)"
            strokeWidth="2.5"
          />
          <path
            d="M10,22 L24,55"
            fill="none"
            stroke="url(#scissorsMetal)"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M28,22 L14,55"
            fill="none"
            stroke="url(#scissorsMetal)"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <circle cx="19" cy="38" r="3.5" fill="#C8D8E8" />
          <circle cx="19" cy="38" r="2" fill="#A0B0C0" />
          <circle cx="19" cy="38" r="0.8" fill="#606878" />
          <path
            d="M11,24 L22,50"
            fill="none"
            stroke="rgba(255,255,255,0.25)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </g>

        <g transform="translate(686,466) rotate(11)" filter="url(#ds2)">
          <rect
            x="3"
            y="5"
            width="76"
            height="32"
            rx="4"
            fill="rgba(0,0,0,0.2)"
            filter="url(#ds3)"
          />
          <rect
            x="0"
            y="0"
            width="76"
            height="30"
            rx="4"
            fill="url(#eraserBlock)"
          />
          <rect
            x="0"
            y="0"
            width="19"
            height="30"
            rx="4"
            fill="url(#eraserBand)"
          />
          <rect x="19" y="0" width="1.5" height="30" fill="rgba(0,0,0,0.12)" />
          <text
            x="24"
            y="19"
            fontSize="9.5"
            fill="rgba(255,255,255,0.72)"
            fontFamily="sans-serif"
            fontWeight="700"
            letterSpacing="0.05em"
          >
            ERASER
          </text>
          <rect
            x="0"
            y="0"
            width="76"
            height="7"
            rx="4"
            fill="rgba(255,255,255,0.22)"
          />
          <rect
            x="2"
            y="2"
            width="4"
            height="20"
            rx="2"
            fill="rgba(255,255,255,0.15)"
          />
        </g>

        <g transform="translate(758,438)" filter="url(#ds3)">
          <circle cx="10" cy="10" r="10" fill="url(#pinBlue)" />
          <circle cx="6.5" cy="6.5" r="3" fill="rgba(255,255,255,0.28)" />
          <line
            x1="10"
            y1="20"
            x2="10"
            y2="38"
            stroke="#C8C8CC"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </g>

        {/* BOTTOM EDGE */}
        <g transform="translate(56,520) rotate(-0.8)" filter="url(#ds3)">
          <rect
            x="0"
            y="0"
            width="480"
            height="24"
            rx="2"
            fill="url(#rulerGrad)"
            stroke="#9AC0E8"
            strokeWidth="1"
          />
          {Array.from({ length: 49 }).map((_, i) => (
            <line
              key={i}
              x1={i * 10 + 2}
              y1="24"
              x2={i * 10 + 2}
              y2={i % 10 === 0 ? 6 : i % 5 === 0 ? 11 : 17}
              stroke="#3A70B8"
              strokeWidth={i % 10 === 0 ? 1.2 : 0.8}
              opacity="0.6"
            />
          ))}
          {[0, 5, 10, 15, 20, 25, 30, 35, 40, 45].map((n, i) => (
            <text
              key={i}
              x={n * 10 + 5}
              y="9"
              fontSize="7.5"
              fill="#2A5898"
              fontFamily="sans-serif"
              opacity="0.75"
            >
              {n}
            </text>
          ))}
          <rect
            x="0"
            y="0"
            width="480"
            height="5"
            rx="2"
            fill="rgba(255,255,255,0.38)"
          />
        </g>

        <g transform="translate(596,484) rotate(-7)" filter="url(#ds2)">
          <rect
            x="0"
            y="10"
            width="50"
            height="26"
            rx="2"
            fill="#1A1A1A"
            stroke="#3A3A3A"
            strokeWidth="0.8"
          />
          <line
            x1="0"
            y1="17"
            x2="50"
            y2="17"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="0.8"
          />
          <line
            x1="0"
            y1="24"
            x2="50"
            y2="24"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="0.8"
          />
          <polygon
            points="9,10 25,0 41,10"
            fill="#2E2E2E"
            stroke="#484848"
            strokeWidth="0.8"
          />
          <path
            d="M11,1 C9,-4 3.5,-16 3,-22"
            fill="none"
            stroke="url(#clipMetal)"
            strokeWidth="2.8"
            strokeLinecap="round"
          />
          <path
            d="M39,1 C41,-4 46.5,-16 47,-22"
            fill="none"
            stroke="url(#clipMetal)"
            strokeWidth="2.8"
            strokeLinecap="round"
          />
          <rect
            x="2"
            y="12"
            width="46"
            height="5"
            rx="1"
            fill="rgba(255,255,255,0.05)"
          />
        </g>

        <g transform="translate(140,498)" filter="url(#ds3)">
          <circle cx="10" cy="10" r="10" fill="url(#pinRed2)" />
          <circle cx="6.5" cy="6.5" r="3" fill="rgba(255,255,255,0.28)" />
          <line
            x1="10"
            y1="20"
            x2="10"
            y2="36"
            stroke="#C8C8CC"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </g>

        <g transform="translate(476,495) rotate(7)" filter="url(#ds1)">
          <rect
            x="0"
            y="0"
            width="15"
            height="16"
            rx="2"
            fill="url(#eraserPink)"
          />
          <rect x="0" y="14" width="15" height="9" fill="url(#ferrule)" />
          <rect x="0" y="23" width="15" height="96" fill="url(#pencilBody)" />
          <line
            x1="5"
            y1="23"
            x2="5"
            y2="119"
            stroke="rgba(0,0,0,0.08)"
            strokeWidth="0.6"
          />
          <line
            x1="10"
            y1="23"
            x2="10"
            y2="119"
            stroke="rgba(0,0,0,0.08)"
            strokeWidth="0.6"
          />
          <rect x="1.5" y="119" width="12" height="12" fill="url(#pencilTip)" />
          <polygon points="0,131 15,131 7.5,146" fill="url(#pencilBody)" />
          <polygon points="3,138 12,138 7.5,146" fill="url(#pencilTip)" />
          <polygon points="5.5,142 9.5,142 7.5,146" fill="#444" />
          <rect
            x="1.5"
            y="23"
            width="3"
            height="96"
            fill="rgba(255,255,255,0.16)"
            rx="1"
          />
        </g>
      </svg>

      {/* Card content */}
      <div className="relative z-10 w-full" style={{ maxWidth: 480 }}>
        {children}
      </div>
    </div>
  )
}
