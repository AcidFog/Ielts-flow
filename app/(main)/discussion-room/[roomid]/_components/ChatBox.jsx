import { Button } from '@/components/ui/button';
import { api } from '@/convex/_generated/api';
import { useParams } from 'next/navigation';
import { AIModelToGenerateFeedbackAndNotes } from '@/services/GlobalServices';
import { useMutation } from 'convex/react';
import { LoaderCircle } from 'lucide-react';

import React, { useState } from 'react'

function ChatBox({conversation, enableFeedbackNotes, coachingOption}) {
  const[loading,setLoading]=useState(false);

  const updateSummery=useMutation(api.DiscussionRoom.updateSummery);
  const {roomid}=useParams();

  const GenerateFeedbackNotes=async()=>{
    try{
      setLoading(true);
      const result = await AIModelToGenerateFeedbackAndNotes(coachingOption,conversation)
      console.log(result.content)
      
      await updateSummery({
        id: roomid,
        summery: result.content
      })

      setLoading(false);
    }
    
    catch(e){
      setLoading(false);
    }
  }
  return (
    <div>
      <div className='h-[60vh] bg-secondary border rounded-xl flex flex-col  relative p-4 overflow-auto'>
        

       
            {conversation.map((item, index) => (
              <div className={`flex ${item.role=='user' &&'justify-end'}`} key={index}>
                {item.role === 'assistant' ? (
                  <h2 className='p-1 px-2 bg-primary mt-2 text-white inline-block rounded-md'>{item.content}</h2>
                ) : (
                    <h2 className='p-1 px-2 bg-gray-200 mt-2 text-black inline-block  justify-end rounded-md'>{item.content}</h2>
                )}
              </div>
            ))}

        


      </div>
     {!enableFeedbackNotes?  <h2 className='mt-4 text-gray-400 text-sm'>
        At the end of your conversation we will auto generate feedback/notes from your conversation</h2>
        : <Button onClick={GenerateFeedbackNotes} disabled={loading} className={'mt-7 w-full'}>
          {loading&&<LoaderCircle className='animate-spin'/>}Generate Feedback/Notes</Button>}
    </div>
  );
}

export default ChatBox
