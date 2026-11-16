/** Per-request diagnostics: never include prompts, answers, catalogue data or credentials. */
export type AiDiagnostics={requestId:string};
export type DiagnosticEnv={CHAT_DIAGNOSTIC?:AiDiagnostics};
export function aiEvent(env:DiagnosticEnv,stage:string,reason:string,started:number,attempt:number,extra?:{status?:number;provider_request_id?:string|null}){
 const providerId=extra?.provider_request_id;
 const safeId=providerId&&/^[A-Za-z0-9_-]{1,128}$/.test(providerId)?providerId:undefined;
 console.info('ai_diagnostic',{request_id:env.CHAT_DIAGNOSTIC?.requestId??'untracked',stage,reason,duration_ms:Math.max(0,Date.now()-started),attempt,...(extra?.status!==undefined?{status:extra.status}:{}),...(safeId?{provider_request_id:safeId}:{})});
}
export function aiExceptionReason(error:unknown,signal:AbortSignal,phase:'provider'|'parse'){
 if(signal.aborted||(error instanceof Error&&(error.name==='TimeoutError'||error.name==='AbortError')))return 'timeout';
 return phase==='parse'&&error instanceof SyntaxError?'malformed_response':'network_error';
}
