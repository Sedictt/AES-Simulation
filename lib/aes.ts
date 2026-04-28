export type Cell = {
  id: string;
  val: string;
};

export type Annotation = {
  row: number;
  col: number;
  text: string;
  pos: 'top' | 'bottom' | 'left' | 'right';
};

export type SlideData = {
  id: string;
  type: 'intro' | 'input' | 'process' | 'summary' | 'hex-conv' | 'key-expansion';
  title: string;
  description: React.ReactNode;
  grid?: Cell[][];
  animType?: 'subbytes' | 'shiftrows' | 'mixcolumns' | 'addroundkey' | 'load-matrix' | 'none';
  annotations?: Annotation[];
  plaintext?: string;
  hexBytes?: number[];
  roundKeys?: number[][][];
};

export const SBOX = [
  0x63, 0x7c, 0x77, 0x7b, 0xf2, 0x6b, 0x6f, 0xc5, 0x30, 0x01, 0x67, 0x2b, 0xfe, 0xd7, 0xab, 0x76,
  0xca, 0x82, 0xc9, 0x7d, 0xfa, 0x59, 0x47, 0xf0, 0xad, 0xd4, 0xa2, 0xaf, 0x9c, 0xa4, 0x72, 0xc0,
  0xb7, 0xfd, 0x93, 0x26, 0x36, 0x3f, 0xf7, 0xcc, 0x34, 0xa5, 0xe5, 0xf1, 0x71, 0xd8, 0x31, 0x15,
  0x04, 0xc7, 0x23, 0xc3, 0x18, 0x96, 0x05, 0x9a, 0x07, 0x12, 0x80, 0xe2, 0xeb, 0x27, 0xb2, 0x75,
  0x09, 0x83, 0x2c, 0x1a, 0x1b, 0x6e, 0x5a, 0xa0, 0x52, 0x3b, 0xd6, 0xb3, 0x29, 0xe3, 0x2f, 0x84,
  0x53, 0xd1, 0x00, 0xed, 0x20, 0xfc, 0xb1, 0x5b, 0x6a, 0xcb, 0xbe, 0x39, 0x4a, 0x4c, 0x58, 0xcf,
  0xd0, 0xef, 0xaa, 0xfb, 0x43, 0x4d, 0x33, 0x85, 0x45, 0xf9, 0x02, 0x7f, 0x50, 0x3c, 0x9f, 0xa8,
  0x51, 0xa3, 0x40, 0x8f, 0x92, 0x9d, 0x38, 0xf5, 0xbc, 0xb6, 0xda, 0x21, 0x10, 0xff, 0xf3, 0xd2,
  0xcd, 0x0c, 0x13, 0xec, 0x5f, 0x97, 0x44, 0x17, 0xc4, 0xa7, 0x7e, 0x3d, 0x64, 0x5d, 0x19, 0x73,
  0x60, 0x81, 0x4f, 0xdc, 0x22, 0x2a, 0x90, 0x88, 0x46, 0xee, 0xb8, 0x14, 0xde, 0x5e, 0x0b, 0xdb,
  0xe0, 0x32, 0x3a, 0x0a, 0x49, 0x06, 0x24, 0x5c, 0xc2, 0xd3, 0xac, 0x62, 0x91, 0x95, 0xe4, 0x79,
  0xe7, 0xc8, 0x37, 0x6d, 0x8d, 0xd5, 0x4e, 0xa9, 0x6c, 0x56, 0xf4, 0xea, 0x65, 0x7a, 0xae, 0x08,
  0xba, 0x78, 0x25, 0x2e, 0x1c, 0xa6, 0xb4, 0xc6, 0xe8, 0xdd, 0x74, 0x1f, 0x4b, 0xbd, 0x8b, 0x8a,
  0x70, 0x3e, 0xb5, 0x66, 0x48, 0x03, 0xf6, 0x0e, 0x61, 0x35, 0x57, 0xb9, 0x86, 0xc1, 0x1d, 0x9e,
  0xe1, 0xf8, 0x98, 0x11, 0x69, 0xd9, 0x8e, 0x94, 0x9b, 0x1e, 0x87, 0xe9, 0xce, 0x55, 0x28, 0xdf,
  0x8c, 0xa1, 0x89, 0x0d, 0xbf, 0xe6, 0x42, 0x68, 0x41, 0x99, 0x2d, 0x0f, 0xb0, 0x54, 0xbb, 0x16
];

