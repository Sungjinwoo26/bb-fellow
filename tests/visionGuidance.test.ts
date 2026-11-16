import { describe, expect, it } from 'vitest';
import { guidanceFor } from '../src/services/visionGuidance';

describe('face camera guidance',()=>{
 it('requests a face when none is visible',()=>{expect(guidanceFor(undefined)).toEqual({position:'searching',angle:'checking'});});
 it('identifies an off-centre or turned face without making a diagnosis',()=>{
  const points=Array.from({length:468},()=>({x:.5,y:.5,z:0}));
  points[0]={x:.25,y:.2,z:0};points[2]={x:.75,y:.8,z:0};points[33]={x:.35,y:.4,z:0};points[263]={x:.65,y:.4,z:0};points[1]={x:.5,y:.5,z:0};
  expect(guidanceFor(points)).toEqual({position:'good',angle:'forward'});
  points[1]={x:.36,y:.5,z:0};expect(guidanceFor(points).angle).toBe('turn');
 });
});
