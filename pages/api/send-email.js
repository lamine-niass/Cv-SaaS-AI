import { Resend } from "resend";
import { supabase } from "@/lib/supabase";


const resend = new Resend(
  process.env.RESEND_API_KEY
);



export default async function handler(req,res){


  if(req.method !== "POST"){

    return res.status(405).json({
      error:"Method not allowed"
    });

  }



  const { id } = req.body;



  if(!id){

    return res.status(400).json({
      error:"ID manquant"
    });

  }



  const { data:order,error } =
    await supabase
    .from("orders")
    .select("*")
    .eq("id",id)
    .single();



  if(error){

    return res.status(500).json({
      error:error.message
    });

  }



  if(!order.pdf_url){

    return res.status(400).json({
      error:"PDF non disponible"
    });

  }



  await resend.emails.send({

    from:
    process.env.RESEND_FROM_EMAIL,


    to:
    order.email,


    subject:
    "Votre CV professionnel est prêt 🚀",


    html:`

    <h2>
    Bonjour ${order.name}
    </h2>


    <p>
    Votre CV professionnel généré par IA est prêt.
    </p>


    <p>
    Vous pouvez le télécharger ici :
    </p>


    <a href="${order.pdf_url}">
    Télécharger mon CV
    </a>


    <br/><br/>


    Merci pour votre confiance.

    `

  });



  await supabase
  .from("orders")
  .update({

    status:
    "envoyé"

  })
  .eq(
    "id",
    id
  );



  return res.status(200).json({

    success:true

  });


}
