import { z } from 'zod';
import {hairConcernSchema} from './hairConcerns';
const short=z.string().max(500);
export const chatStateSchema=z.object({
 version:z.literal(1), stage:z.enum(['discovering_concern','narrowing_products','recommendation_ready','recommended','answering_product_question','comparing_products']),
 active_product_ids:z.array(short).max(4), recommended_product_ids:z.array(short).max(20), rejected_product_ids:z.array(short).max(20),
 concerns:z.array(short).max(12), areas:z.array(short).max(8), excluded_ingredients:z.array(short).max(12).default([]), requested_product_type:short.nullable(), skin_hair_type:short.nullable(),
 observed_concerns:z.array(short).max(20).optional(),
 pending_concern:z.object({message:short,concerns:z.array(short).max(12),hair_concerns:z.array(hairConcernSchema).max(6),body_areas:z.array(short).max(8),excluded_ingredients:z.array(short).max(12)}).strict().optional(),
 pending_question:z.object({message:short,product_ids:z.array(short).max(8)}).strict().optional(),
 pending_clarification:z.object({original_message:short,question:short,choices:z.array(short).max(12)}).strict().optional(),
 answered_questions:z.array(z.object({question:short,answer:short})).max(20), asked_questions:z.array(short).max(20), remaining_questions:z.number().int().min(0).max(3),
 pregnancy_context:z.enum(['pregnant','postpartum','breastfeeding']).nullable(),
 hair_context:z.object({observed:z.array(hairConcernSchema).max(6),focus:hairConcernSchema.nullable(),flakes:z.enum(['yes','no','unknown']).nullable()}).optional()
}).strict();
export type ChatState=z.infer<typeof chatStateSchema>;
export const initialChatState=():ChatState=>({version:1,stage:'discovering_concern',active_product_ids:[],recommended_product_ids:[],rejected_product_ids:[],concerns:[],areas:[],excluded_ingredients:[],requested_product_type:null,skin_hair_type:null,answered_questions:[],asked_questions:[],remaining_questions:3,pregnancy_context:null});
export const turnSchema=z.object({action:z.enum(['find_product','product_question','compare','answer_follow_up','unknown']),reference_scope:z.enum(['new_product','active_product','multiple_products','none','ambiguous']),referenced_products:z.array(short).max(4),product_types:z.array(short).max(4),product_descriptors:z.array(short).max(8).optional(),concerns:z.array(short).max(12),hair_concerns:z.array(hairConcernSchema).max(6).optional(),concern_relation:z.enum(['add','switch','unclear','none']).optional(),body_areas:z.array(short).max(8),excluded_ingredients:z.array(short).max(12).default([]),intents:z.array(short).max(8),missing_information:z.array(short).max(8),confidence:z.enum(['high','medium','low'])}).strict();
export type ChatTurn=z.infer<typeof turnSchema>;
