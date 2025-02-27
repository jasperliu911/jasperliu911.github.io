const o={year:'numeric',month:'2-digit',day:'2-digit'},t={date:new Date().toLocaleDateString('zh-CN',o),times:10};
(!sessionStorage.getItem('useTimes')||JSON.parse(sessionStorage.getItem('useTimes')).date!==t.date)&&sessionStorage.setItem('useTimes',JSON.stringify(t));
document.getElementById('tip_notice').innerHTML=`由于机器人前期研发阶段，经费有限，故每天使用次数有限，今日使用次数：${JSON.parse(sessionStorage.getItem('useTimes')).times}次，望理解！`;
document.addEventListener('DOMContentLoaded',()=>{
const[b,i,s,x,l]=['chat-box','user-input','send-btn','send-text','loading-spinner'].map(id=>document.getElementById(id));
const a=(m,r)=>{const e=document.createElement('div');e.classList.add('message',`${r}-message`);e.textContent=m;b.appendChild(e);b.scrollTop=b.scrollHeight};
const c=async m=>{const r=await fetch('https://api.deepseek.com/v1/chat/completions',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer sk-b55e871396bc46afac2e5062c2a9b566'},body:JSON.stringify({model:'deepseek-chat',messages:[{role:'user',content:m}]})});return(await r.json()).choices[0].message.content};
s.addEventListener('click',async()=>{
let u=JSON.parse(sessionStorage.getItem('useTimes'));
if(u.times<=0)return a('抱歉，已达到调用次数上限。(挺贵的，给我省点！😠)','ai');
sessionStorage.setItem('useTimes',JSON.stringify({...u,times:u.times-1}));
const m=i.value.trim();
if(!m)return;
a(m,'user');
[i.disabled,s.disabled]=[true,true];
x.classList.add('hidden');
l.classList.remove('hidden');
try{a(await c(m),'ai')}catch{a('抱歉，请求失败，请稍后重试。','ai')}
[i.disabled,s.disabled]=[false,false];
x.classList.remove('hidden');
l.classList.add('hidden');
i.value='';
i.focus()
})});