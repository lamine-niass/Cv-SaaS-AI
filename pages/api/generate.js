import { supabase } from '@/lib/supabase';


const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);



export default async function handler(req, res) {

  if(req.method !== 'POST'){
    return res.status(405).json({
      error:'Method not allowed'
    });
  }



  try {

    const data = req.body;



    const {
      firstName,
      lastName,
      email,
      phone,
      jobTitle,

      experience,
      skills,
      education,

      projects,
      certifications,
      languages,
      linkedin,

      transactionNumber,

      offer,
      offerLabel,
      price

    } = data;



    if(
      !firstName ||
      !lastName ||
      !email ||
      !transactionNumber
    ){

      return res.status(400).json({
        error:'Informations manquantes'
      });

    }



    const { data:order, error } =
      await supabase
      .from('orders')
      .insert({

        name:
        `${firstName} ${lastName}`,

        email,

        phone,

        job_title:
        jobTitle,


        experience,

        skills,

        education,

        projects,

        certifications,

        languages,

        linkedin,


        transaction_number:
        transactionNumber,


        offer,

        offer_label:
        offerLabel,


        price,


        status:
        'en attente'


      })
      .select()
      .single();



    if(error){
      console.log(error);

      return res.status(500).json({
        error:error.message
      });

    }



    return res.status(200).json({

      success:true,

      orderId:
      order.id

    });



  }catch(err){

    console.log(err);

    return res.status(500).json({
      error:'Erreur serveur'
    });

  }

}