export const INV_SBOX = [
  0x52, 0x09, 0x6a, 0xd5, 0x30, 0x36, 0xa5, 0x38, 0xbf, 0x40, 0xa3, 0x9e, 0x81, 0xf3, 0xd7, 0xfb,
  0x7c, 0xe3, 0x39, 0x82, 0x9b, 0x2f, 0xff, 0x87, 0x34, 0x8e, 0x43, 0x44, 0xc4, 0xde, 0xe9, 0xcb,
  0x54, 0x7b, 0x94, 0x32, 0xa6, 0xc2, 0x23, 0x3d, 0xee, 0x4c, 0x95, 0x0b, 0x42, 0xfa, 0xc3, 0x4e,
  0x08, 0x2e, 0xa1, 0x66, 0x28, 0xd9, 0x24, 0xb2, 0x76, 0x5b, 0xa2, 0x49, 0x6d, 0x8b, 0xd1, 0x25,
  0x72, 0xf8, 0xf6, 0x64, 0x86, 0x68, 0x98, 0x16, 0xd4, 0xa4, 0x5c, 0xcc, 0x5d, 0x65, 0xb6, 0x92,
  0x6c, 0x70, 0x48, 0x50, 0xfd, 0xed, 0xb9, 0xda, 0x5e, 0x15, 0x46, 0x57, 0xa7, 0x8d, 0x9d, 0x84,
  0x90, 0xd8, 0xab, 0x00, 0x8c, 0xbc, 0xd3, 0x0a, 0xf7, 0xe4, 0x58, 0x05, 0xb8, 0xb3, 0x45, 0x06,
  0xd0, 0x2c, 0x1e, 0x8f, 0xca, 0x3f, 0x0f, 0x02, 0xc1, 0xaf, 0xbd, 0x03, 0x01, 0x13, 0x8a, 0x6b,
  0x3a, 0x91, 0x11, 0x41, 0x4f, 0x67, 0xdc, 0xea, 0x97, 0xf2, 0xcf, 0xce, 0xf0, 0xb4, 0xe6, 0x73,
  0x96, 0xac, 0x74, 0x22, 0xe7, 0xad, 0x35, 0x85, 0xe2, 0xf9, 0x37, 0xe8, 0x1c, 0x75, 0xdf, 0x6e,
  0x47, 0xf1, 0x1a, 0x71, 0x1d, 0x29, 0xc5, 0x89, 0x6f, 0xb7, 0x62, 0x0e, 0xaa, 0x18, 0xbe, 0x1b,
  0xfc, 0x56, 0x3e, 0x4b, 0xc6, 0xd2, 0x79, 0x20, 0x9a, 0xdb, 0xc0, 0xfe, 0x78, 0xcd, 0x5a, 0xf4,
  0x1f, 0xdd, 0xa8, 0x33, 0x88, 0x07, 0xc7, 0x31, 0xb1, 0x12, 0x10, 0x59, 0x27, 0x80, 0xec, 0x5f,
  0x60, 0x51, 0x7f, 0xa9, 0x19, 0xb5, 0x4a, 0x0d, 0x2d, 0xe5, 0x7a, 0x9f, 0x93, 0xc9, 0x9c, 0xef,
  0xa0, 0xe0, 0x3b, 0x4d, 0xae, 0x2a, 0xf5, 0xb0, 0xc8, 0xeb, 0xbb, 0x3c, 0x83, 0x53, 0x99, 0x61,
  0x17, 0x2b, 0x04, 0x7e, 0xba, 0x77, 0xd6, 0x26, 0xe1, 0x69, 0x14, 0x63, 0x55, 0x21, 0x0c, 0x7d
];

const RCON = [0x00, 0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36];

export const formatHex = (num: number) => Math.max(0, Math.min(255, num)).toString(16).padStart(2, '0').toUpperCase();

export function parseHex(str: string): number[] {
  const cleanStr = str.replace(/[^0-9a-fA-F]/g, '');
  const bytes = [];
  for (let i = 0; i < 32; i += 2) {
    if (i < cleanStr.length) {
      bytes.push(parseInt(cleanStr.substr(i, 2), 16));
    } else {
      bytes.push(0);
    }
  }
  return bytes;
}

export function parseString(str: string): number[] {
  const bytes = [];
  for (let i = 0; i < 16; i++) {
    if (i < str.length) {
      bytes.push(str.charCodeAt(i));
    } else {
      bytes.push(32); // Pad with space character
    }
  }
  return bytes;
}

