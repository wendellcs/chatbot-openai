import { useState } from 'react'
import './App.css'
import { RiRobot2Line } from "react-icons/ri";
import { BsSend } from "react-icons/bs";
import axios from 'axios';

function App() {
  const [messages, setMessages] = useState([{
    id: 0,
    message: 'Olá! Como posso ajudar?',
    createdAt: new Date(),
    from: 'bot'
  }])

  const [userMessage, setUserMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSendMessage() {
    if(userMessage.trim() === '') return;

    setLoading(true);

    const newMessage = {
      id: messages.length,
      message: userMessage,
      createdAt: new Date(),
      from: 'user'
    }
    setUserMessage('')
    setMessages([...messages, newMessage])
    
    await axios.post('https://chatbot-backend-rm3f.onrender.com/chat', { message: userMessage })
      .then((response) => {
        const botMessage = {
          id: messages.length + 1,
          message: response.data.reply,
          createdAt: new Date(),
          from: 'bot'
        }
        setMessages([...messages, newMessage, botMessage])
      

        setLoading(false);
      })
      .catch((error) => {
        console.error('Erro ao enviar mensagem:', error);
      });
  }

  return (
    <div className="container">
      <header>
        <div className="icon">
          <RiRobot2Line size={30} color="#FFF" />
        </div>
        <div className="box">
          <h1>Assistente Virtual</h1>
          <p>Sempre online</p>
        </div>
      </header>

     <div className="chatbot">
        {messages.map((msg) => (
          <div key={msg.id} className={`message ${msg.from}`}>
            <div dangerouslySetInnerHTML={{ __html: msg.message }}></div>
            <p className='date'>{msg.createdAt.toLocaleTimeString()}</p>
          </div>
        ))}

        {loading && (
          <div className="message bot">
            <p className='generated-message'>Digitando...</p>
          </div>
        )}
     </div>

     <footer>
        <form action="#" onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}>
          <input onChange={(e) => setUserMessage(e.target.value)} value={userMessage} type="text" placeholder="Digite sua mensagem..." />
          <button type='submit'><BsSend size={20} color="#FFF"/></button>
        </form>
     </footer>
    </div>
  )
}

export default App
