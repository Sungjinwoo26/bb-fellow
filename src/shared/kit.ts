import { z } from 'zod';
export const kitLineSchema=z.object({productId:z.string().min(1).max(128),quantity:z.number().int().min(1).max(10)}).strict();
export const kitRequestSchema=z.object({catalogueVersion:z.string().min(1).max(128),items:z.array(kitLineSchema).max(20)}).strict().superRefine((v,ctx)=>{if(new Set(v.items.map(i=>i.productId)).size!==v.items.length)ctx.addIssue({code:'custom',path:['items'],message:'Duplicate products'});});
export type KitLine=z.infer<typeof kitLineSchema>;
export type KitState={catalogueVersion:string;recommendationFingerprint:string;items:KitLine[];open:boolean};
export const quoteSchema=z.object({catalogueVersion:z.string().min(1),currency:z.literal('INR'),subtotalPaise:z.number().int().nonnegative(),eligibleSubtotalPaise:z.number().int().nonnegative(),eligibleUnits:z.number().int().nonnegative(),discountPercent:z.union([z.literal(0),z.literal(10),z.literal(20),z.literal(30)]),discountPaise:z.number().int().nonnegative(),deliveryPaise:z.number().int().nonnegative(),totalPaise:z.number().int().nonnegative()}).strict().refine(q=>q.eligibleSubtotalPaise<=q.subtotalPaise && q.discountPaise===Math.round(q.eligibleSubtotalPaise*q.discountPercent/100) && q.totalPaise===q.subtotalPaise-q.discountPaise+q.deliveryPaise);
export type Quote=z.infer<typeof quoteSchema>;
export const checkoutSchema=z.object({status:z.literal('simulated'),reference:z.string().regex(/^DEMO-[A-F0-9]{6}$/),message:z.literal('Demo complete. No order or payment was created.'),quote:quoteSchema}).strict();
export const formatINR=(paise:number)=>new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',minimumFractionDigits:2,maximumFractionDigits:2}).format(paise/100);
export function cartFingerprint(items:KitLine[]){return JSON.stringify([...items].sort((a,b)=>a.productId.localeCompare(b.productId)));}