function subWord(word: number[]): number[] {
  return word.map(b => SBOX[b]);
}

function rotWord(word: number[]): number[] {
  return [word[1], word[2], word[3], word[0]];
}

function expandKey(keyBytes: number[]): number[][][] {
  const w: number[][] = new Array(44).fill(0).map(() => new Array(4).fill(0));
  for (let i = 0; i < 4; i++) {
    w[i] = [keyBytes[4 * i], keyBytes[4 * i + 1], keyBytes[4 * i + 2], keyBytes[4 * i + 3]];
  }
  for (let i = 4; i < 44; i++) {
    let temp = [...w[i - 1]];
    if (i % 4 === 0) {
      temp = subWord(rotWord(temp));
      temp[0] ^= RCON[i / 4];
    }
    w[i] = [
      w[i - 4][0] ^ temp[0],
      w[i - 4][1] ^ temp[1],
      w[i - 4][2] ^ temp[2],
      w[i - 4][3] ^ temp[3]
    ];
  }
  
  const roundKeys: number[][][] = [];
  for (let r = 0; r < 11; r++) {
    const rk = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ];
    for (let c = 0; c < 4; c++) {
      rk[0][c] = w[r * 4 + c][0];
      rk[1][c] = w[r * 4 + c][1];
      rk[2][c] = w[r * 4 + c][2];
      rk[3][c] = w[r * 4 + c][3];
    }
    roundKeys.push(rk);
  }
  return roundKeys;
}

function initGrid(bytes: number[]): Cell[][] {
  const grid: Cell[][] = [];
  for (let r = 0; r < 4; r++) {
    grid[r] = [];
    for (let c = 0; c < 4; c++) {
      // AES maps string sequentially to columns
      grid[r][c] = {
        id: `cell-${r}-${c}`,
        val: formatHex(bytes[c * 4 + r])
      };
    }
  }
  return grid;
}

function clone(grid: Cell[][]): Cell[][] {
  return grid.map(row => row.map(cell => ({ ...cell })));
}

function addRoundKey(grid: Cell[][], rk: number[][]) {
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const currentVal = parseInt(grid[r][c].val, 16);
      grid[r][c].val = formatHex(currentVal ^ rk[r][c]);
    }
  }
}

function subBytes(grid: Cell[][]) {
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const currentVal = parseInt(grid[r][c].val, 16);
      grid[r][c].val = formatHex(SBOX[currentVal]);
    }
  }
}

function shiftRows(grid: Cell[][]) {
  const r1 = grid[1];
  grid[1] = [r1[1], r1[2], r1[3], r1[0]];
  
  const r2 = grid[2];
  grid[2] = [r2[2], r2[3], r2[0], r2[1]];
  
  const r3 = grid[3];
  grid[3] = [r3[3], r3[0], r3[1], r3[2]];
}

function gmul(a: number, b: number): number {
  let p = 0;
  for (let c = 0; c < 8; c++) {
    if ((b & 1) !== 0) p ^= a;
    const hi = a & 0x80;
    a = (a << 1) & 0xFF;
    if (hi !== 0) a ^= 0x1B;
    b >>= 1;
  }
  return p;
}

function mixColumns(grid: Cell[][]) {
  for (let c = 0; c < 4; c++) {
    const s0 = parseInt(grid[0][c].val, 16);
    const s1 = parseInt(grid[1][c].val, 16);
    const s2 = parseInt(grid[2][c].val, 16);
    const s3 = parseInt(grid[3][c].val, 16);
    
    grid[0][c].val = formatHex(gmul(2, s0) ^ gmul(3, s1) ^ s2 ^ s3);
    grid[1][c].val = formatHex(s0 ^ gmul(2, s1) ^ gmul(3, s2) ^ s3);
    grid[2][c].val = formatHex(s0 ^ s1 ^ gmul(2, s2) ^ gmul(3, s3));
    grid[3][c].val = formatHex(gmul(3, s0) ^ s1 ^ s2 ^ gmul(2, s3));
  }
}

function invSubBytes(grid: Cell[][]) {
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const currentVal = parseInt(grid[r][c].val, 16);
      grid[r][c].val = formatHex(INV_SBOX[currentVal]);
    }
  }
}

function invShiftRows(grid: Cell[][]) {
  const r1 = grid[1];
  grid[1] = [r1[3], r1[0], r1[1], r1[2]];
  
  const r2 = grid[2];
  grid[2] = [r2[2], r2[3], r2[0], r2[1]];
  
  const r3 = grid[3];
  grid[3] = [r3[1], r3[2], r3[3], r3[0]];
}

