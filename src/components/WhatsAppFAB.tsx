import { MessageCircle } from 'lucide-react'

const WHATSAPP_NUMBER = '22300000000'

export default function WhatsAppFAB() {
  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Bonjour, je souhaite des informations sur vos produits.')}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 active:scale-95"
      aria-label="Contacter sur WhatsApp"
    >
      <MessageCircle size={26} fill="white" />
    </a>
  )
}
