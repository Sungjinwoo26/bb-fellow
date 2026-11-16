import type { FaceLandmarker, ImageSegmenter, NormalizedLandmark } from '@mediapipe/tasks-vision';

const root = '/vision';
async function runtime() {
 const vision = await import('@mediapipe/tasks-vision');
 const files = await vision.FilesetResolver.forVisionTasks(`${root}/wasm`);
 return {vision, files};
}
export async function createFaceGuide(): Promise<FaceLandmarker> {
 const {vision,files}=await runtime();
 return vision.FaceLandmarker.createFromOptions(files,{baseOptions:{modelAssetPath:`${root}/face_landmarker.task`,delegate:'CPU'},runningMode:'VIDEO',numFaces:1});
}
export type Guidance = {position:'searching'|'closer'|'farther'|'centre'|'good';angle:'checking'|'forward'|'turn'|'tilt'};
export function guidanceFor(points:NormalizedLandmark[] | undefined): Guidance {
 if(!points?.length)return {position:'searching',angle:'checking'};
 const xs=points.map(p=>p.x),ys=points.map(p=>p.y);const minX=Math.min(...xs),maxX=Math.max(...xs),minY=Math.min(...ys),maxY=Math.max(...ys);const width=maxX-minX;
 const position=width<0.25?'closer':width>0.8?'farther':Math.abs((minX+maxX)/2-.5)>.16||Math.abs((minY+maxY)/2-.5)>.2?'centre':'good';
 const left=points[33],right=points[263],nose=points[1];
 if(!left||!right||!nose)return {position,angle:'checking'};
 const span=Math.abs(right.x-left.x);if(span<.02)return {position,angle:'checking'};
 const ratio=(nose.x-Math.min(left.x,right.x))/span;
 const angle=Math.abs(right.y-left.y)/span>.18?'tilt':ratio<.28||ratio>.72?'turn':'forward';
 return {position,angle};
}
export type Overlay = {maskUrl:string;hairline:string};
export async function buildOverlay(blob:Blob,area:'face'|'hair'):Promise<Overlay|null>{
 const {vision,files}=await runtime();let segmenter:ImageSegmenter|undefined;let landmarker:FaceLandmarker|undefined;let bitmap:ImageBitmap|undefined;
 try {
  bitmap=await createImageBitmap(blob);
  segmenter=await vision.ImageSegmenter.createFromOptions(files,{baseOptions:{modelAssetPath:`${root}/selfie_multiclass_256x256.tflite`,delegate:'CPU'},runningMode:'IMAGE',outputCategoryMask:true,outputConfidenceMasks:false});
  const result=segmenter.segment(bitmap);const mask=result.categoryMask;if(!mask){result.close();return null;}
  const width=mask.width,height=mask.height,data=mask.getAsUint8Array();const canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;const ctx=canvas.getContext('2d');if(!ctx){result.close();return null;}
  const pixels=ctx.createImageData(width,height);const category=area==='face'?3:1;let count=0;
  for(let i=0;i<data.length;i++){if(data[i]!==category)continue;count++;const p=i*4;pixels.data[p]=area==='face'?0:128;pixels.data[p+1]=area==='face'?152:80;pixels.data[p+2]=255;pixels.data[p+3]=area==='face'?30:45;}
  ctx.putImageData(pixels,0,0);let hairline='';
  if(area==='hair'&&count>width*height*.01){
   landmarker=await vision.FaceLandmarker.createFromOptions(files,{baseOptions:{modelAssetPath:`${root}/face_landmarker.task`,delegate:'CPU'},runningMode:'IMAGE',numFaces:1});
   const landmarks=landmarker.detect(bitmap).faceLandmarks[0];
   if(landmarks?.[10]&&landmarks[33]&&landmarks[263]&&landmarks[152]){
    const forehead=landmarks[10].y;const chin=landmarks[152].y;const faceHeight=Math.max(0,chin-forehead);
    const x0=Math.max(0,Math.floor(Math.min(landmarks[33].x,landmarks[263].x)*width));const x1=Math.min(width-1,Math.ceil(Math.max(landmarks[33].x,landmarks[263].x)*width));
    const y0=Math.max(2,Math.floor((forehead-faceHeight*.2)*height));const y1=Math.min(height-2,Math.ceil((forehead+faceHeight*.18)*height));
    const points:{x:number;y:number}[]=[];
    for(let x=x0;x<=x1;x+=2){for(let y=y0;y<=y1;y++){if(data[y*width+x]!==3)continue;let hair=false;for(let d=1;d<=5;d++)if(data[(y-d)*width+x]===1){hair=true;break;}if(hair){points.push({x:x/width*100,y:y/height*100});break;}}}
    if(points.length>=6){let last:{x:number;y:number}|undefined;hairline=points.map(p=>{const start=!last||p.x-last.x>3||Math.abs(p.y-last.y)>4;last=p;return `${start?'M':'L'}${p.x.toFixed(2)} ${p.y.toFixed(2)}`;}).join(' ');}
   }
  }
  result.close();return count>width*height*.005?{maskUrl:canvas.toDataURL('image/png'),hairline}:null;
 } finally {bitmap?.close();landmarker?.close();segmenter?.close();}
}