function invMixColumns(grid: Cell[][]) {
  for (let c = 0; c < 4; c++) {
    const s0 = parseInt(grid[0][c].val, 16);
    const s1 = parseInt(grid[1][c].val, 16);
    const s2 = parseInt(grid[2][c].val, 16);
    const s3 = parseInt(grid[3][c].val, 16);
    
    grid[0][c].val = formatHex(gmul(0x0e, s0) ^ gmul(0x0b, s1) ^ gmul(0x0d, s2) ^ gmul(0x09, s3));
    grid[1][c].val = formatHex(gmul(0x09, s0) ^ gmul(0x0e, s1) ^ gmul(0x0b, s2) ^ gmul(0x0d, s3));
    grid[2][c].val = formatHex(gmul(0x0d, s0) ^ gmul(0x09, s1) ^ gmul(0x0e, s2) ^ gmul(0x0b, s3));
    grid[3][c].val = formatHex(gmul(0x0b, s0) ^ gmul(0x0d, s1) ^ gmul(0x09, s2) ^ gmul(0x0e, s3));
  }
}

export function generateAESPresentation(pt: string, ky: string): SlideData[] {
  const ptBytes = parseString(pt);
  const kyBytes = parseString(ky);
  const roundKeys = expandKey(kyBytes);

  let grid = initGrid(ptBytes);
  const slides: SlideData[] = [];

  slides.push({
    id: 'intro',
    type: 'intro',
    title: 'AES Interactive Learning',
    description: 'Welcome. Use the Space bar or Right Arrow key to advance the presentation.',
  });

  slides.push({
    id: 'input',
    type: 'input',
    title: 'Input Block & Key',
    description: 'To encrypt data, AES expects exactly 16 bytes of plaintext and 16 bytes of key (for AES-128).',
  });

  slides.push({
    id: 's-hex', type: 'hex-conv', title: 'Plaintext to Hexadecimal',
    description: 'Before math can be applied, each character of your input is converted into a Hexadecimal byte according to its ASCII value. Missing characters are padded with spaces (0x20).',
    plaintext: pt.padEnd(16, ' ').substring(0, 16),
    hexBytes: ptBytes
  });

  slides.push({
    id: 's-key-expansion', type: 'key-expansion', title: 'Key Expansion',
    description: 'The 16-byte initial key is expanded into 11 Round Keys (44 32-bit words), generating the key material needed for each encryption round.',
    hexBytes: kyBytes,
    roundKeys: roundKeys
  });

  slides.push({
    id: 's-pt', type: 'process', title: 'Plaintext State Matrix',
    description: 'The plain characters are parsed into bytes and loaded into a 4x4 matrix. Note how the characters fill the grid column-by-column (Column-major format).',
    grid: clone(grid),
    animType: 'load-matrix',
    annotations: [
      { row: 0, col: 0, pos: 'left', text: '1st byte' },
      { row: 1, col: 0, pos: 'left', text: '2nd byte' },
      { row: 0, col: 1, pos: 'top', text: '5th byte' }
    ]
  });

  addRoundKey(grid, roundKeys[0]);
  slides.push({
    id: 's-ark0', type: 'process', title: 'Initial AddRoundKey',
    description: 'The operation begins! The initial state is XOR-ed with the Round 0 Key (which is just your exact initial Key).',
    grid: clone(grid),
    animType: 'addroundkey',
    annotations: [
      { row: 0, col: 0, pos: 'top', text: 'State[0,0] ⊕ Key[0,0]' }
    ]
  });

  subBytes(grid);
  slides.push({
    id: 's-r1-sb', type: 'process', title: 'Round 1: SubBytes',
    description: 'SubBytes is a non-linear substitution step where each byte is replaced with another according to a lookup table (S-Box) to provide non-linearity.',
    grid: clone(grid),
    animType: 'subbytes',
    annotations: [
      { row: 0, col: 0, pos: 'top', text: 'S-Box Lookup' }
    ]
  });

  shiftRows(grid);
  slides.push({
    id: 's-r1-sr', type: 'process', title: 'Round 1: ShiftRows',
    description: 'ShiftRows diffuses data across columns. Row 0 remains unchanged. Row 1 shifts left by 1. Row 2 shifts left by 2. Row 3 shifts left by 3. Watch the blocks physically move!',
    grid: clone(grid),
    animType: 'shiftrows',
    annotations: [
      { row: 0, col: 3, pos: 'right', text: 'No shift' },
      { row: 1, col: 3, pos: 'right', text: 'Shift left 1' },
      { row: 2, col: 3, pos: 'right', text: 'Shift left 2' },
      { row: 3, col: 3, pos: 'right', text: 'Shift left 3' }
    ]
  });

  mixColumns(grid);
  slides.push({
    id: 's-r1-mc', type: 'process', title: 'Round 1: MixColumns',
    description: 'MixColumns mixes data vertically. Each column is multiplied against a fixed matrix in Galois Field GF(2^8). A single changed byte now cascades its influence to all 4 bytes in the column.',
    grid: clone(grid),
    animType: 'mixcolumns',
    annotations: [
      { row: 3, col: 0, pos: 'bottom', text: 'Col 0 mixed' },
      { row: 3, col: 2, pos: 'bottom', text: 'Col 2 mixed' }
    ]
  });

  addRoundKey(grid, roundKeys[1]);
  slides.push({
    id: 's-r1-ark', type: 'process', title: 'Round 1: AddRoundKey',
    description: 'The result is XOR-ed with the Round 1 Key. Round 1 is complete! This ensures the encryption is tied uniquely to your specific secret password.',
    grid: clone(grid),
    animType: 'addroundkey'
  });

  // Calculate Rounds 2-9 seamlessly
  for (let r = 2; r <= 9; r++) {
    subBytes(grid);
    shiftRows(grid);
    mixColumns(grid);
    addRoundKey(grid, roundKeys[r]);
  }

  slides.push({
    id: 's-r2-r9', type: 'process', title: 'Rounds 2 through 9',
    description: 'For AES-128, the algorithm performs 10 rounds total. Rounds 2 through 9 repeat the exact same 4 steps as Round 1. We fast-forwarded to the State Matrix at the end of Round 9.',
    grid: clone(grid)
  });

  // Round 10
  subBytes(grid);
  slides.push({
    id: 's-r10-sb', type: 'process', title: 'Round 10: SubBytes',
    description: 'Welcome to the final round! SubBytes substitutes the data one last time.',
    grid: clone(grid),
    animType: 'subbytes'
  });

  shiftRows(grid);
  slides.push({
    id: 's-r10-sr', type: 'process', title: 'Round 10: ShiftRows',
    description: 'ShiftRows performs its final diffusion step across the matrix rows.',
    grid: clone(grid),
    animType: 'shiftrows'
  });

  addRoundKey(grid, roundKeys[10]);
  slides.push({
    id: 's-r10-ark', type: 'process', title: 'Final Ciphertext',
    description: 'Notice anything missing? MixColumns is skipped in the final round! A final AddRoundKey yields the heavily scrambled Ciphertext matrix.',
    grid: clone(grid),
    animType: 'addroundkey'
  });

  slides.push({
    id: 's-decrypt', type: 'summary', title: 'Decryption Theory',
    description: "Encryption is completely reversible! Decryption performs inverse operations (InvSubBytes, InvShiftRows, InvMixColumns) while applying the round keys in completely reverse order, successfully retrieving the plaintext.",
    grid: clone(grid)
  });

  return slides;
}

