import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.resolve(__dirname, '../public');

// Generate the new official Aazam Travel Agency SVG matching user's exact uploaded image
function getLogoSvg(includeText = true) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
  <defs>
    <!-- Globe Ocean Gradient -->
    <linearGradient id="globeBlue" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#42A5F5" />
      <stop offset="50%" stop-color="#1E88E5" />
      <stop offset="100%" stop-color="#1565C0" />
    </linearGradient>

    <!-- Train Body Gradient -->
    <linearGradient id="trainGreen" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#54B457" />
      <stop offset="50%" stop-color="#3FA643" />
      <stop offset="100%" stop-color="#2E8632" />
    </linearGradient>

    <!-- Train Roof Highlight -->
    <linearGradient id="roofHighlight" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#81C784" />
      <stop offset="100%" stop-color="#4CAF50" />
    </linearGradient>

    <!-- Bus Gradient -->
    <linearGradient id="busRed" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#EF5350" />
      <stop offset="50%" stop-color="#E53935" />
      <stop offset="100%" stop-color="#C62828" />
    </linearGradient>

    <!-- Airplane Red Gradient -->
    <linearGradient id="planeRed" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#EF5350" />
      <stop offset="100%" stop-color="#C62828" />
    </linearGradient>

    <!-- Soft Drop Shadow -->
    <filter id="softShadow" x="-15%" y="-15%" width="130%" height="130%">
      <feDropShadow dx="0" dy="4" stdDeviation="4" flood-opacity="0.18" />
    </filter>
  </defs>

  <g id="illustration-group" transform="translate(0, ${includeText ? 0 : 35})">
    <!-- ==========================================
         1. GLOBE & ORBITING FLIGHT ARROW
         ========================================== -->
    <g id="globe-system">
      <!-- Back / Orbit Arrow Path Behind Globe -->
      <path 
        d="M 185 240 C 170 195 200 150 250 148 C 285 146 315 160 330 180" 
        fill="none" 
        stroke="#42A5F5" 
        stroke-width="5" 
        stroke-linecap="round"
        opacity="0.9"
      />

      <!-- Globe Sphere -->
      <circle cx="250" cy="210" r="68" fill="url(#globeBlue)" />

      <!-- Continents (Vibrant Green Landmasses) -->
      <g fill="#4CAF50">
        <!-- North America / Eurasia -->
        <path d="M 210 170 Q 230 160 255 168 Q 280 175 295 190 Q 280 205 260 200 Q 240 215 220 205 Q 200 190 210 170 Z" />
        <!-- Africa / South Asia -->
        <path d="M 235 210 Q 260 212 275 225 Q 285 245 265 260 Q 245 265 235 245 Q 225 225 235 210 Z" />
        <!-- East Asia / Island clusters -->
        <path d="M 285 185 Q 305 180 310 195 Q 312 215 300 220 Q 285 210 285 185 Z" />
        <!-- Far right land rim -->
        <path d="M 312 215 Q 318 220 315 235 Q 308 245 302 240 Z" />
      </g>

      <!-- Atmosphere shine curve -->
      <path 
        d="M 195 175 A 68 68 0 0 1 295 155" 
        fill="none" 
        stroke="#FFFFFF" 
        stroke-width="3" 
        stroke-linecap="round" 
        opacity="0.35" 
      />

      <!-- Orbit Swoosh in Front of Globe -->
      <!-- Wide curved arrow loop starting at bottom-left, curving up to top-right -->
      <path 
        d="M 185 245 C 175 200 200 155 250 148 C 280 144 315 155 335 178" 
        fill="none" 
        stroke="#38BDF8" 
        stroke-width="6.5" 
        stroke-linecap="round"
      />
      <!-- Arrow Head at top right orbit termination -->
      <polygon points="340,175 328,168 335,185" fill="#38BDF8" />
      
      <!-- Second orbit accent arrow line -->
      <path 
        d="M 198 250 C 185 215 205 175 245 168 C 270 164 298 172 318 190" 
        fill="none" 
        stroke="#FFFFFF" 
        stroke-width="2.5" 
        stroke-dasharray="8 5"
        stroke-linecap="round"
        opacity="0.9"
      />
      <polygon points="323,188 313,182 318,196" fill="#FFFFFF" opacity="0.9" />
    </g>

    <!-- ==========================================
         2. AIRPLANE (Flying toward top right)
         ========================================== -->
    <g id="airplane" transform="translate(305, 140) rotate(-22)" filter="url(#softShadow)">
      <!-- Jet Fuselage -->
      <path 
        d="M 0 16 C 18 10 52 8 68 15 C 60 21 24 25 0 16 Z" 
        fill="url(#planeRed)" 
        stroke="#FFFFFF" 
        stroke-width="1.2"
      />
      <!-- Left Main Wing -->
      <path d="M 28 12 L 14 -22 L 25 -22 L 42 12 Z" fill="#D32F2F" stroke="#FFFFFF" stroke-width="0.8" />
      <!-- Right Main Wing -->
      <path d="M 32 18 L 18 46 L 28 46 L 45 18 Z" fill="#B71C1C" stroke="#FFFFFF" stroke-width="0.8" />
      <!-- Tail Wing / Rudder -->
      <path d="M 5 13 L -8 -3 L 0 -3 L 11 13 Z" fill="#E53935" />
      <path d="M 6 18 L -4 30 L 2 30 L 10 18 Z" fill="#B71C1C" />
      <!-- Jet Engine under left wing -->
      <rect x="23" y="-5" width="9" height="4" rx="2" fill="#9E9E9E" />
      <!-- Cockpit Window Glint -->
      <path d="M 58 13 Q 64 15 60 17 Z" fill="#FFFFFF" />
    </g>

    <!-- ==========================================
         3. HOTEL BUILDING & ROOFTOP SIGNBOARD
         ========================================== -->
    <g id="hotel" transform="translate(322, 185)" filter="url(#softShadow)">
      <!-- Hotel Rooftop Signboard -->
      <rect x="20" y="-18" width="34" height="13" rx="2.5" fill="#D32F2F" stroke="#B71C1C" stroke-width="0.8" />
      <line x1="26" y1="-5" x2="26" y2="0" stroke="#757575" stroke-width="2" />
      <line x1="48" y1="-5" x2="48" y2="0" stroke="#757575" stroke-width="2" />
      <text 
        x="37" 
        y="-9" 
        font-family="system-ui, -apple-system, sans-serif" 
        font-size="7.5" 
        font-weight="900" 
        fill="#FFFFFF" 
        text-anchor="middle" 
        letter-spacing="0.5"
      >
        HOTEL
      </text>

      <!-- Hotel Left Tower (Red Facade) -->
      <rect x="0" y="28" width="38" height="64" rx="2" fill="#E53935" stroke="#C62828" stroke-width="1.2" />
      <!-- Hotel Left Tower Windows (2 columns x 3 rows) -->
      <g fill="#B3E5FC" stroke="#FFFFFF" stroke-width="0.8">
        <rect x="6" y="36" width="9" height="10" rx="1.5" />
        <rect x="22" y="36" width="9" height="10" rx="1.5" />
        <rect x="6" y="52" width="9" height="10" rx="1.5" />
        <rect x="22" y="52" width="9" height="10" rx="1.5" />
        <rect x="6" y="68" width="9" height="10" rx="1.5" />
        <rect x="22" y="68" width="9" height="10" rx="1.5" />
      </g>

      <!-- Hotel Right Tower (Green Wing) -->
      <rect x="36" y="0" width="28" height="92" rx="2" fill="#388E3C" stroke="#2E7D32" stroke-width="1.2" />
      <!-- Hotel Right Tower Windows (1 column x 5 rows) -->
      <g fill="#E0F2F1" stroke="#FFFFFF" stroke-width="0.8">
        <rect x="42" y="8" width="16" height="10" rx="1.5" />
        <rect x="42" y="24" width="16" height="10" rx="1.5" />
        <rect x="42" y="40" width="16" height="10" rx="1.5" />
        <rect x="42" y="56" width="16" height="10" rx="1.5" />
        <rect x="42" y="72" width="16" height="10" rx="1.5" />
      </g>
    </g>

    <!-- ==========================================
         4. HIGH SPEED BULLET TRAIN (Foreground Left)
         ========================================== -->
    <g id="train" transform="translate(100, 240)" filter="url(#softShadow)">
      <!-- Speed Lines Trailing behind train nose to the left -->
      <line x1="-35" y1="46" x2="35" y2="46" stroke="#C62828" stroke-width="3" stroke-linecap="round" />
      <line x1="-20" y1="56" x2="25" y2="56" stroke="#C62828" stroke-width="2.5" stroke-linecap="round" />
      <line x1="-40" y1="68" x2="15" y2="68" stroke="#43A047" stroke-width="2.5" stroke-linecap="round" />

      <!-- Shadow & Ground Track -->
      <ellipse cx="120" cy="85" rx="100" ry="5" fill="#212121" opacity="0.25" />

      <!-- Train Body Structure -->
      <!-- Smooth Aerodynamic Nose Curve (Bullet train profile) -->
      <path 
        d="M 28 66 C 36 45 68 32 120 30 L 210 30 L 210 80 L 58 80 C 40 80 28 75 28 66 Z" 
        fill="url(#trainGreen)" 
        stroke="#2E7D32" 
        stroke-width="1.5"
      />

      <!-- Train Top Roof Highlight Streak -->
      <path 
        d="M 32 64 C 45 44 78 35 140 33 L 208 33" 
        fill="none" 
        stroke="url(#roofHighlight)" 
        stroke-width="3.5" 
        stroke-linecap="round"
      />

      <!-- Red Racing / Speed Stripe along the train side -->
      <path 
        d="M 44 64 C 68 53 105 50 210 50 L 210 57 C 105 57 66 60 44 71 Z" 
        fill="#D32F2F" 
      />

      <!-- Streamlined Driver Windshield (Cyan/Dark Tint Glass) -->
      <path 
        d="M 52 54 C 64 42 88 38 98 38 L 104 38 C 90 48 78 56 64 60 Z" 
        fill="#1E293B" 
        stroke="#4CAF50" 
        stroke-width="1"
      />
      <path 
        d="M 56 52 C 67 43 85 40 94 40 L 95 41 C 83 48 74 54 66 57 Z" 
        fill="#38BDF8" 
        opacity="0.9"
      />

      <!-- Passenger Windows (4 rectangular windows with rounded corners) -->
      <g fill="#1E293B" stroke="#81C784" stroke-width="0.8">
        <rect x="114" y="40" width="16" height="10" rx="2" />
        <rect x="136" y="40" width="16" height="10" rx="2" />
        <rect x="158" y="40" width="16" height="10" rx="2" />
        <rect x="180" y="40" width="16" height="10" rx="2" />
      </g>
      <!-- Passenger Windows Glass Reflection -->
      <g fill="#81D4FA">
        <rect x="116" y="42" width="12" height="6" rx="1" opacity="0.9" />
        <rect x="138" y="42" width="12" height="6" rx="1" opacity="0.9" />
        <rect x="160" y="42" width="12" height="6" rx="1" opacity="0.9" />
        <rect x="182" y="42" width="12" height="6" rx="1" opacity="0.9" />
      </g>

      <!-- Front Bullet Nose Cap & Headlight -->
      <ellipse cx="32" cy="66" rx="4" ry="6" fill="#FDD835" stroke="#FFFFFF" stroke-width="1" />
      <path d="M 28 66 Q 34 60 38 66 Q 34 72 28 66 Z" fill="#2E7D32" opacity="0.4" />

      <!-- Undercarriage & Wheels / Bogie -->
      <rect x="52" y="78" width="158" height="6" fill="#1E293B" />
      <g fill="#374151" stroke="#9E9E9E" stroke-width="1">
        <circle cx="80" cy="83" r="5" />
        <circle cx="102" cy="83" r="5" />
        <circle cx="155" cy="83" r="5" />
        <circle cx="178" cy="83" r="5" />
      </g>
    </g>

    <!-- ==========================================
         5. RED TOUR BUS (Foreground Right)
         ========================================== -->
    <g id="bus" transform="translate(290, 256)" filter="url(#softShadow)">
      <!-- Ground Shadow -->
      <ellipse cx="60" cy="67" rx="55" ry="4" fill="#212121" opacity="0.25" />

      <!-- Main Bus Body Box -->
      <rect x="0" y="10" width="105" height="46" rx="6" fill="url(#busRed)" stroke="#B71C1C" stroke-width="1.2" />

      <!-- Bus White Roof Header -->
      <path d="M 4 10 L 101 10 Q 105 10 105 14 L 105 17 L 0 17 L 0 14 Q 0 10 4 10 Z" fill="#FFFFFF" opacity="0.4" />

      <!-- Bus Windows (Panoramic glass, 4 main sections) -->
      <g fill="#38BDF8" stroke="#FFFFFF" stroke-width="1.2">
        <rect x="6" y="17" width="18" height="16" rx="2" />
        <rect x="27" y="17" width="16" height="16" rx="2" />
        <rect x="46" y="17" width="16" height="16" rx="2" />
        <rect x="65" y="17" width="16" height="16" rx="2" />
        <rect x="84" y="17" width="15" height="16" rx="2" />
      </g>

      <!-- Glass Highlight Stripes -->
      <line x1="8" y1="21" x2="20" y2="21" stroke="#FFFFFF" stroke-width="1.2" opacity="0.75" />
      <line x1="29" y1="21" x2="39" y2="21" stroke="#FFFFFF" stroke-width="1.2" opacity="0.75" />
      <line x1="48" y1="21" x2="58" y2="21" stroke="#FFFFFF" stroke-width="1.2" opacity="0.75" />
      <line x1="67" y1="21" x2="77" y2="21" stroke="#FFFFFF" stroke-width="1.2" opacity="0.75" />
      <line x1="86" y1="21" x2="95" y2="21" stroke="#FFFFFF" stroke-width="1.2" opacity="0.75" />

      <!-- Golden / White Waistline Belt -->
      <line x1="2" y1="38" x2="103" y2="38" stroke="#FFFFFF" stroke-width="1.5" />

      <!-- Headlight on front right -->
      <circle cx="100" cy="44" r="3.5" fill="#FFF59D" stroke="#FFFFFF" stroke-width="0.8" />
      <!-- Red Taillight on rear left -->
      <rect x="0" y="42" width="2" height="6" fill="#FF8A80" />

      <!-- Black Wheels with White/Silver Rims -->
      <g transform="translate(25, 54)">
        <circle cx="0" cy="0" r="9" fill="#212121" stroke="#EEEEEE" stroke-width="1.5" />
        <circle cx="0" cy="0" r="3.5" fill="#BDBDBD" />
      </g>
      <g transform="translate(80, 54)">
        <circle cx="0" cy="0" r="9" fill="#212121" stroke="#EEEEEE" stroke-width="1.5" />
        <circle cx="0" cy="0" r="3.5" fill="#BDBDBD" />
      </g>
    </g>
  </g>

  <!-- ==========================================
       6. BRAND NAME TEXT (Centered Bottom)
       ========================================== -->
  ${includeText ? `
  <g id="brand-text">
    <text 
      x="250" 
      y="382" 
      font-family="'Cabinet Grotesk', 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" 
      font-size="34" 
      font-weight="800" 
      fill="#256B36" 
      text-anchor="middle" 
      letter-spacing="-0.3"
    >
      Aazam Travel Agency
    </text>
  </g>
  ` : ''}
