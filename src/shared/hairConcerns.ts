import {z} from 'zod';
export const hairConcernSchema=z.enum(['thinning','shedding','fall_or_thinning','flakes','dry_lengths','breakage','fine_hair']);
export type HairConcern=z.infer<typeof hairConcernSchema>;
const aliases:Record<string,HairConcern>={thinning:'thinning',hair_thinning:'thinning',thining:'thinning',tinnging:'thinning',hair_loss:'thinning',hair_fall:'shedding',hairfall:'shedding',shedding:'shedding',dandruff:'flakes',flakes:'flakes',scalp_flakes:'flakes',dry_hair:'dry_lengths',dry_lengths:'dry_lengths',frizzy_hair:'dry_lengths',frizz:'dry_lengths',breakage:'breakage',damaged_hair:'breakage',fine_hair:'fine_hair',thin_hair:'fine_hair'};
export function normalizeHairConcern(value:string):HairConcern|null{return aliases[value.toLowerCase().trim().replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,'')]??null}
export function normalizeConcerns(values:string[]):string[]{return [...new Set(values.map(value=>normalizeHairConcern(value)??value))]}
