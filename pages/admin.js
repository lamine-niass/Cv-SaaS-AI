import { useEffect, useState } from "react";


export default function Admin(){

  const [orders,setOrders] = useState([]);
  const [password,setPassword] = useState("");
  const [logged,setLogged] = useState(false);


  async function login(){

    const res = await fetch("/api/admin",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        password
      })
    });


    if(res.ok){
      setLogged(true);
      loadOrders();
    }

  }



  async function loadOrders(){

    const res = await fetch("/api/orders");

    const data = await res.json();

    setOrders(data);

  }



  if(!logged){

    return (

      <div className="card" style={{padding:30}}>

        <h1>
          🔐 Admin
        </h1>

        <input
          className="input"
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
        />


        <button
          className="btn btn-primary"
          onClick={login}
        >
          Connexion
        </button>

      </div>

    );

  }



  return (

    <div style={{padding:30}}>

      <h1>
        📋 Commandes CV
      </h1>

{
orders.map((order)=>(

<div
key={order.id}
className="card"
style={{
padding:20,
marginBottom:15
}}
>

<h3>
{order.name}
</h3>


<p>
📧 {order.email}
</p>


<p>
💳 Transaction :
{order.transaction_number}
</p>


<p>
📦 Offre :
{order.offer_label}
</p>


<p>
📌 Status :
{order.status}
</p>



<button
className="btn btn-primary"
onClick={async()=>{


await fetch("/api/update-order",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

id:order.id,

status:"paiement_validé"

})

});


loadOrders();


}}
>
✅ Valider paiement
</button>



<button
className="btn"
style={{
marginLeft:10
}}

onClick={async()=>{


await fetch("/api/create-pdf",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

id:order.id

})

});


loadOrders();


}}
>
📄 Générer PDF
</button>




<button
className="btn"
style={{
marginLeft:10
}}

onClick={async()=>{


await fetch("/api/send-email",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

id:order.id

})

});


loadOrders();


}}
>
📧 Envoyer CV
</button>



{
order.pdf_url &&

<p>

<a
href={order.pdf_url}
target="_blank"
>
Voir le PDF
</a>

</p>

}


</div>

))
}

</div>
);
}
