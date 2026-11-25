import json, base64, urllib.request, ssl, sys, uuid
CTX=ssl.create_default_context(cafile='/root/.ccr/ca-bundle.crt')
VOICE='v4cqTf6wc2CXwA2tR7TF'
def tts(text,out,lang='uz',model='eleven_v4',prev=None,nxt=None):
    b={"text":text,"model_id":model}
    if lang: b["language_code"]=lang
    if prev: b["previous_text"]=prev
    if nxt: b["next_text"]=nxt
    req=urllib.request.Request(f'https://api.elevenlabs.io/v1/text-to-speech/{VOICE}/with-timestamps?output_format=mp3_44100_128',data=json.dumps(b).encode(),headers={'Content-Type':'application/json','xi-api-key':'placeholder'})
    try: d=json.load(urllib.request.urlopen(req,context=CTX,timeout=300))
    except urllib.error.HTTPError as e: raise SystemExit(e.read()[:400])
    open(out,'wb').write(base64.b64decode(d['audio_base64'])); return d['alignment']
def stt(path,lang=None):
    bd=uuid.uuid4().hex; parts=[]
    def f(n,v): parts.append(f'--{bd}\r\nContent-Disposition: form-data; name="{n}"\r\n\r\n{v}\r\n'.encode())
    f('model_id','scribe_v1')
    if lang: f('language_code',lang)
    parts.append(f'--{bd}\r\nContent-Disposition: form-data; name="file"; filename="a.mp3"\r\nContent-Type: audio/mpeg\r\n\r\n'.encode()+open(path,'rb').read()+b'\r\n')
    parts.append(f'--{bd}--\r\n'.encode())
    req=urllib.request.Request('https://api.elevenlabs.io/v1/speech-to-text',data=b''.join(parts),headers={'Content-Type':f'multipart/form-data; boundary={bd}','xi-api-key':'placeholder'})
    try: return json.load(urllib.request.urlopen(req,context=CTX,timeout=300))
    except urllib.error.HTTPError as e: raise SystemExit(e.read()[:400])
