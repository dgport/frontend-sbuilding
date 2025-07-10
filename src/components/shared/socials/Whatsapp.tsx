'use client';

import { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

interface WhatsAppChatProps {
  phoneNumber: string;
  defaultMessage?: string;
}

const WhatsAppChat: React.FC<WhatsAppChatProps> = ({ 
  phoneNumber, 
  defaultMessage = "Hello from aisi group website" 
}) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleWhatsAppClick = () => {
    const encodedMessage = encodeURIComponent(defaultMessage);
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^\d]/g, '')}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 md:bottom-6 md:right-6">
      <div className="relative">
 
        <button
          onClick={() => setIsVisible(false)}
          className="absolute -top-2 -right-2 bg-gray-500 hover:bg-gray-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs transition-colors duration-200 z-10"
          aria-label="Close WhatsApp chat"
        >
          <X size={12} />
        </button>
        
 
        <button
          onClick={handleWhatsAppClick}
          className="bg-green-500 hover:bg-green-600 text-white rounded-full p-3 md:p-4 shadow-lg transition-all duration-300 hover:scale-110 flex items-center justify-center group"
          aria-label="Chat on WhatsApp"
        >
          <MessageCircle size={20} className="md:w-6 md:h-6" />
     
          <div className="absolute right-full mr-3 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
            Chat on WhatsApp
          </div>
        </button>
      </div>
    </div>
  );
};

export default WhatsAppChat;