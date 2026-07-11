import Head from 'next/head';
import Form from '../components/Form';

export default function Home() {
  return (
    <>
      <Head>
        <title>Générateur de CV IA</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className="container">
        <section className="hero">
          <h1>Créer un CV pro en quelques minutes</h1>
          <p>
            Formulaire simple, paiement manuel Wave / Orange Money, génération IA,
            PDF et envoi par email.
          </p>
        </section>

        <Form />
      </main>
    </>
  );
    }
