import sys, json, re, subprocess, numpy as np, urllib.request, base64
sys.path.insert(0,'/tmp/claude-0/-home-user-Resume-AI/ddfafebf-5d39-57bf-996e-465bf4cfcbff/scratchpad'); import el
SC=[
 [("uz","Ey ahmoq bola! \"Hezalak\" inglizchada nima bo'ladi, bilasanmi?! Kallang ishlaydimi o'zi?!")],
 [("uz","Hezalak — bu qo'rqoq, hech narsaga yuragi dov bermaydigan odam.")],
 [("uz","Ko'chada \"wimp\" deyishadi. Yoki \"chicken\" — ya'ni tovuq! Hey, chicken!")],
 [("uz","Lekin"),("en","IELTS"),("uz","Speaking'da \"wimp\" desang — examiner kuladi! Kallang ishlaydimi?!")],
 [("uz","Imtihonda \"coward\" de: \"He was too cowardly to say no.\" Yoki chiroyliroq — \"timid\": \"She is a bit timid.\"")],
 [("uz","Ey ahmoq bola, eslab qol! Ko'chada — wimp, chicken. Imtihonda — coward, timid!")],
 [("uz","Shunaqa so'zlarni Goprep.gg'da Preppy bilan gapirib mashq qil — noto'g'ri so'z ishlatsang, darrov aytib beradi!")],
 [("uz","Yangi so'zlarni esa Goprep.gg'dagi Runner o'yinida o'ynab yodla! Kallang ishlasa — hoziroq kir!")],
 [("uz","Keyingi so'z qaysi bo'lsin? Kommentda yoz! Saqlab qo'y, o'rtog'ingga tashla! Goprep.gg!")]]
def tts(text,lang,prev=None,nxt=None):
    b={"text":text,"model_id":"eleven_v4","language_code":lang,"voice_settings":{"speed":1.2}}
    if prev: b["previous_text"]=prev
    if nxt: b["next_text"]=nxt
    req=urllib.request.Request(f'https://api.elevenlabs.io/v1/text-to-speech/{el.VOICE}/with-timestamps?output_format=mp3_44100_128',data=json.dumps(b).encode(),headers={'Content-Type':'application/json','xi-api-key':'x'})
    d=json.load(urllib.request.urlopen(req,context=el.CTX,timeout=300)); return base64.b64decode(d['audio_base64']), d['alignment']
def words_of(a):
    ws=[]; cur=''
    for c,s,e in zip(a['characters'],a['character_start_times_seconds'],a['character_end_times_seconds']):
        if c.isspace():
            if cur: ws.append({'w':cur,'s':s0,'e':pe}); cur=''
        else:
            if not cur: s0=s
            cur+=c; pe=e
    if cur: ws.append({'w':cur,'s':s0,'e':pe})
    ws=[{'w':re.sub(r'^[^\w]+|[^\w\']+$','',x['w']),'s':x['s'],'e':x['e']} for x in ws]; return [x for x in ws if x['w']]
def gen(i):
    parts=SC[i-1]; allw=[]; files=[]; t0=0.0
    for j,(lang,text) in enumerate(parts):
        prev=' '.join(p[1] for p in parts[:j]) or (SC[i-2][-1][1] if i>1 else None); nxt=' '.join(p[1] for p in parts[j+1:]) or None
        audio,a=tts(text,lang,prev,nxt); open(f'p{i}_{j}.mp3','wb').write(audio)
        w=words_of(a)
        if len(parts)>1:  # trim to speech for splicing
            st=max(0,w[0]['s']-0.03); en=w[-1]['e']+0.05
        else: st=0; en=a['character_end_times_seconds'][-1]+0.1
        subprocess.run(['ffmpeg','-v','error','-y','-ss',str(st),'-to',str(en),'-i',f'p{i}_{j}.mp3','-ar','48000','-ac','2',f'p{i}_{j}.wav'],check=True)
        for x in w: allw.append({'w':x['w'],'s':round(x['s']-st+t0,3),'e':round(x['e']-st+t0,3)})
        files.append(f'p{i}_{j}.wav'); t0+=en-st+(0.04 if len(parts)>1 else 0)
    if len(files)==1: subprocess.run(['cp',files[0],f's{i}.wav'])
    else:
        inp=sum([['-i',f] for f in files],[]); flt=''.join(f'[{k}:a]' for k in range(len(files)))
        # 40 ms gap between spliced parts
        pads=';'.join(f'[{k}:a]apad=pad_dur=0.04[q{k}]' for k in range(len(files)))
        subprocess.run(['ffmpeg','-v','error','-y',*inp,'-filter_complex',pads+';'+''.join(f'[q{k}]' for k in range(len(files)))+f'concat=n={len(files)}:v=0:a=1[o]','-map','[o]',f's{i}.wav'],check=True)
    json.dump(allw,open(f's{i}.words.json','w'),ensure_ascii=False)
    return allw
if __name__=='__main__':
    from faster_whisper import WhisperModel
    from scipy.io import wavfile
    m=WhisperModel('large-v3',compute_type='int8')
    ids=[int(x) for x in sys.argv[1:]] or range(1,len(SC)+1)
    open('script.txt','w').write('\n\n'.join(' '.join(p[1] for p in s) for s in SC)+'\n')
    for i in ids:
        w=gen(i)
        subprocess.run(['ffmpeg','-v','error','-y','-i',f's{i}.wav','-ac','1','-ar','16000','chk.wav'])
        sr,x=wavfile.read('chk.wav'); x=x.astype(np.float32)/32768
        print(i,f"{w[-1]['e']:.2f}s uz|",' '.join(s.text.strip() for s in m.transcribe(x,language='uz',vad_filter=False,beam_size=5)[0]))
        if any(p[0]=='en' for p in SC[i-1]):
            print('   en|',' '.join(s.text.strip() for s in m.transcribe(x,language='en',vad_filter=False,beam_size=5)[0]))
