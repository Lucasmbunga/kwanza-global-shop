import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface ChatMessage {
  id: string;
  conversation_id: string;
  sender_type: 'customer' | 'operator' | 'system';
  sender_id: string | null;
  content: string;
  read_at: string | null;
  created_at: string;
}

interface ChatConversation {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  status: 'open' | 'assigned' | 'resolved' | 'closed';
  assigned_operator_id: string | null;
  created_at: string;
  updated_at: string;
}

export function useChat(conversationId?: string) {
  const { user, isStaff } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [conversation, setConversation] = useState<ChatConversation | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch messages for a conversation
  const fetchMessages = useCallback(async () => {
    if (!conversationId) return;
    
    setIsLoading(true);
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });
    
    if (!error && data) {
      setMessages(data as ChatMessage[]);
    }
    setIsLoading(false);
  }, [conversationId]);

  // Fetch conversation details
  const fetchConversation = useCallback(async () => {
    if (!conversationId) return;
    
    const { data, error } = await supabase
      .from('chat_conversations')
      .select('*')
      .eq('id', conversationId)
      .maybeSingle();
    
    if (!error && data) {
      setConversation(data as ChatConversation);
    }
  }, [conversationId]);

  // Send a message
  const sendMessage = async (content: string, senderType: 'customer' | 'operator' = 'customer') => {
    if (!conversationId || !content.trim()) return;

    const { error } = await supabase
      .from('chat_messages')
      .insert({
        conversation_id: conversationId,
        sender_type: senderType,
        sender_id: user?.id || null,
        content: content.trim()
      });

    if (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  };

  // Start a new conversation
  const startConversation = async (customerName: string, customerEmail: string, customerPhone?: string, initialMessage?: string) => {
    const { data: convData, error: convError } = await supabase
      .from('chat_conversations')
      .insert({
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone || null,
        status: 'open'
      })
      .select()
      .single();

    if (convError) {
      console.error('Error starting conversation:', convError);
      throw convError;
    }

    // Send initial message if provided
    if (initialMessage && convData) {
      await supabase
        .from('chat_messages')
        .insert({
          conversation_id: convData.id,
          sender_type: 'customer',
          content: initialMessage
        });
    }

    return convData as ChatConversation;
  };

  // Update conversation status
  const updateConversationStatus = async (status: 'open' | 'assigned' | 'resolved' | 'closed') => {
    if (!conversationId) return;

    const { error } = await supabase
      .from('chat_conversations')
      .update({ status, assigned_operator_id: user?.id })
      .eq('id', conversationId);

    if (error) {
      console.error('Error updating conversation:', error);
      throw error;
    }
  };

  // Subscribe to realtime messages
  useEffect(() => {
    if (!conversationId) return;

    fetchMessages();
    fetchConversation();

    const channel = supabase
      .channel(`chat-${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        (payload) => {
          setMessages(prev => [...prev, payload.new as ChatMessage]);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'chat_conversations',
          filter: `id=eq.${conversationId}`
        },
        (payload) => {
          setConversation(payload.new as ChatConversation);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, fetchMessages, fetchConversation]);

  return {
    messages,
    conversation,
    isLoading,
    sendMessage,
    startConversation,
    updateConversationStatus,
    refetch: fetchMessages
  };
}

export function useChatConversations() {
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchConversations = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('chat_conversations')
      .select('*')
      .order('updated_at', { ascending: false });
    
    if (!error && data) {
      setConversations(data as ChatConversation[]);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchConversations();

    const channel = supabase
      .channel('chat-conversations')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chat_conversations'
        },
        () => {
          fetchConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchConversations]);

  return {
    conversations,
    isLoading,
    refetch: fetchConversations
  };
}
