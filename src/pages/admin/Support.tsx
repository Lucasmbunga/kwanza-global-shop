import { useState } from 'react';
import { useChatConversations, useChat } from '@/hooks/useChat';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  MessageCircle, 
  Send, 
  Loader2, 
  User, 
  Mail, 
  Phone,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const statusConfig = {
  open: { label: 'Aberto', variant: 'default' as const, icon: Clock },
  assigned: { label: 'Em Atendimento', variant: 'secondary' as const, icon: MessageCircle },
  resolved: { label: 'Resolvido', variant: 'outline' as const, icon: CheckCircle },
  closed: { label: 'Fechado', variant: 'destructive' as const, icon: XCircle }
};

const Support = () => {
  const { user } = useAuth();
  const { conversations, isLoading: loadingConversations } = useChatConversations();
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const { 
    messages, 
    conversation, 
    isLoading: loadingMessages, 
    sendMessage,
    updateConversationStatus 
  } = useChat(selectedConversationId || undefined);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || isSending) return;

    setIsSending(true);
    try {
      await sendMessage(newMessage, 'operator');
      setNewMessage('');
      
      // Auto-assign conversation if not already assigned
      if (conversation?.status === 'open') {
        await updateConversationStatus('assigned');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleStatusChange = async (status: 'resolved' | 'closed') => {
    try {
      await updateConversationStatus(status);
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const openConversations = conversations.filter(c => c.status === 'open' || c.status === 'assigned');
  const closedConversations = conversations.filter(c => c.status === 'resolved' || c.status === 'closed');

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Chat de Suporte</h1>
        <p className="text-muted-foreground">Gerencie conversas com clientes em tempo real</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
        {/* Conversations List */}
        <Card className="lg:col-span-1 flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Conversas
              {openConversations.length > 0 && (
                <Badge variant="secondary" className="ml-auto">
                  {openConversations.length} ativas
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden p-0">
            <ScrollArea className="h-full">
              {loadingConversations ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
              ) : conversations.length === 0 ? (
                <p className="text-center text-muted-foreground py-8 px-4">
                  Nenhuma conversa ainda
                </p>
              ) : (
                <div className="space-y-1 p-2">
                  {openConversations.length > 0 && (
                    <>
                      <p className="text-xs font-medium text-muted-foreground px-2 py-1">ATIVAS</p>
                      {openConversations.map((conv) => {
                        const StatusIcon = statusConfig[conv.status].icon;
                        return (
                          <button
                            key={conv.id}
                            onClick={() => setSelectedConversationId(conv.id)}
                            className={`w-full p-3 rounded-lg text-left transition-colors ${
                              selectedConversationId === conv.id
                                ? 'bg-primary/10 border border-primary/30'
                                : 'hover:bg-muted/50'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <p className="font-medium truncate">{conv.customer_name}</p>
                                <p className="text-xs text-muted-foreground truncate">{conv.customer_email}</p>
                              </div>
                              <Badge variant={statusConfig[conv.status].variant} className="text-xs shrink-0">
                                <StatusIcon className="w-3 h-3 mr-1" />
                                {statusConfig[conv.status].label}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              {format(new Date(conv.created_at), "dd MMM, HH:mm", { locale: ptBR })}
                            </p>
                          </button>
                        );
                      })}
                    </>
                  )}
                  
                  {closedConversations.length > 0 && (
                    <>
                      <p className="text-xs font-medium text-muted-foreground px-2 py-1 mt-4">FECHADAS</p>
                      {closedConversations.slice(0, 10).map((conv) => {
                        const StatusIcon = statusConfig[conv.status].icon;
                        return (
                          <button
                            key={conv.id}
                            onClick={() => setSelectedConversationId(conv.id)}
                            className={`w-full p-3 rounded-lg text-left transition-colors opacity-70 ${
                              selectedConversationId === conv.id
                                ? 'bg-primary/10 border border-primary/30'
                                : 'hover:bg-muted/50'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <p className="font-medium truncate">{conv.customer_name}</p>
                              </div>
                              <Badge variant={statusConfig[conv.status].variant} className="text-xs shrink-0">
                                <StatusIcon className="w-3 h-3 mr-1" />
                                {statusConfig[conv.status].label}
                              </Badge>
                            </div>
                          </button>
                        );
                      })}
                    </>
                  )}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="lg:col-span-2 flex flex-col">
          {selectedConversationId && conversation ? (
            <>
              {/* Chat Header */}
              <CardHeader className="pb-3 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{conversation.customer_name}</CardTitle>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {conversation.customer_email}
                        </span>
                        {conversation.customer_phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {conversation.customer_phone}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {(conversation.status === 'open' || conversation.status === 'assigned') && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStatusChange('resolved')}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Resolver
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleStatusChange('closed')}
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Fechar
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardHeader>

              {/* Messages */}
              <CardContent className="flex-1 overflow-hidden p-0">
                <ScrollArea className="h-full p-4">
                  {loadingMessages ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin" />
                    </div>
                  ) : messages.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      Nenhuma mensagem ainda
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.sender_type === 'operator' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                              msg.sender_type === 'operator'
                                ? 'bg-primary text-primary-foreground'
                                : msg.sender_type === 'system'
                                ? 'bg-muted/30 text-muted-foreground italic'
                                : 'bg-muted'
                            }`}
                          >
                            <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                            <p className={`text-xs mt-1 ${
                              msg.sender_type === 'operator' ? 'text-primary-foreground/60' : 'text-muted-foreground'
                            }`}>
                              {format(new Date(msg.created_at), "HH:mm")}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>

              {/* Message Input */}
              {(conversation.status === 'open' || conversation.status === 'assigned') && (
                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Digite sua resposta..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      disabled={isSending}
                      className="flex-1"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim() || isSending}
                    >
                      {isSending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Selecione uma conversa para começar</p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Support;
