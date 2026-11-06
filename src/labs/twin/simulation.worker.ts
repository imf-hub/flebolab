import {solve} from './model';
self.onmessage=(event)=>{const{id,parameters}=event.data;try{self.postMessage({id,solution:solve(parameters)});}catch(error){self.postMessage({id,error:String(error)});}};
