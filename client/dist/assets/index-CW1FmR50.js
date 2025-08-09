import{S as yt,s as vt,h as rt,b as gt,n as it,u as bt,r as M,c as Et,d as _t}from"./index-DJg6F_id.js";var xt=class extends yt{#r;#o=void 0;#t;#e;constructor(r,s){super(),this.#r=r,this.setOptions(s),this.bindMethods(),this.#s()}bindMethods(){this.mutate=this.mutate.bind(this),this.reset=this.reset.bind(this)}setOptions(r){const s=this.options;this.options=this.#r.defaultMutationOptions(r),vt(this.options,s)||this.#r.getMutationCache().notify({type:"observerOptionsUpdated",mutation:this.#t,observer:this}),s?.mutationKey&&this.options.mutationKey&&rt(s.mutationKey)!==rt(this.options.mutationKey)?this.reset():this.#t?.state.status==="pending"&&this.#t.setOptions(this.options)}onUnsubscribe(){this.hasListeners()||this.#t?.removeObserver(this)}onMutationUpdate(r){this.#s(),this.#n(r)}getCurrentResult(){return this.#o}reset(){this.#t?.removeObserver(this),this.#t=void 0,this.#s(),this.#n()}mutate(r,s){return this.#e=s,this.#t?.removeObserver(this),this.#t=this.#r.getMutationCache().build(this.#r,this.options),this.#t.addObserver(this),this.#t.execute(r)}#s(){const r=this.#t?.state??gt();this.#o={...r,isPending:r.status==="pending",isSuccess:r.status==="success",isError:r.status==="error",isIdle:r.status==="idle",mutate:this.mutate,reset:this.reset}}#n(r){it.batch(()=>{if(this.#e&&this.hasListeners()){const s=this.#o.variables,i=this.#o.context;r?.type==="success"?(this.#e.onSuccess?.(r.data,s,i),this.#e.onSettled?.(r.data,null,s,i)):r?.type==="error"&&(this.#e.onError?.(r.error,s,i),this.#e.onSettled?.(void 0,r.error,s,i))}this.listeners.forEach(s=>{s(this.#o)})})}};function ue(e,r){const s=bt(),[i]=M.useState(()=>new xt(s,e));M.useEffect(()=>{i.setOptions(e)},[i,e]);const f=M.useSyncExternalStore(M.useCallback(p=>i.subscribe(it.batchCalls(p)),[i]),()=>i.getCurrentResult(),()=>i.getCurrentResult()),n=M.useCallback((p,m)=>{i.mutate(p,m).catch(Et)},[i]);if(f.error&&_t(i.options.throwOnError,[f.error]))throw f.error;return{...f,mutate:n,mutateAsync:f.mutate}}var D={exports:{}},c={};/**
 * @license React
 * react.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var ot;function wt(){if(ot)return c;ot=1;var e=Symbol.for("react.transitional.element"),r=Symbol.for("react.portal"),s=Symbol.for("react.fragment"),i=Symbol.for("react.strict_mode"),f=Symbol.for("react.profiler"),n=Symbol.for("react.consumer"),p=Symbol.for("react.context"),m=Symbol.for("react.forward_ref"),h=Symbol.for("react.suspense"),b=Symbol.for("react.memo"),E=Symbol.for("react.lazy"),w=Symbol.iterator;function T(t){return t===null||typeof t!="object"?null:(t=w&&t[w]||t["@@iterator"],typeof t=="function"?t:null)}var B={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},Q=Object.assign,Z={};function A(t,o,u){this.props=t,this.context=o,this.refs=Z,this.updater=u||B}A.prototype.isReactComponent={},A.prototype.setState=function(t,o){if(typeof t!="object"&&typeof t!="function"&&t!=null)throw Error("takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,t,o,"setState")},A.prototype.forceUpdate=function(t){this.updater.enqueueForceUpdate(this,t,"forceUpdate")};function J(){}J.prototype=A.prototype;function N(t,o,u){this.props=t,this.context=o,this.refs=Z,this.updater=u||B}var I=N.prototype=new J;I.constructor=N,Q(I,A.prototype),I.isPureReactComponent=!0;var X=Array.isArray,y={H:null,A:null,T:null,S:null,V:null},F=Object.prototype.hasOwnProperty;function L(t,o,u,a,d,v){return u=v.ref,{$$typeof:e,type:t,key:o,ref:u!==void 0?u:null,props:v}}function ft(t,o){return L(t.type,o,void 0,void 0,void 0,t.props)}function U(t){return typeof t=="object"&&t!==null&&t.$$typeof===e}function lt(t){var o={"=":"=0",":":"=2"};return"$"+t.replace(/[=:]/g,function(u){return o[u]})}var V=/\/+/g;function Y(t,o){return typeof t=="object"&&t!==null&&t.key!=null?lt(""+t.key):o.toString(36)}function tt(){}function pt(t){switch(t.status){case"fulfilled":return t.value;case"rejected":throw t.reason;default:switch(typeof t.status=="string"?t.then(tt,tt):(t.status="pending",t.then(function(o){t.status==="pending"&&(t.status="fulfilled",t.value=o)},function(o){t.status==="pending"&&(t.status="rejected",t.reason=o)})),t.status){case"fulfilled":return t.value;case"rejected":throw t.reason}}throw t}function j(t,o,u,a,d){var v=typeof t;(v==="undefined"||v==="boolean")&&(t=null);var l=!1;if(t===null)l=!0;else switch(v){case"bigint":case"string":case"number":l=!0;break;case"object":switch(t.$$typeof){case e:case r:l=!0;break;case E:return l=t._init,j(l(t._payload),o,u,a,d)}}if(l)return d=d(t),l=a===""?"."+Y(t,0):a,X(d)?(u="",l!=null&&(u=l.replace(V,"$&/")+"/"),j(d,o,u,"",function(ht){return ht})):d!=null&&(U(d)&&(d=ft(d,u+(d.key==null||t&&t.key===d.key?"":(""+d.key).replace(V,"$&/")+"/")+l)),o.push(d)),1;l=0;var O=a===""?".":a+":";if(X(t))for(var g=0;g<t.length;g++)a=t[g],v=O+Y(a,g),l+=j(a,o,u,v,d);else if(g=T(t),typeof g=="function")for(t=g.call(t),g=0;!(a=t.next()).done;)a=a.value,v=O+Y(a,g++),l+=j(a,o,u,v,d);else if(v==="object"){if(typeof t.then=="function")return j(pt(t),o,u,a,d);throw o=String(t),Error("Objects are not valid as a React child (found: "+(o==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":o)+"). If you meant to render a collection of children, use an array instead.")}return l}function k(t,o,u){if(t==null)return t;var a=[],d=0;return j(t,a,"","",function(v){return o.call(u,v,d++)}),a}function dt(t){if(t._status===-1){var o=t._result;o=o(),o.then(function(u){(t._status===0||t._status===-1)&&(t._status=1,t._result=u)},function(u){(t._status===0||t._status===-1)&&(t._status=2,t._result=u)}),t._status===-1&&(t._status=0,t._result=o)}if(t._status===1)return t._result.default;throw t._result}var et=typeof reportError=="function"?reportError:function(t){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var o=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof t=="object"&&t!==null&&typeof t.message=="string"?String(t.message):String(t),error:t});if(!window.dispatchEvent(o))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",t);return}console.error(t)};function mt(){}return c.Children={map:k,forEach:function(t,o,u){k(t,function(){o.apply(this,arguments)},u)},count:function(t){var o=0;return k(t,function(){o++}),o},toArray:function(t){return k(t,function(o){return o})||[]},only:function(t){if(!U(t))throw Error("React.Children.only expected to receive a single React element child.");return t}},c.Component=A,c.Fragment=s,c.Profiler=f,c.PureComponent=N,c.StrictMode=i,c.Suspense=h,c.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=y,c.__COMPILER_RUNTIME={__proto__:null,c:function(t){return y.H.useMemoCache(t)}},c.cache=function(t){return function(){return t.apply(null,arguments)}},c.cloneElement=function(t,o,u){if(t==null)throw Error("The argument must be a React element, but you passed "+t+".");var a=Q({},t.props),d=t.key,v=void 0;if(o!=null)for(l in o.ref!==void 0&&(v=void 0),o.key!==void 0&&(d=""+o.key),o)!F.call(o,l)||l==="key"||l==="__self"||l==="__source"||l==="ref"&&o.ref===void 0||(a[l]=o[l]);var l=arguments.length-2;if(l===1)a.children=u;else if(1<l){for(var O=Array(l),g=0;g<l;g++)O[g]=arguments[g+2];a.children=O}return L(t.type,d,void 0,void 0,v,a)},c.createContext=function(t){return t={$$typeof:p,_currentValue:t,_currentValue2:t,_threadCount:0,Provider:null,Consumer:null},t.Provider=t,t.Consumer={$$typeof:n,_context:t},t},c.createElement=function(t,o,u){var a,d={},v=null;if(o!=null)for(a in o.key!==void 0&&(v=""+o.key),o)F.call(o,a)&&a!=="key"&&a!=="__self"&&a!=="__source"&&(d[a]=o[a]);var l=arguments.length-2;if(l===1)d.children=u;else if(1<l){for(var O=Array(l),g=0;g<l;g++)O[g]=arguments[g+2];d.children=O}if(t&&t.defaultProps)for(a in l=t.defaultProps,l)d[a]===void 0&&(d[a]=l[a]);return L(t,v,void 0,void 0,null,d)},c.createRef=function(){return{current:null}},c.forwardRef=function(t){return{$$typeof:m,render:t}},c.isValidElement=U,c.lazy=function(t){return{$$typeof:E,_payload:{_status:-1,_result:t},_init:dt}},c.memo=function(t,o){return{$$typeof:b,type:t,compare:o===void 0?null:o}},c.startTransition=function(t){var o=y.T,u={};y.T=u;try{var a=t(),d=y.S;d!==null&&d(u,a),typeof a=="object"&&a!==null&&typeof a.then=="function"&&a.then(mt,et)}catch(v){et(v)}finally{y.T=o}},c.unstable_useCacheRefresh=function(){return y.H.useCacheRefresh()},c.use=function(t){return y.H.use(t)},c.useActionState=function(t,o,u){return y.H.useActionState(t,o,u)},c.useCallback=function(t,o){return y.H.useCallback(t,o)},c.useContext=function(t){return y.H.useContext(t)},c.useDebugValue=function(){},c.useDeferredValue=function(t,o){return y.H.useDeferredValue(t,o)},c.useEffect=function(t,o,u){var a=y.H;if(typeof u=="function")throw Error("useEffect CRUD overload is not enabled in this build of React.");return a.useEffect(t,o)},c.useId=function(){return y.H.useId()},c.useImperativeHandle=function(t,o,u){return y.H.useImperativeHandle(t,o,u)},c.useInsertionEffect=function(t,o){return y.H.useInsertionEffect(t,o)},c.useLayoutEffect=function(t,o){return y.H.useLayoutEffect(t,o)},c.useMemo=function(t,o){return y.H.useMemo(t,o)},c.useOptimistic=function(t,o){return y.H.useOptimistic(t,o)},c.useReducer=function(t,o,u){return y.H.useReducer(t,o,u)},c.useRef=function(t){return y.H.useRef(t)},c.useState=function(t){return y.H.useState(t)},c.useSyncExternalStore=function(t,o,u){return y.H.useSyncExternalStore(t,o,u)},c.useTransition=function(){return y.H.useTransition()},c.version="19.1.1",c}var st;function Rt(){return st||(st=1,D.exports=wt()),D.exports}var _=Rt();let Ct={data:""},Tt=e=>typeof window=="object"?((e?e.querySelector("#_goober"):window._goober)||Object.assign((e||document.head).appendChild(document.createElement("style")),{innerHTML:" ",id:"_goober"})).firstChild:e||Ct,Ot=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,St=/\/\*[^]*?\*\/|  +/g,nt=/\n+/g,S=(e,r)=>{let s="",i="",f="";for(let n in e){let p=e[n];n[0]=="@"?n[1]=="i"?s=n+" "+p+";":i+=n[1]=="f"?S(p,n):n+"{"+S(p,n[1]=="k"?"":r)+"}":typeof p=="object"?i+=S(p,r?r.replace(/([^,])+/g,m=>n.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,h=>/&/.test(h)?h.replace(/&/g,m):m?m+" "+h:h)):n):p!=null&&(n=/^--/.test(n)?n:n.replace(/[A-Z]/g,"-$&").toLowerCase(),f+=S.p?S.p(n,p):n+":"+p+";")}return s+(r&&f?r+"{"+f+"}":f)+i},R={},ut=e=>{if(typeof e=="object"){let r="";for(let s in e)r+=s+ut(e[s]);return r}return e},$t=(e,r,s,i,f)=>{let n=ut(e),p=R[n]||(R[n]=(h=>{let b=0,E=11;for(;b<h.length;)E=101*E+h.charCodeAt(b++)>>>0;return"go"+E})(n));if(!R[p]){let h=n!==e?e:(b=>{let E,w,T=[{}];for(;E=Ot.exec(b.replace(St,""));)E[4]?T.shift():E[3]?(w=E[3].replace(nt," ").trim(),T.unshift(T[0][w]=T[0][w]||{})):T[0][E[1]]=E[2].replace(nt," ").trim();return T[0]})(e);R[p]=S(f?{["@keyframes "+p]:h}:h,s?"":"."+p)}let m=s&&R.g?R.g:null;return s&&(R.g=R[p]),((h,b,E,w)=>{w?b.data=b.data.replace(w,h):b.data.indexOf(h)===-1&&(b.data=E?h+b.data:b.data+h)})(R[p],r,i,m),p},At=(e,r,s)=>e.reduce((i,f,n)=>{let p=r[n];if(p&&p.call){let m=p(s),h=m&&m.props&&m.props.className||/^go/.test(m)&&m;p=h?"."+h:m&&typeof m=="object"?m.props?"":S(m,""):m===!1?"":m}return i+f+(p??"")},"");function H(e){let r=this||{},s=e.call?e(r.p):e;return $t(s.unshift?s.raw?At(s,[].slice.call(arguments,1),r.p):s.reduce((i,f)=>Object.assign(i,f&&f.call?f(r.p):f),{}):s,Tt(r.target),r.g,r.o,r.k)}let at,z,K;H.bind({g:1});let C=H.bind({k:1});function jt(e,r,s,i){S.p=r,at=e,z=s,K=i}function $(e,r){let s=this||{};return function(){let i=arguments;function f(n,p){let m=Object.assign({},n),h=m.className||f.className;s.p=Object.assign({theme:z&&z()},m),s.o=/ *go\d+/.test(h),m.className=H.apply(s,i)+(h?" "+h:"");let b=e;return e[0]&&(b=m.as||e,delete m.as),K&&b[0]&&K(m),at(b,m)}return f}}var Mt=e=>typeof e=="function",G=(e,r)=>Mt(e)?e(r):e,Pt=(()=>{let e=0;return()=>(++e).toString()})(),kt=(()=>{let e;return()=>{if(e===void 0&&typeof window<"u"){let r=matchMedia("(prefers-reduced-motion: reduce)");e=!r||r.matches}return e}})(),Ht=20,ct=(e,r)=>{switch(r.type){case 0:return{...e,toasts:[r.toast,...e.toasts].slice(0,Ht)};case 1:return{...e,toasts:e.toasts.map(n=>n.id===r.toast.id?{...n,...r.toast}:n)};case 2:let{toast:s}=r;return ct(e,{type:e.toasts.find(n=>n.id===s.id)?1:0,toast:s});case 3:let{toastId:i}=r;return{...e,toasts:e.toasts.map(n=>n.id===i||i===void 0?{...n,dismissed:!0,visible:!1}:n)};case 4:return r.toastId===void 0?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(n=>n.id!==r.toastId)};case 5:return{...e,pausedAt:r.time};case 6:let f=r.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(n=>({...n,pauseDuration:n.pauseDuration+f}))}}},Nt=[],q={toasts:[],pausedAt:void 0},W=e=>{q=ct(q,e),Nt.forEach(r=>{r(q)})},It=(e,r="blank",s)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:r,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...s,id:s?.id||Pt()}),P=e=>(r,s)=>{let i=It(r,e,s);return W({type:2,toast:i}),i.id},x=(e,r)=>P("blank")(e,r);x.error=P("error");x.success=P("success");x.loading=P("loading");x.custom=P("custom");x.dismiss=e=>{W({type:3,toastId:e})};x.remove=e=>W({type:4,toastId:e});x.promise=(e,r,s)=>{let i=x.loading(r.loading,{...s,...s?.loading});return typeof e=="function"&&(e=e()),e.then(f=>{let n=r.success?G(r.success,f):void 0;return n?x.success(n,{id:i,...s,...s?.success}):x.dismiss(i),f}).catch(f=>{let n=r.error?G(r.error,f):void 0;n?x.error(n,{id:i,...s,...s?.error}):x.dismiss(i)}),e};var Lt=C`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,Ut=C`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,Yt=C`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,Dt=$("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${Lt} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${Ut} 0.15s ease-out forwards;
    animation-delay: 150ms;
    position: absolute;
    border-radius: 3px;
    opacity: 0;
    background: ${e=>e.secondary||"#fff"};
    bottom: 9px;
    left: 4px;
    height: 2px;
    width: 12px;
  }

  &:before {
    animation: ${Yt} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,qt=C`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,zt=$("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${qt} 1s linear infinite;
`,Kt=C`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,Gt=C`
0% {
	height: 0;
	width: 0;
	opacity: 0;
}
40% {
  height: 0;
	width: 6px;
	opacity: 1;
}
100% {
  opacity: 1;
  height: 10px;
}`,Wt=$("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${Kt} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${Gt} 0.2s ease-out forwards;
    opacity: 0;
    animation-delay: 200ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: ${e=>e.secondary||"#fff"};
    bottom: 6px;
    left: 6px;
    height: 10px;
    width: 6px;
  }
`,Bt=$("div")`
  position: absolute;
`,Qt=$("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,Zt=C`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,Jt=$("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${Zt} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,Xt=({toast:e})=>{let{icon:r,type:s,iconTheme:i}=e;return r!==void 0?typeof r=="string"?_.createElement(Jt,null,r):r:s==="blank"?null:_.createElement(Qt,null,_.createElement(zt,{...i}),s!=="loading"&&_.createElement(Bt,null,s==="error"?_.createElement(Dt,{...i}):_.createElement(Wt,{...i})))},Ft=e=>`
0% {transform: translate3d(0,${e*-200}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,Vt=e=>`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${e*-150}%,-1px) scale(.6); opacity:0;}
`,te="0%{opacity:0;} 100%{opacity:1;}",ee="0%{opacity:1;} 100%{opacity:0;}",re=$("div")`
  display: flex;
  align-items: center;
  background: #fff;
  color: #363636;
  line-height: 1.3;
  will-change: transform;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
  max-width: 350px;
  pointer-events: auto;
  padding: 8px 10px;
  border-radius: 8px;
`,oe=$("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,se=(e,r)=>{let s=e.includes("top")?1:-1,[i,f]=kt()?[te,ee]:[Ft(s),Vt(s)];return{animation:r?`${C(i)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${C(f)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}};_.memo(({toast:e,position:r,style:s,children:i})=>{let f=e.height?se(e.position||r||"top-center",e.visible):{opacity:0},n=_.createElement(Xt,{toast:e}),p=_.createElement(oe,{...e.ariaProps},G(e.message,e));return _.createElement(re,{className:e.className,style:{...f,...s,...e.style}},typeof i=="function"?i({icon:n,message:p}):_.createElement(_.Fragment,null,n,p))});jt(_.createElement);H`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`;export{x as c,ue as u};
