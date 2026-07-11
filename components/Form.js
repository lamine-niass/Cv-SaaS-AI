import { useMemo, useState } from 'react';

const offers = [
  {
    id: 'simple',
    label: 'CV Professionnel',
    price: 1500
  },
  {
    id: 'cv_lettre',
    label: 'CV + Lettre de motivation',
    price: 2500
  }
];


const initialState = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',

  jobTitle: '',

  experience: '',
  skills: '',
  education: '',

  projects: '',
  certifications: '',
  languages: '',
  linkedin: '',

  transactionNumber: '',

  offer: 'simple'
};



export default function Form() {

  const [form, setForm] =
    useState(initialState);

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState('');

  const [orderId, setOrderId] =
    useState(null);



  const selectedOffer = useMemo(
    () =>
      offers.find(
        (o) => o.id === form.offer
      ) || offers[0],
    [form.offer]
  );



  function onChange(e) {

    const {
      name,
      value
    } = e.target;


    setForm((prev)=>({
      ...prev,
      [name]: value
    }));

  }



  async function submit(e){

    e.preventDefault();

    setLoading(true);
    setMessage('');
    setOrderId(null);


    try {


      const res =
        await fetch('/api/generate',{
          method:'POST',

          headers:{
            'Content-Type':
              'application/json'
          },

          body:JSON.stringify({

            ...form,

            price:
              selectedOffer.price,

            offerLabel:
              selectedOffer.label

          })

        });



      const data =
        await res.json();



      if(!res.ok){

        throw new Error(
          data.error ||
          'Erreur création commande'
        );

      }



      setOrderId(data.orderId);



      setMessage(
        '✅ Commande reçue. Votre paiement sera vérifié avant l’envoi du CV.'
      );



      setForm(initialState);



    }catch(error){

      setMessage(
        error.message ||
        'Erreur serveur'
      );

    }finally{

      setLoading(false);

    }

  }



return (

<div className="grid two-col">


<form
className="card"
style={{padding:25}}
onSubmit={submit}
>


<h2>
🚀 Créer votre CV professionnel
</h2>


<p className="small">
Votre CV sera généré après validation du paiement.
</p>



<div className="grid form-grid">


<div>
<label className="label">
Prénom
</label>

<input
className="input"
name="firstName"
value={form.firstName}
onChange={onChange}
required
/>
</div>



<div>
<label className="label">
Nom
</label>

<input
className="input"
name="lastName"
value={form.lastName}
onChange={onChange}
required
/>
</div>



<div>
<label className="label">
Email
</label>

<input
className="input"
type="email"
name="email"
value={form.email}
onChange={onChange}
required
/>
</div>



<div>
<label className="label">
Téléphone
</label>

<input
className="input"
name="phone"
value={form.phone}
onChange={onChange}
required
/>
</div>



<div>
<label className="label">
Titre professionnel
</label>

<input
className="input"
name="jobTitle"
value={form.jobTitle}
onChange={onChange}
/>
</div>



<div>
<label className="label">
Offre
</label>


<select
className="select"
name="offer"
value={form.offer}
onChange={onChange}
>

{
offers.map((o)=>(

<option
key={o.id}
value={o.id}
>
{o.label} - {o.price} FCFA
</option>

))
}

</select>

</div>


</div>




<div
style={{
marginTop:20,
padding:16,
background:'#f0fdf4',
borderRadius:16
}}
>


<h3>
💳 Paiement
</h3>


<p>
💙 Wave :
<strong>
+221 71 155 23 55
</strong>
</p>


<p>
🟠 Orange Money :
<strong>
+221 71 155 23 55
</strong>
</p>


<label className="label">
Numéro de transaction
</label>


<input
className="input"
name="transactionNumber"
value={form.transactionNumber}
onChange={onChange}
required
/>


</div>




{[
['experience','Expérience professionnelle'],
['skills','Compétences'],
['education','Formation'],
['projects','Projets'],
['certifications','Certifications'],
['languages','Langues']
].map(([name,label])=>(

<div
key={name}
style={{marginTop:20}}
>

<label className="label">
{label}
</label>

<textarea
className="textarea"
name={name}
value={form[name]}
onChange={onChange}
/>

</div>

))}




<div style={{marginTop:20}}>

<label className="label">
LinkedIn
</label>

<input
className="input"
name="linkedin"
value={form.linkedin}
onChange={onChange}
/>

</div>




<button
className="btn btn-primary"
style={{
marginTop:25,
width:'100%'
}}
disabled={loading}
>

{
loading
?
'⏳ Enregistrement...'
:
'✨ Commander mon CV'
}

</button>



{
message &&
<div
style={{
marginTop:20,
padding:15,
background:'#f3f4f6'
}}
>
{message}
</div>
}



{
orderId &&
<p className="small">
Référence commande : {orderId}
</p>
}



</form>



<aside
className="card"
style={{padding:25}}
>

<h2>
⭐ CV professionnel IA
</h2>


<p>
Création automatique d'un CV moderne.
</p>


<p>
Prix :
<strong>
{selectedOffer.price} FCFA
</strong>
</p>


</aside>



</div>

);

  }