</svg>`;
}

async function run() {
  const fullSvg = getLogoSvg(true);
  const iconSvg = getLogoSvg(false);

  // Write SVGs
  fs.writeFileSync(path.join(publicDir, 'logo.svg'), fullSvg);
  fs.writeFileSync(path.join(publicDir, 'logo-icon.svg'), iconSvg);
  fs.writeFileSync(path.join(publicDir, 'favicon.svg'), iconSvg);

  console.log('✓ Wrote logo.svg, logo-icon.svg, favicon.svg');

  // Generate PNGs using sharp
  // 1. Full logo-512x512.png
  await sharp(Buffer.from(fullSvg))
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'logo-512x512.png'));
  console.log('✓ Wrote public/logo-512x512.png');

  // 2. Icon 192x192.png
  await sharp(Buffer.from(iconSvg))
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'logo-192x192.png'));
  console.log('✓ Wrote public/logo-192x192.png');

  // 3. Apple Touch Icon 180x180.png
  await sharp(Buffer.from(iconSvg))
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));
  console.log('✓ Wrote public/apple-touch-icon.png');

  // 4. Favicon 48x48.png & favicon.ico
  const fav48 = await sharp(Buffer.from(iconSvg))
    .resize(48, 48)
    .png()
    .toBuffer();
  fs.writeFileSync(path.join(publicDir, 'favicon-48x48.png'), fav48);
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), fav48);
  console.log('✓ Wrote public/favicon-48x48.png and favicon.ico');

  console.log('All logo assets updated successfully!');
}

run().catch(console.error);
