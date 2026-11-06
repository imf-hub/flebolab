import {describe,it,expect} from 'vitest';
import {defaults,solve,scenarios,sanitize,valveFlow} from './model';
describe('motor educativo conservativo',()=>{
 it('una válvula ideal bloquea el flujo inverso',()=>{expect(valveFlow(-5,2,0)).toBeCloseTo(0,12);expect(valveFlow(5,2,0)).toBe(2.5);expect(valveFlow(-5,2,.2)).toBe(-.5)});
 it.each(scenarios)('$id conserva volumen y produce resultados finitos',s=>{const r=solve({...defaults,...s.params});expect(r.balanceError).toBeLessThan(1e-8);for(const row of r.samples)for(const v of Object.values(row))expect(Number.isFinite(v)).toBe(true);expect(r.samples.length).toBeGreaterThan(100)});
 it('es determinista con los mismos parámetros',()=>{expect(solve(defaults)).toEqual(solve(defaults))});
 it('converge al reducir el paso temporal',()=>{const normal=solve({...defaults,leak:.45,obstruction:4},.01);const fine=solve({...defaults,leak:.45,obstruction:4},.005);expect(Math.abs(normal.meanPressure-fine.meanPressure)/Math.max(1,Math.abs(fine.meanPressure))).toBeLessThan(.01);expect(Math.abs(normal.netReturn-fine.netReturn)).toBeLessThan(.01)});
 it('aplica límites explícitos a parámetros externos',()=>{const p=sanitize({posture:1000,pump:-2,leak:Infinity,period:0});expect(p.posture).toBe(90);expect(p.pump).toBe(0);expect(p.leak).toBe(1);expect(p.period).toBeGreaterThanOrEqual(2)});
 it('la fuga permite flujo inverso bajo el mismo gradiente',()=>{expect(Math.abs(valveFlow(-2,1,.6))).toBeGreaterThan(Math.abs(valveFlow(-2,1,.01)))});
});
