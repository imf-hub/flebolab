import React,{Suspense,lazy,useEffect} from 'react';
import {createRoot} from 'react-dom/client';
import {BrowserRouter,Routes,Route,useLocation} from 'react-router-dom';
import App from './App';
import ErrorBoundary from './shared/ErrorBoundary';
import './styles.css';
const Twin=lazy(()=>import('./labs/twin/Twin'));
const Dus=lazy(()=>import('./labs/dus/Dus'));
const Vision=lazy(()=>import('./labs/vision/Vision'));
const Library=lazy(()=>import('./pages/Library'));
function Scroll(){const l=useLocation();useEffect(()=>{window.scrollTo(0,0);const names:Record<string,string>={'/flebotwin':'FleboTwin','/flebodus':'FleboDUS','/flebovision':'FleboVision','/recorridos':'Recorridos','/fuentes':'Fuentes y método','/guia':'Guía','/creditos':'Créditos','/glosario':'Glosario','/novedades':'Versión y alcance'};document.title=`${names[l.pathname]?names[l.pathname]+' · ':''}FLEBO LAB IMF`;if(l.hash)setTimeout(()=>document.getElementById(l.hash.slice(1))?.scrollIntoView(),150);},[l.pathname,l.hash]);return null;}
createRoot(document.getElementById('root')!).render(<BrowserRouter><ErrorBoundary><Scroll/><Suspense fallback={<div className="page-loading"><span className="loading-orbit"/>Preparando el laboratorio…</div>}><Routes><Route path="/*" element={<App/>}><Route path="flebotwin/*" element={<Twin/>}/><Route path="flebodus/*" element={<Dus/>}/><Route path="flebovision/*" element={<Vision/>}/><Route path="recorridos/*" element={<Library mode="pathways"/>}/><Route path="fuentes" element={<Library mode="sources"/>}/><Route path="creditos" element={<Library mode="credits"/>}/><Route path="guia" element={<Library mode="guide"/>}/><Route path="novedades" element={<Library mode="release"/>}/><Route path="glosario" element={<Library mode="glossary"/>}/></Route></Routes></Suspense></ErrorBoundary></BrowserRouter>);
