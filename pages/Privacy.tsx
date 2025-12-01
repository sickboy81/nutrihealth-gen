import React, { useEffect } from 'react';
import Card from '../components/Card';

const Privacy = () => {
    useEffect(() => {
        // Update document title and meta tags for SEO
        document.title = 'Política de Privacidade - NutriHealth Gen | Proteção de Dados LGPD';
        
        // Update or create meta description
        let metaDescription = document.querySelector('meta[name="description"]');
        if (!metaDescription) {
            metaDescription = document.createElement('meta');
            metaDescription.setAttribute('name', 'description');
            document.head.appendChild(metaDescription);
        }
        metaDescription.setAttribute('content', 'Política de Privacidade do NutriHealth Gen. Saiba como coletamos, usamos e protegemos seus dados pessoais. Conformidade com LGPD e proteção de privacidade.');
        
        // Add structured data for SEO
        const structuredData = {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Política de Privacidade - NutriHealth Gen",
            "description": "Política de privacidade e proteção de dados do aplicativo NutriHealth Gen",
            "url": window.location.href,
            "datePublished": "2024-01-15",
            "dateModified": new Date().toISOString().split('T')[0],
            "inLanguage": "pt-BR",
            "isPartOf": {
                "@type": "WebSite",
                "name": "NutriHealth Gen",
                "url": window.location.origin
            }
        };
        
        let scriptTag = document.querySelector('script[type="application/ld+json"][data-privacy]');
        if (!scriptTag) {
            scriptTag = document.createElement('script');
            scriptTag.setAttribute('type', 'application/ld+json');
            scriptTag.setAttribute('data-privacy', 'true');
            document.head.appendChild(scriptTag);
        }
        scriptTag.textContent = JSON.stringify(structuredData);
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-6">
                <article itemScope itemType="https://schema.org/Article">
                    <Card className="p-4 sm:p-6">
                        <header>
                            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900" itemProp="headline">Política de Privacidade</h1>
                            <p className="text-sm text-gray-500 mb-4">
                                Última atualização: <time itemProp="dateModified" dateTime={new Date().toISOString()}>{new Date().toLocaleDateString('pt-BR')}</time>
                            </p>
                        </header>
                
                        <div className="space-y-6 text-gray-700 leading-relaxed">

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Introdução</h2>
                        <p className="mb-3">
                            O NutriHealth Gen ("nós", "nosso" ou "aplicativo") está comprometido em proteger sua privacidade. Esta Política de Privacidade explica como coletamos, usamos, divulgamos e protegemos suas informações quando você usa nosso serviço.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Informações que Coletamos</h2>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 mt-4">2.1. Informações Fornecidas por Você</h3>
                        <ul className="list-disc list-inside space-y-2 ml-4 mb-3">
                            <li><strong>Dados da Conta:</strong> Nome, e-mail, senha (criptografada)</li>
                            <li><strong>Perfil de Saúde:</strong> Idade, peso, altura, gênero, objetivos, restrições alimentares</li>
                            <li><strong>Dados de Uso:</strong> Refeições registradas, planos alimentares, preferências</li>
                            <li><strong>Imagens:</strong> Fotos de alimentos enviadas para análise (NutriScan)</li>
                        </ul>

                        <h3 className="text-lg font-semibold text-gray-900 mb-2 mt-4">2.2. Informações Coletadas Automaticamente</h3>
                        <ul className="list-disc list-inside space-y-2 ml-4 mb-3">
                            <li>Dados de uso do aplicativo</li>
                            <li>Informações do dispositivo (tipo, sistema operacional)</li>
                            <li>Endereço IP e localização aproximada</li>
                            <li>Cookies e tecnologias similares</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Como Usamos Suas Informações</h2>
                        <p className="mb-3">Usamos as informações coletadas para:</p>
                        <ul className="list-disc list-inside space-y-2 ml-4 mb-3">
                            <li>Fornecer e melhorar nossos serviços</li>
                            <li>Personalizar sua experiência no aplicativo</li>
                            <li>Gerar planos alimentares adaptados ao seu perfil</li>
                            <li>Processar análises nutricionais de imagens</li>
                            <li>Enviar notificações e atualizações sobre o serviço</li>
                            <li>Responder a suas solicitações e fornecer suporte</li>
                            <li>Detectar e prevenir fraudes e abusos</li>
                            <li>Cumprir obrigações legais</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Compartilhamento de Informações</h2>
                        <p className="mb-3">Não vendemos suas informações pessoais. Podemos compartilhar suas informações apenas nas seguintes situações:</p>
                        <ul className="list-disc list-inside space-y-2 ml-4 mb-3">
                            <li><strong>Prestadores de Serviços:</strong> Com empresas que nos ajudam a operar nosso serviço (hospedagem, análise de dados, processamento de pagamentos)</li>
                            <li><strong>Inteligência Artificial:</strong> Imagens e dados podem ser processados por serviços de IA terceirizados para análise nutricional</li>
                            <li><strong>Obrigações Legais:</strong> Quando exigido por lei ou para proteger nossos direitos</li>
                            <li><strong>Com seu Consentimento:</strong> Em outras situações com sua autorização explícita</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Segurança dos Dados</h2>
                        <p className="mb-3">
                            Implementamos medidas de segurança técnicas e organizacionais para proteger suas informações pessoais contra acesso não autorizado, alteração, divulgação ou destruição. Isso inclui:
                        </p>
                        <ul className="list-disc list-inside space-y-2 ml-4 mb-3">
                            <li>Criptografia de dados em trânsito e em repouso</li>
                            <li>Autenticação segura e controle de acesso</li>
                            <li>Monitoramento regular de segurança</li>
                            <li>Backups regulares dos dados</li>
                        </ul>
                        <p className="mb-3">
                            No entanto, nenhum método de transmissão pela Internet ou armazenamento eletrônico é 100% seguro. Embora nos esforcemos para proteger suas informações, não podemos garantir segurança absoluta.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Seus Direitos</h2>
                        <p className="mb-3">De acordo com a LGPD (Lei Geral de Proteção de Dados), você tem os seguintes direitos:</p>
                        <ul className="list-disc list-inside space-y-2 ml-4 mb-3">
                            <li><strong>Acesso:</strong> Solicitar uma cópia dos dados pessoais que mantemos sobre você</li>
                            <li><strong>Correção:</strong> Solicitar a correção de dados incompletos ou inexatos</li>
                            <li><strong>Exclusão:</strong> Solicitar a exclusão de seus dados pessoais</li>
                            <li><strong>Portabilidade:</strong> Solicitar a transferência de seus dados para outro serviço</li>
                            <li><strong>Revogação:</strong> Revogar seu consentimento a qualquer momento</li>
                            <li><strong>Oposição:</strong> Opor-se ao processamento de seus dados pessoais</li>
                        </ul>
                        <p className="mb-3">
                            Para exercer esses direitos, entre em contato conosco através da página de contato.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Retenção de Dados</h2>
                        <p className="mb-3">
                            Mantemos suas informações pessoais apenas pelo tempo necessário para cumprir os propósitos descritos nesta política, a menos que um período de retenção mais longo seja exigido ou permitido por lei. Quando você exclui sua conta, excluímos ou anonimizamos seus dados pessoais, exceto quando a retenção for necessária para fins legais.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Cookies e Tecnologias Similares</h2>
                        <p className="mb-3">
                            Usamos cookies e tecnologias similares para melhorar sua experiência, analisar o uso do serviço e personalizar conteúdo. Você pode controlar o uso de cookies através das configurações do seu navegador.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Privacidade de Menores</h2>
                        <p className="mb-3">
                            Nosso serviço não é direcionado a menores de 18 anos. Não coletamos intencionalmente informações pessoais de menores. Se você é pai ou responsável e acredita que seu filho nos forneceu informações pessoais, entre em contato conosco.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">10. Alterações nesta Política</h2>
                        <p className="mb-3">
                            Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos você sobre mudanças significativas publicando a nova política nesta página e atualizando a data de "Última atualização". Recomendamos que você revise esta política regularmente.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">11. Contato</h2>
                        <p className="mb-3">
                            Se você tiver dúvidas sobre esta Política de Privacidade ou sobre como tratamos suas informações pessoais, entre em contato conosco:
                        </p>
                        <ul className="list-none space-y-2 ml-4 mb-3">
                            <li><strong>E-mail:</strong> privacidade@nutrihealthgen.com</li>
                            <li><strong>Página de Contato:</strong> /contact</li>
                        </ul>
                    </section>

                            <footer className="border-t border-gray-200 pt-4 mt-6">
                                <p className="text-sm text-gray-500 text-center">
                                    © {new Date().getFullYear()} NutriHealth Gen. Todos os direitos reservados.
                                </p>
                                <div className="mt-4 text-center space-x-4">
                                    <a href="/#/terms" className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">Termos de Uso</a>
                                    <span className="text-gray-300">|</span>
                                    <a href="/#/contact" className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">Contato</a>
                                </div>
                            </footer>
                        </div>
                    </article>
                </Card>
            </div>
        </div>
    );
};

export default Privacy;

