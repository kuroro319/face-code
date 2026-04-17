export const TYPE_NAMES: Record<string, string> = {
  RLOH: '花形', RLOM: '指揮官', RLSH: 'クリエイター', RLSM: 'プロデューサー',
  RGOH: '外交官', RGOM: '戦略家', RGSH: '探偵', RGSM: '革命家',
  ALOH: 'カウンセラー', ALOM: '伝道師', ALSH: '幻想家', ALSM: '守護者',
  AGOH: '哲学者', AGOM: '研究者', AGSH: '予言者', AGSM: '賢者',
}

export type Plan = 'full' | 'subscription'
