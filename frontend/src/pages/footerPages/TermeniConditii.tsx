import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const TermeniConditii = () => {
  return (
    <>
      <Navbar />
      
      <main className="min-h-screen pt-32 pb-16">
        <div className="container-custom max-w-4xl mx-auto px-4">
          
          <div className="mb-12 text-center">
            <h1 className="font-heading text-4xl font-bold tracking-wide mb-4">Termeni și Condiții</h1>
            <p className="text-muted-foreground">Ultima actualizare: Februarie 2026</p>
          </div>

          <div className="space-y-10 text-muted-foreground leading-relaxed">
            
            {/* Secțiunea 1 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">1. Introducere</h2>
              <p>
                Prezentul document (împreună cu toate documentele menționate în acesta) stabilește termenii și condițiile care guvernează utilizarea acestui site web (jade-intimo.ro) și achiziționarea de produse prin intermediul acestuia.
              </p>
              <p>
                Vă rugăm să citiți cu atenție acești Termeni și Condiții înainte de a utiliza site-ul web sau de a plasa o comandă. Prin utilizarea acestui site sau plasarea unei comenzi, sunteți de acord să respectați acești Termeni.
              </p>
            </section>

            {/* Secțiunea 2 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">2. Datele companiei</h2>
              <p>
                Site-ul este operat de [Numele Firmei SRL], cu sediul social în [Adresa Completă, Arad], înregistrată la Registrul Comerțului sub nr. [JXX/XXX/XXXX], CUI [ROXXXXXXX].
              </p>
            </section>

            {/* Secțiunea 3 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">3. Disponibilitatea produselor</h2>
              <p>
                Toate comenzile de produse sunt supuse disponibilității acestora. În cazul în care apar dificultăți de aprovizionare sau dacă produsele nu se mai află în stoc, ne rezervăm dreptul de a vă informa și de a vă oferi opțiuni de produse similare sau de a vă rambursa orice sumă de bani pe care ați plătit-o deja.
              </p>
            </section>

            {/* Secțiunea 4 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">4. Prețuri și Plată</h2>
              <p>
                Prețurile afișate pe site includ TVA, dar nu includ taxele de livrare, care vor fi adăugate la suma totală datorată înainte de finalizarea comenzii. Ne rezervăm dreptul de a modifica prețurile în orice moment, însă modificările nu vor afecta comenzile pentru care am trimis deja o Confirmare a Comenzii.
              </p>
              <p>
                Plata se poate face prin card bancar online (procesat securizat) sau ramburs la primirea coletului.
              </p>
            </section>

            {/* Secțiunea 5 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">5. Politica de Retur și Igienă</h2>
              <p>
                Conform OUG 34/2014, aveți dreptul de a returna produsele în termen de 14 zile calendaristice de la primirea acestora. 
              </p>
              <div className="bg-secondary/30 p-4 border-l-4 border-foreground rounded-r-md mt-4">
                <p className="font-medium text-foreground mb-2">Atenție: Condiții speciale pentru lenjerie intimă</p>
                <p className="text-sm">
                  Din motive de igienă și protecție a sănătății clienților noștri, <strong>chiloții, body-urile și costumele de baie nu pot fi returnate</strong> dacă sigiliul de igienă a fost îndepărtat sau dacă produsele prezintă urme de purtare. Sutienele, pijamalele și îmbrăcămintea de casă pot fi returnate doar dacă au etichetele originale atașate, nu au fost spălate și nu prezintă urme de uzură.
                </p>
              </div>
            </section>

            {/* Secțiunea 6 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">6. Proprietate Intelectuală</h2>
              <p>
                Întregul conținut al site-ului (imagini, texte, elemente de grafică, scripturi, logo-uri) este proprietatea Jade Intimo și este apărat de legea pentru protecția drepturilor de autor. Folosirea fără acordul scris a oricăror elemente enumerate mai sus se pedepsește conform legislației în vigoare.
              </p>
            </section>

            {/* Secțiunea 7 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">7. Soluționarea Litigiilor</h2>
              <p>
                Orice conflict apărut între clienți și companie va fi rezolvat pe cale amiabilă. În cazul în care acest lucru nu este posibil, litigiul va fi soluționat de instanțele judecătorești competente din România. Pentru soluționarea alternativă a litigiilor, puteți accesa platforma SOL a Comisiei Europene sau vă puteți adresa ANPC.
              </p>
            </section>

          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default TermeniConditii;