import React from 'react';
import Card from '../components/Card';

const Terms = () => {
    return (
        <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-6">
            <Card className="p-4 sm:p-6">
                <h1 className="text-2xl font-bold mb-6 text-gray-800">Termos de Uso</h1>
                
                <div className="space-y-6 text-gray-700 leading-relaxed">
                    <div>
                        <p className="text-sm text-gray-500 mb-4">
                            Última atualização: {new Date().toLocaleDateString('pt-BR')}
                        </p>
                    </div>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Aceitação dos Termos</h2>
                        <p className="mb-3">
                            Ao acessar e usar o NutriHealth Gen, você concorda em cumprir e estar vinculado aos seguintes termos e condições de uso. Se você não concorda com alguma parte destes termos, não deve usar nosso serviço.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Descrição do Serviço</h2>
                        <p className="mb-3">
                            O NutriHealth Gen é uma plataforma de nutrição inteligente que oferece:
                        </p>
                        <ul className="list-disc list-inside space-y-2 ml-4 mb-3">
                            <li>Análise nutricional de alimentos através de imagens (NutriScan)</li>
                            <li>Assistente de nutrição baseado em inteligência artificial</li>
                            <li>Planos alimentares personalizados</li>
                            <li>Acompanhamento de calorias, macros e micronutrientes</li>
                            <li>Listas de compras automáticas</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Uso do Serviço</h2>
                        <p className="mb-3">
                            Você concorda em usar o NutriHealth Gen apenas para fins legais e de acordo com estes Termos. Você se compromete a:
                        </p>
                        <ul className="list-disc list-inside space-y-2 ml-4 mb-3">
                            <li>Fornecer informações precisas e atualizadas ao criar sua conta</li>
                            <li>Manter a segurança de sua conta e senha</li>
                            <li>Não usar o serviço para qualquer propósito ilegal ou não autorizado</li>
                            <li>Não tentar acessar áreas restritas do serviço sem autorização</li>
                            <li>Não interferir ou interromper o funcionamento do serviço</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Conta do Usuário</h2>
                        <p className="mb-3">
                            Para usar certos recursos do NutriHealth Gen, você precisará criar uma conta. Você é responsável por:
                        </p>
                        <ul className="list-disc list-inside space-y-2 ml-4 mb-3">
                            <li>Manter a confidencialidade de suas credenciais de acesso</li>
                            <li>Todas as atividades que ocorrem sob sua conta</li>
                            <li>Notificar-nos imediatamente sobre qualquer uso não autorizado</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Propriedade Intelectual</h2>
                        <p className="mb-3">
                            Todo o conteúdo do NutriHealth Gen, incluindo mas não limitado a textos, gráficos, logos, ícones, imagens, clipes de áudio, downloads digitais e compilações de dados, é propriedade do NutriHealth Gen ou de seus fornecedores de conteúdo e está protegido por leis de direitos autorais.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Limitação de Responsabilidade</h2>
                        <p className="mb-3">
                            O NutriHealth Gen fornece informações nutricionais com base em inteligência artificial e bancos de dados nutricionais. No entanto:
                        </p>
                        <ul className="list-disc list-inside space-y-2 ml-4 mb-3">
                            <li>As informações fornecidas são apenas para fins informativos e educacionais</li>
                            <li>Não substituem o aconselhamento médico, diagnóstico ou tratamento profissional</li>
                            <li>Você deve consultar um profissional de saúde qualificado antes de fazer mudanças significativas em sua dieta</li>
                            <li>Não nos responsabilizamos por decisões tomadas com base nas informações fornecidas pelo serviço</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Modificações do Serviço</h2>
                        <p className="mb-3">
                            Reservamo-nos o direito de modificar, suspender ou descontinuar qualquer aspecto do serviço a qualquer momento, com ou sem aviso prévio. Não seremos responsáveis por você ou por terceiros por qualquer modificação, suspensão ou descontinuação do serviço.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Rescisão</h2>
                        <p className="mb-3">
                            Podemos encerrar ou suspender sua conta e acesso ao serviço imediatamente, sem aviso prévio, por qualquer motivo, incluindo se você violar estes Termos de Uso.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Lei Aplicável</h2>
                        <p className="mb-3">
                            Estes Termos serão regidos e interpretados de acordo com as leis do Brasil, sem dar efeito a qualquer princípio de conflitos de leis.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">10. Alterações nos Termos</h2>
                        <p className="mb-3">
                            Reservamo-nos o direito de modificar estes Termos a qualquer momento. Alterações significativas serão comunicadas através do serviço ou por e-mail. O uso continuado do serviço após tais modificações constitui sua aceitação dos novos Termos.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">11. Contato</h2>
                        <p className="mb-3">
                            Se você tiver dúvidas sobre estes Termos de Uso, entre em contato conosco através da página de contato ou pelo e-mail: contato@nutrihealthgen.com
                        </p>
                    </section>

                    <div className="border-t border-gray-200 pt-4 mt-6">
                        <p className="text-sm text-gray-500 text-center">
                            © {new Date().getFullYear()} NutriHealth Gen. Todos os direitos reservados.
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default Terms;