export function generateAESDecryptionPresentation(ct: string, ky: string): SlideData[] {
  const ctBytes = parseHex(ct);
  const kyBytes = parseString(ky);
  const roundKeys = expandKey(kyBytes);

  let grid = initGrid(ctBytes);
  const slides: SlideData[] = [];

  slides.push({
    id: 'intro',
    type: 'intro',
    title: 'AES Decryption Process',
    description: 'Let\'s run the AES-128 process in reverse to decrypt ciphertext back to plaintext.',
  });

  slides.push({
    id: 'input',
    type: 'input',
    title: 'Input Ciphertext & Key',
    description: 'For decryption, you provide the 16-byte (32 hex characters) ciphertext and the original 16-byte key.',
  });

  slides.push({
    id: 's-key-expansion', type: 'key-expansion', title: 'Key Expansion for Decryption',
    description: 'Even for decryption, the original key is expanded in exactly the same way to generate all 11 Round Keys. AES decryption uses these keys in reverse order.',
    hexBytes: kyBytes,
    roundKeys: roundKeys
  });

  slides.push({
    id: 's-ct', type: 'process', title: 'Ciphertext State Matrix',
    description: 'The bytes are loaded into the 4x4 state matrix.',
    grid: clone(grid),
    animType: 'load-matrix',
    annotations: [
      { row: 0, col: 0, pos: 'left', text: '1st byte' },
      { row: 0, col: 1, pos: 'top', text: '5th byte' },
    ]
  });

  // Decryption starts with AddRoundKey of the last round key (Round 10)
  addRoundKey(grid, roundKeys[10]);
  slides.push({
    id: 's-ark10', type: 'process', title: 'Initial AddRoundKey',
    description: 'Decryption starts by XOR-ing the state with the Round 10 key.',
    grid: clone(grid),
    animType: 'addroundkey',
    annotations: [
      { row: 0, col: 0, pos: 'top', text: 'State ⊕ Key[10]' }
    ]
  });

  // First full reverse round (Round 10 backward to Round 1)
  // Which corresponds to Round 9 in terms of Decryption loops (Round Keys 9 to 1)
  // Actually, Round 9 is the first full round backward
  invShiftRows(grid);
  slides.push({
    id: 's-ir1-sr', type: 'process', title: 'Round 1: InvShiftRows',
    description: 'InvShiftRows performs the exact opposite shifts of ShiftRows.',
    grid: clone(grid),
    animType: 'shiftrows',
    annotations: [
      { row: 0, col: 3, pos: 'right', text: 'No shift' },
      { row: 1, col: 3, pos: 'right', text: 'Shift right 1' },
      { row: 2, col: 3, pos: 'right', text: 'Shift right 2' },
      { row: 3, col: 3, pos: 'right', text: 'Shift right 3' }
    ]
  });

  invSubBytes(grid);
  slides.push({
    id: 's-ir1-sb', type: 'process', title: 'Round 1: InvSubBytes',
    description: 'InvSubBytes substitutes bytes using the Inverse S-Box, perfectly reversing the SubBytes step.',
    grid: clone(grid),
    animType: 'subbytes',
    annotations: [
      { row: 0, col: 0, pos: 'top', text: 'Inverse S-Box Substitution' }
    ]
  });

  addRoundKey(grid, roundKeys[9]);
  slides.push({
    id: 's-ir1-ark', type: 'process', title: 'Round 1: AddRoundKey',
    description: 'We apply the Round 9 Key. Notice that AddRoundKey is its own inverse (XOR).',
    grid: clone(grid),
    animType: 'addroundkey'
  });

  invMixColumns(grid);
  slides.push({
    id: 's-ir1-mc', type: 'process', title: 'Round 1: InvMixColumns',
    description: 'InvMixColumns multiplies the matrix against the inverse fixed matrix in GF(2^8).',
    grid: clone(grid),
    animType: 'mixcolumns',
    annotations: [
      { row: 3, col: 0, pos: 'bottom', text: 'Col 0 mixed' },
      { row: 3, col: 2, pos: 'bottom', text: 'Col 2 mixed' }
    ]
  });

  // Fast forward Rounds 2 through 9
  for (let r = 8; r >= 1; r--) {
    invShiftRows(grid);
    invSubBytes(grid);
    addRoundKey(grid, roundKeys[r]);
    invMixColumns(grid);
  }

  slides.push({
    id: 's-r2-r9', type: 'process', title: 'Rounds 2 through 9',
    description: 'The process repeats InvShiftRows, InvSubBytes, AddRoundKey, and InvMixColumns. Fast forwarding to the final decryption round.',
    grid: clone(grid)
  });

  // Final Round (Round 0 Key)
  invShiftRows(grid);
  slides.push({
    id: 's-ir10-sr', type: 'process', title: 'Final Round: InvShiftRows',
    description: 'The final set of reverse operations begins.',
    grid: clone(grid),
    animType: 'shiftrows'
  });

  invSubBytes(grid);
  slides.push({
    id: 's-ir10-sb', type: 'process', title: 'Final Round: InvSubBytes',
    description: 'The very last byte substitution.',
    grid: clone(grid),
    animType: 'subbytes'
  });

  addRoundKey(grid, roundKeys[0]);
  slides.push({
    id: 's-ir10-ark', type: 'process', title: 'Final Original AddRoundKey',
    description: 'The final step XORs the state with the exact original password/key (Round 0 Key).',
    grid: clone(grid),
    animType: 'addroundkey'
  });

  slides.push({
    id: 's-plaintext', type: 'summary', title: 'Plaintext Recovered',
    description: 'The state matrix has been successfully restored to the original plaintext!',
    grid: clone(grid)
  });

  return slides;
}
