import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useChat } from '@/hooks/useChat';
import { z } from 'zod';

const customerSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').max(100),
  email: z.string().email('Email inválido').max(255),
  phone: z.string().max(20).optional(),
  message: z.string().min(1, 'Mensagem não pode estar vazia').max(1000)
});

interface ChatWidgetProps {
  position?: 'bottom-right' | 'bottom-left';
}

const ChatWidget = ({ position = 'bottom-right' }: ChatWidgetProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [newMessage, setNewMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, startConversation, isLoading } = useChat(conversationId || undefined);

  // Load conversation from localStorage
  useEffect(() => {
    const savedConversationId = localStorage.getItem('chat_conversation_id');
    if (savedConversationId) {
      setConversationId(savedConversationId);
      setShowForm(false);
    }
  }, []);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleStartChat = async () => {
    const result = customerSchema.safeParse(formData);
    
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.errors.forEach(err => {
        if (err.path[0]) {
          errors[err.path[0] as string] = err.message;
        }
      });
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setIsSubmitting(true);

    try {
      const conversation = await startConversation(
        formData.name,
        formData.email,
        formData.phone,
        formData.message
      );
      setConversationId(conversation.id);
      localStorage.setItem('chat_conversation_id', conversation.id);
      setShowForm(false);
    } catch (error) {
      console.error('Error starting chat:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await sendMessage(newMessage, 'customer');
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const positionClasses = position === 'bottom-right' 
    ? 'right-4 md:right-6' 
    : 'left-4 md:left-6';

  return (
    <>
      {/* Chat Toggle Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={() => setIsOpen(true)}
            className={`fixed bottom-4 md:bottom-6 ${positionClasses} z-50 w-14 h-14 rounded-full bg-gradient-gold text-navy-dark shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center`}
          >
            <MessageCircle className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={`fixed bottom-4 md:bottom-6 ${positionClasses} z-50 w-[calc(100vw-2rem)] md:w-96 h-[500px] bg-navy-dark border border-gold/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden`}
          >
            {/* Header */}
            <div className="bg-gradient-gold p-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-navy-dark">Suporte KwanzaBuy</h3>
                <p className="text-sm text-navy-dark/70">Estamos aqui para ajudar!</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-navy-dark/10 hover:bg-navy-dark/20 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-navy-dark" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {showForm ? (
                <div className="space-y-4">
                  <p className="text-muted-foreground text-sm">
                    Preencha seus dados para iniciar a conversa:
                  </p>
                  
                  <div className="space-y-3">
                    <div>
                      <Input
                        placeholder="Seu nome *"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="bg-muted/50 border-gold/30"
                      />
                      {formErrors.name && (
                        <p className="text-xs text-destructive mt-1">{formErrors.name}</p>
                      )}
                    </div>
                    
                    <div>
                      <Input
                        type="email"
                        placeholder="Seu email *"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        className="bg-muted/50 border-gold/30"
                      />
                      {formErrors.email && (
                        <p className="text-xs text-destructive mt-1">{formErrors.email}</p>
                      )}
                    </div>
                    
                    <Input
                      placeholder="Telefone (opcional)"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      className="bg-muted/50 border-gold/30"
                    />
                    
                    <div>
                      <Textarea
                        placeholder="Como podemos ajudar? *"
                        value={formData.message}
                        onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                        className="bg-muted/50 border-gold/30 min-h-[80px]"
                      />
                      {formErrors.message && (
                        <p className="text-xs text-destructive mt-1">{formErrors.message}</p>
                      )}
                    </div>
                  </div>

                  <Button
                    onClick={handleStartChat}
                    disabled={isSubmitting}
                    className="w-full bg-gradient-gold text-navy-dark hover:opacity-90"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      'Iniciar Conversa'
                    )}
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {isLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin text-gold" />
                    </div>
                  ) : messages.length === 0 ? (
                    <p className="text-center text-muted-foreground text-sm py-8">
                      Aguardando resposta do suporte...
                    </p>
                  ) : (
                    messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.sender_type === 'customer' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                            msg.sender_type === 'customer'
                              ? 'bg-gradient-gold text-navy-dark'
                              : msg.sender_type === 'system'
                              ? 'bg-muted/30 text-muted-foreground italic'
                              : 'bg-muted/50 text-foreground'
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                          <p className={`text-xs mt-1 ${
                            msg.sender_type === 'customer' ? 'text-navy-dark/60' : 'text-muted-foreground'
                          }`}>
                            {new Date(msg.created_at).toLocaleTimeString('pt-AO', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Message Input */}
            {!showForm && (
              <div className="p-4 border-t border-gold/20">
                <div className="flex gap-2">
                  <Input
                    placeholder="Digite sua mensagem..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={isSubmitting}
                    className="flex-1 bg-muted/50 border-gold/30"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() || isSubmitting}
                    size="icon"
                    className="bg-gradient-gold text-navy-dark hover:opacity-90"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatWidget;
