import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

const Asistenta = () => {
  return (
    <>
      <Navbar />
      
      {/* Containerul principal - folosim min-h-screen pentru a nu tăia conținutul pe ecrane mici */}
      <main className="min-h-screen pt-32 pb-16">
        <div className="container-custom max-w-6xl mx-auto px-4">
          
          {/* Titlul paginii */}
          <div className="text-center mb-16">
            <h1 className="font-heading text-4xl font-bold tracking-wide mb-4">Asistență Clienți</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Suntem aici pentru tine. Dacă ai întrebări despre produsele noastre, comenzi sau returnări, nu ezita să ne contactezi folosind formularul de mai jos sau datele de contact directe.
            </p>
          </div>

          {/* Grila principală (Informații stânga, Formular dreapta) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* Secțiunea 1: Informații de contact */}
            <div className="space-y-8">
              <h2 className="text-2xl font-semibold border-b border-border pb-4">Cum ne poți găsi</h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-secondary/50 rounded-full text-foreground">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">Telefon</h3>
                    <p className="text-muted-foreground mt-1">+40 700 000 000</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-secondary/50 rounded-full text-foreground">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">Email</h3>
                    <p className="text-muted-foreground mt-1">contact@jade-intimo.ro</p>
                    <p className="text-sm text-muted-foreground mt-1">Răspundem în maximum 24 de ore lucrătoare.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-secondary/50 rounded-full text-foreground">
                    <Clock size={24} />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">Program de lucru</h3>
                    <p className="text-muted-foreground mt-1">Luni - Vineri: 09:00 - 18:00</p>
                    <p className="text-muted-foreground">Sâmbătă - Duminică: Închis</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-secondary/50 rounded-full text-foreground">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">Adresă Sediu</h3>
                    <p className="text-muted-foreground mt-1">Arad, România</p>
                    <p className="text-sm text-muted-foreground mt-1">(Aceasta este adresa sediului social. Pentru retururi, te rugăm să consulți pagina de Livrare și Retur.)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Secțiunea 2: Formular de contact */}
            <div className="bg-secondary/20 p-8 rounded-lg border border-border">
              <h2 className="text-2xl font-semibold mb-6">Trimite-ne un mesaj</h2>
              <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label htmlFor="nume" className="text-sm font-medium">Nume complet</label>
                    <input 
                      type="text" 
                      id="nume" 
                      className="w-full px-4 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="Ex: Maria Popescu"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="telefon" className="text-sm font-medium">Telefon</label>
                    <input 
                      type="tel" 
                      id="telefon" 
                      className="w-full px-4 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="Ex: 07XX XXX XXX"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">Adresă de email</label>
                  <input 
                    type="email" 
                    id="email" 
                    className="w-full px-4 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="email@exemplu.ro"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="subiect" className="text-sm font-medium">Subiect (Opțional)</label>
                  <input 
                    type="text" 
                    id="subiect" 
                    className="w-full px-4 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Ex: Întrebare comandă #1234"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="mesaj" className="text-sm font-medium">Mesajul tău</label>
                  <textarea 
                    id="mesaj" 
                    rows={4}
                    className="w-full px-4 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                    placeholder="Cu ce te putem ajuta?"
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  className="w-full py-3 px-4 bg-foreground text-background font-medium rounded-md hover:bg-foreground/90 transition-colors"
                >
                  Trimite mesajul
                </button>
              </form>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default Asistenta;