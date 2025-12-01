
import React, { useState, useRef, useEffect } from 'react';
import { useI18n } from '../contexts/I18nContext';
import { useUserData } from '../contexts/UserDataContext';
import { sendNutritionChatMessage } from '../services/geminiService';
import { PaperAirplaneIcon } from '../components/icons/PaperAirplaneIcon';
import { UserIcon } from '../components/icons/UserIcon';
import { SparklesIcon } from '../components/icons/SparklesIcon';
import Spinner from '../components/Spinner';
import { TrashIcon } from '../components/icons/TrashIcon';

const Chat = () => {
    const { t, language } = useI18n();
    const { chatHistory, addChatMessage, clearChat, assistantName } = useUserData();
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [chatHistory]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userText = input.trim();
        setInput('');
        addChatMessage('user', userText);
        setIsLoading(true);

        try {
            // Provide context from history
            const contextHistory = chatHistory.map(msg => ({role: msg.role, text: msg.text}));
            const responseText = await sendNutritionChatMessage(contextHistory, userText, language, assistantName);
            addChatMessage('model', responseText);
        } catch (error) {
            console.error("Chat error", error);
            addChatMessage('model', "Desculpe, tive um problema ao processar sua pergunta. Tente novamente.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-10rem)] max-w-2xl mx-auto px-4">
            <div className="flex-1 overflow-y-auto space-y-4 p-2 scrollbar-hide">
                {chatHistory.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 space-y-4 opacity-70">
                         <div className="bg-emerald-100 p-4 rounded-full">
                             <SparklesIcon className="w-10 h-10 text-emerald-500" />
                         </div>
                         <p className="max-w-xs text-lg font-medium text-gray-500">{t('chat.welcome', { name: assistantName })}</p>
                    </div>
                )}
                
                {chatHistory.map((msg) => (
                    <div 
                        key={msg.id} 
                        className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`flex max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-end gap-2`}>
                             <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${msg.role === 'user' ? 'bg-gray-200' : 'bg-emerald-100'}`}>
                                 {msg.role === 'user' ? <UserIcon className="w-5 h-5 text-gray-600" /> : <SparklesIcon className="w-5 h-5 text-emerald-600" />}
                             </div>
                             <div 
                                className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                                    msg.role === 'user' 
                                        ? 'bg-emerald-600 text-white rounded-br-none' 
                                        : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
                                }`}
                             >
                                 {msg.text}
                             </div>
                        </div>
                    </div>
                ))}
                 {isLoading && (
                    <div className="flex justify-start w-full">
                        <div className="flex flex-row items-end gap-2">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-emerald-100">
                                <SparklesIcon className="w-5 h-5 text-emerald-600" />
                            </div>
                            <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-none border border-gray-100 shadow-sm flex items-center gap-2">
                                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></span>
                                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce delay-75"></span>
                                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce delay-150"></span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="pt-4 bg-gray-50">
                {chatHistory.length > 0 && (
                    <button onClick={clearChat} className="text-xs text-gray-400 hover:text-red-500 mb-2 ml-2 flex items-center gap-1">
                        <TrashIcon className="w-3 h-3"/> {t('chat.clear')}
                    </button>
                )}
                <form onSubmit={handleSend} className="relative flex items-center">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={t('chat.placeholder')}
                        className="w-full py-4 pl-5 pr-12 bg-white border border-gray-200 rounded-full shadow-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || isLoading}
                        className="absolute right-2 p-2 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
                    >
                        <PaperAirplaneIcon className="w-5 h-5 transform rotate-90 translate-x-[-1px] translate-y-[1px]" />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Chat;
