import React, { useState } from 'react';
import Card from '../components/Card';
import { PaperAirplaneIcon } from '../components/icons/PaperAirplaneIcon';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Aqui você pode adicionar a lógica para enviar o formulário
        // Por exemplo, enviar para um backend ou serviço de e-mail
        console.log('Formulário enviado:', formData);
        setSubmitted(true);
        setTimeout(() => {
            setSubmitted(false);
            setFormData({ name: '', email: '', subject: '', message: '' });
        }, 3000);
    };

    return (
        <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-6">
            <Card className="p-4 sm:p-6">
                <h1 className="text-2xl font-bold mb-6 text-gray-800">Entre em Contato</h1>
                
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Informações de Contato */}
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Informações de Contato</h2>
                            <p className="text-gray-600 mb-6">
                                Estamos aqui para ajudar! Entre em contato conosco através dos canais abaixo ou preencha o formulário ao lado.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-start gap-4">
                                <div className="h-12 w-12 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <span className="text-2xl">📧</span>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-1">E-mail</h3>
                                    <p className="text-gray-600 text-sm">contato@nutrihealthgen.com</p>
                                    <p className="text-gray-600 text-sm">suporte@nutrihealthgen.com</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <span className="text-2xl">💬</span>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-1">Suporte</h3>
                                    <p className="text-gray-600 text-sm">Segunda a Sexta: 9h às 18h</p>
                                    <p className="text-gray-600 text-sm">Tempo médio de resposta: 24 horas</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <span className="text-2xl">🔒</span>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-1">Privacidade</h3>
                                    <p className="text-gray-600 text-sm">privacidade@nutrihealthgen.com</p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-gray-200">
                            <h3 className="font-semibold text-gray-900 mb-3">Perguntas Frequentes</h3>
                            <p className="text-gray-600 text-sm mb-4">
                                Antes de entrar em contato, verifique nossa seção de FAQ na landing page. Muitas dúvidas comuns já estão respondidas lá.
                            </p>
                            <a 
                                href="/#faq" 
                                className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                            >
                                Ver Perguntas Frequentes →
                            </a>
                        </div>
                    </div>

                    {/* Formulário de Contato */}
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Envie uma Mensagem</h2>
                        
                        {submitted ? (
                            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center">
                                <div className="text-4xl mb-3">✓</div>
                                <h3 className="font-semibold text-emerald-900 mb-2">Mensagem Enviada!</h3>
                                <p className="text-emerald-700 text-sm">
                                    Obrigado pelo contato. Responderemos em breve.
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                        Nome
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors"
                                        placeholder="Seu nome completo"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                        E-mail
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors"
                                        placeholder="seu@email.com"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                                        Assunto
                                    </label>
                                    <select
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors"
                                    >
                                        <option value="">Selecione um assunto</option>
                                        <option value="suporte">Suporte Técnico</option>
                                        <option value="dúvida">Dúvida sobre o App</option>
                                        <option value="sugestão">Sugestão</option>
                                        <option value="privacidade">Privacidade e Dados</option>
                                        <option value="parceria">Parcerias</option>
                                        <option value="outro">Outro</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                                        Mensagem
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows={6}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors resize-none"
                                        placeholder="Descreva sua dúvida ou mensagem..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-emerald-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                                >
                                    <PaperAirplaneIcon className="w-5 h-5" />
                                    Enviar Mensagem
                                </button>
                            </form>
                        )}
                    </div>
                </div>

                <div className="border-t border-gray-200 pt-6 mt-8">
                    <div className="bg-gray-50 rounded-xl p-6">
                        <h3 className="font-semibold text-gray-900 mb-3">Outros Recursos</h3>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <a 
                                href="/terms" 
                                className="text-emerald-600 hover:text-emerald-700 text-sm font-medium flex items-center gap-2"
                            >
                                <span>📄</span>
                                Termos de Uso
                            </a>
                            <a 
                                href="/privacy" 
                                className="text-emerald-600 hover:text-emerald-700 text-sm font-medium flex items-center gap-2"
                            >
                                <span>🔒</span>
                                Política de Privacidade
                            </a>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default Contact;

