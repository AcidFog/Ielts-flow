"use client"
import { api } from '@/convex/_generated/api';
import { CoachingExpert } from '@/services/Options';
import { useMutation, useQuery } from 'convex/react';
import { useParams } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'
import Image from "next/image";
import { UserButton } from '@stackframe/stack';
import { Button } from '@/components/ui/button';
import RecordRTC from 'recordrtc';
import { RealtimeTranscriber } from 'assemblyai';
import { AIModel, ConvertTextToSpeech, getToken } from '@/services/GlobalServices';
import { Loader2Icon } from 'lucide-react';
import ChatBox from './_components/ChatBox';

function DiscussionRoom() {
    const{roomid}= useParams();
    const DiscussionRoomData=useQuery(api.DiscussionRoom.GetDiscussionRoom,{id:roomid});
    const [expert,setExpert]=useState();
    const[enableMic,setEnableMic]=useState(false);
    const recorder=useRef(null);
    const realtimeTranscriber=useRef(null);
    const[transcribe,SetTranscribe] = useState();
    const [enableFeedbackNotes,setEnableFeedbackNotes]=useState(false);
    const [conversation, setConversation] = useState([{
      role:'assistant',
      content:'Hi'
    },{
      role:'user',
      content:'Hello'
    }]);

  

    const[loading,setLoading]=useState(false);
    const[audioUrl,setAudioUrl]=useState();
    const audioRef = useRef(null);

    const UpdateConversation=useMutation(api.DiscussionRoom.UpdateConversation)
    let silenceTimeout;
    let texts={};
    
    useEffect(()=>{
      if(DiscussionRoomData){
        const Expert=CoachingExpert.find(item=>item.name==DiscussionRoomData.expertName);
        setExpert(Expert);
      }
    },[DiscussionRoomData])

    const connectToServer= async ()=>{
      setEnableMic(true);
      setLoading(true);
      

      realtimeTranscriber.current = new RealtimeTranscriber({
        token:await getToken(),
        sample_rate:16_000
      })


      realtimeTranscriber.current.on("transcript", async(transcript)=>{

        texts[transcript.audio_start]= transcript?.text;
        const keys=Object.keys(texts);
        keys.sort((a,b)=>a-b);
        let msg='';

        if (transcript.message_type === 'FinalTranscript') {
          setConversation(prev => [...prev, {
            role: 'user',
            content: transcript.text


            
          }]);
        }


        for(const key of keys){
          if(texts[key]){
            msg+=`${texts[key]}`
          }
        }

        SetTranscribe(msg);
      })
await realtimeTranscriber.current.connect();
setLoading(false);
if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
  navigator.mediaDevices.getUserMedia({ audio: true })
    .then((stream) => {
      recorder.current = new RecordRTC(stream, {
        type: 'audio',
        mimeType: 'audio/webm;codecs=pcm',
        recorderType: RecordRTC.StereoAudioRecorder,
        timeSlice: 250,
        desiredSampRate: 16000,
        numberOfAudioChannels: 1,
        bufferSize: 4096,
        audioBitsPerSecond: 128000,
        ondataavailable: async (blob) => {
          if (!realtimeTranscriber.current) return;

          // Reset the silence detection timer on audio input
          clearTimeout(silenceTimeout);

          const buffer = await blob.arrayBuffer();

          realtimeTranscriber.current.sendAudio(buffer); 

          // Restart the silence detection timer
          silenceTimeout = setTimeout(() => {
            console.log('User stopped talking');
            // Handle user stopped talking (e.g., send final transcript, stop recording, etc.)
          }, 2200);
        }
      });

      recorder.current.startRecording();
    })
    .catch((err) => console.error(err));
}
    }
 
    useEffect(() => {
      async function fetchData() {
        if (conversation[conversation.length - 1].role === 'user') {
          if (!DiscussionRoomData) return;
          // Calling AI text Model to Get Response
          const lastTwoMsg = conversation.slice(-2);
          const aiResp = await AIModel(
            DiscussionRoomData.topic,
            DiscussionRoomData.coachingOption,
            lastTwoMsg
          );
          const url= await ConvertTextToSpeech(aiResp.content,DiscussionRoomData.expertName);
          console.log(url);
          setAudioUrl(url);
          setConversation(prev => [...prev, aiResp]);
        }
      }

      fetchData();
    }, [conversation]);

    useEffect(() => {
      if (audioUrl && audioRef.current) {
        audioRef.current.load();
        audioRef.current.play().catch((e) => {
          console.log('⛔️ Автовоспроизведение не сработало:', e);
        });
      }
    }, [audioUrl]);

    const disconnect = async (e) => {
      e.preventDefault();
      setLoading(true);
      setEnableFeedbackNotes(true);

      await UpdateConversation({
        id:DiscussionRoomData._id,
        conversation:conversation
      })

      try {
        if (realtimeTranscriber.current) {
          await realtimeTranscriber.current.close();
          realtimeTranscriber.current = null;
        }

        if (recorder.current) {
          await recorder.current.stopRecording(); // безопасное завершение записи
          recorder.current.pauseRecording();
          recorder.current = null;
        }

        clearTimeout(silenceTimeout);
        texts = {};
        SetTranscribe("");
      } catch (err) {
        console.error("Error during disconnect:", err);
      } finally {
        setEnableMic(false);
      }
      setLoading(false);
    }
  return (
    <div className='-mt-12'>
      <h2 className='text-lg font-bold'>{DiscussionRoomData?.coachingOption}</h2>
      <div className='mt-5 grid grid-cols-1 lg:grid-cols-3 gap-10'>
        <div className='lg:col-span-2'>
        <div className=' h-[60vh] bg-secondary border rounded-4xl flex flex-col items-center justify-center relative'>
        <Image 
  src={expert?.avatar || "/default-avatar.png"} 
  alt="Avatar" 
  width={200} 
  height={200} 
  className='h-[80px] w-[80px] rounded-full object-cover animate-pulse' 
/>
          <h2 className='text-gray-500'>{expert?.name}</h2>

          
            {audioUrl && (
              <audio ref={audioRef} autoPlay>
                <source src={audioUrl} type="audio/mp3" />
              </audio>
            )}
          

          <div className='p-5 bg-gray-200 px-10 rounded-lg absolute bottom-10 right-10'>
            <UserButton/>
          </div>
        </div>
        <div className='mt-5 flex items-center justify-center '>
          {!enableMic ?<Button onClick={connectToServer} disabled={loading}>
            {loading&&<Loader2Icon className='animate-spin'/>}Connect</Button>
          :
          <Button variant="destructive" onClick={disconnect}>
            {loading&&<Loader2Icon className='animate-spin'/>}
            Disconnect</Button>}
          
        </div>
        </div>
        
        <div>
        <ChatBox conversation={conversation} enableFeedbackNotes={enableFeedbackNotes}
        coachingOption={DiscussionRoomData?.coachingOption}/>
          </div>
      </div>

      <div>
        <h2>{transcribe}</h2>
      </div>
    </div>

  )
}

export default DiscussionRoom