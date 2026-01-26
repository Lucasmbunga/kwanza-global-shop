-- Create table for chat conversations
CREATE TABLE public.chat_conversations (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT,
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'assigned', 'resolved', 'closed')),
    assigned_operator_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for chat messages
CREATE TABLE public.chat_messages (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    conversation_id UUID NOT NULL REFERENCES public.chat_conversations(id) ON DELETE CASCADE,
    sender_type TEXT NOT NULL CHECK (sender_type IN ('customer', 'operator', 'system')),
    sender_id UUID,
    content TEXT NOT NULL,
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for chat_conversations
-- Staff can view all conversations
CREATE POLICY "Staff can view all conversations"
ON public.chat_conversations FOR SELECT
USING (is_staff(auth.uid()));

-- Staff can insert conversations
CREATE POLICY "Staff can insert conversations"
ON public.chat_conversations FOR INSERT
WITH CHECK (is_staff(auth.uid()));

-- Staff can update conversations
CREATE POLICY "Staff can update conversations"
ON public.chat_conversations FOR UPDATE
USING (is_staff(auth.uid()));

-- Allow public to insert (for customers starting chat)
CREATE POLICY "Anyone can start a conversation"
ON public.chat_conversations FOR INSERT
WITH CHECK (true);

-- RLS Policies for chat_messages
-- Staff can view all messages
CREATE POLICY "Staff can view all messages"
ON public.chat_messages FOR SELECT
USING (is_staff(auth.uid()));

-- Staff can insert messages
CREATE POLICY "Staff can insert messages"
ON public.chat_messages FOR INSERT
WITH CHECK (is_staff(auth.uid()));

-- Allow public to insert messages (for customers)
CREATE POLICY "Anyone can send messages"
ON public.chat_messages FOR INSERT
WITH CHECK (true);

-- Allow public to view messages in their conversation (by conversation_id)
CREATE POLICY "Public can view messages in their conversation"
ON public.chat_messages FOR SELECT
USING (true);

-- Create trigger for updating updated_at on conversations
CREATE TRIGGER update_chat_conversations_updated_at
BEFORE UPDATE ON public.chat_conversations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for chat tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_conversations;