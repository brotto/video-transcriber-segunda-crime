import React from 'react';
import { Logo } from '../components/Logo';
import { Button } from '../components/Button';
import { ArrowLeft } from 'lucide-react';

interface PrivacyPolicyProps {
  onBack: () => void;
}

export const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-slate-950">
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Logo size="sm" />
          <Button
            variant="ghost"
            onClick={onBack}
            icon={<ArrowLeft size={18} />}
            className="text-slate-400 hover:text-white"
          >
            Voltar
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="glass-panel rounded-2xl p-8 sm:p-12">
          <h1 className="text-3xl font-bold text-white mb-8">Política de Privacidade</h1>

          <div className="space-y-6 text-slate-300 leading-relaxed">
            <p className="text-sm text-slate-500">
              <strong>Última atualização:</strong> {new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
            </p>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">1. Introdução</h2>
              <p>
                Esta Política de Privacidade descreve como o <strong>Video Transcriber - Segunda Crime de Foz</strong> ("nós", "nosso" ou "Aplicativo")
                coleta, usa, armazena e protege suas informações pessoais quando você utiliza nossos serviços.
              </p>
              <p className="mt-2">
                Ao utilizar nosso Aplicativo, você concorda com a coleta e uso de informações de acordo com esta política.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">2. Informações que Coletamos</h2>

              <h3 className="text-lg font-medium text-justice-300 mb-2">2.1 Informações de Cadastro</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Nome completo</li>
                <li>Endereço de e-mail</li>
                <li>Senha criptografada (quando você cria uma conta com e-mail)</li>
                <li>Foto de perfil (quando você faz login com Google)</li>
              </ul>

              <h3 className="text-lg font-medium text-justice-300 mb-2 mt-4">2.2 Informações de Uso</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Vídeos enviados para transcrição</li>
                <li>Metadados dos processos (nome da parte/testemunha e número do processo)</li>
                <li>Registros de acesso e uso do sistema</li>
                <li>Endereço IP e informações do navegador</li>
              </ul>

              <h3 className="text-lg font-medium text-justice-300 mb-2 mt-4">2.3 Informações do Google OAuth</h3>
              <p>
                Quando você faz login com sua conta Google, coletamos:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Nome e e-mail da sua conta Google</li>
                <li>Foto de perfil pública da sua conta Google</li>
                <li>ID único da sua conta Google</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">3. Como Usamos Suas Informações</h2>
              <p>Utilizamos as informações coletadas para:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Fornecer, operar e manter nossos serviços</li>
                <li>Processar e transcrever vídeos enviados</li>
                <li>Autenticar e gerenciar sua conta</li>
                <li>Melhorar, personalizar e expandir nossos serviços</li>
                <li>Comunicar-nos com você sobre atualizações e suporte</li>
                <li>Garantir a segurança e prevenir fraudes</li>
                <li>Cumprir obrigações legais e judiciais</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">4. Compartilhamento de Informações</h2>
              <p>Não vendemos, alugamos ou compartilhamos suas informações pessoais com terceiros, exceto:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Prestadores de Serviço:</strong> Supabase (autenticação e banco de dados) e serviços de processamento de vídeo</li>
                <li><strong>Requisitos Legais:</strong> Quando exigido por lei ou para proteger nossos direitos</li>
                <li><strong>Consentimento:</strong> Quando você autorizar explicitamente</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">5. Armazenamento e Segurança</h2>
              <p>
                Implementamos medidas de segurança técnicas e organizacionais para proteger suas informações contra acesso não autorizado,
                alteração, divulgação ou destruição:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Criptografia SSL/TLS para transmissão de dados</li>
                <li>Senhas criptografadas com bcrypt</li>
                <li>Autenticação segura via Supabase</li>
                <li>Controle de acesso baseado em funções (RLS - Row Level Security)</li>
                <li>Backup regular de dados</li>
              </ul>
              <p className="mt-2">
                Os dados são armazenados em servidores seguros fornecidos pela Supabase e mantidos de acordo com
                as melhores práticas de segurança da indústria.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">6. Retenção de Dados</h2>
              <p>
                Mantemos suas informações pessoais apenas pelo tempo necessário para cumprir as finalidades descritas nesta política,
                a menos que um período de retenção mais longo seja exigido ou permitido por lei.
              </p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li><strong>Dados de conta:</strong> Mantidos enquanto sua conta estiver ativa</li>
                <li><strong>Vídeos e transcrições:</strong> Conforme necessidade do processo judicial</li>
                <li><strong>Logs de acesso:</strong> 90 dias</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">7. Seus Direitos (LGPD)</h2>
              <p>De acordo com a Lei Geral de Proteção de Dados (LGPD), você tem direito a:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Confirmar a existência de tratamento de seus dados</li>
                <li>Acessar seus dados pessoais</li>
                <li>Corrigir dados incompletos, inexatos ou desatualizados</li>
                <li>Solicitar a anonimização, bloqueio ou eliminação de dados desnecessários</li>
                <li>Solicitar a portabilidade de seus dados</li>
                <li>Revogar o consentimento a qualquer momento</li>
                <li>Solicitar a exclusão de sua conta</li>
              </ul>
              <p className="mt-2">
                Para exercer seus direitos, entre em contato através do e-mail disponibilizado na seção de contato.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">8. Cookies e Tecnologias Semelhantes</h2>
              <p>
                Utilizamos cookies e tecnologias semelhantes para melhorar sua experiência, incluindo:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Cookies Essenciais:</strong> Necessários para autenticação e funcionamento do sistema</li>
                <li><strong>Cookies de Preferência:</strong> Armazenam suas configurações e preferências</li>
                <li><strong>Local Storage:</strong> Para armazenar tokens de autenticação</li>
              </ul>
              <p className="mt-2">
                Você pode configurar seu navegador para recusar cookies, mas isso pode afetar a funcionalidade do Aplicativo.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">9. Uso por Menores de Idade</h2>
              <p>
                Nosso serviço destina-se a profissionais da área jurídica e não é direcionado a menores de 18 anos.
                Não coletamos intencionalmente informações de menores de idade. Se você acredita que coletamos
                informações de um menor, entre em contato conosco imediatamente.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">10. Alterações nesta Política</h2>
              <p>
                Podemos atualizar nossa Política de Privacidade periodicamente. Notificaremos você sobre quaisquer
                alterações publicando a nova política nesta página e atualizando a data de "Última atualização".
              </p>
              <p className="mt-2">
                Recomendamos que você revise esta política periodicamente para quaisquer alterações.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">11. Contato</h2>
              <p>
                Se você tiver dúvidas sobre esta Política de Privacidade ou sobre o tratamento de seus dados pessoais,
                entre em contato conosco:
              </p>
              <div className="mt-4 p-4 bg-slate-900/50 rounded-lg border border-slate-800">
                <p><strong>Video Transcriber - Segunda Crime de Foz</strong></p>
                <p className="mt-2">E-mail: privacidade@segundacrime.foz.br</p>
                <p>Encarregado de Dados (DPO): A definir</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">12. Legislação Aplicável</h2>
              <p>
                Esta Política de Privacidade é regida pelas leis brasileiras, incluindo a Lei Geral de Proteção
                de Dados (LGPD - Lei nº 13.709/2018) e o Marco Civil da Internet (Lei nº 12.965/2014).
              </p>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-700">
            <Button
              onClick={onBack}
              icon={<ArrowLeft size={18} />}
              className="w-full sm:w-auto"
            >
              Voltar ao App
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};
