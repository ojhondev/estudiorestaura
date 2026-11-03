/** Fotos que passam no mapa ("Onde já atuamos"), por estado. */
export const ESTADO_FOTOS: Record<string, { city: string; fotos: string[] }> = {
  SP: {
    city: "São Paulo",
    fotos: [1, 2, 3].map((n) => `/fotos/estados/sp-${n}.jpg`),
  },
  GO: {
    city: "Jataí",
    fotos: [1, 2, 3].map((n) => `/fotos/estados/go-${n}.jpg`),
  },
  MG: {
    city: "Maria da Fé",
    fotos: [1, 2, 3].map((n) => `/fotos/estados/mg-${n}.jpg`),
  },
};
