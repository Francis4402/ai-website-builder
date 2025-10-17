"use client"

import { useParams, useSearchParams } from 'next/navigation'
import ChatSection from '../_components/ChatSection'
// import ElementSettingSection from '../_components/ElementSettingSection'
import PlaygroundHeader from '../_components/PlaygroundHeader'
import WebsiteDesign from '../_components/WebsiteDesign'
import axios from 'axios'
import { useEffect, useState } from 'react'


export type Frame = {
  projectId: string,
  frameId: string,
  designCode: string,
  chatMessage: [
    {role: string, content: string}
  ]
}

export type Messages = {
  role: string,
  content: string
}

const Playground = () => {

  const {projectId} = useParams();
  const [frameDetails, setFrameDetails] = useState<Frame>();

  const params = useSearchParams();

  const frameId = params.get('frameId');

  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState<Messages[]>([]);
  
  const [generatedCode, setGeneratedCode] = useState<any>();

  useEffect(() => {
    frameId && GetFrameDetails();
  }, [frameId]);

  const GetFrameDetails = async () => {
    const result = await axios.get('/api/frames?frameId=' + frameId +'&projectId=' + projectId);
    setFrameDetails(result.data);
  }

  const Prompt = `userInput: {userInput}

  Instructions:

  1. If the user input is explicitly asking to generate code, design, or HTML/CSS/JS output (e.g., "Create a landing page", "Build a dashboard", "Generate HTML Tailwind CSS code"), then:

    - Generate a complete HTML Tailwind CSS code using Flowbite UI components.  
    - Use a modern design with **blue as the primary color theme**.  
    - Only include the <body> content (do not add <head> or <title>).  
    - Make it fully responsive for all screen sizes.  
    - All primary components must match the theme color.  
    - Add proper padding and margin for each element.  
    - Components should be independent; do not connect them.  
    - Use placeholders for all images:  
        - Light mode: https://community.softr.io/uploads/db9110/original/2X/7/74e6e7e382d0ff5d7773ca9a87e6f6f8817a68a6.jpeg
        - Dark mode: https://www.cibaky.com/wp-content/uploads/2015/12/placeholder-3.jpg
        - Add alt tag describing the image prompt.  
    - Use the following libraries/components where appropriate:  
        - FontAwesome icons (fa fa-)  
        - Flowbite UI components: buttons, modals, forms, tables, tabs, alerts, cards, dialogs, dropdowns, accordions, etc.  
        - Chart.js for charts & graphs  
        - Swiper.js for sliders/carousels  
        - Tippy.js for tooltips & popovers  
    - Include interactive components like modals, dropdowns, and accordions.  
    - Ensure proper spacing, alignment, hierarchy, and theme consistency.  
    - Ensure charts are visually appealing and match the theme color.  
    - Header menu options should be spread out and not connected.  
    - Do not include broken links.  
    - Do not add any extra text before or after the HTML code.  

  2. If the user input is **general text or greetings** (e.g., "Hi", "Hello", "How are you?") **or does not explicitly ask to generate code**, then:

    - Respond with a simple, friendly text message instead of generating any code.  

  Example:

  - User: "Hi" → Response: "Hello! How can I help you today?"  
  - User: "Build a responsive landing page with Tailwind CSS" → Response: [Generate full HTML code as per instructions above]
`


  const SendMessage = async (userInput: string) => {
    setLoading(true);
    
    setMessages((prev) => [
      ...prev,
      {role: 'user', content: userInput}
    ]);

    const result = await axios.post('/api/ai-model', {
      method: 'POST',
      body: JSON.stringify({
        messages: [{role: "user", content: userInput}]
      })
    });

    const reader = result.data?.body?.getReader();
    const decoder = new TextDecoder();

    let aiResponse = '';
    let isCode = false;

    while(true) {
      const {done, value} = await reader?.read();
      if (done) break;

      const chunk = decoder.decode(value, {stream: true});
      aiResponse += chunk;

      if(!isCode && aiResponse.includes('```html')) {
        isCode = true;
        const index = aiResponse.indexOf('```html')+7;
        const initialCodeChunk = aiResponse.slice(index);
        setGeneratedCode((prev: any) => prev + initialCodeChunk);
      } else if (isCode) {
        setGeneratedCode((prev: any) => prev + chunk);
      }

      if (!isCode) {
        setMessages((prev) => [
          ...prev,
          {role: 'assistant', content: aiResponse}
        ])
      } else {
        setMessages((prev) => [
          ...prev,
          {role: 'assistant', content: 'Your code is reader!'}
        ])
      }
    }
    setLoading(false);
  }

  return (
    <div>
        <PlaygroundHeader />
        
        <div className='flex'>
            <ChatSection messages={messages ?? []} onSend={(input: string) => SendMessage(input)} />

            <WebsiteDesign/>

            {/* <ElementSettingSection/> */}
        </div>
    </div>
  )
}

export default Playground