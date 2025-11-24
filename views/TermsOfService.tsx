import React from 'react';
import { Logo } from '../components/Logo';
import { Button } from '../components/Button';
import { ArrowLeft } from 'lucide-react';

interface TermsOfServiceProps {
  onBack: () => void;
}

export const TermsOfService: React.FC<TermsOfServiceProps> = ({ onBack }) => {
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
          <h1 className="text-3xl font-bold text-white mb-8">Termos de Serviço</h1>

          <div className="space-y-6 text-slate-300 leading-relaxed">
            <p className="text-sm text-slate-500">
              <strong>Última atualização:</strong> {new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
            </p>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">1. Aceitação dos Termos</h2>
              <p>
                Ao acessar e usar o <strong>Video Transcriber - Segunda Crime de Foz</strong> ("Aplicativo", "Serviço", "nós" ou "nosso"),
                você concorda em cumprir e estar vinculado a estes Termos de Serviço ("Termos").
              </p>
              <p className="mt-2">
                Se você não concordar com qualquer parte destes Termos, não poderá acessar ou usar o Serviço.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">2. Descrição do Serviço</h2>
              <p>
                O Video Transcriber é uma plataforma web desenvolvida para profissionais da área jurídica que oferece:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Upload e armazenamento temporário de vídeos judiciais</li>
                <li>Processamento e transcrição automatizada de vídeos</li>
                <li>Organização de transcrições por processo e envolvidos</li>
                <li>Ferramentas de gestão de evidências audiovisuais</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">3. Elegibilidade</h2>
              <p>
                Para usar este Serviço, você deve:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Ter pelo menos 18 anos de idade</li>
                <li>Ser profissional da área jurídica ou ter autorização institucional</li>
                <li>Possuir capacidade legal para celebrar contratos vinculativos</li>
                <li>Não estar impedido de usar o Serviço sob qualquer lei aplicável</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">4. Registro e Conta</h2>

              <h3 className="text-lg font-medium text-justice-300 mb-2">4.1 Criação de Conta</h3>
              <p>
                Para acessar o Serviço, você deve criar uma conta fornecendo informações precisas e completas.
                Você pode se registrar usando:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>E-mail e senha</li>
                <li>Conta Google (OAuth)</li>
              </ul>

              <h3 className="text-lg font-medium text-justice-300 mb-2 mt-4">4.2 Segurança da Conta</h3>
              <p>Você é responsável por:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Manter a confidencialidade de suas credenciais de acesso</li>
                <li>Todas as atividades que ocorrem sob sua conta</li>
                <li>Notificar-nos imediatamente sobre qualquer uso não autorizado</li>
              </ul>

              <h3 className="text-lg font-medium text-justice-300 mb-2 mt-4">4.3 Suspensão e Encerramento</h3>
              <p>
                Reservamo-nos o direito de suspender ou encerrar sua conta se você violar estes Termos ou
                usar o Serviço de maneira inadequada.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">5. Uso Aceitável</h2>

              <h3 className="text-lg font-medium text-justice-300 mb-2">5.1 Você Concorda em:</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Usar o Serviço apenas para fins legítimos e legais</li>
                <li>Enviar apenas vídeos relacionados a processos judiciais autorizados</li>
                <li>Respeitar os direitos de privacidade de terceiros</li>
                <li>Cumprir todas as leis e regulamentos aplicáveis</li>
                <li>Não compartilhar suas credenciais com terceiros</li>
              </ul>

              <h3 className="text-lg font-medium text-justice-300 mb-2 mt-4">5.2 Você Concorda em NÃO:</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Usar o Serviço para qualquer propósito ilegal ou não autorizado</li>
                <li>Fazer upload de conteúdo ofensivo, difamatório ou inapropriado</li>
                <li>Tentar hackear, descompilar ou fazer engenharia reversa do Serviço</li>
                <li>Distribuir vírus, malware ou qualquer código malicioso</li>
                <li>Coletar dados de outros usuários sem consentimento</li>
                <li>Fazer uso comercial não autorizado do Serviço</li>
                <li>Sobrecarregar ou interferir com a infraestrutura do Serviço</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">6. Conteúdo do Usuário</h2>

              <h3 className="text-lg font-medium text-justice-300 mb-2">6.1 Propriedade</h3>
              <p>
                Você mantém todos os direitos sobre o conteúdo (vídeos, áudio, metadados) que enviar ao Serviço.
                Ao fazer upload, você nos concede uma licença limitada, não exclusiva e revogável para processar,
                armazenar e transcrever esse conteúdo apenas para fornecer o Serviço.
              </p>

              <h3 className="text-lg font-medium text-justice-300 mb-2 mt-4">6.2 Responsabilidade</h3>
              <p>Você é exclusivamente responsável por:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Todo conteúdo que enviar ao Serviço</li>
                <li>Obter autorizações necessárias para upload de vídeos</li>
                <li>Garantir que o conteúdo não viola direitos de terceiros</li>
                <li>A precisão das informações do processo associadas</li>
              </ul>

              <h3 className="text-lg font-medium text-justice-300 mb-2 mt-4">6.3 Remoção de Conteúdo</h3>
              <p>
                Reservamo-nos o direito de remover qualquer conteúdo que viole estes Termos ou que seja
                considerado inadequado, sem aviso prévio.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">7. Propriedade Intelectual</h2>
              <p>
                O Serviço e todo seu conteúdo, recursos e funcionalidades (incluindo, mas não se limitando a,
                design, código-fonte, textos, gráficos e logos) são de propriedade exclusiva da Segunda Crime de Foz
                e estão protegidos por leis de direitos autorais e propriedade intelectual.
              </p>
              <p className="mt-2">
                Você não pode copiar, modificar, distribuir, vender ou alugar qualquer parte do Serviço sem
                autorização prévia por escrito.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">8. Privacidade e Proteção de Dados</h2>
              <p>
                O uso de suas informações pessoais é regido pela nossa{' '}
                <span className="text-justice-400 hover:text-justice-300 cursor-pointer">Política de Privacidade</span>.
                Ao usar o Serviço, você consente com a coleta e uso de suas informações conforme descrito na Política.
              </p>
              <p className="mt-2">
                Implementamos medidas de segurança apropriadas para proteger seus dados de acordo com a LGPD
                (Lei Geral de Proteção de Dados - Lei nº 13.709/2018).
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">9. Confidencialidade</h2>
              <p>
                Reconhecemos a natureza sensível dos vídeos e informações judiciais. Comprometemo-nos a:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Manter a confidencialidade de todos os dados processados</li>
                <li>Implementar medidas de segurança adequadas</li>
                <li>Não divulgar informações a terceiros não autorizados</li>
                <li>Cumprir com o sigilo profissional aplicável</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">10. Disponibilidade do Serviço</h2>
              <p>
                Esforçamo-nos para manter o Serviço disponível 24/7, mas não garantimos que ele estará sempre
                acessível, ininterrupto ou livre de erros. Reservamo-nos o direito de:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Realizar manutenções programadas</li>
                <li>Suspender temporariamente o acesso para correções</li>
                <li>Modificar ou descontinuar recursos do Serviço</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">11. Isenção de Garantias</h2>
              <p>
                O SERVIÇO É FORNECIDO "NO ESTADO EM QUE SE ENCONTRA" E "CONFORME DISPONÍVEL", SEM GARANTIAS DE
                QUALQUER TIPO, EXPRESSAS OU IMPLÍCITAS, INCLUINDO, MAS NÃO SE LIMITANDO A:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Garantias de comercialização</li>
                <li>Adequação a uma finalidade específica</li>
                <li>Não violação de direitos</li>
                <li>Precisão das transcrições geradas</li>
                <li>Disponibilidade contínua do Serviço</li>
              </ul>
              <p className="mt-2">
                Você reconhece que as transcrições automáticas podem conter erros e devem ser revisadas antes
                de uso oficial.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">12. Limitação de Responsabilidade</h2>
              <p>
                NA MÁXIMA EXTENSÃO PERMITIDA PELA LEI, NÃO SEREMOS RESPONSÁVEIS POR QUAISQUER DANOS INDIRETOS,
                INCIDENTAIS, ESPECIAIS, CONSEQUENCIAIS OU PUNITIVOS, INCLUINDO, MAS NÃO SE LIMITANDO A:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Perda de dados ou conteúdo</li>
                <li>Perda de lucros ou receita</li>
                <li>Interrupção de negócios</li>
                <li>Erros nas transcrições</li>
                <li>Uso não autorizado de sua conta</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">13. Indenização</h2>
              <p>
                Você concorda em indenizar, defender e isentar a Segunda Crime de Foz, seus diretores,
                funcionários e agentes de e contra todas as reivindicações, danos, obrigações, perdas,
                responsabilidades, custos ou dívidas, e despesas (incluindo honorários advocatícios)
                decorrentes de:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Seu uso do Serviço</li>
                <li>Violação destes Termos</li>
                <li>Violação de direitos de terceiros</li>
                <li>Conteúdo que você enviar ao Serviço</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">14. Modificações dos Termos</h2>
              <p>
                Reservamo-nos o direito de modificar estes Termos a qualquer momento. Notificaremos você sobre
                alterações materiais através do e-mail cadastrado ou por meio de aviso no Serviço.
              </p>
              <p className="mt-2">
                O uso continuado do Serviço após as alterações constitui sua aceitação dos novos Termos.
                Se você não concordar com as alterações, deve parar de usar o Serviço.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">15. Rescisão</h2>
              <p>
                Você pode encerrar sua conta a qualquer momento através das configurações do perfil ou
                entrando em contato conosco. Podemos encerrar ou suspender seu acesso imediatamente,
                sem aviso prévio, se você violar estes Termos.
              </p>
              <p className="mt-2">
                Após o encerramento, seus dados serão mantidos conforme necessário para cumprir obrigações
                legais e depois excluídos de acordo com nossa Política de Privacidade.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">16. Lei Aplicável e Jurisdição</h2>
              <p>
                Estes Termos são regidos pelas leis da República Federativa do Brasil. Qualquer disputa
                relacionada a estes Termos será submetida à jurisdição exclusiva dos tribunais da comarca
                de Foz do Iguaçu, Estado do Paraná.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">17. Disposições Gerais</h2>

              <h3 className="text-lg font-medium text-justice-300 mb-2">17.1 Acordo Integral</h3>
              <p>
                Estes Termos, juntamente com a Política de Privacidade, constituem o acordo integral entre
                você e a Segunda Crime de Foz em relação ao uso do Serviço.
              </p>

              <h3 className="text-lg font-medium text-justice-300 mb-2 mt-4">17.2 Divisibilidade</h3>
              <p>
                Se qualquer disposição destes Termos for considerada inválida ou inexequível, as demais
                disposições permanecerão em pleno vigor e efeito.
              </p>

              <h3 className="text-lg font-medium text-justice-300 mb-2 mt-4">17.3 Renúncia</h3>
              <p>
                A falha em exercer qualquer direito ou disposição destes Termos não constituirá uma renúncia
                a tal direito ou disposição.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">18. Contato</h2>
              <p>
                Se você tiver dúvidas sobre estes Termos de Serviço, entre em contato conosco:
              </p>
              <div className="mt-4 p-4 bg-slate-900/50 rounded-lg border border-slate-800">
                <p><strong>Video Transcriber - Segunda Crime de Foz</strong></p>
                <p className="mt-2">E-mail: suporte@segundacrime.foz.br</p>
                <p>E-mail Jurídico: juridico@segundacrime.foz.br</p>
              </div>
            </section>

            <div className="mt-8 p-4 bg-justice-900/20 border border-justice-800/50 rounded-lg">
              <p className="text-sm text-justice-200">
                <strong>Importante:</strong> Ao usar o Video Transcriber, você reconhece que leu, compreendeu
                e concorda em estar vinculado por estes Termos de Serviço.
              </p>
            </div>
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
