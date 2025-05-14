import axios from "axios"
import OpenAI from "openai"
import { CoachingOptions } from "./Options";
import { PollyClient, SynthesizeSpeechCommand } from "@aws-sdk/client-polly";

export const getToken = async ()=>{
    const result= await axios.get('/api/getToken');
    return result.data
}
const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY, // 👈 не забудь указать ключ в .env с префиксом NEXT_PUBLIC
    dangerouslyAllowBrowser: true, // только если ты реально вызываешь с клиента
  });
  
  export const AIModel = async (topic, coachingOption, LastTwoConversation) => {
    const option = CoachingOptions.find((item) => item.name === coachingOption);
    const PROMPT = option.prompt.replace('{user-topic}', topic);
  
    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o', // или 'gpt-3.5-turbo'
        messages: [
          { role: 'assistant', content: PROMPT },
          ...LastTwoConversation
        ],
      });
  
      console.log(completion.choices[0].message);
      return completion.choices?.[0]?.message || null;
    } catch (error) {
      console.error('❌ OpenAI error:', error.message);
      return null;
    }
  };


   export const AIModelToGenerateFeedbackAndNotes = async (coachingOption, conversation) => {
    const option = CoachingOptions.find((item) => item.name === coachingOption);
    const PROMPT = (option.summeryPrompt);
  
    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o', // или 'gpt-3.5-turbo'
        messages: [
          
          ...conversation,
          { role: 'assistant', content: PROMPT }
        ],
      });
  
      console.log(completion.choices[0].message);
      return completion.choices?.[0]?.message || null;
    } catch (error) {
      console.error('❌ OpenAI error:', error.message);
      return null;
    }
  };

export const ConvertTextToSpeech = async (text, expertName) => {
  const pollyClient = new PollyClient({
    region: 'us-east-1',
    credentials: {
      accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_KEY,
    }
  });

  const command = new SynthesizeSpeechCommand({
    OutputFormat: 'mp3',
    Text: text,
    VoiceId: expertName
  });

  try {
    const { AudioStream } = await pollyClient.send(command);
    const audioArrayBuffer = await AudioStream.transformToByteArray();
    const audioBlob = new Blob([audioArrayBuffer], { type: 'audio/mp3' });
    const audioUrl = URL.createObjectURL(audioBlob);
    return audioUrl;
  } catch (e) {
    console.log(e);
  }
};
