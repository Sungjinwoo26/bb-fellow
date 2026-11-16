import data from '../src/data/productCatalogue.json';
import { requestedProductFormat } from './productMatcher';

export type StorefrontPrice={source:string;price:string;mrp:string};
export type Product={id:string;name:string;category:string;source_url:string;image_url:string;purpose:string|null;ingredients:string|null;usage:string|null;timeline:string|null;warnings:string|null;usage_fields:Record<string,string|undefined>;timeline_fields:Record<string,string|undefined>;warning_fields:Record<string,string|undefined>;full_ingredients:string|null;review_fields:string[];demo_assumption:string|null;verification_status:string;last_verified_at:string;notes:string};
/** The shared catalogue is authoritative for chatbot, storefront and assessment data. */
export const storefrontProducts=data.products.flatMap(product=>product.storefront_variants);
export const storefrontPrices:StorefrontPrice[]=storefrontProducts;
export const catalogue=data.products.map(product=>({
 ...product,
 catalogue_version:String(data.version),
 product_type:requestedProductFormat(product.name),
 aliases:[product.name,product.name.replace(/\s*[-–—(]\s*\d+\s*(?:ml|g|pcs|n)\)?\s*$/i,'').trim()].filter((name,index,all)=>name.length>0&&all.indexOf(name)===index),
 evidence:Object.fromEntries((['name','purpose','ingredients','full_ingredients','usage','timeline','warnings','description'] as const).map(field=>[field,{
  source_url:product.source_url||null,
  status:product[field]==null?'missing':product.review_fields.some(item=>item===field||item.startsWith(field+'.'))?'needs_review':product.verification_status,
  last_verified_at:product.last_verified_at||null,
 }])),
 price_options:product.storefront_variants.map(({price,mrp})=>({price,mrp})),
}));
export const catalogueById=new Map(catalogue.map(product=>[product.id,product]));
