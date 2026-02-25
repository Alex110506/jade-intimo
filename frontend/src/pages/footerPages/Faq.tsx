import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const Faq = () => {
  // Starea care ține minte indexul întrebării deschise (null înseamnă că toate sunt închise)
  const [openIndex, setOpenIndex] = useState(null);

  // Funcția care deschide/închide o întrebare
  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Lista de întrebări și răspunsuri
  const faqData = [
    {
      question: "Cum știu ce mărime mi se potrivește?",
      answer: "Recomandăm să consulți Ghidul nostru de Mărimi, disponibil pe pagina fiecărui produs. Acolo vei găsi instrucțiuni exacte despre cum să te măsori corect (bust, sub bust, talie, șolduri) pentru a alege mărimea ideală."
    },
    {
      question: "Pot returna lenjeria intimă dacă am greșit mărimea?",
      answer: "Din motive stricte de igienă, partea inferioară a lenjeriei (chiloți, tanga), body-urile și costumele de baie NU pot fi returnate sau schimbate. Totuși, sutienele, halatele și pijamalele pot fi returnate în termen de 14 zile, cu condiția să aibă etichetele intacte și să nu fi fost purtate sau spălate."
    },
    {
      question: "Cât durează și cât costă livrarea?",
      answer: "Livrarea costă 20 RON și se face prin curier rapid. Timpul estimat de livrare este între 1 și 3 zile lucrătoare de la confirmarea comenzii. Pentru comenzile de peste 300 RON, transportul este gratuit."
    },
    {
      question: "Cum se întrețin corect produsele din materiale fine (dantelă, mătase)?",
      answer: "Pentru a prelungi durata de viață a lenjeriei premium, recomandăm spălarea manuală în apă călduță (maxim 30°C) folosind un detergent pentru rufe delicate. Nu folosi înălbitor, nu usca la mașină și evită stoarcerea puternică. Lasă produsele să se usuce natural, pe o suprafață plană."
    },
    {
      question: "Ce metode de plată acceptați?",
      answer: "Puteți plăti în siguranță online folosind cardul bancar (Visa, Mastercard) sau puteți opta pentru plata ramburs (numerar) direct la curier, în momentul livrării coletului."
    },
    {
      question: "Cum pot anula sau modifica o comandă?",
      answer: "Dacă dorești să modifici sau să anulezi o comandă, te rugăm să ne contactezi cât mai curând la adresa contact@jade-intimo.ro sau la numărul de telefon afișat pe site. Dacă produsele nu au fost deja predate curierului, vom procesa modificarea imediat."
    }
  ];

  return (
    <>
      <Navbar />
      
      <main className="min-h-screen pt-32 pb-16">
        <div className="container-custom max-w-3xl mx-auto px-4">
          
          <div className="text-center mb-16">
            <h1 className="font-heading text-4xl font-bold tracking-wide mb-4">Întrebări Frecvente</h1>
            <p className="text-muted-foreground">
              Găsește rapid răspunsuri la cele mai comune întrebări despre produsele și serviciile Jade Intimo.
            </p>
          </div>

          {/* Containerul pentru lista de FAQ */}
          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <div 
                key={index} 
                className={`border rounded-lg transition-colors duration-200 ${
                  openIndex === index ? 'border-foreground bg-secondary/10' : 'border-border bg-transparent hover:border-foreground/50'
                }`}
              >
                {/* Butonul întrebării */}
                <button
                  className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
                  onClick={() => toggleFaq(index)}
                >
                  <h3 className="font-medium text-foreground pr-4">
                    {faq.question}
                  </h3>
                  <div className="text-muted-foreground shrink-0">
                    {openIndex === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </button>

                {/* Răspunsul (afișat doar dacă openIndex este egal cu indexul curent) */}
                {openIndex === index && (
                  <div className="px-5 pb-5 pt-1 text-muted-foreground leading-relaxed animate-in fade-in slide-in-from-top-2 duration-200">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Secțiune de contact alternativ */}
          <div className="mt-16 text-center bg-secondary/30 p-8 rounded-lg border border-border">
            <h2 className="text-xl font-semibold mb-2">Nu ai găsit răspunsul căutat?</h2>
            <p className="text-muted-foreground mb-6">
              Echipa noastră este aici să te ajute cu orice alte informații.
            </p>
            <Link to={"/asistenta"}
            className="inline-block px-6 py-3 bg-foreground text-background font-medium rounded-md hover:bg-foreground/90 transition-colors"
            >
                Contacteaza-ne
            </Link>
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
};

export default Faq;