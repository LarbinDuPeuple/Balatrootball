// État de la partie en cours, partagé entre les scènes.
export const S: { G: any; M: any } = { G: null, M: null };

(globalThis as any).__S = S; // accès pour les tests de bout en bout
