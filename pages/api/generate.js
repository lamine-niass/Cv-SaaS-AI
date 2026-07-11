import { supabase } from '@/lib/supabase';


export default async function handler(req, res) {


  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed'
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



    const prompt = `
Tu es un expert en création de CV professionnels.

Crée un CV moderne et optimisé ATS.

Informations candidat :

Nom : ${firstName} ${lastName}

Email : ${email}

Téléphone : ${phone}

Poste recherché :
${jobTitle}

Expérience :
${experience}

Compétences :
${skills}

Formation :
${education}

Projets :
${projects}

Certifications :
${certifications}

Langues :
${languages}

LinkedIn :
${linkedin}

Retourne uniquement le contenu du CV.
`;



    const aiResponse = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method:"POST",

        headers:{
          "Authorization":
          `Bearer ${process.env.OPENROUTER_API_KEY}`,

          "Content-Type":
          "application/json"
        },

        body:JSON.stringify({

          model:"openrouter/free",

          messages:[
            {
              role:"user",
              content:prompt
            }
          ]

        })
      }
    );



    const aiData =
      await aiResponse.json();



    const cv =
      aiData
      ?.choices?.[0]
      ?.message?.content ||
      "Erreur génération CV";



    const { data:order, error } =
      await supabase
      .from("orders")
      .insert({

        first_name:firstName,
        last_name:lastName,

        name:
        `${firstName} ${lastName}`,

        email,
        phone,

        job_title:jobTitle,

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
        offer_label:offerLabel,
        price,

        ai_cv:cv,

        status:"en attente"

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

      orderId:order.id

    });



  } catch(error){


    console.log(error);


    return res.status(500).json({

      error:"Erreur serveur"

    });


  }


}
